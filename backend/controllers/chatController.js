const ChatMessage = require('../models/ChatMessage');
const { createChatRoom } = require('../utils/helpers');

// GET /api/chat/:userId
exports.getChatHistory = async (req, res, next) => {
    try {
        const room = createChatRoom(req.user._id.toString(), req.params.userId);
        const { page = 1, limit = 50 } = req.query;
        const total = await ChatMessage.countDocuments({ room, isDeleted: false });
        const messages = await ChatMessage.find({ room, isDeleted: false })
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate('sender', 'username avatar');
        res.json({ messages: messages.reverse(), total, page: Number(page) });
    } catch (error) { next(error); }
};

// POST /api/chat/send
exports.sendMessage = async (req, res, next) => {
    try {
        const { receiverId, content, type = 'text' } = req.body;
        const room = createChatRoom(req.user._id.toString(), receiverId);
        const message = await ChatMessage.create({ sender: req.user._id, receiver: receiverId, room, content, type });
        const populated = await message.populate('sender', 'username avatar');

        // Emit via Socket.io if available
        const io = req.app.get('io');
        if (io) {
            io.to(room).emit('new_message', populated);
            io.to(`user_${receiverId}`).emit('notification', {
                type: 'chat', title: 'New Message',
                message: `${req.user.username}: ${content.substring(0, 50)}`,
            });
        }

        res.status(201).json({ message: populated });
    } catch (error) { next(error); }
};

// PUT /api/chat/read/:roomId
exports.markAsRead = async (req, res, next) => {
    try {
        await ChatMessage.updateMany(
            { room: req.params.roomId, receiver: req.user._id, readAt: null },
            { readAt: new Date() }
        );
        res.json({ message: 'Messages marked as read.' });
    } catch (error) { next(error); }
};

// GET /api/chat/conversations
exports.getConversations = async (req, res, next) => {
    try {
        const messages = await ChatMessage.aggregate([
            { $match: { $or: [{ sender: req.user._id }, { receiver: req.user._id }], isDeleted: false } },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: '$room', lastMessage: { $first: '$$ROOT' }, unreadCount: {
                        $sum: { $cond: [{ $and: [{ $eq: ['$receiver', req.user._id] }, { $eq: ['$readAt', null] }] }, 1, 0] }
                    }
                }
            },
            { $sort: { 'lastMessage.createdAt': -1 } },
        ]);
        res.json({ conversations: messages });
    } catch (error) { next(error); }
};
