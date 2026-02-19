const router = require('express').Router();
const dev = require('../controllers/developerController');
const games = require('../controllers/gameController');
const { auth: protect, developerOnly } = require('../middleware/auth');

router.post('/register', protect, dev.registerDeveloper);
router.get('/me', protect, dev.getMyDevAccount);
router.get('/analytics', protect, developerOnly, dev.getAnalytics);
router.put('/update', protect, developerOnly, dev.updateDevAccount);
router.post('/games', protect, dev.attachDevAccount, games.createGame);
router.put('/games/:id', protect, dev.attachDevAccount, games.updateGame);

module.exports = router;
