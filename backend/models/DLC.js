const mongoose = require('mongoose');

const dlcSchema = new mongoose.Schema({
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    coverImage: { type: String, default: '' },
    downloadUrl: { type: String, required: true },
    fileSize: { type: String, default: '0 MB' },
    version: { type: String, default: '1.0.0' },
    isPublished: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('DLC', dlcSchema);
