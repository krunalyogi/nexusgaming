require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Game = require('../models/Game');
const Review = require('../models/Review');
const DeveloperAccount = require('../models/DeveloperAccount');
const { Achievement, UserAchievement } = require('../models/Achievement');
const LibraryEntry = require('../models/LibraryEntry');
const ChatMessage = require('../models/ChatMessage');
const FriendRequest = require('../models/FriendRequest');
const Notification = require('../models/Notification');
const Purchase = require('../models/Purchase');
const DLC = require('../models/DLC');
const Mod = require('../models/Mod');
const { createChatRoom } = require('../utils/helpers');

const seed = async () => {
    await connectDB();
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
        User.deleteMany({}), Game.deleteMany({}), Review.deleteMany({}),
        DeveloperAccount.deleteMany({}), Achievement.deleteMany({}),
        UserAchievement.deleteMany({}), LibraryEntry.deleteMany({}),
        ChatMessage.deleteMany({}), FriendRequest.deleteMany({}),
        Notification.deleteMany({}), Purchase.deleteMany({}),
        DLC.deleteMany({}), Mod.deleteMany({}),
    ]);

    console.log('👤 Creating users...');
    const users = await User.create([
        { username: 'ProGamer99', email: 'gamer@nexus.com', passwordHash: 'password123', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ProGamer99', role: 'user', isVerified: true, status: 'online', country: 'US', steamLevel: 15, xp: 4500 },
        { username: 'ShadowBlade', email: 'shadow@nexus.com', passwordHash: 'password123', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ShadowBlade', role: 'user', isVerified: true, country: 'UK', steamLevel: 22, xp: 8200 },
        { username: 'PixelQueen', email: 'pixel@nexus.com', passwordHash: 'password123', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PixelQueen', role: 'developer', isVerified: true, country: 'JP', steamLevel: 30, xp: 12000 },
        { username: 'AdminKing', email: 'admin@nexus.com', passwordHash: 'admin123', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminKing', role: 'admin', isVerified: true, country: 'IN', steamLevel: 50, xp: 25000 },
        { username: 'NovaCaster', email: 'nova@nexus.com', passwordHash: 'password123', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NovaCaster', role: 'user', isVerified: true, country: 'DE', steamLevel: 8, xp: 2100 },
        { username: 'ThunderWolf', email: 'thunder@nexus.com', passwordHash: 'password123', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ThunderWolf', role: 'developer', isVerified: true, country: 'CA', steamLevel: 18, xp: 5600 },
    ]);

    console.log('🏢 Creating developer accounts...');
    const devAccounts = await DeveloperAccount.create([
        { user: users[2]._id, studioName: 'PixelForge Studios', description: 'Indie games with heart and soul', website: 'https://pixelforge.dev', verified: true },
        { user: users[5]._id, studioName: 'Thunder Interactive', description: 'AAA-quality action games', website: 'https://thundergames.com', verified: true },
    ]);

    console.log('🎮 Creating games...');
    const games = await Game.create([
        {
            title: 'Cyber Odyssey 2077', slug: 'cyber-odyssey-2077', description: 'An open-world RPG set in a dystopian future where augmented humans fight for survival in a neon-drenched metropolis. Explore vast cityscapes, engage in thrilling combat, and make choices that shape the world.', shortDescription: 'Open-world cyberpunk RPG',
            price: 0, genres: ['rpg', 'action', 'adventure'], tags: ['cyberpunk', 'open-world', 'story-rich', 'sci-fi'],
            developer: devAccounts[0]._id, publisher: 'PixelForge Studios', coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600',
            bannerImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200',
            screenshots: ['https://images.unsplash.com/photo-1552820728-8b83bb6b2b28?w=800', 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800'],
            downloadUrl: 'https://drive.google.com/uc?export=download&id=demo1', fileSize: '45 GB', currentVersion: '2.1.0',
            platform: ['windows', 'linux'], averageRating: 4.7, totalReviews: 150, totalDownloads: 25000,
            isFeatured: true, releaseDate: new Date('2025-03-15'), ageRating: 'M',
            features: ['Single-player', 'Open World', 'Character Customization', 'Multiple Endings'],
            minRequirements: { os: 'Windows 10', processor: 'Intel i5-8400', memory: '8 GB RAM', graphics: 'GTX 1060', storage: '45 GB' },
        },
        {
            title: 'Dragon Realms Online', slug: 'dragon-realms-online', description: 'A massive multiplayer online RPG where you can tame dragons, build kingdoms, and battle alongside friends. With procedurally generated worlds and seasons.', shortDescription: 'Epic MMO fantasy world',
            price: 499, genres: ['mmo', 'rpg', 'adventure'], tags: ['fantasy', 'multiplayer', 'dragons', 'open-world'],
            developer: devAccounts[1]._id, publisher: 'Thunder Interactive', coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600',
            screenshots: ['https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=800'],
            downloadUrl: 'https://drive.google.com/uc?export=download&id=demo2', fileSize: '60 GB', currentVersion: '3.5.1',
            platform: ['windows'], averageRating: 4.5, totalReviews: 300, totalDownloads: 50000,
            isFeatured: true, releaseDate: new Date('2024-11-01'), ageRating: 'T',
            features: ['Multiplayer', 'Open World', 'PvP', 'Guilds', 'Crafting'],
        },
        {
            title: 'Velocity Rush', slug: 'velocity-rush', description: 'High-octane racing through impossible tracks in anti-gravity vehicles. Compete globally in ranked seasons or build custom tracks for the community.', shortDescription: 'Futuristic anti-gravity racing',
            price: 0, genres: ['racing', 'sports'], tags: ['fast-paced', 'competitive', 'futuristic', 'multiplayer'],
            developer: devAccounts[0]._id, publisher: 'PixelForge Studios', coverImage: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=600',
            screenshots: ['https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800'],
            downloadUrl: 'https://drive.google.com/uc?export=download&id=demo3', fileSize: '15 GB', currentVersion: '1.8.0',
            platform: ['windows', 'mac', 'linux'], averageRating: 4.3, totalReviews: 80, totalDownloads: 12000,
            isFeatured: false, releaseDate: new Date('2025-06-20'), ageRating: 'E',
            features: ['Multiplayer', 'Track Editor', 'Ranked Seasons', 'Controller Support'],
        },
        {
            title: 'Phantom Tactics', slug: 'phantom-tactics', description: 'A deeply strategic turn-based game featuring stealth espionage in a Cold War setting. Build your spy network, infiltrate enemy bases, and change the course of history.', shortDescription: 'Cold War stealth strategy',
            price: 299, genres: ['strategy', 'simulation'], tags: ['turn-based', 'stealth', 'historical', 'tactical'],
            developer: devAccounts[1]._id, publisher: 'Thunder Interactive', coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600',
            screenshots: ['https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800'],
            downloadUrl: 'https://drive.google.com/uc?export=download&id=demo4', fileSize: '8 GB', currentVersion: '1.2.0',
            platform: ['windows', 'mac'], averageRating: 4.8, totalReviews: 45, totalDownloads: 8000,
            releaseDate: new Date('2025-09-10'), ageRating: 'T',
            features: ['Single-player', 'Turn-based', 'Stealth', 'Story-driven'],
        },
        {
            title: 'Neon Fighters', slug: 'neon-fighters', description: 'A flashy 2D fighting game with neon aesthetics, unique characters, and tight controls. Features online ranked battles and local multiplayer.', shortDescription: '2D neon-lit fighting game',
            price: 0, genres: ['fighting', 'indie'], tags: ['2d', 'competitive', 'neon', 'pixel-art'],
            developer: devAccounts[0]._id, publisher: 'PixelForge Studios', coverImage: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=600',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=demo5', fileSize: '2 GB', currentVersion: '1.0.5',
            platform: ['windows', 'mac', 'linux'], averageRating: 4.1, totalReviews: 60, totalDownloads: 15000,
            releaseDate: new Date('2025-01-15'), ageRating: 'T',
            features: ['Multiplayer', 'Local Co-op', 'Ranked', 'Controller Support'],
        },
        {
            title: 'Stellar Survival', slug: 'stellar-survival', description: 'Crash-landed on an alien planet, craft tools, build shelters, and survive against hostile wildlife. Features co-op multiplayer for up to 4 players.', shortDescription: 'Alien planet survival crafting',
            price: 199, genres: ['survival', 'sandbox', 'adventure'], tags: ['crafting', 'co-op', 'exploration', 'sci-fi'],
            developer: devAccounts[1]._id, publisher: 'Thunder Interactive', coverImage: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=600',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=demo6', fileSize: '25 GB', currentVersion: '2.0.0',
            platform: ['windows'], averageRating: 4.4, totalReviews: 120, totalDownloads: 20000,
            isEarlyAccess: true, releaseDate: new Date('2025-04-01'), ageRating: 'T',
            features: ['Co-op', 'Crafting', 'Base Building', 'Procedural Generation'],
        },
    ]);

    // Update dev accounts with games
    devAccounts[0].games = [games[0]._id, games[2]._id, games[4]._id];
    devAccounts[1].games = [games[1]._id, games[3]._id, games[5]._id];
    await Promise.all(devAccounts.map(d => d.save()));

    console.log('⭐ Creating reviews...');
    await Review.create([
        { game: games[0]._id, user: users[0]._id, rating: 5, title: 'Best RPG ever!', content: 'Incredible world-building, amazing story, and the cyberpunk atmosphere is unmatched. 100+ hours and still finding new things!', isRecommended: true, playtime: 120 },
        { game: games[0]._id, user: users[1]._id, rating: 4, title: 'Amazing but demanding', content: 'Great game but requires a beefy PC. The story is gripping and the side quests are fantastic.', isRecommended: true, playtime: 60 },
        { game: games[1]._id, user: users[0]._id, rating: 5, title: 'Addictive MMO!', content: 'The dragon taming system is genius. Been playing since beta and the devs keep adding amazing content.', isRecommended: true, playtime: 500 },
        { game: games[1]._id, user: users[4]._id, rating: 4, title: 'Great community', content: 'The guild system and PvP are really well done. Community is friendly for new players.', isRecommended: true, playtime: 80 },
        { game: games[2]._id, user: users[1]._id, rating: 5, title: 'Pure adrenaline!', content: 'The speed and track design are incredible. Track editor adds infinite replayability.', isRecommended: true, playtime: 30 },
        { game: games[3]._id, user: users[4]._id, rating: 5, title: 'Strategy perfection', content: 'Finally a strategy game that respects intelligence. Every mission feels like a puzzle.', isRecommended: true, playtime: 45 },
        { game: games[4]._id, user: users[0]._id, rating: 4, title: 'Stylish and fun', content: 'Great fighting game with smooth controls. Wish there were more characters.', isRecommended: true, playtime: 20 },
        { game: games[5]._id, user: users[1]._id, rating: 4, title: 'Solid survival game', content: 'Co-op with friends is a blast. Building system is intuitive.', isRecommended: true, playtime: 90 },
    ]);

    console.log('🏆 Creating achievements...');
    const achievements = await Achievement.create([
        { game: games[0]._id, title: 'Welcome to Night City', description: 'Complete the prologue', icon: '🌃', points: 10, rarity: 'common' },
        { game: games[0]._id, title: 'Cyber Warrior', description: 'Defeat 100 enemies', icon: '⚔️', points: 25, rarity: 'uncommon' },
        { game: games[0]._id, title: 'Master Hacker', description: 'Hack 50 systems', icon: '💻', points: 50, rarity: 'rare' },
        { game: games[0]._id, title: 'Legend of the Streets', description: 'Complete all side quests', icon: '🏆', points: 100, rarity: 'legendary' },
        { game: games[1]._id, title: 'Dragon Rider', description: 'Tame your first dragon', icon: '🐉', points: 15, rarity: 'common' },
        { game: games[1]._id, title: 'Kingdom Builder', description: 'Build a level 10 castle', icon: '🏰', points: 50, rarity: 'rare' },
        { game: games[2]._id, title: 'First Place!', description: 'Win your first race', icon: '🏁', points: 10, rarity: 'common' },
        { game: games[2]._id, title: 'Speed Demon', description: 'Reach 500 km/h', icon: '💨', points: 30, rarity: 'uncommon' },
        { game: games[4]._id, title: 'First Blood', description: 'Win your first match', icon: '🥊', points: 10, rarity: 'common' },
        { game: games[5]._id, title: 'Survivor', description: 'Survive 10 days', icon: '🌟', points: 15, rarity: 'common' },
    ]);

    // Unlock some achievements for users
    await UserAchievement.create([
        { user: users[0]._id, achievement: achievements[0]._id, game: games[0]._id },
        { user: users[0]._id, achievement: achievements[1]._id, game: games[0]._id },
        { user: users[0]._id, achievement: achievements[4]._id, game: games[1]._id },
        { user: users[1]._id, achievement: achievements[0]._id, game: games[0]._id },
        { user: users[1]._id, achievement: achievements[6]._id, game: games[2]._id },
    ]);

    console.log('📚 Creating library entries...');
    await LibraryEntry.create([
        { user: users[0]._id, game: games[0]._id, playtime: 7200, lastPlayed: new Date(), installed: true },
        { user: users[0]._id, game: games[1]._id, playtime: 30000, lastPlayed: new Date(), installed: true },
        { user: users[0]._id, game: games[4]._id, playtime: 1200, lastPlayed: new Date() },
        { user: users[1]._id, game: games[0]._id, playtime: 3600, lastPlayed: new Date(), installed: true },
        { user: users[1]._id, game: games[2]._id, playtime: 1800, lastPlayed: new Date() },
        { user: users[1]._id, game: games[5]._id, playtime: 5400, lastPlayed: new Date(), installed: true },
        { user: users[4]._id, game: games[1]._id, playtime: 4800, lastPlayed: new Date() },
        { user: users[4]._id, game: games[3]._id, playtime: 2700, lastPlayed: new Date(), installed: true },
    ]);

    console.log('👥 Creating friend connections...');
    await FriendRequest.create([
        { sender: users[0]._id, receiver: users[1]._id, status: 'accepted' },
        { sender: users[0]._id, receiver: users[4]._id, status: 'accepted' },
        { sender: users[1]._id, receiver: users[4]._id, status: 'accepted' },
        { sender: users[2]._id, receiver: users[0]._id, status: 'accepted' },
        { sender: users[4]._id, receiver: users[5]._id, status: 'pending' },
    ]);

    console.log('💬 Creating chat messages...');
    const room1 = createChatRoom(users[0]._id.toString(), users[1]._id.toString());
    const room2 = createChatRoom(users[0]._id.toString(), users[4]._id.toString());
    await ChatMessage.create([
        { sender: users[0]._id, receiver: users[1]._id, room: room1, content: 'Hey! Wanna play Dragon Realms tonight?', readAt: new Date() },
        { sender: users[1]._id, receiver: users[0]._id, room: room1, content: 'Sure! Let me finish this Velocity Rush race first 🏁', readAt: new Date() },
        { sender: users[0]._id, receiver: users[1]._id, room: room1, content: 'No rush! I\'ll be in Night City doing side quests', readAt: new Date() },
        { sender: users[1]._id, receiver: users[0]._id, room: room1, content: 'Done! Creating a party now. Join when ready!', },
        { sender: users[0]._id, receiver: users[4]._id, room: room2, content: 'Did you see the new Phantom Tactics update?', readAt: new Date() },
        { sender: users[4]._id, receiver: users[0]._id, room: room2, content: 'Yes! The new spy class looks amazing!', },
    ]);

    console.log('🔔 Creating notifications...');
    await Notification.create([
        { user: users[0]._id, type: 'achievement', title: 'Achievement Unlocked!', message: 'You unlocked "Welcome to Night City"', data: { achievementId: achievements[0]._id }, read: true },
        { user: users[0]._id, type: 'friend_request', title: 'New Friend', message: 'ShadowBlade accepted your friend request!', read: true },
        { user: users[0]._id, type: 'game_update', title: 'Game Updated', message: 'Cyber Odyssey 2077 updated to v2.1.0', read: false },
        { user: users[1]._id, type: 'sale', title: 'Wishlist Sale!', message: 'Phantom Tactics is 30% off!', read: false },
        { user: users[4]._id, type: 'friend_request', title: 'Friend Request', message: 'ThunderWolf sent you a friend request!', read: false },
    ]);

    console.log('📦 Creating DLCs...');
    await DLC.create([
        { game: games[0]._id, title: 'Cyber Odyssey: Neon Shadows', description: 'Explore the underground district with new story, weapons and characters.', price: 199, downloadUrl: 'https://drive.google.com/uc?export=download&id=dlc1', fileSize: '12 GB' },
        { game: games[1]._id, title: 'Dragon Realms: Frost Kingdom', description: 'A new frozen continent with ice dragons, winter crafting and seasonal events.', price: 299, downloadUrl: 'https://drive.google.com/uc?export=download&id=dlc2', fileSize: '8 GB' },
        { game: games[5]._id, title: 'Stellar Survival: Ocean Depths', description: 'Explore underwater caves, build submarines, and discover aquatic creatures.', price: 149, downloadUrl: 'https://drive.google.com/uc?export=download&id=dlc3', fileSize: '5 GB' },
    ]);

    console.log('🔧 Creating mods...');
    await Mod.create([
        { game: games[0]._id, uploader: users[1]._id, title: 'HD Texture Pack', description: 'Ultra-high resolution textures for Night City. Makes everything look photorealistic.', version: '2.0', downloadUrl: 'https://drive.google.com/uc?export=download&id=mod1', fileSize: '4 GB', category: 'graphics', totalDownloads: 5000, isApproved: true },
        { game: games[0]._id, uploader: users[4]._id, title: 'Better UI Mod', description: 'Cleaner inventory management and minimap improvements.', version: '1.3', downloadUrl: 'https://drive.google.com/uc?export=download&id=mod2', fileSize: '50 MB', category: 'ui', totalDownloads: 3000, isApproved: true },
        { game: games[4]._id, uploader: users[0]._id, title: 'Extra Characters Pack', description: '10 new community-made fighters with unique movesets.', version: '1.0', downloadUrl: 'https://drive.google.com/uc?export=download&id=mod3', fileSize: '200 MB', category: 'characters', totalDownloads: 800, isApproved: true },
    ]);

    // Create purchases for library
    await Purchase.create([
        { user: users[0]._id, game: games[1]._id, type: 'game', price: 499, paymentId: 'pay_test_001', status: 'completed' },
        { user: users[1]._id, game: games[5]._id, type: 'game', price: 199, paymentId: 'pay_test_002', status: 'completed' },
        { user: users[4]._id, game: games[1]._id, type: 'game', price: 499, paymentId: 'pay_test_003', status: 'completed' },
        { user: users[4]._id, game: games[3]._id, type: 'game', price: 299, paymentId: 'pay_test_004', status: 'completed' },
    ]);

    // Add wishlists
    users[0].wishlist = [games[3]._id, games[5]._id];
    users[1].wishlist = [games[3]._id];
    users[4].wishlist = [games[0]._id, games[2]._id];
    await Promise.all([users[0].save(), users[1].save(), users[4].save()]);

    console.log(`
  ✅ SEED COMPLETE!
  ══════════════════════════
  👤 Users:        ${users.length}
  🎮 Games:        ${games.length}
  🏆 Achievements: ${achievements.length}
  ⭐ Reviews:      8
  📦 DLCs:         3
  🔧 Mods:         3
  👥 Friends:      5
  💬 Messages:     6
  🔔 Notifications: 5

  Test Login:
  ───────────
  User:  gamer@nexus.com / password123
  Admin: admin@nexus.com / admin123
  Dev:   pixel@nexus.com / password123
  `);

    process.exit(0);
};

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
