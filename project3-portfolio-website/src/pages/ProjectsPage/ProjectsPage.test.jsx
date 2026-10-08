import { screen, within } from "@testing-library/react";
import { projects } from "../../data/projects.js";
import { renderWithRouter } from "../../test/renderWithRouter.jsx";

describe("ProjectsPage", () => {
  it("has the heading and an intro", () => {
    renderWithRouter(["/projects"]);
    const main = within(screen.getByRole("main"));

    expect(
      main.getByRole("heading", { level: 1, name: "Projects" }),
    ).toBeInTheDocument();
    expect(
      main.getByText(new RegExp(`${projects.length} projects`)),
    ).toBeInTheDocument();
  });

  it("shows a card for every project, newest first", () => {
    renderWithRouter(["/projects"]);
    const main = within(screen.getByRole("main"));

    const titles = main
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent);
    expect(titles).toEqual(projects.map((project) => project.title));
  });
});
