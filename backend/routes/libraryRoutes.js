const router = require('express').Router();
const lib = require('../controllers/libraryController');
const { auth: protect } = require('../middleware/auth');

router.get('/library', protect, lib.getLibrary);
router.put('/library/:gameId/playtime', protect, lib.updatePlaytime);
router.put('/library/:gameId/favorite', protect, lib.toggleFavorite);
router.get('/wishlist', protect, lib.getWishlist);
router.post('/wishlist/:gameId', protect, lib.addToWishlist);
router.delete('/wishlist/:gameId', protect, lib.removeFromWishlist);
router.post('/purchase', protect, lib.purchaseGame);

module.exports = router;
