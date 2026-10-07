import { createContext, useContext } from "react";

// Context lets any component read the theme without passing it down through
// props at every level ("prop drilling"). `null` means "no provider above".
// The provider component lives in ThemeProvider.jsx: Fast Refresh needs files
// that export components to export nothing else.
export const ThemeContext = createContext(null);

/** Returns `{ theme, toggleTheme }`. Only works inside a ThemeProvider. */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useTheme must be used inside a <ThemeProvider>");
  }
  return context;
}
