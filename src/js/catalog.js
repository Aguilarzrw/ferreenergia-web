import data from '../data/productos.json';
import { icon, siluetaSVG } from './visuals.js';
import { waLink, precio, kvaTxt, SEDES, WA } from './config.js';

const $ = (s, r = document) => r.querySelector(s);
const FUEL = { diesel: 'Diésel', gasolina: 'Gasolina' };
const f = { cat: 'todas', fuel: 'todos', kva: 'todas', q: '' };
const LIMIT = Infinity;
let showAll = false;
let animNext = false; // el escalonado solo corre al cambiar filtros, no al teclear en la búsqueda
const pTxt = (p) => (p.precio == null ? 'Consultar' : (p.desde ? 'Desde ' : '') + precio(p.precio));
const kvaLabel = (p) => (p.kvaMax ? `${p.kva}–${p.kvaMax} KVA` : kvaTxt(p.kva) + ' KVA');
const kvasDe = (p) => (p.variantes ? p.variantes.map((v) => v.kva) : [p.kva]);
let compare = [];

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const baseUrl = import.meta.env.BASE_URL;
const imgSrc = (p) => baseUrl + 'img/productos/' + p;
const nombreLimpio = (p) => p.nombre.replace(' (ejemplo)', '');

function visual(p, i = 0) {
  if (p.imagenes && p.imagenes[i]) return `<img src="${imgSrc(p.imagenes[i])}" alt="${nombreLimpio(p)}, vista ${i + 1}" loading="lazy" decoding="async" />`;
  return siluetaSVG(p.categoria, { insono: p.badges.includes('Insonorizada') });
}

function filtrar() {
  return data.productos.filter((p) => {
    // Los registros de demostración no son inventario confirmado y no deben publicarse.
    if (p.ejemplo) return false;
    if (f.cat !== 'todas' && p.categoria !== f.cat) return false;
    if (f.fuel !== 'todos' && p.combustible !== f.fuel) return false;
    if (f.kva !== 'todas') {
      const [a, b] = f.kva.split('-').map(Number);
      if (p.kva == null || !kvasDe(p).some((k) => k >= a && k < b)) return false;
    }
    if (f.q) {
      const hay = norm([p.nombre, p.marca, p.combustible || '', p.kva ? p.kva + ' kva' : '', p.categoria, p.badges.join(' ')].join(' '));
      if (!f.q.split(/\s+/).every((t) => hay.includes(t))) return false;
    }
    return true;
  });
}

function card(p, opts = {}) {
  const checked = compare.includes(p.id);
  const canCmp = p.categoria === 'plantas' && !opts.noCmp && !p.variantes;
  return `<article class="card" data-id="${p.id}">
    <div class="card__img">${visual(p)}
      ${p.kva ? `<span class="card__kva">${kvaLabel(p)}</span>` : ''}
      ${p.combustible ? `<span class="card__fuel">${FUEL[p.combustible]}</span>` : ''}
    </div>
    <div class="card__body">
      <h3 class="card__name"><button type="button" data-open="${p.id}" aria-haspopup="dialog">${nombreLimpio(p)}</button></h3>
      <div class="badges">${p.badges.map((b) => `<span class="badge ${b === 'ATS' ? 'badge--ats' : ''}">${b}</span>`).join('')}</div>
      <div class="card__foot">
        <div class="price ${p.precio == null ? 'price--ask' : ''}">${pTxt(p)}<small>${p.precio == null ? 'Precio por WhatsApp' : (p.variantes ? 'USD · según potencia' : 'USD' + (p.ejemplo ? ' · referencial' : ''))}</small></div>
        ${canCmp ? `<label class="cmp"><input class="cmp__in" type="checkbox" data-cmp="${p.id}" ${checked ? 'checked' : ''} /><span class="cmp__box" aria-hidden="true">${icon('check', 14)}</span><span>Comparar</span></label>` : ''}
      </div>
    </div></article>`;
}

function render() {
  const list = filtrar();
  const active = f.cat !== 'todas' || f.fuel !== 'todos' || f.kva !== 'todas' || f.q;
  const shown = active || showAll ? list : list.slice(0, LIMIT);
  $('#grid').innerHTML = list.length ? shown.map((p, i) => card(p).replace('<article class="card"', `<article class="card" style="--i:${i}"`)).join('') : '<p class="empty">No hay equipos con esos filtros. Quita alguno o escríbenos por WhatsApp.</p>';
  $('#grid').classList.toggle('is-anim', animNext); animNext = false;
  $('#results').textContent = `${list.length} ${list.length === 1 ? 'equipo' : 'equipos'}`;
  const n = (f.cat !== 'todas') + (f.fuel !== 'todos') + (f.kva !== 'todas');
  const badge = $('#filters-count'); badge.hidden = !n; badge.textContent = n;
  updateTray();
}

function updateTray() {
  const tray = $('#cmp-tray');
  tray.hidden = compare.length === 0;
  $('#cmp-count').textContent = `${compare.length} de 3 plantas`;
  $('#cmp-open').disabled = compare.length < 2;
  $('#cmp-open').setAttribute('aria-disabled', compare.length < 2);
  $('#cmp-open').style.opacity = compare.length < 2 ? 0.5 : 1;
}

function msgProducto(p) {
  return `Hola Ferreenergía, me interesa la ${nombreLimpio(p)}${p.precio == null ? '' : ' (' + precio(p.precio) + ')'}. ¿Está disponible y a qué precio?`;
}

function openProduct(id, trigger) {
  const p = data.productos.find((x) => x.id === id); if (!p) return;
  const dlg = $('#product-dialog');
  let idx = 0;
  const n = Math.max(1, (p.imagenes || []).length);
  const paint = () => {
    $('.pd__main', dlg).innerHTML = visual(p, idx);
    dlg.querySelectorAll('.pd__thumbs button').forEach((b, i) => b.setAttribute('aria-current', i === idx));
  };
  const chips = [p.kva ? kvaLabel(p) : '', p.combustible ? FUEL[p.combustible] : '', ...p.badges].filter(Boolean);
  dlg.innerHTML = `
    <div class="dlg__head"><h3 id="pd-title">${nombreLimpio(p)}</h3><button class="dlg__close" type="button" aria-label="Cerrar ficha">${icon('close', 20)}</button></div>
    <div class="dlg__body">
      <div class="pd">
        <div class="pd__gal"><div class="pd__main"></div>
          ${n > 1 ? `<div class="pd__thumbs">${Array.from({ length: n }, (_, i) => `<button type="button" aria-label="Ver foto ${i + 1}">${visual(p, i)}</button>`).join('')}</div>` : ''}
          ${!(p.imagenes || []).length ? '<p class="note-ref">Imagen ilustrativa. Foto real próximamente.</p>' : p.fotoReferencial ? '<p class="note-ref">Foto referencial de la serie.</p>' : ''}
        </div>
        <div class="pd__info">
          <div class="badges">${chips.map((c, i) => `<span class="badge ${i === 0 && p.kva ? 'badge--ats' : ''}">${c}</span>`).join('')}</div>
          <p>${p.descripcion}</p>
          <table class="spec"><caption class="sr">Especificaciones técnicas</caption><tbody>${Object.entries(p.specs).map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('')}</tbody></table>
          ${p.variantes ? `<table class="spec spec--var"><caption class="sr">Potencias y precios</caption><tbody>${p.variantes.map((v) => `<tr><th scope="row">${v.kva} KVA</th><td><b>${precio(v.precio)}</b></td><td><a class="var-wa" target="_blank" rel="noopener" href="${waLink(`Hola Ferreenergía, me interesa la AGG de ${v.kva} KVA (${precio(v.precio)}). ¿Está disponible?`)}">Pedir ${icon('arrow', 14)}</a></td></tr>`).join('')}</tbody></table>` : ''}
          <p class="avail"><span class="avail__l">Disponible en</span>${p.disponible.map((s) => `<span class="avail__p">${icon('pin', 14)}${s}</span>`).join('')}</p>
        </div>
      </div>
    </div>
    <div class="dlg__foot">
      <div class="pd__price">${pTxt(p)}<small>${p.precio == null ? 'precio por WhatsApp' : 'USD' + (p.variantes ? ' · según potencia' : p.ejemplo ? ' · referencial' : '')}</small></div>
      <a class="btn btn--yellow" target="_blank" rel="noopener" href="${waLink(msgProducto(p), WA.principal)}">${icon('wa', 20)} Pedir por WhatsApp</a>
    </div>`;
  dlg.querySelector('.dlg__close').onclick = () => dlg.close();
  dlg.querySelectorAll('.pd__thumbs button').forEach((b, i) => (b.onclick = () => { idx = i; paint(); }));
  paint();
  dlg.showModal();
  dlg.querySelector('.dlg__body').scrollTop = 0;
  dlg.addEventListener('close', () => trigger?.focus(), { once: true });
}

const si = (v) => (v ? 'Sí' : 'No');
function filasComparar(items) {
  const rows = [
    ['Precio', (p) => `<b>${pTxt(p)}</b>${p.precio != null && p.ejemplo ? ' <em>ref.</em>' : ''}`],
    ['Potencia', (p) => (p.kva ? kvaTxt(p.kva) + ' KVA' : '—')],
    ['Combustible', (p) => (p.combustible ? FUEL[p.combustible] : '—')],
    ['Voltaje', (p) => (p.voltaje && p.voltaje !== '—' ? p.voltaje : '—')],
    ['ATS', (p) => si(p.badges.includes('ATS'))],
    ['Insonorizada', (p) => si(p.badges.includes('Insonorizada'))],
    ['Arranque', (p) => (p.badges.includes('Arranque eléctrico') ? 'Eléctrico' : (p.specs['Arranque'] || '—'))],
    ['Disponible en', (p) => p.disponible.join(' y ')],
  ];
  return rows.filter(([, fn]) => items.some((p) => fn(p) !== '—'));
}

function openCompare() {
  const dlg = $('#compare-dialog');
  const items = compare.map((id) => data.productos.find((p) => p.id === id));
  const rows = filasComparar(items);
  dlg.innerHTML = `<div class="dlg__head"><h3 id="cd-title">Comparar plantas <span class="dlg__count">${items.length} de 3</span></h3><button class="dlg__close" type="button" aria-label="Cerrar comparación">${icon('close', 20)}</button></div>
    <div class="dlg__body"><table class="cmp-table">
      <thead><tr><td></td>${items.map((p) => `<th scope="col"><div class="cmp-h"><div class="cmp-h__img">${visual(p)}</div><span class="cmp-h__n">${nombreLimpio(p)}</span><button class="cmp-h__rm" type="button" data-rm="${p.id}">Quitar</button></div></th>`).join('')}</tr></thead>
      <tbody>${rows.map(([k, fn]) => `<tr><th scope="row">${k}</th>${items.map((p) => `<td>${fn(p)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>
    <div class="dlg__foot dlg__foot--cmp">${items.map((p) => `<a class="btn btn--yellow btn--sm" target="_blank" rel="noopener" href="${waLink(msgProducto(p))}">${icon('wa', 16)} Pedir ${kvaTxt(p.kva)} KVA</a>`).join('')}</div>`;
  dlg.querySelector('.dlg__close').onclick = () => dlg.close();
  dlg.querySelectorAll('[data-rm]').forEach((b) => (b.onclick = () => {
    compare = compare.filter((x) => x !== b.dataset.rm); render();
    compare.length > 1 ? openCompare() : dlg.close();
  }));
  if (!dlg.open) dlg.showModal();
}

let dd = null;
const bindDialogs = () => document.querySelectorAll('dialog').forEach((d) => d.addEventListener('click', (ev) => { if (ev.target === d) d.close(); }));

// Desplegable propio (sustituye al <select> nativo): botón + listbox con teclado.
function initDropdowns(onChange) {
  const dds = [...document.querySelectorAll('.dd')];
  const setOpen = (d, on) => { d.querySelector('.dd__list').hidden = !on; d.querySelector('.dd__btn').setAttribute('aria-expanded', on); d.classList.toggle('is-open', on); };
  const closeAll = (except) => dds.forEach((d) => { if (d !== except) setOpen(d, false); });
  const mark = (d, li) => { d.querySelectorAll('[role=option]').forEach((o) => o.setAttribute('aria-selected', o === li)); d.querySelector('.dd__v').textContent = li.textContent; };
  dds.forEach((d) => {
    const b = d.querySelector('.dd__btn'), l = d.querySelector('.dd__list');
    [...l.children].forEach((li) => li.setAttribute('tabindex', '-1'));
    const openIt = () => { closeAll(d); setOpen(d, true); (l.querySelector('[aria-selected=true]') || l.firstElementChild).focus(); };
    b.addEventListener('click', () => (l.hidden ? openIt() : setOpen(d, false)));
    b.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); openIt(); } });
    l.addEventListener('click', (e) => { const li = e.target.closest('[role=option]'); if (!li) return; mark(d, li); onChange(d.dataset.filter, li.dataset.v); setOpen(d, false); b.focus(); });
    l.addEventListener('keydown', (e) => {
      const o = [...l.children], i = o.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); o[Math.min(i + 1, o.length - 1)].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); o[Math.max(i - 1, 0)].focus(); }
      else if (e.key === 'Home') { e.preventDefault(); o[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); o[o.length - 1].focus(); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.activeElement.click(); }
      else if (e.key === 'Escape' || e.key === 'Tab') { if (e.key === 'Escape') e.stopPropagation(); setOpen(d, false); b.focus(); }
    });
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.dd')) closeAll(); });
  return { reset() { dds.forEach((d) => mark(d, d.querySelector('[role=option]'))); } };
}

const DESTACADOS = ['europower-dg15000se', 'europower-em3800', 'generador-dual-12000w', 'agg-serie'];
export function initFeatured() {
  const g = $('#featured'); if (!g) return;
  g.innerHTML = DESTACADOS.map((id) => card(data.productos.find((p) => p.id === id), { noCmp: true })).join('');
  g.addEventListener('click', (ev) => { const o = ev.target.closest('[data-open]'); if (o) openProduct(o.dataset.open, o); });
  bindDialogs();
}

export function initCatalog() {
  render();
  const grid = $('#grid');
  grid.addEventListener('click', (ev) => {
    const o = ev.target.closest('[data-open]'); if (o) openProduct(o.dataset.open, o);
  });
  grid.addEventListener('change', (ev) => {
    const c = ev.target.closest('[data-cmp]'); if (!c) return;
    if (c.checked) {
      if (compare.length >= 3) { c.checked = false; $('#results').textContent = 'Puedes comparar hasta 3 plantas.'; return; }
      compare.push(c.dataset.cmp);
    } else compare = compare.filter((x) => x !== c.dataset.cmp);
    updateTray();
  });
  $('#cmp-open').onclick = () => compare.length > 1 && openCompare();
  $('#cmp-clear').onclick = () => { compare = []; render(); };

  // filtros
  dd = initDropdowns((k, v) => { f[k] = v; animNext = true; render(); });
  document.querySelectorAll('.seg').forEach((seg) => seg.addEventListener('click', (ev) => {
    const b = ev.target.closest('.seg__btn'); if (!b) return;
    f[seg.dataset.filter] = b.dataset.v; animNext = true;
    seg.querySelectorAll('.seg__btn').forEach((x) => { const on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on); });
    render();
  }));
  let tm; const qc = $('#q-clear');
  $('#q').addEventListener('input', (ev) => { qc.hidden = !ev.target.value; clearTimeout(tm); tm = setTimeout(() => { f.q = norm(ev.target.value.trim()); render(); }, 120); });
  qc.onclick = () => { const q = $('#q'); q.value = ''; qc.hidden = true; f.q = ''; render(); q.focus(); };
  $('#filters-clear').onclick = () => {
    Object.assign(f, { cat: 'todas', fuel: 'todos', kva: 'todas' });
    document.querySelectorAll('.seg').forEach((seg) => seg.querySelectorAll('.seg__btn').forEach((x, i) => { x.classList.toggle('is-on', i === 0); x.setAttribute('aria-pressed', i === 0); }));
    dd.reset();
    render();
  };

  // sheet inferior en móvil
  const sheet = $('#filters'), open = $('#filters-open'), back = $('#filters-backdrop');
  const isSheet = () => matchMedia('(max-width: 899px)').matches;
  const toggle = (on) => {
    sheet.classList.toggle('is-open', on); back.hidden = !on; open.setAttribute('aria-expanded', on);
    // En móvil la hoja es un diálogo modal: lo declaramos y atrapamos el foco mientras está abierta.
    if (isSheet()) { sheet.setAttribute('role', on ? 'dialog' : 'group'); on ? sheet.setAttribute('aria-modal', 'true') : sheet.removeAttribute('aria-modal'); on ? sheet.setAttribute('aria-label', 'Filtros del catálogo') : null; document.body.style.overflow = on ? 'hidden' : ''; }
    if (on) setTimeout(() => sheet.querySelector('.seg__btn.is-on').focus(), 80); else open.focus({ preventScroll: true });
  };
  sheet.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !sheet.classList.contains('is-open') || !isSheet()) return;
    const f = [...sheet.querySelectorAll('button:not([hidden])')].filter((b) => b.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  open.onclick = () => toggle(true);
  back.onclick = () => toggle(false);
  $('#filters-apply').onclick = () => toggle(false);
  addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && sheet.classList.contains('is-open')) toggle(false); });
  bindDialogs();
}

export { SEDES };
