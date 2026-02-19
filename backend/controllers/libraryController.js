const Purchase = require('../models/Purchase');
const LibraryEntry = require('../models/LibraryEntry');
const Game = require('../models/Game');
const User = require('../models/User');

// GET /api/library
exports.getLibrary = async (req, res, next) => {
    try {
        const entries = await LibraryEntry.find({ user: req.user._id })
            .populate('game', 'title slug coverImage currentVersion genres averageRating')
            .sort('-updatedAt');
        res.json({ library: entries });
    } catch (error) { next(error); }
};

// PUT /api/library/:gameId/playtime
exports.updatePlaytime = async (req, res, next) => {
    try {
        const { minutes } = req.body;
        const entry = await LibraryEntry.findOneAndUpdate(
            { user: req.user._id, game: req.params.gameId },
            { $inc: { playtime: minutes }, lastPlayed: new Date() },
            { new: true }
        );
        await User.findByIdAndUpdate(req.user._id, { $inc: { totalPlaytime: minutes } });
        res.json({ entry });
    } catch (error) { next(error); }
};

// PUT /api/library/:gameId/favorite
exports.toggleFavorite = async (req, res, next) => {
    try {
        const entry = await LibraryEntry.findOne({ user: req.user._id, game: req.params.gameId });
        if (!entry) return res.status(404).json({ error: 'Game not in library.' });
        entry.isFavorite = !entry.isFavorite;
        await entry.save();
        res.json({ entry });
    } catch (error) { next(error); }
};

// POST /api/wishlist/:gameId
exports.addToWishlist = async (req, res, next) => {
    try {
        const game = await Game.findById(req.params.gameId);
        if (!game) return res.status(404).json({ error: 'Game not found.' });

        await User.findByIdAndUpdate(req.user._id, { $addToSet: { wishlist: req.params.gameId } });
        game.totalWishlists += 1;
        await game.save();
        res.json({ message: 'Added to wishlist.' });
    } catch (error) { next(error); }
};

// DELETE /api/wishlist/:gameId
exports.removeFromWishlist = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: req.params.gameId } });
        res.json({ message: 'Removed from wishlist.' });
    } catch (error) { next(error); }
};

// GET /api/wishlist
exports.getWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist', 'title slug coverImage price discountPercent averageRating');
        res.json({ wishlist: user.wishlist });
    } catch (error) { next(error); }
};

// POST /api/purchase
exports.purchaseGame = async (req, res, next) => {
    try {
        const { gameId, paymentId } = req.body;
        const game = await Game.findById(gameId);
        if (!game) return res.status(404).json({ error: 'Game not found.' });

        const existing = await Purchase.findOne({ user: req.user._id, game: gameId, status: 'completed' });
        if (existing) return res.status(409).json({ error: 'You already own this game.' });

        const finalPrice = game.price * (1 - game.discountPercent / 100);
        const purchase = await Purchase.create({
            user: req.user._id, game: gameId, type: 'game',
            price: finalPrice, paymentId: paymentId || 'free',
        });

        // Add to library
        await LibraryEntry.create({ user: req.user._id, game: gameId });

        // Remove from wishlist
        await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: gameId } });

        res.status(201).json({ purchase, message: 'Game purchased! Added to your library.' });
    } catch (error) { next(error); }
};
