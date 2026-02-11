const db = require('./database');

// Seed study spaces if empty
const count = db.prepare('SELECT COUNT(*) as count FROM study_spaces').get();
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO study_spaces (name, location, capacity, total_seats, type) VALUES (?, ?, ?, ?, ?)
  `);

  insert.run('Library Zone A', 'Main Library, 2nd Floor', 20, 20, 'silent');
  insert.run('Group Study Room 1', 'Academic Block, Room 101', 8, 8, 'discussion');
  insert.run('Open Study Hall', 'Student Center', 50, 50, 'open');
  insert.run('Library Zone B', 'Main Library, 3rd Floor', 15, 15, 'silent');
  insert.run('Seminar Room 2', 'Academic Block, Room 205', 12, 12, 'discussion');

  console.log('✓ Study spaces seeded');
} else {
  console.log('Study spaces already exist, skipping seed');
}
