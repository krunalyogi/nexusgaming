const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    room: { type: String },
    content: { type: String, required: true, maxlength: 2000 },
    type: { type: String, enum: ['text', 'image', 'system', 'game-invite'], default: 'text' },
    readAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

chatMessageSchema.index({ room: 1, createdAt: -1 });
chatMessageSchema.index({ sender: 1, receiver: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
