/* =========================================================
   TRAVELMATE - Interactive Logic & Scrapbook Controller
   ========================================================= */

// --- 1. SAMPLE REALISTIC DATA ---
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

let myTripsData = [
  {
    id: 'trip-1',
    destination: 'Kyoto & Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=60',
    dates: 'Apr 12 - Apr 17 (5 Days)',
    travellers: '2 Travellers (Couple / Pair)',
    style: 'Cultural & Historic',
    budget: '$2,400',
    hotel: 'Komorebi Boutique Ryokan',
    pace: 'Moderate'
  },
  {
    id: 'trip-2',
    destination: 'Amalfi Coast, Italy',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=60',
    dates: 'Jun 20 - Jun 24 (4 Days)',
    travellers: '2 Travellers (Romantic)',
    style: 'Romantic Getaway',
    budget: '€1,950',
    hotel: 'Villa Bellavista Positano',
    pace: 'Relaxed'
  },
  {
    id: 'trip-3',
    destination: 'Zermatt, Switzerland',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&auto=format&fit=crop&q=60',
    dates: 'Sep 05 - Sep 09 (4 Days)',
    travellers: '3 Travellers (Friends Squad)',
    style: 'Adventure & Hiking',
    budget: '$2,100',
    hotel: 'Chalet Edelweiss Hideaway',
    pace: 'Moderate'
  }
];

// Sample multi-day schedules
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

// Initial Packing items
let packingItems = [
  { id: 1, text: 'Passport & Photocopies', category: 'documents', checked: true },
  { id: 2, text: 'Boarding Pass & Hotel Confirmations', category: 'documents', checked: true },
  { id: 3, text: 'Travel Insurance Card', category: 'documents', checked: false },
  { id: 4, text: 'Comfortable Walking Sneakers', category: 'clothes', checked: true },
  { id: 5, text: 'Pastel Cardigan / Light Jacket', category: 'clothes', checked: false },
  { id: 6, text: 'Cozy Pajamas & Extra Socks', category: 'clothes', checked: false },
  { id: 7, text: 'Sunscreen & Lip Balm', category: 'toiletries', checked: true },
  { id: 8, text: 'Mini Travel Toothbrush & Paste', category: 'toiletries', checked: false },
  { id: 9, text: 'Hydrating Face Mist', category: 'toiletries', checked: false },
  { id: 10, text: 'Universal Power Adapter', category: 'tech', checked: true },
  { id: 11, text: 'Portable Powerbank (10,000mAh)', category: 'tech', checked: true },
  { id: 12, text: 'Polaroid Instant Camera + Film', category: 'tech', checked: false },
  { id: 13, text: 'Cute Travel Journal & Pastel Gel Pens', category: 'misc', checked: true },
  { id: 14, text: 'Washi Tape Rolls & Glue Tape', category: 'misc', checked: false },
  { id: 15, text: 'Reusable Canvas Tote Bag', category: 'misc', checked: false }
];

// Budget Mock Expenses
let budgetData = {
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
    { desc: 'Flight Tickets (Return)', category: 'Flights', amount: 780 },
    { desc: 'Ryokan 3 Nights Deposit', category: 'Stay', amount: 520 },
    { desc: 'Kinkaku-ji & Shrine Entry', category: 'Activities', amount: 25 },
    { desc: 'Matcha Parfait & Gion Ramen', category: 'Food', amount: 35 },
    { desc: 'Washi Tape & Kawaii Stickers', category: 'Shopping', amount: 40 },
    { desc: 'Shinkansen Bullet Train Pass', category: 'Activities', amount: 55 },
    { desc: 'Harajuku Fluffy Pancakes & Latte', category: 'Food', amount: 28 }
  ]
};

// --- 2. NAVIGATION & TAB SWITCHING ---
function switchSection(sectionId) {
  // Update nav buttons
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    if (btn.getAttribute('data-target') === sectionId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update visible section
  const sections = document.querySelectorAll('.page-section');
  sections.forEach(sec => {
    if (sec.id === sectionId) {
      sec.classList.add('active');
    } else {
      sec.classList.remove('active');
    }
  });

  // Close mobile nav if opened
  const navLinks = document.getElementById('navLinks');
  if (navLinks.classList.contains('show')) {
    navLinks.classList.remove('show');
  }

  // Smooth scroll up to top of content
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- 3. ITINERARY CONTROLLER ---
let currentDay = 1;

function renderDaySchedule(dayNum) {
  currentDay = dayNum;
  const dayInfo = sampleScheduleDays[dayNum] || sampleScheduleDays[1];

  // Update tabs active state
  document.querySelectorAll('.day-tab').forEach(tab => {
    if (parseInt(tab.dataset.day) === dayNum) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Update Day Header and Hotel Pill
  const headerElem = document.getElementById('currentDayHeader');
  const hotelElem = document.getElementById('currentDayHotel');
  if (headerElem) headerElem.textContent = `Day ${dayNum}: ${dayInfo.title}`;
  if (hotelElem) hotelElem.textContent = `🏨 Hotel: ${dayInfo.hotel}`;

  // Render Time Slots
  const scheduleTimeline = document.getElementById('scheduleTimeline');
  if (!scheduleTimeline) return;
  scheduleTimeline.innerHTML = '';

  dayInfo.slots.forEach(slot => {
    const slotCard = document.createElement('div');
    slotCard.className = 'time-slot-card';

    const badgesHtml = slot.tags.map(t => `<span class="mini-badge">#${t}</span>`).join('');

    slotCard.innerHTML = `
      <div class="slot-tag ${slot.type}">
        <span class="slot-icon" style="font-size: 1.6rem;">${slot.icon}</span>
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

// --- 4. PACKING LIST CONTROLLER ---
let activePackingCat = 'all';

function renderPackingList() {
  const grid = document.getElementById('packingListGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const filtered = activePackingCat === 'all' 
    ? packingItems 
    : packingItems.filter(item => item.category === activePackingCat);

  filtered.forEach(item => {
    const itemCard = document.createElement('div');
    itemCard.className = `pack-item ${item.checked ? 'checked' : ''}`;
    itemCard.innerHTML = `
      <div class="pack-left" onclick="togglePackItem(${item.id})">
        <div class="custom-checkbox">${item.checked ? '✔' : ''}</div>
        <span class="pack-text">${item.text}</span>
      </div>
      <button class="delete-item-btn" onclick="deletePackItem(${item.id}, event)" title="Remove item">✕</button>
    `;
    grid.appendChild(itemCard);
  });

  updatePackingProgress();
}

function togglePackItem(id) {
  const item = packingItems.find(i => i.id === id);
  if (item) {
    item.checked = !item.checked;
    renderPackingList();
  }
}

function deletePackItem(id, e) {
  e.stopPropagation();
  packingItems = packingItems.filter(i => i.id !== id);
  renderPackingList();
}

function updatePackingProgress() {
  const total = packingItems.length;
  const packed = packingItems.filter(i => i.checked).length;
  const percent = total > 0 ? Math.round((packed / total) * 100) : 0;

  const bar = document.getElementById('packBar');
  const countSpan = document.getElementById('packCount');
  const percentSpan = document.getElementById('packPercent');

  if (bar) bar.style.width = `${percent}%`;
  if (countSpan) countSpan.textContent = `${packed}/${total} packed`;
  if (percentSpan) percentSpan.textContent = `${percent}%`;
}

function setupPackingEvents() {
  // Category switch buttons
  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activePackingCat = btn.dataset.cat;
      renderPackingList();
    });
  });

  // Add Item
  const addBtn = document.getElementById('addPackBtn');
  const input = document.getElementById('newPackItem');
  const catSelect = document.getElementById('newPackCat');

  if (addBtn && input && catSelect) {
    addBtn.addEventListener('click', () => {
      const text = input.value.trim();
      if (!text) return;

      const newItem = {
        id: Date.now(),
        text: text,
        category: catSelect.value,
        checked: false
      };
      packingItems.push(newItem);
      input.value = '';
      renderPackingList();
    });
  }
}

// --- 5. BUDGET CONTROLLER ---
function calculateBudgetTotals() {
  const curr = budgetData.currency;
  let totalSpent = 0;

  budgetData.expenses.forEach(exp => {
    totalSpent += Number(exp.amount);
  });

  const remaining = budgetData.totalBudget - totalSpent;

  // Update summary stats
  const statTotal = document.getElementById('statTotalBudget');
  const statSpent = document.getElementById('statTotalSpent');
  const statRem = document.getElementById('statRemaining');

  if (statTotal) statTotal.textContent = `${curr}${budgetData.totalBudget.toLocaleString()}`;
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
  if (!container) return;
  container.innerHTML = '';

  const curr = budgetData.currency;

  // Re-calculate category totals from expenses
  const catSpentMap = { Flights: 0, Stay: 0, Food: 0, Activities: 0, Shopping: 0 };
  budgetData.expenses.forEach(exp => {
    if (catSpentMap[exp.category] !== undefined) {
      catSpentMap[exp.category] += Number(exp.amount);
    }
  });

  Object.keys(budgetData.categories).forEach(catKey => {
    const cat = budgetData.categories[catKey];
    const spent = catSpentMap[catKey] || 0;
    const pct = Math.min(100, Math.round((spent / cat.allocated) * 100));

    const item = document.createElement('div');
    item.className = 'cat-bar-item';
    item.innerHTML = `
      <div class="cat-bar-header">
        <span>${catKey}</span>
        <span>${curr}${spent} / ${curr}${cat.allocated} (${pct}%)</span>
      </div>
      <div class="cat-bar-track">
        <div class="cat-bar-progress" style="width: ${pct}%; background-color: ${cat.color};"></div>
      </div>
    `;
    container.appendChild(item);
  });
}

function renderExpensesList() {
  const list = document.getElementById('expenseList');
  if (!list) return;
  list.innerHTML = '';

  const curr = budgetData.currency;

  budgetData.expenses.slice().reverse().forEach((exp) => {
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

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const desc = document.getElementById('expDesc').value.trim();
    const amount = parseFloat(document.getElementById('expAmount').value);
    const category = document.getElementById('expCategory').value;

    if (desc && amount > 0) {
      budgetData.expenses.push({ desc, amount, category });
      document.getElementById('expDesc').value = '';
      document.getElementById('expAmount').value = '';
      calculateBudgetTotals();
    }
  });
}

// --- 6. MY TRIPS CONTROLLER ---
function renderMyTrips() {
  const grid = document.getElementById('myTripsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  myTripsData.forEach((trip) => {
    const card = document.createElement('div');
    card.className = 'trip-polaroid-card';
    card.innerHTML = `
      <div class="tape-strip washi-yellow" style="top:-10px; left:25%; width:90px;"></div>
      <span class="trip-badge-status">Planned 🎒</span>
      <img src="${trip.image}" alt="${trip.destination}">
      <div class="trip-body">
        <h3>${trip.destination}</h3>
        <p class="trip-dates">🗓️ ${trip.dates}</p>
        <div class="trip-tags-row">
          <span class="trip-tag-pill">👥 ${trip.travellers}</span>
          <span class="trip-tag-pill">✨ ${trip.style}</span>
          <span class="trip-tag-pill">🏨 ${trip.hotel}</span>
          <span class="trip-tag-pill">🪙 Budget: ${trip.budget}</span>
        </div>
        <div class="trip-actions">
          <button class="btn btn-secondary btn-full" onclick="loadTripIntoItinerary('${trip.destination}', '${trip.hotel}')">
            View Schedule 📖
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function loadTripIntoItinerary(destination, hotel) {
  document.getElementById('itinDest').textContent = destination;
  document.getElementById('itinHotel').textContent = hotel;
  document.getElementById('itineraryTitle').textContent = `${destination} Scrapbook`;
  switchSection('itinerary');
  renderDaySchedule(1);
}

// --- 7. DESTINATIONS CONTROLLER ---
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

  // Pre-fill today + duration
  const today = new Date();
  const returnD = new Date();
  returnD.setDate(today.getDate() + Number(days));

  const depInput = document.getElementById('depDate');
  const retInput = document.getElementById('retDate');
  if (depInput && retInput) {
    depInput.value = today.toISOString().split('T')[0];
    retInput.value = returnD.toISOString().split('T')[0];
  }

  // Set budget default
  const budgetInput = document.getElementById('budgetInput');
  if (budgetInput && !budgetInput.value) budgetInput.value = 1800;

  window.scrollTo({ top: 150, behavior: 'smooth' });
}

// --- 8. PLAN TRIP FORM CONTROLLER ---
function setupTripForm() {
  const form = document.getElementById('tripForm');
  const depInput = document.getElementById('depDate');
  const retInput = document.getElementById('retDate');
  const durInput = document.getElementById('calcDuration');

  // Auto calculate duration from dates
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
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const destination = document.getElementById('destInput').value.trim();
      const dep = depInput.value;
      const ret = retInput.value;
      const duration = durInput.value || 5;
      const currency = document.getElementById('currencySelect').value;
      const budget = document.getElementById('budgetInput').value;
      const travellerType = document.getElementById('travellerType').value;
      const travellerCount = document.getElementById('travellerCount').value;
      const travelStyle = document.getElementById('travelStyle').value;
      const accomType = document.getElementById('accomType').value;
      const pace = document.getElementById('tripPace').value;

      // Create new trip item
      const newTrip = {
        id: 'trip-' + Date.now(),
        destination: destination,
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=60',
        dates: `${dep} to ${ret} (${duration} Days)`,
        travellers: `${travellerCount} (${travellerType})`,
        style: travelStyle,
        budget: `${currency}${budget}`,
        hotel: accomType,
        pace: pace
      };

      // Add to trips list at the beginning
      myTripsData.unshift(newTrip);
      renderMyTrips();

      // Update Itinerary View with submitted details
      document.getElementById('itinDest').textContent = destination;
      document.getElementById('itinHotel').textContent = accomType;
      document.getElementById('itinPax').textContent = `${travellerCount} (${travellerType})`;
      document.getElementById('itinPace').textContent = pace;
      document.getElementById('itineraryTitle').textContent = `${destination} Scrapbook Itinerary`;
      document.getElementById('itinerarySub').textContent = `${duration} Days • ${travelStyle} • ${currency}${budget} Budget`;

      // Update budget tracker
      budgetData.totalBudget = Number(budget) || 2000;
      budgetData.currency = currency;
      calculateBudgetTotals();

      // Switch to Itinerary view
      switchSection('itinerary');
      renderDaySchedule(1);
    });
  }
}

// --- 9. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  // Setup mobile navigation toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }

  // Setup navigation links click
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-target');
      switchSection(target);
    });
  });

  // Default dates for form
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 5);

  const depInput = document.getElementById('depDate');
  const retInput = document.getElementById('retDate');
  if (depInput && !depInput.value) depInput.value = today.toISOString().split('T')[0];
  if (retInput && !retInput.value) retInput.value = nextWeek.toISOString().split('T')[0];

  // Initialize components
  setupItineraryTabs();
  renderDaySchedule(1);

  setupPackingEvents();
  renderPackingList();

  setupBudgetEvents();
  calculateBudgetTotals();

  renderMyTrips();
  renderDestinations();
  setupTripForm();
});
