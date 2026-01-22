const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  publisherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher', required: true },
}, {
  timestamps: true
});

wishlistSchema.index({ userId: 1 });
wishlistSchema.index({ publisherId: 1 });

module.exports = mongoose.model('Wishlist', wishlistSchema);
