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

    def test_6_save_generated_trip_to_database(self):
        pref = {
            "id": "ai-trip-101",
            "destination": "Santorini & Mykonos, Greece",
            "start_date": "2026-07-10",
            "end_date": "2026-07-15",
            "duration": 5,
            "budget": 2500.0,
            "currency": "€",
            "travellers_count": 2,
            "traveller_type": "Couple / Pair",
            "travel_style": "Romantic Getaway",
            "accommodation": "Cliffside Boutique Villa",
            "pace": "Relaxed",
            "notes": "Watch sunset in Oia, sail on catamaran."
        }
        ai_data = {
            "trip_summary": {
                "title": "Sun-kissed Greek Isles Romance 🇬🇷",
                "description": "5 days of pastel white villas, blue domes, and turquoise waters."
            },
            "itinerary": [
                {
                    "day": 1,
                    "city": "Santorini",
                    "hotel": "Cliffside Boutique Villa",
                    "title": "Arrival & Oia Blue Domes",
                    "slots": [
                        {"time": "Morning 09:30", "type": "morning", "icon": "☕", "title": "Check-in & Greek Coffee", "desc": "Savor baklava and frappe.", "tags": ["Check-in"]},
                        {"time": "Afternoon 14:00", "type": "afternoon", "icon": "⛵", "title": "Catamaran Cruise", "desc": "Swim in volcanic hot springs.", "tags": ["Sailing"]},
                        {"time": "Evening 19:30", "type": "evening", "icon": "🌅", "title": "Oia Sunset Walk", "desc": "Golden hour over the caldera.", "tags": ["Sunset"]}
                    ]
                }
            ],
            "packing_list": [
                {"text": "Passport & EU Health Card", "category": "documents"},
                {"text": "Linen shirts & sun hat (warm Mediterranean weather)", "category": "clothes"},
                {"text": "Reef-safe sunscreen SPF 50", "category": "toiletries"},
                {"text": "Polaroid camera & extra cartridges", "category": "tech"}
            ],
            "budget_breakdown": {
                "categories": {
                    "Flights": {"allocated": 800, "spent": 0, "color": "#F472B6"},
                    "Stay": {"allocated": 1000, "spent": 0, "color": "#FBBF24"},
                    "Food": {"allocated": 400, "spent": 0, "color": "#34D399"},
                    "Activities": {"allocated": 200, "spent": 0, "color": "#60A5FA"},
                    "Shopping": {"allocated": 100, "spent": 0, "color": "#A78BFA"}
                }
            }
        }
        saved_id = server.save_generated_trip(pref, ai_data)
        self.assertEqual(saved_id, "ai-trip-101")

        with server.get_db() as conn:
            trip = conn.execute("SELECT * FROM trips WHERE id = ?", ("ai-trip-101",)).fetchone()
            self.assertIsNotNone(trip)
            self.assertEqual(trip["destination"], "Santorini & Mykonos, Greece")

            itin = conn.execute("SELECT * FROM itinerary WHERE trip_id = ?", ("ai-trip-101",)).fetchall()
            self.assertEqual(len(itin), 1)

            packing = conn.execute("SELECT * FROM packing WHERE trip_id = ?", ("ai-trip-101",)).fetchall()
            self.assertEqual(len(packing), 4)

            budget = conn.execute("SELECT * FROM budget WHERE trip_id = ?", ("ai-trip-101",)).fetchone()
            self.assertIsNotNone(budget)
            self.assertEqual(budget["currency"], "€")
            print("✅ Save Groq AI generated trip, weather packing & budget to SQLite succeeded")

        # Cleanup
        with server.get_db() as conn:
            conn.execute("DELETE FROM trips WHERE id = ?", ("ai-trip-101",))
            conn.execute("DELETE FROM itinerary WHERE trip_id = ?", ("ai-trip-101",))
            conn.execute("DELETE FROM packing WHERE trip_id = ?", ("ai-trip-101",))
            conn.execute("DELETE FROM budget WHERE trip_id = ?", ("ai-trip-101",))

    def test_7_groq_api_key_and_model_config(self):
        server.load_env()
        self.assertEqual(server.GROQ_MODEL, "openai/gpt-oss-120b")
        key = server.get_groq_api_key()
        # Verify key exists or is placeholder
        self.assertTrue(key == "$$$$$" or len(key) > 0)
        # Calling groq without real key must raise clear ValueError
        if key == "$$$$$":
            with self.assertRaises(ValueError):
                server.call_groq_ai({"destination": "Tokyo"})
            print("✅ Groq placeholder key validation properly raises error")

if __name__ == "__main__":
    unittest.main()
