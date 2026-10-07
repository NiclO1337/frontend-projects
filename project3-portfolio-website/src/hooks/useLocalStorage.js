import { useEffect, useState } from "react";

/**
 * Like useState, but the value is also saved in localStorage, so it survives
 * a page reload. Values are stored as JSON.
 * @param {string} key name to save under
 * @param {*} initialValue used when nothing (or something unreadable) is saved
 * @returns {[*, Function]} the same pair as useState
 */
export default function useLocalStorage(key, initialValue) {
  // Passing a function to useState means it runs only on the first render,
  // so we don't read localStorage again on every render.
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved === null ? initialValue : JSON.parse(saved);
    } catch {
      // Bad JSON, or storage is blocked (e.g. private mode).
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage is blocked or full: the value still works, it just won't be saved.
    }
  }, [key, value]);

  return [value, setValue];
}
