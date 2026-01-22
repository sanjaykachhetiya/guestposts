const mongoose = require('mongoose');

const nicheSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  icon: { type: String },
  publisherCount: { type: Number, default: 0 },
}, {
  timestamps: true
});

nicheSchema.index({ slug: 1 });

module.exports = mongoose.model('Niche', nicheSchema);
