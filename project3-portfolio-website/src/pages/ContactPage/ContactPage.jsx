import ContactForm from "../../components/ContactForm/ContactForm.jsx";
import styles from "./ContactPage.module.css";

export default function ContactPage() {
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

      <ContactForm />
    </>
  );
}
