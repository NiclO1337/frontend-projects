import { useCallback, useSyncExternalStore } from "react";

/**
 * Tells whether a CSS media query currently matches, and re-renders the
 * component when that changes (for example when the visitor turns on
 * "reduce motion" in their system settings).
 *
 * The browser is an "external store": it holds state outside React.
 * useSyncExternalStore is React's tool for reading such state safely. It
 * takes a function to subscribe to changes, and one to read the current value.
 * @param {string} query a media query, like "(prefers-reduced-motion: reduce)"
 * @returns {boolean}
 */
export default function useMediaQuery(query) {
  // useCallback keeps the same function for the same query, so React doesn't
  // unsubscribe and subscribe again on every render.
  const subscribe = useCallback(
    (onChange) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener("change", onChange);
      return () => mediaQueryList.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
  );
}
