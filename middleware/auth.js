const jwt = require('jsonwebtoken');
const Salon = require('../models/Salon');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const salon = await Salon.findById(decoded.id).select('-password');

    if (!salon) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // Check subscription — block if trial expired or canceled
    const status = salon.subscriptionStatus;
    const trialExpired =
      status === 'trialing' && salon.trialEndsAt && new Date() > salon.trialEndsAt;

    if (trialExpired) {
      salon.subscriptionStatus = 'inactive';
      await salon.save();
    }

    const blocked = trialExpired || status === 'inactive' || status === 'canceled';
    if (blocked) {
      return res.status(402).json({
        message: 'Subscription required',
        subscriptionStatus: salon.subscriptionStatus,
      });
    }

    req.salon = salon;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
