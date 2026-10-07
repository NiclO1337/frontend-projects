import styles from "./BentoTile.module.css";

/**
 * One card in a BentoGrid.
 * @param {object} props
 * @param {string} [props.title] small heading (an <h2>) shown at the top
 * @param {"wide" | "tall" | "large"} [props.size] cells covered on tablet and
 *   desktop: wide = 2 across, tall = 2 down, large = both. Default is 1 cell.
 *   On mobile every tile is one cell.
 * @param {React.ReactNode} props.children tile content
 */
export default function BentoTile({ title, size, children }) {
  const className = `${styles.tile} ${size ? styles[size] : ""}`;

  return (
    <div className={className}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {children}
    </div>
  );
}
