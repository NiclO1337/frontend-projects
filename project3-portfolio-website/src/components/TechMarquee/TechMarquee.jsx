import { skillGroups } from "../../data/skills.js";
import styles from "./TechMarquee.module.css";

// The marquee shows the technologies and frameworks, taken from the skills data.
const marqueeGroupIds = ["technologies", "frameworks"];
const techItems = skillGroups
  .filter((group) => marqueeGroupIds.includes(group.id))
  .flatMap((group) => group.items);

/**
 * A row of tech icons that scrolls slowly and forever. The list is rendered
 * twice and the track slides left by exactly one list's width, then restarts,
 * so the jump back is invisible. Screen readers skip the second copy.
 */
export default function TechMarquee() {
  return (
    <div className={styles.marquee}>
      <div className={styles.track}>
        {["original", "copy"].map((copy) => (
          <ul
            key={copy}
            className={styles.list}
            aria-hidden={copy === "copy" ? "true" : undefined}
          >
            {techItems.map(({ name, icon: Icon }) => (
              <li key={name} className={styles.item}>
                <Icon className={styles.icon} aria-hidden="true" />
                {name}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
