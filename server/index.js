const express = require('express');
const cors = require('cors');

// Initialize database and seed data
require('./database');
require('./seed');

// Import routes
const usersRouter = require('./routes/users');
const spacesRouter = require('./routes/spaces');
const bookingsRouter = require('./routes/bookings');
const noiseReportsRouter = require('./routes/noiseReports');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', usersRouter);
app.use('/api/spaces', spacesRouter);
app.use('/bookings', bookingsRouter);
app.use('/noise-report', noiseReportsRouter);
app.use('/noise-reports', noiseReportsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  POST   /api/login');
  console.log('  GET    /api/spaces');
  console.log('  POST   /bookings');
  console.log('  GET    /bookings');
  console.log('  GET    /bookings/user/:userId');
  console.log('  PUT    /bookings/:id/checkin');
  console.log('  PUT    /bookings/:id/checkout');
  console.log('  POST   /noise-report');
  console.log('  GET    /noise-reports');
});
