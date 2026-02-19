const Game = require('../models/Game');
const Purchase = require('../models/Purchase');
const Review = require('../models/Review');
const LibraryEntry = require('../models/LibraryEntry');

// POST /api/ai/recommend
exports.getRecommendations = async (req, res, next) => {
    try {
        // Get user's owned games and their genres
        const library = await LibraryEntry.find({ user: req.user._id }).populate('game', 'genres tags');
        const ownedGameIds = library.map(l => l.game._id);

        // Gather preferred genres from owned games
        const genreCount = {};
        library.forEach(entry => {
            if (entry.game?.genres) {
                entry.game.genres.forEach(g => { genreCount[g] = (genreCount[g] || 0) + 1; });
            }
        });

        // Sort genres by preference
        const topGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);

        // Find games matching top genres that user doesn't own
        let recommended = [];
        if (topGenres.length > 0) {
            recommended = await Game.find({
                _id: { $nin: ownedGameIds },
                genres: { $in: topGenres },
                isPublished: true,
            }).sort('-averageRating -totalDownloads').limit(20).populate('developer', 'studioName');
        }

        // If not enough, fill with trending games
        if (recommended.length < 10) {
            const trending = await Game.find({
                _id: { $nin: [...ownedGameIds, ...recommended.map(r => r._id)] },
                isPublished: true,
            }).sort('-totalDownloads').limit(10 - recommended.length);
            recommended = [...recommended, ...trending];
        }

        res.json({
            recommendations: recommended,
            basedOn: topGenres,
            message: topGenres.length ? `Based on your interest in ${topGenres.join(', ')}` : 'Trending games for you',
        });
    } catch (error) { next(error); }
};

// POST /api/ai/chatbot
exports.chatbot = async (req, res, next) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Message required' });

        const msg = message.toLowerCase();
        let response = '';

        // Knowledge-based responses
        if (msg.includes('recommend') || msg.includes('suggest') || msg.includes('play what')) {
            const trending = await Game.find({ isPublished: true }).sort('-averageRating').limit(5);
            response = `Here are some top-rated games I recommend:\\n${trending.map((g, i) => `${i + 1}. **${g.title}** (⭐ ${g.averageRating}) - ${g.shortDescription || g.genres.join(', ')}`).join('\\n')}`;
        } else if (msg.includes('price') || msg.includes('cost') || msg.includes('free')) {
            const freeGames = await Game.find({ price: 0, isPublished: true }).limit(5);
            response = `Here are some free games:\\n${freeGames.map((g, i) => `${i + 1}. **${g.title}** - ${g.shortDescription || g.genres.join(', ')}`).join('\\n')}\\n\\nAll free to download!`;
        } else if (msg.includes('help') || msg.includes('how')) {
            response = `Welcome to Nexus Gaming! Here's what I can help with:\\n• **Game recommendations** - Ask me to recommend games\\n• **Find free games** - Ask about free games\\n• **Account help** - Questions about your account\\n• **Search games** - Describe what you're looking for\\n\\nJust type your question!`;
        } else if (msg.includes('account') || msg.includes('profile')) {
            response = `For account settings, go to your **Profile** page. You can:\\n• Update your avatar and bio\\n• Change privacy settings\\n• View your achievements and playtime\\n• Manage your friends list`;
        } else if (msg.includes('download') || msg.includes('install')) {
            response = `To download a game:\\n1. Go to the game's store page\\n2. Click **Download** (or **Purchase** if it's paid)\\n3. The game will appear in your **Library**\\n4. Use the **Nexus Launcher** for the best experience!`;
        } else {
            // Search for games matching the query
            const games = await Game.find({ $text: { $search: message }, isPublished: true }).limit(3);
            if (games.length > 0) {
                response = `I found these games related to "${message}":\\n${games.map((g, i) => `${i + 1}. **${g.title}** (₹${g.price}) - ⭐ ${g.averageRating}`).join('\\n')}`;
            } else {
                response = `I'm Nexus AI Assistant! I can help you find games, get recommendations, and answer questions about the platform. Try asking me to "recommend games" or "find free games"!`;
            }
        }

        res.json({ response, timestamp: new Date() });
    } catch (error) { next(error); }
};

// POST /api/ai/analyze-screenshot (simple stub)
exports.analyzeScreenshot = async (req, res, next) => {
    try {
        res.json({
            analysis: {
                genre: 'action',
                mood: 'intense',
                quality: 'high',
                suggestions: ['Try increasing brightness for better visibility', 'Great composition!'],
            },
        });
    } catch (error) { next(error); }
};
