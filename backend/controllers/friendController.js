const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');
const Notification = require('../models/Notification');

// POST /api/friends/request
exports.sendRequest = async (req, res, next) => {
    try {
        const { userId } = req.body;
        if (userId === req.user._id.toString()) return res.status(400).json({ error: 'Cannot send request to yourself.' });

        const target = await User.findById(userId);
        if (!target) return res.status(404).json({ error: 'User not found.' });

        const existing = await FriendRequest.findOne({
            $or: [
                { sender: req.user._id, receiver: userId },
                { sender: userId, receiver: req.user._id },
            ],
        });
        if (existing) return res.status(409).json({ error: 'Friend request already exists.', status: existing.status });

        const request = await FriendRequest.create({ sender: req.user._id, receiver: userId });
        await Notification.create({
            user: userId, type: 'friend_request', title: 'New Friend Request',
            message: `${req.user.username} sent you a friend request!`,
            data: { requestId: request._id, senderId: req.user._id },
        });
        res.status(201).json({ request });
    } catch (error) { next(error); }
};

// PUT /api/friends/accept/:requestId
exports.acceptRequest = async (req, res, next) => {
    try {
        const request = await FriendRequest.findOneAndUpdate(
            { _id: req.params.requestId, receiver: req.user._id, status: 'pending' },
            { status: 'accepted' },
            { new: true }
        );
        if (!request) return res.status(404).json({ error: 'Request not found.' });
        res.json({ request, message: 'Friend request accepted!' });
    } catch (error) { next(error); }
};

// PUT /api/friends/decline/:requestId
exports.declineRequest = async (req, res, next) => {
    try {
        const request = await FriendRequest.findOneAndUpdate(
            { _id: req.params.requestId, receiver: req.user._id, status: 'pending' },
            { status: 'declined' },
            { new: true }
        );
        if (!request) return res.status(404).json({ error: 'Request not found.' });
        res.json({ request, message: 'Friend request declined.' });
    } catch (error) { next(error); }
};

// PUT /api/friends/block/:userId
exports.blockUser = async (req, res, next) => {
    try {
        await FriendRequest.findOneAndUpdate(
            {
                $or: [
                    { sender: req.user._id, receiver: req.params.userId },
                    { sender: req.params.userId, receiver: req.user._id },
                ]
            },
            { status: 'blocked' },
            { upsert: true, new: true }
        );
        await User.findByIdAndUpdate(req.user._id, { $addToSet: { blockedUsers: req.params.userId } });
        res.json({ message: 'User blocked.' });
    } catch (error) { next(error); }
};

// DELETE /api/friends/:userId
exports.unfriend = async (req, res, next) => {
    try {
        await FriendRequest.findOneAndDelete({
            $or: [
                { sender: req.user._id, receiver: req.params.userId, status: 'accepted' },
                { sender: req.params.userId, receiver: req.user._id, status: 'accepted' },
            ],
        });
        res.json({ message: 'Unfriended.' });
    } catch (error) { next(error); }
};

// GET /api/friends
exports.getFriends = async (req, res, next) => {
    try {
        const friends = await FriendRequest.find({
            $or: [{ sender: req.user._id }, { receiver: req.user._id }],
            status: 'accepted',
        }).populate('sender', 'username avatar status currentGame').populate('receiver', 'username avatar status currentGame');

        const friendList = friends.map(f => {
            const friend = f.sender._id.toString() === req.user._id.toString() ? f.receiver : f.sender;
            return friend;
        });
        res.json({ friends: friendList });
    } catch (error) { next(error); }
};

// GET /api/friends/requests
exports.getPendingRequests = async (req, res, next) => {
    try {
        const requests = await FriendRequest.find({ receiver: req.user._id, status: 'pending' })
            .populate('sender', 'username avatar');
        res.json({ requests });
    } catch (error) { next(error); }
};

// GET /api/friends/search?q=username
exports.searchUsers = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) return res.json({ users: [] });
        const users = await User.find({ username: { $regex: q, $options: 'i' }, _id: { $ne: req.user._id } })
            .select('username avatar status steamLevel')
            .limit(20);
        res.json({ users });
    } catch (error) { next(error); }
};
