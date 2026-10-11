import { act, screen } from "@testing-library/react";
import { renderWithRouter } from "../test/renderWithRouter.jsx";

// The hook is used by RootLayout, so test it through the real routes.
// (Scrolling is not its job. See scrolling.test.jsx.)
describe("useRouteFocus", () => {
  it("moves focus to the new page's <h1>", async () => {
    const { router } = renderWithRouter(["/"]);

    await act(() => router.navigate("/about"));

    expect(
      screen.getByRole("heading", { level: 1, name: /about/i }),
    ).toHaveFocus();
  });

  it("does not take focus on the first load", () => {
    renderWithRouter(["/about"]);

    expect(document.body).toHaveFocus();
  });

  it("does nothing when only the search params change", async () => {
    const { router } = renderWithRouter(["/projects"]);

    await act(() => router.navigate("/projects?tech=react"));

    expect(document.body).toHaveFocus();
  });
});
