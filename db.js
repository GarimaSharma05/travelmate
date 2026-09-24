/* =========================================================
   TRAVELMATE - Minimal Persistent Database (IndexedDB)
   Stores:
   1. trips: destination, dates, budget, travellers & preferences
   2. itinerary: tripId, day, city, hotel, activities
   3. packing: tripId, item, category, checked
   4. budget: tripId, categories, allocated & spent amounts
   ========================================================= */

const DB_NAME = 'TravelMateDB';
const DB_VERSION = 1;

let dbInstance = null;

function openDB() {
  return new Promise((resolve, reject) => {
    if (dbInstance) return resolve(dbInstance);

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 1. Trips store
      if (!db.objectStoreNames.contains('trips')) {
        db.createObjectStore('trips', { keyPath: 'id' });
      }

      // 2. Itinerary store
      if (!db.objectStoreNames.contains('itinerary')) {
        const itinStore = db.createObjectStore('itinerary', { keyPath: 'id' });
        itinStore.createIndex('tripId', 'tripId', { unique: false });
      }

      // 3. Packing store
      if (!db.objectStoreNames.contains('packing')) {
        const packStore = db.createObjectStore('packing', { keyPath: 'id' });
        packStore.createIndex('tripId', 'tripId', { unique: false });
      }

      // 4. Budget store
      if (!db.objectStoreNames.contains('budget')) {
        const budgetStore = db.createObjectStore('budget', { keyPath: 'id' });
        budgetStore.createIndex('tripId', 'tripId', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject(event.target.error);
    };
  });
}

// Generic transaction helpers
async function performTx(storeName, mode, callback) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const req = callback(store);

    if (req) {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } else {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    }
  });
}

const TM_DB = {
  // --- Trips ---
  async getAllTrips() {
    return performTx('trips', 'readonly', (store) => store.getAll());
  },
  async getTrip(id) {
    return performTx('trips', 'readonly', (store) => store.get(id));
  },
  async saveTrip(trip) {
    return performTx('trips', 'readwrite', (store) => store.put(trip));
  },

  // --- Itinerary ---
  async getItinerariesByTrip(tripId) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('itinerary', 'readonly');
      const store = tx.objectStore('itinerary');
      const index = store.index('tripId');
      const req = index.getAll(tripId);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },
  async saveItineraryDay(dayRecord) {
    return performTx('itinerary', 'readwrite', (store) => store.put(dayRecord));
  },

  // --- Packing ---
  async getPackingByTrip(tripId) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('packing', 'readonly');
      const store = tx.objectStore('packing');
      const index = store.index('tripId');
      const req = index.getAll(tripId);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },
  async savePackingItem(item) {
    return performTx('packing', 'readwrite', (store) => store.put(item));
  },
  async deletePackingItem(id) {
    return performTx('packing', 'readwrite', (store) => store.delete(id));
  },

  // --- Budget ---
  async getBudgetByTrip(tripId) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('budget', 'readonly');
      const store = tx.objectStore('budget');
      const index = store.index('tripId');
      const req = index.getAll(tripId);
      req.onsuccess = () => {
        const res = req.result;
        resolve(res && res.length ? res[0] : null);
      };
      req.onerror = () => reject(req.error);
    });
  },
  async saveBudget(budgetRecord) {
    return performTx('budget', 'readwrite', (store) => store.put(budgetRecord));
  }
};
