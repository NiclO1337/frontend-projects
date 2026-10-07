import { profile } from "../../data/profile.js";
import styles from "./SocialLinks.module.css";

/** Round icon links to the profiles in `profile.social` (GitHub, LinkedIn). */
export default function SocialLinks() {
  return (
    <ul className={styles.list}>
      {profile.social.map(({ id, name, url, icon: Icon }) => (
        <li key={id}>
          {/* rel="noopener noreferrer": the new tab can't access this page. */}
          <a
            href={url}
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} (opens in a new tab)`}
          >
            <Icon aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
