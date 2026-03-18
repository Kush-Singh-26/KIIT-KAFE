<!-- ═══════════════════════════════════════
     PAGE 5: PAYMENT
═══════════════════════════════════════ -->
<div id="page-payment" class="page">
  <div class="payment-header">
    <button onclick="nav('cart')" style="color:rgba(255,255,255,0.7);font-size:14px;margin-bottom:8px;">← Back to Cart</button>
    <h1>Select payment method</h1>
  </div>

  <div class="payment-body">
    <!-- LEFT: PAYMENT OPTIONS -->
    <div>
      <div class="order-id-bar">Order ID : <span id="payment-order-id">#1204D1</span></div>
      <div class="pay-method-list">
        <div class="pay-opt selected" id="pay-upi" onclick="selectPay('upi')">
          <span class="opt-icon">📱</span> UPI Payment
        </div>
        <div class="upi-sub" id="upi-sub">
          <button class="btn-upi-app" onclick="payWithApp()">
            <span style="font-size:20px;">📱</span> Pay via any UPI App
          </button>
          
          <div style="display:flex;align-items:center;margin:16px 0;gap:12px;">
            <div style="flex:1;height:1px;background:#eee;"></div>
            <div style="font-size:12px;color:#999;font-weight:700;">OR SCAN QR</div>
            <div style="flex:1;height:1px;background:#eee;"></div>
          </div>

          <div class="qr-box" style="margin-top:0;padding:16px;">
            <div class="qr-code" style="margin-bottom:8px;">
              <img id="upi-qr" width="100">
            </div>
            <p style="margin-bottom:0;">Scan with GPay, PhonePe, Paytm etc.</p>
          </div>
          
          <div style="margin-top:16px;" class="manual-upi-group">
            <p style="font-size:12px;font-weight:700;color:#666;margin-bottom:8px;">Manual UPI ID Entry</p>
            <input class="upi-input" type="text" placeholder="yourname@upi or @phonepe" id="upi-id-input">
            <button id="btn-manual-pay" class="btn-pay-manual" disabled onclick="payWithManualUPI()">
              Confirm & Pay Now
            </button>
          </div>
        </div>
        <div class="pay-opt" id="pay-cash" onclick="selectPay('cash')">
          <span class="opt-icon">💵</span> Cash Payment
        </div>
      </div>
    </div>

    <!-- RIGHT: ORDER SUMMARY -->
    <div>
      <div class="order-summary-card">
        <div class="os-title">Order Summary</div>
        <div id="payment-items-list"></div>
        <div class="os-total-row">
          <span>Total</span>
          <span id="payment-total">₹0</span>
        </div>
        <button class="btn-place-order" onclick="placeOrder()">⚡ Confirm &amp; Pay</button>
      </div>
    </div>
  </div>
</div>