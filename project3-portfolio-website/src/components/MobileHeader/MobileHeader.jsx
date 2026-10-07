import { useCallback, useRef, useState } from "react";
import { Link } from "react-router";
import { FaBars, FaXmark } from "react-icons/fa6";
import MobileMenu from "../MobileMenu/MobileMenu.jsx";
import styles from "./MobileHeader.module.css";

const MENU_ID = "mobile-menu";

/**
 * Top bar for tablet and mobile: name (link home) and the menu button.
 * It owns the open/closed state, so the logo link can close the menu too.
 */
export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);

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
        <Link to="/" className={styles.name} onClick={() => setIsOpen(false)}>
          Niclas Hugdahl
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
          {isOpen ? (
            <FaXmark aria-hidden="true" />
          ) : (
            <FaBars aria-hidden="true" />
          )}
        </button>
      </header>
      {isOpen && <MobileMenu id={MENU_ID} onClose={closeMenu} />}
    </>
  );
}
