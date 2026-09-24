-- TravelMate Minimal Persistent Database Schema
-- Database: SQLite / PostgreSQL compatible

CREATE TABLE IF NOT EXISTS trips (
    id TEXT PRIMARY KEY,
    destination TEXT NOT NULL,
    start_date TEXT,
    end_date TEXT,
    duration INTEGER DEFAULT 1,
    budget REAL NOT NULL,
    currency TEXT DEFAULT '$',
    travellers_count INTEGER DEFAULT 1,
    traveller_type TEXT,
    travel_style TEXT,
    accommodation TEXT,
    pace TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS itinerary (
    id TEXT PRIMARY KEY,
    trip_id TEXT NOT NULL,
    day_number INTEGER NOT NULL,
    city TEXT NOT NULL,
    hotel TEXT,
    activities TEXT NOT NULL, -- JSON string containing morning, afternoon, evening activities
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS packing (
    id TEXT PRIMARY KEY,
    trip_id TEXT NOT NULL,
    item_name TEXT NOT NULL,
    category TEXT NOT NULL,
    is_checked INTEGER DEFAULT 0,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS budget (
    id TEXT PRIMARY KEY,
    trip_id TEXT NOT NULL,
    category TEXT NOT NULL,
    allocated_amount REAL DEFAULT 0,
    spent_amount REAL DEFAULT 0,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);
