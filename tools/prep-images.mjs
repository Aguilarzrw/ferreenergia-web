// Recorta/optimiza fotos descargadas del Instagram del cliente (carpeta raw/, fuera de git) a WebP.
import sharp from 'sharp'; import { mkdirSync } from 'node:fs';
mkdirSync('public/img/productos', { recursive: true }); mkdirSync('public/img/trabajos', { recursive: true });
const P = 'public/img/productos/', T = 'public/img/trabajos/';
const jobs = [
  ['raw/p03.webp', P + 'europower-dg15000se-1.webp', { left: 10, top: 185, width: 370, height: 285 }],
  ['raw/p03.webp', P + 'europower-dg15000se-2.webp', null],
  ['raw/p05.webp', P + 'europower-em3800-1.webp', { left: 25, top: 150, width: 440, height: 290 }],
  ['raw/p10.webp', P + 'generador-dual-12000w-1.webp', { left: 140, top: 200, width: 420, height: 310 }],
  ['raw/p09.webp', P + 'generador-3500w-1.webp', { left: 130, top: 190, width: 380, height: 260 }],
  ['raw/p12.webp', P + 'generador-klox-3500w-1.webp', { left: 200, top: 300, width: 380, height: 290 }],
  ['raw/p07.webp', P + 'agg-1.webp', { left: 15, top: 166, width: 485, height: 154 }],
  ['raw/p02.jpg', T + 'despacho.webp', null], ['raw/p04.jpg', T + 'camaguan.webp', null],
  ['raw/p10.webp', T + 'showroom-1.webp', null], ['raw/p12.webp', T + 'showroom-2.webp', null], ['raw/p09.webp', T + 'showroom-3.webp', null],
];
for (const [src, out, c] of jobs) {
  let s = sharp(src); if (c) s = s.extract(c);
  await s.resize({ width: 720, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out);
}
const tiles = [];
for (const [i, j] of jobs.slice(0, 7).entries()) tiles.push({ input: await sharp(j[1]).resize(300, 240, { fit: 'contain', background: '#222' }).toBuffer(), left: (i % 4) * 300, top: Math.floor(i / 4) * 240 });
await sharp({ create: { width: 1200, height: 480, channels: 3, background: '#000' } }).composite(tiles).jpeg().toFile('raw/crops.jpg');
