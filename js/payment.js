/* ═══════════════════════════════════════════
   PAYMENT
═══════════════════════════════════════════ */

let useUPIIntent = false;
let lastPlacedOrderId = null;

function selectPay(method) {
  selectedPayMethod = method;
  useUPIIntent = false; // Reset when method changes
  ['pay-upi','pay-cash'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.classList.remove('selected');
  });
  const selEl = document.getElementById('pay-' + method);
  if(selEl) selEl.classList.add('selected');
  document.getElementById('upi-sub').classList.toggle('show', method === 'upi');
}

function renderPaymentPage() {
  const ts = Date.now().toString(36).toUpperCase();
  currentOrderId = '#' + ts.slice(-6) + 'D';
  document.getElementById('payment-order-id').textContent = currentOrderId;
  generateUPIQR();
  
  const t = getCartTotals();
  document.getElementById('payment-items-list').innerHTML = cart.map(item => `
    <div class="os-item">
      <div class="os-img">
        ${item.img ? `<img src="${item.img}" alt="${item.name}" onerror="this.parentNode.textContent='${item.emoji}'">` : item.emoji}
      </div>
      <div class="os-info">
        <div class="os-name">${item.name}</div>
        <div class="os-sub">${item.sub}</div>
      </div>
      <div class="os-qty">X${item.qty}<br><span style="font-weight:400;font-size:9px;">unit</span></div>
      <div class="os-price">₹${item.price * item.qty}</div>
    </div>
  `).join('');
  document.getElementById('payment-total').textContent = '₹' + t.grand;

  // Add listener for manual UPI validation
  const upiInput = document.getElementById('upi-id-input');
  const manualBtn = document.getElementById('btn-manual-pay');
  if (upiInput && manualBtn) {
    upiInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      // Strict UPI validation: alphanum/dot/dash @ provider
      const isValid = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(val);
      manualBtn.disabled = !isValid;
    });
  }
}

function generateUPIQR() {
  const t = getCartTotals();
  const upiID = "9667556317@ptaxis";
  const amount = t.grand;
  const upiURL = `upi://pay?pa=${upiID}&pn=KIIT%20KAFE&am=${amount}&cu=INR`;
  const qrAPI = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiURL)}`;
  document.getElementById("upi-qr").src = qrAPI;
}

function payWithApp(){
  useUPIIntent = true;
  placeOrder();
}

function payWithManualUPI() {
  const upiID = document.getElementById('upi-id-input').value.trim();
  if (!upiID) return;
  useUPIIntent = true;
  placeOrder();
}

function placeOrder() {
  if (cart.length === 0) { toast("⚠ Cart is empty!"); return; }
  if (!currentUser) { toast("⚠ Please login first"); nav("auth"); return; }

  const t = getCartTotals();
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) + ' at ' + now.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
  const payLabels = { upi:'UPI Payment', cash:'Cash Payment' };

  const upiID = "9667556317@ptaxis";
  const upiLink = `upi://pay?pa=${upiID}&pn=KIIT%20KAFE&am=${t.grand}&cu=INR`;

  const orderMeta = {
      orderCode: currentOrderId,
      date: dateStr,
      payMethod: payLabels[selectedPayMethod] || 'UPI Payment',
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone || '8809989XXX',
      addr: 'KP-25 Block A, Workers Colony, KIIT University, Bhubaneswar',
      total: t.grand
  };
  sessionStorage.setItem('lastOrderMeta', JSON.stringify(orderMeta));

  // Fill UI
  document.getElementById('suc-order-num').textContent = currentOrderId;
  document.getElementById('suc-date').textContent = dateStr;
  document.getElementById('suc-pay').textContent = payLabels[selectedPayMethod] || 'UPI Payment';
  document.getElementById('suc-name').textContent = currentUser.name;
  document.getElementById('suc-email').textContent = currentUser.email;
  document.getElementById('suc-phone').textContent = currentUser.phone || '8809989XXX';
  document.getElementById('suc-addr').textContent = 'KP-25 Block A, Workers Colony, KIIT University, Bhubaneswar';

  sessionStorage.setItem('lastOrderItems', JSON.stringify(cart));

  document.getElementById('inv-modal-ref').textContent = 'Invoice ' + currentOrderId;
  document.getElementById('inv-m-customer').textContent = currentUser.name;
  document.getElementById('inv-m-orderid').textContent = currentOrderId;
  document.getElementById('inv-m-date').textContent = dateStr;
  document.getElementById('inv-m-pay').textContent = (payLabels[selectedPayMethod] || 'UPI Payment') + ' ✓';
  document.getElementById('inv-m-items').innerHTML = cart.map(item => `
    <div class="inv-line-item"><span>${item.emoji} ${item.name} × ${item.qty}</span><span>₹${item.price * item.qty}</span></div>
  `).join('');
  document.getElementById('inv-m-subtotal').textContent = '₹' + t.itemTotal;
  document.getElementById('inv-m-gst').textContent = '₹' + t.gst;
  document.getElementById('inv-m-discount').textContent = '-₹' + t.discount;
  document.getElementById('inv-m-grand').textContent = '₹' + t.grand;

  // Actual API call
  fetch("api/create_order.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      order_code: currentOrderId,
      user_id: currentUser.id,
      payment_method: selectedPayMethod,
      total: t.grand,
      items: cart
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      lastPlacedOrderId = data.order_id;
      startPaymentPolling(data.order_id, upiLink);
    } else {
      document.getElementById('failure-modal-reason').textContent = data.message || 'Payment processing failed';
      document.getElementById('payment-failure-modal').classList.add('show');
    }
    useUPIIntent = false; // Reset after attempt
  })
  .catch(err => {
    console.error("Order error:", err);
    document.getElementById('failure-modal-reason').textContent = 'Connection error. Please try again.';
    document.getElementById('payment-failure-modal').classList.add('show');
    useUPIIntent = false;
  });
}

function startPaymentPolling(orderId, upiLink) {
  const icon = document.getElementById('pay-wait-icon');
  const title = document.getElementById('pay-wait-title');
  const desc = document.getElementById('pay-wait-desc');

  if (selectedPayMethod === 'cash') {
    icon.textContent = '💵';
    title.textContent = 'Waiting for Cash Payment';
    desc.textContent = 'Please pay at the counter. Your order will be confirmed once the payment is received by the admin.';
  } else {
    icon.textContent = '📱';
    title.textContent = 'Verifying UPI Payment';
    desc.textContent = 'Please complete the payment in your UPI app. We are waiting for the admin to confirm your payment.';
  }

  document.getElementById('payment-waiting-modal').classList.add('show');
  
  if (useUPIIntent && upiLink) {
    window.location.href = upiLink;
  }

  if (statusPollInterval) clearInterval(statusPollInterval);
  
  statusPollInterval = setInterval(() => {
    fetch(`api/get_order_status.php?order_id=${orderId}`)
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success' && data.order_status !== 'Pending') {
        clearInterval(statusPollInterval);
        closeModal('payment-waiting-modal');
        
        // Now show success modal
        document.getElementById('success-modal-order-id').textContent = currentOrderId;
        document.getElementById('payment-success-modal').classList.add('show');
        
        finishOrder(orderId);
      }
    });
  }, 3000);
}

function cancelPaymentOrder() {
  if (confirm("Are you sure you want to cancel this order?")) {
    const orderIdToCancel = lastPlacedOrderId;
    if (orderIdToCancel) {
      fetch("api/cancel_order.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderIdToCancel })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          toast("✅ Order cancelled successfully");
        } else {
          console.error("Cancellation error:", data.message);
        }
      })
      .catch(err => console.error("Cancellation fetch error:", err));
    }

    clearInterval(statusPollInterval);
    closeModal('payment-waiting-modal');
    nav('menu');
  }
}

function finishOrder(orderId) {
  cart = [];
  discount = 0;
  updateCartIndicators();
  sessionStorage.setItem('lastOrderId', orderId);
  sessionStorage.setItem('lastOrderCode', currentOrderId);
  nav('success');
  startOrderTracking(orderId);
}

function startOrderTracking(orderId) {
  if (orderTrackingInterval) clearInterval(orderTrackingInterval);

  const updateUI = (status) => {
    const text = document.getElementById('track-status-text');
    const badge = document.getElementById('track-status-badge');
    const desc = document.getElementById('track-status-desc');
    const estTimeBox = document.getElementById('estimated-time-box');
    const estTime = document.getElementById('estimated-time');

    if (status === 'Pending') {
      text.textContent = 'Waiting for confirmation...';
      text.style.color = '#f59e0b';
      badge.textContent = 'Pending';
      badge.style.background = '#fef3c7';
      badge.style.color = '#d97706';
      desc.textContent = 'We are waiting for the admin to confirm your payment.';
      estTimeBox.style.display = 'flex';
      estTime.textContent = '15-20 min';

      updateSteps(2);
    } else if (status === 'Preparing') {
      text.textContent = 'Preparing your food...';
      text.style.color = '#f59e0b';
      badge.textContent = 'Preparing';
      badge.style.background = '#fef3c7';
      badge.style.color = '#d97706';
      desc.textContent = 'The kitchen is currently preparing your delicious meal!';
      estTimeBox.style.display = 'flex';
      estTime.textContent = '10-15 min';

      updateSteps(3);
    } else if (status === 'Completed') {
      text.textContent = 'Order is ready!';
      text.style.color = '#10b981';
      badge.textContent = 'Completed';
      badge.style.background = '#d1fae5';
      badge.style.color = '#059669';
      desc.textContent = 'Your order is ready for pickup! Enjoy your meal.';
      estTimeBox.style.display = 'none';

      updateSteps(4);
      clearInterval(orderTrackingInterval);
    }
  };

  const updateSteps = (step) => {
    const steps = ['placed', 'confirmed', 'preparing', 'completed'];
    steps.forEach((s, i) => {
      const el = document.querySelector(`#step-${s} .ps-dot`);
      const line = document.getElementById(`line-${i + 1}`);
      
      // Update Step Dot
      if (i + 1 < step) {
        el.className = 'ps-dot done';
        el.textContent = '✓';
      } else if (i + 1 === step) {
        el.className = 'ps-dot active';
        el.textContent = (s === 'preparing') ? '🍳' : (s === 'completed' ? '✅' : '✓');
      } else {
        el.className = 'ps-dot';
        el.textContent = (s === 'preparing') ? '🍳' : (s === 'completed' ? '✅' : '✓');
      }

      // Update Step Line
      if (line) {
        line.className = (i + 1 < step) ? 'ps-line done' : 'ps-line';
      }
    });
  };

  // Initial check
  fetch(`api/get_order_status.php?order_id=${orderId}`)
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') updateUI(data.order_status);
    });

  orderTrackingInterval = setInterval(() => {
    fetch(`api/get_order_status.php?order_id=${orderId}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') updateUI(data.order_status);
      });
  }, 5000);
}

function completePayment(){ toast("✅ Payment successful"); }
function openInvoice() { document.getElementById('invoice-modal').classList.add('show'); }
function viewInvoiceFromModal() { closeModal('payment-success-modal'); openInvoice(); }
