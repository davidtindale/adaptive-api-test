import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 6600,
  },
  build: {
    target: 'chrome79',  // transpiles away optional chaining to suit this old browser
    cssCodeSplit: false,
  },
  assetsInclude: [
    "**/*.glb",
  ]
})
