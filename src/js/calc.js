import { gsap } from 'gsap';
import data from '../data/equipos.json';
import catalogo from '../data/productos.json';
import { icon } from './visuals.js';
import { waLink, precio, kvaTxt, prefersReduced } from './config.js';

const MAX_KVA_BAR = 40;

// Potencia requerida: carga continua + el mayor sobrepico de arranque (los motores no arrancan todos a la vez).
export function calcular(sel) {
  let run = 0, extra = 0;
  sel.forEach(({ eq, qty }) => {
    run += eq.w * qty;
    extra = Math.max(extra, eq.w * (eq.arranque - 1));
  });
  const pico = run + extra;
  const kva = pico > 0 ? (pico / data.factorPotencia / 1000) * (1 + data.margen) : 0;
  return { run, pico, kva };
}

export function recomendar(kva) {
  const plantas = catalogo.productos.filter((p) => p.categoria === 'plantas' && p.kva).sort((a, b) => a.kva - b.kva);
  const ok = plantas.find((p) => p.kva >= kva);
  return { producto: ok || plantas[plantas.length - 1], cubre: !!ok };
}

export function initCalc() {
  const wrap = document.getElementById('calc-cards');
  const qty = Object.fromEntries(data.equipos.map((e) => [e.id, 0]));
  wrap.innerHTML = data.equipos.map((e) => `
    <div class="eq" data-id="${e.id}">
      <button class="eq__tap" type="button" aria-label="Agregar ${e.nombre}"></button>
      <span class="eq__badge" aria-hidden="true">0</span>
      <span class="eq__ico">${icon(e.icono, 34)}</span>
      <span class="eq__name">${e.nombre}</span>
      <span class="eq__w">${String(e.w).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} W</span>
      <div class="eq__ctr">
        <button type="button" data-d="-1" aria-label="Quitar uno: ${e.nombre}">${icon('minus', 20)}</button>
        <output aria-live="polite" aria-label="Cantidad de ${e.nombre}">0</output>
        <button type="button" data-d="1" aria-label="Agregar uno: ${e.nombre}">${icon('plus', 20)}</button>
      </div>
    </div>`).join('');

  const els = {
    fill: document.getElementById('meter-fill'), spark: document.getElementById('meter-spark'), bar: document.getElementById('meter-bar'),
    w: document.getElementById('out-w'), kva: document.getElementById('out-kva'), rec: document.getElementById('out-rec'), wa: document.getElementById('out-wa'),
  };
  const view = { w: 0, kva: 0, pct: 0 };
  const fmt = (n) => Math.round(n).toLocaleString('es-VE').replace(/,/g, '.');
  const reduced = prefersReduced();

  function render() {
    const sel = data.equipos.filter((e) => qty[e.id] > 0).map((eq) => ({ eq, qty: qty[eq.id] }));
    const { run, kva } = calcular(sel);
    const kvaR = kva > 0 ? Math.ceil(kva * 10) / 10 : 0;
    const pct = Math.min(1, kvaR / MAX_KVA_BAR) * 100;

    gsap.to(view, {
      w: run, kva: kvaR, pct, duration: reduced ? 0 : 0.7, ease: 'power3.out', overwrite: true,
      onUpdate: () => {
        els.w.textContent = fmt(view.w);
        els.kva.textContent = kvaTxt(view.kva.toFixed(1));
        els.fill.style.width = view.pct + '%';
        els.spark.style.left = view.pct + '%';
      },
    });
    els.bar.setAttribute('aria-valuenow', kvaR);
    els.bar.setAttribute('aria-valuetext', `${kvaTxt(kvaR)} KVA recomendados`);
    els.spark.classList.toggle('is-on', sel.length > 0);
    if (sel.length && !reduced) { els.spark.classList.remove('zap'); void els.spark.offsetWidth; els.spark.classList.add('zap'); }

    if (!sel.length) {
      els.rec.innerHTML = 'Selecciona al menos un equipo.';
      els.wa.setAttribute('aria-disabled', 'true'); els.wa.removeAttribute('href');
      return;
    }
    const { producto: p, cubre } = recomendar(kvaR);
    const lista = sel.map(({ eq, qty: q }) => `${q} x ${eq.nombre}`);
    els.rec.innerHTML = cubre
      ? `Recomendada: <b>${p.nombre.replace(' (ejemplo)', '')}</b><br><span class="pr">${p.precio == null ? 'Consultar precio' : precio(p.precio)}</span> · ${kvaTxt(p.kva)} KVA · ${p.combustible === 'diesel' ? 'Diésel' : 'Gasolina'}`
      : `Tu consumo supera nuestra planta individual más grande (<b>${kvaTxt(p.kva)} KVA</b>). <span class="detail">Te armamos una solución a medida.</span>`;
    const msg = `Hola Ferreenergía, calculé mi consumo en su web:\n• ${lista.join('\n• ')}\n\nPotencia estimada: ${fmt(run)} W\nKVA recomendados: ${kvaTxt(kvaR.toFixed(1))}\n` +
      (cubre ? `Planta sugerida: ${p.nombre.replace(' (ejemplo)', '')} ${p.precio == null ? '' : ' (' + precio(p.precio) + ')'}\n` : 'Necesito una solución para esta potencia.\n') + '¿Me confirman disponibilidad y precio?';
    els.wa.href = waLink(msg);
    els.wa.target = '_blank'; els.wa.rel = 'noopener';
    els.wa.removeAttribute('aria-disabled');
  }

  function setQty(id, d) {
    qty[id] = Math.max(0, Math.min(20, qty[id] + d));
    const card = wrap.querySelector(`[data-id="${id}"]`);
    card.classList.toggle('is-on', qty[id] > 0);
    card.querySelector('output').textContent = qty[id];
    const b = card.querySelector('.eq__badge'); b.textContent = qty[id];
    if (!reduced && d > 0) gsap.fromTo(card.querySelector('.eq__ico'), { scale: 1.35 }, { scale: 1.12, duration: 0.4, ease: 'back.out(3)' });
    render();
  }
  wrap.addEventListener('click', (ev) => {
    const card = ev.target.closest('.eq'); if (!card) return;
    const btn = ev.target.closest('[data-d]');
    setQty(card.dataset.id, btn ? +btn.dataset.d : (ev.target.closest('.eq__tap') ? 1 : 0));
  });
  document.getElementById('calc-reset').addEventListener('click', () => data.equipos.forEach((e) => { if (qty[e.id]) setQty(e.id, -qty[e.id]); }));
  render();
}
