#!/usr/bin/env python3
"""
TravelMate - Minimal Backend Server
Uses Python standard library (http.server + sqlite3) with zero external dependencies.
Endpoints:
  GET    /api/trips              - List all trips
  POST   /api/trips              - Create trip (+ default itinerary, packing, budget)
  GET    /api/trips/<id>         - Get trip details with itinerary, packing, budget
  PUT    /api/trips/<id>         - Edit trip details
  DELETE /api/trips/<id>         - Delete trip and associated records
  POST   /api/trips/<id>/itinerary - Save/update itinerary day
  POST   /api/trips/<id>/packing   - Add or update packing item
  DELETE /api/trips/<id>/packing/<item_id> - Delete packing item
  POST   /api/trips/<id>/budget    - Save/update budget and expenses
"""

import os
import json
import sqlite3
import mimetypes
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, "travelmate.db")
PORT = 8080

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    with get_db() as conn:
        conn.execute("""
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
        )
        """)

        conn.execute("""
        CREATE TABLE IF NOT EXISTS itinerary (
            id TEXT PRIMARY KEY,
            trip_id TEXT NOT NULL,
            day_number INTEGER NOT NULL,
            city TEXT NOT NULL,
            hotel TEXT,
            activities TEXT NOT NULL,
            FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
        )
        """)

        conn.execute("""
        CREATE TABLE IF NOT EXISTS packing (
            id TEXT PRIMARY KEY,
            trip_id TEXT NOT NULL,
            item_name TEXT NOT NULL,
            category TEXT NOT NULL,
            is_checked INTEGER DEFAULT 0,
            FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
        )
        """)

        conn.execute("""
        CREATE TABLE IF NOT EXISTS budget (
            id TEXT PRIMARY KEY,
            trip_id TEXT NOT NULL,
            total_budget REAL DEFAULT 0,
            currency TEXT DEFAULT '$',
            categories TEXT NOT NULL,
            expenses TEXT DEFAULT '[]',
            FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
        )
        """)

        # Check if trips table is empty, if so seed initial mock data
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM trips")
        count = cursor.fetchone()[0]
        if count == 0:
            seed_initial_data(conn)

def seed_initial_data(conn):
    # 1. Trips
    trips = [
        ("trip-1", "Kyoto & Tokyo, Japan", "2026-04-12", "2026-04-17", 5, 2400.0, "$", 2, "Couple / Pair", "Cultural & Historic", "Komorebi Boutique Ryokan", "Moderate", "Try matcha soft-serve, visit Ghibli park!"),
        ("trip-2", "Amalfi Coast, Italy", "2026-06-20", "2026-06-24", 4, 1950.0, "€", 2, "Couple / Pair", "Romantic Getaway", "Villa Bellavista Positano", "Relaxed", "Lemon granitas and boat tour."),
        ("trip-3", "Zermatt, Switzerland", "2026-09-05", "2026-09-09", 4, 2100.0, "$", 3, "Friends Squad", "Adventure & Hiking", "Chalet Edelweiss Hideaway", "Moderate", "Matterhorn hike and fondue dinner.")
    ]
    conn.executemany("""
    INSERT INTO trips (id, destination, start_date, end_date, duration, budget, currency, travellers_count, traveller_type, travel_style, accommodation, pace, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, trips)

    # 2. Itinerary for trip-1 (Kyoto & Tokyo)
    days = [
        (1, "Kyoto", "Komorebi Boutique Ryokan", [
            {"time": "Morning 09:30", "type": "morning", "icon": "🍵", "title": "Check-in & Welcome Sencha Tea", "desc": "Settle into tatami room, put on yukata, and enjoy fresh matcha mochi in the garden.", "tags": ["Check-in", "Tea Time"]},
            {"time": "Afternoon 13:30", "type": "afternoon", "icon": "⛩️", "title": "Fushimi Inari Red Torii Walk", "desc": "Hike through thousands of bright vermilion Torii gates along sacred Mount Inari.", "tags": ["Scenic Trail", "Shrine"]},
            {"time": "Evening 18:30", "type": "evening", "icon": "🏮", "title": "Gion District Lantern Walk & Ramen", "desc": "Stroll past wooden machiya townhouses along canal. Savor rich tonkotsu ramen.", "tags": ["Dinner", "Lanterns"]}
        ]),
        (2, "Kyoto", "Komorebi Boutique Ryokan", [
            {"time": "Morning 08:00", "type": "morning", "icon": "🎋", "title": "Arashiyama Bamboo Grove at Sunrise", "desc": "Listen to the rustle of towering bamboo stalks in the early morning calm.", "tags": ["Quiet", "Nature"]},
            {"time": "Afternoon 13:00", "type": "afternoon", "icon": "✨", "title": "Kinkaku-ji (Golden Pavilion)", "desc": "Marvel at the gold leaf-covered Zen temple shimmering across the pond.", "tags": ["Zen Garden", "Sightseeing"]},
            {"time": "Evening 19:00", "type": "evening", "icon": "🍱", "title": "Nishiki Market Street Food", "desc": "Sample grilled dango, candied strawberries, and cute matcha soft serve.", "tags": ["Street Food", "Souvenirs"]}
        ]),
        (3, "Kyoto", "Komorebi Boutique Ryokan", [
            {"time": "Morning 09:00", "type": "morning", "icon": "🌸", "title": "Philosopher’s Path Canal Stroll", "desc": "Gentle walk beside the stone canal lined with blossoming cherry trees.", "tags": ["Relaxed", "Scrapbook"]},
            {"time": "Afternoon 14:00", "type": "afternoon", "icon": "🏺", "title": "Handmade Pottery Workshop", "desc": "Craft your own ceramic teacup to take home as a souvenir.", "tags": ["Crafting", "Workshop"]},
            {"time": "Evening 18:30", "type": "evening", "icon": "🕯️", "title": "Kamogawa Riverbank Sunset Picnic", "desc": "Relax on grassy riverbank watching the twilight fade into starry night.", "tags": ["Picnic", "Sunset"]}
        ]),
        (4, "Tokyo", "Hotel Pastel Shibuya, Tokyo", [
            {"time": "Morning 09:00", "type": "morning", "icon": "🚅", "title": "Bullet Train (Shinkansen)", "desc": "Speed past snow-capped Mount Fuji at 300 km/h while eating bento treats.", "tags": ["Transit", "Fuji Views"]},
            {"time": "Afternoon 14:00", "type": "afternoon", "icon": "🧸", "title": "Akihabara & Cute Gachapon Hunting", "desc": "Explore retro arcade centers, capsule toy rows, and stationery shops.", "tags": ["Cute Toys", "Gachapon"]},
            {"time": "Evening 19:30", "type": "evening", "icon": "🌃", "title": "Shibuya Sky Observatory Overlook", "desc": "Stand on 360-degree rooftop deck overlooking neon glowing sea of Tokyo.", "tags": ["Night View", "Cityscape"]}
        ]),
        (5, "Tokyo", "Hotel Pastel Shibuya, Tokyo", [
            {"time": "Morning 09:30", "type": "morning", "icon": "🌲", "title": "Meiji Jingu Forest Walk", "desc": "Ancient cedar forest in the heart of Tokyo; write wish plaques at the shrine.", "tags": ["Peaceful", "Wishes"]},
            {"time": "Afternoon 13:00", "type": "afternoon", "icon": "🥞", "title": "Fluffy Soufflé Pancakes in Harajuku", "desc": "Delight in cloud-like jiggly pancakes topped with Hokkaido cream.", "tags": ["Sweet Treat", "Cute Cafe"]},
            {"time": "Evening 18:00", "type": "evening", "icon": "🛍️", "title": "Stationery Shopping & Farewell Dinner", "desc": "Stock up on washi tapes and stickers before a celebratory sukiyaki dinner.", "tags": ["Stationery", "Shopping"]}
        ])
    ]
    for day_num, city, hotel, activities in days:
        conn.execute("""
        INSERT INTO itinerary (id, trip_id, day_number, city, hotel, activities)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (f"itin-trip-1-day-{day_num}", "trip-1", day_num, city, hotel, json.dumps(activities)))

    # 3. Packing items for trip-1
    packing_items = [
        ("p-1", "trip-1", "Passport & Photocopies", "documents", 1),
        ("p-2", "trip-1", "Boarding Pass & Hotel Confirmations", "documents", 1),
        ("p-3", "trip-1", "Travel Insurance Card", "documents", 0),
        ("p-4", "trip-1", "Comfortable Walking Sneakers", "clothes", 1),
        ("p-5", "trip-1", "Pastel Cardigan / Light Jacket", "clothes", 0),
        ("p-6", "trip-1", "Cozy Pajamas & Extra Socks", "clothes", 0),
        ("p-7", "trip-1", "Sunscreen & Lip Balm", "toiletries", 1),
        ("p-8", "trip-1", "Mini Travel Toothbrush & Paste", "toiletries", 0),
        ("p-9", "trip-1", "Hydrating Face Mist", "toiletries", 0),
        ("p-10", "trip-1", "Universal Power Adapter", "tech", 1),
        ("p-11", "trip-1", "Portable Powerbank (10,000mAh)", "tech", 1),
        ("p-12", "trip-1", "Polaroid Instant Camera + Film", "tech", 0),
        ("p-13", "trip-1", "Cute Travel Journal & Pastel Gel Pens", "misc", 1),
        ("p-14", "trip-1", "Washi Tape Rolls & Glue Tape", "misc", 0),
        ("p-15", "trip-1", "Reusable Canvas Tote Bag", "misc", 0)
    ]
    conn.executemany("""
    INSERT INTO packing (id, trip_id, item_name, category, is_checked)
    VALUES (?, ?, ?, ?, ?)
    """, packing_items)

    # 4. Budget for trip-1
    categories = {
        "Flights": {"allocated": 850, "spent": 780, "color": "#F472B6"},
        "Stay": {"allocated": 750, "spent": 520, "color": "#FBBF24"},
        "Food": {"allocated": 450, "spent": 210, "color": "#34D399"},
        "Activities": {"allocated": 200, "spent": 80, "color": "#60A5FA"},
        "Shopping": {"allocated": 150, "spent": 40, "color": "#A78BFA"}
    }
    expenses = [
        {"id": "e-1", "desc": "Flight Tickets (Return)", "category": "Flights", "amount": 780},
        {"id": "e-2", "desc": "Ryokan 3 Nights Deposit", "category": "Stay", "amount": 520},
        {"id": "e-3", "desc": "Kinkaku-ji & Shrine Entry", "category": "Activities", "amount": 25},
        {"id": "e-4", "desc": "Matcha Parfait & Gion Ramen", "category": "Food", "amount": 35},
        {"id": "e-5", "desc": "Washi Tape & Kawaii Stickers", "category": "Shopping", "amount": 40},
        {"id": "e-6", "desc": "Shinkansen Bullet Train Pass", "category": "Activities", "amount": 55},
        {"id": "e-7", "desc": "Harajuku Fluffy Pancakes & Latte", "category": "Food", "amount": 28}
    ]
    conn.execute("""
    INSERT INTO budget (id, trip_id, total_budget, currency, categories, expenses)
    VALUES (?, ?, ?, ?, ?, ?)
    """, ("budget-trip-1", "trip-1", 2400.0, "$", json.dumps(categories), json.dumps(expenses)))

class TravelMateHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def _send_json(self, data, status=200):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self._send_cors_headers()
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self):
        content_len = int(self.headers.get("Content-Length", 0))
        if content_len == 0:
            return {}
        return json.loads(self.rfile.read(content_len).decode("utf-8"))

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/")
        parts = [p for p in path.split("/") if p]

        # API Routes: /api/...
        if len(parts) >= 1 and parts[0] == "api":
            if len(parts) == 2 and parts[1] == "trips":
                # GET /api/trips
                with get_db() as conn:
                    rows = conn.execute("SELECT * FROM trips ORDER BY created_at DESC").fetchall()
                    trips = [dict(r) for r in rows]
                return self._send_json(trips)

            elif len(parts) == 3 and parts[1] == "trips":
                # GET /api/trips/<id>
                trip_id = parts[2]
                with get_db() as conn:
                    trip = conn.execute("SELECT * FROM trips WHERE id = ?", (trip_id,)).fetchone()
                    if not trip:
                        return self._send_json({"error": "Trip not found"}, status=404)

                    itin_rows = conn.execute("SELECT * FROM itinerary WHERE trip_id = ? ORDER BY day_number ASC", (trip_id,)).fetchall()
                    itinerary = []
                    for r in itin_rows:
                        itinerary.append({
                            "id": r["id"],
                            "tripId": r["trip_id"],
                            "day": r["day_number"],
                            "city": r["city"],
                            "hotel": r["hotel"],
                            "slots": json.loads(r["activities"])
                        })

                    pack_rows = conn.execute("SELECT * FROM packing WHERE trip_id = ?", (trip_id,)).fetchall()
                    packing = [{
                        "id": r["id"],
                        "tripId": r["trip_id"],
                        "text": r["item_name"],
                        "category": r["category"],
                        "checked": bool(r["is_checked"])
                    } for r in pack_rows]

                    b_row = conn.execute("SELECT * FROM budget WHERE trip_id = ?", (trip_id,)).fetchone()
                    budget = None
                    if b_row:
                        budget = {
                            "id": b_row["id"],
                            "tripId": b_row["trip_id"],
                            "totalBudget": b_row["total_budget"],
                            "currency": b_row["currency"],
                            "categories": json.loads(b_row["categories"]),
                            "expenses": json.loads(b_row["expenses"])
                        }

                    return self._send_json({
                        "trip": dict(trip),
                        "itinerary": itinerary,
                        "packing": packing,
                        "budget": budget
                    })

            return self._send_json({"error": "Not Found"}, status=404)

        # Static File Serving
        clean_path = parsed.path.lstrip("/")
        if not clean_path:
            clean_path = "index.html"
        file_path = os.path.join(BASE_DIR, clean_path)

        if os.path.isfile(file_path):
            mime_type, _ = mimetypes.guess_type(file_path)
            if not mime_type:
                mime_type = "application/octet-stream"
            with open(file_path, "rb") as f:
                content = f.read()
            self.send_response(200)
            self._send_cors_headers()
            self.send_header("Content-Type", mime_type)
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        parsed = urlparse(self.path)
        parts = [p for p in parsed.path.rstrip("/").split("/") if p]

        if len(parts) >= 1 and parts[0] == "api":
            body = self._read_json()

            # POST /api/trips (Create trip + auto generate itinerary, packing, budget)
            if len(parts) == 2 and parts[1] == "trips":
                trip_id = body.get("id") or f"trip-{int(os.times().system * 1000)}"
                dest = body.get("destination", "New Dream Trip")
                s_date = body.get("start_date", "")
                e_date = body.get("end_date", "")
                duration = int(body.get("duration", 5))
                budget_val = float(body.get("budget", 1500.0))
                currency = body.get("currency", "$")
                pax_count = int(body.get("travellers_count", 2))
                pax_type = body.get("traveller_type", "Couple")
                style = body.get("travel_style", "Cultural & Historic")
                accom = body.get("accommodation", "Boutique Hotel")
                pace = body.get("pace", "Moderate")
                notes = body.get("notes", "")

                with get_db() as conn:
                    # Insert trip
                    conn.execute("""
                    INSERT OR REPLACE INTO trips (id, destination, start_date, end_date, duration, budget, currency, travellers_count, traveller_type, travel_style, accommodation, pace, notes)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (trip_id, dest, s_date, e_date, duration, budget_val, currency, pax_count, pax_type, style, accom, pace, notes))

                    # Auto-generate default itinerary if not provided
                    city_name = dest.split(",")[0].strip()
                    for d in range(1, duration + 1):
                        day_slots = [
                            {"time": "Morning 09:00", "type": "morning", "icon": "🥐", "title": f"Morning Breakfast & Cafe in {city_name}", "desc": "Cozy breakfast and planning daily scrapbook walk.", "tags": ["Breakfast", "Morning"]},
                            {"time": "Afternoon 13:30", "type": "afternoon", "icon": "🏛️", "title": f"Explore {city_name} Landmarks", "desc": f"Explore cultural highlights and historic sights at a {pace} pace.", "tags": [style, "Sightseeing"]},
                            {"time": "Evening 19:00", "type": "evening", "icon": "🌙", "title": "Dinner & Night Ambience", "desc": "Savor authentic regional cuisine followed by sunset photos.", "tags": ["Dinner", pace]}
                        ]
                        conn.execute("""
                        INSERT OR REPLACE INTO itinerary (id, trip_id, day_number, city, hotel, activities)
                        VALUES (?, ?, ?, ?, ?, ?)
                        """, (f"itin-{trip_id}-day-{d}", trip_id, d, city_name, accom, json.dumps(day_slots)))

                    # Auto-seed packing
                    default_packing = [
                        ("Passport & ID Docs", "documents"),
                        ("Comfortable Footwear", "clothes"),
                        ("Pastel Cardigan", "clothes"),
                        ("Sunscreen & Moisturizer", "toiletries"),
                        ("Camera / Phone Charger", "tech"),
                        ("Travel Journal & Pen", "misc")
                    ]
                    for idx, (item_txt, cat) in enumerate(default_packing):
                        conn.execute("""
                        INSERT OR REPLACE INTO packing (id, trip_id, item_name, category, is_checked)
                        VALUES (?, ?, ?, ?, 0)
                        """, (f"p-{trip_id}-{idx+1}", trip_id, item_txt, cat))

                    # Auto-seed budget
                    cats = {
                        "Flights": {"allocated": round(budget_val * 0.35), "spent": 0, "color": "#F472B6"},
                        "Stay": {"allocated": round(budget_val * 0.35), "spent": 0, "color": "#FBBF24"},
                        "Food": {"allocated": round(budget_val * 0.15), "spent": 0, "color": "#34D399"},
                        "Activities": {"allocated": round(budget_val * 0.10), "spent": 0, "color": "#60A5FA"},
                        "Shopping": {"allocated": round(budget_val * 0.05), "spent": 0, "color": "#A78BFA"}
                    }
                    conn.execute("""
                    INSERT OR REPLACE INTO budget (id, trip_id, total_budget, currency, categories, expenses)
                    VALUES (?, ?, ?, ?, ?, '[]')
                    """, (f"budget-{trip_id}", trip_id, budget_val, currency, json.dumps(cats)))

                return self._send_json({"success": True, "tripId": trip_id}, status=201)

            # POST /api/trips/<id>/itinerary
            elif len(parts) == 4 and parts[1] == "trips" and parts[3] == "itinerary":
                trip_id = parts[2]
                day = int(body.get("day", 1))
                city = body.get("city", "")
                hotel = body.get("hotel", "")
                slots = body.get("slots", [])
                with get_db() as conn:
                    conn.execute("""
                    INSERT OR REPLACE INTO itinerary (id, trip_id, day_number, city, hotel, activities)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """, (f"itin-{trip_id}-day-{day}", trip_id, day, city, hotel, json.dumps(slots)))
                return self._send_json({"success": True})

            # POST /api/trips/<id>/packing
            elif len(parts) == 4 and parts[1] == "trips" and parts[3] == "packing":
                trip_id = parts[2]
                item_id = body.get("id") or f"p-{trip_id}-{int(os.times().system * 1000)}"
                text = body.get("text", "")
                cat = body.get("category", "misc")
                checked = 1 if body.get("checked") else 0
                with get_db() as conn:
                    conn.execute("""
                    INSERT OR REPLACE INTO packing (id, trip_id, item_name, category, is_checked)
                    VALUES (?, ?, ?, ?, ?)
                    """, (item_id, trip_id, text, cat, checked))
                return self._send_json({"success": True, "id": item_id})

            # POST /api/trips/<id>/budget
            elif len(parts) == 4 and parts[1] == "trips" and parts[3] == "budget":
                trip_id = parts[2]
                total = float(body.get("totalBudget", 1500.0))
                currency = body.get("currency", "$")
                cats = body.get("categories", {})
                expenses = body.get("expenses", [])
                with get_db() as conn:
                    conn.execute("""
                    INSERT OR REPLACE INTO budget (id, trip_id, total_budget, currency, categories, expenses)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """, (f"budget-{trip_id}", trip_id, total, currency, json.dumps(cats), json.dumps(expenses)))
                return self._send_json({"success": True})

        return self._send_json({"error": "Not Found"}, status=404)

    def do_PUT(self):
        parsed = urlparse(self.path)
        parts = [p for p in parsed.path.rstrip("/").split("/") if p]

        # PUT /api/trips/<id>
        if len(parts) == 3 and parts[0] == "api" and parts[1] == "trips":
            trip_id = parts[2]
            body = self._read_json()
            with get_db() as conn:
                conn.execute("""
                UPDATE trips
                SET destination = COALESCE(?, destination),
                    start_date = COALESCE(?, start_date),
                    end_date = COALESCE(?, end_date),
                    duration = COALESCE(?, duration),
                    budget = COALESCE(?, budget),
                    currency = COALESCE(?, currency),
                    travellers_count = COALESCE(?, travellers_count),
                    traveller_type = COALESCE(?, traveller_type),
                    travel_style = COALESCE(?, travel_style),
                    accommodation = COALESCE(?, accommodation),
                    pace = COALESCE(?, pace),
                    notes = COALESCE(?, notes)
                WHERE id = ?
                """, (
                    body.get("destination"),
                    body.get("start_date"),
                    body.get("end_date"),
                    body.get("duration"),
                    body.get("budget"),
                    body.get("currency"),
                    body.get("travellers_count"),
                    body.get("traveller_type"),
                    body.get("travel_style"),
                    body.get("accommodation"),
                    body.get("pace"),
                    body.get("notes"),
                    trip_id
                ))
            return self._send_json({"success": True})

        return self._send_json({"error": "Not Found"}, status=404)

    def do_DELETE(self):
        parsed = urlparse(self.path)
        parts = [p for p in parsed.path.rstrip("/").split("/") if p]

        if len(parts) >= 1 and parts[0] == "api":
            # DELETE /api/trips/<id>
            if len(parts) == 3 and parts[1] == "trips":
                trip_id = parts[2]
                with get_db() as conn:
                    conn.execute("DELETE FROM trips WHERE id = ?", (trip_id,))
                    conn.execute("DELETE FROM itinerary WHERE trip_id = ?", (trip_id,))
                    conn.execute("DELETE FROM packing WHERE trip_id = ?", (trip_id,))
                    conn.execute("DELETE FROM budget WHERE trip_id = ?", (trip_id,))
                return self._send_json({"success": True})

            # DELETE /api/trips/<id>/packing/<item_id>
            elif len(parts) == 5 and parts[1] == "trips" and parts[3] == "packing":
                item_id = parts[4]
                with get_db() as conn:
                    conn.execute("DELETE FROM packing WHERE id = ?", (item_id,))
                return self._send_json({"success": True})

        return self._send_json({"error": "Not Found"}, status=404)

def run():
    init_db()
    server_address = ("", PORT)
    httpd = HTTPServer(server_address, TravelMateHandler)
    print(f"✨ TravelMate backend running on http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()

if __name__ == "__main__":
    run()
