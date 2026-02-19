require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const initChatSocket = require('./socket/chatSocket');

// Import routes
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const downloadRoutes = require('./routes/downloadRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const friendRoutes = require('./routes/friendRoutes');
const chatRoutes = require('./routes/chatRoutes');
const modRoutes = require('./routes/modRoutes');
const dlcRoutes = require('./routes/dlcRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const developerRoutes = require('./routes/developerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiRoutes = require('./routes/aiRoutes');
const libraryRoutes = require('./routes/libraryRoutes');

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

app.set('io', io);

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { error: 'Too many requests, try again later.' } });
app.use('/api/', limiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/mods', modRoutes);
app.use('/api/dlc', dlcRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/developer', developerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api', libraryRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date(), uptime: process.uptime() });
});

// Root
app.get('/', (req, res) => {
    res.json({
        message: '🎮 Nexus Gaming Platform API',
        version: '1.0.0',
        docs: '/api/health',
        endpoints: [
            'POST /api/auth/register',
            'POST /api/auth/login',
            'GET  /api/games',
            'GET  /api/games/featured',
            'GET  /api/games/trending',
            'GET  /api/games/:slug',
            'GET  /api/library',
            'GET  /api/wishlist',
            'GET  /api/friends',
            'GET  /api/chat/conversations',
            'GET  /api/achievements/user',
            'GET  /api/notifications',
            'POST /api/ai/chatbot',
            'POST /api/ai/recommend',
        ],
    });
});

// Error handler
app.use(errorHandler);

// Initialize Socket.io
initChatSocket(io);

// Connect DB and start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`
    ╔══════════════════════════════════════════╗
    ║      🎮 NEXUS GAMING PLATFORM API       ║
    ║      Running on port ${PORT}               ║
    ║      Environment: ${process.env.NODE_ENV || 'development'}       ║
    ╚══════════════════════════════════════════╝
    `);
    });
});

module.exports = { app, server };
