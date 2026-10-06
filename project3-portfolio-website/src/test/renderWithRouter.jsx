import { render } from "@testing-library/react";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { routes } from "../routes.jsx";

/**
 * Renders the real routes with an in-memory history (no browser URL needed).
 * @param {string[]} initialEntries URLs to start at, e.g. ["/projects"]
 */
export function renderWithRouter(initialEntries = ["/"]) {
  const router = createMemoryRouter(routes, { initialEntries });
  return { router, ...render(<RouterProvider router={router} />) };
}
