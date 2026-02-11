const express = require('express');
const router = express.Router();
const db = require('../database');

// POST /api/login - Login/register user
router.post('/login', (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ error: 'Email and role are required' });
  }

  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!user) {
    const name = email.split('@')[0];
    const result = db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)').run(email, '', role);
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  }

  res.json(user);
});

module.exports = router;
