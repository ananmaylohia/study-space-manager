const express = require('express');
const router = express.Router();
const db = require('../database');

// POST /noise-report - Create a noise report
router.post('/', (req, res) => {
  const { user_id, study_space_id, description } = req.body;

  if (!user_id || !study_space_id || !description) {
    return res.status(400).json({ error: 'All noise report fields are required' });
  }

  const timestamp = new Date().toISOString();

  const result = db.prepare(`
    INSERT INTO noise_reports (user_id, study_space_id, description, timestamp)
    VALUES (?, ?, ?, ?)
  `).run(user_id, study_space_id, description, timestamp);

  const report = db.prepare(`
    SELECT n.*, u.email AS user_email, s.name AS space_name
    FROM noise_reports n
    JOIN users u ON n.user_id = u.id
    JOIN study_spaces s ON n.study_space_id = s.id
    WHERE n.id = ?
  `).get(result.lastInsertRowid);

  res.json(report);
});

// GET /noise-reports - Get all noise reports (with JOINs)
router.get('/', (req, res) => {
  const reports = db.prepare(`
    SELECT n.*, u.email AS user_email, s.name AS space_name
    FROM noise_reports n
    JOIN users u ON n.user_id = u.id
    JOIN study_spaces s ON n.study_space_id = s.id
    ORDER BY n.timestamp DESC
  `).all();

  res.json(reports);
});

module.exports = router;
