<!-- ═══════════════════════════════════════
     PAGE 1: LANDING (NEW DESIGN)
═══════════════════════════════════════════ -->
<div id="page-landing" class="page active">
  <nav>
    <div class="nav-logo">KIIT<span>KAFE</span></div>
    <div class="nav-btns">
      <button class="btn btn-outline" onclick="nav('auth')">Log In</button>
      <button class="btn btn-fill" onclick="switchAuthTab('signup');nav('auth')">Sign Up</button>
    </div>
  </nav>

  <section class="hero">
    <div class="hero-badge">☕ KIIT University's Favourite Café</div>
    <div class="canvas-text-space"></div>
    <p class="hero-sub">
      Where every sip tells a story. Fresh brews, wholesome bites, and good
      vibes — right in the heart of KIIT campus.
    </p>
    <div class="hero-cta">
      <button class="btn-hero btn-hero-primary" onclick="nav('menu')">Explore Menu</button>
      <button class="btn-hero btn-hero-secondary" onclick="nav('auth')">Order Now</button>
    </div>
    <div class="scroll-hint">
      <span>Scroll</span>
      <div class="scroll-line"></div>
    </div>
  </section>

  <div class="stats">
    <div class="stat-item">
      <div class="stat-number">50+</div>
      <div class="stat-label">Daily Visitors</div>
    </div>
    <div class="stat-item">
      <div class="stat-number">20+</div>
      <div class="stat-label">Menu Items</div>
    </div>
    <div class="stat-item">
      <div class="stat-number">5★</div>
      <div class="stat-label">Student Rating</div>
    </div>
    <div class="stat-item">
      <div class="stat-number">9AM</div>
      <div class="stat-label">Opens Daily</div>
    </div>
  </div>

  <section class="features">
    <p class="section-label">Why Choose Us</p>
    <h2 class="section-title">Crafted with care, served with love.</h2>
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">🌿</div>
        <div class="feature-title">Fresh & Organic</div>
        <div class="feature-desc">
          Locally sourced ingredients prepared fresh every morning. No
          shortcuts, no compromises.
        </div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">⚡</div>
        <div class="feature-title">Quick Service</div>
        <div class="feature-desc">
          Between classes? We've got you. Pre-order via app and skip the queue
          entirely.
        </div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">💚</div>
        <div class="feature-title">Student Deals</div>
        <div class="feature-desc">
          Exclusive discounts with your KIIT ID. Loyalty points on every order
          you place.
        </div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🎵</div>
        <div class="feature-title">Chill Vibes</div>
        <div class="feature-desc">
          The perfect study spot with fast WiFi and comfy seating.
        </div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">☕</div>
        <div class="feature-title">Specialty Coffee</div>
        <div class="feature-desc">
          Cold brews, pour-overs, classic espresso—crafted.
        </div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🌍</div>
        <div class="feature-title">Eco Friendly</div>
        <div class="feature-desc">
          100% compostable packaging. Because we love the planet as much as
          our coffee.
        </div>
      </div>
    </div>
  </section>



  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-top">
        <div>
          <div class="footer-brand">KIIT<span>KAFE</span></div>
          <p class="footer-tagline">
            Your daily dose of caffeine and calm, served right on campus at
            KIIT University, Bhubaneswar.
          </p>
        </div>
        <div>
          <div class="footer-heading">Quick Links</div>
          <ul class="footer-links">
            <li><a onclick="nav('menu')">Menu</a></li>
            <li><a>About Us</a></li>
          </ul>
        </div>
        <div>
          <div class="footer-heading">Account</div>
          <ul class="footer-links">
            <li><a onclick="nav('auth')">Login</a></li>
            <li><a onclick="switchAuthTab('signup');nav('auth')">Sign Up</a></li>
          </ul>
        </div>
        <div>
          <div class="footer-heading">Visit Us</div>
          <ul class="footer-links">
            <li><a>Campus Block A</a></li>
            <li><a>7AM – 10PM</a></li>
            <li><a>kiit.kafe@gmail.com</a></li>
            <li><a>+91 8809989535</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 KIIT KAFE. All rights reserved. Developed By: <strong>Saurabh Sharma, Chinmay Kar, Shirsh Mohan, Debi Prasad, Kush Singh, Parthiv Datta</strong></span>
      </div>
    </div>
  </footer>
</div>
