<!-- ═══════════════════════════════════════
     PAGE 7: ADMIN
═══════════════════════════════════════════ -->
<div id="page-admin" class="page">
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="nav-logo" style="padding: 24px; font-size: 20px;">KIIT<span>KAFE</span> <small style="font-size:10px; color:var(--lime); display:block;">Admin Panel</small></div>
      <nav class="admin-nav">
        <button class="admin-nav-btn active" onclick="switchAdminTab('dash', this)">📊 Dashboard</button>
        <button class="admin-nav-btn" onclick="switchAdminTab('menu', this)">🍔 Manage Menu</button>
        <button class="admin-nav-btn" onclick="switchAdminTab('stock', this)">📦 Stock Manager</button>
        <button class="admin-nav-btn" onclick="switchAdminTab('orders', this)">📋 Active Orders</button>
        <button class="admin-nav-btn" onclick="nav('landing')">🚪 Exit to Site</button>
        <button class="admin-nav-btn" style="margin-top:auto; color:#ff6b6b;" onclick="doLogout()">🔒 Logout</button>
      </nav>
    </aside>

    <main class="admin-main">
      <header class="admin-header">
        <h2 id="admin-tab-title">Admin Dashboard</h2>
        <div class="admin-user-info">
          Welcome, <strong>Admin</strong>
        </div>
      </header>

      <!-- DASHBOARD TAB -->
      <div class="admin-tab-content active" id="admin-tab-dash">
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-icon">💰</span>
            <div class="stat-info">
              <div class="stat-val" id="stat-revenue">₹0</div>
              <div class="stat-label">Total Revenue</div>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">📊</span>
            <div class="stat-info">
              <div class="stat-val" id="stat-today-revenue">₹0</div>
              <div class="stat-label">Today's Revenue</div>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">🛍</span>
            <div class="stat-info">
              <div class="stat-val" id="stat-orders">0</div>
              <div class="stat-label">Total Orders</div>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">📦</span>
            <div class="stat-info">
              <div class="stat-val" id="stat-today-orders">0</div>
              <div class="stat-label">Today's Orders</div>
            </div>
          </div>
          <div class="stat-card" onclick="showLowStockItems()" style="cursor:pointer;">
            <span class="stat-icon">⚠️</span>
            <div class="stat-info">
              <div class="stat-val" id="stat-lowstock">0</div>
              <div class="stat-label">Low Stock Items</div>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">⏳</span>
            <div class="stat-info">
              <div class="stat-val" id="stat-pending">0</div>
              <div class="stat-label">Pending Orders</div>
            </div>
          </div>
        </div>

        <div class="admin-dashboard-grid">
          <div class="admin-dash-section">
            <h3>🔥 Popular Items</h3>
            <div id="frequent-items-list" class="frequent-items-list">
              Loading...
            </div>
          </div>
          <div class="admin-dash-section">
            <h3>📋 Recent Orders</h3>
            <div id="admin-recent-orders-list" class="recent-orders-list">Loading orders...</div>
          </div>
        </div>
      </div>

      <!-- MANAGE MENU TAB -->
      <div class="admin-tab-content" id="admin-tab-menu">
        <div class="admin-actions-bar">
          <button class="cta-primary" onclick="showAddItemModal()">+ Add New Item</button>
          <div class="search-wrap" style="flex:1; max-width: 400px;">
            <input type="text" placeholder="Search menu items..." class="admin-menu-search" oninput="filterAdminMenu(this.value)">
          </div>
        </div>
        <div class="admin-items-list" id="admin-items-list">
          <!-- Items will be injected here -->
        </div>
      </div>

      <!-- STOCK MANAGER TAB -->
      <div class="admin-tab-content" id="admin-tab-stock">
        <div class="admin-actions-bar">
          <h3 style="font-size:16px;font-weight:800;color:var(--dark);">📦 Stock Management</h3>
          <button class="cta-primary" onclick="quickAddStock()">+ Quick Add Stock</button>
        </div>
        <div class="stock-manager-grid" id="stock-manager-list">
          <!-- Stock items will be injected here -->
        </div>
      </div>

      <!-- ADD/EDIT ITEM MODAL -->
      <div class="modal-overlay" id="admin-item-modal">
        <div style="background:white;border-radius:20px;padding:32px;max-width:500px;width:100%;animation:popIn 0.3s ease both;">
          <h3 style="font-family:'Syne',sans-serif;font-size:18px;font-weight:900;color:#1a1a1a;margin-bottom:20px;" id="item-modal-title">Add New Item</h3>
          <input type="hidden" id="edit-item-id">
          <div style="margin-bottom:16px;">
            <label style="font-size:12px;font-weight:700;color:#666;display:block;margin-bottom:6px;">Item Name *</label>
            <input type="text" id="item-name" placeholder="e.g. Cold Coffee" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;">
          </div>
          <div style="margin-bottom:16px;">
            <label style="font-size:12px;font-weight:700;color:#666;display:block;margin-bottom:6px;">Description</label>
            <textarea id="item-desc" placeholder="e.g. Creamy iced coffee" rows="2" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;resize:none;"></textarea>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
            <div>
              <label style="font-size:12px;font-weight:700;color:#666;display:block;margin-bottom:6px;">Price (₹) *</label>
              <input type="number" id="item-price" placeholder="99" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;">
            </div>
            <div>
              <label style="font-size:12px;font-weight:700;color:#666;display:block;margin-bottom:6px;">Stock Qty *</label>
              <input type="number" id="item-stock" placeholder="10" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;">
            </div>
          </div>
          <div style="margin-bottom:16px;">
            <label style="font-size:12px;font-weight:700;color:#666;display:block;margin-bottom:6px;">Category *</label>
            <select id="item-category" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;background:white;">
              <option value="">Select category</option>
              <option value="Beverages">🥤 Beverages</option>
              <option value="Wafers">🍪 Wafers</option>
              <option value="Snacks">🍟 Snacks</option>
              <option value="Coffee & Drinks">☕ Coffee & Drinks</option>
              <option value="Hot Dogs">🌭 Hot Dogs</option>
              <option value="Biryani">🍛 Biryani</option>
            </select>
          </div>
          <div style="margin-bottom:20px;">
            <label style="font-size:12px;font-weight:700;color:#666;display:block;margin-bottom:6px;">Image URL</label>
            <input type="text" id="item-image" placeholder="https://..." style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;">
          </div>
          <div style="display:flex;gap:10px;">
            <button onclick="saveItemFromModal()" style="flex:1;padding:12px;background:#2d6a4f;color:white;border-radius:8px;font-weight:700;">Save Item</button>
            <button onclick="closeModal('admin-item-modal')" style="flex:1;padding:12px;background:#f0f0f0;color:#444;border-radius:8px;font-weight:700;">Cancel</button>
          </div>
        </div>
      </div>

      <!-- ORDERS TAB -->
      <div class="admin-tab-content" id="admin-tab-orders">
        <div class="orders-filter-bar">
          <select id="order-status-filter" onchange="renderAdminOrders()">
            <option value="All">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div class="admin-orders-grid" id="admin-orders-list">
          <!-- Orders will be injected here -->
        </div>
      </div>
    </main>
  </div>
</div>
