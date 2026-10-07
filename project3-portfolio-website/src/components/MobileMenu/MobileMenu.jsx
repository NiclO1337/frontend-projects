import { useEffect, useRef } from "react";
import NavMenu from "../NavMenu/NavMenu.jsx";
import styles from "./MobileMenu.module.css";

/**
 * Full-screen menu for tablet and mobile. It is only rendered while open, so
 * everything in here happens "on open" and is undone when it unmounts.
 * @param {object} props
 * @param {string} props.id id the menu button points to with aria-controls
 * @param {() => void} props.onClose asks the parent to close the menu
 */
export default function MobileMenu({ id, onClose }) {
  const menuRef = useRef(null);

  // Effects run after the menu is on screen. Moving focus to the first link
  // lets keyboard and screen reader users start using the menu right away.
  useEffect(() => {
    menuRef.current.querySelector("a").focus();
  }, []);

  // Close on Escape. The cleanup removes the listener when the menu closes,
  // and again before re-adding it if `onClose` ever changes.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div id={id} ref={menuRef} className={styles.menu}>
      <NavMenu onNavigate={onClose} />
    </div>
  );
}
