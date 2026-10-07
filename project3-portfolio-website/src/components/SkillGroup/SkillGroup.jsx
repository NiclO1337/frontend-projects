import BentoTile from "../BentoTile/BentoTile.jsx";
import styles from "./SkillGroup.module.css";

/**
 * One group of skills (like "Frameworks") as a bento tile: the group name and
 * a wrapping row of chips, each with its icon. Skills are plain items, not
 * progress bars, because a percentage says little about real skill level.
 * @param {object} props
 * @param {string} props.name group name, shown as the tile's <h3>
 * @param {{ name: string, icon: React.ComponentType }[]} props.items skills
 */
export default function SkillGroup({ name, items }) {
  return (
    <BentoTile title={name} headingLevel={3}>
      <ul className={styles.list}>
        {items.map(({ name: skill, icon: Icon }) => (
          <li key={skill} className={styles.item}>
            <Icon className={styles.icon} aria-hidden="true" />
            {skill}
          </li>
        ))}
      </ul>
    </BentoTile>
  );
}
