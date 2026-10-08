import styles from "./TechTag.module.css";

/**
 * A small label for one technology, like "React". Put it inside a list item
 * when there are several.
 * @param {object} props
 * @param {React.ReactNode} props.children the technology's name
 */
export default function TechTag({ children }) {
  return <span className={styles.tag}>{children}</span>;
}
