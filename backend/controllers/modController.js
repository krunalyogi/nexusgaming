const Mod = require('../models/Mod');

// GET /api/mods/game/:gameId
exports.getGameMods = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, category, sort = '-createdAt' } = req.query;
        const filter = { game: req.params.gameId, isApproved: true };
        if (category) filter.category = category;

        const total = await Mod.countDocuments(filter);
        const mods = await Mod.find(filter)
            .populate('uploader', 'username avatar')
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(Number(limit));
        res.json({ mods, total, page: Number(page), totalPages: Math.ceil(total / limit) });
    } catch (error) { next(error); }
};

// POST /api/mods
exports.createMod = async (req, res, next) => {
    try {
        const mod = await Mod.create({ ...req.body, uploader: req.user._id });
        res.status(201).json({ mod });
    } catch (error) { next(error); }
};

// PUT /api/mods/:id
exports.updateMod = async (req, res, next) => {
    try {
        const mod = await Mod.findOneAndUpdate(
            { _id: req.params.id, uploader: req.user._id },
            req.body,
            { new: true }
        );
        if (!mod) return res.status(404).json({ error: 'Mod not found or unauthorized.' });
        res.json({ mod });
    } catch (error) { next(error); }
};

// DELETE /api/mods/:id
exports.deleteMod = async (req, res, next) => {
    try {
        await Mod.findOneAndDelete({ _id: req.params.id, $or: [{ uploader: req.user._id }] });
        res.json({ message: 'Mod deleted.' });
    } catch (error) { next(error); }
};

// POST /api/mods/:id/download
exports.downloadMod = async (req, res, next) => {
    try {
        const mod = await Mod.findById(req.params.id);
        if (!mod) return res.status(404).json({ error: 'Mod not found.' });
        mod.totalDownloads += 1;
        await mod.save();
        res.json({ downloadUrl: mod.downloadUrl });
    } catch (error) { next(error); }
};
