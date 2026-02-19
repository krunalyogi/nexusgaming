const router = require('express').Router();
const achievements = require('../controllers/achievementController');
const { auth: protect, optionalAuth } = require('../middleware/auth');

router.get('/game/:gameId', optionalAuth, achievements.getGameAchievements);
router.get('/user', protect, achievements.getUserAchievements);
router.post('/unlock', protect, achievements.unlockAchievement);
router.post('/', protect, achievements.createAchievement);

module.exports = router;
