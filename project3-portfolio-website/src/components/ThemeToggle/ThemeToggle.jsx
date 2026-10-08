import { FaMoon, FaSun } from "react-icons/fa6";
import { useTheme } from "../../context/ThemeContext.js";

/**
 * Switches between the dark and light theme. The label stays "Dark mode" and
 * `aria-pressed` says whether it is on. (If the label changed too, screen
 * readers would announce something contradictory like "Switch to light mode,
 * pressed".)
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="round-control"
      aria-label="Dark mode"
      aria-pressed={isDark}
      onClick={toggleTheme}
    >
      {isDark ? <FaMoon aria-hidden="true" /> : <FaSun aria-hidden="true" />}
    </button>
  );
}
