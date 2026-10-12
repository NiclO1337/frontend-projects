import { useLocation } from "react-router";
import ContactForm from "../../components/ContactForm/ContactForm.jsx";
import styles from "./ContactPage.module.css";

export default function ContactPage() {
  // Pressing "Contact" while already on this page does not remount anything:
  // it is the same route, so React keeps the form and its "Thank you!" state.
  // `location.key` is new on every navigation, even to the page you are
  // already on, and a new `key` makes React throw the old form away and start
  // a fresh, empty one. Only the form is keyed (not the whole page), so the
  // heading and the page animation stay as they are.
  const { key } = useLocation();

  return (
    <>
      <title>Contact – Niclas Hugdahl</title>
      <meta
        name="description"
        content="Get in touch with Niclas Hugdahl about work, projects or collaboration."
      />

      <h1>Let&apos;s talk</h1>
      <p className={styles.intro}>
        Have a job, a project or just a question? Send me a message and I will
        get back to you.
      </p>

      <ContactForm key={key} />
    </>
  );
}
