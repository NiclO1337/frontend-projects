import { render } from "@testing-library/react";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { EffectsProvider } from "../context/EffectsProvider.jsx";
import { ThemeProvider } from "../context/ThemeProvider.jsx";
import { routes } from "../routes.jsx";

/**
 * Renders the real routes with an in-memory history (no browser URL needed),
 * inside the same providers as the app.
 * @param {string[]} initialEntries URLs to start at, e.g. ["/projects"]
 */
export function renderWithRouter(initialEntries = ["/"]) {
  const router = createMemoryRouter(routes, { initialEntries });
  return {
    router,
    ...render(
      <ThemeProvider>
        <EffectsProvider>
          <RouterProvider router={router} />
        </EffectsProvider>
      </ThemeProvider>,
    ),
  };
}
