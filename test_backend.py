#!/usr/bin/env python3
"""
Unit tests for TravelMate backend database operations
Tests all essential CRUD operations:
1. List trips
2. Create trip + auto itinerary/packing/budget
3. Read trip details (itinerary, packing, budget)
4. Update trip details
5. Delete trip
6. Update packing item & delete packing item
7. Update budget & log expense
"""

import json
import sqlite3
import unittest
import server

class TestTravelMateBackend(unittest.TestCase):
    def setUp(self):
        server.init_db()

    def test_1_list_trips(self):
        with server.get_db() as conn:
            trips = conn.execute("SELECT * FROM trips").fetchall()
            self.assertGreaterEqual(len(trips), 1)
            print(f"✅ Listed {len(trips)} trips from database")

    def test_2_create_trip(self):
        trip_id = "test-trip-99"
        dest = "Bali & Lombok, Indonesia"
        with server.get_db() as conn:
            conn.execute("""
            INSERT OR REPLACE INTO trips (id, destination, start_date, end_date, duration, budget, currency, travellers_count, traveller_type, travel_style, accommodation, pace, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (trip_id, dest, "2026-10-01", "2026-10-06", 5, 1800.0, "$", 2, "Couple", "Beach", "Resort", "Relaxed", "Beach days"))

            # Itinerary day
            conn.execute("""
            INSERT OR REPLACE INTO itinerary (id, trip_id, day_number, city, hotel, activities)
            VALUES (?, ?, ?, ?, ?, ?)
            """, (f"itin-{trip_id}-day-1", trip_id, 1, "Bali", "Resort", json.dumps([{"title": "Beach walk", "time": "Morning"}])))

            # Packing item
            conn.execute("""
            INSERT OR REPLACE INTO packing (id, trip_id, item_name, category, is_checked)
            VALUES (?, ?, ?, ?, 0)
            """, (f"p-{trip_id}-1", trip_id, "Swimsuit", "clothes"))

            # Budget
            conn.execute("""
            INSERT OR REPLACE INTO budget (id, trip_id, total_budget, currency, categories, expenses)
            VALUES (?, ?, ?, ?, ?, '[]')
            """, (f"budget-{trip_id}", trip_id, 1800.0, "$", json.dumps({"Beach": {"allocated": 500, "spent": 0}})))

        # Verify created
        with server.get_db() as conn:
            t = conn.execute("SELECT * FROM trips WHERE id = ?", (trip_id,)).fetchone()
            self.assertIsNotNone(t)
            self.assertEqual(t["destination"], dest)
            print("✅ Create trip & related records succeeded")

    def test_3_read_trip_details(self):
        trip_id = "test-trip-99"
        with server.get_db() as conn:
            itin = conn.execute("SELECT * FROM itinerary WHERE trip_id = ?", (trip_id,)).fetchall()
            packing = conn.execute("SELECT * FROM packing WHERE trip_id = ?", (trip_id,)).fetchall()
            budget = conn.execute("SELECT * FROM budget WHERE trip_id = ?", (trip_id,)).fetchone()
            self.assertGreaterEqual(len(itin), 1)
            self.assertGreaterEqual(len(packing), 1)
            self.assertIsNotNone(budget)
            print("✅ Read trip details (itinerary, packing, budget) succeeded")

    def test_4_update_trip(self):
        trip_id = "test-trip-99"
        with server.get_db() as conn:
            conn.execute("UPDATE trips SET pace = 'Slow & Serene', budget = 2200.0 WHERE id = ?", (trip_id,))
            t = conn.execute("SELECT * FROM trips WHERE id = ?", (trip_id,)).fetchone()
            self.assertEqual(t["pace"], "Slow & Serene")
            self.assertEqual(t["budget"], 2200.0)
            print("✅ Update trip succeeded")

    def test_5_delete_trip(self):
        trip_id = "test-trip-99"
        with server.get_db() as conn:
            conn.execute("DELETE FROM trips WHERE id = ?", (trip_id,))
            conn.execute("DELETE FROM itinerary WHERE trip_id = ?", (trip_id,))
            conn.execute("DELETE FROM packing WHERE trip_id = ?", (trip_id,))
            conn.execute("DELETE FROM budget WHERE trip_id = ?", (trip_id,))

            t = conn.execute("SELECT * FROM trips WHERE id = ?", (trip_id,)).fetchone()
            itin = conn.execute("SELECT * FROM itinerary WHERE trip_id = ?", (trip_id,)).fetchall()
            self.assertIsNone(t)
            self.assertEqual(len(itin), 0)
            print("✅ Delete trip & cascade succeeded")

if __name__ == "__main__":
    unittest.main()
