import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "../renderWithRouter.jsx";

// <ScrollRestoration /> in RootLayout scrolls to the top for a new page, and
// puts the page back where it was for the browser's back and forward buttons.
// jsdom cannot scroll, so the tests watch the calls to window.scrollTo and
// pretend the page is scrolled by changing what window.scrollY says.

let scrolledTo;
let scrollTo;

beforeEach(() => {
  scrolledTo = 0;
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    get: () => scrolledTo,
  });
  scrollTo = vi.spyOn(window, "scrollTo");
});

afterEach(() => {
  delete window.scrollY;
  // The router keeps the saved positions in sessionStorage.
  sessionStorage.clear();
});

describe("scrolling", () => {
  it("starts a new page at the top", async () => {
    const user = userEvent.setup();
    renderWithRouter(["/"]);
    scrolledTo = 400;

    await user.click(screen.getByRole("link", { name: "About" }));
    await screen.findByRole("heading", { level: 1, name: /about me/i });

    expect(scrollTo).toHaveBeenLastCalledWith(0, 0);
  });

  it("puts the page back where it was when the browser's back button is used", async () => {
    const { router } = renderWithRouter(["/projects"]);
    scrolledTo = 600; // the visitor has scrolled down the list
    await act(() => router.navigate("/projects/banana-palace"));
    scrolledTo = 0; // the detail page opens at the top
    scrollTo.mockClear();

    await act(() => router.navigate(-1));

    expect(scrollTo).toHaveBeenLastCalledWith(0, 600);
  });

  it("does not jump to the top when a filter is chosen", async () => {
    const user = userEvent.setup();
    renderWithRouter(["/projects"]);
    scrolledTo = 300;
    scrollTo.mockClear();

    await user.click(screen.getByRole("button", { name: "Python" }));

    expect(scrollTo).not.toHaveBeenCalled();
  });
});
