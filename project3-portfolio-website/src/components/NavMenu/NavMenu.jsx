import { NavLink } from "react-router";
import styles from "./NavMenu.module.css";

// Home is not listed: the name in the sidebar is the link to "/".
const links = [
  { to: "/about", label: "About" },
  { to: "/resume", label: "Resume" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];

/**
 * Main navigation. NavLink adds `aria-current="page"` to the link that matches
 * the current URL, and the CSS styles the active link from that attribute.
 * @param {object} props
 * @param {() => void} [props.onNavigate] called when a link is clicked
 *   (the mobile menu uses it to close itself)
 */
export default function NavMenu({ onNavigate }) {
  return (
    <nav aria-label="Main">
      <ul className={styles.list}>
        {links.map(({ to, label }, index) => (
          <li key={to}>
            <NavLink to={to} className={styles.link} onClick={onNavigate}>
              {/* Decorative number and line: hidden from screen readers. */}
              <span className={styles.number} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}.
              </span>
              <span className={styles.line} aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
