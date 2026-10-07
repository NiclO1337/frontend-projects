import styles from "./SkipLink.module.css";

/**
 * First thing a keyboard user reaches with Tab. It jumps past the navigation
 * straight to <main id="main">, so they don't have to tab through every link
 * on every page. Invisible until it has focus.
 */
export default function SkipLink() {
  return (
    <a href="#main" className={styles.skipLink}>
      Skip to main content
    </a>
  );
}
