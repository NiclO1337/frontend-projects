import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // jsdom is a fake browser (document, window) that runs inside Node.
    environment: "jsdom",
    // describe/it/expect/vi are available without imports. Testing Library
    // also needs this to clean up the rendered DOM after every test.
    globals: true,
    setupFiles: "./src/test/setup.js",
  },
});
