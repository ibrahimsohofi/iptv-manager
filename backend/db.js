import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create SQLite database
const db = new Database(join(__dirname, '../database/iptv.db'));
db.pragma('journal_mode = WAL');

// Initialize database schema
const initDB = () => {
  // Customers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      city TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_phone ON customers(phone);
    CREATE INDEX IF NOT EXISTS idx_name ON customers(name);
  `);

  // TV Boxes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tv_boxes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      model TEXT NOT NULL,
      serial_number TEXT,
      mac_address TEXT,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'replaced', 'returned')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_customer ON tv_boxes(customer_id);
    CREATE INDEX IF NOT EXISTS idx_serial ON tv_boxes(serial_number);
  `);

  // Subscriptions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      box_id INTEGER,
      plan_duration INTEGER NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'expired', 'cancelled')),
      price REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
      FOREIGN KEY (box_id) REFERENCES tv_boxes(id) ON DELETE SET NULL
    );
    CREATE INDEX IF NOT EXISTS idx_customer_sub ON subscriptions(customer_id);
    CREATE INDEX IF NOT EXISTS idx_status ON subscriptions(status);
    CREATE INDEX IF NOT EXISTS idx_end_date ON subscriptions(end_date);
  `);

  // IPTV Accounts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS iptv_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subscription_id INTEGER NOT NULL,
      server_url TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_subscription ON iptv_accounts(subscription_id);
  `);
};

// Initialize database on startup
initDB();

// MySQL-compatible query wrapper
const pool = {
  query: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      try {
        // Handle different query types
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
          const stmt = db.prepare(sql);
          const rows = params.length > 0 ? stmt.all(...params) : stmt.all();
          resolve([rows]);
        } else if (sql.trim().toUpperCase().startsWith('INSERT')) {
          const stmt = db.prepare(sql);
          const result = params.length > 0 ? stmt.run(...params) : stmt.run();
          resolve([{ insertId: result.lastInsertRowid }]);
        } else if (sql.trim().toUpperCase().startsWith('UPDATE') ||
                   sql.trim().toUpperCase().startsWith('DELETE')) {
          const stmt = db.prepare(sql);
          const result = params.length > 0 ? stmt.run(...params) : stmt.run();
          resolve([{ affectedRows: result.changes }]);
        } else {
          // For other queries (CREATE, DROP, etc.)
          db.exec(sql);
          resolve([]);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
};

export default pool;
