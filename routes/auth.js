const express = require('express');
const jwt = require('jsonwebtoken');
const Stripe = require('stripe');
const Salon = require('../models/Salon');
const router = express.Router();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

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
  subscriptionStatus: salon.subscriptionStatus,
  trialEndsAt: salon.trialEndsAt,
});

// Register salon
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const existingSalon = await Salon.findOne({ email });
    if (existingSalon) {
      return res.status(400).json({ message: 'Salon with this email already exists' });
    }

    // Create Stripe customer
    let stripeCustomerId;
    try {
      const customer = await stripe.customers.create({ email, name });
      stripeCustomerId = customer.id;
    } catch (stripeErr) {
      console.error('Stripe customer creation error:', stripeErr.message);
    }

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    const salon = new Salon({
      name,
      email,
      password,
      phone,
      address,
      stripeCustomerId,
      subscriptionStatus: 'trialing',
      trialEndsAt,
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
    const { email, password } = req.body;

    const salon = await Salon.findOne({ email });
    if (!salon) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await salon.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (salon.subscriptionStatus === 'trialing') {
      if (!salon.trialEndsAt) {
        // Existing account without a trial end date — grant 15 days from now
        salon.trialEndsAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
        await salon.save();
      } else if (new Date() > salon.trialEndsAt) {
        // Trial expired — mark as inactive
        salon.subscriptionStatus = 'inactive';
        await salon.save();
      }
    }

    const token = generateToken(salon._id);

    res.json({ token, salon: salonPayload(salon) });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
