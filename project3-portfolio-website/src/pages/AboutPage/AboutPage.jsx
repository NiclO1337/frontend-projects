import SkillGroup from "../../components/SkillGroup/SkillGroup.jsx";
import { profile } from "../../data/profile.js";
import { skillGroups } from "../../data/skills.js";
import styles from "./AboutPage.module.css";

export default function AboutPage() {
  return (
    <>
      <title>About – Niclas Hugdahl</title>
      <meta
        name="description"
        content="About Niclas Hugdahl: background, interests and the technologies he works with."
      />

      <h1>About me</h1>
      <div className={styles.bio}>
        {profile.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <h2 className={styles.skillsHeading}>Skills</h2>
      <div className={styles.skills}>
        {skillGroups.map((group) => (
          <SkillGroup key={group.id} name={group.name} items={group.items} />
        ))}
      </div>
    </>
  );
}
