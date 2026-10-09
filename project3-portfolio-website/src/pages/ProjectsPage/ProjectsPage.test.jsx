import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { projects } from "../../data/projects.js";
import { renderWithRouter } from "../../test/renderWithRouter.jsx";

const getCardTitles = () =>
  within(screen.getByRole("main"))
    .getAllByRole("heading", { level: 2 })
    .map((heading) => heading.textContent);

const pythonProjects = projects.filter((project) =>
  project.tech.includes("Python"),
);

describe("ProjectsPage", () => {
  it("has the heading and an intro", () => {
    renderWithRouter(["/projects"]);
    const main = within(screen.getByRole("main"));

    expect(
      main.getByRole("heading", { level: 1, name: "Projects" }),
    ).toBeInTheDocument();
    // The count sits in its own <span> for styling, so the paragraph's own
    // text starts after it.
    const intro = main.getByText(/projects from my studies/);
    expect(
      within(intro).getByText(String(projects.length).padStart(2, "0")),
    ).toBeInTheDocument();
  });

  it("shows a card for every project, newest first", () => {
    renderWithRouter(["/projects"]);

    expect(getCardTitles()).toEqual(projects.map((project) => project.title));
    expect(
      screen.getByText(
        `Showing ${projects.length} of ${projects.length} projects`,
      ),
    ).toBeInTheDocument();
  });

  it("filters by technology, and keeps the choice in the URL", async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouter(["/projects"]);

    await user.click(screen.getByRole("button", { name: "Python" }));

    expect(router.state.location.search).toBe("?tech=python");
    expect(getCardTitles()).toEqual(
      pythonProjects.map((project) => project.title),
    );
    expect(
      screen.getByText(
        `Showing ${pythonProjects.length} of ${projects.length} projects`,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Python" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("starts filtered when the URL already has a technology", () => {
    renderWithRouter(["/projects?tech=python"]);

    expect(getCardTitles()).toEqual(
      pythonProjects.map((project) => project.title),
    );
    expect(screen.getByRole("button", { name: "Python" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("shows every project again with the All chip, and clears the URL", async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouter(["/projects?tech=python"]);

    await user.click(screen.getByRole("button", { name: "All" }));

    expect(router.state.location.search).toBe("");
    expect(getCardTitles()).toHaveLength(projects.length);
  });

  it("explains when no project uses the technology, and offers to show all", async () => {
    const user = userEvent.setup();
    renderWithRouter(["/projects?tech=cobol"]);

    expect(
      screen.getByText("No projects use that technology."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Showing 0 of ${projects.length} projects`),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Show all projects" }));

    expect(getCardTitles()).toHaveLength(projects.length);
  });
});
