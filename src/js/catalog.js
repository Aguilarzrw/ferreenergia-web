import data from '../data/productos.json';
import { icon, siluetaSVG } from './visuals.js';
import { waLink, precio, kvaTxt, SEDES, WA } from './config.js';

const $ = (s, r = document) => r.querySelector(s);
const FUEL = { diesel: 'Diésel', gasolina: 'Gasolina' };
const f = { cat: 'todas', fuel: 'todos', kva: 'todas', q: '' };
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
    if (f.cat !== 'todas' && p.categoria !== f.cat) return false;
    if (f.fuel !== 'todos' && p.combustible !== f.fuel) return false;
    if (f.kva !== 'todas') {
      const [a, b] = f.kva.split('-').map(Number);
      if (p.kva == null || p.kva < a || p.kva >= b) return false;
    }
    if (f.q) {
      const hay = norm([p.nombre, p.marca, p.combustible || '', p.kva ? p.kva + ' kva' : '', p.categoria, p.badges.join(' ')].join(' '));
      if (!f.q.split(/\s+/).every((t) => hay.includes(t))) return false;
    }
    return true;
  });
}

function card(p) {
  const checked = compare.includes(p.id);
  const canCmp = p.categoria === 'plantas';
  return `<article class="card" data-id="${p.id}">
    <div class="card__img">${visual(p)}
      ${p.kva ? `<span class="card__kva">${kvaTxt(p.kva)} KVA</span>` : ''}
      ${p.combustible ? `<span class="card__fuel">${FUEL[p.combustible]}</span>` : ''}
    </div>
    <div class="card__body">
      <h3 class="card__name"><button type="button" data-open="${p.id}" aria-haspopup="dialog">${nombreLimpio(p)}</button></h3>
      <div class="badges">${p.badges.map((b) => `<span class="badge ${b === 'ATS' ? 'badge--ats' : ''}">${b}</span>`).join('')}</div>
      <div class="card__foot">
        <div class="price">${precio(p.precio)}<small>USD${p.ejemplo ? ' · referencial' : ''}</small></div>
        ${canCmp ? `<label class="cmp"><input type="checkbox" data-cmp="${p.id}" ${checked ? 'checked' : ''} /> Comparar</label>` : ''}
      </div>
    </div></article>`;
}

function render() {
  const list = filtrar();
  $('#grid').innerHTML = list.length ? list.map(card).join('') : '<p class="empty">No encontramos equipos con esos filtros. Escríbenos y lo conseguimos.</p>';
  $('#results').textContent = `${list.length} ${list.length === 1 ? 'equipo' : 'equipos'}`;
  const n = (f.cat !== 'todas') + (f.fuel !== 'todos') + (f.kva !== 'todas');
  const badge = $('#filters-count'); badge.hidden = !n; badge.textContent = n;
  updateTray();
}

function updateTray() {
  const tray = $('#cmp-tray');
  tray.hidden = compare.length === 0;
  $('#cmp-count').textContent = `${compare.length} de 3`;
  $('#cmp-open').disabled = compare.length < 2;
  $('#cmp-open').setAttribute('aria-disabled', compare.length < 2);
  $('#cmp-open').style.opacity = compare.length < 2 ? 0.5 : 1;
}

function msgProducto(p) {
  return `Hola Ferreenergía, me interesa la ${nombreLimpio(p)} (${precio(p.precio)}). ¿Está disponible?`;
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
  dlg.innerHTML = `
    <button class="dlg__close" type="button" aria-label="Cerrar ficha">${icon('close', 22)}</button>
    <div class="pd">
      <div class="pd__gal"><div class="pd__main"></div>
        ${n > 1 ? `<div class="pd__thumbs">${Array.from({ length: n }, (_, i) => `<button type="button" aria-label="Ver foto ${i + 1}">${visual(p, i)}</button>`).join('')}</div>` : ''}
        ${!(p.imagenes || []).length ? '<p class="note-ref">Imagen ilustrativa. Foto real próximamente.</p>' : ''}
      </div>
      <div class="pd__info">
        <div class="badges">${p.kva ? `<span class="badge badge--ats">${kvaTxt(p.kva)} KVA</span>` : ''}${p.combustible ? `<span class="badge">${FUEL[p.combustible]}</span>` : ''}${p.badges.map((b) => `<span class="badge">${b}</span>`).join('')}</div>
        <h3 id="pd-title">${nombreLimpio(p)}</h3>
        <p>${p.descripcion}</p>
        <div class="pd__price">${precio(p.precio)}<small>USD${p.ejemplo ? ' · precio referencial' : ''}</small></div>
        <table class="spec"><caption class="sr">Especificaciones técnicas</caption><tbody>${Object.entries(p.specs).map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('')}</tbody></table>
        <div class="avail"><strong>Disponible en:</strong>${p.disponible.map((s) => `<span>${icon('pin', 16)}${s}</span>`).join('')}</div>
        <a class="btn btn--yellow btn--lg btn--block" target="_blank" rel="noopener" href="${waLink(msgProducto(p), WA.principal)}">${icon('wa', 22)} Lo quiero: WhatsApp</a>
      </div>
    </div>`;
  dlg.querySelector('.dlg__close').onclick = () => dlg.close();
  dlg.querySelectorAll('.pd__thumbs button').forEach((b, i) => (b.onclick = () => { idx = i; paint(); }));
  paint();
  dlg.showModal();
  dlg.addEventListener('close', () => trigger?.focus(), { once: true });
}

function openCompare() {
  const dlg = $('#compare-dialog');
  const items = compare.map((id) => data.productos.find((p) => p.id === id));
  const keys = ['Potencia continua', 'Voltaje', 'Combustible', 'Arranque', 'Cabina', 'Tablero', 'Autonomía aprox.'];
  dlg.innerHTML = `<button class="dlg__close" type="button" aria-label="Cerrar comparación">${icon('close', 22)}</button>
    <div class="cd"><h3 id="cd-title">Comparar plantas</h3><div class="cd__scroll"><table>
      <thead><tr><th scope="col"><span class="sr">Característica</span></th>${items.map((p) => `<th scope="col">${nombreLimpio(p)}</th>`).join('')}</tr></thead>
      <tbody>
        <tr><th scope="row">Precio</th>${items.map((p) => `<td><b>${precio(p.precio)}</b>${p.ejemplo ? ' (ref.)' : ''}</td>`).join('')}</tr>
        <tr><th scope="row">KVA</th>${items.map((p) => `<td>${kvaTxt(p.kva)}</td>`).join('')}</tr>
        ${keys.map((k) => `<tr><th scope="row">${k}</th>${items.map((p) => `<td>${p.specs[k] || '—'}</td>`).join('')}</tr>`).join('')}
        <tr><th scope="row">Disponible</th>${items.map((p) => `<td>${p.disponible.join(', ')}</td>`).join('')}</tr>
        <tr><th scope="row"><span class="sr">Pedir</span></th>${items.map((p) => `<td><a class="btn btn--yellow btn--sm" target="_blank" rel="noopener" href="${waLink(msgProducto(p))}">WhatsApp</a></td>`).join('')}</tr>
      </tbody></table></div></div>`;
  dlg.querySelector('.dlg__close').onclick = () => dlg.close();
  dlg.showModal();
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
      if (compare.length >= 3) { c.checked = false; $('#results').textContent = 'Máximo 3 plantas para comparar.'; return; }
      compare.push(c.dataset.cmp);
    } else compare = compare.filter((x) => x !== c.dataset.cmp);
    updateTray();
  });
  $('#cmp-open').onclick = () => compare.length > 1 && openCompare();
  $('#cmp-clear').onclick = () => { compare = []; render(); };

  // filtros
  document.querySelectorAll('.seg').forEach((seg) => seg.addEventListener('click', (ev) => {
    const b = ev.target.closest('.seg__btn'); if (!b) return;
    f[seg.dataset.filter] = b.dataset.v;
    seg.querySelectorAll('.seg__btn').forEach((x) => { const on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on); });
    render();
  }));
  let tm; $('#q').addEventListener('input', (ev) => { clearTimeout(tm); tm = setTimeout(() => { f.q = norm(ev.target.value.trim()); render(); }, 120); });
  $('#filters-clear').onclick = () => {
    Object.assign(f, { cat: 'todas', fuel: 'todos', kva: 'todas' });
    document.querySelectorAll('.seg').forEach((seg) => seg.querySelectorAll('.seg__btn').forEach((x, i) => { x.classList.toggle('is-on', i === 0); x.setAttribute('aria-pressed', i === 0); }));
    render();
  };

  // sheet inferior en móvil
  const sheet = $('#filters'), open = $('#filters-open'), back = $('#filters-backdrop');
  const toggle = (on) => {
    sheet.classList.toggle('is-open', on); back.hidden = !on; open.setAttribute('aria-expanded', on);
    if (on) setTimeout(() => sheet.querySelector('.seg__btn.is-on').focus(), 80); else open.focus({ preventScroll: true });
  };
  open.onclick = () => toggle(true);
  back.onclick = () => toggle(false);
  $('#filters-apply').onclick = () => toggle(false);
  addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && sheet.classList.contains('is-open')) toggle(false); });
  // clic fuera del dialog = cerrar
  document.querySelectorAll('dialog').forEach((d) => d.addEventListener('click', (ev) => { if (ev.target === d) d.close(); }));
}

export { SEDES };
