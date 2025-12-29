const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ============ USERS ============

// POST /api/login - Login user (no password required)
app.post('/api/login', (req, res) => {
  const { email, role } = req.body;
  
  if (!email || !role) {
    return res.status(400).json({ error: 'Email and role are required' });
  }

  // Check if user exists
  let user = db.prepare('SELECT * FROM Users WHERE email = ?').get(email);
  
  if (!user) {
    // Create new user
    const userName = email.split('@')[0]; // Simple name extraction
    const result = db.prepare('INSERT INTO Users (user_name, email, role) VALUES (?, ?, ?)').run(userName, email, role);
    user = db.prepare('SELECT * FROM Users WHERE user_id = ?').get(result.lastInsertRowid);
  }
  
  res.json(user);
});

// ============ STUDY SPACES ============

// GET /api/spaces - Get all study spaces
app.get('/api/spaces', (req, res) => {
  const spaces = db.prepare('SELECT * FROM Study_Spaces').all();
  res.json(spaces);
});

// ============ BOOKINGS ============

// POST /api/bookings - Create a booking
app.post('/api/bookings', (req, res) => {
  const { user_id, space_id, date, start_time, end_time } = req.body;
  
  if (!user_id || !space_id || !date || !start_time || !end_time) {
    return res.status(400).json({ error: 'All booking fields are required' });
  }

  const result = db.prepare(`
    INSERT INTO Bookings (user_id, space_id, date, start_time, end_time, status)
    VALUES (?, ?, ?, ?, ?, 'active')
  `).run(user_id, space_id, date, start_time, end_time);
  
  const booking = db.prepare('SELECT * FROM Bookings WHERE booking_id = ?').get(result.lastInsertRowid);
  res.json(booking);
});

// GET /api/bookings/user/:userId - Get bookings for a specific user
app.get('/api/bookings/user/:userId', (req, res) => {
  const { userId } = req.params;
  
  const bookings = db.prepare(`
    SELECT b.*, u.email as user_email, s.space_name 
    FROM Bookings b
    JOIN Users u ON b.user_id = u.user_id
    JOIN Study_Spaces s ON b.space_id = s.space_id
    WHERE b.user_id = ?
    ORDER BY b.date DESC, b.start_time DESC
  `).all(userId);
  
  res.json(bookings);
});

// GET /api/bookings - Get all bookings (admin)
app.get('/api/bookings', (req, res) => {
  const bookings = db.prepare(`
    SELECT b.*, u.email as user_email, s.space_name 
    FROM Bookings b
    JOIN Users u ON b.user_id = u.user_id
    JOIN Study_Spaces s ON b.space_id = s.space_id
    ORDER BY b.date DESC, b.start_time DESC
  `).all();
  
  res.json(bookings);
});

// ============ CHECK-IN / CHECK-OUT ============

// POST /api/checkin - Check in to a booking
app.post('/api/checkin', (req, res) => {
  const { booking_id } = req.body;
  
  if (!booking_id) {
    return res.status(400).json({ error: 'Booking ID is required' });
  }

  const checkInTime = new Date().toISOString();
  
  // Check if CheckIn record exists
  let checkInRecord = db.prepare('SELECT * FROM CheckIn WHERE booking_id = ?').get(booking_id);
  
  if (checkInRecord) {
    db.prepare('UPDATE CheckIn SET check_in = ? WHERE booking_id = ?').run(checkInTime, booking_id);
  } else {
    db.prepare('INSERT INTO CheckIn (booking_id, check_in) VALUES (?, ?)').run(booking_id, checkInTime);
  }
  
  const result = db.prepare('SELECT * FROM CheckIn WHERE booking_id = ?').get(booking_id);
  res.json(result);
});

// POST /api/checkout - Check out from a booking
app.post('/api/checkout', (req, res) => {
  const { booking_id } = req.body;
  
  if (!booking_id) {
    return res.status(400).json({ error: 'Booking ID is required' });
  }

  const checkOutTime = new Date().toISOString();
  
  // Update CheckIn record
  db.prepare('UPDATE CheckIn SET check_out = ? WHERE booking_id = ?').run(checkOutTime, booking_id);
  
  // Update booking status to completed
  db.prepare('UPDATE Bookings SET status = ? WHERE booking_id = ?').run('completed', booking_id);
  
  const result = db.prepare('SELECT * FROM CheckIn WHERE booking_id = ?').get(booking_id);
  res.json(result);
});

// GET /api/checkins - Get all check-in records (admin)
app.get('/api/checkins', (req, res) => {
  const checkins = db.prepare(`
    SELECT c.*, b.date, b.start_time, b.end_time, u.email as user_email, s.space_name
    FROM CheckIn c
    JOIN Bookings b ON c.booking_id = b.booking_id
    JOIN Users u ON b.user_id = u.user_id
    JOIN Study_Spaces s ON b.space_id = s.space_id
    ORDER BY c.check_in DESC
  `).all();
  
  res.json(checkins);
});

// ============ NOISE REPORTS ============

// POST /api/noise - Create a noise report
app.post('/api/noise', (req, res) => {
  const { space_id, user_id, description } = req.body;
  
  if (!space_id || !user_id || !description) {
    return res.status(400).json({ error: 'All noise report fields are required' });
  }

  const timestamp = new Date().toISOString();
  
  const result = db.prepare(`
    INSERT INTO Noise_Reports (space_id, user_id, timestamp, description)
    VALUES (?, ?, ?, ?)
  `).run(space_id, user_id, timestamp, description);
  
  const report = db.prepare('SELECT * FROM Noise_Reports WHERE report_id = ?').get(result.lastInsertRowid);
  res.json(report);
});

// GET /api/noise - Get all noise reports (admin)
app.get('/api/noise', (req, res) => {
  const reports = db.prepare(`
    SELECT n.*, u.email as user_email, s.space_name
    FROM Noise_Reports n
    JOIN Users u ON n.user_id = u.user_id
    JOIN Study_Spaces s ON n.space_id = s.space_id
    ORDER BY n.timestamp DESC
  `).all();
  
  res.json(reports);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /api/login');
  console.log('  GET  /api/spaces');
  console.log('  POST /api/bookings');
  console.log('  GET  /api/bookings');
  console.log('  GET  /api/bookings/user/:userId');
  console.log('  POST /api/checkin');
  console.log('  POST /api/checkout');
  console.log('  GET  /api/checkins');
  console.log('  POST /api/noise');
  console.log('  GET  /api/noise');
});
