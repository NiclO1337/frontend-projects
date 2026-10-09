import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { projects } from "../../data/projects.js";
import { getAdjacentProjects } from "../../utils/projects.js";
import { renderWithRouter } from "../renderWithRouter.jsx";

// The visitor's path through the projects: filter the list, open a card, read
// the detail page, go back. Each unit test covers one piece of this. Here we
// check that the pieces hand the filter to each other correctly.

const pythonProjects = projects.filter((project) =>
  project.filters.includes("Python"),
);
const [firstPythonProject] = pythonProjects;

const getCardTitles = () =>
  within(screen.getByRole("main"))
    .getAllByRole("heading", { level: 2 })
    .map((heading) => heading.textContent);

// Every card has a "Details" link whose hidden text holds the project title.
const openCard = (user, project) =>
  user.click(screen.getByRole("link", { name: `Details of ${project.title}` }));

const expectPythonListShown = () => {
  expect(screen.getByRole("button", { name: "Python" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(getCardTitles()).toEqual(
    pythonProjects.map((project) => project.title),
  );
};

describe("projects flow", () => {
  it("filters, opens a card, and returns to the same filter", async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouter(["/projects"]);

    await user.click(screen.getByRole("button", { name: "Python" }));
    expect(router.state.location.search).toBe("?tech=python");
    expect(getCardTitles()).toHaveLength(pythonProjects.length);

    await openCard(user, firstPythonProject);
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: firstPythonProject.title,
      }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe(
      `/projects/${firstPythonProject.slug}`,
    );

    await user.click(screen.getByRole("link", { name: "All projects" }));

    expect(
      await screen.findByRole("heading", { level: 1, name: "Projects" }),
    ).toBeInTheDocument();
    expect(router.state.location.search).toBe("?tech=python");
    expectPythonListShown();
  });

  it("returns to the full list when the detail page was opened directly", async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouter([
      `/projects/${firstPythonProject.slug}`,
    ]);
    await screen.findByRole("heading", {
      level: 1,
      name: firstPythonProject.title,
    });

    await user.click(screen.getByRole("link", { name: "All projects" }));

    expect(
      await screen.findByRole("heading", { level: 1, name: "Projects" }),
    ).toBeInTheDocument();
    // A deep link carries no filter, so there is nothing to keep.
    expect(router.state.location.search).toBe("");
    expect(getCardTitles()).toHaveLength(projects.length);
  });

  it("keeps the filter for the back link while moving between projects", async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouter(["/projects?tech=python"]);
    await openCard(user, firstPythonProject);
    await screen.findByRole("heading", {
      level: 1,
      name: firstPythonProject.title,
    });

    const { next } = getAdjacentProjects(firstPythonProject.slug);
    await user.click(screen.getByRole("link", { name: /next project/i }));
    expect(
      await screen.findByRole("heading", { level: 1, name: next.title }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "All projects" }));

    await screen.findByRole("heading", { level: 1, name: "Projects" });
    expect(router.state.location.search).toBe("?tech=python");
    expectPythonListShown();
  });

  it("wraps around: 'Previous project' on the first project opens the last", async () => {
    const user = userEvent.setup();
    renderWithRouter([`/projects/${projects[0].slug}`]);
    await screen.findByRole("heading", { level: 1, name: projects[0].title });

    await user.click(screen.getByRole("link", { name: /previous project/i }));

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: projects.at(-1).title,
      }),
    ).toBeInTheDocument();
  });

  it("the browser's back button undoes the filter and the opened card", async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouter(["/projects"]);
    await user.click(screen.getByRole("button", { name: "Python" }));
    await openCard(user, firstPythonProject);
    await screen.findByRole("heading", {
      level: 1,
      name: firstPythonProject.title,
    });

    // router.navigate(-1) is what the browser's back button does.
    await act(() => router.navigate(-1));
    expectPythonListShown();

    await act(() => router.navigate(-1));
    expect(router.state.location.search).toBe("");
    expect(getCardTitles()).toHaveLength(projects.length);
  });
});
