const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-passwordHash -refreshToken -verificationToken');
        if (!user) return res.status(401).json({ error: 'Invalid token. User not found.' });
        if (user.isBanned) return res.status(403).json({ error: 'Account is banned.', reason: user.banReason });

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
        }
        res.status(401).json({ error: 'Invalid token.' });
    }
};

const optionalAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-passwordHash -refreshToken -verificationToken');
        }
    } catch (_) { }
    next();
};

const adminOnly = (req, res, next) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required.' });
    next();
};

const developerOnly = (req, res, next) => {
    if (!['developer', 'admin'].includes(req.user?.role)) return res.status(403).json({ error: 'Developer access required.' });
    next();
};

module.exports = { auth, optionalAuth, adminOnly, developerOnly };
