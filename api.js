/* =========================================================
   TRAVELMATE - Minimal Backend API Client
   Connects: Frontend -> Backend -> Database -> Backend -> Frontend
   ========================================================= */

const API_BASE = (window.location.protocol.startsWith('http'))
  ? window.location.origin + '/api'
  : 'http://127.0.0.1:8080/api';

const API = {
  // Check if backend is reachable
  async isAvailable() {
    try {
      const res = await fetch(`${API_BASE}/trips`, { method: 'GET' });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // 1. Trips
  async getTrips() {
    const res = await fetch(`${API_BASE}/trips`);
    if (!res.ok) throw new Error('Failed to fetch trips');
    return res.json();
  },

  async getTrip(id) {
    const res = await fetch(`${API_BASE}/trips/${id}`);
    if (!res.ok) throw new Error('Failed to fetch trip details');
    return res.json();
  },

  async createTrip(tripData) {
    const res = await fetch(`${API_BASE}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tripData)
    });
    if (!res.ok) throw new Error('Failed to create trip');
    return res.json();
  },

  async updateTrip(id, tripData) {
    const res = await fetch(`${API_BASE}/trips/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tripData)
    });
    if (!res.ok) throw new Error('Failed to update trip');
    return res.json();
  },

  async deleteTrip(id) {
    const res = await fetch(`${API_BASE}/trips/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete trip');
    return res.json();
  },

  // 2. Itinerary
  async saveItinerary(tripId, dayData) {
    const res = await fetch(`${API_BASE}/trips/${tripId}/itinerary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dayData)
    });
    if (!res.ok) throw new Error('Failed to save itinerary');
    return res.json();
  },

  // 3. Packing
  async savePackingItem(tripId, item) {
    const res = await fetch(`${API_BASE}/trips/${tripId}/packing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to save packing item');
    return res.json();
  },

  async deletePackingItem(tripId, itemId) {
    const res = await fetch(`${API_BASE}/trips/${tripId}/packing/${itemId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete packing item');
    return res.json();
  },

  // 4. Budget
  async saveBudget(tripId, budgetData) {
    const res = await fetch(`${API_BASE}/trips/${tripId}/budget`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(budgetData)
    });
    if (!res.ok) throw new Error('Failed to save budget');
    return res.json();
  },

  // 5. Groq AI Generation Endpoint
  async generateTrip(preferences) {
    const rootUrl = window.location.protocol.startsWith('http')
      ? window.location.origin
      : 'http://127.0.0.1:8080';

    const res = await fetch(`${rootUrl}/generate-trip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to generate trip with Groq AI');
    }
    return data;
  }
};
