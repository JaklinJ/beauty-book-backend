const express = require('express');
const jwt = require('jsonwebtoken');
const Salon = require('../models/Salon');
const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

const salonPayload = (salon) => ({
  id: salon._id,
  name: salon.name,
  email: salon.email,
  phone: salon.phone,
  address: salon.address,
});

// Register salon
router.post('/register', async (req, res) => {
  try {
    const { name, password, phone, address } = req.body;
    const email = req.body.email?.toLowerCase().trim();

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existingSalon = await Salon.findOne({ email });
    if (existingSalon) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const salon = new Salon({
      name,
      email,
      password,
      phone,
      address,
    });

    await salon.save();

    const token = generateToken(salon._id);

    res.status(201).json({ token, salon: salonPayload(salon) });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login salon
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.body.email?.toLowerCase().trim();

    const salon = await Salon.findOne({ email });
    if (!salon) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await salon.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(salon._id);

    res.json({ token, salon: salonPayload(salon) });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
