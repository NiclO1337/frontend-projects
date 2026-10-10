import { useEffect, useRef } from "react";
import EffectsToggle from "../EffectsToggle/EffectsToggle.jsx";
import NavMenu from "../NavMenu/NavMenu.jsx";
import SocialLinks from "../SocialLinks/SocialLinks.jsx";
import ThemeToggle from "../ThemeToggle/ThemeToggle.jsx";
import styles from "./MobileMenu.module.css";

/**
 * Full-screen menu for tablet and mobile. It is only rendered while open, so
 * everything in here happens "on open" and is undone when it unmounts.
 * @param {object} props
 * @param {string} props.id id the menu button points to with aria-controls
 * @param {() => void} props.onClose asks the parent to close the menu
 *   (Escape or a click outside the links and buttons)
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

  // A click anywhere except on a button dismisses the menu. That includes
  // links: onClose gives focus back to the menu button, so it isn't lost when
  // the menu disappears. (Clicking the link of the page you are already on
  // changes nothing else that would move focus. On another page, useRouteFocus
  // then moves focus on to the new <h1>.) Buttons (the toggles) keep the menu
  // open. Keyboard users also have Escape and the menu button.
  function handleClick(event) {
    if (!event.target.closest("button")) onClose();
  }

  return (
    <div id={id} ref={menuRef} className={styles.menu} onClick={handleClick}>
      <NavMenu />
      <div className={styles.controls}>
        <SocialLinks />
        <div className={styles.toggles}>
          <ThemeToggle />
          <EffectsToggle />
        </div>
      </div>
    </div>
  );
}
