import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getFeaturedProject, getHostName } from "../../utils/projects.js";
import { renderWithRouter } from "../renderWithRouter.jsx";

// A page that crashes while it renders is hard to cause with real data. So
// these two helpers (used by the Home page and the detail page) are wrapped:
// they do the real work, until a test makes them throw.
vi.mock("../../utils/projects.js", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    getFeaturedProject: vi.fn(original.getFeaturedProject),
    getHostName: vi.fn(original.getHostName),
  };
});

const crash = () => {
  throw new Error("Something broke while rendering");
};

beforeEach(() => {
  // React and React Router log every caught error. That is noise here.
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  // Back to the real functions, so a crash doesn't leak into the next test.
  vi.mocked(getFeaturedProject).mockReset();
  vi.mocked(getHostName).mockReset();
});

describe("unexpected errors", () => {
  it("shows 'Something went wrong' when a page crashes", async () => {
    vi.mocked(getFeaturedProject).mockImplementation(crash);
    renderWithRouter(["/"]);

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Something went wrong",
      }),
    ).toBeInTheDocument();
    expect(document.title).toMatch(/^Something went wrong – /);
  });

  it("shows 'Something went wrong', not a 404, when the project page crashes", async () => {
    vi.mocked(getHostName).mockImplementation(crash);
    renderWithRouter(["/projects/banana-palace"]);

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Something went wrong",
      }),
    ).toBeInTheDocument();
    // The project exists, so "this page doesn't exist" would be wrong.
    expect(
      screen.queryByRole("heading", { name: /404/ }),
    ).not.toBeInTheDocument();
  });

  it("still shows the 404 inside the layout for a project that does not exist", async () => {
    vi.mocked(getHostName).mockImplementation(crash);
    renderWithRouter(["/projects/no-such-project"]);

    expect(
      await screen.findByRole("heading", { level: 1, name: /404/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Main" }),
    ).toBeInTheDocument();
  });

  it("'Back to home' leads out of the error page", async () => {
    const user = userEvent.setup();
    vi.mocked(getFeaturedProject).mockImplementation(crash);
    renderWithRouter(["/"]);
    await screen.findByRole("heading", { name: "Something went wrong" });

    // The problem is over (a real visitor would have reloaded or tried later).
    vi.mocked(getFeaturedProject).mockReset();
    await user.click(screen.getByRole("link", { name: "Back to home" }));

    expect(
      await screen.findByRole("heading", { level: 1, name: /hi, i'm/i }),
    ).toBeInTheDocument();
  });
});
