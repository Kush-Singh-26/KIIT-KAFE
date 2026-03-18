<!-- ═══════════════════════════════════════
     INVOICE MODAL
═══════════════════════════════════════ -->
<div class="modal-overlay" id="invoice-modal">
  <div class="invoice-modal-box">
    <div class="inv-modal-top">
      <div>
        <h3>🍽 KIIT Kafe · Tax Invoice</h3>
        <div class="inv-ref" id="inv-modal-ref">Invoice #INV-10204D</div>
      </div>
      <button class="inv-close" onclick="closeModal('invoice-modal')">✕</button>
    </div>
    <div class="inv-modal-body">
      <div class="inv-meta-row"><span>Customer</span><span id="inv-m-customer">Saurabh Sharma</span></div>
      <div class="inv-meta-row"><span>Order ID</span><span id="inv-m-orderid">#10204D</span></div>
      <div class="inv-meta-row"><span>Date &amp; Time</span><span id="inv-m-date">—</span></div>
      <div class="inv-meta-row"><span>Payment Method</span><span id="inv-m-pay">UPI ✓</span></div>
      <div class="inv-meta-row"><span>Address</span><span>KP-25 Block A, KIIT University</span></div>
      <div class="inv-divider"></div>
      <div id="inv-m-items"></div>
      <div class="inv-divider"></div>
      <div class="inv-meta-row"><span>Item Total</span><span id="inv-m-subtotal">₹0</span></div>
      <div class="inv-meta-row"><span>Delivery</span><span>₹20</span></div>
      <div class="inv-meta-row"><span>GST (5%)</span><span id="inv-m-gst">₹0</span></div>
      <div class="inv-meta-row"><span>Discount</span><span id="inv-m-discount" style="color:#2d6a4f;">-₹0</span></div>
      <div class="inv-grand-row"><span>Grand Total</span><span id="inv-m-grand">₹0</span></div>
      <div class="inv-footer-note">Thank you for ordering with KIIT Kafe! 🙏<br><span>support@kiitkafe.in · Campus 25, KIIT University, Bhubaneswar</span><br><span style="font-size:10px;color:#ccc;">Developed by: Saurabh Sharma &amp; Team</span></div>
    </div>
    <div class="inv-modal-actions">
      <button class="inv-act print" onclick="window.print()">🖨 Print Invoice</button>
      <button class="inv-act close-inv" onclick="closeModal('invoice-modal')">Close</button>
    </div>
  </div>
</div>

<!-- COUPON MODAL -->
<div class="modal-overlay" id="coupon-modal">
  <div style="background:white;border-radius:20px;padding:32px;max-width:380px;width:100%;animation:popIn 0.3s ease both;">
    <h3 style="font-family:'Syne',sans-serif;font-size:18px;font-weight:900;color:#1a1a1a;margin-bottom:16px;">🏷 Apply Coupon</h3>
    <div style="display:flex;gap:10px;margin-bottom:12px;">
      <input id="coupon-input" type="text" placeholder="Enter coupon code" style="flex:1;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;">
      <button onclick="applyCoupon()" style="padding:12px 20px;background:#2d6a4f;color:white;border-radius:8px;font-weight:800;font-size:14px;">Apply</button>
    </div>
    <div style="font-size:12px;color:#888;margin-bottom:20px;">Try: <strong>KIIT10</strong> (10% off) or <strong>STUDENT</strong> (₹50 off)</div>
    <button onclick="closeModal('coupon-modal')" style="width:100%;padding:12px;background:#f0f0f0;border-radius:8px;font-weight:700;color:#444;">Close</button>
  </div>
</div>

<!-- ACCOUNT MODAL -->
<div class="modal-overlay" id="account-modal">
  <div style="background:white;border-radius:20px;padding:32px;max-width:450px;width:100%;animation:popIn 0.3s ease both;max-height:80vh;overflow-y:auto;">
    <h3 style="font-family:'Syne',sans-serif;font-size:18px;font-weight:900;color:#1a1a1a;margin-bottom:16px;">👤 My Account</h3>
    <div style="margin-bottom:20px;">
      <div style="font-size:12px;color:#888;">Name</div>
      <div id="account-modal-name" style="font-size:16px;font-weight:700;color:#1a1a1a;">-</div>
    </div>
    <div style="margin-bottom:20px;">
      <div style="font-size:12px;color:#888;">Email</div>
      <div id="account-modal-email" style="font-size:14px;color:#1a1a1a;">-</div>
    </div>
    <div style="margin-bottom:20px;">
      <div style="font-size:12px;color:#888;">Phone</div>
      <div id="account-modal-phone" style="font-size:14px;color:#1a1a1a;">-</div>
    </div>
    <div style="display:flex;gap:10px;margin-bottom:20px;">
      <button onclick="updateProfile()" style="flex:1;padding:12px;background:#2d6a4f;color:white;border-radius:8px;font-weight:700;">Edit Profile</button>
      <button onclick="doLogout()" style="flex:1;padding:12px;background:#fee2e2;color:#ef4444;border-radius:8px;font-weight:700;">Logout</button>
    </div>
    
    <!-- Order History Section -->
    <div style="border-top:1px solid #eee;padding-top:20px;">
      <h4 style="font-family:'Syne',sans-serif;font-size:16px;font-weight:800;color:#1a1a1a;margin-bottom:12px;">📦 Order History</h4>
      <div id="order-history-list" style="max-height:300px;overflow-y:auto;">
        <div style="text-align:center;padding:20px;color:#888;font-size:13px;">Loading orders...</div>
      </div>
    </div>
    
    <button onclick="closeModal('account-modal')" style="width:100%;padding:12px;background:#f0f0f0;border-radius:8px;font-weight:700;color:#444;margin-top:16px;">Close</button>
  </div>
</div>

<!-- PAYMENT WAITING MODAL -->
<div class="modal-overlay" id="payment-waiting-modal">
  <div style="background:white;border-radius:24px;padding:40px;max-width:400px;width:100%;text-align:center;animation:popIn 0.3s ease both;">
    <div style="font-size:60px;margin-bottom:20px;" id="pay-wait-icon">💵</div>
    <h3 style="font-family:'Syne',sans-serif;font-size:22px;font-weight:900;color:#1a1a1a;margin-bottom:12px;" id="pay-wait-title">Waiting for Cash Payment</h3>
    <p style="color:#666;font-size:14px;line-height:1.6;margin-bottom:24px;" id="pay-wait-desc">Please pay at the counter. Your order will be confirmed once the payment is received by the admin.</p>
    <div style="display:flex;align-items:center;justify-content:center;gap:12px;color:var(--green-mid);font-weight:700;font-size:14px;">
      <div class="spinner-sm" style="width:16px;height:16px;border:2px solid var(--green-mid);border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;"></div>
      Verifying payment status...
    </div>
    <button onclick="cancelPaymentOrder()" style="margin-top:32px;width:100%;padding:14px;background:#f8f9fa;color:#888;border-radius:12px;font-weight:700;font-size:14px;">Cancel Order</button>
  </div>
</div>

<!-- LOW STOCK MODAL -->
<div class="modal-overlay" id="low-stock-modal">
  <div style="background:white;border-radius:20px;padding:32px;max-width:500px;width:100%;animation:popIn 0.3s ease both;">
    <h3 style="font-family:'Syne',sans-serif;font-size:18px;font-weight:900;color:#1a1a1a;margin-bottom:16px;">⚠️ Low Stock Items</h3>
    <div id="low-stock-list" style="max-height:400px; overflow-y:auto; margin-bottom:20px;">
      <!-- Low stock items will be injected here -->
    </div>
    <button onclick="closeModal('low-stock-modal')" style="width:100%;padding:12px;background:#f0f0f0;border-radius:8px;font-weight:700;color:#444;">Close</button>
  </div>
</div>

<!-- PAYMENT SUCCESS MODAL -->
<div class="modal-overlay" id="payment-success-modal">
  <div style="background:white;border-radius:24px;padding:40px;max-width:400px;width:100%;text-align:center;animation:popIn 0.3s ease both;">
    <div style="font-size:64px;margin-bottom:16px;">✅</div>
    <h3 style="font-family:'Syne',sans-serif;font-size:24px;font-weight:900;color:#1a1a1a;margin-bottom:8px;">Payment Successful!</h3>
    <p style="color:#666;font-size:14px;line-height:1.6;margin-bottom:24px;">Your order has been confirmed and is being prepared.</p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;margin-bottom:24px;">
      <div style="font-size:12px;color:#166534;margin-bottom:4px;">Order ID</div>
      <div id="success-modal-order-id" style="font-size:18px;font-weight:800;color:#166534;">#1204D1</div>
    </div>
    <div style="display:flex;gap:10px;">
      <button onclick="viewInvoiceFromModal()" style="flex:1;padding:12px;background:#2d6a4f;color:white;border-radius:12px;font-weight:700;">📄 View Invoice</button>
      <button onclick="closeModal('payment-success-modal');nav('success')" style="flex:1;padding:12px;background:#f0f0f0;color:#444;border-radius:12px;font-weight:700;">Track Order</button>
    </div>
  </div>
</div>

<!-- PAYMENT FAILURE MODAL -->
<div class="modal-overlay" id="payment-failure-modal">
  <div style="background:white;border-radius:24px;padding:40px;max-width:400px;width:100%;text-align:center;animation:popIn 0.3s ease both;">
    <div style="font-size:64px;margin-bottom:16px;">❌</div>
    <h3 style="font-family:'Syne',sans-serif;font-size:24px;font-weight:900;color:#1a1a1a;margin-bottom:8px;">Payment Failed</h3>
    <p style="color:#666;font-size:14px;line-height:1.6;margin-bottom:24px;">Oops! Something went wrong with your payment. Please try again.</p>
    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px;margin-bottom:24px;">
      <div style="font-size:12px;color:#991b1b;margin-bottom:4px;">Error</div>
      <div id="failure-modal-reason" style="font-size:14px;font-weight:700;color:#991b1b;">Payment gateway timeout</div>
    </div>
    <div style="display:flex;gap:10px;">
      <button onclick="closeModal('payment-failure-modal');nav('cart')" style="flex:1;padding:12px;background:#f0f0f0;color:#444;border-radius:12px;font-weight:700;">Back to Cart</button>
      <button onclick="closeModal('payment-failure-modal');nav('payment')" style="flex:1;padding:12px;background:#dc2626;color:white;border-radius:12px;font-weight:700;">Retry Payment</button>
    </div>
  </div>
</div>

<div class="toast" id="toast-el"></div>