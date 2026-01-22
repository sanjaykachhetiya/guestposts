const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  totalAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid', 'refunded'],
    default: 'unpaid'
  },
  paymentMethod: { type: String },
  items: [{
    publisherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher' },
    publisherDomain: { type: String },
    price: { type: Number },
    quantity: { type: Number }
  }],
  notes: { type: String },
}, {
  timestamps: true
});

orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderNumber: 1 });

module.exports = mongoose.model('Order', orderSchema);
