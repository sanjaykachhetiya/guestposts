const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/guestposthub';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Import routes
const publishersRouter = require('./routes/publishers');
const packagesRouter = require('./routes/packages');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const wishlistRouter = require('./routes/wishlist');
const nichesRouter = require('./routes/niches');
const reviewsRouter = require('./routes/reviews');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');

// Routes
app.use('/api/publishers', publishersRouter);
app.use('/api/packages', packagesRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/niches', nichesRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 MongoDB: ${MONGODB_URI}`);
});

module.exports = app;
