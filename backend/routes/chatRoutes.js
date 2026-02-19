const router = require('express').Router();
const chat = require('../controllers/chatController');
const { auth: protect } = require('../middleware/auth');

router.get('/conversations', protect, chat.getConversations);
router.get('/:userId', protect, chat.getChatHistory);
router.post('/send', protect, chat.sendMessage);
router.put('/read/:roomId', protect, chat.markAsRead);

module.exports = router;
