const router = require('express').Router();
const ai = require('../controllers/aiController');
const { auth: protect } = require('../middleware/auth');

router.post('/recommend', protect, ai.getRecommendations);
router.post('/chatbot', protect, ai.chatbot);
router.post('/analyze-screenshot', protect, ai.analyzeScreenshot);

module.exports = router;
