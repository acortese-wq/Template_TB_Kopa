/* NPK WISP TB-KoPa V5.0 – Web-Umsetzung der Excel-Vorlage
   Alle 12 Arbeitsblätter als interaktive Ansichten. Berechnung vollständig im Browser. */

const STORAGE_KEY = 'tbkopa_v5_full';

/* ---------- Formatierung ---------- */
const chf = (n) => 'CHF ' + Math.round(n || 0).toLocaleString('de-CH');
const num2 = (n) => (n || 0).toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const round100 = (n) => Math.round(n / 100) * 100;               // Excel ROUND(x,-2)
const ceilTo = (n, step) => (step > 0 ? Math.ceil(n / step) * step : n); // CEILING.MATH
const cbrt = (n) => Math.cbrt(n);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- Zustand ---------- */
const state = {
  meta: {},
  qty: {},              // GKS Tiefbau/Montage Mengen
  reduction: 0,         // Koopa-Synergie %
  grundlage: { tiefbau: 'liste', montage: 'liste' },  // 'liste' = Richtpreisliste, 'devis' = Devis-Tool/Offerte
  devisTotal: { tiefbau: '', montage: '' },           // direkt erfasste Totalbeträge
  gesamtbausumme: '',   // Gesamtprojektvolumen alle Dritte (für Honorar)
  drittIng: '',         // Dritt-Ingenieur CHF
  hon: {                // Honorar-Einstellungen
    eng: { mode: 'manual', hours: '', nTB: 0.8, nKab: 1.0 },
    bl:  { mode: 'manual', hours: '', nTB: 0.8, nKab: 1.0 },
    bhv: { mode: 'manual', hours: '' },
  },
  oatMontage: {},       // pos -> Menge
  oatTuRabatt: 0,       // % TU-Rabatt auf Montage
  oatTiefbau: [],       // [{datum,text,ak,eh,menge,preis}]
  oatEng: [], oatBl: [], oatBhv: [],  // [{text,stunden}]
  oatChanges: [],       // Bestelländerungen
  oatOffer: {},         // Kategorie -> Offertbetrag (manuell)
};

function loadState() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) deepAssign(state, JSON.parse(raw)); } catch (e) {}
}
function deepAssign(t, s) {
  for (const k in s) {
    if (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k]) && typeof t[k] === 'object' && !Array.isArray(t[k])) deepAssign(t[k], s[k]);
    else t[k] = s[k];
  }
}
const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {} };

/* Honorar-Obergrenzen nach Projektgrösse (Baukosten Tiefbau + Montage).
   Anteile gemäss Abschlussblatt E&B: K 30 %, M 25 %, G 20 %.
   Schwellen aus dem Beispielprojekt abgeleitet (Baukosten 32'302 → Mittel). */
const HONORAR_KATEGORIEN = [
  { key: 'K', label: 'Klein', max: 0.30, lo: 0, hi: 10000, range: '< CHF 10’000' },
  { key: 'M', label: 'Mittel', max: 0.25, lo: 10000, hi: 50000, range: 'CHF 10’000 – 50’000' },
  { key: 'G', label: 'Gross', max: 0.20, lo: 50000, hi: Infinity, range: '≥ CHF 50’000' },
];
function honorarKategorie(baukosten) {
  return HONORAR_KATEGORIEN.find((k) => baukosten >= k.lo && baukosten < k.hi) || HONORAR_KATEGORIEN[0];
}
/* Text zum gewählten Schwierigkeitsgrad (SIA) */
function diffLabel(n) {
  const d = HONORAR.difficulty.find((x) => Math.abs(x.val - (n || 0)) < 1e-6);
  return d ? d.label : '—';
}

/* ---------- Kern-Berechnungen (blattübergreifend) ---------- */
function itemId(section, ci, si, ii) { return `${section}-${ci}-${si}-${ii}`; }

function listTotal(section, groups) {
  let total = 0;
  groups.forEach((cat, ci) => cat.subs.forEach((sub, si) => sub.items.forEach((item, ii) => {
    const q = parseFloat(state.qty[itemId(section, ci, si, ii)]);
    if (!isNaN(q) && q > 0) total += item.price * q;
  })));
  return total;
}
/* Effektiver Sektionswert: Richtpreisliste (Positionen) ODER Devis-Tool (Totalbetrag) */
function sectionTotal(section, groups) {
  if (state.grundlage[section] === 'devis') return parseFloat(state.devisTotal[section]) || 0;
  return listTotal(section, groups);
}
function bauplatzTierIndex(sum) {
  if (sum <= 0) return -1;
  if (sum < 1500) return 0;
  if (sum < 10000) return 1;
  if (sum < 50000) return 2;
  return 3;
}
function bauplatzTotalFor(sum) {
  const idx = bauplatzTierIndex(sum);
  if (idx < 0) return 0;
  return PRICE_DATA.bauplatz[idx].rows.reduce((a, r) => a + r.price, 0);
}

/* SIA-103-Honorarmodell (Richtwerte) – siehe Blatt 03 */
function honorarEngineering(tiefbau, montage, gesamt) {
  const { Z1, Z2, r } = HONORAR.sia;
  const s = state.hon.eng;
  const pTB = gesamt > 0 ? Z1 + Z2 / cbrt(gesamt) : 0;
  const pKab = montage > 0 ? Z1 + Z2 / cbrt(montage) : 0;
  const tmTB = tiefbau * pTB / 100 * s.nTB * HONORAR.engineering.qTB * r;
  const tmKab = montage * pKab / 100 * s.nKab * HONORAR.engineering.qKab * r;
  const feeTB = round100(HONORAR.rates.engineering * tmTB);
  const feeKab = round100(HONORAR.rates.engineering * tmKab);
  const auto = ceilTo(feeTB + feeKab, HONORAR.rates.engineering);
  const manual = (parseFloat(s.hours) || 0) * HONORAR.rates.engineering;
  return { auto, manual, hours: tmTB + tmKab, value: s.mode === 'manual' ? manual : auto,
    tb: { base: tiefbau, p: pTB, pBase: gesamt, pBaseLabel: 'Gesamtbausumme koord. Projekt', n: s.nTB, q: HONORAR.engineering.qTB, r, tm: tmTB, fee: feeTB },
    kab: { base: montage, p: pKab, n: s.nKab, q: HONORAR.engineering.qKab, r, tm: tmKab, fee: feeKab } };
}
function honorarBauleitung(tiefbau, montage) {
  const { Z1, Z2, r } = HONORAR.sia;
  const s = state.hon.bl;
  const pTB = tiefbau > 0 ? Z1 + Z2 / cbrt(tiefbau) : 0;
  const pKab = montage > 0 ? Z1 + Z2 / cbrt(montage) : 0;
  const tmTB = tiefbau * pTB / 100 * s.nTB * HONORAR.bauleitung.qTB * r;
  const tmKab = montage * pKab / 100 * s.nKab * HONORAR.bauleitung.qKab * r;
  const feeTB = round100(HONORAR.rates.bauleitung * tmTB);
  const feeKab = round100(HONORAR.rates.bauleitung * tmKab);
  const auto = ceilTo(feeTB + feeKab, HONORAR.rates.bauleitung);
  const manual = (parseFloat(s.hours) || 0) * HONORAR.rates.bauleitung;
  return { auto, manual, value: s.mode === 'manual' ? manual : auto,
    tb: { base: tiefbau, p: pTB, pBase: tiefbau, pBaseLabel: 'Baukosten Tiefbau', n: s.nTB, q: HONORAR.bauleitung.qTB, r, tm: tmTB, fee: feeTB },
    kab: { base: montage, p: pKab, n: s.nKab, q: HONORAR.bauleitung.qKab, r, tm: tmKab, fee: feeKab } };
}
function honorarBHV(zwischentotal) {
  const b = HONORAR.bhv, s = state.hon.bhv;
  const qSum = b.phases.reduce((a, p) => a + p.val, 0);
  const tm = zwischentotal * b.p / 100 * b.n * b.o * b.f * b.r * qSum;
  const auto = ceilTo(round100(HONORAR.rates.bhv * tm), HONORAR.rates.bhv);
  const manual = (parseFloat(s.hours) || 0) * HONORAR.rates.bhv;
  return { auto, manual, hours: tm, value: s.mode === 'manual' ? manual : auto };
}

/* Aggregiertes Projektmodell */
function computeModel() {
  const tiefbau = sectionTotal('tiefbau', PRICE_DATA.tiefbau);
  const montage = sectionTotal('montage', PRICE_DATA.montage);
  const bauplatz = bauplatzTotalFor(tiefbau + montage);
  const gesamt = parseFloat(state.gesamtbausumme) || (tiefbau + montage);
  const drittIng = parseFloat(state.drittIng) || 0;
  const eng = honorarEngineering(tiefbau, montage, gesamt);
  const bl = honorarBauleitung(tiefbau, montage);
  const zwischentotal = tiefbau + montage + bauplatz + eng.value + drittIng + bl.value;
  const bhv = honorarBHV(zwischentotal);
  const engBlBhv = eng.value + bl.value + bhv.value;
  // Honorar-Obergrenze nach Baukosten (Tiefbau + Montage)
  const baukosten = tiefbau + montage;
  const kat = honorarKategorie(baukosten);
  const honorarMax = kat.max * baukosten;
  const honorarUeber = engBlBhv > honorarMax + 0.5;   // Obergrenze überschritten?
  const subtotal = tiefbau + montage + bauplatz + eng.value + drittIng + bl.value + bhv.value;
  const red = (state.reduction || 0) / 100 * subtotal;
  const grand = subtotal - red;
  return { tiefbau, montage, bauplatz, gesamt, drittIng, baukosten,
    engineering: eng.value, bauleitung: bl.value, bhv: bhv.value,
    eng, bl, bhv, engBlBhv, kat, honorarMax, honorarUeber, subtotal, red, grand };
}

/* ---------- Router ---------- */
const VIEWS = {};
let currentView = 'uebersicht';
let navOpts = {};

function navigate(view, opts) {
  if (!VIEWS[view]) view = 'uebersicht';
  currentView = view;
  navOpts = opts || {};
  document.querySelectorAll('.nav-item').forEach((n) => n.classList.toggle('active', n.dataset.view === view));
  const main = document.getElementById('main');
  main.innerHTML = '';
  VIEWS[view](main);
  main.scrollTop = 0; window.scrollTo(0, 0);
  updateHeaderTotal();
  closeSidebar();
  location.hash = view;
}
function updateHeaderTotal() {
  document.getElementById('hdr-total').textContent = chf(computeModel().grand);
}

/* ---------- Wiederverwendbare Bausteine ---------- */
function el(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
function viewHead(title, sub) { return `<div class="view-head"><h2>${esc(title)}</h2>${sub ? `<p class="sub">${esc(sub)}</p>` : ''}</div>`; }

/* Metadaten-Felder */
const META_FIELDS = [
  ['span', 'SPAN Ticket-ID'], ['sid', 'SID Nr.'], ['baustelle', 'Baustellenname'],
  ['kategorie', 'Kategorie'], ['kontaktscs', 'Kontakt Swisscom'], ['kontakttu', 'Kontakt TU'],
];
function metaCard() {
  const inputs = META_FIELDS.map(([k, l]) =>
    `<label>${esc(l)}<input type="text" data-meta="${k}" value="${esc(state.meta[k] || '')}" placeholder="—"></label>`).join('');
  const c = el(`<div class="card"><h3>Projektübersicht</h3><div class="meta-grid">${inputs}</div></div>`);
  c.querySelectorAll('[data-meta]').forEach((inp) => inp.addEventListener('input', () => { state.meta[inp.dataset.meta] = inp.value; save(); }));
  return c;
}

/* ======================================================================
   VIEW 01 – Projektübersicht (Roll-up aller Kategorien)
====================================================================== */
VIEWS.uebersicht = (main) => {
  main.insertAdjacentHTML('beforeend', viewHead('01 · Projektübersicht', 'Grobkostenschätzung Kooperationsprojekt Tiefbau – Zusammenzug aller Positionen'));
  main.appendChild(metaCard());
  const m = computeModel();

  // Reihenfolge gemäss Excel-Template (Blatt 01). Ziel: Ansicht, die beim Klick geöffnet wird.
  const catRows = [
    ['Tiefbauarbeiten', m.tiefbau, 'gks-kosten', { sub: 'tiefbau' }],
    ['Montagearbeiten', m.montage, 'gks-kosten', { sub: 'montage' }],
    ['Installation Bauplatz', m.bauplatz, 'gks-kosten', { sub: 'bauplatz' }],
    ['Engineering', m.engineering, 'gks-honorar', {}],
    ['Dritt-Ingenieur', m.drittIng, 'gks-honorar', {}],
    ['Bauleitung', m.bauleitung, 'gks-honorar', {}],
    ['Bauherrenvertretung', m.bhv, 'gks-honorar', {}],
  ];
  const rows = catRows.map(([l, v, view, opts]) =>
    `<tr class="clickable" data-goto="${view}" data-sub="${opts.sub || ''}"><td>${l} <span class="go-arrow">›</span></td><td class="num">${chf(v)}</td></tr>`).join('');

  const pctBHV = m.engBlBhv > 0 ? (m.bhv / m.engBlBhv * 100) : 0;
  const pctEng = m.engBlBhv > 0 ? (m.engineering / m.engBlBhv * 100) : 0;
  const pctBl = m.engBlBhv > 0 ? (m.bauleitung / m.engBlBhv * 100) : 0;
  const pctVol = m.subtotal > 0 ? (m.engBlBhv / m.subtotal * 100) : 0;

  main.insertAdjacentHTML('beforeend', `
    <div class="split">
      <div class="content">
        <div class="card">
          <h3>Grobkostenschätzung SCS</h3>
          <div class="tbl-wrap">
            <table class="data">
              <thead><tr><th>Kategorie</th><th class="num">Grobkostenschätzung [CHF]</th></tr></thead>
              <tbody>${rows}</tbody>
              <tfoot>
                <tr class="total"><td>Zwischentotal</td><td class="num">${chf(m.subtotal)}</td></tr>
                <tr><td>Koopa-Synergie-Reduktion (${state.reduction || 0}%)</td><td class="num">– ${chf(m.red)}</td></tr>
                <tr class="total"><td>Total Grobkostenschätzung</td><td class="num">${chf(m.grand)}</td></tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div class="card">
          <h3>BHV &amp; Engineering &amp; Bauleitung</h3>
          <p class="card-note">Ohne Dritt-Ingenieur-Leistungen.</p>
          <div class="tbl-wrap"><table class="data">
            <tbody>
              <tr><td>Summe BHV &amp; Engineering &amp; Bauleitung</td><td class="num">${chf(m.engBlBhv)}</td></tr>
              <tr><td>davon Engineering</td><td class="num">${pctEng.toFixed(1)} %</td></tr>
              <tr><td>davon Bauleitung</td><td class="num">${pctBl.toFixed(1)} %</td></tr>
              <tr><td>davon Bauherrenvertretung</td><td class="num">${pctBHV.toFixed(1)} %</td></tr>
              <tr class="total"><td>Anteil am Bestellvolumen (Zwischentotal)</td><td class="num">${pctVol.toFixed(1)} %</td></tr>
            </tbody>
          </table></div>
        </div>
        ${honorarCapCard(m)}
      </div>
      ${summaryAside(m)}
    </div>`);

  main.querySelectorAll('tr.clickable').forEach((tr) => tr.addEventListener('click', () => {
    navigate(tr.dataset.goto, tr.dataset.sub ? { sub: tr.dataset.sub } : {});
  }));
  bindReduction(main);
};

/* Honorar-Obergrenze (Card, wiederverwendbar in Übersicht & Honorar) */
function honorarCapCard(m) {
  const warn = m.honorarUeber;
  const banner = warn
    ? `<div class="info-banner amber" style="margin:12px 0 0;"><strong>Obergrenze überschritten.</strong> Das Honorar (${chf(m.engBlBhv)}) liegt über dem Maximum von ${chf(m.honorarMax)} (${(m.kat.max * 100).toFixed(0)} % der Baukosten). Höhere Kosten müssen begründet werden.</div>`
    : `<div class="info-banner" style="margin:12px 0 0;">Innerhalb der Obergrenze: Honorar ${chf(m.engBlBhv)} von max. ${chf(m.honorarMax)}.</div>`;
  return `<div class="card">
    <h3>Honorar-Obergrenze (BHV / BL / ENG)</h3>
    <p class="card-note">Maximaler Honoraranteil nach Projektgrösse (Baukosten Tiefbau + Montage = ${chf(m.baukosten)}).</p>
    <div class="tbl-wrap"><table class="data">
      <thead><tr><th>Kategorie</th><th>Baukosten-Bereich</th><th class="num">Max. Anteil</th><th class="num">Max. Honorar</th></tr></thead>
      <tbody>${HONORAR_KATEGORIEN.map((k) => `<tr class="${k.key === m.kat.key ? 'total' : ''}"><td>${k.label} (${k.key})${k.key === m.kat.key ? ' ✓' : ''}</td><td>${k.range}</td><td class="num">${(k.max * 100).toFixed(0)} %</td><td class="num">${chf(k.max * m.baukosten)}</td></tr>`).join('')}</tbody>
    </table></div>
    ${banner}
  </div>`;
}

function summaryAside(m) {
  return `<aside class="summary"><div class="summary-card">
    <h3>Zusammenfassung</h3>
    <ul class="sum-list">
      <li><span>Tiefbauarbeiten</span><b>${chf(m.tiefbau)}</b></li>
      <li><span>Montagearbeiten</span><b>${chf(m.montage)}</b></li>
      <li><span>Bauplatz-Installation</span><b>${chf(m.bauplatz)}</b></li>
      <li class="muted"><span>Engineering</span><b>${chf(m.engineering)}</b></li>
      <li class="muted"><span>Bauleitung</span><b>${chf(m.bauleitung)}</b></li>
      <li class="muted"><span>Bauherrenvertretung</span><b>${chf(m.bhv)}</b></li>
      <li class="reduction-row"><span>Koopa-Synergie <input type="number" id="reduction-input" min="0" max="100" step="1" value="${state.reduction || 0}"> %</span><b>${m.red > 0 ? '– ' + chf(m.red) : 'CHF 0'}</b></li>
    </ul>
    <div class="grand"><span>Total GKS</span><b>${chf(m.grand)}</b></div>
    <p class="note">Richtpreise gemäss Richtpreisliste SCS, in CHF, ohne MwSt. Bauplatz-Installation und Honorare werden automatisch aus den erfassten Mengen berechnet.</p>
  </div></aside>`;
}
function bindReduction(main) {
  const ri = main.querySelector('#reduction-input');
  if (!ri) return;
  ri.addEventListener('input', () => {
    let v = parseFloat(ri.value); if (isNaN(v) || v < 0) v = 0; if (v > 100) v = 100;
    state.reduction = v; save(); navigate(currentView);
  });
}

/* ======================================================================
   VIEW 02 – GKS Tiefbau / Montage / Bauplatz
====================================================================== */
VIEWS['gks-kosten'] = (main) => {
  main.insertAdjacentHTML('beforeend', viewHead('02 · Tiefbau · Montage · Bauplatz', 'Grobkostenschätzung nach Positionen (Richtpreisliste) oder als Totalbetrag (Devis-Tool / Offerte)'));
  const m = computeModel();
  const active = ['tiefbau', 'montage', 'bauplatz'].includes(navOpts.sub) ? navOpts.sub : 'tiefbau';
  main.insertAdjacentHTML('beforeend', `
    <div class="split"><div class="content">
      <div class="tabs">
        <button class="tab ${active === 'tiefbau' ? 'active' : ''}" data-sub="tiefbau">Tiefbauarbeiten</button>
        <button class="tab ${active === 'montage' ? 'active' : ''}" data-sub="montage">Montagearbeiten</button>
        <button class="tab ${active === 'bauplatz' ? 'active' : ''}" data-sub="bauplatz">Bauplatz-Installation</button>
      </div>
      <div class="subpanel ${active === 'tiefbau' ? 'active' : ''}" id="sp-tiefbau"></div>
      <div class="subpanel ${active === 'montage' ? 'active' : ''}" id="sp-montage"></div>
      <div class="subpanel ${active === 'bauplatz' ? 'active' : ''}" id="sp-bauplatz"></div>
    </div>${summaryAside(m)}</div>`);

  renderCostSection(main.querySelector('#sp-tiefbau'), 'tiefbau', PRICE_DATA.tiefbau, 'Tiefbauarbeiten');
  renderCostSection(main.querySelector('#sp-montage'), 'montage', PRICE_DATA.montage, 'Montagearbeiten');
  renderBauplatz(main.querySelector('#sp-bauplatz'), m.tiefbau + m.montage);

  main.querySelector('.tabs').addEventListener('click', (e) => {
    const b = e.target.closest('.tab'); if (!b) return;
    main.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
    main.querySelectorAll('.subpanel').forEach((p) => p.classList.remove('active'));
    b.classList.add('active');
    main.querySelector('#sp-' + b.dataset.sub).classList.add('active');
  });
  bindReduction(main);
};

/* Sektion mit Wahl der Grundlage: Richtpreisliste (Positionen) oder Devis-Tool (Totalbetrag) */
function renderCostSection(root, section, groups, label) {
  const devis = state.grundlage[section] === 'devis';
  const bar = el(`<div class="card" style="padding:14px 18px;margin-bottom:16px;">
    <div class="mode-toggle">
      <button data-g="liste" class="${!devis ? 'active' : ''}">Richtpreisliste (Positionen)</button>
      <button data-g="devis" class="${devis ? 'active' : ''}">Devis-Tool / Offerte (Totalbetrag)</button>
    </div>
    <div data-devis-input style="${devis ? '' : 'display:none'};margin-top:12px;">
      <label class="field" style="max-width:320px;">${esc(label)} – Totalbetrag [CHF]
        <input type="number" min="0" step="any" id="devis-${section}" value="${esc(state.devisTotal[section])}" placeholder="z. B. 25000">
      </label>
      <p class="card-note" style="margin-top:8px;">Direkt erfasster Offert-/Devis-Betrag. Überschreibt die Positionsberechnung und fliesst in Totale, Bauplatz-Installation und Honorar-Obergrenze ein.</p>
    </div>
  </div>`);
  root.appendChild(bar);
  const listWrap = el('<div data-list style="' + (devis ? 'display:none' : '') + '"></div>');
  root.appendChild(listWrap);
  renderPriceList(listWrap, section, groups);

  bar.querySelectorAll('.mode-toggle button').forEach((b) => b.addEventListener('click', () => {
    state.grundlage[section] = b.dataset.g; save(); navigate('gks-kosten', { sub: section });
  }));
  const di = bar.querySelector('#devis-' + section);
  if (di) di.addEventListener('input', () => {
    state.devisTotal[section] = di.value; save();
    updateHeaderTotal(); refreshSummaryCard();
    const bp = document.querySelector('#sp-bauplatz'); if (bp) { const mm = computeModel(); renderBauplatz(bp, mm.tiefbau + mm.montage); }
  });
}

function renderPriceList(root, section, groups) {
  groups.forEach((cat, ci) => {
    const catEl = el(`<div class="cat">
      <div class="cat-head"><h3>${esc(cat.title)}</h3><span class="cat-total" data-cat-total>CHF 0</span></div>
      <div class="cat-body"><div class="row-head"><span>Beschreibung</span><span>Einheit</span><span>Richtpreis</span><span>Menge</span><span>Total</span></div></div>
    </div>`);
    const body = catEl.querySelector('.cat-body');
    cat.subs.forEach((sub, si) => {
      if (sub.title) body.appendChild(el(`<div class="subhead">${esc(sub.title)}</div>`));
      sub.items.forEach((item, ii) => {
        const id = itemId(section, ci, si, ii);
        const q = state.qty[id] ?? '';
        const tag = item.cat ? `<span class="cat-tag">${item.cat}</span>` : '';
        const row = el(`<div class="item">
          <div class="desc">${tag}${esc(item.desc)}</div>
          <div class="unit">${esc(item.unit)}</div>
          <div class="price">${item.price.toLocaleString('de-CH')}</div>
          <div class="qty"><input type="number" min="0" step="any" inputmode="decimal" placeholder="0" value="${q}" data-id="${id}" data-price="${item.price}"></div>
          <div class="line-total zero" data-line>CHF 0</div>
        </div>`);
        row.querySelector('input').addEventListener('input', onQtyInput);
        body.appendChild(row);
      });
    });
    root.appendChild(catEl);
  });
  recalcPriceLists();
}
function onQtyInput(e) {
  const inp = e.target;
  const v = inp.value;
  if (v === '' || parseFloat(v) === 0) delete state.qty[inp.dataset.id];
  else state.qty[inp.dataset.id] = v;
  save(); recalcPriceLists(); updateHeaderTotal();
  refreshSummaryCard();
}
function recalcPriceLists() {
  document.querySelectorAll('#sp-tiefbau .cat, #sp-montage .cat').forEach((catEl) => {
    let ct = 0;
    catEl.querySelectorAll('.item').forEach((row) => {
      const inp = row.querySelector('input');
      const price = parseFloat(inp.dataset.price) || 0;
      const q = parseFloat(inp.value); const valid = !isNaN(q) && q > 0;
      const line = valid ? price * q : 0; ct += line;
      inp.classList.toggle('filled', valid);
      const lt = row.querySelector('[data-line]'); lt.textContent = chf(line); lt.classList.toggle('zero', !valid);
    });
    catEl.querySelector('[data-cat-total]').textContent = chf(ct);
  });
  const bp = document.querySelector('#sp-bauplatz');
  if (bp) { const m = computeModel(); renderBauplatz(bp, m.tiefbau + m.montage); }
}
function refreshSummaryCard() {
  // Zusammenfassungskarte neu rendern (falls sichtbar)
  const aside = document.querySelector('.summary');
  if (aside) { const m = computeModel(); aside.outerHTML = summaryAside(m); bindReduction(document.getElementById('main')); }
}

function renderBauplatz(root, projectSum) {
  const idx = bauplatzTierIndex(projectSum);
  root.innerHTML = `<div class="info-banner">Die Bauplatz-Installation (Auftragspauschale) wird <strong>automatisch</strong> anhand der Projektsumme aus Tiefbau- und Montagearbeiten (${chf(projectSum)}) ermittelt.</div>`;
  PRICE_DATA.bauplatz.forEach((tier, i) => {
    const sum = tier.rows.reduce((a, r) => a + r.price, 0);
    const active = i === idx;
    const rows = tier.rows.map((r) => `<span>${esc(r.type)}: <strong>${chf(r.price)}</strong></span>`).join('');
    root.appendChild(el(`<div class="tier${active ? ' active' : ''}">
      <div class="tier-name">${esc(tier.title)}</div>
      <div>${active ? '<span class="tier-badge">angewendet</span> ' : ''}<span class="tier-total">${chf(sum)}</span></div>
      <div class="tier-rows">${rows}</div>
    </div>`));
  });
}

/* ======================================================================
   VIEW 03 – Honorar Engineering / Bauleitung / BHV
====================================================================== */
VIEWS['gks-honorar'] = (main) => {
  main.insertAdjacentHTML('beforeend', viewHead('03 · Engineering · Bauleitung · Bauherrenvertretung', 'Honorarberechnung nach SIA-103-Modell (Richtwert) oder manuell (Stunden × Ansatz)'));
  const m = computeModel();

  // Grundlagen inkl. Total Tiefbaukosten, die das Honorar treiben
  main.insertAdjacentHTML('beforeend', `<div class="card">
    <h3>Grundlagen der Honorarberechnung</h3>
    <div class="tbl-wrap"><table class="data"><tbody>
      <tr class="clickable" data-goto="gks-kosten" data-sub="tiefbau"><td>Total Tiefbaukosten ${state.grundlage.tiefbau === 'devis' ? '(Devis-Tool)' : '(Positionen)'} <span class="go-arrow">›</span></td><td class="num">${chf(m.tiefbau)}</td></tr>
      <tr class="clickable" data-goto="gks-kosten" data-sub="montage"><td>Total Montagekosten ${state.grundlage.montage === 'devis' ? '(Devis-Tool)' : '(Positionen)'} <span class="go-arrow">›</span></td><td class="num">${chf(m.montage)}</td></tr>
      <tr class="total"><td>Baukosten (Basis Honorar-Obergrenze)</td><td class="num">${chf(m.baukosten)}</td></tr>
    </tbody></table></div>
    <p class="card-note">Die Total-Tiefbau- und -Montagekosten treiben die automatisierte Honorarberechnung sowie die Obergrenze (Kategorie <strong>${m.kat.label}</strong>, max. ${(m.kat.max * 100).toFixed(0)} %).</p>
  </div>`);

  main.insertAdjacentHTML('beforeend', honorarCapCard(m));
  main.insertAdjacentHTML('beforeend', `<div class="info-banner amber">Das automatisierte Modell liefert <strong>Richtwerte</strong> nach SIA 103. Für verbindliche Angaben die manuelle Berechnung verwenden.</div>`);

  main.appendChild(honBlock('eng', 'Honorar Engineering', HONORAR.rates.engineering, m.eng, true));
  main.appendChild(honBlock('bl', 'Honorar Bauleitung', HONORAR.rates.bauleitung, m.bl, true));
  main.appendChild(honBlock('bhv', 'Honorar Bauherrenvertretung', HONORAR.rates.bhv, m.bhv, false));

  // Dritt-Ingenieur + Gesamtbausumme
  main.appendChild((() => {
    const c = el(`<div class="card"><h3>Weitere Angaben</h3><div class="meta-grid">
      <label>Gesamtbausumme koord. Projekt (alle Dritten)<input type="number" id="in-gesamt" placeholder="${chf(m.gesamt)}" value="${esc(state.gesamtbausumme)}"></label>
      <label>Dritt-Ingenieur-Leistungen [CHF]<input type="number" id="in-dritt" placeholder="0" value="${esc(state.drittIng)}"></label>
    </div><p class="card-note">Die Gesamtbausumme fliesst in den SIA-Grundfaktor der Engineering-Berechnung ein (Standard: Tiefbau + Montage).</p></div>`);
    c.querySelector('#in-gesamt').addEventListener('input', (e) => { state.gesamtbausumme = e.target.value; save(); navigate(currentView); });
    c.querySelector('#in-dritt').addEventListener('input', (e) => { state.drittIng = e.target.value; save(); navigate(currentView); });
    return c;
  })());

  main.querySelectorAll('tr.clickable').forEach((tr) => tr.addEventListener('click', () => {
    navigate(tr.dataset.goto, tr.dataset.sub ? { sub: tr.dataset.sub } : {});
  }));
};

function honBlock(key, title, rate, calc, hasDifficulty) {
  const s = state.hon[key];
  const autoActive = s.mode === 'auto';
  const diffOptions = (sel) => HONORAR.difficulty.map((d) => `<option value="${d.val}" ${d.val === sel ? 'selected' : ''}>${esc(d.label)}</option>`).join('');

  const tb = calc.tb || {}, kab = calc.kab || {};
  const autoPanel = hasDifficulty ? `
    <p class="card-note" style="margin-top:0;">Automatisiertes Modell nach <strong>SIA 103</strong>: Das <strong>Tiefbau-Honorar</strong> wird aus den <strong>Baukosten</strong> und dem <strong>Schwierigkeitsgrad</strong> hergeleitet.<br>
      Formel: Honorar&nbsp;=&nbsp;Baukosten × (p / 100) × n × q × r × Stundenansatz, mit p&nbsp;=&nbsp;Z1&nbsp;+&nbsp;Z2 / ∛Baukosten (Z1&nbsp;=&nbsp;${HONORAR.sia.Z1}, Z2&nbsp;=&nbsp;${HONORAR.sia.Z2}).</p>
    <div class="hon-grid">
      <label class="field">Schwierigkeitsgrad Tiefbau<select data-hon="${key}" data-f="nTB">${diffOptions(s.nTB)}</select></label>
      <label class="field">Schwierigkeitsgrad Kabel<select data-hon="${key}" data-f="nKab">${diffOptions(s.nKab)}</select></label>
    </div>
    <div class="sia-title">Herleitung Tiefbau-Honorar (nach Baukosten / Schwierigkeitsgrad)</div>
    <div class="tbl-wrap"><table class="data"><tbody>
      <tr><td>Baukosten Tiefbau (Grundlage Zeitaufwand)</td><td class="num">${chf(tb.base || 0)}</td></tr>
      <tr><td>Grundfaktor p = Z1 + Z2 / ∛(${esc(tb.pBaseLabel || 'Baukosten')} ${chf(tb.pBase || 0)})</td><td class="num">${tb.p ? tb.p.toFixed(4) : '– (keine Baukosten)'}</td></tr>
      <tr><td>Schwierigkeitsgrad n (Tiefbau)</td><td class="num">${(tb.n || 0).toFixed(1)} · ${esc(diffLabel(tb.n))}</td></tr>
      <tr><td>Leistungsanteil q (Tiefbau)</td><td class="num">${((tb.q || 0) * 100).toFixed(0)} %</td></tr>
      <tr><td>Anpassungsfaktor r</td><td class="num">${tb.r || 1}</td></tr>
      <tr><td>Zeitaufwand Tm = Baukosten × p/100 × n × q × r</td><td class="num">${(tb.tm || 0).toFixed(1)} h</td></tr>
      <tr class="total"><td>Honorar Tiefbau (Tm × CHF ${rate}/h)</td><td class="num">${chf(tb.fee || 0)}</td></tr>
    </tbody></table></div>
    <div class="sia-title">Kabel / Montage (unverändert)</div>
    <div class="tbl-wrap"><table class="data"><tbody>
      <tr><td>Baukosten Kabel/Montage</td><td class="num">${chf(kab.base || 0)}</td></tr>
      <tr><td>Schwierigkeitsgrad n · Leistungsanteil q</td><td class="num">${(kab.n || 0).toFixed(1)} · ${((kab.q || 0) * 100).toFixed(0)} %</td></tr>
      <tr class="total"><td>Honorar Kabel/Montage</td><td class="num">${chf(kab.fee || 0)}</td></tr>
    </tbody></table></div>` : `<p class="card-note">Kennwerte gemäss SIA 103: p=${HONORAR.bhv.p}, n=${HONORAR.bhv.n}, o=${HONORAR.bhv.o}, f=${HONORAR.bhv.f}.</p>`;

  const block = el(`<div class="hon-block">
    <div class="hon-head"><h3>${esc(title)}</h3><span class="hon-val">${chf(calc.value)}</span></div>
    <div class="hon-body">
      <div class="mode-toggle">
        <button data-mode="auto" class="${autoActive ? 'active' : ''}">Automatisiert (SIA)</button>
        <button data-mode="manual" class="${!autoActive ? 'active' : ''}">Manuell</button>
      </div>
      <div class="mode-panel ${autoActive ? 'active' : ''}" data-panel="auto">
        ${autoPanel}
        <div class="hon-result"><span>Richtwert (Ansatz CHF ${rate}/h)</span><b>${chf(calc.auto)}</b></div>
      </div>
      <div class="mode-panel ${!autoActive ? 'active' : ''}" data-panel="manual">
        <div class="hon-grid">
          <label class="field">Anzahl Regiestunden<input type="number" min="0" step="any" data-hon="${key}" data-f="hours" value="${esc(s.hours)}" placeholder="0"></label>
          <label class="field">Stundensatz<input type="number" value="${rate}" disabled></label>
        </div>
        <div class="hon-result"><span>Manuell (${s.hours || 0} h × CHF ${rate})</span><b>${chf(calc.manual)}</b></div>
      </div>
    </div>
  </div>`);

  block.querySelectorAll('.mode-toggle button').forEach((b) => b.addEventListener('click', () => {
    state.hon[key].mode = b.dataset.mode; save(); navigate(currentView);
  }));
  block.querySelectorAll('[data-hon]').forEach((inp) => inp.addEventListener('input', () => {
    const f = inp.dataset.f;
    state.hon[key][f] = (f === 'hours') ? inp.value : parseFloat(inp.value);
    save(); navigate(currentView);
  }));
  return block;
}

/* ======================================================================
   VIEW 04 – OAT Projektübersicht
====================================================================== */
VIEWS['oat-uebersicht'] = (main) => {
  main.insertAdjacentHTML('beforeend', viewHead('04 · OAT Projektübersicht', 'Offerte & Abrechnung – Gegenüberstellung Grobkostenschätzung / Offerte'));
  const m = computeModel();
  const cats = [
    ['Tiefbauarbeiten', m.tiefbau], ['Montagearbeiten', m.montage], ['Installation Bauplatz', m.bauplatz],
    ['Engineering', m.engineering], ['Dritt-Ingenieur', m.drittIng], ['Bauleitung', m.bauleitung], ['Bauherrenvertretung', m.bhv],
  ];
  let gksSum = 0, offSum = 0;
  const rows = cats.map(([label, gks]) => {
    gksSum += gks;
    const off = parseFloat(state.oatOffer[label]) || 0; offSum += off;
    return `<tr><td>${label}</td><td class="num">${chf(gks)}</td>
      <td class="num"><input type="number" class="num" data-offer="${esc(label)}" value="${state.oatOffer[label] || ''}" placeholder="0"></td></tr>`;
  }).join('');
  const handling = offSum * HONORAR.rabatte.handlingFee;

  const card = el(`<div class="card">
    <h3>Kategorienübersicht</h3>
    <div class="tbl-wrap"><table class="data">
      <thead><tr><th>Kategorie</th><th class="num">Grobkostenschätzung</th><th class="num">Offerte / Bestellung</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr class="total"><td>Total</td><td class="num">${chf(gksSum)}</td><td class="num" id="oat-off-total">${chf(offSum)}</td></tr>
        <tr><td>3rd-Party-Handling-Fee (${(HONORAR.rabatte.handlingFee * 100).toFixed(0)}%)</td><td class="num">—</td><td class="num" id="oat-fee">${chf(handling)}</td></tr>
        <tr class="total"><td>Auftragsvolumen SCS Tiefbau-Kooperationsprojekt</td><td class="num">—</td><td class="num" id="oat-vol">${chf(offSum + handling)}</td></tr>
      </tfoot>
    </table></div>
  </div>`);
  card.querySelectorAll('[data-offer]').forEach((inp) => inp.addEventListener('input', () => {
    state.oatOffer[inp.dataset.offer] = inp.value; save(); navigate(currentView);
  }));
  main.appendChild(card);

  main.insertAdjacentHTML('beforeend', `<div class="card"><h3>Rabattstufen (Referenz)</h3><div class="tbl-wrap"><table class="data">
    <thead><tr><th>Projektsumme</th><th class="num">TU-Rabatt (ohne SCS-Material)</th><th class="num">TU-Rabatt (nur h-Positionen)</th></tr></thead>
    <tbody>
      <tr><td>&lt; 2 kCHF</td><td class="num">0 %</td><td class="num">0 %</td></tr>
      <tr><td>2 – 9.99 kCHF</td><td class="num">0 %</td><td class="num">0 %</td></tr>
      <tr><td>10 – 49.99 kCHF</td><td class="num">0 %</td><td class="num">0 %</td></tr>
      <tr class="total"><td>≥ 50 kCHF</td><td class="num">18.8 %</td><td class="num">2 %</td></tr>
    </tbody></table></div></div>`);
};

/* ======================================================================
   VIEW 05 – OAT Montage NPK EPG (Katalog)
====================================================================== */
VIEWS['oat-montage'] = (main) => {
  main.insertAdjacentHTML('beforeend', viewHead('05 · Montage NPK EPG', `Offert-Katalog mit ${EXTRA_DATA.montageNPK.length} NPK-Positionen – Menge erfassen`));
  const wrap = el(`<div>
    <div class="toolbar">
      <input type="search" id="mSearch" placeholder="Suche nach Position oder Kurztext…">
      <select id="mAk"><option value="">Alle Leistungsarten</option>${['CU','GF','AB','KK','tbd'].map((a) => `<option>${a}</option>`).join('')}</select>
      <label class="field" style="flex-direction:row;align-items:center;gap:6px;text-transform:none;">TU-Rabatt <input type="number" id="mRab" style="width:70px;padding:6px 8px;border:1px solid var(--line);border-radius:6px;" min="0" max="100" value="${state.oatTuRabatt || 0}"> %</label>
      <span class="spacer"></span>
      <span class="count" id="mCount"></span>
      <button class="btn sm" id="mOnly">Nur erfasste</button>
    </div>
    <div class="tbl-wrap"><table class="data">
      <thead><tr><th>Position</th><th>AK</th><th class="wrap">Kurztext</th><th>Einheit</th><th class="num">Preis</th><th class="num">Menge</th><th class="num">Total</th></tr></thead>
      <tbody id="mBody"></tbody>
      <tfoot><tr class="total"><td colspan="6">Total Montage (nach TU-Rabatt)</td><td class="num" id="mTotal">CHF 0</td></tr></tfoot>
    </table></div>
  </div>`);
  main.appendChild(wrap);

  let onlyFilled = false;
  const body = wrap.querySelector('#mBody');
  const rab = () => (parseFloat(state.oatTuRabatt) || 0) / 100;

  function render() {
    const q = wrap.querySelector('#mSearch').value.trim().toLowerCase();
    const ak = wrap.querySelector('#mAk').value;
    const r = rab();
    let shown = 0, total = 0;
    const frag = document.createDocumentFragment();
    EXTRA_DATA.montageNPK.forEach((p) => {
      const menge = parseFloat(state.oatMontage[p.pos]) || 0;
      const line = p.pr * (1 - r) * menge; total += line;
      if (onlyFilled && menge <= 0) return;
      if (ak && p.ak !== ak) return;
      if (q && !(p.pos.toLowerCase().includes(q) || p.txt.toLowerCase().includes(q))) return;
      shown++;
      if (shown > 400) return; // Performance-Limit der sichtbaren Zeilen
      const tr = el(`<tr>
        <td>${esc(p.pos)}</td><td><span class="pill ${p.ak}">${esc(p.ak)}</span></td>
        <td class="wrap">${esc(p.txt)}</td><td>${esc(p.eh)}</td>
        <td class="num">${num2(p.pr * (1 - r))}</td>
        <td class="num"><input type="number" min="0" step="any" data-pos="${esc(p.pos)}" value="${state.oatMontage[p.pos] || ''}" placeholder="0"></td>
        <td class="num">${line > 0 ? chf(line) : '—'}</td>
      </tr>`);
      tr.querySelector('input').addEventListener('input', (e) => {
        const v = e.target.value;
        if (v === '' || parseFloat(v) === 0) delete state.oatMontage[p.pos]; else state.oatMontage[p.pos] = v;
        save();
        // nur Zeile + Totale aktualisieren
        const nl = p.pr * (1 - rab()) * (parseFloat(v) || 0);
        e.target.closest('tr').lastElementChild.textContent = nl > 0 ? chf(nl) : '—';
        updTotal();
      });
      frag.appendChild(tr);
    });
    body.innerHTML = ''; body.appendChild(frag);
    wrap.querySelector('#mCount').textContent = `${shown}${shown > 400 ? '+ (gefiltert)' : ''} Positionen`;
    updTotal();
  }
  function updTotal() {
    const r = rab();
    let total = 0;
    EXTRA_DATA.montageNPK.forEach((p) => { total += p.pr * (1 - r) * (parseFloat(state.oatMontage[p.pos]) || 0); });
    wrap.querySelector('#mTotal').textContent = chf(total);
  }
  wrap.querySelector('#mSearch').addEventListener('input', render);
  wrap.querySelector('#mAk').addEventListener('change', render);
  wrap.querySelector('#mRab').addEventListener('input', (e) => { let v = parseFloat(e.target.value); if (isNaN(v) || v < 0) v = 0; if (v > 100) v = 100; state.oatTuRabatt = v; save(); render(); });
  wrap.querySelector('#mOnly').addEventListener('click', (e) => { onlyFilled = !onlyFilled; e.target.classList.toggle('active'); e.target.textContent = onlyFilled ? 'Alle zeigen' : 'Nur erfasste'; render(); });
  render();
};

/* ======================================================================
   VIEW 06 – OAT Tiefbau & Spezial-Aufgaben (editierbare Zeilen)
====================================================================== */
VIEWS['oat-tiefbau'] = (main) => {
  main.insertAdjacentHTML('beforeend', viewHead('06 · Tiefbau & Spezial-Aufgaben', 'Tiefbau-Koopa-Offerten gemäss separater Offerte des Koopa-TB-Partners'));
  renderEditableTable(main, {
    store: state.oatTiefbau,
    columns: [
      ['datum', 'Datum', 'date', ''], ['text', 'Kurztext', 'text', 'wrap'], ['ak', 'AK', 'select-ak', ''],
      ['eh', 'Einheit', 'text', ''], ['menge', 'Menge', 'number', 'num'], ['preis', 'Preis', 'number', 'num'],
    ],
    totalLabel: 'Total TB Dritte',
    lineTotal: (r) => (parseFloat(r.menge) || 0) * (parseFloat(r.preis) || 0),
    newRow: () => ({ datum: '', text: '', ak: 'KK', eh: 'Stk', menge: '', preis: '' }),
  });
};

/* ======================================================================
   VIEW 07 – OAT Bauplatz-Installation
====================================================================== */
VIEWS['oat-bauplatz'] = (main) => {
  main.insertAdjacentHTML('beforeend', viewHead('07 · Bauplatz-Installation', 'Automatisierte Auftragspauschale nach Projektsumme'));
  // Basis: OAT-Offertsummen falls vorhanden, sonst GKS
  const m = computeModel();
  const tb = parseFloat(state.oatOffer['Tiefbauarbeiten']) || m.tiefbau;
  const mo = parseFloat(state.oatOffer['Montagearbeiten']) || m.montage;
  const box = el('<div></div>');
  main.appendChild(box);
  renderBauplatz(box, tb + mo);
  main.insertAdjacentHTML('beforeend', `<div class="card"><h3>Grundlage</h3><div class="tbl-wrap"><table class="data"><tbody>
    <tr><td>Tiefbauarbeiten (Offerte/GKS)</td><td class="num">${chf(tb)}</td></tr>
    <tr><td>Montagearbeiten (Offerte/GKS)</td><td class="num">${chf(mo)}</td></tr>
    <tr class="total"><td>Projektsumme</td><td class="num">${chf(tb + mo)}</td></tr>
    <tr class="total"><td>Bauplatz-Installation (Total)</td><td class="num">${chf(bauplatzTotalFor(tb + mo))}</td></tr>
  </tbody></table></div></div>`);
};

/* ======================================================================
   VIEW 08 – OAT BHV & Engineering (Positionen)
====================================================================== */
VIEWS['oat-bhveng'] = (main) => {
  main.insertAdjacentHTML('beforeend', viewHead('08 · BHV & Engineering', 'Erfassung der Aufwände für Engineering, Bauleitung und Bauherrenvertretung nach Positionen'));
  const groups = [
    ['oatEng', 'Engineering', HONORAR.rates.engineering],
    ['oatBl', 'Bauleitung', HONORAR.rates.bauleitung],
    ['oatBhv', 'Bauherrenvertretung', HONORAR.rates.bhv],
  ];
  groups.forEach(([storeKey, label, rate]) => {
    main.insertAdjacentHTML('beforeend', `<h3 style="margin:18px 0 10px;font-size:16px;">${label} · CHF ${rate}/h</h3>`);
    renderEditableTable(main, {
      store: state[storeKey],
      columns: [['text', 'Kurztext', 'text', 'wrap'], ['stunden', 'Stunden', 'number', 'num']],
      totalLabel: `Total ${label}`,
      lineTotal: (r) => (parseFloat(r.stunden) || 0) * rate,
      newRow: () => ({ text: '', stunden: '' }),
      extraCol: { header: 'CHF/h', value: () => rate },
    });
  });
};

/* ======================================================================
   VIEW 09 – OAT Bestelländerung
====================================================================== */
VIEWS['oat-aenderung'] = (main) => {
  main.insertAdjacentHTML('beforeend', viewHead('09 · Bestelländerung', 'Volumenänderungen (Ausmass) – Erfassung der Bestelländerungen'));
  renderEditableTable(main, {
    store: state.oatChanges,
    columns: [
      ['datum', 'Datum', 'date', ''], ['position', 'Leistungsposition', 'text', 'wrap'],
      ['grund', 'Begründung', 'text', 'wrap'], ['impact', 'Impact CHF (vor Rabatt)', 'number', 'num'],
      ['flex', 'Flexibilität +/- % TU', 'text', ''], ['bhv', 'Name BHV TU', 'text', ''],
    ],
    totalLabel: 'Total Impact',
    lineTotal: (r) => parseFloat(r.impact) || 0,
    newRow: () => ({ datum: '', position: '', grund: '', impact: '', flex: '', bhv: '' }),
    sumCol: 'impact',
  });
};

/* Generischer editierbarer Tabellen-Renderer */
function renderEditableTable(main, cfg) {
  const AK = ['KK', 'CU', 'GF', 'AB', 'tbd'];
  const card = el('<div class="card"></div>');
  const wrap = el('<div class="tbl-wrap"></div>');
  const table = el('<table class="data"></table>');
  const thead = el('<thead></thead>');
  const htr = el('<tr></tr>');
  cfg.columns.forEach(([, label, , cls]) => htr.appendChild(el(`<th class="${cls === 'num' ? 'num' : ''}">${esc(label)}</th>`)));
  if (cfg.extraCol) htr.appendChild(el(`<th class="num">${esc(cfg.extraCol.header)}</th>`));
  htr.appendChild(el('<th class="num">Total</th>'));
  htr.appendChild(el('<th></th>'));
  thead.appendChild(htr); table.appendChild(thead);
  const tbody = el('<tbody></tbody>'); table.appendChild(tbody);
  const tfoot = el(`<tfoot><tr class="total"><td colspan="${cfg.columns.length + (cfg.extraCol ? 1 : 0)}">${esc(cfg.totalLabel)}</td><td class="num" data-total>CHF 0</td><td></td></tr></tfoot>`);
  table.appendChild(tfoot);
  wrap.appendChild(table); card.appendChild(wrap);
  card.appendChild(el(`<div class="btn-row"><button class="btn sm" data-add>+ Zeile hinzufügen</button></div>`));
  main.appendChild(card);

  function renderRows() {
    tbody.innerHTML = '';
    cfg.store.forEach((row, idx) => {
      const tr = el('<tr></tr>');
      cfg.columns.forEach(([key, , type, cls]) => {
        const td = el(`<td class="${cls || ''}"></td>`);
        let inp;
        if (type === 'select-ak') { inp = el(`<select>${AK.map((a) => `<option ${row[key] === a ? 'selected' : ''}>${a}</option>`).join('')}</select>`); }
        else { inp = el(`<input type="${type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'}" class="${cls === 'num' ? 'num' : ''}" value="${esc(row[key] || '')}">`); }
        inp.addEventListener('input', () => { row[key] = inp.value; save(); updateTotals(); });
        td.appendChild(inp); tr.appendChild(td);
      });
      if (cfg.extraCol) tr.appendChild(el(`<td class="num">${cfg.extraCol.value(row)}</td>`));
      tr.appendChild(el(`<td class="num" data-line>${chf(cfg.lineTotal(row))}</td>`));
      const del = el('<td><button class="del-btn" title="Zeile löschen">✕</button></td>');
      del.querySelector('button').addEventListener('click', () => { cfg.store.splice(idx, 1); save(); renderRows(); });
      tr.appendChild(del);
      tbody.appendChild(tr);
    });
    updateTotals();
  }
  function updateTotals() {
    let total = 0;
    tbody.querySelectorAll('tr').forEach((tr, idx) => {
      const line = cfg.lineTotal(cfg.store[idx]); total += line;
      const lt = tr.querySelector('[data-line]'); if (lt) lt.textContent = chf(line);
    });
    tfoot.querySelector('[data-total]').textContent = chf(total);
  }
  card.querySelector('[data-add]').addEventListener('click', () => { cfg.store.push(cfg.newRow()); save(); renderRows(); });
  if (cfg.store.length === 0) cfg.store.push(cfg.newRow());
  renderRows();
}

/* ======================================================================
   VIEW 10 – Parameter & Sprache (Referenz)
====================================================================== */
VIEWS.parameter = (main) => {
  main.insertAdjacentHTML('beforeend', viewHead('10 · Parameter & Sprache', 'Stundensätze, Rabatte und Auswahllisten (Referenz)'));
  main.insertAdjacentHTML('beforeend', `<div class="card"><h3>Stundensätze</h3><div class="tbl-wrap"><table class="data">
    <thead><tr><th>Leistung</th><th class="num">Ansatz [CHF/h]</th></tr></thead><tbody>
      <tr><td>Engineering</td><td class="num">${HONORAR.rates.engineering}</td></tr>
      <tr><td>Bauleitung</td><td class="num">${HONORAR.rates.bauleitung}</td></tr>
      <tr><td>Bauherrenvertretung</td><td class="num">${HONORAR.rates.bhv}</td></tr>
      <tr><td>Montage (Basis)</td><td class="num">${HONORAR.rates.montage}</td></tr>
    </tbody></table></div></div>`);
  main.insertAdjacentHTML('beforeend', `<div class="card"><h3>Rabatte für Projekte ≥ 50 kCHF</h3><div class="tbl-wrap"><table class="data">
    <thead><tr><th>Art</th><th class="num">Wert</th></tr></thead><tbody>
      <tr><td>TU-Rabatt Material</td><td class="num">${(HONORAR.rabatte.gt50k_material * 100).toFixed(1)} %</td></tr>
      <tr><td>TU-Rabatt Regie (h-Positionen)</td><td class="num">${(HONORAR.rabatte.gt50k_regie * 100).toFixed(1)} %</td></tr>
      <tr><td>3rd-Party-Handling-Fee</td><td class="num">${(HONORAR.rabatte.handlingFee * 100).toFixed(1)} %</td></tr>
    </tbody></table></div></div>`);
  main.insertAdjacentHTML('beforeend', `<div class="card"><h3>Auswahllisten & Einheiten</h3><div class="tbl-wrap"><table class="data">
    <thead><tr><th>Leistungsart (AK)</th><th>Einheiten</th><th>Sprachen</th><th>Berechnung</th></tr></thead>
    <tbody><tr>
      <td>CU · GF · AB · KK · tbd</td>
      <td>Stk · M · STD · h · d · gl · %</td>
      <td>DE · FR · IT</td>
      <td>automatisiert · manuell</td>
    </tr></tbody></table></div></div>`);
};

/* ======================================================================
   VIEW 11 – LV-Texte DE / FR / IT (durchsuchbar)
====================================================================== */
VIEWS.lvtexte = (main) => {
  main.insertAdjacentHTML('beforeend', viewHead('11 · LV-Texte DE / FR / IT', `Dreisprachiger Positionskatalog (${EXTRA_DATA.lvTexte.length} Positionen)`));
  const wrap = el(`<div>
    <div class="toolbar">
      <input type="search" id="lvSearch" placeholder="Suche Position oder Text (DE/FR/IT)…">
      <span class="spacer"></span><span class="count" id="lvCount"></span>
    </div>
    <div class="tbl-wrap"><table class="data">
      <thead><tr><th>Position</th><th class="wrap">Deutsch</th><th class="wrap">Français</th><th class="wrap">Italiano</th></tr></thead>
      <tbody id="lvBody"></tbody>
    </table></div>
  </div>`);
  main.appendChild(wrap);
  const body = wrap.querySelector('#lvBody');
  // Spalten laut Header: [FR-Pos, FR-Text, _, IT-Pos, IT-Text, _, DE-Pos, DE-Text]
  function render() {
    const q = wrap.querySelector('#lvSearch').value.trim().toLowerCase();
    const frag = document.createDocumentFragment(); let shown = 0;
    for (const r of EXTRA_DATA.lvTexte) {
      const pos = r[6] || r[0], de = r[7] || '', fr = r[1] || '', it = r[4] || '';
      if (q && !(String(pos).toLowerCase().includes(q) || de.toLowerCase().includes(q) || fr.toLowerCase().includes(q) || it.toLowerCase().includes(q))) continue;
      shown++; if (shown > 400) break;
      frag.appendChild(el(`<tr><td>${esc(pos)}</td><td class="wrap">${esc(de)}</td><td class="wrap">${esc(fr)}</td><td class="wrap">${esc(it)}</td></tr>`));
    }
    body.innerHTML = ''; body.appendChild(frag);
    wrap.querySelector('#lvCount').textContent = `${shown}${shown >= 400 ? '+ (gefiltert)' : ''} Positionen`;
  }
  wrap.querySelector('#lvSearch').addEventListener('input', render);
  render();
};

/* ======================================================================
   VIEW – Änderungskontrolle
====================================================================== */
VIEWS.changelog = (main) => {
  main.insertAdjacentHTML('beforeend', viewHead('Änderungskontrolle', 'Versionshistorie der Vorlage'));
  const rows = EXTRA_DATA.changes.map((r) =>
    `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td class="wrap">${esc(r[2])}</td><td class="wrap">${esc(r[3])}</td><td>${esc(r[4])}</td><td>${esc(r[5])}</td></tr>`).join('');
  main.insertAdjacentHTML('beforeend', `<div class="tbl-wrap"><table class="data">
    <thead><tr><th>Version</th><th>Datum</th><th class="wrap">Änderungen</th><th class="wrap">Arbeitsblatt</th><th>Verfasser</th><th>Freigabe</th></tr></thead>
    <tbody>${rows}</tbody></table></div>`);
};

/* ---------- Sidebar / Init ---------- */
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('backdrop').classList.remove('show');
}
function initShell() {
  document.querySelectorAll('.nav-item').forEach((n) => n.addEventListener('click', () => navigate(n.dataset.view)));
  document.getElementById('navToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('backdrop').classList.toggle('show');
  });
  document.getElementById('backdrop').addEventListener('click', closeSidebar);
  document.getElementById('btnPrint').addEventListener('click', () => window.print());
  document.getElementById('btnReset').addEventListener('click', () => {
    if (!confirm('Alle Eingaben zurücksetzen?')) return;
    localStorage.removeItem(STORAGE_KEY); location.reload();
  });
}
function init() {
  loadState();
  initShell();
  const hash = location.hash.replace('#', '');
  navigate(VIEWS[hash] ? hash : 'uebersicht');
}
document.addEventListener('DOMContentLoaded', init);
