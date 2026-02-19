const { Achievement, UserAchievement } = require('../models/Achievement');
const Notification = require('../models/Notification');

// GET /api/achievements/game/:gameId
exports.getGameAchievements = async (req, res, next) => {
    try {
        const achievements = await Achievement.find({ game: req.params.gameId });
        let userAchievements = [];
        if (req.user) {
            userAchievements = await UserAchievement.find({ user: req.user._id, game: req.params.gameId });
        }
        const unlocked = new Set(userAchievements.map(ua => ua.achievement.toString()));
        const result = achievements.map(a => ({ ...a.toObject(), unlocked: unlocked.has(a._id.toString()) }));
        res.json({ achievements: result });
    } catch (error) { next(error); }
};

// POST /api/achievements/unlock
exports.unlockAchievement = async (req, res, next) => {
    try {
        const { achievementId } = req.body;
        const achievement = await Achievement.findById(achievementId);
        if (!achievement) return res.status(404).json({ error: 'Achievement not found.' });

        const existing = await UserAchievement.findOne({ user: req.user._id, achievement: achievementId });
        if (existing) return res.status(409).json({ error: 'Achievement already unlocked.' });

        const ua = await UserAchievement.create({ user: req.user._id, achievement: achievementId, game: achievement.game });

        await Notification.create({
            user: req.user._id,
            type: 'achievement',
            title: 'Achievement Unlocked!',
            message: `You unlocked "${achievement.title}" (${achievement.points} pts)`,
            data: { achievementId, gameId: achievement.game },
        });

        res.status(201).json({ userAchievement: ua, achievement });
    } catch (error) { next(error); }
};

// GET /api/achievements/user
exports.getUserAchievements = async (req, res, next) => {
    try {
        const userAchievements = await UserAchievement.find({ user: req.user._id })
            .populate('achievement')
            .populate('game', 'title coverImage slug')
            .sort('-unlockedAt');
        const totalPoints = userAchievements.reduce((sum, ua) => sum + (ua.achievement?.points || 0), 0);
        res.json({ achievements: userAchievements, totalPoints });
    } catch (error) { next(error); }
};

// POST /api/achievements (Developer/Admin)
exports.createAchievement = async (req, res, next) => {
    try {
        const achievement = await Achievement.create(req.body);
        res.status(201).json({ achievement });
    } catch (error) { next(error); }
};
