import { defineConfig } from 'vite';
export default defineConfig({base:'./',server:{allowedHosts:['terminal.local']},build:{rollupOptions:{input:{main:'index.html',analysis:'analysis.html',panorama:'panorama.html',design:'design-system.html'}}}});
