import { screen } from "@testing-library/react";
import { renderWithRouter } from "../test/renderWithRouter.jsx";

describe("page titles", () => {
  it.each([
    ["/", /^Niclas Hugdahl – Developer Portfolio$/],
    ["/about", /^About – /],
    ["/resume", /^Resume – /],
    ["/projects", /^Projects – /],
    ["/projects/banana-palace", /^Banana Palace – /],
    ["/contact", /^Contact – /],
    ["/no-such-page", /^Page not found – /],
  ])("%s has its own title and a description", async (url, title) => {
    renderWithRouter([url]);

    // The heading proves the page has rendered before we look at <head>.
    await screen.findByRole("heading", { level: 1 });

    expect(document.title).toMatch(title);
    expect(
      document.head.querySelector('meta[name="description"]'),
    ).toHaveAttribute("content", expect.stringMatching(/\w/));
  });
});
