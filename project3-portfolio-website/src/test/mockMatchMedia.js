// jsdom has no real matchMedia (see setup.js, where nothing matches). This
// replaces it with a version a test can control: say which queries match, and
// change them later to simulate the visitor changing a setting.
// The replacement is removed again by vi.unstubAllGlobals(), so call that in
// afterEach in any test file that uses this.

/**
 * @param {Record<string, boolean>} [initial] which queries match, by exact query text
 * @returns {{ set: (query: string, matches: boolean) => void }} `set` changes
 *   whether a query matches and tells everything that is listening (wrap it
 *   in act() when a component is on screen)
 */
export function mockMatchMedia(initial = {}) {
  const matching = { ...initial };
  const listeners = new Map();

  vi.stubGlobal("matchMedia", (query) => ({
    get matches() {
      return Boolean(matching[query]);
    },
    media: query,
    addEventListener(_type, listener) {
      if (!listeners.has(query)) listeners.set(query, new Set());
      listeners.get(query).add(listener);
    },
    removeEventListener(_type, listener) {
      listeners.get(query)?.delete(listener);
    },
  }));

  return {
    set(query, matches) {
      matching[query] = matches;
      listeners.get(query)?.forEach((listener) => listener());
    },
  };
}
