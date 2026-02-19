const mongoose = require('mongoose');

const modSchema = new mongoose.Schema({
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true, maxlength: 3000 },
    version: { type: String, default: '1.0.0' },
    downloadUrl: { type: String, required: true },
    fileSize: { type: String, default: '0 MB' },
    coverImage: { type: String, default: '' },
    category: { type: String, enum: ['gameplay', 'graphics', 'audio', 'ui', 'maps', 'characters', 'tools', 'other'], default: 'other' },
    totalDownloads: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    isApproved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Mod', modSchema);
