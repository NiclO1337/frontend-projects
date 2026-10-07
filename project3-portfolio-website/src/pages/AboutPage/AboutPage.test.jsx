import { screen, within } from "@testing-library/react";
import { profile } from "../../data/profile.js";
import { skillGroups } from "../../data/skills.js";
import { renderWithRouter } from "../../test/renderWithRouter.jsx";

describe("AboutPage", () => {
  it("shows the heading and every paragraph of the bio", () => {
    renderWithRouter(["/about"]);
    const main = within(screen.getByRole("main"));

    expect(
      main.getByRole("heading", { level: 1, name: "About me" }),
    ).toBeInTheDocument();
    for (const paragraph of profile.about) {
      expect(main.getByText(paragraph)).toBeInTheDocument();
    }
  });

  it("shows a Skills section with one tile for every skill group", () => {
    renderWithRouter(["/about"]);
    const main = within(screen.getByRole("main"));

    expect(
      main.getByRole("heading", { level: 2, name: "Skills" }),
    ).toBeInTheDocument();
    for (const group of skillGroups) {
      expect(
        main.getByRole("heading", { level: 3, name: group.name }),
      ).toBeInTheDocument();
    }
  });

  it("lists the skills, for example React", () => {
    renderWithRouter(["/about"]);
    const main = within(screen.getByRole("main"));

    const skills = main
      .getAllByRole("listitem")
      .map((item) => item.textContent);
    expect(skills).toContain("React");
  });
});
