// Validation for the contact form. Pure functions: no React, so they are easy
// to test. Each returns an error message, or "" when the value is fine.

// Deliberately simple: something, an "@", something, a ".", something. A
// stricter rule would reject real addresses. The real check is the delivery.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const rules = {
  name: (value) => (value.trim() ? "" : "Please enter your name."),
  email: (value) => {
    if (!value.trim()) return "Please enter your email address.";
    return EMAIL_PATTERN.test(value.trim())
      ? ""
      : "Please enter a valid email address, like name@example.com.";
  },
  message: (value) => (value.trim() ? "" : "Please write a message."),
};

/**
 * Checks one field.
 * @param {"name" | "email" | "message"} field
 * @param {string} value
 * @returns {string} an error message, or "" if the value is fine
 */
export function validateField(field, value) {
  return rules[field](value);
}

/**
 * Checks every field.
 * @param {{ name: string, email: string, message: string }} values
 * @returns {{ name: string, email: string, message: string }} one message per
 *   field ("" for the fields that are fine), in the order they appear in the form
 */
export function validateAll(values) {
  return {
    name: validateField("name", values.name),
    email: validateField("email", values.email),
    message: validateField("message", values.message),
  };
}
