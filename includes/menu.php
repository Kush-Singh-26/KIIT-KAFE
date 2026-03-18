<!-- ═══════════════════════════════════════
     PAGE 3: MENU
═══════════════════════════════════════ -->
<div id="page-menu" class="page">
  <nav class="menu-topbar">
    <div class="topbar-left">
      <button class="nav-logo-btn" onclick="nav('landing')">
        <div class="nav-logo">KIIT<span>KAFE</span></div>
      </button>
      <div class="topbar-divider"></div>
      <div class="top-addr">
        <span class="location-icon">📍</span>
        <span>Campus 25, Patia, Bhubaneswar</span>
      </div>
    </div>

    <div class="topbar-search">
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input class="menu-search" type="text" id="menu-search-input" placeholder="Search for your favorite food..." oninput="filterMenuItems()">
      </div>
    </div>

    <div class="topbar-right">
      <div class="user-info">
        <span class="welcome-text">Hi, <span id="welcome-name">Guest</span></span>
      </div>
      <div class="topbar-actions">
        <button class="action-btn" onclick="nav('cart')">
          <span class="action-icon">🛒</span>
          <span class="action-label">Cart</span>
          <span class="badge-dot" id="cart-dot" style="display:none;"></span>
        </button>
        <button class="action-btn" onclick="showAccountMenu()">
          <span class="action-icon">👤</span>
          <span class="action-label">Account</span>
        </button>
      </div>
    </div>
  </nav>

  <div class="menu-hero-bar">
    <h1>ORDER AHEAD. SKIP THE QUEUE.<br><span>ENJOY AT KIIT KAFE...</span></h1>
  </div>

  <div class="categories-strip">
    <div class="cat-scroll" id="cat-scroll"></div>
  </div>

  <div class="menu-body">
    <div class="menu-grid-title">
      <span id="menu-section-label">Top rated for you</span>
      <div class="sort-wrapper">
        <select class="sort-select" id="menu-sort" onchange="sortMenuItems(this.value)">
          <option value="default">Sort By</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>
    </div>
    <div class="items-grid" id="items-grid"></div>
  </div>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="logo">KIIT<span>KAFE</span></div>
        <p>Your daily dose of caffeine and calm, served right on campus at KIIT University, Bhubaneswar.</p>
      </div>
      <div class="footer-col">
        <h4>Quick Links</h4>
        <a onclick="nav('menu')">Menu</a>
        <a>About Us</a>
      </div>
      <div class="footer-col">
        <h4>Account</h4>
        <a onclick="nav('auth')">Login</a>
        <a onclick="switchAuthTab('signup');nav('auth')">Sign Up</a>
      </div>
      <div class="footer-col">
        <h4>Visit Us</h4>
        <a>Campus 25, KIIT University</a>
        <a>7AM – 10PM Daily</a>
        <a>kiit.kafe</a>
        <a>+91 8809989535</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 KIIT Kafe.</p>
      <div class="dev-credit">Developed By: <strong>Saurabh Sharma, Chinmay Kar</strong><br><strong>Shirsh Mohan, Debi Prasad, Kush Singh, Parthiv Datta</strong></div>
    </div>
  </footer>
</div>