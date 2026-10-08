import { useId } from "react";
import styles from "./FormField.module.css";

/**
 * A label, an input (or textarea) and an error message, wired together so
 * assistive technology reads them as one unit: the label is tied to the
 * control with htmlFor/id, and the error is tied to it with aria-describedby.
 * It's a controlled field: the parent owns the value.
 * @param {object} props
 * @param {string} props.label visible label text
 * @param {string} props.name field name, also sent to onChange/onBlur through the event
 * @param {string} props.value current value
 * @param {string} [props.error] error message, or "" when the field is fine
 * @param {boolean} [props.multiline] renders a <textarea> instead of an <input>
 * @param {string} [props.type] input type, like "email" (ignored for a textarea)
 * Other props, such as onChange, onBlur and autoComplete, go to the control.
 */
export default function FormField({
  label,
  name,
  value,
  error,
  multiline = false,
  type = "text",
  ...rest
}) {
  const id = useId();
  const errorId = `${id}-error`;
  // A variable with a capital letter can be used as a tag.
  const Control = multiline ? "textarea" : "input";

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <Control
        id={id}
        name={name}
        value={value}
        className={styles.control}
        type={multiline ? undefined : type}
        rows={multiline ? 6 : undefined}
        required
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
