const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    dlc: { type: mongoose.Schema.Types.ObjectId, ref: 'DLC' },
    type: { type: String, enum: ['game', 'dlc'], required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    paymentId: { type: String },
    paymentMethod: { type: String, default: 'razorpay' },
    status: { type: String, enum: ['pending', 'completed', 'refunded', 'failed'], default: 'completed' },
}, { timestamps: true });

purchaseSchema.index({ user: 1, game: 1 });

module.exports = mongoose.model('Purchase', purchaseSchema);
