import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { profile } from "../../data/profile.js";
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

// Tests must never call the real Web3Forms service, so `fetch` is replaced
// with a fake. By default the fake says "sent". A test can install another one.
function stubFetch(implementation) {
  const fetchMock = vi.fn(implementation);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}
const answer = (body) => () =>
  Promise.resolve({ json: () => Promise.resolve(body) });
const accepted = answer({ success: true });

beforeEach(() => {
  vi.stubEnv("VITE_WEB3FORMS_KEY", "test-key");
  stubFetch(accepted);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

async function fillInAndSend(user) {
  await user.type(getName(), "Ada Lovelace");
  await user.type(getEmail(), "ada@example.com");
  await user.type(getMessage(), "Hello!");
  await clickSend(user);
}

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

  it("does not send anything while a field has a problem", async () => {
    const user = userEvent.setup();
    const fetchMock = stubFetch(accepted);
    renderForm();

    await user.type(getName(), "Ada");
    await clickSend(user);

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends the message to Web3Forms as JSON, with the access key", async () => {
    const user = userEvent.setup();
    const fetchMock = stubFetch(accepted);
    renderForm();

    await fillInAndSend(user);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.web3forms.com/submit");
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body)).toMatchObject({
      access_key: "test-key",
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "Hello!",
    });
  });

  it("tells Web3Forms when the honeypot was ticked", async () => {
    const user = userEvent.setup();
    const fetchMock = stubFetch(accepted);
    renderForm();

    // A real visitor can't do this. A bot that fills in every field would.
    fireEvent.click(document.querySelector('input[name="botcheck"]'));
    await fillInAndSend(user);

    expect(JSON.parse(fetchMock.mock.calls[0][1].body).botcheck).toBe(true);
  });

  it("does not mention the honeypot for a normal visitor", async () => {
    const user = userEvent.setup();
    const fetchMock = stubFetch(accepted);
    renderForm();

    await fillInAndSend(user);

    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).not.toHaveProperty(
      "botcheck",
    );
  });

  it("shows that it is sending, and ignores a second click meanwhile", async () => {
    const user = userEvent.setup();
    // A promise that never finishes: the message stays "on its way".
    const fetchMock = stubFetch(() => new Promise(() => {}));
    renderForm();

    await fillInAndSend(user);
    const button = screen.getByRole("button", { name: "Sending…" });
    await user.click(button);

    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(fetchMock).toHaveBeenCalledOnce();
    // The typed text is still there, and no errors are shown.
    expect(getName()).toHaveValue("Ada Lovelace");
    expect(getName()).toHaveAttribute("aria-invalid", "false");
  });

  it("replaces the form with a thank-you message, and moves focus to it", async () => {
    const user = userEvent.setup();
    renderForm();

    await fillInAndSend(user);

    const title = await screen.findByRole("heading", { name: "Thank you!" });
    expect(title).toHaveFocus();
    expect(screen.getByRole("status")).toHaveTextContent(
      /message has been sent/i,
    );
    expect(screen.queryByLabelText("Name")).not.toBeInTheDocument();
  });

  it("shows an error and keeps the text when Web3Forms says no", async () => {
    const user = userEvent.setup();
    stubFetch(answer({ success: false, message: "Invalid access key" }));
    renderForm();

    await fillInAndSend(user);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /could not be sent/i,
    );
    expect(getMessage()).toHaveValue("Hello!");
    // The button works again, so the visitor can try again.
    expect(
      screen.getByRole("button", { name: "Send message" }),
    ).toHaveAttribute("aria-disabled", "false");
  });

  it("shows the same error when the network fails", async () => {
    const user = userEvent.setup();
    stubFetch(() => Promise.reject(new TypeError("Failed to fetch")));
    renderForm();

    await fillInAndSend(user);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /could not be sent/i,
    );
  });

  it("offers LinkedIn as another way to get in touch, and no email address", async () => {
    const user = userEvent.setup();
    stubFetch(answer({ success: false }));
    renderForm();

    await fillInAndSend(user);

    const alert = await screen.findByRole("alert");
    const linkedIn = profile.social.find((link) => link.id === "linkedin");
    expect(
      within(alert).getByRole("link", { name: /linkedin/i }),
    ).toHaveAttribute("href", linkedIn.url);
    expect(alert.textContent).not.toMatch(/@/);
  });

  it("can be sent again after an error", async () => {
    const user = userEvent.setup();
    const fetchMock = stubFetch(answer({ success: false }));
    renderForm();
    await fillInAndSend(user);
    await screen.findByRole("alert");

    fetchMock.mockImplementation(accepted);
    await clickSend(user);

    expect(
      await screen.findByRole("heading", { name: "Thank you!" }),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
