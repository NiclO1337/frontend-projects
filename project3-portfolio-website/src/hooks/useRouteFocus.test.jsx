import { act, screen } from "@testing-library/react";
import { renderWithRouter } from "../test/renderWithRouter.jsx";

// The hook is used by RootLayout, so test it through the real routes.
describe("useRouteFocus", () => {
  beforeEach(() => {
    // Watch the calls. The stub from setup.js does the (empty) scrolling.
    vi.spyOn(window, "scrollTo");
  });

  it("moves focus to the new page's <h1> and scrolls to the top", async () => {
    const { router } = renderWithRouter(["/"]);

    await act(() => router.navigate("/about"));

    expect(
      screen.getByRole("heading", { level: 1, name: /about/i }),
    ).toHaveFocus();
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("does not take focus on the first load", () => {
    renderWithRouter(["/about"]);

    expect(document.body).toHaveFocus();
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("does nothing when only the search params change", async () => {
    const { router } = renderWithRouter(["/projects"]);

    await act(() => router.navigate("/projects?tech=react"));

    expect(document.body).toHaveFocus();
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
