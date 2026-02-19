const Purchase = require('../models/Purchase');
const LibraryEntry = require('../models/LibraryEntry');
const Game = require('../models/Game');
const GameVersion = require('../models/GameVersion');

// GET /api/download/:gameId
exports.getDownloadLink = async (req, res, next) => {
    try {
        const { gameId } = req.params;
        const game = await Game.findById(gameId);
        if (!game) return res.status(404).json({ error: 'Game not found.' });

        // Check if free game or user owns it
        if (game.price > 0) {
            const purchase = await Purchase.findOne({ user: req.user._id, game: gameId, status: 'completed' });
            if (!purchase) return res.status(403).json({ error: 'You do not own this game.' });
        }

        // Add to library if not already there
        await LibraryEntry.findOneAndUpdate(
            { user: req.user._id, game: gameId },
            { user: req.user._id, game: gameId },
            { upsert: true, new: true }
        );

        game.totalDownloads += 1;
        await game.save();

        res.json({ downloadUrl: game.downloadUrl, version: game.currentVersion, fileSize: game.fileSize });
    } catch (error) { next(error); }
};

// GET /api/download/:gameId/check-update
exports.checkUpdate = async (req, res, next) => {
    try {
        const { gameId } = req.params;
        const { currentVersion } = req.query;
        const game = await Game.findById(gameId);
        if (!game) return res.status(404).json({ error: 'Game not found.' });

        const hasUpdate = currentVersion !== game.currentVersion;
        const latestVersion = await GameVersion.findOne({ game: gameId, isStable: true }).sort('-createdAt');

        res.json({
            hasUpdate,
            currentVersion: game.currentVersion,
            latestVersion: latestVersion || null,
        });
    } catch (error) { next(error); }
};

// POST /api/download/:gameId/version (Developer)
exports.publishVersion = async (req, res, next) => {
    try {
        const { version, changelog, downloadUrl, fileSize, isStable, isMandatory } = req.body;
        const gameVersion = await GameVersion.create({
            game: req.params.gameId, version, changelog, downloadUrl, fileSize, isStable, isMandatory,
        });

        if (isStable) {
            await Game.findByIdAndUpdate(req.params.gameId, { currentVersion: version, downloadUrl });
        }

        res.status(201).json({ gameVersion });
    } catch (error) { next(error); }
};

// GET /api/download/:gameId/versions
exports.getVersions = async (req, res, next) => {
    try {
        const versions = await GameVersion.find({ game: req.params.gameId }).sort('-createdAt');
        res.json({ versions });
    } catch (error) { next(error); }
};
