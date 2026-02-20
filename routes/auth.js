const express = require('express');
const jwt = require('jsonwebtoken');
const Salon = require('../models/Salon');
const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '1h'
  });
};

// Register salon
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Check if salon already exists
    const existingSalon = await Salon.findOne({ email });
    if (existingSalon) {
      return res.status(400).json({ message: 'Salon with this email already exists' });
    }

    // Create new salon
    const salon = new Salon({
      name,
      email,
      password,
      phone,
      address
    });

    await salon.save();

    // Generate token
    const token = generateToken(salon._id);

    res.status(201).json({
      token,
      salon: {
        id: salon._id,
        name: salon.name,
        email: salon.email,
        phone: salon.phone,
        address: salon.address
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login salon
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find salon by email
    const salon = await Salon.findOne({ email });
    if (!salon) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await salon.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(salon._id);

    res.json({
      token,
      salon: {
        id: salon._id,
        name: salon.name,
        email: salon.email,
        phone: salon.phone,
        address: salon.address
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;


