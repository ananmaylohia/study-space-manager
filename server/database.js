const Database = require('better-sqlite3');
const path = require('path');

// Create database file in server folder
const db = new Database(path.join(__dirname, 'study_spaces.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  -- Users table
  CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK(role IN ('student', 'admin')) NOT NULL
  );

  -- Study Spaces table
  CREATE TABLE IF NOT EXISTS Study_Spaces (
    space_id INTEGER PRIMARY KEY AUTOINCREMENT,
    space_name TEXT NOT NULL,
    location TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    type TEXT CHECK(type IN ('silent', 'discussion', 'open')) NOT NULL
  );

  -- Bookings table
  CREATE TABLE IF NOT EXISTS Bookings (
    booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    space_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    status TEXT CHECK(status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (space_id) REFERENCES Study_Spaces(space_id)
  );

  -- CheckIn table
  CREATE TABLE IF NOT EXISTS CheckIn (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    check_in TEXT,
    check_out TEXT,
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id)
  );

  -- Noise Reports table
  CREATE TABLE IF NOT EXISTS Noise_Reports (
    report_id INTEGER PRIMARY KEY AUTOINCREMENT,
    space_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    timestamp TEXT NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (space_id) REFERENCES Study_Spaces(space_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
  );
`);

// Insert default study spaces if empty
const spaceCount = db.prepare('SELECT COUNT(*) as count FROM Study_Spaces').get();
if (spaceCount.count === 0) {
  const insertSpace = db.prepare(`
    INSERT INTO Study_Spaces (space_name, location, capacity, type) VALUES (?, ?, ?, ?)
  `);
  
  insertSpace.run('Library Zone A', 'Main Library, 2nd Floor', 20, 'silent');
  insertSpace.run('Group Study Room 1', 'Academic Block, Room 101', 8, 'discussion');
  insertSpace.run('Open Study Hall', 'Student Center', 50, 'open');
  insertSpace.run('Library Zone B', 'Main Library, 3rd Floor', 15, 'silent');
  insertSpace.run('Seminar Room 2', 'Academic Block, Room 205', 12, 'discussion');
  
  console.log('Default study spaces inserted');
}

module.exports = db;
