import styles from "./BentoTile.module.css";

/**
 * One card in a BentoGrid.
 * @param {object} props
 * @param {string} [props.title] small heading shown at the top
 * @param {2 | 3} [props.headingLevel] which heading level the title is, so the
 *   page outline stays in order (<h2> directly under the <h1>, <h3> under a
 *   section <h2>)
 * @param {"wide" | "tall" | "large"} [props.size] cells covered on tablet and
 *   desktop: wide = 2 across, tall = 2 down, large = both. Default is 1 cell.
 *   On mobile every tile is one cell.
 * @param {React.ReactNode} props.children tile content
 */
export default function BentoTile({ title, headingLevel = 2, size, children }) {
  const className = `${styles.tile} ${size ? styles[size] : ""}`;
  // A variable that starts with a capital letter can be used as a JSX tag.
  const Heading = `h${headingLevel}`;

  return (
    <div className={className}>
      {title && <Heading className={styles.title}>{title}</Heading>}
      {children}
    </div>
  );
}
