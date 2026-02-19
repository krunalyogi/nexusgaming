const User = require('../models/User');
const Game = require('../models/Game');
const Purchase = require('../models/Purchase');
const Review = require('../models/Review');
const Mod = require('../models/Mod');
const DeveloperAccount = require('../models/DeveloperAccount');
const { slugify } = require('../utils/helpers');

// GET /api/admin/stats
exports.getDashboardStats = async (req, res, next) => {
    try {
        const [totalUsers, totalGames, totalReviews, totalPurchases, totalMods] = await Promise.all([
            User.countDocuments(),
            Game.countDocuments(),
            Review.countDocuments(),
            Purchase.countDocuments({ status: 'completed' }),
            Mod.countDocuments(),
        ]);

        const revenue = await Purchase.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$price' } } },
        ]);

        const recentUsers = await User.find().sort('-createdAt').limit(5).select('username email createdAt');
        const recentGames = await Game.find().sort('-createdAt').limit(5).select('title createdAt');

        res.json({
            stats: { totalUsers, totalGames, totalReviews, totalPurchases, totalMods, totalRevenue: revenue[0]?.total || 0 },
            recentUsers,
            recentGames,
        });
    } catch (error) { next(error); }
};

// PUT /api/admin/ban/:userId
exports.banUser = async (req, res, next) => {
    try {
        const { reason } = req.body;
        const user = await User.findByIdAndUpdate(req.params.userId, { isBanned: true, banReason: reason || 'Violation of terms' }, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found.' });
        res.json({ message: `User ${user.username} has been banned.`, user: user.toPublicProfile() });
    } catch (error) { next(error); }
};

// PUT /api/admin/unban/:userId
exports.unbanUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, { isBanned: false, banReason: '' }, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found.' });
        res.json({ message: `User ${user.username} has been unbanned.` });
    } catch (error) { next(error); }
};

// GET /api/admin/users
exports.getUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 25, search } = req.query;
        const filter = {};
        if (search) filter.username = { $regex: search, $options: 'i' };
        const total = await User.countDocuments(filter);
        const users = await User.find(filter).select('-passwordHash -refreshToken').sort('-createdAt')
            .skip((page - 1) * limit).limit(Number(limit));
        res.json({ users, total, page: Number(page), totalPages: Math.ceil(total / limit) });
    } catch (error) { next(error); }
};

// DELETE /api/admin/games/:id
exports.removeGame = async (req, res, next) => {
    try {
        await Game.findByIdAndDelete(req.params.id);
        res.json({ message: 'Game removed.' });
    } catch (error) { next(error); }
};

// PUT /api/admin/games/:id/feature
exports.toggleFeature = async (req, res, next) => {
    try {
        const game = await Game.findById(req.params.id);
        game.isFeatured = !game.isFeatured;
        await game.save();
        res.json({ message: `Game ${game.isFeatured ? 'featured' : 'unfeatured'}.`, game });
    } catch (error) { next(error); }
};

// PUT /api/admin/mods/:id/approve
exports.approveMod = async (req, res, next) => {
    try {
        const mod = await Mod.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
        res.json({ message: 'Mod approved.', mod });
    } catch (error) { next(error); }
};

// POST /api/admin/games  – Admin adds a game directly (no dev account required)
exports.addGame = async (req, res, next) => {
    try {
        const { title, description, shortDescription, price, genres, tags, coverImage, screenshots,
            trailerUrl, downloadUrl, fileSize, platform, ageRating, features, isFeatured, isEarlyAccess } = req.body;

        if (!title || !description || !coverImage || !downloadUrl) {
            return res.status(400).json({ error: 'Title, description, coverImage and downloadUrl are required.' });
        }

        const slug = slugify(title);
        const existing = await Game.findOne({ slug });
        if (existing) return res.status(409).json({ error: 'A game with a similar title already exists.' });

        // Find or create a developer account for admin
        let devAccount = await DeveloperAccount.findOne({ user: req.user._id });
        if (!devAccount) {
            devAccount = await DeveloperAccount.create({
                user: req.user._id,
                studioName: 'Nexus Admin Studio',
                description: 'Official Nexus Gaming Platform games',
                verified: true,
            });
        }

        const game = await Game.create({
            title, slug, description, shortDescription, price: price || 0,
            genres: genres || [], tags: tags || [],
            developer: devAccount._id, publisher: devAccount.studioName,
            coverImage, screenshots: screenshots || [], trailerUrl, downloadUrl,
            fileSize: fileSize || '0 MB', platform: platform || ['windows'],
            ageRating: ageRating || 'T', features: features || [],
            isFeatured: isFeatured || false, isEarlyAccess: isEarlyAccess || false,
            isPublished: true,
        });

        devAccount.games.push(game._id);
        await devAccount.save();

        res.status(201).json({ game });
    } catch (error) { next(error); }
};

