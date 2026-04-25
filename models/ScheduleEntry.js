const mongoose = require('mongoose');

const scheduleEntrySchema = new mongoose.Schema({
  salonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salon',
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  zones: {
    type: [String],
    default: [],
  },
  duration: {
    type: Number,
    default: null,
  },
  notes: {
    type: String,
    trim: true,
    default: null,
  },
}, {
  timestamps: true,
});

scheduleEntrySchema.index({ salonId: 1, date: 1 });

module.exports = mongoose.model('ScheduleEntry', scheduleEntrySchema);
