import { profile } from "../../data/profile.js";
import styles from "./Footer.module.css";

/** Bottom of the content column. The year is read when the page renders. */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>
        Designed &amp; built by {profile.name} using Claude · &copy;&nbsp;{year}
      </p>
    </footer>
  );
}
