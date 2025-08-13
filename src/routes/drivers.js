const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const auth = require('../middleware/auth');

// Create
router.post('/', auth, async (req, res) => {
  try {
    const { name, currentShiftHours = 0, past7daysHours = [] } = req.body;
    if(!name) return res.status(400).json({ error: 'name required' });
    const d = new Driver({ name, currentShiftHours, past7daysHours });
    await d.save();
    res.status(201).json(d);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// Read all
router.get('/', auth, async (req, res) => {
  const drivers = await Driver.find();
  res.json(drivers);
});

// Read one
router.get('/:id', auth, async (req, res) => {
  const d = await Driver.findById(req.params.id);
  if(!d) return res.status(404).json({ error: 'not found' });
  res.json(d);
});

// Update
router.put('/:id', auth, async (req, res) => {
  const d = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if(!d) return res.status(404).json({ error: 'not found' });
  res.json(d);
});

// Delete
router.delete('/:id', auth, async (req, res) => {
  await Driver.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
