import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { projects } from "../../data/projects.js";
import { renderWithRouter } from "../../test/renderWithRouter.jsx";
import { getAdjacentProjects } from "../../utils/projects.js";
import ProjectDetailPage from "./ProjectDetailPage.jsx";

const project = projects.find((p) => p.slug === "banana-palace");

// A route with a loader starts up asynchronously: the router runs the loader
// first and only then renders the page. So wait for the page's heading.
async function renderProjectPage(url = `/projects/${project.slug}`) {
  const result = renderWithRouter([url]);
  await screen.findByRole("heading", { level: 1 });
  return result;
}

describe("ProjectDetailPage", () => {
  it("shows everything about the project", async () => {
    await renderProjectPage();
    const main = within(screen.getByRole("main"));

    expect(
      main.getByRole("heading", { level: 1, name: project.title }),
    ).toBeInTheDocument();
    expect(
      main.getByText(`${project.year} · ${project.type}`),
    ).toBeInTheDocument();
    expect(
      main.getByRole("img", { name: project.imageAlt }),
    ).toBeInTheDocument();
    for (const paragraph of project.description) {
      expect(main.getByText(paragraph)).toBeInTheDocument();
    }
    for (const highlight of project.highlights) {
      expect(main.getByText(highlight)).toBeInTheDocument();
    }
    for (const name of project.tech) {
      expect(main.getByText(name)).toBeInTheDocument();
    }
  });

  it("links to the live demo and the source code, opening new tabs", async () => {
    await renderProjectPage();
    const main = within(screen.getByRole("main"));

    const live = main.getByRole("link", { name: /live demo/i });
    expect(live).toHaveAttribute("href", project.liveUrl);
    expect(live).toHaveAttribute("target", "_blank");

    const code = main.getByRole("link", { name: /source code/i });
    expect(code).toHaveAttribute("href", project.repoUrl);
    expect(code).toHaveAttribute("target", "_blank");
  });

  it("leaves out those buttons for a project without a live demo or public repo", async () => {
    // Render the page with a made-up loader result instead of the real one.
    const router = createMemoryRouter(
      [
        {
          path: "/projects/:slug",
          element: <ProjectDetailPage />,
          loader: () => ({
            ...project,
            liveUrl: undefined,
            repoUrl: undefined,
          }),
        },
      ],
      { initialEntries: [`/projects/${project.slug}`] },
    );
    render(<RouterProvider router={router} />);
    await screen.findByRole("heading", { level: 1, name: project.title });

    expect(
      screen.queryByRole("link", { name: /live demo/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /source code/i }),
    ).not.toBeInTheDocument();
  });

  it("has a back link to the projects list", async () => {
    await renderProjectPage();

    expect(
      within(screen.getByRole("main")).getByRole("link", {
        name: /all projects/i,
      }),
    ).toHaveAttribute("href", "/projects");
  });

  it("goes back to the same filter the visitor came from", async () => {
    const user = userEvent.setup();
    renderWithRouter(["/projects?tech=python"]);

    await user.click(
      screen.getByRole("link", { name: `Details of ${project.title}` }),
    );
    await screen.findByRole("heading", { level: 1, name: project.title });

    expect(screen.getByRole("link", { name: /all projects/i })).toHaveAttribute(
      "href",
      "/projects?tech=python",
    );
  });

  it("links to the previous and next project, and follows them", async () => {
    const user = userEvent.setup();
    const { router } = await renderProjectPage();
    const { previous, next } = getAdjacentProjects(project.slug);
    const pager = within(
      screen.getByRole("navigation", { name: "More projects" }),
    );

    expect(
      pager.getByRole("link", { name: new RegExp(previous.title) }),
    ).toHaveAttribute("href", `/projects/${previous.slug}`);

    await user.click(pager.getByRole("link", { name: new RegExp(next.title) }));
    await screen.findByRole("heading", { level: 1, name: next.title });

    expect(router.state.location.pathname).toBe(`/projects/${next.slug}`);
  });

  it("shows the not-found page inside the normal layout for an unknown project", async () => {
    renderWithRouter(["/projects/no-such-project"]);

    expect(
      await screen.findByRole("heading", { level: 1, name: /404/i }),
    ).toBeInTheDocument();
    // The sidebar navigation is still there.
    expect(
      screen.getByRole("navigation", { name: "Main" }),
    ).toBeInTheDocument();
  });
});
