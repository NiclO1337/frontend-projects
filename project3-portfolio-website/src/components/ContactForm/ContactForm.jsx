import { useEffect, useRef, useState } from "react";
import { profile } from "../../data/profile.js";
import { validateAll, validateField } from "../../utils/validateContact.js";
import Button from "../Button/Button.jsx";
import FormField from "../FormField/FormField.jsx";
import styles from "./ContactForm.module.css";

const WEB3FORMS_URL = "https://api.web3forms.com/submit";
const emptyValues = { name: "", email: "", message: "" };
// Where visitors are sent if sending fails. (No email address is published.)
const linkedIn = profile.social.find((link) => link.id === "linkedin");

/**
 * Sends the message to Web3Forms, which forwards it to the owner's inbox.
 * @param {{ name: string, email: string, message: string }} values
 * @param {boolean} isBot true if the hidden honeypot field was ticked
 * @returns {Promise<boolean>} true if the message was accepted
 */
async function sendMessage(values, isBot) {
  const response = await fetch(WEB3FORMS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      // Vite replaces this with the value from .env. The key is public by
      // design (it ends up in the browser), but it stays out of the repo.
      access_key: import.meta.env.VITE_WEB3FORMS_KEY,
      subject: "New message from the portfolio contact form",
      ...values,
      // Web3Forms drops the message if this is present: only bots tick it.
      ...(isBot && { botcheck: true }),
    }),
  });
  const result = await response.json();
  return result.success === true;
}

/**
 * The contact form: name, email and message, all required. Each field is
 * checked when the visitor leaves it, and every field when they press Send.
 * Valid messages are sent to Web3Forms.
 */
export default function ContactForm() {
  // What the visitor has typed. Each input shows its value from here, and
  // typing updates it. That is a "controlled" input.
  const [values, setValues] = useState(emptyValues);
  // One message per field, "" when the field is fine.
  const [errors, setErrors] = useState(emptyValues);
  // Where we are in sending: "idle" | "sending" | "success" | "error".
  // One value instead of several true/false flags (isSending, isSent, ...),
  // so the form can never be in a mixed-up state like "sending and failed".
  const [status, setStatus] = useState("idle");
  // References to DOM elements, to move focus: the <form> and the thank-you title.
  const formRef = useRef(null);
  const successTitleRef = useRef(null);

  // After sending, the form is replaced by the thank-you message. Whatever
  // had focus is gone, so move focus to the message: keyboard users keep their
  // place and screen readers read it.
  useEffect(() => {
    if (status === "success") successTitleRef.current.focus();
  }, [status]);

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

  async function handleSubmit(event) {
    // Stop the browser from sending the form and reloading the page.
    event.preventDefault();
    // A second click or Enter while the first message is on its way.
    if (status === "sending") return;

    const found = validateAll(values);
    setErrors(found);

    // Put the cursor in the first field with a problem, so keyboard and
    // screen reader users land right on it (its error is read as its description).
    const firstInvalid = Object.keys(found).find((name) => found[name]);
    if (firstInvalid) {
      formRef.current.elements[firstInvalid].focus();
      return;
    }

    setStatus("sending");
    // FormData reads every field of the form. That includes the honeypot
    // checkbox, which is not part of our state.
    const isBot = new FormData(formRef.current).has("botcheck");
    try {
      const sent = await sendMessage(values, isBot);
      setStatus(sent ? "success" : "error");
    } catch {
      // No network, or an answer that wasn't JSON.
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className={styles.success}>
        <h2 ref={successTitleRef} tabIndex={-1} className={styles.successTitle}>
          Thank you!
        </h2>
        <p>Your message has been sent. I will get back to you soon.</p>
      </div>
    );
  }

  const isSending = status === "sending";

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

      {/* role="alert" makes screen readers announce this as soon as it
          appears. The typed text is kept, so the visitor can just try again. */}
      {status === "error" && (
        <p role="alert" className={styles.sendError}>
          Sorry, your message could not be sent. Please try again, or contact me
          on{" "}
          <a href={linkedIn.url} target="_blank" rel="noopener noreferrer">
            LinkedIn
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
          .
        </p>
      )}

      <div>
        {/* aria-disabled, not disabled: a disabled button loses keyboard focus.
            handleSubmit ignores clicks while sending. */}
        <Button type="submit" aria-disabled={isSending}>
          {isSending ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
