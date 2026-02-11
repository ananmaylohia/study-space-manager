# Study Space Booking System - Backend

Node.js + Express + SQLite backend.

## Setup

```bash
cd server
npm install
npm start
```

Server runs on `http://localhost:5000`.

## Project Structure

```
server/
├── index.js          # Express app entry point
├── database.js       # SQLite schema & connection
├── seed.js           # Seed default study spaces
├── package.json
└── routes/
    ├── users.js        # POST /api/login
    ├── spaces.js       # GET /api/spaces
    ├── bookings.js     # CRUD bookings + check-in/out
    └── noiseReports.js # Noise report endpoints
```

## Tables

- **users** (id, email, password, role)
- **study_spaces** (id, name, location, capacity, total_seats, type)
- **bookings** (id, user_id, study_space_id, booking_date, start_time, end_time, status, check_in_time, check_out_time)
- **noise_reports** (id, user_id, study_space_id, description, timestamp)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/login | Login/register user |
| GET | /api/spaces | Get all study spaces |
| POST | /bookings | Create a booking |
| GET | /bookings | Get all bookings (admin) |
| GET | /bookings/user/:userId | Get user bookings |
| PUT | /bookings/:id/checkin | Check in |
| PUT | /bookings/:id/checkout | Check out |
| POST | /noise-report | Submit noise report |
| GET | /noise-reports | Get all noise reports |
