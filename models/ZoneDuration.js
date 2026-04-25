const mongoose = require('mongoose');

const zoneDurationSchema = new mongoose.Schema({
  salonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salon',
    required: true,
    unique: true,
  },
  // Keys are zone keys (e.g. "zoneLegs"), values are minutes
  durations: {
    type: Map,
    of: Number,
    default: {},
  },
}, { timestamps: true });

module.exports = mongoose.model('ZoneDuration', zoneDurationSchema);
