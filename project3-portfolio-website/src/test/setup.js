// Runs before every test file (see `setupFiles` in vite.config.js).
import "@testing-library/jest-dom/vitest";

// jsdom has no matchMedia. By default nothing matches, so media-query based
// features (touch, fine pointer, reduced motion) behave as "off" in tests.
window.matchMedia = (query) => ({
  matches: false,
  media: query,
  addEventListener: () => {},
  removeEventListener: () => {},
});

// jsdom has no IntersectionObserver, which Motion's `whileInView` needs.
globalThis.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
};

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});
