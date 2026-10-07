import styles from "./TimelineItem.module.css";

/**
 * One entry in a Timeline: dates, title, organisation and a list of bullets.
 * Renders an <li>, so it must be placed inside the Timeline's <ol>.
 * @param {object} props
 * @param {string} props.title job title or education name, shown as an <h3>
 * @param {string} props.organisation employer or school
 * @param {string} [props.location] shown after the organisation when known
 * @param {number} props.start year it began
 * @param {number | null} props.end year it ended, or null if it is ongoing
 * @param {string[]} props.bullets what to say about it, one list item each
 */
export default function TimelineItem({
  title,
  organisation,
  location,
  start,
  end,
  bullets,
}) {
  return (
    <li className={styles.item}>
      {/* <time> with a machine-readable datetime, as the plan asks. */}
      <p className={styles.dates}>
        <time dateTime={String(start)}>{start}</time> –{" "}
        {end ? <time dateTime={String(end)}>{end}</time> : "Ongoing"}
      </p>
      <div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.place}>
          {organisation}
          {location && ` · ${location}`}
        </p>
        <ul className={styles.bullets}>
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>
    </li>
  );
}
