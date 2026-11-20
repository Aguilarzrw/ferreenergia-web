import { defineConfig } from 'vite';

// `base` = nombre del repo para GitHub Pages (https://aguilarzrw.github.io/ferreenergia-web/)
export default defineConfig({
  base: '/ferreenergia-web/',
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/gsap')) return 'gsap';
        },
      },
    },
  },
});
