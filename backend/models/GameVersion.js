const mongoose = require('mongoose');

const gameVersionSchema = new mongoose.Schema({
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    version: { type: String, required: true },
    changelog: { type: String, required: true },
    downloadUrl: { type: String, required: true },
    fileSize: { type: String, default: '0 MB' },
    isStable: { type: Boolean, default: true },
    isMandatory: { type: Boolean, default: false },
}, { timestamps: true });

gameVersionSchema.index({ game: 1, version: 1 }, { unique: true });

module.exports = mongoose.model('GameVersion', gameVersionSchema);
