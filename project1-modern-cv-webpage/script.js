// Theme toggle: switches between light and dark mode.
// The colours themselves live in style.css. This script only sets
// data-theme on <html>, remembers the choice, and updates the button.

const STORAGE_KEY = "theme";
const root = document.documentElement;
const button = document.querySelector(".theme-toggle");
const icon = button.querySelector("i");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

// The theme that is showing right now: the visitor's choice if there is one,
// otherwise whatever the operating system prefers.
function getTheme() {
  return root.dataset.theme || (prefersDark.matches ? "dark" : "light");
}

// Show the icon and labels for the *next* action: in dark mode the button
// offers a sun (switch to light), in light mode it offers a moon.
function updateButton(theme) {
  const isDark = theme === "dark";
  icon.classList.toggle("fa-moon", !isDark);
  icon.classList.toggle("fa-sun", isDark);
  button.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode"
  );
  button.setAttribute("aria-pressed", String(isDark));
}

function setTheme(theme) {
  root.dataset.theme = theme;
  updateButton(theme);
  // localStorage can be blocked (e.g. private browsing), so don't crash if it is
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // The theme still changes for this visit, it just won't be remembered
  }
}

// On load: apply a saved choice if there is one. Without one we set nothing,
// and the CSS follows the operating system on its own.
let saved = null;
try {
  saved = localStorage.getItem(STORAGE_KEY);
} catch {
  // Ignore: treat it as "nothing saved"
}
if (saved === "light" || saved === "dark") {
  root.dataset.theme = saved;
}
updateButton(getTheme());

button.addEventListener("click", () => {
  setTheme(getTheme() === "dark" ? "light" : "dark");
});

// If the OS theme changes while the page is open (and the visitor hasn't
// chosen), keep the button in step with what the CSS is showing.
prefersDark.addEventListener("change", () => {
  updateButton(getTheme());
});
