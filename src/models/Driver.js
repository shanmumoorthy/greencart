const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  currentShiftHours: { type: Number, default: 0 },
  past7daysHours: { type: [Number], default: [] }, // length 7
  fatigueNextDay: { type: Boolean, default: false } // calculated flag
});

module.exports = mongoose.model('Driver', DriverSchema);
