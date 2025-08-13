const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// For simplicity: a single manager seeded from env. In production use a User model.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; // plaintext seed - in production hash & store

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({ error: 'email and password required' });
  if(email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'invalid credentials' });
  }
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

module.exports = router;
