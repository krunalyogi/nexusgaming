const jwt = require('jsonwebtoken');
const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');
const { createChatRoom } = require('../utils/helpers');

module.exports = (io) => {
    // Auth middleware for Socket.io
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) return next(new Error('Authentication required'));
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('username avatar status');
            if (!user) return next(new Error('User not found'));
            socket.user = user;
            next();
        } catch (err) {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`🟢 ${socket.user.username} connected`);

        // Join personal room for notifications
        socket.join(`user_${socket.user._id}`);

        // Update user status
        User.findByIdAndUpdate(socket.user._id, { status: 'online' }).exec();

        // Notify friends
        socket.broadcast.emit('user_status', { userId: socket.user._id, status: 'online' });

        // Join a chat room
        socket.on('join_room', (data) => {
            const room = createChatRoom(socket.user._id.toString(), data.userId);
            socket.join(room);
            socket.emit('joined_room', { room });
        });

        // Send message
        socket.on('send_message', async (data) => {
            try {
                const room = createChatRoom(socket.user._id.toString(), data.receiverId);
                const message = await ChatMessage.create({
                    sender: socket.user._id, receiver: data.receiverId,
                    room, content: data.content, type: data.type || 'text',
                });
                const populated = await message.populate('sender', 'username avatar');
                io.to(room).emit('new_message', populated);
                io.to(`user_${data.receiverId}`).emit('notification', {
                    type: 'chat', title: 'New Message',
                    message: `${socket.user.username}: ${data.content.substring(0, 50)}`,
                });
            } catch (err) {
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Typing indicator
        socket.on('typing', (data) => {
            const room = createChatRoom(socket.user._id.toString(), data.receiverId);
            socket.to(room).emit('user_typing', { userId: socket.user._id, username: socket.user.username });
        });

        socket.on('stop_typing', (data) => {
            const room = createChatRoom(socket.user._id.toString(), data.receiverId);
            socket.to(room).emit('user_stop_typing', { userId: socket.user._id });
        });

        // Update game status
        socket.on('playing_game', (data) => {
            User.findByIdAndUpdate(socket.user._id, { status: 'in-game', currentGame: data.gameName }).exec();
            socket.broadcast.emit('user_status', { userId: socket.user._id, status: 'in-game', currentGame: data.gameName });
        });

        // Disconnect
        socket.on('disconnect', () => {
            console.log(`🔴 ${socket.user.username} disconnected`);
            User.findByIdAndUpdate(socket.user._id, { status: 'offline', lastOnline: new Date(), currentGame: '' }).exec();
            socket.broadcast.emit('user_status', { userId: socket.user._id, status: 'offline' });
        });
    });
};
