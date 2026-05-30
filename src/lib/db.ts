import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "scsi.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initSchema(db);
  }
  return db;
}

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('transporter', 'business', 'admin')),
      company_name TEXT NOT NULL,
      gst TEXT,
      phone TEXT,
      contact_person TEXT,
      verification_status TEXT DEFAULT 'pending' CHECK(verification_status IN ('pending', 'approved', 'rejected')),
      green_score INTEGER DEFAULT 50,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS trucks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transporter_id INTEGER NOT NULL REFERENCES users(id),
      vehicle_number TEXT NOT NULL,
      capacity REAL NOT NULL,
      vehicle_type TEXT NOT NULL,
      driver_name TEXT NOT NULL,
      driver_phone TEXT NOT NULL,
      status TEXT DEFAULT 'available' CHECK(status IN ('available', 'on_trip'))
    );

    CREATE TABLE IF NOT EXISTS routes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transporter_id INTEGER NOT NULL REFERENCES users(id),
      truck_id INTEGER NOT NULL REFERENCES trucks(id),
      from_city TEXT NOT NULL,
      to_city TEXT NOT NULL,
      from_lat REAL NOT NULL,
      from_lng REAL NOT NULL,
      to_lat REAL NOT NULL,
      to_lng REAL NOT NULL,
      distance_km REAL NOT NULL,
      capacity_available REAL NOT NULL,
      departure_time TEXT NOT NULL,
      status TEXT DEFAULT 'open' CHECK(status IN ('open', 'matched', 'completed', 'cancelled')),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS shipments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_id INTEGER NOT NULL REFERENCES users(id),
      from_city TEXT NOT NULL,
      to_city TEXT NOT NULL,
      from_lat REAL NOT NULL,
      from_lng REAL NOT NULL,
      to_lat REAL NOT NULL,
      to_lng REAL NOT NULL,
      distance_km REAL NOT NULL,
      cargo_type TEXT NOT NULL,
      weight REAL NOT NULL,
      volume REAL,
      pickup_date TEXT NOT NULL,
      deadline TEXT NOT NULL,
      status TEXT DEFAULT 'open' CHECK(status IN ('open', 'matched', 'in_transit', 'delivered', 'cancelled')),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      route_id INTEGER NOT NULL REFERENCES routes(id),
      shipment_id INTEGER NOT NULL REFERENCES shipments(id),
      match_score REAL NOT NULL,
      estimated_revenue REAL NOT NULL,
      estimated_cost REAL NOT NULL,
      fuel_saved REAL NOT NULL,
      co2_saved REAL NOT NULL,
      status TEXT DEFAULT 'proposed' CHECK(status IN ('proposed', 'accepted', 'rejected')),
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(route_id, shipment_id)
    );

    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      match_id INTEGER NOT NULL REFERENCES matches(id),
      route_id INTEGER NOT NULL REFERENCES routes(id),
      shipment_id INTEGER NOT NULL REFERENCES shipments(id),
      transporter_id INTEGER NOT NULL REFERENCES users(id),
      business_id INTEGER NOT NULL REFERENCES users(id),
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'picked_up', 'in_transit', 'delivered', 'cancelled')),
      current_lat REAL NOT NULL,
      current_lng REAL NOT NULL,
      eta TEXT,
      distance_remaining REAL,
      fuel_saved REAL NOT NULL,
      co2_saved REAL NOT NULL,
      revenue REAL NOT NULL,
      cost REAL NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      completed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      action TEXT NOT NULL,
      details TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS platform_stats (
      id INTEGER PRIMARY KEY CHECK(id = 1),
      trips_matched INTEGER DEFAULT 0,
      empty_trips_avoided INTEGER DEFAULT 0,
      fuel_saved REAL DEFAULT 0,
      co2_reduced REAL DEFAULT 0
    );

    INSERT OR IGNORE INTO platform_stats (id) VALUES (1);
  `);
}

export function logActivity(userId: number | null, action: string, details: string) {
  getDb()
    .prepare("INSERT INTO activities (user_id, action, details) VALUES (?, ?, ?)")
    .run(userId, action, details);
}

export function updatePlatformStats(fuelSaved: number, co2Saved: number) {
  getDb()
    .prepare(
      `UPDATE platform_stats SET
        trips_matched = trips_matched + 1,
        empty_trips_avoided = empty_trips_avoided + 1,
        fuel_saved = fuel_saved + ?,
        co2_reduced = co2_reduced + ?
      WHERE id = 1`
    )
    .run(fuelSaved, co2Saved);
}
