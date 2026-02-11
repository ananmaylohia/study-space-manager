const express = require('express');
const router = express.Router();
const db = require('../database');

// POST /bookings - Create a booking
router.post('/', (req, res) => {
  const { user_id, study_space_id, booking_date, start_time, end_time } = req.body;

  if (!user_id || !study_space_id || !booking_date || !start_time || !end_time) {
    return res.status(400).json({ error: 'All booking fields are required' });
  }

  const result = db.prepare(`
    INSERT INTO bookings (user_id, study_space_id, booking_date, start_time, end_time, status)
    VALUES (?, ?, ?, ?, ?, 'active')
  `).run(user_id, study_space_id, booking_date, start_time, end_time);

  const booking = db.prepare(`
    SELECT b.*, u.email AS user_email, s.name AS space_name
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN study_spaces s ON b.study_space_id = s.id
    WHERE b.id = ?
  `).get(result.lastInsertRowid);

  res.json(booking);
});

// GET /bookings - Get all bookings (with JOINs for admin)
router.get('/', (req, res) => {
  const bookings = db.prepare(`
    SELECT b.*, u.email AS user_email, s.name AS space_name
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN study_spaces s ON b.study_space_id = s.id
    ORDER BY b.booking_date DESC, b.start_time DESC
  `).all();

  res.json(bookings);
});

// GET /bookings/user/:userId - Get bookings for a specific user
router.get('/user/:userId', (req, res) => {
  const bookings = db.prepare(`
    SELECT b.*, u.email AS user_email, s.name AS space_name
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN study_spaces s ON b.study_space_id = s.id
    WHERE b.user_id = ?
    ORDER BY b.booking_date DESC, b.start_time DESC
  `).all(req.params.userId);

  res.json(bookings);
});

// PUT /bookings/:id/checkin
router.put('/:id/checkin', (req, res) => {
  const { id } = req.params;
  const checkInTime = new Date().toISOString();

  db.prepare('UPDATE bookings SET check_in_time = ? WHERE id = ?').run(checkInTime, id);

  const booking = db.prepare(`
    SELECT b.*, u.email AS user_email, s.name AS space_name
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN study_spaces s ON b.study_space_id = s.id
    WHERE b.id = ?
  `).get(id);

  res.json(booking);
});

// PUT /bookings/:id/checkout
router.put('/:id/checkout', (req, res) => {
  const { id } = req.params;
  const checkOutTime = new Date().toISOString();

  db.prepare('UPDATE bookings SET check_out_time = ?, status = ? WHERE id = ?').run(checkOutTime, 'completed', id);

  const booking = db.prepare(`
    SELECT b.*, u.email AS user_email, s.name AS space_name
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN study_spaces s ON b.study_space_id = s.id
    WHERE b.id = ?
  `).get(id);

  res.json(booking);
});

module.exports = router;
