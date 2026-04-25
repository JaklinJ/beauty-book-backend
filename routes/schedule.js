const express = require('express');
const ScheduleEntry = require('../models/ScheduleEntry');
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');
const router = express.Router();

// Get schedule entries in a date range (for calendar)
router.get('/range', auth, async (req, res) => {
  try {
    const { from, to } = req.query;
    const entries = await ScheduleEntry.find({
      salonId: req.salon._id,
      date: { $gte: new Date(from), $lte: new Date(to) },
    })
      .populate('customerId', 'name phone')
      .sort({ date: 1 })
      .select('-__v');
    res.json(entries);
  } catch (error) {
    console.error('Get schedule range error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a schedule entry
router.post('/', auth, async (req, res) => {
  try {
    const { customerId, date, zones, duration, notes } = req.body;

    const customer = await Customer.findOne({ _id: customerId, salonId: req.salon._id });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const entry = new ScheduleEntry({
      salonId: req.salon._id,
      customerId,
      date: new Date(date),
      zones: zones || [],
      duration: duration ?? null,
      notes: notes ?? null,
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    console.error('Create schedule entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a schedule entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await ScheduleEntry.findOneAndDelete({
      _id: req.params.id,
      salonId: req.salon._id,
    });
    if (!entry) return res.status(404).json({ message: 'Schedule entry not found' });
    res.json({ message: 'Schedule entry deleted successfully' });
  } catch (error) {
    console.error('Delete schedule entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
