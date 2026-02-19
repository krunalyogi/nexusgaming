const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { generateTokens, generateVerificationToken } = require('../utils/helpers');
const { sendVerificationEmail } = require('../services/emailService');

// POST /api/auth/register
exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) return res.status(400).json({ error: 'All fields are required.' });
        if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });

        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing) return res.status(409).json({ error: 'User already exists with that email or username.' });

        const verificationToken = generateVerificationToken();
        const user = await User.create({ username, email, passwordHash: password, verificationToken });
        const { accessToken, refreshToken } = generateTokens(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({
            message: 'Account created! Check your email to verify.',
            user: user.toPublicProfile(),
            accessToken,
            refreshToken,
        });
    } catch (error) { next(error); }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials.' });
        if (user.isBanned) return res.status(403).json({ error: 'Account is banned.', reason: user.banReason });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials.' });

        const { accessToken, refreshToken } = generateTokens(user._id);
        user.refreshToken = refreshToken;
        user.status = 'online';
        user.lastOnline = new Date();
        await user.save();

        res.json({ user: user.toPublicProfile(), accessToken, refreshToken });
    } catch (error) { next(error); }
};

// POST /api/auth/refresh
exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ error: 'Refresh token required.' });

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) return res.status(401).json({ error: 'Invalid refresh token.' });

        const tokens = generateTokens(user._id);
        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.json(tokens);
    } catch (error) {
        res.status(401).json({ error: 'Invalid refresh token.' });
    }
};

// GET /api/auth/verify-email?token=xxx
exports.verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.query;
        const user = await User.findOne({ verificationToken: token });
        if (!user) return res.status(400).json({ error: 'Invalid verification token.' });

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.json({ message: 'Email verified successfully!' });
    } catch (error) { next(error); }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
    res.json({ user: req.user.toPublicProfile() });
};

// PUT /api/auth/profile
exports.updateProfile = async (req, res, next) => {
    try {
        const { bio, avatar, country, profileVisibility } = req.body;
        const updates = {};
        if (bio !== undefined) updates.bio = bio;
        if (avatar !== undefined) updates.avatar = avatar;
        if (country !== undefined) updates.country = country;
        if (profileVisibility !== undefined) updates.profileVisibility = profileVisibility;

        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
        res.json({ user: user.toPublicProfile() });
    } catch (error) { next(error); }
};

// POST /api/auth/logout
exports.logout = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { refreshToken: null, status: 'offline', lastOnline: new Date() });
        res.json({ message: 'Logged out successfully.' });
    } catch (error) { next(error); }
};
