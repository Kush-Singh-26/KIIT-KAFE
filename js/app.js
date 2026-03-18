/* ═══════════════════════════════════════════
   DATA STORE & FUNCTIONS
═══════════════════════════════════════════ */
let MENU = [];

const CATS = ['All','Beverages','Wafers','Snacks','Coffee & Drinks','Hot Dogs','Biryani'];
const CAT_IMAGES = {
  All: 'https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D?w=150&h=150&fit=crop&q=80',
  Beverages: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=150&h=150&fit=crop&q=80',
  Wafers: 'https://plus.unsplash.com/premium_photo-1726072358288-54effc624aa9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8d2FmZXJzfGVufDB8fDB8fHww?w=150&h=150&fit=crop&q=80',
  Snacks: 'https://images.unsplash.com/photo-1621236378699-8597faf6a176?w=150&h=150&fit=crop&q=80',
  'Coffee & Drinks': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=150&h=150&fit=crop&q=80',
  'Hot Dogs': 'https://plus.unsplash.com/premium_photo-1684923610869-204f1ca6a603?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=150&h=150&fit=crop&q=80',
  Biryani: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=150&h=150&fit=crop&q=80'
};

let cart = [];
let currentUser = null;
let selectedPayMethod = 'upi';
let currentOrderId = '';
let discount = 0;
let activeCategory = 'All';
let statusPollInterval = null;
let orderTrackingInterval = null;

async function fetchMenuData() {
  try {
    const res = await fetch('api/menu.php');
    const data = await res.json();
    MENU = data;
    if (document.getElementById('page-menu').classList.contains('active')) {
      renderMenu();
    }
  } catch (err) {
    console.error("Error fetching menu:", err);
  }
}

// Initial fetch
fetchMenuData();

// Initialize on load
document.addEventListener('DOMContentLoaded', async () => {
  // Check session
  try {
    const res = await fetch('api/get_session.php');
    const data = await res.json();
    if (data.status === 'success') {
      currentUser = data.user;
      currentUser.isAdmin = data.user.role === 'admin';
      
      const welcomeName = document.getElementById('welcome-name');
      if (welcomeName) welcomeName.textContent = currentUser.name;
    }
  } catch (err) {
    console.error("Session error:", err);
  }

  const startPage = window.initialPage || 'landing';
  nav(startPage, false);
});

/* ═══════════════════════════════════════════
   NAVIGATION & ROUTING
═══════════════════════════════════════════ */

// Handle Browser History
window.addEventListener('popstate', (e) => {
  const page = e.state?.page || 'landing';
  nav(page, false); // false = don't push state again
});

function nav(page, push = true) {
  const el = document.getElementById('page-' + page);
  if (!el) {
    console.warn(`Page "${page}" not found, falling back to landing`);
    page = 'landing';
  }

  // Clear intervals when navigating away from certain pages
  if (page === 'landing' || page === 'auth') {
    initLandingDesign();
  } else {
    stopLandingDesign();
  }

  if (page !== 'success' && orderTrackingInterval) {
    clearInterval(orderTrackingInterval);
    orderTrackingInterval = null;
  }
  if (page !== 'payment' && statusPollInterval) {
    clearInterval(statusPollInterval);
    statusPollInterval = null;
  }

  // Update UI
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  window.scrollTo(0,0);

  // Update URL
  if (push) {
    const url = page === 'landing' ? window.basePath : `${window.basePath}${page}`;
    history.pushState({ page }, '', url);
  }

  // Page specific logic
  if (page === 'menu') {
    if (MENU.length === 0) {
      fetchMenuData().then(() => renderMenu());
    } else {
      renderMenu();
    }
  }
  if (page === 'cart') renderCart();
  if (page === 'payment') renderPaymentPage();
  if (page === 'success') {
      const lastId = sessionStorage.getItem('lastOrderId');
      const meta = JSON.parse(sessionStorage.getItem('lastOrderMeta') || '{}');
      const items = JSON.parse(sessionStorage.getItem('lastOrderItems') || '[]');

      if (meta.orderCode) {
          document.getElementById('suc-order-num').textContent = meta.orderCode;
          document.getElementById('suc-date').textContent = meta.date;
          document.getElementById('suc-pay').textContent = meta.payMethod;
          document.getElementById('suc-name').textContent = meta.name;
          document.getElementById('suc-email').textContent = meta.email;
          document.getElementById('suc-phone').textContent = meta.phone;
          document.getElementById('suc-addr').textContent = meta.addr;
          document.getElementById('success-total').textContent = '₹' + meta.total;

          // Restore items
          document.getElementById('success-items-list').innerHTML = items.map(item => `
            <div class="os-inv-item">
              <div class="os-inv-emoji">
                ${item.img ? `<img src="${item.img}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" onerror="this.parentNode.textContent='${item.emoji}'">` : item.emoji}
              </div>
              <div class="os-inv-info"><div class="os-inv-name">${item.name}</div><div class="os-inv-desc">${item.sub}</div></div>
              <div class="os-inv-qty">X${item.qty}<br><span style="font-weight:400;font-size:9px;">unit</span></div>
              <div class="os-inv-price">₹${item.price * item.qty}</div>
            </div>
          `).join('');
      }
      if (lastId) startOrderTracking(lastId);
  }
  if (page === 'admin') {
      if (!currentUser || !currentUser.isAdmin) {
          toast("🚫 Admin access required");
          nav('auth');
          return;
      }
      switchAdminTab('dash');
  }
}

/* ═══════════════════════════════════════════
   UTILS
═══════════════════════════════════════════ */
function toast(msg) {
  const el = document.getElementById('toast-el');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(window._t);
  window._t = setTimeout(() => el.classList.remove('show'), 2600);
}

function closeModal(id) { document.getElementById(id).classList.remove('show'); }

document.querySelectorAll('.modal-overlay').forEach(el => {
  el.addEventListener('click', e => { if (e.target === el) el.classList.remove('show'); });
});
