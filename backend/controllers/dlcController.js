const DLC = require('../models/DLC');
const Purchase = require('../models/Purchase');

// GET /api/dlc/game/:gameId
exports.getGameDLCs = async (req, res, next) => {
    try {
        const dlcs = await DLC.find({ game: req.params.gameId, isPublished: true });
        res.json({ dlcs });
    } catch (error) { next(error); }
};

// POST /api/dlc (Developer)
exports.createDLC = async (req, res, next) => {
    try {
        const dlc = await DLC.create(req.body);
        res.status(201).json({ dlc });
    } catch (error) { next(error); }
};

// PUT /api/dlc/:id (Developer)
exports.updateDLC = async (req, res, next) => {
    try {
        const dlc = await DLC.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!dlc) return res.status(404).json({ error: 'DLC not found.' });
        res.json({ dlc });
    } catch (error) { next(error); }
};

// POST /api/dlc/:id/purchase
exports.purchaseDLC = async (req, res, next) => {
    try {
        const dlc = await DLC.findById(req.params.id);
        if (!dlc) return res.status(404).json({ error: 'DLC not found.' });

        const existing = await Purchase.findOne({ user: req.user._id, dlc: dlc._id, status: 'completed' });
        if (existing) return res.status(409).json({ error: 'You already own this DLC.' });

        const purchase = await Purchase.create({
            user: req.user._id, dlc: dlc._id, game: dlc.game, type: 'dlc',
            price: dlc.price, paymentId: req.body.paymentId || 'free',
        });
        res.status(201).json({ purchase, downloadUrl: dlc.downloadUrl });
    } catch (error) { next(error); }
};

// GET /api/dlc/:id/download
exports.downloadDLC = async (req, res, next) => {
    try {
        const dlc = await DLC.findById(req.params.id);
        if (!dlc) return res.status(404).json({ error: 'DLC not found.' });

        if (dlc.price > 0) {
            const purchase = await Purchase.findOne({ user: req.user._id, dlc: dlc._id, status: 'completed' });
            if (!purchase) return res.status(403).json({ error: 'You do not own this DLC.' });
        }
        res.json({ downloadUrl: dlc.downloadUrl });
    } catch (error) { next(error); }
};
