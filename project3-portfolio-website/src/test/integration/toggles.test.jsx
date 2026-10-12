import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockMatchMedia } from "../mockMatchMedia.js";
import { renderWithRouter } from "../renderWithRouter.jsx";

// The toggles live in the layout, so they must keep their state when the
// visitor moves between pages, and when the page is loaded again later.

const MOUSE = "(hover: hover) and (pointer: fine)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const getThemeToggle = () => screen.getByRole("button", { name: "Dark mode" });
const getEffectsToggle = () => screen.getByRole("button", { name: "Effects" });
const goTo = async (user, linkName) => {
  await user.click(
    within(screen.getByRole("navigation", { name: "Main" })).getByRole("link", {
      name: linkName,
    }),
  );
  await screen.findByRole("heading", { level: 1 });
};

beforeEach(() => {
  // The cursor trail is a canvas, and jsdom cannot create a canvas context.
  // Moving the pointer makes the trail draw, so the fake needs its methods.
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("theme toggle", () => {
  it("keeps the chosen theme on every page", async () => {
    const user = userEvent.setup({ delay: null });
    renderWithRouter(["/"]);
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");

    await user.click(getThemeToggle());
    expect(document.documentElement).toHaveAttribute("data-theme", "light");

    await goTo(user, "About");
    await goTo(user, "Contact");

    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(getThemeToggle()).toHaveAttribute("aria-pressed", "false");
  });

  it("is still the chosen theme when the site is opened again", async () => {
    const user = userEvent.setup({ delay: null });
    const { unmount } = renderWithRouter(["/"]);
    await user.click(getThemeToggle());
    unmount();
    // Closing the tab: the page is gone, only localStorage is left.
    delete document.documentElement.dataset.theme;

    renderWithRouter(["/resume"]);

    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(getThemeToggle()).toHaveAttribute("aria-pressed", "false");
  });
});

describe("effects toggle", () => {
  it("turns the cursor effects off on every page, and on again", async () => {
    const user = userEvent.setup({ delay: null });
    mockMatchMedia({ [MOUSE]: true });
    const { container } = renderWithRouter(["/"]);
    await screen.findByRole("heading", { level: 1 });
    expect(container.querySelector("canvas")).toBeInTheDocument();

    await user.click(getEffectsToggle());
    expect(container.querySelector("canvas")).not.toBeInTheDocument();

    await goTo(user, "Projects");
    await goTo(user, "About");
    expect(getEffectsToggle()).toHaveAttribute("aria-pressed", "false");
    expect(container.querySelector("canvas")).not.toBeInTheDocument();

    await user.click(getEffectsToggle());
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("is still off when the site is opened again", async () => {
    const user = userEvent.setup({ delay: null });
    mockMatchMedia({ [MOUSE]: true });
    const { unmount } = renderWithRouter(["/"]);
    await user.click(getEffectsToggle());
    unmount();

    const { container } = renderWithRouter(["/projects"]);
    await screen.findByRole("heading", { level: 1 });

    expect(getEffectsToggle()).toHaveAttribute("aria-pressed", "false");
    expect(container.querySelector("canvas")).not.toBeInTheDocument();
  });

  // The visitor can change these in their system settings while the site is
  // open, so the effects must follow without a reload.
  it("stops when the visitor turns on reduced motion, and comes back when it is turned off", async () => {
    const media = mockMatchMedia({ [MOUSE]: true });
    const { container } = renderWithRouter(["/"]);
    await screen.findByRole("heading", { level: 1 });
    expect(container.querySelector("canvas")).toBeInTheDocument();

    act(() => media.set(REDUCED_MOTION, true));

    expect(container.querySelector("canvas")).not.toBeInTheDocument();
    // The toggle would change nothing now, so it is hidden too.
    expect(
      screen.queryByRole("button", { name: "Effects" }),
    ).not.toBeInTheDocument();

    act(() => media.set(REDUCED_MOTION, false));

    expect(container.querySelector("canvas")).toBeInTheDocument();
    expect(getEffectsToggle()).toHaveAttribute("aria-pressed", "true");
  });

  it("remembers that the visitor turned the effects off, through a reduced motion change", async () => {
    const user = userEvent.setup({ delay: null });
    const media = mockMatchMedia({ [MOUSE]: true });
    const { container } = renderWithRouter(["/"]);
    await user.click(getEffectsToggle());

    act(() => media.set(REDUCED_MOTION, true));
    act(() => media.set(REDUCED_MOTION, false));

    expect(getEffectsToggle()).toHaveAttribute("aria-pressed", "false");
    expect(container.querySelector("canvas")).not.toBeInTheDocument();
  });

  it("stops when the mouse goes away, for example when a tablet is detached from its mouse", async () => {
    const media = mockMatchMedia({ [MOUSE]: true });
    const { container } = renderWithRouter(["/"]);
    await screen.findByRole("heading", { level: 1 });

    act(() => media.set(MOUSE, false));

    expect(container.querySelector("canvas")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Effects" }),
    ).not.toBeInTheDocument();
  });

  it("is not offered on a touch screen", async () => {
    mockMatchMedia({ [MOUSE]: false });
    renderWithRouter(["/"]);
    await screen.findByRole("heading", { level: 1 });

    expect(
      screen.queryByRole("button", { name: "Effects" }),
    ).not.toBeInTheDocument();
  });
});
