const router = require('express').Router();
const reviews = require('../controllers/reviewController');
const { auth: protect } = require('../middleware/auth');

router.get('/game/:gameId', reviews.getGameReviews);
router.post('/', protect, reviews.createReview);
router.put('/:id', protect, reviews.updateReview);
router.post('/:id/like', protect, reviews.likeReview);
router.post('/:id/dislike', protect, reviews.dislikeReview);
router.delete('/:id', protect, reviews.deleteReview);

module.exports = router;
