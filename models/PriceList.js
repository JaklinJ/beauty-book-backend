const mongoose = require('mongoose');

const priceListSchema = new mongoose.Schema({
  salonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salon',
    required: true,
    unique: true,
  },
  // Keys are zone keys (e.g. "zoneLegs"), values are prices
  prices: {
    type: Map,
    of: Number,
    default: {},
  },
}, { timestamps: true });

module.exports = mongoose.model('PriceList', priceListSchema);
