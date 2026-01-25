const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Open SQLite database file (database.sqlite in backend directory)
const dbPath = path.resolve(__dirname, 'Geosensei.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

module.exports = {
  db
};
