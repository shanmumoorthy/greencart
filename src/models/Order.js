const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  valueRs: { type: Number, required: true },
  assignedRoute: { type: String, required: true }, // routeId
  deliveryTimestamp: { type: Date, required: true },
  // for simulation tracking:
  deliveredAt: { type: Date },
  deliveredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  status: { type: String, enum: ['pending','delivered','failed'], default: 'pending' }
});

module.exports = mongoose.model('Order', OrderSchema);
