const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
const initSqlJs = require('sql.js');
const seedData = require('./seedData');

let dbDriver = null; // 'mysql' or 'sqlite'
let mysqlPool = null;
let sqliteDb = null;
let initPromise = null;

// Normalizes MySQL connection options from env
function getMysqlConfig() {
  const url = process.env.DATABASE_URL || process.env.MYSQL_URL;
  if (url) {
    return {
      uri: url,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false }
    };
  }

  const host = process.env.DB_HOST;
  if (!host || host === 'CHANGE_ME_HOST') {
    return null;
  }

  return {
    host: host,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'campus_lost_found',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  };
}

async function initSqlite() {
  const possiblePaths = [
    path.join(__dirname, 'sql-wasm.wasm'),
    path.join(__dirname, '../public/sql-wasm.wasm'),
    path.join(__dirname, '../node_modules/sql.js/dist/sql-wasm.wasm'),
    path.join(process.cwd(), 'public/sql-wasm.wasm'),
    path.join(process.cwd(), 'node_modules/sql.js/dist/sql-wasm.wasm')
  ];

  let wasmBinaryPath = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      wasmBinaryPath = p;
      break;
    }
  }

  const SQL = await initSqlJs(wasmBinaryPath ? { locateFile: () => wasmBinaryPath } : undefined);
  const db = new SQL.Database();

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      username TEXT PRIMARY KEY,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      student_id TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      department TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS found_items (
      found_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      item_name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      found_date TEXT NOT NULL,
      found_location TEXT NOT NULL,
      finder_contact_information TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      item_image TEXT DEFAULT NULL
    );

    CREATE TABLE IF NOT EXISTS lost_items (
      lost_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      item_name TEXT NOT NULL,
      category TEXT NOT NULL,
      lost_date TEXT NOT NULL,
      lost_location TEXT NOT NULL,
      contact_information TEXT NOT NULL,
      secret_information TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      description TEXT,
      item_image TEXT DEFAULT NULL
    );

    CREATE TABLE IF NOT EXISTS matches (
      match_id INTEGER PRIMARY KEY AUTOINCREMENT,
      lost_id INTEGER NOT NULL,
      found_id INTEGER NOT NULL,
      item_name_score REAL DEFAULT 0.00,
      description_score REAL NOT NULL DEFAULT 0.00,
      category_score REAL DEFAULT 0.00,
      location_score REAL DEFAULT 0.00,
      date_score REAL DEFAULT 0.00,
      match_percentage REAL NOT NULL,
      status TEXT DEFAULT 'Pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      finder_status TEXT DEFAULT 'Pending',
      owner_status TEXT DEFAULT 'Pending',
      claim_status TEXT NOT NULL DEFAULT 'Not Claimed'
    );

    CREATE TABLE IF NOT EXISTS notifications (
      notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      match_id INTEGER DEFAULT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      receiver TEXT DEFAULT NULL
    );
  `);

  // Seed initial data
  for (const a of seedData.admins) {
    db.run("INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)", [a.username, a.password]);
  }
  for (const u of seedData.users) {
    db.run(
      "INSERT OR IGNORE INTO users (user_id, full_name, student_id, email, department, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [u.user_id, u.full_name, u.student_id, u.email, u.department, u.password, u.role, u.created_at]
    );
  }
  for (const f of seedData.found_items) {
    db.run(
      "INSERT OR IGNORE INTO found_items (found_id, user_id, item_name, category, description, found_date, found_location, finder_contact_information, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [f.found_id, f.user_id, f.item_name, f.category, f.description, f.found_date, f.found_location, f.finder_contact_information, f.status, f.created_at]
    );
  }
  for (const l of seedData.lost_items) {
    db.run(
      "INSERT OR IGNORE INTO lost_items (lost_id, user_id, item_name, category, lost_date, lost_location, contact_information, secret_information, status, created_at, description, item_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [l.lost_id, l.user_id, l.item_name, l.category, l.lost_date, l.lost_location, l.contact_information, l.secret_information, l.status, l.created_at, l.description, l.item_image]
    );
  }
  for (const m of seedData.matches) {
    db.run(
      "INSERT OR IGNORE INTO matches (match_id, lost_id, found_id, item_name_score, description_score, category_score, location_score, date_score, match_percentage, status, created_at, finder_status, owner_status, claim_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [m.match_id, m.lost_id, m.found_id, m.item_name_score, m.description_score, m.category_score, m.location_score, m.date_score, m.match_percentage, m.status, m.created_at, m.finder_status, m.owner_status, m.claim_status]
    );
  }
  for (const n of seedData.notifications) {
    db.run(
      "INSERT OR IGNORE INTO notifications (notification_id, user_id, match_id, title, message, is_read, created_at, receiver) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [n.notification_id, n.user_id, n.match_id, n.title, n.message, n.is_read, n.created_at, n.receiver]
    );
  }

  sqliteDb = db;
  dbDriver = 'sqlite';
  console.log('[DB] Embedded database initialized successfully with sample data.');
}

async function initMysql(cfg) {
  const pool = cfg.uri ? mysql.createPool(cfg.uri) : mysql.createPool(cfg);
  // Verify connection
  const conn = await pool.getConnection();
  conn.release();

  // Create tables if missing
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      username varchar(50) NOT NULL PRIMARY KEY,
      password varchar(255) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
      full_name varchar(100) NOT NULL,
      student_id varchar(30) NOT NULL UNIQUE,
      email varchar(100) NOT NULL UNIQUE,
      department varchar(50) NOT NULL,
      password varchar(255) NOT NULL,
      role enum('user','admin') DEFAULT 'user',
      created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS found_items (
      found_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
      user_id int NOT NULL,
      item_name varchar(100) NOT NULL,
      category enum('Electronics','Documents','Accessories','Books & Stationery','Others') NOT NULL,
      description text,
      found_date date NOT NULL,
      found_location varchar(150) NOT NULL,
      finder_contact_information varchar(100) NOT NULL,
      status varchar(20) NOT NULL DEFAULT 'Pending',
      created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      KEY user_id (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS lost_items (
      lost_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
      user_id int NOT NULL,
      item_name varchar(100) NOT NULL,
      category enum('Electronics','Documents','Accessories','Books & Stationery','Others') NOT NULL,
      lost_date date NOT NULL,
      lost_location varchar(150) NOT NULL,
      contact_information varchar(100) NOT NULL,
      secret_information varchar(255) NOT NULL,
      status varchar(20) NOT NULL DEFAULT 'Pending',
      created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      description text,
      item_image varchar(255) DEFAULT NULL,
      KEY user_id (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS matches (
      match_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
      lost_id int NOT NULL,
      found_id int NOT NULL,
      item_name_score decimal(5,2) DEFAULT '0.00',
      description_score decimal(5,2) NOT NULL DEFAULT '0.00',
      category_score decimal(5,2) DEFAULT '0.00',
      location_score decimal(5,2) DEFAULT '0.00',
      date_score decimal(5,2) DEFAULT '0.00',
      match_percentage decimal(5,2) NOT NULL,
      status varchar(20) DEFAULT 'Pending',
      created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      finder_status varchar(20) DEFAULT 'Pending',
      owner_status varchar(20) DEFAULT 'Pending',
      claim_status varchar(20) NOT NULL DEFAULT 'Not Claimed',
      KEY lost_id (lost_id),
      KEY found_id (found_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      notification_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
      user_id int NOT NULL,
      match_id int DEFAULT NULL,
      title varchar(100) NOT NULL,
      message text NOT NULL,
      is_read tinyint(1) DEFAULT '0',
      created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      receiver varchar(20) DEFAULT NULL,
      KEY user_id (user_id),
      KEY match_id (match_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Seed default admin if table is empty
  const [adminRows] = await pool.query("SELECT COUNT(*) as cnt FROM admins");
  if (adminRows[0].cnt === 0) {
    for (const a of seedData.admins) {
      await pool.query("INSERT IGNORE INTO admins (username, password) VALUES (?, ?)", [a.username, a.password]);
    }
    for (const u of seedData.users) {
      await pool.query(
        "INSERT IGNORE INTO users (user_id, full_name, student_id, email, department, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [u.user_id, u.full_name, u.student_id, u.email, u.department, u.password, u.role, u.created_at]
      );
    }
  }

  mysqlPool = pool;
  dbDriver = 'mysql';
  console.log('[DB] Connected to MySQL database successfully.');
}

async function ensureDb() {
  if (dbDriver) return;
  if (!initPromise) {
    initPromise = (async () => {
      const cfg = getMysqlConfig();
      if (cfg) {
        try {
          await initMysql(cfg);
          return;
        } catch (err) {
          console.warn('[DB] MySQL connection failed. Falling back to embedded SQLite:', err.message);
        }
      }
      await initSqlite();
    })();
  }
  await initPromise;
}

// Unified query method
async function query(sql, params = []) {
  await ensureDb();

  if (dbDriver === 'mysql') {
    const [rows] = await mysqlPool.query(sql, params);
    return rows;
  }

  // SQLite execution via sql.js
  let cleanSql = sql.trim();
  // Replace MySQL specific NOW() with datetime('now', 'localtime')
  cleanSql = cleanSql.replace(/NOW\(\)/gi, "datetime('now', 'localtime')");

  // If SELECT query
  if (/^\s*SELECT/i.test(cleanSql)) {
    const stmt = sqliteDb.prepare(cleanSql);
    if (params && params.length > 0) {
      stmt.bind(params.map(p => (p === undefined ? null : p)));
    }
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  }

  // INSERT / UPDATE / DELETE query
  sqliteDb.run(cleanSql, params ? params.map(p => (p === undefined ? null : p)) : []);
  const lastId = sqliteDb.exec("SELECT last_insert_rowid() as id");
  const insertId = lastId && lastId[0] && lastId[0].values && lastId[0].values[0] ? lastId[0].values[0][0] : 0;
  const changes = sqliteDb.getRowsModified();
  return { insertId, affectedRows: changes };
}

module.exports = {
  query,
  execute: query,
  ensureDb,
  getDbMode: () => dbDriver,
  getDriver: () => dbDriver
};
