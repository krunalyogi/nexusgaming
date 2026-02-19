const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 500 },
    role: { type: String, enum: ['user', 'developer', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    refreshToken: String,
    status: { type: String, enum: ['online', 'offline', 'away', 'in-game'], default: 'offline' },
    currentGame: { type: String, default: '' },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    profileVisibility: { type: String, enum: ['public', 'friends', 'private'], default: 'public' },
    country: { type: String, default: '' },
    steamLevel: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    totalPlaytime: { type: Number, default: 0 },
    lastOnline: Date,
    isBanned: { type: Boolean, default: false },
    banReason: String,
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) return next();
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.methods.toPublicProfile = function () {
    return {
        _id: this._id,
        username: this.username,
        email: this.email,
        avatar: this.avatar,
        bio: this.bio,
        role: this.role,
        status: this.status,
        currentGame: this.currentGame,
        country: this.country,
        steamLevel: this.steamLevel,
        xp: this.xp,
        totalPlaytime: this.totalPlaytime,
        lastOnline: this.lastOnline,
        isBanned: this.isBanned,
        createdAt: this.createdAt,
    };
};

module.exports = mongoose.model('User', userSchema);
