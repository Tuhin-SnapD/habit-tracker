import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isTauri = !!process.env.TAURI_ENV_PLATFORM;
const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 5173,
    strictPort: true,
    host: host || false,
    open: !isTauri,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
});
