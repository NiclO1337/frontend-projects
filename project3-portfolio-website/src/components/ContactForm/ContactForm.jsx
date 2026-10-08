import { useRef, useState } from "react";
import { validateAll, validateField } from "../../utils/validateContact.js";
import Button from "../Button/Button.jsx";
import FormField from "../FormField/FormField.jsx";
import styles from "./ContactForm.module.css";

const emptyValues = { name: "", email: "", message: "" };

/**
 * The contact form: name, email and message, all required. Each field is
 * checked when the visitor leaves it, and every field when they press Send.
 * (Step 20 adds the actual sending.)
 */
export default function ContactForm() {
  // What the visitor has typed. Each input shows its value from here, and
  // typing updates it. That is a "controlled" input.D
  const [values, setValues] = useState(emptyValues);
  // One message per field, "" when the field is fine.
  const [errors, setErrors] = useState(emptyValues);
  // A reference to the <form> element, to move focus to a field.
  const formRef = useRef(null);

  // The inputs have a `name` ("name", "email", "message"), so one handler can
  // serve all of them: `event.target` is the input that changed.
  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));

    // If this field is showing an error, check it again while the visitor
    // types, so the message disappears as soon as the problem is fixed.
    // Fields without an error stay quiet until they are left (blur).
    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: validateField(name, value),
      }));
    }
  }

  function handleBlur(event) {
    const { name, value } = event.target;
    setErrors((current) => ({
      ...current,
      [name]: validateField(name, value),
    }));
  }

  function handleSubmit(event) {
    // Stop the browser from sending the form and reloading the page.
    event.preventDefault();

    const found = validateAll(values);
    setErrors(found);

    // Put the cursor in the first field with a problem, so keyboard and
    // screen reader users land right on it (its error is read as its description).
    const firstInvalid = Object.keys(found).find((name) => found[name]);
    if (firstInvalid) {
      formRef.current.elements[firstInvalid].focus();
      return;
    }

    // Step 20 sends the message from here.
  }

  return (
    // noValidate turns off the browser's own pop-up messages, so ours are used.
    <form
      ref={formRef}
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
    >
      <p>All fields are required.</p>

      {/* Name and email share a row when there is room for it. */}
      <div className={styles.row}>
        <FormField
          label="Name"
          name="name"
          autoComplete="name"
          value={values.name}
          error={errors.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          error={errors.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
      <FormField
        label="Message"
        name="message"
        multiline
        value={values.message}
        error={errors.message}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {/* Honeypot: a trap for spam bots. People never see or reach it
          (display: none, no Tab stop), but bots fill in every field they find.
          The mail service ignores messages where it is ticked. */}
      <input
        type="checkbox"
        name="botcheck"
        className={styles.honeypot}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div>
        <Button type="submit">Send message</Button>
      </div>
    </form>
  );
}
