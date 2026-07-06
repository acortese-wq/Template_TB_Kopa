/* NPK WISP TB-KoPa V5.0 – Grobkostenschätzung
   Interaktiver Kostenrechner, erzeugt aus der Excel-Vorlage.
   Alle Preise gemäss Richtpreisliste SCS. Rechnung erfolgt vollständig im Browser. */

const STORAGE_KEY = 'tbkopa_gks_v5';

// ---- Formatierung -----------------------------------------------------------
const chf = (n) => 'CHF ' + Math.round(n).toLocaleString('de-CH');
const chfExact = (n) =>
  'CHF ' + n.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ---- Zustand ----------------------------------------------------------------
const state = {
  qty: {},            // itemId -> Menge
  meta: {},           // Projekt-Metadaten
  reduction: 0,       // Koopa-Synergie in %
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) Object.assign(state, JSON.parse(raw));
  } catch (e) { /* ignore */ }
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
}

// eindeutige ID pro Position
function itemId(section, ci, si, ii) {
  return `${section}-${ci}-${si}-${ii}`;
}

// ---- Rendering der Positionslisten -----------------------------------------
function renderSection(section, groups) {
  const panel = document.getElementById('panel-' + section);
  panel.innerHTML = '';

  groups.forEach((cat, ci) => {
    const catEl = document.createElement('div');
    catEl.className = 'cat';
    catEl.dataset.section = section;
    catEl.dataset.ci = ci;

    catEl.innerHTML = `
      <div class="cat-head">
        <h3>${escapeHtml(cat.title)}</h3>
        <span class="cat-total" data-cat-total>CHF 0</span>
      </div>
      <div class="cat-body">
        <div class="row-head">
          <span>Beschreibung</span><span>Einheit</span>
          <span>Richtpreis</span><span>Menge</span><span>Total</span>
        </div>
      </div>`;

    const body = catEl.querySelector('.cat-body');

    cat.subs.forEach((sub, si) => {
      if (sub.title) {
        const sh = document.createElement('div');
        sh.className = 'subhead';
        sh.textContent = sub.title;
        body.appendChild(sh);
      }
      sub.items.forEach((item, ii) => {
        const id = itemId(section, ci, si, ii);
        const q = state.qty[id] ?? '';
        const row = document.createElement('div');
        row.className = 'item';
        const tag = item.cat ? `<span class="cat-tag">${item.cat}</span>` : '';
        row.innerHTML = `
          <div class="desc">${tag}${escapeHtml(item.desc)}</div>
          <div class="unit">${escapeHtml(item.unit)}</div>
          <div class="price">${item.price.toLocaleString('de-CH')}</div>
          <div class="qty">
            <input type="number" min="0" step="any" inputmode="decimal"
                   placeholder="0" value="${q}"
                   data-id="${id}" data-price="${item.price}" aria-label="Menge ${escapeHtml(item.desc)}" />
          </div>
          <div class="line-total zero" data-line>CHF 0</div>`;
        body.appendChild(row);
      });
    });

    panel.appendChild(catEl);
  });
}

// ---- Bauplatz-Installation --------------------------------------------------
function renderBauplatz() {
  const panel = document.getElementById('panel-bauplatz');
  panel.innerHTML = `
    <div class="info-banner">
      Die Bauplatz-Installation (Auftragspauschale) wird <strong>automatisch</strong> anhand der
      Projektsumme aus Tiefbau- und Montagearbeiten ermittelt. Es wird genau die zutreffende
      Pauschalstufe angewendet.
    </div>
    <div id="tiers"></div>`;
}

function bauplatzTier(projectSum) {
  // Stufen gemäss Excel (07 OAT Bauplatz-Installation)
  if (projectSum < 1500) return 0;
  if (projectSum < 10000) return 1;
  if (projectSum < 50000) return 2;
  return 3;
}

function renderTiers(projectSum) {
  const activeTier = projectSum > 0 ? bauplatzTier(projectSum) : -1;
  const el = document.getElementById('tiers');
  if (!el) return 0;
  el.innerHTML = '';
  let bauplatzTotal = 0;

  PRICE_DATA.bauplatz.forEach((tier, idx) => {
    const sum = tier.rows.reduce((a, r) => a + r.price, 0);
    const isActive = idx === activeTier;
    if (isActive) bauplatzTotal = sum;
    const rowsHtml = tier.rows
      .map((r) => `<span>${escapeHtml(r.type)}: <strong>${chf(r.price)}</strong></span>`)
      .join('');
    const div = document.createElement('div');
    div.className = 'tier' + (isActive ? ' active' : '');
    div.innerHTML = `
      <div class="tier-name">${escapeHtml(tier.title)}</div>
      <div>
        ${isActive ? '<span class="tier-badge">angewendet</span> ' : ''}
        <span class="tier-total">${chf(sum)}</span>
      </div>
      <div class="tier-rows">${rowsHtml}</div>`;
    el.appendChild(div);
  });

  return bauplatzTotal;
}

// ---- Berechnung ------------------------------------------------------------
function recalc() {
  const sectionTotals = { tiefbau: 0, montage: 0 };

  ['tiefbau', 'montage'].forEach((section) => {
    const panel = document.getElementById('panel-' + section);
    panel.querySelectorAll('.cat').forEach((catEl) => {
      let catTotal = 0;
      catEl.querySelectorAll('.item').forEach((row) => {
        const input = row.querySelector('input');
        const price = parseFloat(input.dataset.price) || 0;
        const qty = parseFloat(input.value);
        const valid = !isNaN(qty) && qty > 0;
        const line = valid ? price * qty : 0;
        catTotal += line;

        input.classList.toggle('filled', valid);
        const lt = row.querySelector('[data-line]');
        lt.textContent = chf(line);
        lt.classList.toggle('zero', !valid);
      });
      catEl.querySelector('[data-cat-total]').textContent = chf(catTotal);
      sectionTotals[section] += catTotal;
    });
  });

  const projectSum = sectionTotals.tiefbau + sectionTotals.montage;
  const bauplatzTotal = renderTiers(projectSum);

  const subtotal = projectSum + bauplatzTotal;
  const red = (state.reduction || 0) / 100 * subtotal;
  const grand = subtotal - red;

  document.getElementById('sum-tiefbau').textContent = chf(sectionTotals.tiefbau);
  document.getElementById('sum-montage').textContent = chf(sectionTotals.montage);
  document.getElementById('sum-bauplatz').textContent = chf(bauplatzTotal);

  document.getElementById('sum-reduction').textContent = red > 0 ? '– ' + chf(red) : 'CHF 0';

  document.getElementById('sum-grand').textContent = chf(grand);
}

// ---- Events ----------------------------------------------------------------
function bindEvents() {
  document.querySelectorAll('.panel input[type="number"]').forEach((input) => {
    input.addEventListener('input', () => {
      const v = input.value;
      if (v === '' || parseFloat(v) === 0) delete state.qty[input.dataset.id];
      else state.qty[input.dataset.id] = v;
      saveState();
      recalc();
    });
  });

  // Tabs
  document.getElementById('tabs').addEventListener('click', (e) => {
    const btn = e.target.closest('.tab');
    if (!btn) return;
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
  });

  // Meta
  document.querySelectorAll('[data-meta]').forEach((inp) => {
    inp.value = state.meta[inp.dataset.meta] || '';
    inp.addEventListener('input', () => {
      state.meta[inp.dataset.meta] = inp.value;
      saveState();
    });
  });

  // Reduktion
  const redInput = document.getElementById('reduction-input');
  redInput.value = state.reduction || 0;
  redInput.addEventListener('input', () => {
    let v = parseFloat(redInput.value);
    if (isNaN(v) || v < 0) v = 0;
    if (v > 100) v = 100;
    state.reduction = v;
    saveState();
    recalc();
  });
  // Reduktion immer sichtbar zum Bearbeiten
  document.getElementById('reduction-row').hidden = false;

  document.getElementById('btnPrint').addEventListener('click', () => window.print());

  document.getElementById('btnReset').addEventListener('click', () => {
    if (!confirm('Alle Eingaben und Mengen zurücksetzen?')) return;
    state.qty = {}; state.meta = {}; state.reduction = 0;
    saveState();
    location.reload();
  });
}

// ---- Utils -----------------------------------------------------------------
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

// ---- Init ------------------------------------------------------------------
function init() {
  loadState();
  renderSection('tiefbau', PRICE_DATA.tiefbau);
  renderSection('montage', PRICE_DATA.montage);
  renderBauplatz();
  bindEvents();
  recalc();
}

document.addEventListener('DOMContentLoaded', init);
