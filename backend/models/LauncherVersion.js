const mongoose = require('mongoose');

const launcherVersionSchema = new mongoose.Schema({
    version: { type: String, required: true, unique: true },
    downloadUrl: { type: String, required: true },
    changelog: { type: String, required: true },
    platform: { type: String, enum: ['windows', 'mac', 'linux'], default: 'windows' },
    fileSize: { type: String, default: '0 MB' },
    isMandatory: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('LauncherVersion', launcherVersionSchema);
