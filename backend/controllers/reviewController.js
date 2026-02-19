const Review = require('../models/Review');
const Game = require('../models/Game');

// GET /api/reviews/game/:gameId
exports.getGameReviews = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
        const total = await Review.countDocuments({ game: req.params.gameId });
        const reviews = await Review.find({ game: req.params.gameId })
            .populate('user', 'username avatar')
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(Number(limit));
        res.json({ reviews, total, page: Number(page), totalPages: Math.ceil(total / limit) });
    } catch (error) { next(error); }
};

// POST /api/reviews
exports.createReview = async (req, res, next) => {
    try {
        const { gameId, rating, title, content, isRecommended } = req.body;
        const review = await Review.create({ game: gameId, user: req.user._id, rating, title, content, isRecommended, playtime: 0 });

        // Update game average rating
        const stats = await Review.aggregate([
            { $match: { game: review.game } },
            { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
        ]);
        if (stats.length) {
            await Game.findByIdAndUpdate(gameId, { averageRating: Math.round(stats[0].avgRating * 10) / 10, totalReviews: stats[0].count });
        }

        res.status(201).json({ review });
    } catch (error) { next(error); }
};

// PUT /api/reviews/:id
exports.updateReview = async (req, res, next) => {
    try {
        const review = await Review.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { ...req.body, isEdited: true },
            { new: true }
        );
        if (!review) return res.status(404).json({ error: 'Review not found.' });
        res.json({ review });
    } catch (error) { next(error); }
};

// POST /api/reviews/:id/like
exports.likeReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ error: 'Review not found.' });

        review.dislikes = review.dislikes.filter(id => id.toString() !== req.user._id.toString());
        if (!review.likes.includes(req.user._id)) { review.likes.push(req.user._id); }
        else { review.likes = review.likes.filter(id => id.toString() !== req.user._id.toString()); }
        await review.save();
        res.json({ likes: review.likes.length, dislikes: review.dislikes.length });
    } catch (error) { next(error); }
};

// POST /api/reviews/:id/dislike
exports.dislikeReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ error: 'Review not found.' });

        review.likes = review.likes.filter(id => id.toString() !== req.user._id.toString());
        if (!review.dislikes.includes(req.user._id)) { review.dislikes.push(req.user._id); }
        else { review.dislikes = review.dislikes.filter(id => id.toString() !== req.user._id.toString()); }
        await review.save();
        res.json({ likes: review.likes.length, dislikes: review.dislikes.length });
    } catch (error) { next(error); }
};

// DELETE /api/reviews/:id
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findOneAndDelete({ _id: req.params.id, $or: [{ user: req.user._id }, {}] });
        if (!review) return res.status(404).json({ error: 'Review not found.' });
        res.json({ message: 'Review deleted.' });
    } catch (error) { next(error); }
};
