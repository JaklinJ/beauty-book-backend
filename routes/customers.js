const express = require('express');
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');
const router = express.Router();
const { getCustomersBySalon } = require("../services/customerService");

// Get all customers for a salon (alphabetically ordered)
router.get("/", auth, async (req, res) => {
  try {
    const customers = await getCustomersBySalon(req.salon._id);
    res.json(customers);
  } catch (error) {
    console.error("Get customers error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Search customers by name
router.get('/search', auth, async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.json([]);
    }

    const customers = await Customer.find({
      salonId: req.salon._id,
      name: { $regex: query, $options: 'i' }
    })
      .sort({ name: 1 })
      .select('-__v');

    res.json(customers);
  } catch (error) {
    console.error('Search customers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single customer
router.get('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      salonId: req.salon._id
    }).select('-__v');

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new customer
router.post('/', auth, async (req, res) => {
  try {
    const { name, phone, email, notes } = req.body;

    const customer = new Customer({
      salonId: req.salon._id,
      name,
      phone,
      email,
      notes
    });

    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update customer
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, phone, email, notes } = req.body;

    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, salonId: req.salon._id },
      { name, phone, email, notes },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete customer
router.delete('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({
      _id: req.params.id,
      salonId: req.salon._id
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


