import { useId } from "react";
import { toSlug } from "../../utils/toSlug.js";
import styles from "./ProjectFilter.module.css";

/**
 * A row of chips for choosing one technology, plus "All". It only shows the
 * choice and reports clicks: the parent decides where the choice is stored
 * (the Projects page keeps it in the URL).
 * @param {object} props
 * @param {string[]} props.technologies names to show as chips, e.g. ["React"]
 * @param {string | null} props.selected slug of the chosen technology
 *   ("next-js"), or null when "All" is chosen
 * @param {(slug: string | null) => void} props.onChange called with the slug
 *   of the clicked chip, or null for "All"
 */
export default function ProjectFilter({ technologies, selected, onChange }) {
  // useId gives this component instance an id that is unique on the page, so
  // the group can point at its label with aria-labelledby.
  const labelId = useId();

  return (
    <div role="group" aria-labelledby={labelId} className={styles.filter}>
      <p id={labelId} className={styles.label}>
        Filter by technology
      </p>
      <div className={styles.chips}>
        <button
          type="button"
          className={styles.chip}
          aria-pressed={selected === null}
          onClick={() => onChange(null)}
        >
          All
        </button>
        {technologies.map((name) => {
          const slug = toSlug(name);
          return (
            <button
              key={slug}
              type="button"
              className={styles.chip}
              aria-pressed={selected === slug}
              onClick={() => onChange(slug)}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
