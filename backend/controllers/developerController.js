const DeveloperAccount = require('../models/DeveloperAccount');
const Game = require('../models/Game');
const Purchase = require('../models/Purchase');
const User = require('../models/User');

// POST /api/developer/register
exports.registerDeveloper = async (req, res, next) => {
    try {
        const { studioName, description, website } = req.body;
        const existing = await DeveloperAccount.findOne({ user: req.user._id });
        if (existing) return res.status(409).json({ error: 'You already have a developer account.' });

        const devAccount = await DeveloperAccount.create({ user: req.user._id, studioName, description, website });
        await User.findByIdAndUpdate(req.user._id, { role: 'developer' });

        res.status(201).json({ developer: devAccount });
    } catch (error) { next(error); }
};

// GET /api/developer/me
exports.getMyDevAccount = async (req, res, next) => {
    try {
        const dev = await DeveloperAccount.findOne({ user: req.user._id }).populate('games');
        if (!dev) return res.status(404).json({ error: 'Developer account not found.' });
        res.json({ developer: dev });
    } catch (error) { next(error); }
};

// GET /api/developer/analytics
exports.getAnalytics = async (req, res, next) => {
    try {
        const dev = await DeveloperAccount.findOne({ user: req.user._id });
        if (!dev) return res.status(404).json({ error: 'Developer account not found.' });

        const games = await Game.find({ developer: dev._id });
        const gameIds = games.map(g => g._id);
        const totalDownloads = games.reduce((sum, g) => sum + g.totalDownloads, 0);
        const totalRevenue = await Purchase.aggregate([
            { $match: { game: { $in: gameIds }, status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$price' } } },
        ]);

        res.json({
            totalGames: games.length,
            totalDownloads,
            totalRevenue: totalRevenue[0]?.total || 0,
            games: games.map(g => ({ title: g.title, downloads: g.totalDownloads, rating: g.averageRating, reviews: g.totalReviews })),
        });
    } catch (error) { next(error); }
};

// PUT /api/developer/update
exports.updateDevAccount = async (req, res, next) => {
    try {
        const dev = await DeveloperAccount.findOneAndUpdate({ user: req.user._id }, req.body, { new: true });
        res.json({ developer: dev });
    } catch (error) { next(error); }
};

// Middleware to attach developer account
exports.attachDevAccount = async (req, res, next) => {
    try {
        const dev = await DeveloperAccount.findOne({ user: req.user._id });
        if (!dev) return res.status(403).json({ error: 'Developer account required.' });
        req.developerAccount = dev;
        next();
    } catch (error) { next(error); }
};
