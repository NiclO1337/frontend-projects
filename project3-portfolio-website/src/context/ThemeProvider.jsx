import { useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage.js";
import { ThemeContext } from "./ThemeContext.js";

/**
 * Holds the theme ("dark" or "light") for the whole app. Wrap the app in it.
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage("theme", "dark");

  // The CSS tokens switch colours on <html data-theme="...">. That element
  // lives outside React, so an effect keeps it in sync with the state.
  // (index.html sets it earlier, before React loads, to avoid a flash.)
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  // React 19: the context object can be used as the provider directly.
  return <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>;
}
