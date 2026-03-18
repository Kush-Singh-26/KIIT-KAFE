/* ═══════════════════════════════════════════
   MENU
═══════════════════════════════════════════ */
function renderMenu() {
  // Build categories
  const cs = document.getElementById('cat-scroll');
  if (!cs.innerHTML) {
    CATS.forEach(c => {
      const d = document.createElement('div');
      d.className = 'cat-item' + (c === activeCategory ? ' active' : '');
      d.innerHTML = `<div class="cat-img">${CAT_EMOJI[c]||'🍽'}</div><div class="cat-label">${c}</div>`;
      d.onclick = () => {
        document.querySelectorAll('.cat-item').forEach(x => x.classList.remove('active'));
        d.classList.add('active');
        activeCategory = c;
        renderMenuGrid();
        document.getElementById('menu-section-label').textContent = c === 'All' ? 'Top rated for you' : c;
      };
      cs.appendChild(d);
    });
  }
  renderMenuGrid();
}

function filterMenuItems() {
  renderMenuGrid();
}

function renderMenuGrid() {
  const grid = document.getElementById('items-grid');
  if (MENU.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--muted);">Loading menu...</div>';
    return;
  }

  const q = document.getElementById('menu-search-input')?.value.toLowerCase() || '';
  let filtered = MENU.filter(item => {
    const matchCat = activeCategory === 'All' || item.cat === activeCategory;
    const matchQ = !q || item.name.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const sortVal = document.getElementById('menu-sort')?.value;
  if (sortVal === 'price-low') filtered.sort((a,b) => a.price - b.price);
  if (sortVal === 'price-high') filtered.sort((a,b) => b.price - a.price);

  grid.innerHTML = filtered.map(item => {
    const inCart = cart.find(c => c.id === item.id);
    const imgHtml = item.img
      ? `<img src="${item.img}" alt="${item.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
      : '';

    const isOutOfStock = parseInt(item.stock) <= 0;
    const isPopular = parseInt(item.popularity) > 10; // Mark as popular if ordered more than 10 times

    let qtyControls = '';
    if (isOutOfStock) {
      qtyControls = `<button class="add-btn out-of-stock" disabled>OUT OF STOCK</button>`;
    } else if (inCart) {
      qtyControls = `<div class="menu-qty-pill">
          <button onclick="changeMenuQty(${item.id},-1)">−</button>
          <span class="qty-num">${inCart.qty}</span>
          <button onclick="changeMenuQty(${item.id},1)">+</button>
        </div>`;
    } else {
      qtyControls = `<button class="add-btn" onclick="addToCartById(${item.id})">+</button>`;
    }

    return `<div class="item-card ${isOutOfStock ? 'disabled' : ''}">
      <div class="item-img">
        ${imgHtml}
        <span style="display:${item.img?'none':'flex'};font-size:52px;">${item.emoji}</span>
        ${isPopular ? `<div class="popular-badge">🔥 Popular</div>` : ''}
      </div>
      <div class="item-body">
        <div class="item-name">${item.name}</div>
        <div class="item-sub">${item.sub}</div>
        <div class="item-footer">
          <div class="item-price">₹${item.price}</div>
          ${qtyControls}
        </div>
      </div>
    </div>`;
  }).join('');
  updateCartIndicators();
}

function sortMenuItems(val) {
  renderMenuGrid();
}

function changeMenuQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
  renderMenuGrid();
  updateCartIndicators();
}

