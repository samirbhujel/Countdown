
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment';

export default defineConfig({
  plugins: [
    react(),
    EnvironmentPlugin(['API_KEY'])
  ],
  base: './', // Ensures assets are loaded correctly on GitHub Pages subpaths
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
});
