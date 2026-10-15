import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // The single JS file is about 540 kB (178 kB gzipped), almost all of it
    // React, React Router and Motion. The site is small enough that splitting
    // it would cost more than it saves, so the default 500 kB warning is raised.
    chunkSizeWarningLimit: 600,
  },
  test: {
    // jsdom is a fake browser (document, window) that runs inside Node.
    environment: "jsdom",
    // describe/it/expect/vi are available without imports. Testing Library
    // also needs this to clean up the rendered DOM after every test.
    globals: true,
    setupFiles: "./src/test/setup.js",
  },
});
