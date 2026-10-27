import './style.css';

const foodImages = {
  chaney: 'https://images.pexels.com/photos/9287032/pexels-photo-9287032.jpeg?auto=compress&cs=tinysrgb&w=900',
  paye: 'https://images.pexels.com/photos/20408434/pexels-photo-20408434.jpeg?auto=compress&cs=tinysrgb&w=900',
  karahi: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=85',
  daal: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=85',
  bhindi: '/images/food/bhindi.jpg',
  biryani: '/images/food/biryani.jpg',
  turkishBread: '/images/food/turkish-bread.jpg',
  roti: '/images/food/tandoori-roti.jpg',
  chapati: '/images/food/chapati.jpg',
  chai: '/images/food/chai.jpg',
};

const menu = [
  { id: 'karahi', category: 'daily', type: 'Chicken dish', name: 'Smoky chicken karahi', description: 'Tomato, ginger, green chilli and a proper tarka.', price: 690, image: foodImages.karahi, portions: ['Half', 'Full'], portionPrices: [690, 1250], tag: 'Today’s favourite' },
  { id: 'daal', category: 'daily', type: 'Daal / pulses', name: 'Daal makhani', description: 'Slow-simmered black lentils, butter and a hint of smoke.', price: 420, image: foodImages.daal, portions: ['Single', 'Family'], portionPrices: [420, 760], tag: 'Comfort in a bowl' },
  { id: 'bhindi', category: 'daily', type: 'Vegetable dish', name: 'Bhindi masala', description: 'Crisp okra tossed with onion, tomato and spices.', price: 390, image: foodImages.bhindi, portions: ['Single', 'Family'], portionPrices: [390, 720], tag: 'Fresh from the tawa' },
  { id: 'biryani', category: 'daily', type: 'Rice dish', name: 'Zafrani chicken biryani', description: 'Fragrant basmati, saffron, mint and tender chicken.', price: 580, image: foodImages.biryani, portions: ['Single', 'Family'], portionPrices: [580, 1080], tag: 'Aromatic & generous' },
  { id: 'chaney', category: 'nashta', type: 'Signature nashta', name: 'Lahori chaney', description: 'Tangy, spiced chickpeas with fresh coriander and achar.', price: 320, image: foodImages.chaney, portions: ['Single', 'Double'], portionPrices: [320, 570], tag: 'Breakfast legend' },
  { id: 'paye', category: 'nashta', type: 'Signature nashta', name: 'Slow-cooked paye', description: 'Overnight trotters in a rich, silky masala gravy.', price: 520, image: foodImages.paye, portions: ['Single', 'Double'], portionPrices: [520, 960], tag: 'Weekend special' },
  { id: 'bread', category: 'breads', type: 'Fresh from tandoor', name: 'Turkish bread', description: 'Pillowy, sesame-topped bread for serious scooping.', price: 180, image: foodImages.turkishBread, portions: ['2 pieces', '4 pieces'], portionPrices: [180, 320], tag: 'Baked to order' },
  { id: 'roti', category: 'breads', type: 'Fresh from tandoor', name: 'Tandoori roti', description: 'Charred at the edges, soft in the middle, always hot.', price: 90, image: foodImages.roti, portions: ['2 pieces', '6 pieces'], portionPrices: [90, 240], tag: 'Straight from the fire' },
  { id: 'chapati', category: 'breads', type: 'Fresh from tawa', name: 'Ghar ki chapati', description: 'The everyday classic: thin, tender and made with care.', price: 70, image: foodImages.chapati, portions: ['2 pieces', '6 pieces'], portionPrices: [70, 180], tag: 'Just like home' },
  { id: 'chai', category: 'chai', type: 'Matka chai', name: 'Smoky matka chai', description: 'Cardamom tea poured hot into a warm clay cup.', price: 220, image: foodImages.chai, portions: ['One matka', 'Two matkas'], portionPrices: [220, 400], tag: 'Pour it slow' },
];

const state = { activeTab: 'daily', cart: [], delivery: 'pickup', cartOpen: false };

function money(value) { return `Rs. ${value.toLocaleString('en-PK')}`; }

function renderCard(item, index) {
  return `<article class="dish-card reveal" style="--delay:${index * 70}ms" data-card="${item.id}">
    <div class="dish-image"><img src="${item.image}" alt="${item.name}" loading="lazy"><span class="dish-tag">${item.tag}</span><button class="expand" aria-label="Show details for ${item.name}">↗</button></div>
    <div class="dish-copy"><p class="eyebrow">${item.type}</p><h3>${item.name}</h3><p>${item.description}</p>
      <div class="dish-footer"><label>Portion<select data-portion="${item.id}">${item.portions.map((portion, i) => `<option value="${i}">${portion} · ${money(item.portionPrices[i])}</option>`).join('')}</select></label><button class="add-btn" data-add="${item.id}">Add to order <span>+</span></button></div>
    </div>
  </article>`;
}

function renderMenu() {
  const items = menu.filter((item) => item.category === state.activeTab);
  document.querySelector('#menu-grid').innerHTML = items.map(renderCard).join('');
  requestAnimationFrame(() => document.querySelectorAll('.dish-card').forEach((card) => card.classList.add('visible')));
  document.querySelectorAll('[data-add]').forEach((button) => button.addEventListener('click', () => addToCart(button.dataset.add)));
  document.querySelectorAll('[data-portion]').forEach((select) => select.addEventListener('change', () => {
    const item = menu.find((entry) => entry.id === select.dataset.portion);
    select.closest('.dish-card').querySelector('.add-btn').innerHTML = `Add ${money(item.portionPrices[select.value])} <span>+</span>`;
  }));
}

function addToCart(id) {
  const item = menu.find((entry) => entry.id === id);
  const select = document.querySelector(`[data-portion="${id}"]`);
  const portionIndex = select ? Number(select.value) : 0;
  const key = `${id}-${portionIndex}`;
  const existing = state.cart.find((line) => line.key === key);
  if (existing) existing.quantity += 1;
  else state.cart.push({ key, id, portionIndex, quantity: 1 });
  state.cartOpen = true;
  renderCart();
  document.querySelector('#cart-drawer').classList.add('is-open');
}

function cartTotal() {
  return state.cart.reduce((total, line) => total + menu.find((item) => item.id === line.id).portionPrices[line.portionIndex] * line.quantity, 0);
}

function renderCart() {
  const count = state.cart.reduce((total, line) => total + line.quantity, 0);
  document.querySelectorAll('.cart-count').forEach((el) => { el.textContent = count; el.hidden = count === 0; });
  const content = document.querySelector('#cart-content');
  if (!state.cart.length) {
    content.innerHTML = '<div class="cart-empty"><span class="empty-mark">✦</span><h3>Your table is waiting.</h3><p>Add something warm, saucy or smoky to get started.</p></div>';
    document.querySelector('#cart-total').textContent = money(0);
    return;
  }
  content.innerHTML = state.cart.map((line) => {
    const item = menu.find((entry) => entry.id === line.id);
    return `<div class="cart-line"><img src="${item.image}" alt=""><div><strong>${item.name}</strong><small>${item.portions[line.portionIndex]} · ${money(item.portionPrices[line.portionIndex])}</small><div class="quantity"><button data-minus="${line.key}">−</button><span>${line.quantity}</span><button data-plus="${line.key}">+</button></div></div><b>${money(item.portionPrices[line.portionIndex] * line.quantity)}</b></div>`;
  }).join('');
  document.querySelector('#cart-total').textContent = money(cartTotal());
  document.querySelectorAll('[data-plus]').forEach((button) => button.addEventListener('click', () => updateQuantity(button.dataset.plus, 1)));
  document.querySelectorAll('[data-minus]').forEach((button) => button.addEventListener('click', () => updateQuantity(button.dataset.minus, -1)));
}

function updateQuantity(key, change) {
  const line = state.cart.find((entry) => entry.key === key);
  line.quantity += change;
  if (line.quantity <= 0) state.cart = state.cart.filter((entry) => entry.key !== key);
  renderCart();
}

function init() {
  document.querySelector('#app').innerHTML = `
    <div class="grain"></div>
    <header class="site-header"><a class="brand" href="#"><span class="brand-mark">PT</span><span>Peela <em>Truck</em></span></a><nav><a href="#menu">Menu</a><a href="#story">Our story</a><a href="#visit">Find us</a></nav><button class="cart-button" id="open-cart">Your order <span class="cart-count" hidden>0</span><span class="cart-icon">↗</span></button><button class="menu-toggle" aria-label="Toggle navigation">☰</button></header>
    <main>
      <section class="hero" id="top"><div class="hero-backdrop"></div><div class="hero-copy"><p class="kicker"><span></span> DHA PHASE 5 · HOMEMADE PAKISTANI</p><h1>Ghar ka khana.<br><i>Truck ki jaan.</i></h1><p class="hero-intro">Big flavours, slow fires and the kind of welcome that makes a small table feel like home.</p><div class="hero-actions"><a class="button button-yellow" href="#menu">Explore today’s menu <span>↘</span></a><button class="button button-ghost" id="hero-order">Start your order <span>↗</span></button></div></div><div class="hero-note"><span>01</span><p>Rolling in<br><strong>with warmth</strong></p></div><div class="scroll-cue">Scroll to eat <span>↓</span></div></section>
      <section class="marquee"><div>AUTHENTIC FLAVOUR <span>✳</span> MADE WITH PATIENCE <span>✳</span> SERVED WITH HEART <span>✳</span> AUTHENTIC FLAVOUR <span>✳</span></div></section>
      <section class="menu-section section" id="menu"><div class="section-heading"><div><p class="kicker"><span></span> WHAT’S COOKING TODAY</p><h2>Pick your<br><i>kind of comfort.</i></h2></div><p class="section-note">Exactly four main dishes, cooked fresh each day. Sample prices shown until the real menu lands.</p></div>
        <div class="menu-tabs">${[['daily','Daily menu'],['nashta','Nashta'],['breads','Breads'],['chai','Matka chai']].map(([key, label]) => `<button class="${state.activeTab === key ? 'active' : ''}" data-tab="${key}">${label}<span>↗</span></button>`).join('')}</div>
        <div class="menu-grid" id="menu-grid"></div>
      </section>
      <section class="flow section"><p class="kicker"><span></span> THE EASY PART</p><div class="flow-heading"><h2>From hungry<br>to <i>happy.</i></h2><p>Good food should be easy to get. Follow the yellow line.</p></div><div class="flow-grid">${[['01','Choose your dish','Start with something slow-cooked and generous.'],['02','Select your portion','Solo, sharing or enough for the whole table.'],['03','Add bread & chai','The essentials that make it a proper meal.'],['04','Pick your way','Pickup, delivery or a seat under the trees.'],['05','Review your order','One last look, then we get cooking.']].map(([number, title, copy]) => `<div class="flow-card"><b>${number}</b><span class="flow-arrow">↗</span><h3>${title}</h3><p>${copy}</p></div>`).join('')}</div></section>
      <section class="feature feature-breakfast"><div class="feature-image"><img src="${foodImages.chaney}" alt="A bowl of Pakistani chaney"></div><div class="feature-copy"><p class="kicker"><span></span> THE MORNING SHIFT</p><h2>Wake up to<br><i>proper nashta.</i></h2><p>Our chaney are tangy, our paye take all night, and our parathas are never rushed. Come early. Linger longer.</p><button class="text-link" data-tab-link="nashta">See the breakfast menu <span>↗</span></button></div></section>
      <section class="bread-banner section"><div><p class="kicker"><span></span> HOT FROM THE TANDOOR</p><h2>Break bread.<br><i>Stay awhile.</i></h2><p>Turkish bread, tandoori roti and ghar ki chapati — made to be torn, shared and dipped.</p><button class="button button-yellow" data-tab-link="breads">Order fresh bread <span>↗</span></button></div><div class="bread-art"><img src="${foodImages.turkishBread}" alt="Fresh Turkish bread from the tandoor"></div></section>
      <section class="chai-feature"><div class="chai-image"><img src="${foodImages.chai}" alt="Matka chai in a clay cup"></div><div class="chai-copy"><p class="kicker"><span></span> SLOW DOWN, IT'S CHAI TIME</p><h2>Pour a little<br><i>joy.</i></h2><p>Cardamom, tea leaves and a warm clay matka. Best enjoyed with nowhere else to be.</p><button class="text-link" data-tab-link="chai">Meet the matka <span>↗</span></button></div></section>
      <section class="visit section" id="visit"><div class="visit-heading"><p class="kicker"><span></span> COME AS YOU ARE</p><h2>Three ways<br>to <i>eat well.</i></h2></div><div class="visit-grid"><div class="visit-card"><span>01</span><h3>Pickup</h3><p>Order ahead, pull up, take the good stuff home.</p><small>Details to be confirmed</small></div><div class="visit-card highlighted"><span>02</span><h3>Delivery</h3><p>We’re building a warm route through DHA Phase 5.</p><small>Service details to be confirmed</small></div><div class="visit-card"><span>03</span><h3>Dine-in</h3><p>Small tables, leafy shade, golden-hour chai.</p><small>Seating details to be confirmed</small></div></div></section>
      <section class="story section" id="story"><div class="story-image"><img src="/images/truck-side.png" alt="Peela Truck at golden hour"></div><div class="story-copy"><p class="kicker"><span></span> THIS IS PEELA TRUCK</p><h2>A little yellow<br><i>piece of home.</i></h2><p>Inspired by Pakistan’s legendary truck art and powered by homemade recipes, Peela Truck is a place for food that feels familiar — with a little more colour.</p><div class="story-meta"><div><b>01</b><span>Handmade<br>with heart</span></div><div><b>02</b><span>Rooted in<br>tradition</span></div><div><b>03</b><span>Made for<br>sharing</span></div></div></div></section>
      <section class="contact section"><div><p class="kicker"><span></span> FIND YOUR WAY TO US</p><h2>Let’s make<br><i>it delicious.</i></h2></div><div class="contact-details"><p><b>Location</b><br>DHA Phase 5, Lahore<br><em>Exact pin to be confirmed</em></p><p><b>Hours</b><br>Opening times to be confirmed</p><p><b>Contact</b><br>Phone and WhatsApp to be confirmed</p></div></section>
    </main>
    <footer><a class="brand" href="#top"><span class="brand-mark">PT</span><span>Peela <em>Truck</em></span></a><p>Ghar ka khana. Truck ki jaan.</p><span>© 2025 Peela Truck</span></footer>
    <div class="cart-drawer" id="cart-drawer"><div class="cart-head"><div><p class="kicker"><span></span> YOUR ORDER</p><h2>Ready when<br><i>you are.</i></h2></div><button id="close-cart" class="close-cart">×</button></div><div class="cart-content" id="cart-content"></div><div class="cart-bottom"><div class="order-mode"><button class="mode active" data-mode="pickup">Pickup</button><button class="mode" data-mode="delivery">Delivery</button></div><div class="total-row"><span>Estimated total</span><strong id="cart-total">Rs. 0</strong></div><button class="button button-yellow checkout">Continue to checkout <span>↗</span></button><small>Demo ordering flow — checkout is not connected yet.</small></div></div><div class="cart-overlay" id="cart-overlay"></div>
    <button class="mobile-order" id="mobile-order">View order <span class="cart-count" hidden>0</span> <b>↗</b></button>
  `;
  renderMenu(); renderCart();
  document.querySelectorAll('[data-tab]').forEach((button) => button.addEventListener('click', () => { state.activeTab = button.dataset.tab; document.querySelectorAll('[data-tab]').forEach((tab) => tab.classList.toggle('active', tab === button)); renderMenu(); document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' }); }));
  document.querySelectorAll('[data-tab-link]').forEach((button) => button.addEventListener('click', () => { state.activeTab = button.dataset.tabLink; document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' }); setTimeout(() => { document.querySelectorAll('[data-tab]').forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === state.activeTab)); renderMenu(); }, 350); }));
  const openCart = () => { document.querySelector('#cart-drawer').classList.add('is-open'); document.querySelector('#cart-overlay').classList.add('is-open'); };
  const closeCart = () => { document.querySelector('#cart-drawer').classList.remove('is-open'); document.querySelector('#cart-overlay').classList.remove('is-open'); };
  document.querySelector('#open-cart').addEventListener('click', openCart); document.querySelector('#hero-order').addEventListener('click', openCart); document.querySelector('#mobile-order').addEventListener('click', openCart); document.querySelector('#close-cart').addEventListener('click', closeCart); document.querySelector('#cart-overlay').addEventListener('click', closeCart);
  document.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', () => { state.delivery = button.dataset.mode; document.querySelectorAll('[data-mode]').forEach((mode) => mode.classList.toggle('active', mode === button)); }));
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible')), { threshold: 0.1 });
  document.querySelectorAll('.reveal, .flow-card, .visit-card, .feature, .story-copy, .contact').forEach((element) => observer.observe(element));
}

init();
