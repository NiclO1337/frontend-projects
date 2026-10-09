import Button from "../../components/Button/Button.jsx";
import styles from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  return (
    <>
      <title>Page not found – Niclas Hugdahl</title>
      <meta name="description" content="This page doesn't exist." />
      <h1>404 – Lost in the void</h1>
      <p>This page doesn&apos;t exist.</p>
      <div className={styles.actions}>
        <Button to="/">Back to home</Button>
        <Button to="/projects" variant="ghost">
          See my projects
        </Button>
      </div>
    </>
  );
}
