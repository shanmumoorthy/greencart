const express = require('express');
const router = express.Router();
const RouteModel = require('../models/Route');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { routeId, distanceKm, trafficLevel, baseTimeMinutes } = req.body;
    if(!routeId) return res.status(400).json({ error: 'routeId required' });
    const r = new RouteModel({ routeId, distanceKm, trafficLevel, baseTimeMinutes });
    await r.save();
    res.status(201).json(r);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/', auth, async (req, res) => {
  const list = await RouteModel.find();
  res.json(list);
});

// add update/delete similar to drivers
module.exports = router;
