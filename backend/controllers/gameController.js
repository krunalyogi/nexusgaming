const Game = require('../models/Game');
const Review = require('../models/Review');
const { slugify } = require('../utils/helpers');

// GET /api/games
exports.getGames = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, genre, tag, search, sort = '-createdAt', minPrice, maxPrice, platform } = req.query;
        const filter = { isPublished: true };

        if (genre) filter.genres = genre;
        if (tag) filter.tags = tag;
        if (platform) filter.platform = platform;
        if (search) filter.$text = { $search: search };
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const total = await Game.countDocuments(filter);
        const games = await Game.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate('developer', 'studioName logo');

        res.json({ games, total, page: Number(page), totalPages: Math.ceil(total / limit) });
    } catch (error) { next(error); }
};

// GET /api/games/featured
exports.getFeaturedGames = async (req, res, next) => {
    try {
        const games = await Game.find({ isFeatured: true, isPublished: true })
            .limit(10)
            .populate('developer', 'studioName');
        res.json({ games });
    } catch (error) { next(error); }
};

// GET /api/games/trending
exports.getTrendingGames = async (req, res, next) => {
    try {
        const games = await Game.find({ isPublished: true })
            .sort('-totalDownloads -averageRating')
            .limit(20)
            .populate('developer', 'studioName');
        res.json({ games });
    } catch (error) { next(error); }
};

// GET /api/games/:slug
exports.getGameBySlug = async (req, res, next) => {
    try {
        const game = await Game.findOne({ slug: req.params.slug, isPublished: true })
            .populate('developer', 'studioName logo website');
        if (!game) return res.status(404).json({ error: 'Game not found.' });
        res.json({ game });
    } catch (error) { next(error); }
};

// POST /api/games (Developer)
exports.createGame = async (req, res, next) => {
    try {
        const { title, description, shortDescription, price, genres, tags, coverImage, screenshots, trailerUrl, downloadUrl, fileSize, platform, minRequirements, recRequirements, ageRating, features, supportedLanguages } = req.body;
        const slug = slugify(title);

        const existingSlug = await Game.findOne({ slug });
        if (existingSlug) return res.status(409).json({ error: 'A game with a similar title already exists.' });

        const game = await Game.create({
            title, slug, description, shortDescription, price: price || 0, genres, tags,
            developer: req.developerAccount._id, publisher: req.developerAccount.studioName,
            coverImage, screenshots, trailerUrl, downloadUrl, fileSize, platform,
            minRequirements, recRequirements, ageRating, features, supportedLanguages,
        });

        req.developerAccount.games.push(game._id);
        await req.developerAccount.save();

        res.status(201).json({ game });
    } catch (error) { next(error); }
};

// PUT /api/games/:id (Developer)
exports.updateGame = async (req, res, next) => {
    try {
        const game = await Game.findOneAndUpdate(
            { _id: req.params.id, developer: req.developerAccount._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!game) return res.status(404).json({ error: 'Game not found or unauthorized.' });
        res.json({ game });
    } catch (error) { next(error); }
};

// DELETE /api/games/:id (Admin)
exports.deleteGame = async (req, res, next) => {
    try {
        const game = await Game.findByIdAndDelete(req.params.id);
        if (!game) return res.status(404).json({ error: 'Game not found.' });
        res.json({ message: 'Game deleted.' });
    } catch (error) { next(error); }
};

// GET /api/games/genres
exports.getGenres = async (req, res) => {
    res.json({ genres: ['action', 'adventure', 'rpg', 'strategy', 'simulation', 'sports', 'racing', 'puzzle', 'horror', 'fps', 'mmo', 'indie', 'casual', 'fighting', 'platformer', 'sandbox', 'battle-royale', 'survival'] });
};
