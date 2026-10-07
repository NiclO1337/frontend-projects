import styles from "./BentoGrid.module.css";

/**
 * Grid for BentoTiles: 1 column on mobile, 2 on tablet, 4 on wide screens.
 * Tiles pick how many cells they cover with their `size` prop.
 * @param {object} props
 * @param {React.ReactNode} props.children BentoTiles
 */
export default function BentoGrid({ children }) {
  return <div className={styles.grid}>{children}</div>;
}
