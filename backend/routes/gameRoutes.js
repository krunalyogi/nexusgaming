const router = require('express').Router();
const games = require('../controllers/gameController');
const { auth: protect, adminOnly } = require('../middleware/auth');
const { attachDevAccount } = require('../controllers/developerController');

router.get('/', games.getGames);
router.get('/featured', games.getFeaturedGames);
router.get('/trending', games.getTrendingGames);
router.get('/genres', games.getGenres);
router.get('/:slug', games.getGameBySlug);
router.post('/', protect, attachDevAccount, games.createGame);
router.put('/:id', protect, attachDevAccount, games.updateGame);
router.delete('/:id', protect, adminOnly, games.deleteGame);

module.exports = router;
