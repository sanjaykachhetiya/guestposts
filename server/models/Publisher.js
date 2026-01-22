const mongoose = require('mongoose');

const publisherSchema = new mongoose.Schema({
  domain: { type: String, required: true },
  niche: { type: String, required: true },
  country: { type: String, required: true },
  domainAuthority: { type: Number, required: true },
  pageAuthority: { type: Number, required: true },
  trustFlow: { type: Number, required: true },
  citationFlow: { type: Number, required: true },
  monthlyTraffic: { type: Number, required: true },
  spamScore: { type: Number, required: true },
  language: { type: String, required: true },
  turnaroundTime: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  contentGuidelines: { type: String },
  doFollow: { type: Boolean, default: true },
  indexed: { type: Boolean, default: true },
  adultContent: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
}, {
  timestamps: true
});

// Indexes for fast queries
publisherSchema.index({ niche: 1 });
publisherSchema.index({ country: 1 });
publisherSchema.index({ status: 1 });
publisherSchema.index({ featured: 1 });
publisherSchema.index({ verified: 1 });
publisherSchema.index({ domainAuthority: 1 });

module.exports = mongoose.model('Publisher', publisherSchema);
