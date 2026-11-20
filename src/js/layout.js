// Navbar, menú móvil, footer, botón de WhatsApp y diálogos compartidos por todas las páginas.
import { icon } from './visuals.js';
import { waLink, WA } from './config.js';

export const BASE = import.meta.env.BASE_URL;
export const PAGES = [
  ['catalogo.html', 'Catálogo'],
  ['calculadora.html', 'Calculadora'],
  ['servicios.html', 'Servicios'],
  ['sedes.html', 'Sedes y contacto'],
];

export function mountLayout() {
  const page = document.body.dataset.page || '';
  const cur = (href) => (href.startsWith(page + '.') ? ' aria-current="page"' : '');
  const msg = 'Hola Ferreenergía, quiero información sobre plantas eléctricas.';

  document.body.insertAdjacentHTML('afterbegin', `
  <header class="nav" id="nav">
    <div class="nav__bar">
      <a class="nav__brand" href="${BASE}" aria-label="Ferreenergía VE, inicio"><img src="${BASE}img/logo.svg" width="36" height="36" alt="" /><span>FERRE<b>ENERGÍA</b></span></a>
      <nav class="nav__links" aria-label="Principal">${PAGES.map(([h, t]) => `<a href="${BASE}${h}"${cur(h)}>${t}</a>`).join('')}</nav>
      <a class="btn btn--sm btn--yellow nav__cta" href="${waLink(msg)}" target="_blank" rel="noopener">${icon('wa', 18)} WhatsApp</a>
      <button class="nav__burger" id="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Abrir menú"><span></span><span></span></button>
    </div>
  </header>
  <div class="menu" id="menu" hidden>
    <nav aria-label="Menú móvil">${PAGES.map(([h, t], i) => `<a href="${BASE}${h}"${cur(h)}><i>0${i + 1}</i>${t}</a>`).join('')}</nav>
    <a class="btn btn--yellow btn--lg" href="${waLink(msg)}" target="_blank" rel="noopener">${icon('wa', 20)} Escríbenos por WhatsApp</a>
  </div>`);

  document.body.insertAdjacentHTML('beforeend', `
  <footer class="foot">
    <div class="wrap foot__grid">
      <div class="foot__brand"><img src="${BASE}img/logo.svg" width="56" height="56" alt="Inversiones Ferre Energía" loading="lazy" />
        <p>Plantas eléctricas, maquinaria agrícola y servicio técnico en Aragua y Guárico.</p></div>
      <div><h4>Contacto</h4>
        <a href="${waLink(msg, WA.principal)}" target="_blank" rel="noopener">0424-354-6663</a>
        <a href="${waLink(msg, WA.secundario)}" target="_blank" rel="noopener">0424-306-9546</a>
        <a href="https://www.instagram.com/ferrenergia2020/" target="_blank" rel="noopener">@ferrenergia2020</a></div>
      <div><h4>Sedes</h4><p>San Jacinto, Aragua<br />Camaguán, Guárico <em class="new">Nueva</em></p></div>
      <div><h4>Explora</h4>${PAGES.map(([h, t]) => `<a href="${BASE}${h}">${t}</a>`).join('')}</div>
    </div>
    <div class="wrap foot__legal"><small>© ${new Date().getFullYear()} Inversiones Ferre Energía. Propuesta de diseño.</small>
      <small>Diseño y desarrollo: <a href="https://aguilarzrw.github.io/portafolio-web/" target="_blank" rel="noopener">aguidev</a></small></div>
  </footer>
  <a class="wa-float" id="wa-float" href="${waLink(msg)}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">${icon('wa', 26)}</a>
  <dialog class="dlg" id="product-dialog" aria-labelledby="pd-title"></dialog>
  <dialog class="dlg dlg--wide" id="compare-dialog" aria-labelledby="cd-title"></dialog>
  ${page === 'catalogo' ? '<div class="cmp-tray" id="cmp-tray" hidden><span id="cmp-count">0 de 3 plantas</span><button class="btn btn--yellow btn--sm" id="cmp-open" type="button">Comparar</button><button class="link-btn" id="cmp-clear" type="button">Limpiar</button></div>' : ''}`);

  document.querySelectorAll('[data-icon]').forEach((el) => { el.innerHTML = icon(el.dataset.icon, +el.dataset.size || 20); });
  document.querySelectorAll('[data-wa]').forEach((a) => {
    a.href = waLink(a.dataset.wa, WA[a.dataset.num || 'principal']); a.target = '_blank'; a.rel = 'noopener';
  });
}
