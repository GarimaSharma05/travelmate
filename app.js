/* =========================================================
   TRAVELMATE - Interactive Logic & Scrapbook Controller
   Connected: Frontend -> Backend -> Database -> Backend -> Frontend
   (With transparent fallback to client IndexedDB TM_DB)
   ========================================================= */

// --- 1. DEFAULT SEED DATA ---
const sampleDestinations = [
  {
    id: 'kyoto',
    name: 'Kyoto & Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=60',
    tag: '🌸 Cherry Blossom',
    desc: 'Wander wooden alleys of Gion, historic Shinto shrines, bamboo groves, and cozy matcha cafes.',
    rating: '⭐ 4.9 (Cozy classic)',
    style: 'Cultural & Historic',
    days: 5,
    hotel: 'Komorebi Boutique Ryokan'
  },
  {
    id: 'amalfi',
    name: 'Amalfi Coast, Italy',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=60',
    tag: '🍋 Pastel Cliffside',
    desc: 'Pastel cliffside villas, lemon granitas, turquoise sea breezes, and private wooden boat rides.',
    rating: '⭐ 4.8 (Sun & Romance)',
    style: 'Romantic Getaway',
    days: 4,
    hotel: 'Villa Bellavista Positano'
  },
  {
    id: 'alps',
    name: 'Zermatt, Switzerland',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&auto=format&fit=crop&q=60',
    tag: '🏔️ Alpine Haven',
    desc: 'Crisp mountain air, Matterhorn views, cozy fondue evenings, and wooden chalet fireplaces.',
    rating: '⭐ 4.9 (Nature bliss)',
    style: 'Adventure & Hiking',
    days: 4,
    hotel: 'Chalet Edelweiss Hideaway'
  },
  {
    id: 'bali',
    name: 'Ubud, Bali',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=60',
    tag: '🌴 Jungle Sanctuary',
    desc: 'Lush green rice terraces, morning yoga shalas, sacred waterfalls, and vibrant smoothie bowls.',
    rating: '⭐ 4.7 (Tropical calm)',
    style: 'Beach & Island Chill',
    days: 6,
    hotel: 'Green Haven Eco Resort'
  },
  {
    id: 'paris',
    name: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=60',
    tag: '🥐 Bakery & Museums',
    desc: 'Fresh morning croissants, flea markets, riverside strolls along the Seine, and pastel art galleries.',
    rating: '⭐ 4.8 (Arts & Cafes)',
    style: 'Foodie Safari',
    days: 4,
    hotel: 'Hôtel Pastel Marais'
  },
  {
    id: 'seoul',
    name: 'Seoul, South Korea',
    image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=600&auto=format&fit=crop&q=60',
    tag: '✨ Hanok & Street Food',
    desc: 'Traditional Hanok village alleyways, aesthetic dessert cafes, vibrant night markets, and cute stationery stores.',
    rating: '⭐ 4.9 (Trendy & Sweet)',
    style: 'Cultural & Historic',
    days: 5,
    hotel: 'Bukchon Heritage Guesthouse'
  }
];

const initialTrips = [
  {
    id: 'trip-1',
    destination: 'Kyoto & Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=60',
    dates: 'Apr 12 - Apr 17 (5 Days)',
    duration: 5,
    budget: '$2,400',
    currency: '$',
    travellersCount: 2,
    travellerType: 'Couple / Pair',
    travelStyle: 'Cultural & Historic',
    accommodation: 'Komorebi Boutique Ryokan',
    pace: 'Moderate',
    notes: 'Try matcha soft-serve, visit Ghibli park, thrift shopping!'
  },
  {
    id: 'trip-2',
    destination: 'Amalfi Coast, Italy',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=60',
    dates: 'Jun 20 - Jun 24 (4 Days)',
    duration: 4,
    budget: '€1,950',
    currency: '€',
    travellersCount: 2,
    travellerType: 'Couple / Pair',
    travelStyle: 'Romantic Getaway',
    accommodation: 'Villa Bellavista Positano',
    pace: 'Relaxed',
    notes: 'Lemon granita and sunset boat tour.'
  },
  {
    id: 'trip-3',
    destination: 'Zermatt, Switzerland',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&auto=format&fit=crop&q=60',
    dates: 'Sep 05 - Sep 09 (4 Days)',
    duration: 4,
    budget: '$2,100',
    currency: '$',
    travellersCount: 3,
    travellerType: 'Friends Squad',
    travelStyle: 'Adventure & Hiking',
    accommodation: 'Chalet Edelweiss Hideaway',
    pace: 'Moderate',
    notes: 'Matterhorn sunrise hike and fondue dinner.'
  }
];

const sampleScheduleDays = {
  1: {
    title: 'Arrival, Japanese Garden & Lantern Tea',
    hotel: 'Komorebi Boutique Ryokan',
    city: 'Kyoto',
    slots: [
      {
        time: 'Morning 09:30',
        type: 'morning',
        icon: '🍵',
        title: 'Check-in & Welcome Sencha Tea',
        desc: 'Settle luggage into the tatami room, put on cozy yukata, and enjoy fresh matcha mochi in the courtyard garden.',
        tags: ['Hotel Check-in', 'Tea Time', 'Unpack']
      },
      {
        time: 'Afternoon 13:30',
        type: 'afternoon',
        icon: '⛩️',
        title: 'Fushimi Inari Taisha Red Torii Walk',
        desc: 'Hike through thousands of bright vermilion Torii gates along sacred Mount Inari path. Catch breathtaking mountain vistas.',
        tags: ['Scenic Trail', 'Photoshoot', 'Shrine']
      },
      {
        time: 'Evening 18:30',
        type: 'evening',
        icon: '🏮',
        title: 'Gion District Lantern Walk & Ramen',
        desc: 'Stroll past traditional wooden machiya townhouses along Shirakawa canal. Savor warm bowls of rich tonkotsu ramen.',
        tags: ['Dinner', 'Lanterns', 'Peaceful Walk']
      }
    ]
  },
  2: {
    title: 'Bamboo Forest, Monkey Park & Golden Pavilion',
    hotel: 'Komorebi Boutique Ryokan',
    city: 'Kyoto',
    slots: [
      {
        time: 'Morning 08:00',
        type: 'morning',
        icon: '🎋',
        title: 'Arashiyama Bamboo Grove at Sunrise',
        desc: 'Beat the crowds to hear the soothing rustle of soaring green bamboo stalks swaying in the early dawn breeze.',
        tags: ['Quiet Morning', 'Nature', 'Iconic']
      },
      {
        time: 'Afternoon 13:00',
        type: 'afternoon',
        icon: '✨',
        title: 'Kinkaku-ji (The Golden Pavilion)',
        desc: 'Marvel at the gold leaf-covered Zen temple shimmering peacefully across the mirrored reflecting pond.',
        tags: ['Zen Garden', 'History', 'Sightseeing']
      },
      {
        time: 'Evening 19:00',
        type: 'evening',
        icon: '🍱',
        title: 'Nishiki Market Street Food Tasting',
        desc: 'Sample grilled dango, candied strawberries, takoyaki skewers, and cute handmade matcha soft serve cones.',
        tags: ['Street Food', 'Foodie Safari', 'Souvenirs']
      }
    ]
  },
  3: {
    title: 'Philosopher’s Path, Art Cafes & Pottery Studio',
    hotel: 'Komorebi Boutique Ryokan',
    city: 'Kyoto',
    slots: [
      {
        time: 'Morning 09:00',
        type: 'morning',
        icon: '🌸',
        title: 'Canal Stroll along Philosopher’s Walk',
        desc: 'Gentle walk beside the stone canal lined with blossoming cherry trees, stopping to pet friendly resident shrine cats.',
        tags: ['Relaxed Walk', 'Scrapbook Shots', 'Cats']
      },
      {
        time: 'Afternoon 14:00',
        type: 'afternoon',
        icon: '🏺',
        title: 'Kiyomizu-yaki Hand Pottery Workshop',
        desc: 'Craft your own handmade ceramic teacup to take home as a treasured scrapbook souvenir.',
        tags: ['Crafting', 'Hands-on', 'Workshop']
      },
      {
        time: 'Evening 18:30',
        type: 'evening',
        icon: '🕯️',
        title: 'Kamogawa Riverbank Sunset Picnic',
        desc: 'Relax on the grassy riverbank alongside locals, watching the pink twilight fade into starry night.',
        tags: ['Picnic', 'Romantic', 'Sunset']
      }
    ]
  },
  4: {
    title: 'Shinkansen to Tokyo & Akihabara Whimsy',
    hotel: 'Hotel Pastel Shibuya, Tokyo',
    city: 'Tokyo',
    slots: [
      {
        time: 'Morning 09:00',
        type: 'morning',
        icon: '🚅',
        title: 'Bullet Train (Shinkansen) with Ekiben Box',
        desc: 'Speed past snow-capped Mount Fuji at 300 km/h while eating cute boxed bento treats.',
        tags: ['Scenic Transit', 'Fuji Views', 'Bento']
      },
      {
        time: 'Afternoon 14:00',
        type: 'afternoon',
        icon: '🧸',
        title: 'Akihabara & Cute Gachapon Hunting',
        desc: 'Explore multilevel retro arcade centers, capsule toy dispenser rows, and stationery shops.',
        tags: ['Cute Toys', 'Gachapon', 'Arcade']
      },
      {
        time: 'Evening 19:30',
        type: 'evening',
        icon: '🌃',
        title: 'Shibuya Sky Observatory Overlook',
        desc: 'Stand on the 360-degree glass rooftop deck overlooking the neon glowing sea of Tokyo.',
        tags: ['City Skyline', 'Night View', 'Vibrant']
      }
    ]
  },
  5: {
    title: 'Harajuku Pancakes, Meiji Shrine & Souvenir Quest',
    hotel: 'Hotel Pastel Shibuya, Tokyo',
    city: 'Tokyo',
    slots: [
      {
        time: 'Morning 09:30',
        type: 'morning',
        icon: '🌲',
        title: 'Peaceful Walk through Meiji Jingu Forest',
        desc: 'Step into an ancient cedar forest in the heart of Tokyo, writing wish plaques (ema) at the shrine.',
        tags: ['Spiritual', 'Forest Bathing', 'Wishes']
      },
      {
        time: 'Afternoon 13:00',
        type: 'afternoon',
        icon: '🥞',
        title: 'Fluffy Soufflé Pancakes in Takeshita St.',
        desc: 'Delight in cloud-like jiggly pancakes topped with Hokkaido cream and fresh berries.',
        tags: ['Sweet Treat', 'Harajuku', 'Cute Cafe']
      },
      {
        time: 'Evening 18:00',
        type: 'evening',
        icon: '🛍️',
        title: 'Stationery Shopping & Final Farewell Dinner',
        desc: 'Stock up on washi tapes, scrapbooking stickers, and stamps at Loft before a celebratory sukiyaki dinner.',
        tags: ['Stationery', 'Shopping', 'Scrapbooking']
      }
    ]
  }
};

const initialPackingSeed = [
  { id: 'p-1', text: 'Passport & Photocopies', category: 'documents', checked: true },
  { id: 'p-2', text: 'Boarding Pass & Hotel Confirmations', category: 'documents', checked: true },
  { id: 'p-3', text: 'Travel Insurance Card', category: 'documents', checked: false },
  { id: 'p-4', text: 'Comfortable Walking Sneakers', category: 'clothes', checked: true },
  { id: 'p-5', text: 'Pastel Cardigan / Light Jacket', category: 'clothes', checked: false },
  { id: 'p-6', text: 'Cozy Pajamas & Extra Socks', category: 'clothes', checked: false },
  { id: 'p-7', text: 'Sunscreen & Lip Balm', category: 'toiletries', checked: true },
  { id: 'p-8', text: 'Mini Travel Toothbrush & Paste', category: 'toiletries', checked: false },
  { id: 'p-9', text: 'Hydrating Face Mist', category: 'toiletries', checked: false },
  { id: 'p-10', text: 'Universal Power Adapter', category: 'tech', checked: true },
  { id: 'p-11', text: 'Portable Powerbank (10,000mAh)', category: 'tech', checked: true },
  { id: 'p-12', text: 'Polaroid Instant Camera + Film', category: 'tech', checked: false },
  { id: 'p-13', text: 'Cute Travel Journal & Pastel Gel Pens', category: 'misc', checked: true },
  { id: 'p-14', text: 'Washi Tape Rolls & Glue Tape', category: 'misc', checked: false },
  { id: 'p-15', text: 'Reusable Canvas Tote Bag', category: 'misc', checked: false }
];

const initialBudgetSeed = {
  totalBudget: 2400,
  currency: '$',
  categories: {
    Flights: { allocated: 850, spent: 780, color: '#F472B6' },
    Stay: { allocated: 750, spent: 520, color: '#FBBF24' },
    Food: { allocated: 450, spent: 210, color: '#34D399' },
    Activities: { allocated: 200, spent: 80, color: '#60A5FA' },
    Shopping: { allocated: 150, spent: 40, color: '#A78BFA' }
  },
  expenses: [
    { id: 'e-1', desc: 'Flight Tickets (Return)', category: 'Flights', amount: 780 },
    { id: 'e-2', desc: 'Ryokan 3 Nights Deposit', category: 'Stay', amount: 520 },
    { id: 'e-3', desc: 'Kinkaku-ji & Shrine Entry', category: 'Activities', amount: 25 },
    { id: 'e-4', desc: 'Matcha Parfait & Gion Ramen', category: 'Food', amount: 35 },
    { id: 'e-5', desc: 'Washi Tape & Kawaii Stickers', category: 'Shopping', amount: 40 },
    { id: 'e-6', desc: 'Shinkansen Bullet Train Pass', category: 'Activities', amount: 55 },
    { id: 'e-7', desc: 'Harajuku Fluffy Pancakes & Latte', category: 'Food', amount: 28 }
  ]
};

// State trackers
let isBackendActive = false;
let activeTripId = 'trip-1';
let currentTrip = null;
let currentItinerary = {};
let currentPacking = [];
let currentBudget = null;

// --- 2. DATABASE & BACKEND INITIALIZATION ---
async function initDatabaseAndLoad() {
  try {
    isBackendActive = await API.isAvailable();
  } catch (e) {
    isBackendActive = false;
  }

  if (isBackendActive) {
    try {
      const trips = await API.getTrips();
      if (trips && trips.length > 0) {
        activeTripId = trips[0].id;
      }
      await loadTripData(activeTripId);
      await renderMyTrips();
      return;
    } catch (err) {
      console.warn('Backend reachable but fetch failed, falling back to local database:', err);
    }
  }

  // Fallback to client-side TM_DB (IndexedDB)
  try {
    const existingTrips = await TM_DB.getAllTrips();
    if (!existingTrips || existingTrips.length === 0) {
      for (const trip of initialTrips) {
        await TM_DB.saveTrip(trip);
      }
      for (let day = 1; day <= 5; day++) {
        await TM_DB.saveItineraryDay({
          id: `itin-trip-1-day-${day}`,
          tripId: 'trip-1',
          day: day,
          city: sampleScheduleDays[day].city,
          hotel: sampleScheduleDays[day].hotel,
          title: sampleScheduleDays[day].title,
          slots: sampleScheduleDays[day].slots
        });
      }
      for (const item of initialPackingSeed) {
        await TM_DB.savePackingItem({
          id: item.id,
          tripId: 'trip-1',
          text: item.text,
          category: item.category,
          checked: item.checked
        });
      }
      await TM_DB.saveBudget({
        id: 'budget-trip-1',
        tripId: 'trip-1',
        totalBudget: initialBudgetSeed.totalBudget,
        currency: initialBudgetSeed.currency,
        categories: initialBudgetSeed.categories,
        expenses: initialBudgetSeed.expenses
      });
    }

    await loadTripData(activeTripId);
    await renderMyTrips();
  } catch (err) {
    console.warn('Database initialization fallback:', err);
    currentTrip = initialTrips[0];
    currentItinerary = sampleScheduleDays;
    currentPacking = initialPackingSeed;
    currentBudget = initialBudgetSeed;
    renderAllViews();
  }
}

async function loadTripData(tripId) {
  activeTripId = tripId;

  if (isBackendActive) {
    try {
      const data = await API.getTrip(tripId);
      const t = data.trip;
      currentTrip = {
        ...t,
        destination: t.destination,
        dates: `${t.start_date || ''} to ${t.end_date || ''} (${t.duration || 5} Days)`,
        budget: `${t.currency || '$'}${Number(t.budget || 0).toLocaleString()}`,
        travellersCount: t.travellers_count,
        travellerType: t.traveller_type,
        travelStyle: t.travel_style,
        accommodation: t.accommodation,
        pace: t.pace
      };

      currentItinerary = {};
      if (data.itinerary && data.itinerary.length > 0) {
        data.itinerary.forEach(rec => {
          currentItinerary[rec.day] = {
            title: `Day ${rec.day}: Exploring ${rec.city}`,
            hotel: rec.hotel,
            city: rec.city,
            slots: rec.slots
          };
        });
      } else {
        currentItinerary = sampleScheduleDays;
      }

      currentPacking = data.packing || [];
      currentBudget = data.budget || {
        tripId,
        totalBudget: t.budget || 2000,
        currency: t.currency || '$',
        categories: initialBudgetSeed.categories,
        expenses: []
      };

      renderAllViews();
      return;
    } catch (e) {
      console.warn('Failed to load trip from backend, trying local:', e);
    }
  }

  // Local TM_DB
  currentTrip = (await TM_DB.getTrip(tripId)) || initialTrips[0];
  const itinRecords = await TM_DB.getItinerariesByTrip(tripId);
  currentItinerary = {};
  if (itinRecords && itinRecords.length > 0) {
    itinRecords.sort((a, b) => a.day - b.day);
    itinRecords.forEach(rec => {
      currentItinerary[rec.day] = {
        title: rec.title,
        hotel: rec.hotel,
        city: rec.city,
        slots: rec.slots
      };
    });
  } else {
    currentItinerary = sampleScheduleDays;
  }

  const packRecords = await TM_DB.getPackingByTrip(tripId);
  currentPacking = (packRecords && packRecords.length > 0) ? packRecords : initialPackingSeed.map(p => ({ ...p, tripId }));

  const budgetRecord = await TM_DB.getBudgetByTrip(tripId);
  currentBudget = budgetRecord || {
    id: `budget-${tripId}`,
    tripId,
    totalBudget: 2000,
    currency: currentTrip.currency || '$',
    categories: initialBudgetSeed.categories,
    expenses: []
  };

  renderAllViews();
}

function renderAllViews() {
  const itinDest = document.getElementById('itinDest');
  const itinHotel = document.getElementById('itinHotel');
  const itinPax = document.getElementById('itinPax');
  const itinPace = document.getElementById('itinPace');
  const itinTitle = document.getElementById('itineraryTitle');
  const itinSub = document.getElementById('itinerarySub');

  if (itinDest) itinDest.textContent = currentTrip.destination;
  if (itinHotel) itinHotel.textContent = currentTrip.accommodation || currentTrip.hotel || 'Cozy Hotel';
  if (itinPax) itinPax.textContent = `${currentTrip.travellersCount || 2} (${currentTrip.travellerType || 'Couple'})`;
  if (itinPace) itinPace.textContent = currentTrip.pace || 'Moderate';
  if (itinTitle) itinTitle.textContent = `${currentTrip.destination} Scrapbook`;
  if (itinSub) itinSub.textContent = `${currentTrip.dates || '5 Days'} • ${currentTrip.travelStyle || 'Explore'} • ${currentTrip.budget || '$2,000'}`;

  const tabsContainer = document.getElementById('dayTabsContainer');
  if (tabsContainer) {
    tabsContainer.innerHTML = '';
    const dayKeys = Object.keys(currentItinerary);
    dayKeys.forEach((dayNum, idx) => {
      const dayData = currentItinerary[dayNum];
      const btn = document.createElement('button');
      btn.className = `day-tab ${idx === 0 ? 'active' : ''}`;
      btn.dataset.day = dayNum;
      btn.textContent = `Day ${dayNum} 🌸 ${dayData.city || 'Day ' + dayNum}`;
      tabsContainer.appendChild(btn);
    });
  }

  renderDaySchedule(1);
  renderPackingList();
  calculateBudgetTotals();
}

// --- 3. NAVIGATION ---
function switchSection(sectionId) {
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    if (btn.getAttribute('data-target') === sectionId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const sections = document.querySelectorAll('.page-section');
  sections.forEach(sec => {
    if (sec.id === sectionId) {
      sec.classList.add('active');
    } else {
      sec.classList.remove('active');
    }
  });

  const navLinks = document.getElementById('navLinks');
  if (navLinks && navLinks.classList.contains('show')) {
    navLinks.classList.remove('show');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- 4. ITINERARY SCHEDULE ---
function renderDaySchedule(dayNum) {
  const dayInfo = currentItinerary[dayNum] || currentItinerary[1] || sampleScheduleDays[1];

  document.querySelectorAll('.day-tab').forEach(tab => {
    if (parseInt(tab.dataset.day) === parseInt(dayNum)) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  const headerElem = document.getElementById('currentDayHeader');
  const hotelElem = document.getElementById('currentDayHotel');
  if (headerElem) headerElem.textContent = `Day ${dayNum}: ${dayInfo.title || 'Sightseeing & Adventure'}`;
  if (hotelElem) hotelElem.textContent = `🏨 Staying at: ${dayInfo.hotel || currentTrip.accommodation || 'Cozy Base'}`;

  const scheduleTimeline = document.getElementById('scheduleTimeline');
  if (!scheduleTimeline) return;
  scheduleTimeline.innerHTML = '';

  const slots = dayInfo.slots || sampleScheduleDays[1].slots;
  slots.forEach(slot => {
    const slotCard = document.createElement('div');
    slotCard.className = 'time-slot-card';

    const badgesHtml = (slot.tags || []).map(t => `<span class="mini-badge">#${t}</span>`).join('');

    slotCard.innerHTML = `
      <div class="slot-tag ${slot.type || 'morning'}">
        <span class="slot-icon" style="font-size: 1.6rem;">${slot.icon || '📍'}</span>
        <span class="slot-time">${slot.time}</span>
      </div>
      <div class="slot-detail">
        <h4>${slot.title}</h4>
        <p>${slot.desc}</p>
        <div class="slot-badge-row">
          ${badgesHtml}
        </div>
      </div>
    `;
    scheduleTimeline.appendChild(slotCard);
  });
}

function setupItineraryTabs() {
  const container = document.getElementById('dayTabsContainer');
  if (!container) return;

  container.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('.day-tab');
    if (tabBtn) {
      const day = parseInt(tabBtn.dataset.day);
      renderDaySchedule(day);
    }
  });
}

// --- 5. PACKING LIST (LOAD & SAVE) ---
let activePackingCat = 'all';

function renderPackingList() {
  const grid = document.getElementById('packingListGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const filtered = activePackingCat === 'all' 
    ? currentPacking 
    : currentPacking.filter(item => item.category === activePackingCat);

  filtered.forEach(item => {
    const itemCard = document.createElement('div');
    itemCard.className = `pack-item ${item.checked ? 'checked' : ''}`;
    itemCard.innerHTML = `
      <div class="pack-left" onclick="togglePackItem('${item.id}')">
        <div class="custom-checkbox">${item.checked ? '✔' : ''}</div>
        <span class="pack-text">${item.text}</span>
      </div>
      <button class="delete-item-btn" onclick="deletePackItem('${item.id}', event)" title="Remove item">✕</button>
    `;
    grid.appendChild(itemCard);
  });

  updatePackingProgress();
}

async function togglePackItem(id) {
  const item = currentPacking.find(i => String(i.id) === String(id));
  if (item) {
    item.checked = !item.checked;
    renderPackingList();

    if (isBackendActive) {
      try {
        await API.savePackingItem(activeTripId, item);
      } catch (err) {
        console.error(err);
      }
    }
    try {
      await TM_DB.savePackingItem(item);
    } catch (err) {}
  }
}

async function deletePackItem(id, e) {
  e.stopPropagation();
  currentPacking = currentPacking.filter(i => String(i.id) !== String(id));
  renderPackingList();

  if (isBackendActive) {
    try {
      await API.deletePackingItem(activeTripId, id);
    } catch (err) {
      console.error(err);
    }
  }
  try {
    await TM_DB.deletePackingItem(id);
  } catch (err) {}
}

function updatePackingProgress() {
  const total = currentPacking.length;
  const packed = currentPacking.filter(i => i.checked).length;
  const percent = total > 0 ? Math.round((packed / total) * 100) : 0;

  const bar = document.getElementById('packBar');
  const countSpan = document.getElementById('packCount');
  const percentSpan = document.getElementById('packPercent');

  if (bar) bar.style.width = `${percent}%`;
  if (countSpan) countSpan.textContent = `${packed}/${total} packed`;
  if (percentSpan) percentSpan.textContent = `${percent}%`;
}

function setupPackingEvents() {
  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activePackingCat = btn.dataset.cat;
      renderPackingList();
    });
  });

  const addBtn = document.getElementById('addPackBtn');
  const input = document.getElementById('newPackItem');
  const catSelect = document.getElementById('newPackCat');

  if (addBtn && input && catSelect) {
    addBtn.addEventListener('click', async () => {
      const text = input.value.trim();
      if (!text) return;

      const newItem = {
        id: 'p-' + Date.now(),
        tripId: activeTripId,
        text: text,
        category: catSelect.value,
        checked: false
      };
      currentPacking.push(newItem);
      input.value = '';
      renderPackingList();

      if (isBackendActive) {
        try {
          await API.savePackingItem(activeTripId, newItem);
        } catch (err) {
          console.error(err);
        }
      }
      try {
        await TM_DB.savePackingItem(newItem);
      } catch (err) {}
    });
  }
}

// --- 6. BUDGET (LOAD & SAVE) ---
function calculateBudgetTotals() {
  if (!currentBudget) return;
  const curr = currentBudget.currency || '$';
  let totalSpent = 0;

  (currentBudget.expenses || []).forEach(exp => {
    totalSpent += Number(exp.amount);
  });

  const remaining = currentBudget.totalBudget - totalSpent;

  const statTotal = document.getElementById('statTotalBudget');
  const statSpent = document.getElementById('statTotalSpent');
  const statRem = document.getElementById('statRemaining');

  if (statTotal) statTotal.textContent = `${curr}${Number(currentBudget.totalBudget).toLocaleString()}`;
  if (statSpent) statSpent.textContent = `${curr}${totalSpent.toLocaleString()}`;
  if (statRem) {
    statRem.textContent = `${curr}${remaining.toLocaleString()}`;
    statRem.style.color = remaining < 0 ? '#DC2626' : 'inherit';
  }

  renderCategoryBars();
  renderExpensesList();
}

function renderCategoryBars() {
  const container = document.getElementById('budgetCategoryBars');
  if (!container || !currentBudget) return;
  container.innerHTML = '';

  const curr = currentBudget.currency || '$';
  const catSpentMap = { Flights: 0, Stay: 0, Food: 0, Activities: 0, Shopping: 0 };
  (currentBudget.expenses || []).forEach(exp => {
    if (catSpentMap[exp.category] !== undefined) {
      catSpentMap[exp.category] += Number(exp.amount);
    }
  });

  const categories = currentBudget.categories || initialBudgetSeed.categories;
  Object.keys(categories).forEach(catKey => {
    const cat = categories[catKey];
    const spent = catSpentMap[catKey] || 0;
    const allocated = cat.allocated || 1;
    const pct = Math.min(100, Math.round((spent / allocated) * 100));

    const item = document.createElement('div');
    item.className = 'cat-bar-item';
    item.innerHTML = `
      <div class="cat-bar-header">
        <span>${catKey}</span>
        <span>${curr}${spent} / ${curr}${allocated} (${pct}%)</span>
      </div>
      <div class="cat-bar-track">
        <div class="cat-bar-progress" style="width: ${pct}%; background-color: ${cat.color || '#34D399'};"></div>
      </div>
    `;
    container.appendChild(item);
  });
}

function renderExpensesList() {
  const list = document.getElementById('expenseList');
  if (!list || !currentBudget) return;
  list.innerHTML = '';

  const curr = currentBudget.currency || '$';

  (currentBudget.expenses || []).slice().reverse().forEach((exp) => {
    const row = document.createElement('div');
    row.className = 'expense-row';
    row.innerHTML = `
      <div class="expense-row-left">
        <span>🏷️</span>
        <div>
          <strong>${exp.desc}</strong>
          <small style="display:block; color:#7C7368;">${exp.category}</small>
        </div>
      </div>
      <span class="expense-amount">-${curr}${exp.amount}</span>
    `;
    list.appendChild(row);
  });
}

function setupBudgetEvents() {
  const form = document.getElementById('expenseForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const desc = document.getElementById('expDesc').value.trim();
    const amount = parseFloat(document.getElementById('expAmount').value);
    const category = document.getElementById('expCategory').value;

    if (desc && amount > 0 && currentBudget) {
      const newExpense = {
        id: 'exp-' + Date.now(),
        desc,
        amount,
        category
      };
      if (!currentBudget.expenses) currentBudget.expenses = [];
      currentBudget.expenses.push(newExpense);

      document.getElementById('expDesc').value = '';
      document.getElementById('expAmount').value = '';
      calculateBudgetTotals();

      if (isBackendActive) {
        try {
          await API.saveBudget(activeTripId, currentBudget);
        } catch (err) {
          console.error(err);
        }
      }
      try {
        await TM_DB.saveBudget(currentBudget);
      } catch (err) {}
    }
  });
}

// --- 7. MY TRIPS (VIEW, EDIT, DELETE) ---
async function renderMyTrips() {
  const grid = document.getElementById('myTripsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  let trips = [];
  if (isBackendActive) {
    try {
      const backendTrips = await API.getTrips();
      trips = backendTrips.map(t => ({
        id: t.id,
        destination: t.destination,
        dates: `${t.start_date || ''} to ${t.end_date || ''} (${t.duration || 5} Days)`,
        budget: `${t.currency || '$'}${Number(t.budget || 0).toLocaleString()}`,
        travellersCount: t.travellers_count,
        travellerType: t.traveller_type,
        travelStyle: t.travel_style,
        accommodation: t.accommodation,
        pace: t.pace,
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=60'
      }));
    } catch (e) {
      console.warn('Backend fetch failed, using local trips:', e);
    }
  }

  if (trips.length === 0) {
    try {
      trips = await TM_DB.getAllTrips();
    } catch (err) {
      trips = initialTrips;
    }
  }

  trips.forEach((trip) => {
    const card = document.createElement('div');
    card.className = 'trip-polaroid-card';
    card.innerHTML = `
      <div class="tape-strip washi-yellow" style="top:-10px; left:25%; width:90px;"></div>
      <span class="trip-badge-status">Planned 🎒</span>
      <img src="${trip.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=60'}" alt="${trip.destination}">
      <div class="trip-body">
        <h3>${trip.destination}</h3>
        <p class="trip-dates">🗓️ ${trip.dates}</p>
        <div class="trip-tags-row">
          <span class="trip-tag-pill">👥 ${trip.travellersCount || 2} (${trip.travellerType || 'Travellers'})</span>
          <span class="trip-tag-pill">✨ ${trip.travelStyle || 'Vacation'}</span>
          <span class="trip-tag-pill">🏨 ${trip.accommodation || trip.hotel || 'Cozy Hotel'}</span>
          <span class="trip-tag-pill">🪙 Budget: ${trip.budget}</span>
        </div>
        <div class="trip-actions" style="display: flex; gap: 8px;">
          <button class="btn btn-secondary" style="flex: 1;" onclick="selectTrip('${trip.id}')">
            View 📖
          </button>
          <button class="btn btn-primary" style="padding: 0.45rem 0.8rem; font-size: 0.85rem;" onclick="promptEditTrip('${trip.id}')" title="Edit Trip">
            ✏️
          </button>
          <button class="btn" style="background: #FEE2E2; padding: 0.45rem 0.8rem; font-size: 0.85rem;" onclick="deleteTrip('${trip.id}')" title="Delete Trip">
            🗑️
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

async function selectTrip(tripId) {
  await loadTripData(tripId);
  switchSection('itinerary');
  renderDaySchedule(1);
}

// Edit trip operation
async function promptEditTrip(tripId) {
  let trip = currentTrip;
  if (isBackendActive) {
    try {
      const data = await API.getTrip(tripId);
      trip = data.trip;
    } catch (e) {}
  } else {
    trip = await TM_DB.getTrip(tripId);
  }
  if (!trip) return;

  const newDest = prompt("Edit Destination:", trip.destination);
  if (!newDest) return;

  const newBudget = prompt("Edit Budget Amount:", trip.budget ? String(trip.budget).replace(/[^0-9.]/g, '') : "1500");
  const newPace = prompt("Edit Pace (Relaxed / Moderate / Fast-paced):", trip.pace || "Moderate");

  const updatedData = {
    destination: newDest,
    budget: parseFloat(newBudget) || trip.budget,
    pace: newPace || trip.pace
  };

  if (isBackendActive) {
    try {
      await API.updateTrip(tripId, updatedData);
    } catch (e) {
      console.error(e);
    }
  }

  try {
    await TM_DB.saveTrip({
      ...trip,
      ...updatedData,
      budget: `${trip.currency || '$'}${updatedData.budget}`
    });
  } catch (e) {}

  await renderMyTrips();
  if (activeTripId === tripId) {
    await loadTripData(tripId);
  }
}

// Delete trip operation
async function deleteTrip(tripId) {
  if (!confirm("Are you sure you want to delete this trip from your scrapbook? 🗑️")) return;

  if (isBackendActive) {
    try {
      await API.deleteTrip(tripId);
    } catch (e) {
      console.error(e);
    }
  }
  try {
    await TM_DB.deleteTrip(tripId);
  } catch (e) {}

  let remaining = [];
  if (isBackendActive) {
    try {
      remaining = await API.getTrips();
    } catch (e) {}
  }
  if (remaining.length === 0) {
    try {
      remaining = await TM_DB.getAllTrips();
    } catch (e) {}
  }

  if (remaining && remaining.length > 0) {
    await loadTripData(remaining[0].id);
  }
  await renderMyTrips();
}

// --- 8. DESTINATIONS CONTROLLER ---
function renderDestinations() {
  const grid = document.getElementById('destGrid');
  if (!grid) return;
  grid.innerHTML = '';

  sampleDestinations.forEach(dest => {
    const card = document.createElement('div');
    card.className = 'dest-card';
    card.innerHTML = `
      <div class="dest-img-wrap">
        <span class="dest-sticker">${dest.tag}</span>
        <img src="${dest.image}" alt="${dest.name}">
      </div>
      <div class="dest-content">
        <h3>${dest.name}</h3>
        <p class="dest-desc">${dest.desc}</p>
        <div class="dest-footer">
          <span class="dest-rating">${dest.rating}</span>
          <button class="btn btn-primary" style="padding: 0.4rem 0.9rem; font-size: 0.85rem;" onclick="prefillTripPlan('${dest.name}', '${dest.days}', '${dest.style}', '${dest.hotel}')">
            Plan This ✏️
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function prefillTripPlan(destination, days, style, hotel) {
  switchSection('plan');
  const destInput = document.getElementById('destInput');
  const daysInput = document.getElementById('calcDuration');
  const styleSelect = document.getElementById('travelStyle');

  if (destInput) destInput.value = destination;
  if (daysInput) daysInput.value = days;
  if (styleSelect) {
    for (let opt of styleSelect.options) {
      if (opt.value.includes(style.split(' ')[0])) {
        opt.selected = true;
        break;
      }
    }
  }

  const today = new Date();
  const returnD = new Date();
  returnD.setDate(today.getDate() + Number(days));

  const depInput = document.getElementById('depDate');
  const retInput = document.getElementById('retDate');
  if (depInput && retInput) {
    depInput.value = today.toISOString().split('T')[0];
    retInput.value = returnD.toISOString().split('T')[0];
  }

  const budgetInput = document.getElementById('budgetInput');
  if (budgetInput && !budgetInput.value) budgetInput.value = 1800;

  window.scrollTo({ top: 150, behavior: 'smooth' });
}

// --- 9. PLAN TRIP FORM CONTROLLER (CREATE TRIP) ---
function setupTripForm() {
  const form = document.getElementById('tripForm');
  const depInput = document.getElementById('depDate');
  const retInput = document.getElementById('retDate');
  const durInput = document.getElementById('calcDuration');

  function updateDurationFromDates() {
    if (depInput.value && retInput.value) {
      const start = new Date(depInput.value);
      const end = new Date(retInput.value);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        durInput.value = diffDays;
      }
    }
  }

  if (depInput && retInput) {
    depInput.addEventListener('change', updateDurationFromDates);
    retInput.addEventListener('change', updateDurationFromDates);
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const destination = document.getElementById('destInput').value.trim();
      const dep = depInput.value;
      const ret = retInput.value;
      const duration = parseInt(durInput.value) || 5;
      const currency = document.getElementById('currencySelect').value;
      const budget = parseFloat(document.getElementById('budgetInput').value) || 1500;
      const travellerType = document.getElementById('travellerType').value;
      const travellerCount = parseInt(document.getElementById('travellerCount').value) || 1;
      const travelStyle = document.getElementById('travelStyle').value;
      const accomType = document.getElementById('accomType').value;
      const pace = document.getElementById('tripPace').value;
      const notes = document.getElementById('tripNotes').value.trim();

      const newTripId = 'trip-' + Date.now();

      if (isBackendActive) {
        // Create in Backend DB
        try {
          await API.createTrip({
            id: newTripId,
            destination,
            start_date: dep,
            end_date: ret,
            duration,
            budget,
            currency,
            travellers_count: travellerCount,
            traveller_type: travellerType,
            travel_style: travelStyle,
            accommodation: accomType,
            pace,
            notes
          });
        } catch (err) {
          console.error('Backend save failed:', err);
        }
      }

      // Also persist to local TM_DB
      try {
        const newTrip = {
          id: newTripId,
          destination,
          image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=60',
          dates: `${dep} to ${ret} (${duration} Days)`,
          duration,
          budget: `${currency}${budget}`,
          currency,
          travellersCount: travellerCount,
          travellerType,
          travelStyle,
          accommodation: accomType,
          pace,
          notes
        };
        await TM_DB.saveTrip(newTrip);

        for (let day = 1; day <= duration; day++) {
          await TM_DB.saveItineraryDay({
            id: `itin-${newTripId}-day-${day}`,
            tripId: newTripId,
            day,
            city: destination.split(',')[0].trim(),
            hotel: accomType,
            title: `Day ${day} in ${destination.split(',')[0].trim()}`,
            slots: [
              { time: 'Morning 09:00', type: 'morning', icon: '🥐', title: 'Breakfast & Stroll', desc: 'Savor local pastries.', tags: ['Morning'] },
              { time: 'Afternoon 13:30', type: 'afternoon', icon: '🏛️', title: 'Sightseeing & Culture', desc: 'Tour historic landmarks.', tags: [travelStyle] },
              { time: 'Evening 19:00', type: 'evening', icon: '🌙', title: 'Dinner & Sunset', desc: 'Evening meal and relaxation.', tags: ['Dinner', pace] }
            ]
          });
        }

        for (const item of initialPackingSeed) {
          await TM_DB.savePackingItem({
            id: `p-${newTripId}-${item.id}`,
            tripId: newTripId,
            text: item.text,
            category: item.category,
            checked: false
          });
        }

        await TM_DB.saveBudget({
          id: `budget-${newTripId}`,
          tripId: newTripId,
          totalBudget: budget,
          currency,
          categories: {
            Flights: { allocated: Math.round(budget * 0.35), spent: 0, color: '#F472B6' },
            Stay: { allocated: Math.round(budget * 0.35), spent: 0, color: '#FBBF24' },
            Food: { allocated: Math.round(budget * 0.15), spent: 0, color: '#34D399' },
            Activities: { allocated: Math.round(budget * 0.10), spent: 0, color: '#60A5FA' },
            Shopping: { allocated: Math.round(budget * 0.05), spent: 0, color: '#A78BFA' }
          },
          expenses: []
        });
      } catch (e) {}

      await renderMyTrips();
      await loadTripData(newTripId);
      switchSection('itinerary');
      renderDaySchedule(1);
    });
  }
}

// --- 10. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-target');
      switchSection(target);
    });
  });

  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 5);

  const depInput = document.getElementById('depDate');
  const retInput = document.getElementById('retDate');
  if (depInput && !depInput.value) depInput.value = today.toISOString().split('T')[0];
  if (retInput && !retInput.value) retInput.value = nextWeek.toISOString().split('T')[0];

  setupItineraryTabs();
  setupPackingEvents();
  setupBudgetEvents();
  renderDestinations();
  setupTripForm();

  await initDatabaseAndLoad();
});
