import { Link } from "react-router";
import NavMenu from "../NavMenu/NavMenu.jsx";
import styles from "./Sidebar.module.css";

/**
 * Left column of the split layout: name, title, tagline and navigation.
 * It's a <header> (banner landmark). The name is a link home, not the page <h1>.
 */
export default function Sidebar() {
  return (
    <header className={styles.sidebar}>
      <div className={styles.intro}>
        <Link to="/" className={styles.name}>
          Niclas Hugdahl
        </Link>
        <p className={styles.title}>Junior Fullstack Software Developer</p>
        <p className={styles.tagline}>
          I build practical, accessible web apps.
        </p>
      </div>
      <NavMenu />
    </header>
  );
}
