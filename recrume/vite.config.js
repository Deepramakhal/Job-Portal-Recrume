import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import history from 'connect-history-api-fallback';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/admin': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    },
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '9f2e-2405-201-8028-70-b935-5c8f-a151-fce7.ngrok-free.app'
    ],
    middlewareMode: false, // Keep this false to retain default Vite dev server
    setup: (server) => {
      server.middlewares.use(
        history({
          disableDotRule: true,
          htmlAcceptHeaders: ['text/html', 'application/xhtml+xml']
        })
      );
    }
  },
  
});
