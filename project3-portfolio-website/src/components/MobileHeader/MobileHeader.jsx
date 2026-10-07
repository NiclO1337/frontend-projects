import { useCallback, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { profile } from "../../data/profile.js";
import MobileMenu from "../MobileMenu/MobileMenu.jsx";
import styles from "./MobileHeader.module.css";

const MENU_ID = "mobile-menu";

/**
 * Top bar for tablet and mobile: name (link home) and the menu button.
 * It owns the open/closed state, so the menu closes on any navigation.
 */
export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);

  // Close the menu whenever the route changes (menu links, logo, browser
  // back/forward). `location.key` is new on every navigation, even to the page
  // you are already on, so it catches more than the pathname would. Setting
  // state while rendering is React's recommended way to reset state when
  // something changes: it avoids an extra render with stale state.
  const { key } = useLocation();
  const [previousKey, setPreviousKey] = useState(key);
  if (key !== previousKey) {
    setPreviousKey(key);
    setIsOpen(false);
  }

  // useCallback keeps the same function between renders, so MobileMenu's
  // Escape listener isn't removed and re-added on every render.
  const closeMenu = useCallback(() => {
    setIsOpen(false);
    // Give focus back to the button, so keyboard users don't lose their place.
    buttonRef.current.focus();
  }, []);

  return (
    <>
      <header className={styles.header}>
        <Link to="/" className={styles.name}>
          {profile.name}
        </Link>
        <button
          ref={buttonRef}
          type="button"
          className={styles.button}
          aria-label="Menu"
          aria-expanded={isOpen}
          aria-controls={MENU_ID}
          onClick={() => setIsOpen((open) => !open)}
        >
          {/* Two lines. The CSS turns them into an X while the menu is open. */}
          <span className={styles.line} aria-hidden="true" />
          <span className={styles.line} aria-hidden="true" />
        </button>
      </header>
      {isOpen && <MobileMenu id={MENU_ID} onClose={closeMenu} />}
    </>
  );
}
