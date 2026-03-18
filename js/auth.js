/* ═══════════════════════════════════════════
   AUTH
═══════════════════════════════════════════ */
function switchAuthTab(tab) {
  ['login','signup','forgot'].forEach(t => {
    document.getElementById('auth-' + t)?.classList.remove('active');
  });
  document.getElementById('auth-' + tab)?.classList.add('active');
  document.getElementById('tab-login')?.classList.toggle('active', tab === 'login');
  document.getElementById('tab-signup')?.classList.toggle('active', tab === 'signup');
}

function showForgot() { switchAuthTab('forgot'); }
function showLogin() { switchAuthTab('login'); }

function togglePass(id, btn) {
  const inp = document.getElementById(id);
  if (inp.type === 'password') { inp.type = 'text'; btn.textContent = '🙈'; }
  else { inp.type = 'password'; btn.textContent = '👁'; }
}

function doLogin() {
  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-pass").value;

  if (!email || !pass) {
    toast("⚠ Please fill all fields");
    return;
  }

  fetch("api/login.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, password: pass })
  })
  .then(res => {
    if (!res.ok) {
      return res.text().then(text => { throw new Error(text) });
    }
    return res.json();
  })
  .then(data => {
    if (data.status === "success") {
      currentUser = data.user;
      currentUser.isAdmin = data.user.role === 'admin';
      afterLogin();
    } else {
      toast("❌ " + (data.message || "Invalid login"));
    }
  })
  .catch(err => {
    console.error("Login Error:", err);
    toast("❌ Connection error. See console.");
  });
}

function doSignup() {
  const name = document.getElementById('su-name').value.trim();
  const email = document.getElementById('su-email').value.trim();
  const phone = document.getElementById('su-phone').value.trim();
  const pass = document.getElementById('su-pass').value;

  if (!name || !email || !phone || !pass) {
    toast('⚠ Please fill all fields');
    return;
  }

  fetch("api/signup.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, password: pass })
  })
  .then(res => {
    if (!res.ok) {
      return res.text().then(text => { throw new Error(text) });
    }
    return res.json();
  })
  .then(data => {
    if (data.status === "success") {
      toast("✅ Account created! Please log in.");
      switchAuthTab('login');
    } else {
      toast("❌ " + (data.message || "Signup failed"));
    }
  })
  .catch(err => {
    console.error("Signup Error:", err);
    toast("❌ Connection error. See console.");
  });
}

function doSocialLogin(type) {
  currentUser = { name: 'Student', email: 'student@kiit.ac.in', phone: '8809989XXX' };
  toast('✅ Signed in with ' + type);
  afterLogin();
}

function doAdminLogin() {
  const email = "admin@kiitkafe.in";
  const pass = "admin123";
  fetch("api/login.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, password: pass })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success" && data.user.role === 'admin') {
      currentUser = data.user;
      currentUser.isAdmin = true;
      afterLogin();
    } else {
      toast("❌ Admin credentials invalid");
    }
  })
  .catch(err => toast("❌ Connection error"));
}

function doForgot() {
  const email = document.getElementById('forgot-email').value.trim();
  if (!email) { toast('⚠ Enter your email'); return; }
  
  const newPass = prompt('Enter new password:');
  if (!newPass) return;
  
  fetch("api/forgot_password.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, new_password: newPass })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      toast('✅ Password updated! Please login.');
      showLogin();
    } else {
      toast('❌ ' + (data.message || "Update failed"));
    }
  })
  .catch(err => toast('❌ Connection error'));
}

function afterLogin() {
  document.getElementById('welcome-name').textContent = currentUser.name;
  if (currentUser.isAdmin) {
    toast('🔑 Admin Access: Welcome, ' + currentUser.name + '!');
    nav('admin');
  } else {
    toast('🎉 Welcome, ' + currentUser.name + '!');
    nav('menu');
  }
}

function doLogout() {
  fetch("api/logout.php")
    .then(() => {
      currentUser = null;
      cart = [];
      discount = 0;
      updateCartIndicators();
      closeModal('account-modal');
      toast('👋 Logged out successfully');
      nav('landing');
    })
    .catch(err => {
      console.error("Logout error:", err);
      toast("❌ Logout failed. Try again.");
    });
}

function showAccountMenu() {
  if (!currentUser) {
    nav('auth');
    return;
  }
  document.getElementById('account-modal-name').textContent = currentUser.name;
  document.getElementById('account-modal-email').textContent = currentUser.email;
  document.getElementById('account-modal-phone').textContent = currentUser.phone || 'Not set';
  loadOrderHistory();
  document.getElementById('account-modal').classList.add('show');
}

function loadOrderHistory() {
  const container = document.getElementById('order-history-list');
  container.innerHTML = '<div style="text-align:center;padding:20px;color:#888;font-size:13px;">Loading orders...</div>';
  
  fetch("api/get_user_orders.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: currentUser.id })
  })
  .then(res => {
    console.log("Response status:", res.status);
    if (!res.ok) {
      throw new Error("HTTP error: " + res.status);
    }
    return res.json();
  })
  .then(data => {
    console.log("Order data:", data);
    if (data.status === "success" && data.orders.length > 0) {
      container.innerHTML = data.orders.map(order => {
        const statusColors = {
          'Pending': '#f59e0b',
          'Preparing': '#3b82f6',
          'Completed': '#22c55e',
          'Failed': '#ef4444',
          'Invalid': '#6b7280'
        };
        const statusColor = statusColors[order.status] || '#888';
        const date = new Date(order.created_at);
        const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        
        return `
          <div style="background:#f9f9f9;border-radius:12px;padding:14px;margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <span style="font-weight:700;font-size:13px;color:#1a1a1a;">#${order.order_code}</span>
              <span style="background:${statusColor};color:white;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700;">${order.status}</span>
            </div>
            <div style="font-size:11px;color:#666;margin-bottom:6px;">📅 ${dateStr} · ${timeStr}</div>
            <div style="font-size:12px;color:#444;margin-bottom:6px;">${order.items || 'No items'}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:11px;color:#888;">${order.total_items} item(s)</span>
              <span style="font-weight:800;font-size:14px;color:#1a1a1a;">₹${order.total}</span>
            </div>
          </div>
        `;
      }).join('');
    } else if (data.status === "success") {
      container.innerHTML = '<div style="text-align:center;padding:20px;color:#888;font-size:13px;">📭 No orders yet</div>';
    } else {
      console.error("API error:", data.message);
      container.innerHTML = '<div style="text-align:center;padding:20px;color:#ef4444;font-size:13px;">❌ ' + (data.message || 'Failed to load orders') + '</div>';
    }
  })
  .catch(err => {
    console.error("Order history error:", err);
    container.innerHTML = '<div style="text-align:center;padding:20px;color:#ef4444;font-size:13px;">❌ Error: ' + err.message + '</div>';
  });
}

function updateProfile() {
  closeModal('account-modal');
  
  // Create edit profile modal dynamically
  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.id = 'edit-profile-modal';
  modal.innerHTML = `
    <div style="background:white;border-radius:20px;padding:32px;max-width:400px;width:100%;animation:popIn 0.3s ease both;">
      <h3 style="font-family:'Syne',sans-serif;font-size:18px;font-weight:900;color:#1a1a1a;margin-bottom:20px;">✏️ Edit Profile</h3>
      
      <div style="margin-bottom:16px;">
        <label style="font-size:12px;font-weight:700;color:#666;display:block;margin-bottom:6px;">Name</label>
        <input type="text" id="edit-name" value="${currentUser.name}" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;">
      </div>
      
      <div style="margin-bottom:16px;">
        <label style="font-size:12px;font-weight:700;color:#666;display:block;margin-bottom:6px;">Phone</label>
        <input type="tel" id="edit-phone" value="${currentUser.phone || ''}" placeholder="+91 XXXXXXXXXX" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;">
      </div>
      
      <div style="margin-bottom:16px;">
        <label style="font-size:12px;font-weight:700;color:#666;display:block;margin-bottom:6px;">Current Password <span style="color:#ef4444;">*</span></label>
        <input type="password" id="current-pass" placeholder="Enter current password" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;">
      </div>
      
      <div style="margin-bottom:20px;">
        <label style="font-size:12px;font-weight:700;color:#666;display:block;margin-bottom:6px;">New Password <span style="color:#888;">(optional)</span></label>
        <input type="password" id="new-pass" placeholder="Leave blank to keep current" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;">
        <div style="font-size:11px;color:#888;margin-top:4px;">Must be at least 6 characters</div>
      </div>
      
      <div style="display:flex;gap:10px;">
        <button onclick="saveProfileChanges()" style="flex:1;padding:12px;background:#2d6a4f;color:white;border-radius:8px;font-weight:700;">Save Changes</button>
        <button onclick="closeModal('edit-profile-modal');setTimeout(()=>showAccountMenu(),100)" style="flex:1;padding:12px;background:#f0f0f0;color:#444;border-radius:8px;font-weight:700;">Cancel</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      closeModal('edit-profile-modal');
      setTimeout(()=>showAccountMenu(), 100);
    }
  });
}

function saveProfileChanges() {
  const name = document.getElementById('edit-name').value.trim();
  const phone = document.getElementById('edit-phone').value.trim();
  const currentPass = document.getElementById('current-pass').value;
  const newPass = document.getElementById('new-pass').value;
  
  if (!name) {
    toast('⚠️ Name is required');
    return;
  }
  
  if (!currentPass) {
    toast('⚠️ Current password is required');
    return;
  }
  
  if (newPass && newPass.length < 6) {
    toast('⚠️ New password must be at least 6 characters');
    return;
  }
  
  fetch("api/update_profile.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: currentUser.id,
      name: name,
      phone: phone,
      password: newPass || null,
      current_password: currentPass
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      currentUser.name = name;
      currentUser.phone = phone;
      document.getElementById('welcome-name').textContent = name;
      document.getElementById('account-modal-name').textContent = name;
      toast('✅ Profile updated successfully');
      closeModal('edit-profile-modal');
      setTimeout(()=>showAccountMenu(), 100);
    } else {
      toast('❌ ' + data.message);
    }
  })
  .catch(err => {
    console.error(err);
    toast('❌ Connection error');
  });
}
