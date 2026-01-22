const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  tier: {
    type: String,
    enum: ['basic', 'standard', 'premium', 'enterprise'],
    required: true
  },
  price: { type: Number, required: true },
  credits: { type: Number, required: true },
  features: [{ type: String }],
  active: { type: Boolean, default: true },
}, {
  timestamps: true
});

packageSchema.index({ tier: 1 });
packageSchema.index({ slug: 1 });

module.exports = mongoose.model('Package', packageSchema);
