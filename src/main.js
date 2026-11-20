import '@fontsource-variable/big-shoulders-display';
import '@fontsource-variable/archivo';
import '@fontsource-variable/jetbrains-mono';
import './styles/main.css';
import './styles/system.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { icon, siluetaSVG } from './js/visuals.js';
import { waLink, SEDES, prefersReduced } from './js/config.js';
import { mountLayout } from './js/layout.js';

gsap.registerPlugin(ScrollTrigger);
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = prefersReduced();
if (reduced) document.documentElement.classList.add('reduced');
const page = document.body.dataset.page;

mountLayout();

// ---- scroll suave (no con reduced motion) ----
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
$$('a[href^="#"]').forEach((a) => a.addEventListener('click', (ev) => {
  const id = a.getAttribute('href'); if (id.length < 2 || !$(id)) return;
  ev.preventDefault(); closeMenu();
  lenis ? lenis.scrollTo(id, { offset: -70 }) : $(id).scrollIntoView();
}));

// ---- navbar + menú móvil ----
const nav = $('#nav'), burger = $('#burger'), menu = $('#menu');
ScrollTrigger.create({ start: 24, end: 99999, onToggle: (s) => nav.classList.toggle('is-compact', s.isActive) });
function closeMenu() { if (menu.classList.contains('is-open')) toggleMenu(false); }
function toggleMenu(on) {
  menu.hidden = false; menu.classList.toggle('is-open', on); menu.inert = !on;
  burger.setAttribute('aria-expanded', on); burger.setAttribute('aria-label', on ? 'Cerrar menú' : 'Abrir menú');
  document.body.style.overflow = on ? 'hidden' : ''; on ? lenis?.stop() : lenis?.start();
}
menu.inert = true;
burger.addEventListener('click', () => toggleMenu(!menu.classList.contains('is-open')));
addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
nav.classList.toggle('nav--solid', page !== 'inicio');

// ---- cursor brillante (solo desktop) ----
if (matchMedia('(hover: hover) and (pointer: fine)').matches && !reduced) {
  const g = $('.cursor-glow');
  if (g) {
    const xs = gsap.quickTo(g, 'x', { duration: 0.5, ease: 'power3' }), ys = gsap.quickTo(g, 'y', { duration: 0.5, ease: 'power3' });
    addEventListener('pointermove', (e) => { g.style.opacity = 1; xs(e.clientX); ys(e.clientY); }, { passive: true });
  }
}

// ---- titulares y reveals ----
function split(el) {
  const text = el.textContent; el.setAttribute('aria-label', text); el.textContent = '';
  text.split(' ').forEach((w, i, arr) => {
    const word = document.createElement('span'); word.className = 'split-word'; word.setAttribute('aria-hidden', 'true');
    [...w].forEach((c) => { const s = document.createElement('span'); s.className = 'split-char'; s.textContent = c; word.append(s); });
    el.append(word); if (i < arr.length - 1) el.append(' ');
  });
  return $$('.split-char', el);
}
$$('[data-split]').forEach((h) => {
  const chars = split(h); if (reduced) return;
  gsap.from(chars, { yPercent: 110, duration: 0.7, ease: 'power4.out', stagger: 0.012, scrollTrigger: { trigger: h, start: 'top 92%', once: true } });
});
$$('[data-reveal]').forEach((el) => {
  if (reduced) return;
  gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 94%', once: true } });
});

// ---- contadores ----
$$('[data-count]').forEach((el) => {
  const end = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
  if (reduced) { el.textContent = pre + end + suf; return; }
  const o = { v: 0 };
  ScrollTrigger.create({ trigger: el, start: 'top 94%', once: true, onEnter: () => gsap.to(o, { v: end, duration: 1.6, ease: 'power2.out', onUpdate: () => { el.textContent = pre + Math.round(o.v) + suf; } }) });
});

// ---- Home: destacados + hero ----
if (page === 'inicio') {
  import('./js/catalog.js').then((m) => m.initFeatured());
  hero();
}
// ---- Catálogo ----
if (page === 'catalogo') import('./js/catalog.js').then((m) => m.initCatalog());
// ---- Calculadora ----
if (page === 'calculadora') import('./js/calc.js').then((m) => m.initCalc());

// ---- Servicios: timeline + galería ----
if ($('#timeline')) {
  const tl = $('#timeline'); const items = $$('li', tl);
  const line = document.createElement('div'); line.className = 'tl__line'; tl.prepend(line);
  if (reduced) items.forEach((i) => i.classList.add('is-on'));
  else ScrollTrigger.create({
    trigger: tl, start: 'top 80%', end: 'bottom 60%', scrub: 0.4,
    onUpdate: (s) => {
      const p = s.progress;
      if (innerWidth < 900) { line.style.height = p * 100 + '%'; line.style.width = ''; } else { line.style.width = p * 100 + '%'; line.style.height = ''; }
      items.forEach((li, i) => li.classList.toggle('is-on', p >= (i / (items.length - 1)) - 0.02));
    },
  });
}
if ($('#work-rail')) {
  const rail = $('#work-rail'); const base = import.meta.env.BASE_URL + 'img/trabajos/';
  const items = [
    ['despacho.webp', 'Despacho de equipos', 'Cargando una planta para entrega'],
    ['camaguan.webp', 'Nueva sede Camaguán', 'Inauguración en el Guárico'],
    ['showroom-1.webp', 'Generador dual 12.000 W', 'Con ATS incluido, en showroom'],
    ['showroom-2.webp', 'Generador 3.500 W', 'Gasolina, 6,5 HP, 4 tiempos'],
    ['showroom-3.webp', 'Generador 3.500 W', 'Arranque manual, 110/220 V'],
  ];
  rail.innerHTML = items.map(([f, t, d], i) => `<figure class="work__item"><span class="num">${String(i + 1).padStart(2, '0')}</span>
    <img src="${base}${f}" alt="${t}: ${d}" loading="lazy" decoding="async" /><figcaption class="cap"><b>${t}</b>${d}</figcaption></figure>`).join('');
}

// ---- Sedes: tarjetas + mapa + FAQ ----
if ($('#sede-list')) {
  const info = {
    'San Jacinto': { est: 'Aragua', main: true, txt: 'Sede principal. Exhibición de plantas, despacho de equipos y taller de servicio técnico.', hora: 'Consúltalo por WhatsApp' },
    'Camaguán': { est: 'Guárico', nuevo: true, txt: 'Nueva sede para los llanos: más cerca de fincas, galpones y comercios del Guárico.', hora: 'Consúltalo por WhatsApp' },
  };
  $('#sede-list').innerHTML = Object.entries(info).map(([n, d]) => `
    <article class="sede ${d.main ? 'is-main' : ''}">
      <h3>${n}, ${d.est}${d.nuevo ? ' <em>NUEVA</em>' : ''}</h3>
      <p>${d.txt}</p>
      <dl><dt>Horario</dt><dd>${d.hora}</dd><dt>Teléfono</dt><dd>${SEDES[n].tel}</dd></dl>
      <div class="sede__btns">
        <a class="btn btn--ghost btn--sm" href="${SEDES[n].maps}" target="_blank" rel="noopener">${icon('pin', 16)} Cómo llegar</a>
        <a class="btn btn--yellow btn--sm" href="${waLink('Hola Ferreenergía, quiero información de la sede de ' + n + '.', SEDES[n].wa)}" target="_blank" rel="noopener">${icon('wa', 16)} WhatsApp</a>
      </div></article>`).join('');

  const pts = [[-71.6, 11.8], [-70.2, 12.2], [-69.8, 11.5], [-68.2, 10.7], [-66.5, 10.6], [-64.5, 10.7], [-62.8, 10.7], [-62.0, 10.2], [-61.4, 8.6], [-60.0, 8.5], [-59.8, 8.3], [-60.7, 7.3], [-60.6, 5.2], [-61.4, 5.9], [-62.5, 4.0], [-64.0, 4.1], [-64.5, 3.6], [-64.0, 2.5], [-63.4, 2.4], [-64.0, 1.8], [-65.5, 0.7], [-66.9, 1.2], [-67.4, 2.3], [-67.4, 3.3], [-67.8, 6.2], [-69.4, 6.1], [-70.1, 7.0], [-72.4, 7.4], [-72.0, 9.0], [-72.9, 9.2], [-72.2, 11.0]];
  const P = ([lo, la]) => [((lo + 73.6) * 52 + 20).toFixed(1), ((12.8 - la) * 54).toFixed(1)];
  const sj = P([-67.6, 10.25]), cg = P([-67.5, 8.1]);
  const dot = ([x, y], name) => `<g><circle class="pt-pulse" cx="${x}" cy="${y}" r="14" fill="#FFC800" opacity=".6"/><circle class="pt-pulse" cx="${x}" cy="${y}" r="14" fill="#FFC800" opacity=".6" style="animation-delay:1.1s"/>
    <circle cx="${x}" cy="${y}" r="8" fill="#FFC800" stroke="#0A0A0A" stroke-width="3"/><line x1="${x}" y1="${y}" x2="${+x + 70}" y2="${+y - 34}" stroke="#FFC800" stroke-width="1.5"/>
    <text x="${+x + 76}" y="${+y - 36}" font-family="'Big Shoulders Display Variable',Impact,sans-serif" font-weight="800" font-size="30" fill="#fff" letter-spacing="1">${name.toUpperCase()}</text></g>`;
  let grid = ''; for (let i = 0; i <= 800; i += 50) grid += `<path d="M${i} 0V700M0 ${i}H800" stroke="#fff" stroke-opacity=".06"/>`;
  $('#map').innerHTML = `<g>${grid}</g><path id="map-outline" d="M${pts.map((p) => P(p).join(' ')).join(' L')}Z" fill="rgba(255,200,0,.07)" stroke="#FFC800" stroke-opacity=".55" stroke-width="2" stroke-dasharray="5 6" stroke-linejoin="round"/>${dot(sj, 'San Jacinto')}${dot(cg, 'Camaguán')}`;
}
if ($('#acc')) {
  const faq = [
    ['¿Qué garantía tienen las plantas?', 'Cada equipo tiene el respaldo de nuestro servicio técnico. El tiempo de garantía depende del modelo y te lo confirmamos por escrito al cotizar.'],
    ['¿Cuáles son las formas de pago?', 'Los precios están en dólares. Escríbenos por WhatsApp y te indicamos las formas de pago disponibles.'],
    ['¿Hacen envíos a otros estados?', 'Sí. Despachamos desde San Jacinto y Camaguán a Aragua, los llanos y otras zonas del país. El costo depende del destino y del peso del equipo.'],
    ['¿Instalan la planta?', 'Sí. Nuestro equipo técnico instala el equipo, conecta el ATS si aplica y hace pruebas de carga antes de entregarte todo funcionando.'],
    ['¿Tienen repuestos y mantenimiento?', 'Manejamos repuestos y mantenimiento preventivo para las marcas que distribuimos. Escríbenos con el modelo de tu equipo y te decimos qué hay disponible.'],
  ];
  const acc = $('#acc');
  acc.innerHTML = faq.map(([q, a], i) => `<div class="acc__item">
    <h3><button class="acc__q" type="button" aria-expanded="false" aria-controls="fa${i}" id="fq${i}"><span>${q}</span>${icon('plus', 22)}</button></h3>
    <div class="acc__a" id="fa${i}" role="region" aria-labelledby="fq${i}" hidden><p>${a}</p></div></div>`).join('');
  const closeIt = (b) => {
    const panel = $('#' + b.getAttribute('aria-controls'));
    b.setAttribute('aria-expanded', 'false'); b.closest('.acc__item').classList.remove('is-open');
    if (reduced) { panel.hidden = true; return; }
    gsap.to(panel, { height: 0, duration: 0.35, ease: 'power3.inOut', onComplete: () => { panel.hidden = true; } });
  };
  acc.addEventListener('click', (ev) => {
    const b = ev.target.closest('.acc__q'); if (!b) return;
    const open = b.getAttribute('aria-expanded') === 'true';
    $$('.acc__q', acc).forEach((x) => { if (x !== b && x.getAttribute('aria-expanded') === 'true') closeIt(x); });
    if (open) return closeIt(b);
    const panel = $('#' + b.getAttribute('aria-controls'));
    b.setAttribute('aria-expanded', 'true'); b.closest('.acc__item').classList.add('is-open'); panel.hidden = false;
    reduced ? (panel.style.height = 'auto') : gsap.fromTo(panel, { height: 0 }, { height: 'auto', duration: 0.45, ease: 'power3.out' });
  });
}

// ---- HERO (solo inicio): 3D diferido con fallback estático ----
function hero() {
  const heroEl = $('#inicio'), canvas = $('#hero-canvas'), loader = $('#loader'), copy = $('#hero-copy'), hint = $('#hero-hint');
  const fb = $('#hero-fallback'); fb.innerHTML = siluetaSVG('plantas', { insono: true });
  const hasGL = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; } })();
  const weak = navigator.hardwareConcurrency <= 4 || (navigator.deviceMemory && navigator.deviceMemory <= 4) || !hasGL || reduced;
  const stat = () => { heroEl.classList.add('is-static'); loader.classList.add('is-done'); };
  if (weak) { stat(); return; }
  let api = null;
  const heroST = ScrollTrigger.create({
    trigger: $('.hero__pin'), start: 'top top', end: () => '+=' + Math.round(innerHeight * 2.2), pin: true, scrub: true, anticipatePin: 1,
    onUpdate: (s) => { api?.setProgress(s.progress); const o = 1 - Math.min(1, s.progress * 4); copy.style.opacity = o; copy.style.pointerEvents = o < 0.2 ? 'none' : ''; copy.style.visibility = o < 0.05 ? 'hidden' : ''; hint.style.opacity = o; },
  });
  const start = async () => {
    try {
      const { initHero3D } = await import('./js/hero3d.js');
      api = await initHero3D({ canvas, stage: $('#stage'), labelsEl: $('#labels') });
      canvas.classList.add('is-on'); loader.classList.add('is-done'); api.setProgress(heroST.progress || 0);
    } catch (err) { console.warn('3D no disponible, se muestra imagen estática', err); stat(); ScrollTrigger.refresh(); }
  };
  const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 250));
  if (document.readyState === 'complete') idle(start); else addEventListener('load', () => idle(start), { once: true });
}
addEventListener('load', () => ScrollTrigger.refresh());
