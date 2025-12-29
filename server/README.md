# Study Space Booking System - Backend

A simple Node.js + Express + SQLite backend for the Study Space Booking System.

## Setup

1. Navigate to the server folder:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:5000`.

## Database

SQLite database file (`study_spaces.db`) is created automatically in the server folder.

### Tables

- **Users** (user_id, user_name, email, role)
- **Study_Spaces** (space_id, space_name, location, capacity, type)
- **Bookings** (booking_id, user_id, space_id, date, start_time, end_time, status)
- **CheckIn** (log_id, booking_id, check_in, check_out)
- **Noise_Reports** (report_id, space_id, user_id, timestamp, description)

## API Endpoints

### Users
- `POST /api/login` - Login/register user (email + role)

### Study Spaces
- `GET /api/spaces` - Get all study spaces

### Bookings
- `POST /api/bookings` - Create a booking
- `GET /api/bookings` - Get all bookings (admin)
- `GET /api/bookings/user/:userId` - Get user's bookings

### Check-in/Check-out
- `POST /api/checkin` - Check in to a booking
- `POST /api/checkout` - Check out from a booking
- `GET /api/checkins` - Get all check-in records

### Noise Reports
- `POST /api/noise` - Submit a noise report
- `GET /api/noise` - Get all noise reports (admin)
