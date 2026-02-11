const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/spaces - Get all study spaces
router.get('/', (req, res) => {
  const spaces = db.prepare('SELECT * FROM study_spaces').all();
  res.json(spaces);
});

module.exports = router;
