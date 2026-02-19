const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true, maxlength: 5000 },
    shortDescription: { type: String, maxlength: 300 },
    price: { type: Number, required: true, default: 0, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    genres: [{ type: String, enum: ['action', 'adventure', 'rpg', 'strategy', 'simulation', 'sports', 'racing', 'puzzle', 'horror', 'fps', 'mmo', 'indie', 'casual', 'fighting', 'platformer', 'sandbox', 'battle-royale', 'survival'] }],
    tags: [{ type: String }],
    developer: { type: mongoose.Schema.Types.ObjectId, ref: 'DeveloperAccount', required: true },
    publisher: { type: String, default: '' },
    coverImage: { type: String, required: true },
    bannerImage: { type: String, default: '' },
    screenshots: [{ type: String }],
    trailerUrl: { type: String, default: '' },
    downloadUrl: { type: String, required: true },
    fileSize: { type: String, default: '0 MB' },
    currentVersion: { type: String, default: '1.0.0' },
    platform: [{ type: String, enum: ['windows', 'mac', 'linux'], default: ['windows'] }],
    minRequirements: {
        os: { type: String, default: 'Windows 10' },
        processor: { type: String, default: 'Intel i3' },
        memory: { type: String, default: '4 GB RAM' },
        graphics: { type: String, default: 'GTX 960' },
        storage: { type: String, default: '10 GB' },
    },
    recRequirements: {
        os: { type: String, default: 'Windows 10/11' },
        processor: { type: String, default: 'Intel i5' },
        memory: { type: String, default: '8 GB RAM' },
        graphics: { type: String, default: 'GTX 1060' },
        storage: { type: String, default: '20 GB' },
    },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    totalDownloads: { type: Number, default: 0 },
    totalWishlists: { type: Number, default: 0 },
    releaseDate: { type: Date, default: Date.now },
    isEarlyAccess: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    ageRating: { type: String, enum: ['E', 'E10+', 'T', 'M', 'AO'], default: 'T' },
    supportedLanguages: [{ type: String }],
    features: [{ type: String }],
}, { timestamps: true });

gameSchema.index({ title: 'text', description: 'text', tags: 'text' });
gameSchema.index({ genres: 1 });
gameSchema.index({ price: 1 });
gameSchema.index({ averageRating: -1 });

module.exports = mongoose.model('Game', gameSchema);
