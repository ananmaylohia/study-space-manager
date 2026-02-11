const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'study_spaces.db'));
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT DEFAULT '',
    role TEXT CHECK(role IN ('student', 'admin')) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS study_spaces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    total_seats INTEGER NOT NULL,
    type TEXT CHECK(type IN ('silent', 'discussion', 'open')) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    study_space_id INTEGER NOT NULL,
    booking_date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    status TEXT CHECK(status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
    check_in_time TEXT,
    check_out_time TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (study_space_id) REFERENCES study_spaces(id)
  );

  CREATE TABLE IF NOT EXISTS noise_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    study_space_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (study_space_id) REFERENCES study_spaces(id)
  );
`);

module.exports = db;
