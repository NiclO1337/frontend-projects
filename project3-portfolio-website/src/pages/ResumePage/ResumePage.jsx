import { FaDownload } from "react-icons/fa6";
import Button from "../../components/Button/Button.jsx";
import Reveal from "../../components/Reveal/Reveal.jsx";
import Timeline from "../../components/Timeline/Timeline.jsx";
import { education } from "../../data/education.js";
import { experience } from "../../data/experience.js";
import { profile } from "../../data/profile.js";
import styles from "./ResumePage.module.css";

export default function ResumePage() {
  return (
    <>
      <title>Resume – Niclas Hugdahl</title>
      <meta
        name="description"
        content="Work experience and education of Niclas Hugdahl, with a downloadable CV."
      />

      <div className={styles.header}>
        <h1>Resume</h1>
        <Button href={profile.cvPath} download>
          <FaDownload aria-hidden="true" />
          Download CV
        </Button>
      </div>

      <h2 className={styles.sectionHeading}>Experience</h2>
      <Reveal>
        <Timeline entries={experience} />
      </Reveal>

      <h2 className={styles.sectionHeading}>Education</h2>
      <Reveal>
        <Timeline entries={education} />
      </Reveal>
    </>
  );
}
