import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "../renderWithRouter.jsx";

// Integration tests render the real routes, layout and pages together, so they
// check that the pieces work as a whole. The unit tests next to each component
// already cover the details.

const mainNav = () => screen.getByRole("navigation", { name: "Main" });

beforeEach(() => {
  // jsdom doesn't implement scrolling, and every navigation scrolls to the top.
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});

describe("navigation", () => {
  it.each([
    ["About", /about me/i],
    ["Resume", /^resume$/i],
    ["Projects", /^projects$/i],
    ["Contact", /let's talk/i],
  ])(
    "the %s link opens its page, marks itself active and moves focus to the <h1>",
    async (linkName, headingName) => {
      const user = userEvent.setup();
      renderWithRouter(["/"]);

      await user.click(within(mainNav()).getByRole("link", { name: linkName }));

      const heading = await screen.findByRole("heading", {
        level: 1,
        name: headingName,
      });
      expect(heading).toHaveFocus();
      expect(
        within(mainNav()).getByRole("link", { name: linkName }),
      ).toHaveAttribute("aria-current", "page");
    },
  );

  it("only the link of the current page is active", async () => {
    const user = userEvent.setup();
    renderWithRouter(["/about"]);

    await user.click(within(mainNav()).getByRole("link", { name: "Resume" }));
    await screen.findByRole("heading", { level: 1, name: /^resume$/i });

    const activeLinks = within(mainNav())
      .getAllByRole("link")
      .filter((link) => link.getAttribute("aria-current") === "page");
    expect(activeLinks).toHaveLength(1);
    expect(activeLinks[0]).toHaveAccessibleName(/resume/i);
  });

  it("the name in the sidebar leads back home", async () => {
    const user = userEvent.setup();
    renderWithRouter(["/contact"]);

    // The name is also in the mobile header, so there are two. Both go home.
    const [nameLink] = screen.getAllByRole("link", { name: "Niclas Hugdahl" });
    await user.click(nameLink);

    expect(
      await screen.findByRole("heading", { level: 1, name: /hi, i'm/i }),
    ).toBeInTheDocument();
  });

  it("keeps the same layout around every page", async () => {
    const user = userEvent.setup();
    renderWithRouter(["/"]);

    await user.click(within(mainNav()).getByRole("link", { name: "Projects" }));
    await screen.findByRole("heading", { level: 1, name: /^projects$/i });

    // Landmarks that RootLayout provides must still be there. Browsers give
    // these roles to plain HTML elements: <main> is "main", and a <footer>
    // outside <main> is "contentinfo". No role attribute is needed in the code.
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(mainNav()).toBeInTheDocument();
  });
});

describe("404", () => {
  it("shows the not-found page, inside the normal layout, for an unknown URL", async () => {
    renderWithRouter(["/no-such-page"]);

    expect(
      await screen.findByRole("heading", { level: 1, name: /404/ }),
    ).toBeInTheDocument();
    // The sidebar is still there, so visitors can find their way out.
    expect(mainNav()).toBeInTheDocument();
  });

  it("shows the not-found page for an unknown URL below a known page", async () => {
    renderWithRouter(["/about/team"]);

    expect(
      await screen.findByRole("heading", { level: 1, name: /404/ }),
    ).toBeInTheDocument();
  });

  it("the 'See my projects' link opens the projects page", async () => {
    const user = userEvent.setup();
    renderWithRouter(["/no-such-page"]);
    await screen.findByRole("heading", { level: 1, name: /404/ });

    await user.click(screen.getByRole("link", { name: "See my projects" }));

    expect(
      await screen.findByRole("heading", { level: 1, name: /^projects$/i }),
    ).toBeInTheDocument();
  });

  it("the 'Back to home' link opens the home page", async () => {
    const user = userEvent.setup();
    renderWithRouter(["/no-such-page"]);
    await screen.findByRole("heading", { level: 1, name: /404/ });

    await user.click(screen.getByRole("link", { name: "Back to home" }));

    expect(
      await screen.findByRole("heading", { level: 1, name: /hi, i'm/i }),
    ).toBeInTheDocument();
  });
});

describe("deep links", () => {
  // Opening a URL directly (a bookmark, a shared link, a refresh) must work
  // for every route, not only when you click your way there.
  it.each([
    ["/", /hi, i'm/i],
    ["/about", /about me/i],
    ["/resume", /^resume$/i],
    ["/projects", /^projects$/i],
    ["/projects/banana-palace", /^banana palace$/i],
    ["/contact", /let's talk/i],
  ])("%s renders its page directly", async (url, headingName) => {
    renderWithRouter([url]);

    expect(
      await screen.findByRole("heading", { level: 1, name: headingName }),
    ).toBeInTheDocument();
  });

  it("marks the right nav link as active on a deep link", async () => {
    renderWithRouter(["/resume"]);
    await screen.findByRole("heading", { level: 1, name: /^resume$/i });

    expect(
      within(mainNav()).getByRole("link", { name: "Resume" }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("keeps the Projects link active on a project detail page", async () => {
    renderWithRouter(["/projects/banana-palace"]);
    await screen.findByRole("heading", { level: 1, name: /^banana palace$/i });

    // NavLink matches child URLs too, so /projects/:slug still counts as Projects.
    expect(
      within(mainNav()).getByRole("link", { name: "Projects" }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("shows the not-found page, inside the layout, for an unknown project", async () => {
    renderWithRouter(["/projects/nope"]);

    expect(
      await screen.findByRole("heading", { level: 1, name: /404/ }),
    ).toBeInTheDocument();
    expect(mainNav()).toBeInTheDocument();
  });
});
