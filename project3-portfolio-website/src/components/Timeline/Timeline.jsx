import TimelineItem from "../TimelineItem/TimelineItem.jsx";
import styles from "./Timeline.module.css";

/**
 * An ordered list of entries (the order in the data is the order shown, so
 * keep the newest first). It's an <ol> because the order carries meaning.
 * @param {object} props
 * @param {object[]} props.entries items from experience.js or education.js
 */
export default function Timeline({ entries }) {
  return (
    <ol className={styles.timeline}>
      {entries.map((entry) => (
        <TimelineItem
          key={entry.id}
          title={entry.title}
          organisation={entry.organisation}
          location={entry.location}
          start={entry.start}
          end={entry.end}
          bullets={entry.bullets}
        />
      ))}
    </ol>
  );
}
