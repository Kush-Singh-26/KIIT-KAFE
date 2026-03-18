/* ═══════════════════════════════════════════
   ADMIN DASHBOARD JS
 ═══════════════════════════════════════════ */

let ALL_ADMIN_ORDERS = [];
let ADMIN_STATS = { low_stock: 0, low_stock_items: [], revenue: 0, total_orders: 0 };

function switchAdminTab(tab, btn = null) {
    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));

    document.getElementById('admin-tab-' + tab).classList.add('active');

    if (btn) {
        btn.classList.add('active');
    } else {
        // Find the button manually if called programmatically
        const btns = document.querySelectorAll('.admin-nav-btn');
        btns.forEach(b => {
            const oc = b.getAttribute('onclick');
            if (oc && oc.includes(`'${tab}'`)) b.classList.add('active');
        });
    }

    const titles = { 'dash': 'Admin Dashboard', 'menu': 'Manage Menu', 'stock': 'Stock Manager', 'orders': 'Active Orders' };
    document.getElementById('admin-tab-title').textContent = titles[tab];

    if (tab === 'dash') loadAdminStats();
    if (tab === 'menu') {
        // Clear search and show all items by default when switching tabs normally
        const searchInput = document.querySelector('.menu-search');
        if (searchInput) searchInput.value = '';
        loadAdminMenu();
    }
    if (tab === 'stock') loadStockManager();
    if (tab === 'orders') loadAdminOrders();
}

function loadAdminStats() {
    fetch('api/admin_stats.php')
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            ADMIN_STATS = data.stats;
            document.getElementById('stat-revenue').textContent = '₹' + (data.stats.revenue || 0).toFixed(0);
            document.getElementById('stat-today-revenue').textContent = '₹' + (data.stats.today_revenue || 0).toFixed(0);
            document.getElementById('stat-orders').textContent = data.stats.total_orders || 0;
            document.getElementById('stat-today-orders').textContent = data.stats.today_orders || 0;
            document.getElementById('stat-lowstock').textContent = data.stats.low_stock || 0;
            document.getElementById('stat-pending').textContent = data.stats.pending_orders || 0;

            // Frequent items
            const freqList = document.getElementById('frequent-items-list');
            if (data.stats.frequent_items && data.stats.frequent_items.length > 0) {
                freqList.innerHTML = data.stats.frequent_items.map((item, i) => `
                    <div class="freq-item">
                        <span class="freq-rank">#${i + 1}</span>
                        <span class="freq-emoji">${item.emoji}</span>
                        <span class="freq-name">${item.item_name}</span>
                        <span class="freq-qty">${item.total_qty} sold</span>
                    </div>
                `).join('');
            } else {
                freqList.innerHTML = '<p style="padding:16px; color:#64748b; text-align:center;">No orders yet</p>';
            }

            // Recent orders
            const list = document.getElementById('admin-recent-orders-list');
            if (data.recent_orders.length === 0) {
                list.innerHTML = '<p style="padding:20px; color:#64748b;">No recent orders</p>';
            } else {
                list.innerHTML = data.recent_orders.map(o => `
                    <div class="order-row-mini">
                        <div>
                            <strong>${o.order_code}</strong><br>
                            <small>${o.user_name}</small>
                        </div>
                        <div>₹${o.total}</div>
                        <div class="status-${o.status.toLowerCase()}">${o.status}</div>
                    </div>
                `).join('');
            }
        }
    })
    .catch(err => console.error(err));
}

function loadAdminMenu(filterLowStock = false) {
    fetchMenuData().then(() => {
        const list = document.getElementById('admin-items-list');
        if (MENU.length === 0) {
            list.innerHTML = '<p>No items found</p>';
            return;
        }

        let filteredMenu = MENU;
        if (filterLowStock) {
            filteredMenu = MENU.filter(item => parseInt(item.stock) < 5);
        }

        list.innerHTML = filteredMenu.map(item => `
            <div class="admin-item-row">
                <div class="ai-img">${item.emoji}</div>
                <div class="ai-details">
                    <div class="ai-name">${item.name}</div>
                    <div class="ai-cat">${item.cat} • ₹${item.price}</div>
                </div>
                <div class="ai-stock ${parseInt(item.stock) < 5 ? 'low' : ''}">
                    Stock: ${item.stock}
                </div>
                <div class="ai-actions">
                    <button class="ai-btn edit" onclick="editItem(${item.id})">Edit</button>
                    <button class="ai-btn delete" onclick="deleteItem(${item.id})">Delete</button>
                </div>
            </div>
        `).join('');

        if (filterLowStock && filteredMenu.length === 0) {
            list.innerHTML = '<p style="padding:20px; color:#64748b; text-align:center;">No low stock items! 🎉</p>';
        }
    });
}

function showLowStockItems() {
    if (!ADMIN_STATS || !ADMIN_STATS.low_stock_items) return;
    
    const lowStockItems = ADMIN_STATS.low_stock_items;
    const list = document.getElementById('low-stock-list');
    
    if (lowStockItems.length === 0) {
        list.innerHTML = '<p style="padding:20px; color:#64748b; text-align:center;">All items are well stocked! 🎉</p>';
    } else {
        list.innerHTML = lowStockItems.map(item => `
            <div class="admin-item-row" style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                <div class="ai-img" style="width:40px; height:40px; font-size:20px; background:#f8fafc; border-radius:8px; display:flex; align-items:center; justify-content:center;">${item.emoji}</div>
                <div class="ai-details" style="flex:1; margin-left:12px;">
                    <div class="ai-name" style="font-size:14px; font-weight:700; color:var(--dark);">${item.name}</div>
                    <div class="ai-cat" style="font-size:11px; color:#64748b;">Current Stock: <span style="color:#ef4444; font-weight:bold;">${item.stock}</span></div>
                </div>
                <button class="ai-btn edit" onclick="closeModal('low-stock-modal'); switchAdminTab('menu'); setTimeout(()=>editItem(${item.id}), 100)" style="padding:6px 12px; font-size:11px;">Restock</button>
            </div>
        `).join('');
    }
    
    document.getElementById('low-stock-modal').classList.add('show');
}

function loadAdminOrders() {
    const list = document.getElementById('admin-orders-list');
    list.innerHTML = '<p style="padding:20px; color:#64748b;">Loading orders...</p>';
    
    fetch('api/get_orders.php?admin=1')
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            ALL_ADMIN_ORDERS = data.orders;
            renderAdminOrders();
        } else {
            list.innerHTML = '<p style="padding:20px; color:#64748b;">Error loading orders</p>';
        }
    })
    .catch(err => {
        console.error(err);
        list.innerHTML = '<p style="padding:20px; color:#64748b;">Error loading orders</p>';
    });
}

function renderAdminOrders() {
    const list = document.getElementById('admin-orders-list');
    const statusFilter = document.getElementById('order-status-filter').value;
    
    let filtered = ALL_ADMIN_ORDERS;
    if (statusFilter !== 'All') {
        filtered = ALL_ADMIN_ORDERS.filter(o => o.status === statusFilter);
    }

    if (filtered.length > 0) {
        list.innerHTML = filtered.map(o => `
            <div class="admin-order-card">
                <div class="aoc-header">
                    <strong>${o.order_code}</strong>
                    <span class="status-${o.status.toLowerCase()}">${o.status}</span>
                </div>
                <div class="aoc-body">
                    <p>User: ${o.user_name}</p>
                    <p>Total: ₹${o.total}</p>
                    <p>Payment: ${o.payment_method}</p>
                    <p>Date: ${new Date(o.created_at).toLocaleString()}</p>
                </div>
                <div class="aoc-actions">
                    ${o.status === 'Pending' ? `<button class="ai-btn edit" style="width:100%; background:var(--lime); color:var(--dark); border:none; margin-bottom:8px;" onclick="updateOrderStatus(${o.id}, 'Preparing')">Confirm Payment</button>` : ''}
                    <select onchange="updateOrderStatus(${o.id}, this.value)" class="status-select">
                        <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Preparing" ${o.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
                        <option value="Completed" ${o.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        <option value="Failed" ${o.status === 'Failed' ? 'selected' : ''}>Failed</option>
                    </select>
                </div>
            </div>
        `).join('');
    } else {
        list.innerHTML = `<p style="padding:20px; color:#64748b;">No ${statusFilter === 'All' ? '' : statusFilter} orders found</p>`;
    }
}

function filterAdminMenu(q) {
    q = q.toLowerCase();
    const rows = document.querySelectorAll('.admin-item-row');
    rows.forEach(row => {
        const name = row.querySelector('.ai-name').textContent.toLowerCase();
        row.style.display = name.includes(q) ? 'flex' : 'none';
    });
}

function updateOrderStatus(orderId, status) {
    const formData = new FormData();
    formData.append('action', 'update_status');
    formData.append('order_id', orderId);
    formData.append('status', status);
    
    fetch('api/admin_order_actions.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            toast('✅ Status updated');
            loadAdminOrders();
        } else {
            toast('❌ ' + data.message);
        }
    });
}

function showAddItemModal() {
    document.getElementById('item-modal-title').textContent = 'Add New Item';
    document.getElementById('edit-item-id').value = '';
    document.getElementById('item-name').value = '';
    document.getElementById('item-desc').value = '';
    document.getElementById('item-price').value = '';
    document.getElementById('item-stock').value = '';
    document.getElementById('item-category').value = '';
    document.getElementById('item-image').value = '';
    document.getElementById('admin-item-modal').classList.add('show');
}

function showEditItemModal(item) {
    document.getElementById('item-modal-title').textContent = 'Edit Item';
    document.getElementById('edit-item-id').value = item.id;
    document.getElementById('item-name').value = item.name;
    document.getElementById('item-desc').value = item.sub || item.description || '';
    document.getElementById('item-price').value = item.price;
    document.getElementById('item-stock').value = item.stock;
    document.getElementById('item-category').value = item.cat || item.category || '';
    document.getElementById('item-image').value = item.img || item.image_url || '';
    document.getElementById('admin-item-modal').classList.add('show');
}

function saveItemFromModal() {
    const id = document.getElementById('edit-item-id').value;
    const name = document.getElementById('item-name').value.trim();
    const desc = document.getElementById('item-desc').value.trim();
    const price = document.getElementById('item-price').value;
    const stock = document.getElementById('item-stock').value;
    const category = document.getElementById('item-category').value;
    const image = document.getElementById('item-image').value.trim();

    if (!name || !price || !category || stock === '') {
        toast('⚠️ Please fill all required fields');
        return;
    }

    const formData = new FormData();
    const isEdit = id !== '';
    
    if (isEdit) {
        formData.append('action', 'update');
        formData.append('id', id);
    } else {
        formData.append('action', 'add');
    }
    
    formData.append('name', name);
    formData.append('description', desc);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('image_url', image);
    formData.append('stock', stock);

    fetch('api/admin_menu_actions.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            toast(isEdit ? '✅ Item updated' : '✅ Item added');
            closeModal('admin-item-modal');
            fetchMenuData().then(() => loadAdminMenu());
        } else {
            toast('❌ ' + data.message);
        }
    })
    .catch(err => {
        console.error(err);
        toast('❌ Error saving item');
    });
}

function editItem(id) {
    const item = MENU.find(m => m.id === id);
    if (!item) return;
    showEditItemModal(item);
}

function deleteItem(id) {
    if (!confirm('Delete this item?')) return;

    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('id', id);

    fetch('api/admin_menu_actions.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            toast('✅ Item deleted');
            fetchMenuData().then(() => loadAdminMenu());
        } else {
            toast('❌ ' + data.message);
        }
    });
}

/* ═══════════════════════════════════════════
   STOCK MANAGER
═══════════════════════════════════════════ */
function loadStockManager() {
    fetchMenuData().then(() => {
        const list = document.getElementById('stock-manager-list');
        if (MENU.length === 0) {
            list.innerHTML = '<p style="padding:20px; color:#64748b; text-align:center;">No items found</p>';
            return;
        }

        // Sort by stock level (low to high)
        const sorted = [...MENU].sort((a, b) => parseInt(a.stock) - parseInt(b.stock));

        list.innerHTML = sorted.map(item => {
            const isLow = parseInt(item.stock) < 5;
            const isOut = parseInt(item.stock) <= 0;
            
            return `
            <div class="stock-card ${isLow ? 'low-stock' : ''} ${isOut ? 'out-stock' : ''}">
                <div class="sc-header">
                    <span class="sc-emoji">${item.emoji}</span>
                    <div class="sc-info">
                        <div class="sc-name">${item.name}</div>
                        <div class="sc-cat">${item.cat}</div>
                    </div>
                </div>
                <div class="sc-body">
                    <div class="sc-stock ${isOut ? 'out' : (isLow ? 'low' : 'ok')}">
                        <span class="stock-label">Current Stock</span>
                        <span class="stock-value">${item.stock}</span>
                    </div>
                    <div class="sc-actions">
                        <button class="stock-btn minus" onclick="updateStockQty(${item.id}, -5)">-5</button>
                        <button class="stock-btn minus" onclick="updateStockQty(${item.id}, -1)">-1</button>
                        <button class="stock-btn plus" onclick="updateStockQty(${item.id}, 1)">+1</button>
                        <button class="stock-btn plus" onclick="updateStockQty(${item.id}, 5)">+5</button>
                        <button class="stock-btn bulk" onclick="bulkAddStock(${item.id})">Bulk +</button>
                    </div>
                </div>
            </div>
            `;
        }).join('');
    });
}

function updateStockQty(id, delta) {
    const item = MENU.find(m => m.id === id);
    if (!item) return;
    
    const newQty = parseInt(item.stock) + delta;
    if (newQty < 0) {
        toast('⚠️ Stock cannot be negative');
        return;
    }

    const formData = new FormData();
    formData.append('action', 'update_stock');
    formData.append('id', id);
    formData.append('quantity', newQty);

    fetch('api/admin_menu_actions.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            toast(`✅ Stock updated to ${newQty}`);
            loadStockManager();
        } else {
            toast('❌ ' + data.message);
        }
    });
}

function bulkAddStock(id) {
    const item = MENU.find(m => m.id === id);
    if (!item) return;
    
    const qty = prompt(`Add stock for ${item.name}:`, '10');
    if (!qty || isNaN(qty)) return;
    
    const newQty = parseInt(item.stock) + parseInt(qty);
    
    const formData = new FormData();
    formData.append('action', 'update_stock');
    formData.append('id', id);
    formData.append('quantity', newQty);

    fetch('api/admin_menu_actions.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            toast(`✅ Added ${qty} units. New stock: ${newQty}`);
            loadStockManager();
        } else {
            toast('❌ ' + data.message);
        }
    });
}

function quickAddStock() {
    const itemId = prompt('Enter Item ID:');
    if (!itemId) return;
    const qty = prompt('Enter quantity to add:');
    if (!qty || isNaN(qty)) return;
    
    const item = MENU.find(m => m.id == itemId);
    if (!item) {
        toast('⚠️ Item not found');
        return;
    }
    
    const newQty = parseInt(item.stock) + parseInt(qty);
    
    const formData = new FormData();
    formData.append('action', 'update_stock');
    formData.append('id', itemId);
    formData.append('quantity', newQty);

    fetch('api/admin_menu_actions.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            toast(`✅ Stock updated to ${newQty}`);
            loadStockManager();
        } else {
            toast('❌ ' + data.message);
        }
    });
}
