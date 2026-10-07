import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "../../test/renderWithRouter.jsx";

describe("SkipLink", () => {
  it("is the first thing Tab reaches and points to the main content", async () => {
    const user = userEvent.setup();
    renderWithRouter(["/"]);

    await user.tab();

    const skipLink = screen.getByRole("link", {
      name: /skip to main content/i,
    });
    expect(skipLink).toHaveFocus();
    expect(skipLink).toHaveAttribute("href", "#main");
    // The target of the link must exist.
    expect(screen.getByRole("main")).toHaveAttribute("id", "main");
  });
});
