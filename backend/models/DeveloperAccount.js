const mongoose = require('mongoose');

const developerAccountSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    studioName: { type: String, required: true, unique: true },
    description: { type: String, default: '', maxlength: 2000 },
    website: { type: String, default: '' },
    logo: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
    totalRevenue: { type: Number, default: 0 },
    totalDownloads: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('DeveloperAccount', developerAccountSchema);
