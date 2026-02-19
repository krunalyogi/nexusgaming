const Notification = require('../models/Notification');

// GET /api/notifications
exports.getNotifications = async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const total = await Notification.countDocuments({ user: req.user._id });
        const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });
        const notifications = await Notification.find({ user: req.user._id })
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(Number(limit));
        res.json({ notifications, total, unreadCount, page: Number(page) });
    } catch (error) { next(error); }
};

// PUT /api/notifications/:id/read
exports.markAsRead = async (req, res, next) => {
    try {
        await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { read: true });
        res.json({ message: 'Notification marked as read.' });
    } catch (error) { next(error); }
};

// PUT /api/notifications/read-all
exports.markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
        res.json({ message: 'All notifications marked as read.' });
    } catch (error) { next(error); }
};

// DELETE /api/notifications/:id
exports.deleteNotification = async (req, res, next) => {
    try {
        await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        res.json({ message: 'Notification deleted.' });
    } catch (error) { next(error); }
};
