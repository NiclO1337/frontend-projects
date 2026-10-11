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
// Long enough to be accepted (the shortest message is 20 characters).
const MESSAGE = "Hello! I would like to talk about a project.";
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
  await user.type(getMessage(), MESSAGE);
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

  it("stops the visitor from typing more than a field allows", async () => {
    const user = userEvent.setup();
    renderForm();

    for (const [field, max] of [
      [getName(), 100],
      [getEmail(), 254],
      [getMessage(), 2000],
    ]) {
      await user.click(field);
      await user.paste("a".repeat(max + 50));
      expect(field.value).toHaveLength(max);
    }
  });

  it("counts the characters of the message while the visitor types", async () => {
    const user = userEvent.setup();
    renderForm();
    expect(screen.getByText("0 / 2000 characters")).toBeInTheDocument();

    await user.type(getMessage(), "Hello");

    const counter = screen.getByText("5 / 2000 characters");
    // Plain text: a live region would make a screen reader announce every key press.
    expect(counter.closest("[aria-live]")).toBeNull();
  });

  it("shows that the limit is reached when the message is full", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(getMessage());
    await user.paste("a".repeat(2500));

    expect(screen.getByText("2000 / 2000 characters")).toBeInTheDocument();
  });

  // The screen reader announcement: a live region (role "status") that is on
  // the page from the start, and only gets text when the limit comes close.
  describe("limit announcement for screen readers", () => {
    const getAnnouncement = () => screen.getByRole("status");

    it("is on the page but says nothing while there is plenty of room", async () => {
      const user = userEvent.setup();
      renderForm();
      expect(getAnnouncement()).toBeEmptyDOMElement();

      await user.type(getMessage(), "Hello");

      expect(getAnnouncement()).toBeEmptyDOMElement();
    });

    it.each([
      [1799, ""],
      [1800, "About 200 characters left."],
      [1899, "About 200 characters left."],
      [1900, "About 100 characters left."],
      [1999, "About 100 characters left."],
      [2000, "Character limit reached."],
    ])("with %i characters it says %j", async (length, notice) => {
      const user = userEvent.setup();
      renderForm();

      await user.click(getMessage());
      await user.paste("a".repeat(length));

      expect(getAnnouncement()).toHaveTextContent(notice);
    });

    // A live region is read out whenever its text changes. The same text
    // again is silent, so typing inside a band must not change it.
    it("keeps the same text while the visitor types inside a band", async () => {
      const user = userEvent.setup();
      renderForm();
      await user.click(getMessage());
      await user.paste("a".repeat(1850));
      const before = getAnnouncement().textContent;

      await user.type(getMessage(), "bcd");

      expect(getAnnouncement().textContent).toBe(before);
      expect(before).not.toBe("");
    });
  });

  it("asks for a longer message, and sends nothing until it is long enough", async () => {
    const user = userEvent.setup();
    const fetchMock = stubFetch(accepted);
    renderForm();
    await user.type(getName(), "Ada Lovelace");
    await user.type(getEmail(), "ada@example.com");
    await user.type(getMessage(), "Hi there");

    await clickSend(user);

    expect(getMessage()).toHaveAccessibleDescription(/at least 20 characters/);
    expect(getMessage()).toHaveFocus();
    expect(fetchMock).not.toHaveBeenCalled();

    // The message is checked again while typing, so the error goes away at 20.
    await user.type(getMessage(), ", can we talk?");

    expect(getMessage()).toHaveAttribute("aria-invalid", "false");
    await clickSend(user);
    expect(
      await screen.findByRole("heading", { name: "Thank you!" }),
    ).toBeInTheDocument();
  });

  it("has a honeypot field that real visitors cannot reach", () => {
    renderForm();

    const honeypot = document.querySelector('input[name="botcheck"]');
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot).toHaveAttribute("aria-hidden", "true");
    // WAVE reports an input without a label as an error, even a hidden one.
    expect(honeypot).toHaveAttribute("aria-label");
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
      message: MESSAGE,
    });
  });

  it("sends the text without spaces around it, but keeps what was typed in the form", async () => {
    const user = userEvent.setup();
    const fetchMock = stubFetch(answer({ success: false }));
    renderForm();

    await user.type(getName(), "  Ada Lovelace  ");
    await user.type(getEmail(), "ada@example.com");
    await user.type(getMessage(), `  ${MESSAGE}  `);
    await clickSend(user);
    await screen.findByRole("alert");

    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: MESSAGE,
    });
    // The send failed, so the visitor sees their own text when they try again.
    expect(getName()).toHaveValue("  Ada Lovelace  ");
    expect(getMessage()).toHaveValue(`  ${MESSAGE}  `);
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
    expect(getMessage()).toHaveValue(MESSAGE);
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

  it("shows the same error when the answer is not JSON, like an error page", async () => {
    const user = userEvent.setup();
    stubFetch(() =>
      Promise.resolve({
        json: () => Promise.reject(new SyntaxError("Unexpected token <")),
      }),
    );
    renderForm();

    await fillInAndSend(user);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /could not be sent/i,
    );
  });

  // Only an answer that says `success: true` (a real boolean) counts as sent.
  it.each([
    ["has no success field", {}],
    ["says success as text", { success: "true" }],
    ["has no content", null],
  ])("shows the error when the answer %s", async (_label, body) => {
    const user = userEvent.setup();
    stubFetch(answer(body));
    renderForm();

    await fillInAndSend(user);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /could not be sent/i,
    );
    expect(
      screen.queryByRole("heading", { name: "Thank you!" }),
    ).not.toBeInTheDocument();
  });

  // A complete, valid form must not be sent by accident, for example when the
  // visitor fixes a typo in their name and presses Enter out of habit.
  it.each([
    ["name", getName],
    ["email", getEmail],
  ])(
    "does not send the form when Enter is pressed in the %s field",
    async (_label, getField) => {
      const user = userEvent.setup();
      const fetchMock = stubFetch(accepted);
      renderForm();
      await user.type(getName(), "Ada Lovelace");
      await user.type(getEmail(), "ada@example.com");
      await user.type(getMessage(), MESSAGE);

      await user.type(getField(), "{Enter}");

      expect(fetchMock).not.toHaveBeenCalled();
      expect(
        screen.queryByRole("heading", { name: "Thank you!" }),
      ).not.toBeInTheDocument();
      // Nothing else happens either: no errors, and the text is still there.
      expect(getField()).toHaveAttribute("aria-invalid", "false");
      expect(getMessage()).toHaveValue(MESSAGE);
    },
  );

  it("adds a new line when Enter is pressed in the message, and does not send", async () => {
    const user = userEvent.setup();
    const fetchMock = stubFetch(accepted);
    renderForm();
    await user.type(getName(), "Ada Lovelace");
    await user.type(getEmail(), "ada@example.com");

    await user.type(getMessage(), "Hello!{Enter}Bye!");

    expect(getMessage()).toHaveValue("Hello!\nBye!");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("still sends the form when Enter is pressed on the send button", async () => {
    const user = userEvent.setup();
    const fetchMock = stubFetch(accepted);
    renderForm();
    await user.type(getName(), "Ada Lovelace");
    await user.type(getEmail(), "ada@example.com");
    await user.type(getMessage(), MESSAGE);

    // Tab from the message to the send button, as a keyboard user would.
    await user.tab();
    expect(screen.getByRole("button", { name: "Send message" })).toHaveFocus();
    await user.keyboard("{Enter}");

    expect(
      await screen.findByRole("heading", { name: "Thank you!" }),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("hides the old error while the message is sent again", async () => {
    const user = userEvent.setup();
    const fetchMock = stubFetch(answer({ success: false }));
    renderForm();
    await fillInAndSend(user);
    await screen.findByRole("alert");

    // A new attempt that stays "on its way".
    fetchMock.mockImplementation(() => new Promise(() => {}));
    await clickSend(user);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sending…" }),
    ).toBeInTheDocument();
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
