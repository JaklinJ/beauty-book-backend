const express = require('express');
const auth = require('../middleware/auth');
const ZoneDuration = require('../models/ZoneDuration');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const doc = await ZoneDuration.findOne({ salonId: req.salon._id });
    res.json({ durations: doc ? Object.fromEntries(doc.durations) : {} });
  } catch (error) {
    console.error('Get zone durations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    const { durations } = req.body;

    if (!durations || typeof durations !== 'object') {
      return res.status(400).json({ message: 'Invalid durations format' });
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(durations)) {
      const num = parseInt(value, 10);
      if (!isNaN(num) && num > 0) {
        sanitized[key] = num;
      }
    }

    await ZoneDuration.findOneAndUpdate(
      { salonId: req.salon._id },
      { durations: sanitized },
      { upsert: true, new: true }
    );

    res.json({ message: 'Zone durations saved successfully' });
  } catch (error) {
    console.error('Save zone durations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
