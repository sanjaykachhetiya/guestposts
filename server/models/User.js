const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String },
  image: { type: String },
  emailVerificationTime: { type: Date },
  isAnonymous: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ['admin', 'user', 'member'],
    default: 'user'
  },
  otp: { type: String },
  otpExpires: { type: Date },
}, {
  timestamps: true
});

// Index for email
userSchema.index({ email: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
