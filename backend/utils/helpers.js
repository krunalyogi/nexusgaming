const jwt = require('jsonwebtoken');

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '1h' });
    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' });
    return { accessToken, refreshToken };
};

const generateVerificationToken = () => {
    return require('crypto').randomBytes(32).toString('hex');
};

const slugify = (text) => {
    return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '');
};

const paginate = (query, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    return query.skip(skip).limit(limit);
};

const createChatRoom = (userId1, userId2) => {
    return [userId1, userId2].sort().join('_');
};

module.exports = { generateTokens, generateVerificationToken, slugify, paginate, createChatRoom };
