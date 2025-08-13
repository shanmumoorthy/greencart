const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { orderId, valueRs, assignedRoute, deliveryTimestamp } = req.body;
    if(!orderId || !valueRs || !assignedRoute || !deliveryTimestamp) {
      return res.status(400).json({ error: 'missing fields' });
    }
    const o = new Order({ orderId, valueRs, assignedRoute, deliveryTimestamp });
    await o.save();
    res.status(201).json(o);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

router.get('/', auth, async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// read/update/delete as needed
module.exports = router;
