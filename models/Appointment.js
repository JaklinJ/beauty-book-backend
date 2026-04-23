const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema({
  zone: {
    type: String,
    required: true,
    trim: true
  },
  power: {
    type: Number,
    required: true,
    min: 0
  },
  pulseWidth: {
    type: Number,
    default: null,
    min: 0
  },
  frequency: {
    type: Number,
    default: null,
    min: 0
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  }
}, { _id: false });

const appointmentSchema = new mongoose.Schema({
  salonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salon',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  treatments: [treatmentSchema],
  skinType: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  laserType: {
    type: String,
    enum: ['Diode', 'Alexandrite', null],
    default: null,
  },
  cooling: {
    type: String,
    enum: ['low', 'medium', 'high', null],
    default: null,
  },
  skinReaction: {
    type: String,
    enum: ['none', 'mild', 'moderate', 'severe', null],
    default: null,
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
appointmentSchema.index({ salonId: 1, customerId: 1, date: -1 });

module.exports = mongoose.model('Appointment', appointmentSchema);


