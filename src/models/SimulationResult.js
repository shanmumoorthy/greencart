const mongoose = require('mongoose');

const SimulationSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  inputs: { type: Object },
  results: { type: Object }
});

module.exports = mongoose.model('SimulationResult', SimulationSchema);
