const mongoose = require('mongoose');

const libraryEntrySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    playtime: { type: Number, default: 0 },
    lastPlayed: { type: Date },
    installed: { type: Boolean, default: false },
    installPath: { type: String, default: '' },
    autoUpdate: { type: Boolean, default: true },
    currentVersion: { type: String, default: '1.0.0' },
    isFavorite: { type: Boolean, default: false },
}, { timestamps: true });

libraryEntrySchema.index({ user: 1, game: 1 }, { unique: true });

module.exports = mongoose.model('LibraryEntry', libraryEntrySchema);
