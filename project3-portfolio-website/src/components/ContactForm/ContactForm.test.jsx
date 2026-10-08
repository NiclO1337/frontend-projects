import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import ContactForm from "./ContactForm.jsx";

// Button can contain a router <Link>, so even this form needs a router.
function renderForm() {
  const router = createMemoryRouter([{ path: "*", element: <ContactForm /> }]);
  render(<RouterProvider router={router} />);
}

const getName = () => screen.getByLabelText("Name");
const getEmail = () => screen.getByLabelText("Email");
const getMessage = () => screen.getByLabelText("Message");
const clickSend = (user) =>
  user.click(screen.getByRole("button", { name: "Send message" }));

describe("ContactForm", () => {
  it("has the three required fields and a send button", () => {
    renderForm();

    for (const field of [getName(), getEmail(), getMessage()]) {
      expect(field).toBeRequired();
    }
    expect(getEmail()).toHaveAttribute("type", "email");
    expect(
      screen.getByRole("button", { name: "Send message" }),
    ).toHaveAttribute("type", "submit");
  });

  it("has a honeypot field that real visitors cannot reach", () => {
    renderForm();

    const honeypot = document.querySelector('input[name="botcheck"]');
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot).toHaveAttribute("aria-hidden", "true");
  });

  it("shows an error under every empty field on submit, and focuses the first", async () => {
    const user = userEvent.setup();
    renderForm();

    await clickSend(user);

    expect(getName()).toHaveAccessibleDescription("Please enter your name.");
    expect(getEmail()).toHaveAccessibleDescription(
      "Please enter your email address.",
    );
    expect(getMessage()).toHaveAccessibleDescription("Please write a message.");
    for (const field of [getName(), getEmail(), getMessage()]) {
      expect(field).toHaveAttribute("aria-invalid", "true");
    }
    expect(getName()).toHaveFocus();
  });

  it("focuses the first field with a problem, not just the first field", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(getName(), "Ada");
    await user.type(getEmail(), "ada@example.com");
    await clickSend(user);

    expect(getMessage()).toHaveFocus();
  });

  it("checks a field when the visitor leaves it", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(getEmail());
    // Nothing is said while the visitor is still in the field.
    expect(getEmail()).toHaveAttribute("aria-invalid", "false");

    await user.tab();

    expect(getEmail()).toHaveAccessibleDescription(
      "Please enter your email address.",
    );
    // Other fields they have not visited stay quiet.
    expect(getName()).toHaveAttribute("aria-invalid", "false");
  });

  it("explains an email that is not valid", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(getEmail(), "not-an-email");
    await user.tab();

    expect(getEmail()).toHaveAccessibleDescription(/valid email address/i);
  });

  it("removes the error as soon as the problem is fixed", async () => {
    const user = userEvent.setup();
    renderForm();
    await user.type(getEmail(), "not-an-email");
    await user.tab();
    expect(getEmail()).toHaveAttribute("aria-invalid", "true");

    await user.type(getEmail(), "@example.com");

    expect(getEmail()).toHaveAttribute("aria-invalid", "false");
    expect(getEmail()).not.toHaveAccessibleDescription();
  });

  it("shows no errors when everything is filled in correctly", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(getName(), "Ada Lovelace");
    await user.type(getEmail(), "ada@example.com");
    await user.type(getMessage(), "Hello!");
    await clickSend(user);

    for (const field of [getName(), getEmail(), getMessage()]) {
      expect(field).toHaveAttribute("aria-invalid", "false");
    }
  });
});
