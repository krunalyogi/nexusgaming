const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: '🏆' },
    points: { type: Number, default: 10, min: 0 },
    rarity: { type: String, enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'], default: 'common' },
    isHidden: { type: Boolean, default: false },
}, { timestamps: true });

const userAchievementSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    achievement: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement', required: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    unlockedAt: { type: Date, default: Date.now },
}, { timestamps: true });

userAchievementSchema.index({ user: 1, achievement: 1 }, { unique: true });

const Achievement = mongoose.model('Achievement', achievementSchema);
const UserAchievement = mongoose.model('UserAchievement', userAchievementSchema);

module.exports = { Achievement, UserAchievement };
