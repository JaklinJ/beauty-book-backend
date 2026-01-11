const express = require('express');
const Appointment = require('../models/Appointment');
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all appointments for a customer
router.get('/customer/:customerId', auth, async (req, res) => {
  try {
    // Verify customer belongs to salon
    const customer = await Customer.findOne({
      _id: req.params.customerId,
      salonId: req.salon._id
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const appointments = await Appointment.find({
      salonId: req.salon._id,
      customerId: req.params.customerId
    })
      .sort({ date: -1 })
      .select('-__v');

    res.json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single appointment
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      salonId: req.salon._id
    })
      .populate('customerId', 'name')
      .select('-__v');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new appointment
router.post('/', auth, async (req, res) => {
  try {
    const { customerId, date, treatments, notes } = req.body;

    // Verify customer belongs to salon
    const customer = await Customer.findOne({
      _id: customerId,
      salonId: req.salon._id
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (!treatments || treatments.length === 0) {
      return res.status(400).json({ message: 'At least one treatment is required' });
    }

    const appointment = new Appointment({
      salonId: req.salon._id,
      customerId,
      date: new Date(date),
      treatments,
      notes
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment
router.put('/:id', auth, async (req, res) => {
  try {
    const { date, treatments, notes } = req.body;

    if (treatments && treatments.length === 0) {
      return res.status(400).json({ message: 'At least one treatment is required' });
    }

    const updateData = {};
    if (date) updateData.date = new Date(date);
    if (treatments) updateData.treatments = treatments;
    if (notes !== undefined) updateData.notes = notes;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, salonId: req.salon._id },
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete appointment
router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
      salonId: req.salon._id
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get progress statistics for a customer
router.get('/customer/:customerId/progress', auth, async (req, res) => {
  try {
    // Verify customer belongs to salon
    const customer = await Customer.findOne({
      _id: req.params.customerId,
      salonId: req.salon._id
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const appointments = await Appointment.find({
      salonId: req.salon._id,
      customerId: req.params.customerId
    })
      .sort({ date: 1 })
      .select('date treatments');

    // Calculate progress by zone
    const zoneProgress = {};
    
    appointments.forEach(appointment => {
      appointment.treatments.forEach(treatment => {
        const zone = treatment.zone;
        if (!zoneProgress[zone]) {
          zoneProgress[zone] = {
            zone,
            treatments: [],
            totalVisits: 0,
            averagePower: 0,
            maxPower: 0,
            minPower: Infinity
          };
        }
        
        zoneProgress[zone].treatments.push({
          date: appointment.date,
          power: treatment.power
        });
        zoneProgress[zone].totalVisits++;
        zoneProgress[zone].maxPower = Math.max(zoneProgress[zone].maxPower, treatment.power);
        zoneProgress[zone].minPower = Math.min(zoneProgress[zone].minPower, treatment.power);
      });
    });

    // Calculate average power for each zone
    Object.keys(zoneProgress).forEach(zone => {
      const totalPower = zoneProgress[zone].treatments.reduce((sum, t) => sum + t.power, 0);
      zoneProgress[zone].averagePower = totalPower / zoneProgress[zone].treatments.length;
      if (zoneProgress[zone].minPower === Infinity) {
        zoneProgress[zone].minPower = 0;
      }
    });

    res.json({
      customerId: req.params.customerId,
      totalAppointments: appointments.length,
      zoneProgress: Object.values(zoneProgress)
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


