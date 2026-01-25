const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'Geosensei.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
    process.exit(1);
  }
});

db.serialize(() => {
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      console.error('Error fetching tables:', err.message);
      return;
    }
    console.log('Tables in database:');
    let pending = tables.length;
    tables.forEach((table) => {
      console.log(`Table: ${table.name}`);
      db.all(`PRAGMA table_info(${table.name})`, (err, columns) => {
        if (err) {
          console.error(`Error fetching columns for table ${table.name}:`, err.message);
          pending--;
          if (pending === 0) {
            db.close();
          }
          return;
        }
        console.log('Columns:');
        columns.forEach((col) => {
          console.log(`  ${col.cid}: ${col.name} (${col.type})`);
        });
        console.log('-------------------------');
        pending--;
        if (pending === 0) {
          db.close();
        }
      });
    });
  });
});
