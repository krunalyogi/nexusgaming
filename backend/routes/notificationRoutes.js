const router = require('express').Router();
const notif = require('../controllers/notificationController');
const { auth: protect } = require('../middleware/auth');

router.get('/', protect, notif.getNotifications);
router.put('/:id/read', protect, notif.markAsRead);
router.put('/read-all', protect, notif.markAllAsRead);
router.delete('/:id', protect, notif.deleteNotification);

module.exports = router;
