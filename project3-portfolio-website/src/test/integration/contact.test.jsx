import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "../renderWithRouter.jsx";

// The whole contact journey: click "Contact" in the menu, fill in the form,
// send. The form's details (validation, honeypot, ...) are covered by the
// ContactForm unit tests.

// Tests must never call the real Web3Forms service, so `fetch` is a fake.
function stubFetch(body) {
  const fetchMock = vi.fn(() =>
    Promise.resolve({ json: () => Promise.resolve(body) }),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

// The form fields are looked up inside <main>, because the sidebar has links
// with similar labels (for example "Email").
async function openContactPageAndFillIn(user) {
  await user.click(
    within(screen.getByRole("navigation", { name: "Main" })).getByRole("link", {
      name: "Contact",
    }),
  );
  await screen.findByRole("heading", { level: 1, name: /let's talk/i });

  const form = within(screen.getByRole("main"));
  await user.type(form.getByLabelText("Name"), "Ada Lovelace");
  await user.type(form.getByLabelText("Email"), "ada@example.com");
  await user.type(form.getByLabelText("Message"), "Hello!");
  await user.click(form.getByRole("button", { name: "Send message" }));
}

beforeEach(() => {
  vi.stubEnv("VITE_WEB3FORMS_KEY", "test-key");
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("contact", () => {
  it("sends the message and thanks the visitor", async () => {
    const user = userEvent.setup();
    const fetchMock = stubFetch({ success: true });
    renderWithRouter(["/"]);

    await openContactPageAndFillIn(user);

    expect(
      await screen.findByRole("heading", { name: "Thank you!" }),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.web3forms.com/submit");
    expect(JSON.parse(options.body)).toMatchObject({
      access_key: "test-key",
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "Hello!",
    });
  });

  it("shows an error inside the page, with the navigation still usable", async () => {
    const user = userEvent.setup();
    stubFetch({ success: false });
    renderWithRouter(["/"]);

    await openContactPageAndFillIn(user);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /could not be sent/i,
    );
    expect(
      within(screen.getByRole("main")).getByLabelText("Message"),
    ).toHaveValue("Hello!");
    expect(
      screen.getByRole("navigation", { name: "Main" }),
    ).toBeInTheDocument();
  });
});
