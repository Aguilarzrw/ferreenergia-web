// Genera og.png (1200x630) y apple-touch-icon.png a partir del logo provisional. Uso: npm run assets
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const logo = readFileSync('public/img/logo.svg');
const bolt = '<path d="M740 90 L600 330 H690 L640 540 L840 270 H745 L810 90Z" fill="#E10600" opacity=".95"/>';
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0A0A0A"/>
  <g stroke="#fff" stroke-opacity=".06">${Array.from({ length: 24 }, (_, i) => `<path d="M${i * 56} 0V630M0 ${i * 56}H1200"/>`).join('')}</g>
  <rect x="0" y="600" width="1200" height="30" fill="#FFC800"/>
  ${bolt}
  <rect x="640" y="250" width="440" height="200" rx="28" fill="#FFC800"/>
  <rect x="670" y="280" width="140" height="140" rx="10" fill="#0A0A0A" opacity=".85"/>
  <text x="70" y="330" font-family="Impact, Arial Black, sans-serif" font-size="120" fill="#fff">QUE EL APAGÓN</text>
  <text x="70" y="450" font-family="Impact, Arial Black, sans-serif" font-size="120" fill="#FFC800">NO TE PARE</text>
  <text x="70" y="525" font-family="Arial, sans-serif" font-size="34" fill="#cfcfc8">Plantas eléctricas Europower · Aragua y Guárico</text>
</svg>`;
const logoPng = await sharp(logo, { density: 300 }).resize(180, 180).png().toBuffer();
await sharp(Buffer.from(og)).composite([{ input: logoPng, left: 70, top: 70 }]).png().toFile('public/og.png');
await sharp(logo, { density: 300 }).resize(180, 180).png().toFile('public/apple-touch-icon.png');
console.log('assets ok');
