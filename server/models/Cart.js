const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  publisherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher', required: true },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
  quantity: { type: Number, default: 1, min: 1 },
}, {
  timestamps: true
});

cartSchema.index({ userId: 1 });
cartSchema.index({ publisherId: 1 });

module.exports = mongoose.model('Cart', cartSchema);
