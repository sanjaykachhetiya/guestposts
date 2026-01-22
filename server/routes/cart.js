const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Publisher = require('../models/Publisher');
const { authenticate } = require('../middleware/auth');

// Get user cart
router.get('/', authenticate, async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.userId })
      .populate('publisherId')
      .populate('packageId');

    const formattedItems = cartItems.map(item => ({
      _id: item._id,
      quantity: item.quantity,
      publisher: item.publisherId,
      package: item.packageId,
      createdAt: item.createdAt
    }));

    res.json(formattedItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to cart
router.post('/', authenticate, async (req, res) => {
  try {
    const { publisherId, quantity = 1, packageId } = req.body;

    // Check if already in cart
    let cartItem = await Cart.findOne({ userId: req.userId, publisherId });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = new Cart({
        userId: req.userId,
        publisherId,
        quantity,
        packageId
      });
      await cartItem.save();
    }

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update cart item quantity
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await Cart.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { quantity },
      { new: true }
    );

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json(cartItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove from cart
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const cartItem = await Cart.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear cart
router.delete('/', authenticate, async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.userId });
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get cart count
router.get('/count', authenticate, async (req, res) => {
  try {
    const count = await Cart.countDocuments({ userId: req.userId });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
