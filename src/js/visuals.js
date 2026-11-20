// Siluetas de producto (placeholder limpio mientras no hay fotos reales) e íconos de la calculadora.

const Y = '#FFC800', K = '#0A0A0A', G = '#2b2b2b';

export function siluetaSVG(tipo = 'plantas', opts = {}) {
  const { insono = false, label = '' } = opts;
  const bolt = `<path d="M178 70 L160 112 H174 L166 150 L194 100 H179 L188 70Z" fill="#E10600" stroke="${K}" stroke-width="2" stroke-linejoin="round"/>`;
  let body = '';
  if (tipo === 'plantas') {
    body = `
      <ellipse cx="200" cy="228" rx="150" ry="9" fill="#000" opacity=".5"/>
      <rect x="62" y="196" width="276" height="14" rx="4" fill="${G}"/>
      <rect x="70" y="84" width="260" height="114" rx="14" fill="${Y}"/>
      <rect x="70" y="84" width="260" height="22" rx="14" fill="#ffd94d" opacity=".55"/>
      <g fill="${K}" opacity=".85">${[0, 1, 2, 3, 4].map((i) => `<rect x="82" y="${112 + i * 14}" width="62" height="6" rx="3"/>`).join('')}</g>
      <rect x="236" y="104" width="76" height="52" rx="6" fill="${K}"/>
      <rect x="244" y="112" width="34" height="20" rx="3" fill="#1c3b2a"/><rect x="246" y="114" width="30" height="3" fill="#7CFFB0" opacity=".8"/>
      <circle cx="292" cy="122" r="5" fill="#E10600"/><circle cx="304" cy="122" r="5" fill="${Y}"/>
      <rect x="244" y="138" width="60" height="6" rx="2" fill="#333"/>
      <g transform="translate(-6 0)">${bolt}</g>
      ${insono ? `<rect x="160" y="170" width="70" height="12" rx="3" fill="${K}"/><text x="195" y="180" font-family="Impact,Arial Black,sans-serif" font-size="9" text-anchor="middle" fill="${Y}" letter-spacing="1">EUROPOWER</text>` : ''}
      <circle cx="96" cy="216" r="13" fill="#161616" stroke="#3a3a3a" stroke-width="3"/><circle cx="96" cy="216" r="4" fill="#777"/>
      <circle cx="304" cy="216" r="13" fill="#161616" stroke="#3a3a3a" stroke-width="3"/><circle cx="304" cy="216" r="4" fill="#777"/>`;
  } else if (tipo === 'agro') {
    body = `
      <ellipse cx="200" cy="228" rx="140" ry="8" fill="#000" opacity=".5"/>
      <rect x="150" y="70" width="14" height="150" rx="6" fill="${G}" transform="rotate(-30 150 150)"/>
      <rect x="90" y="110" width="110" height="64" rx="12" fill="${Y}"/>
      <circle cx="146" cy="142" r="22" fill="${K}"/><circle cx="146" cy="142" r="9" fill="#E10600"/>
      <rect x="196" y="126" width="100" height="14" rx="6" fill="${G}"/>
      <circle cx="300" cy="196" r="30" fill="#161616" stroke="${Y}" stroke-width="4"/><circle cx="300" cy="196" r="8" fill="${Y}"/>`;
  } else {
    body = `
      <ellipse cx="200" cy="228" rx="110" ry="8" fill="#000" opacity=".5"/>
      <rect x="130" y="70" width="140" height="150" rx="18" fill="${Y}"/>
      <rect x="146" y="88" width="108" height="30" rx="6" fill="${K}"/>
      <g fill="${K}" opacity=".85"><rect x="146" y="134" width="108" height="6" rx="3"/><rect x="146" y="150" width="108" height="6" rx="3"/><rect x="146" y="166" width="108" height="6" rx="3"/></g>
      <g transform="translate(-48 10)">${bolt}</g>`;
  }
  const t = label ? `<text x="200" y="22" font-family="ui-monospace,Consolas,monospace" font-size="11" text-anchor="middle" fill="#8a8a8a" letter-spacing="2">${label}</text>` : '';
  return `<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" focusable="false">${t}${body}</svg>`;
}

const S = 'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';
const ICONS = {
  fridge: '<rect x="6" y="2.5" width="12" height="19" rx="2"/><path d="M6 10h12M9 5.5v2M9 13v3"/>',
  freezer: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M3 11h18M12 2.5v3M10 4l2 1.5L14 4"/>',
  ac: '<rect x="2.5" y="5" width="19" height="8" rx="2"/><path d="M6 16.5c0 1.2-.8 1.5-.8 2.7M12 16.5c0 1.2-.8 1.5-.8 2.7M18 16.5c0 1.2-.8 1.5-.8 2.7M6 9h6"/>',
  pump: '<circle cx="9" cy="14" r="5"/><path d="M14 14h6v-4M9 9V5h4M5 21h8"/>',
  tv: '<rect x="2.5" y="4.5" width="19" height="12.5" rx="2"/><path d="M8 21h8M12 17v4"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2v.1h5v-.1c0-.8.4-1.500 1-2A6 6 0 0 0 12 3Z"/>',
  pc: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  router: '<rect x="3" y="13" width="18" height="6" rx="2"/><path d="M7 16h.01M11 16h.01M8 9.500a5.500 5.500 0 0 1 8 0M5.500 7a9 9 0 0 1 13 0"/>',
  washer: '<rect x="4" y="2.500" width="16" height="19" rx="2"/><circle cx="12" cy="13.500" r="4.500"/><path d="M7.500 6h.01M10.500 6h.01"/>',
  micro: '<rect x="2.500" y="5.500" width="19" height="13" rx="2"/><rect x="5.500" y="8.500" width="9" height="7" rx="1"/><path d="M18 9v.01M18 12h.01M18 15h.01"/>',
  fan: '<circle cx="12" cy="12" r="1.800"/><path d="M12 10.200C12 6 10 3.500 7.500 4.500S6 9 10.300 11M13.800 12c4.200 0 6.700 2 5.700 4.500S15 18 13 13.700M12 13.800c0 4.200 2 6.700 4.500 5.700S18 15 13.700 13.100"/>',
  motor: '<circle cx="12" cy="12" r="4"/><path d="M12 2.500v3M12 18.500v3M2.500 12h3M18.500 12h3M5.300 5.300l2.100 2.100M16.600 16.600l2.100 2.100M5.300 18.700l2.100-2.100M16.600 7.400l2.100-2.100"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
  wrench: '<path d="M14.700 6.300a4 4 0 0 0 5 5L21 13l-3 3-1.500-1.500-8.700 8.700a2 2 0 0 1-2.800-2.800l8.700-8.700L12 10.500l-1.700-1.700 3-3Z"/>',
  truck: '<path d="M2 6h12v10H2zM14 9h4l4 4v3h-8"/><circle cx="6.500" cy="17.500" r="2"/><circle cx="17.500" cy="17.500" r="2"/>',
  chat: '<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9.500h8M8 12.500h5"/>',
  pin: '<path d="M12 21s7-6.200 7-11.500a7 7 0 0 0-14 0C5 14.800 12 21 12 21Z"/><circle cx="12" cy="9.500" r="2.500"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  check: '<path d="m5 12.500 4.500 4.500L19 7.500"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  wa: '<path d="M3.500 20.500 5 15.500A8.500 8.500 0 1 1 8.500 19l-5 1.500Z"/><path d="M9 8.500c0 3 2.500 6 6 6.500l1.200-1.500-2-1-1 .8c-1-.4-1.800-1.200-2.200-2.200l.8-1-1-2L9 8.500Z"/>',
  ig: '<rect x="3.500" y="3.500" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17 7h.01"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  plan: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
  box: '<path d="M3 7.500 12 3l9 4.500v9L12 21l-9-4.500v-9Z"/><path d="M3 7.500 12 12l9-4.500M12 12v9"/>',
  search: '<circle cx="11" cy="11" r="6.500"/><path d="m20 20-4.500-4.500"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  swap: '<path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>',
};

export const icon = (name, size = 24, cls = '') =>
  `<svg class="ico ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" ${S} aria-hidden="true" focusable="false">${ICONS[name] || ''}</svg>`;
