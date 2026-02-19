const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, maxlength: 200 },
    content: { type: String, required: true, maxlength: 5000 },
    playtime: { type: Number, default: 0 },
    isRecommended: { type: Boolean, default: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isEdited: { type: Boolean, default: false },
}, { timestamps: true });

reviewSchema.index({ game: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
