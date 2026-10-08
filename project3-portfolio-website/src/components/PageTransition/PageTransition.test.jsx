import { act, render, screen } from "@testing-library/react";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { EffectsProvider } from "../../context/EffectsProvider.jsx";
import { mockMatchMedia } from "../../test/mockMatchMedia.js";
import PageTransition from "./PageTransition.jsx";

const MOUSE = "(hover: hover) and (pointer: fine)";

// A route that matches every path, with the transition around the page like
// RootLayout does with <Outlet />.
function renderPages() {
  const router = createMemoryRouter(
    [
      {
        path: "*",
        element: (
          <PageTransition>
            <p>Page text</p>
          </PageTransition>
        ),
      },
    ],
    { initialEntries: ["/"] },
  );
  render(
    <EffectsProvider>
      <RouterProvider router={router} />
    </EffectsProvider>,
  );
  return router;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("PageTransition", () => {
  it("starts the page faded out when the effects are on", () => {
    mockMatchMedia({ [MOUSE]: true });

    renderPages();

    expect(screen.getByText("Page text").parentElement).toHaveStyle({
      opacity: "0",
    });
  });

  it("shows the page at once when the effects are off", () => {
    mockMatchMedia({ [MOUSE]: true });
    localStorage.setItem("effects", "false");

    renderPages();

    expect(screen.getByText("Page text")).toBeVisible();
  });

  it("starts over when the path changes, but not when only the search changes", async () => {
    mockMatchMedia({ [MOUSE]: false });
    const router = renderPages();
    const wrapper = screen.getByText("Page text").parentElement;

    // A new key makes React replace the element, so it would be another node.
    await act(() => router.navigate("/?tech=python"));
    expect(screen.getByText("Page text").parentElement).toBe(wrapper);

    await act(() => router.navigate("/other"));
    expect(screen.getByText("Page text").parentElement).not.toBe(wrapper);
  });
});
