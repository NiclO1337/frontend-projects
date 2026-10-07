import { profile } from "../../data/profile.js";
import SocialLinks from "../SocialLinks/SocialLinks.jsx";
import styles from "./Footer.module.css";

/**
 * Bottom of the content column. The year is read when the page renders.
 * Social links are shown on small screens only: on desktop the sidebar has them.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.social}>
        <SocialLinks />
      </div>
      <p>
        Designed &amp; built by {profile.name} · React + Vite · &copy; {year}
      </p>
    </footer>
  );
}
