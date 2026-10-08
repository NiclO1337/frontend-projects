import { Link } from "react-router";
import { profile } from "../../data/profile.js";
import EffectsToggle from "../EffectsToggle/EffectsToggle.jsx";
import NavMenu from "../NavMenu/NavMenu.jsx";
import SocialLinks from "../SocialLinks/SocialLinks.jsx";
import ThemeToggle from "../ThemeToggle/ThemeToggle.jsx";
import styles from "./Sidebar.module.css";

/**
 * Left column of the split layout: name, title, tagline, navigation, social
 * links and toggles.
 * It's a <header> (banner landmark). The name is a link home, not the page <h1>.
 */
export default function Sidebar() {
  return (
    <header className={styles.sidebar}>
      <div className={styles.intro}>
        <Link to="/" className={styles.name}>
          {profile.name}
        </Link>
        <p className={styles.title}>{profile.title}</p>
        <p className={styles.tagline}>{profile.tagline}</p>
      </div>
      <NavMenu />
      <div className={styles.controls}>
        <SocialLinks />
        <div className={styles.toggles}>
          <ThemeToggle />
          <EffectsToggle />
        </div>
      </div>
    </header>
  );
}
