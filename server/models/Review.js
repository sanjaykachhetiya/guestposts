const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userImage: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  publisherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher' },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  approved: { type: Boolean, default: false },
}, {
  timestamps: true
});

reviewSchema.index({ userId: 1 });
reviewSchema.index({ approved: 1 });

module.exports = mongoose.model('Review', reviewSchema);
