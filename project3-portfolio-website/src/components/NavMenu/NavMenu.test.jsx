import { render, screen } from "@testing-library/react";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import NavMenu from "./NavMenu.jsx";

// NavLink needs a router to know the current URL, so render NavMenu on its own
// route that matches every path.
function renderNavMenu(url) {
  const router = createMemoryRouter([{ path: "*", element: <NavMenu /> }], {
    initialEntries: [url],
  });
  render(<RouterProvider router={router} />);
}

describe("NavMenu", () => {
  it("renders a link to every main page", () => {
    renderNavMenu("/");

    const expected = {
      About: "/about",
      Resume: "/resume",
      Projects: "/projects",
      Contact: "/contact",
    };
    for (const [name, href] of Object.entries(expected)) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
    }
  });

  it("marks only the link of the current page with aria-current", () => {
    renderNavMenu("/resume");

    expect(screen.getByRole("link", { name: "Resume" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "About" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});
