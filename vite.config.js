import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const page = (f) => fileURLToPath(new URL(f, import.meta.url));

// `base` = nombre del repo para GitHub Pages (https://aguilarzrw.github.io/ferreenergia-web/)
export default defineConfig({
  base: '/ferreenergia-web/',
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      input: { main: page('index.html'), catalogo: page('catalogo.html'), calculadora: page('calculadora.html'), servicios: page('servicios.html'), sedes: page('sedes.html') },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/gsap')) return 'gsap';
        },
      },
    },
  },
});
