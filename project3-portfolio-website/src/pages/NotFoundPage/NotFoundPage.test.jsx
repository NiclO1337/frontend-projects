import { screen, within } from "@testing-library/react";
import { renderWithRouter } from "../../test/renderWithRouter.jsx";

describe("NotFoundPage", () => {
  it("is shown for an unknown URL, with links back home and to projects", () => {
    renderWithRouter(["/no-such-page"]);

    expect(
      screen.getByRole("heading", { level: 1, name: /404/i }),
    ).toBeInTheDocument();

    // Search only inside <main>, so the navigation links don't match too.
    const main = within(screen.getByRole("main"));
    expect(main.getByRole("link", { name: /home/i })).toHaveAttribute(
      "href",
      "/",
    );
    expect(main.getByRole("link", { name: /projects/i })).toHaveAttribute(
      "href",
      "/projects",
    );
  });
});
