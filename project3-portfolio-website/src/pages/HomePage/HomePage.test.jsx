import { screen, within } from "@testing-library/react";
import { profile } from "../../data/profile.js";
import { renderWithRouter } from "../../test/renderWithRouter.jsx";

describe("HomePage", () => {
  it("greets the visitor and links to projects and contact", () => {
    renderWithRouter(["/"]);
    // Search only inside <main>, so the navigation links don't match too.
    const main = within(screen.getByRole("main"));

    expect(
      main.getByRole("heading", { level: 1, name: /hi, i'm niclas/i }),
    ).toBeInTheDocument();
    expect(main.getByText(profile.title)).toBeInTheDocument();
    expect(main.getByRole("link", { name: "View projects" })).toHaveAttribute(
      "href",
      "/projects",
    );
    expect(main.getByRole("link", { name: "Contact me" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });

  it("has a CV download link and a photo with alt text", () => {
    renderWithRouter(["/"]);
    const main = within(screen.getByRole("main"));

    const cvLink = main.getByRole("link", { name: "Download CV" });
    expect(cvLink).toHaveAttribute("href", profile.cvPath);
    expect(cvLink).toHaveAttribute("download");
    expect(
      main.getByRole("img", { name: profile.photoAlt }),
    ).toBeInTheDocument();
  });

  it("shows what you are doing now, where you live and the languages", () => {
    renderWithRouter(["/"]);
    const main = within(screen.getByRole("main"));

    expect(main.getByText(profile.currently)).toBeInTheDocument();
    expect(main.getByText(profile.location)).toBeInTheDocument();
    for (const { name, level } of profile.languages) {
      expect(main.getByText(`${name} – ${level}`)).toBeInTheDocument();
    }
  });
});
