// Menu Data
const menuData = [
  { id: 1, name: "Classic Burger", category: "Burgers", desc: "A simple yet delicious classic burger.", price: 60, veg: true, icon: "fa-hamburger" },
  { id: 2, name: "Cheese Burger", category: "Burgers", desc: "Loaded with melting cheese.", price: 80, veg: true, icon: "fa-hamburger" },
  { id: 3, name: "Chicken Burger", category: "Burgers", desc: "Crispy chicken patty with special sauce.", price: 110, veg: false, icon: "fa-hamburger" },
  { id: 4, name: "Crispy Chicken", category: "Fried Chicken", desc: "Perfectly seasoned, golden fried chicken.", price: 180, veg: false, icon: "fa-drumstick-bite" },
  { id: 5, name: "Chicken Wings", category: "Fried Chicken", desc: "Spicy and tangy chicken wings.", price: 160, veg: false, icon: "fa-drumstick-bite" },
  { id: 6, name: "Peri Peri Fries", category: "Fries", desc: "Fries tossed in spicy peri peri seasoning.", price: 80, veg: true, icon: "fa-fries" },
  { id: 7, name: "Loaded Fries", category: "Fries", desc: "Fries topped with cheese and sauce.", price: 130, veg: true, icon: "fa-fries" },
  { id: 8, name: "Chicken Wrap", category: "Wraps", desc: "Crispy chicken wrapped in a soft tortilla.", price: 120, veg: false, icon: "fa-bacon" },
  { id: 9, name: "Thick Shake", category: "Beverages", desc: "Creamy and thick milkshake.", price: 90, veg: true, icon: "fa-glass-water" },
  { id: 10, name: "Samosa (2 pcs)", category: "Indian Snacks", desc: "Crispy potato filled savory pastry.", price: 40, veg: true, icon: "fa-cookie" }
];

// Cart State
let cart = [];

document.addEventListener('DOMContentLoaded', () => {

  // Navbar Scroll Effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Render Featured Slider
  const featuredTrack = document.getElementById('featured-track');
  if(featuredTrack) {
    const featuredItems = menuData.slice(0, 5);
    // Duplicate for infinite scroll effect
    const sliderItems = [...featuredItems, ...featuredItems];
    sliderItems.forEach(item => {
      featuredTrack.innerHTML += `
        <div class="featured-card">
          <i class="fas ${item.icon} featured-icon"></i>
          <div class="featured-info">
            <h3>${item.name}</h3>
            <span class="text-orange font-bold">₹${item.price}</span>
          </div>
        </div>
      `;
    });
  }

  // Render Menu
  const menuGrid = document.getElementById('menu-grid');
  
  function renderMenu(category = 'All') {
    if(!menuGrid) return;
    menuGrid.innerHTML = '';
    const filtered = category === 'All' ? menuData : menuData.filter(item => item.category === category);
    
    filtered.forEach(item => {
      const vegClass = item.veg ? 'veg' : 'non-veg';
      const vegTitle = item.veg ? 'Vegetarian' : 'Non-Vegetarian';
      
      const card = `
        <div class="menu-card">
          <div class="menu-card-img">
            <i class="fas ${item.icon}"></i>
            <div class="veg-tag ${vegClass}" title="${vegTitle}">${item.veg ? 'VEG' : 'NON-VEG'}</div>
          </div>
          <div class="menu-card-content">
            <div class="menu-title-row">
              <h3>${item.name}</h3>
              <span class="menu-price">₹${item.price}</span>
            </div>
            <p>${item.desc}</p>
            <button class="btn btn-primary btn-block" onclick="addToCart(${item.id})">
              <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
          </div>
        </div>
      `;
      menuGrid.innerHTML += card;
    });
  }

  renderMenu();

  // Menu Filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderMenu(e.target.dataset.cat);
    });
  });

  // Star Rating
  const stars = document.querySelectorAll('.star');
  let currentRating = 0;

  stars.forEach(star => {
    star.addEventListener('click', function() {
      currentRating = this.dataset.value;
      updateStars(currentRating);
    });
    star.addEventListener('mouseover', function() { updateStars(this.dataset.value); });
    star.addEventListener('mouseout', function() { updateStars(currentRating); });
  });

  function updateStars(value) {
    stars.forEach(s => {
      if (s.dataset.value <= value) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });
  }

  const feedbackForm = document.getElementById('feedback-form');
  if(feedbackForm){
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (currentRating === 0) {
        alert("Please select a star rating!");
        return;
      }
      alert("Thank you for your feedback! Your review has been submitted.");
      feedbackForm.reset();
      currentRating = 0;
      updateStars(0);
    });
  }

  // Checkout Form Submit
  const checkoutForm = document.getElementById('checkout-form');
  if(checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if(cart.length === 0) {
        alert("Your cart is empty! Please add items from the menu.");
        return;
      }
      
      // Simulate Order Processing
      const orderId = "NATION-" + Math.floor(1000 + Math.random() * 9000);
      
      // Save to localStorage for tracking simulation
      localStorage.setItem('lastOrder', orderId);
      localStorage.setItem('orderStatus', '0'); // 0: Received
      
      checkoutForm.style.display = 'none';
      document.getElementById('order-success-msg').style.display = 'block';
      document.getElementById('generated-track-id').innerText = orderId;
      
      // Clear Cart
      cart = [];
      updateCartUI();
    });
  }
});

// Cart Functions (Global)
function toggleCart() {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
}

function addToCart(id) {
  const item = menuData.find(m => m.id === id);
  const existing = cart.find(c => c.id === id);
  
  if(existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  
  updateCartUI();
  
  // Show quick notification (optional)
  const cartIcon = document.querySelector('.cart-icon-wrapper');
  cartIcon.style.transform = 'scale(1.3)';
  setTimeout(() => cartIcon.style.transform = 'scale(1)', 300);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
}

function updateQty(id, change) {
  const item = cart.find(c => c.id === id);
  if(item) {
    item.qty += change;
    if(item.qty <= 0) {
      removeFromCart(id);
    } else {
      updateCartUI();
    }
  }
}

function updateCartUI() {
  const cartItemsContainer = document.getElementById('cart-items');
  const checkoutItemsContainer = document.getElementById('checkout-items');
  const cartCount = document.getElementById('cart-count');
  const cartTotalPrice = document.getElementById('cart-total-price');
  const checkoutSubtotal = document.getElementById('checkout-subtotal');
  const checkoutGrand = document.getElementById('checkout-grand-total');
  
  let totalQty = 0;
  let subtotal = 0;
  let cartHTML = '';
  let checkoutHTML = '';

  if(cart.length === 0) {
    cartHTML = '<div class="empty-cart">Your cart is empty</div>';
    checkoutHTML = '<div class="empty-cart">No items selected</div>';
  } else {
    cart.forEach(item => {
      totalQty += item.qty;
      const itemTotal = item.qty * item.price;
      subtotal += itemTotal;
      
      cartHTML += `
        <div class="cart-item">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <div class="cart-item-price">₹${item.price}</div>
          </div>
          <div class="cart-item-actions">
            <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
          </div>
        </div>
      `;
      
      checkoutHTML += `
        <div class="checkout-item">
          <span>${item.qty}x ${item.name}</span>
          <span>₹${itemTotal}</span>
        </div>
      `;
    });
  }

  cartCount.innerText = totalQty;
  cartItemsContainer.innerHTML = cartHTML;
  cartTotalPrice.innerText = `₹${subtotal}`;
  
  if(checkoutItemsContainer) {
    checkoutItemsContainer.innerHTML = checkoutHTML;
    checkoutSubtotal.innerText = `₹${subtotal}`;
    checkoutGrand.innerText = `₹${subtotal > 0 ? subtotal + 40 : 0}`; // +40 Delivery fee
  }
}

// Order Tracking Function
function trackOrder() {
  const input = document.getElementById('track-id-input').value;
  const resultDiv = document.getElementById('tracking-result');
  const statusText = document.getElementById('track-status-text');
  const progress = document.getElementById('tracking-progress');
  
  const labelPreparing = document.getElementById('label-preparing');
  const labelReady = document.getElementById('label-ready');
  const labelDelivered = document.getElementById('label-delivered');
  
  if(!input) {
    alert("Please enter a Tracking ID");
    return;
  }

  // Check if it matches our simulated order
  const lastOrder = localStorage.getItem('lastOrder');
  
  resultDiv.style.display = 'block';
  
  if(input === lastOrder) {
    // Simulate progression logic
    let stage = parseInt(localStorage.getItem('orderStatus') || '0');
    
    // Auto advance stage for demo purposes
    if(stage < 3) {
      stage += 1;
      localStorage.setItem('orderStatus', stage.toString());
    }
    
    if(stage === 1) {
      statusText.innerText = "Preparing in Kitchen";
      progress.style.width = "33%";
      labelPreparing.classList.add('active');
    } else if(stage === 2) {
      statusText.innerText = "Out for Delivery";
      progress.style.width = "66%";
      labelPreparing.classList.add('active');
      labelReady.classList.add('active');
    } else if(stage === 3) {
      statusText.innerText = "Delivered";
      progress.style.width = "100%";
      labelPreparing.classList.add('active');
      labelReady.classList.add('active');
      labelDelivered.classList.add('active');
    } else {
      statusText.innerText = "Order Received";
      progress.style.width = "10%";
    }
    
  } else {
    statusText.innerText = "Order Not Found";
    statusText.classList.replace('text-white', 'text-red-500');
    progress.style.width = "0%";
    labelPreparing.classList.remove('active');
    labelReady.classList.remove('active');
    labelDelivered.classList.remove('active');
  }
}
