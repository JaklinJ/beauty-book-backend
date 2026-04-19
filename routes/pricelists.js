const express = require('express');
const auth = require('../middleware/auth');
const PriceList = require('../models/PriceList');
const router = express.Router();

// GET price list for authenticated salon
router.get('/', auth, async (req, res) => {
  try {
    const priceList = await PriceList.findOne({ salonId: req.salon._id });
    res.json({ prices: priceList ? Object.fromEntries(priceList.prices) : {} });
  } catch (error) {
    console.error('Get price list error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT (upsert) price list for authenticated salon
router.put('/', auth, async (req, res) => {
  try {
    const { prices } = req.body;

    if (!prices || typeof prices !== 'object') {
      return res.status(400).json({ message: 'Invalid prices format' });
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(prices)) {
      const num = parseFloat(value);
      if (!isNaN(num) && num >= 0) {
        sanitized[key] = num;
      }
    }

    await PriceList.findOneAndUpdate(
      { salonId: req.salon._id },
      { prices: sanitized },
      { upsert: true, new: true }
    );

    res.json({ message: 'Price list saved successfully' });
  } catch (error) {
    console.error('Save price list error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
