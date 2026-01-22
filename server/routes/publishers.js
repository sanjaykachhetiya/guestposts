const express = require('express');
const router = express.Router();
const Publisher = require('../models/Publisher');
const { optionalAuth, authenticate, isAdmin } = require('../middleware/auth');

// Get all publishers with filters and pagination
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      search,
      niche,
      country,
      minDA,
      maxDA,
      minPrice,
      maxPrice,
      doFollow,
      featured,
      verified,
      limit = 50,
      page = 1
    } = req.query;

    const query = { status: 'active' };

    if (search) {
      query.domain = { $regex: search, $options: 'i' };
    }
    if (niche && niche !== 'all') {
      query.niche = niche;
    }
    if (country && country !== 'all') {
      query.country = country;
    }
    if (minDA) {
      query.domainAuthority = { ...query.domainAuthority, $gte: parseInt(minDA) };
    }
    if (maxDA) {
      query.domainAuthority = { ...query.domainAuthority, $lte: parseInt(maxDA) };
    }
    if (minPrice) {
      query.price = { ...query.price, $gte: parseInt(minPrice) };
    }
    if (maxPrice) {
      query.price = { ...query.price, $lte: parseInt(maxPrice) };
    }
    if (doFollow === 'true') {
      query.doFollow = true;
    }
    if (featured === 'true') {
      query.featured = true;
    }
    if (verified === 'true') {
      query.verified = true;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const publishers = await Publisher.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Publisher.countDocuments(query);

    res.json({
      publishers,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get featured publishers
router.get('/featured', async (req, res) => {
  try {
    const publishers = await Publisher.find({ featured: true, status: 'active' })
      .limit(6)
      .sort({ createdAt: -1 });
    res.json(publishers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get statistics
router.get('/stats', async (req, res) => {
  try {
    const total = await Publisher.countDocuments();
    const active = await Publisher.countDocuments({ status: 'active' });
    const verified = await Publisher.countDocuments({ verified: true });
    const featured = await Publisher.countDocuments({ featured: true });

    res.json({ total, active, verified, featured });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single publisher
router.get('/:id', async (req, res) => {
  try {
    const publisher = await Publisher.findById(req.params.id);
    if (!publisher) {
      return res.status(404).json({ error: 'Publisher not found' });
    }
    res.json(publisher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create publisher (admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const publisher = new Publisher(req.body);
    await publisher.save();
    res.status(201).json(publisher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update publisher (admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const publisher = await Publisher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!publisher) {
      return res.status(404).json({ error: 'Publisher not found' });
    }
    res.json(publisher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete publisher (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const publisher = await Publisher.findByIdAndDelete(req.params.id);
    if (!publisher) {
      return res.status(404).json({ error: 'Publisher not found' });
    }
    res.json({ message: 'Publisher deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
