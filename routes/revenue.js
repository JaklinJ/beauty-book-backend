const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const router = express.Router();

// GET /api/revenue?year=2026&month=4&zone=zoneLegs
router.get('/', auth, async (req, res) => {
  try {
    const salonId = new mongoose.Types.ObjectId(req.salon._id);
    const year  = parseInt(req.query.year)  || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const zone  = req.query.zone || null; // null = all zones

    const startDate = new Date(year, month - 1, 1);
    const endDate   = new Date(year, month, 1);

    const baseMatch = {
      salonId,
      date: { $gte: startDate, $lt: endDate },
    };

    // Total appointment count for the month
    const appointmentCount = await Appointment.countDocuments(baseMatch);

    // Revenue aggregation by zone
    const pipeline = [
      { $match: baseMatch },
      { $unwind: '$treatments' },
      ...(zone ? [{ $match: { 'treatments.zone': zone } }] : []),
      {
        $group: {
          _id: '$treatments.zone',
          revenue: { $sum: '$treatments.price' },
          sessions: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
      {
        $project: {
          _id: 0,
          zone: '$_id',
          revenue: 1,
          sessions: 1,
        },
      },
    ];

    const byZone = await Appointment.aggregate(pipeline);
    const totalRevenue = byZone.reduce((sum, z) => sum + z.revenue, 0);
    const totalSessions = byZone.reduce((sum, z) => sum + z.sessions, 0);

    res.json({ totalRevenue, totalSessions, appointmentCount, byZone, year, month });
  } catch (error) {
    console.error('Revenue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
