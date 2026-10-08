import { render, screen, within } from "@testing-library/react";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { EffectsProvider } from "../../context/EffectsProvider.jsx";
import ProjectCard from "./ProjectCard.jsx";

// A made-up project, so the test doesn't break when the real data changes.
const project = {
  slug: "demo-app",
  title: "Demo App",
  year: 2025,
  type: "Personal project",
  summary: "A small app for testing.",
  tech: ["React", "Vitest"],
  image: "/demo.webp",
  imageAlt: "Demo App on a phone",
  liveUrl: "https://demo.example.com",
  repoUrl: "https://github.com/someone/demo-app",
};

// The card has a router <Link> in it, so it needs a router around it, and it
// reads the effects setting, so it needs the provider too.
// `overrides` changes fields of the project above for a single test.
function renderCard(overrides = {}) {
  const router = createMemoryRouter([
    {
      path: "*",
      element: <ProjectCard project={{ ...project, ...overrides }} />,
    },
  ]);
  render(
    <EffectsProvider>
      <RouterProvider router={router} />
    </EffectsProvider>,
  );
}

describe("ProjectCard", () => {
  it("shows the title, year, type and summary", () => {
    renderCard();

    expect(
      screen.getByRole("heading", { level: 2, name: "Demo App" }),
    ).toBeInTheDocument();
    expect(screen.getByText("2025 · Personal project")).toBeInTheDocument();
    expect(screen.getByText("A small app for testing.")).toBeInTheDocument();
  });

  it("shows the screenshot with its alt text", () => {
    renderCard();

    expect(
      screen.getByRole("img", { name: "Demo App on a phone" }),
    ).toHaveAttribute("src", "/demo.webp");
  });

  it("lists every technology as a tag", () => {
    renderCard();

    const tags = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(tags.map((tag) => tag.textContent)).toEqual(["React", "Vitest"]);
  });

  it("links to the detail page, and to the live demo and code in new tabs", () => {
    renderCard();

    expect(
      screen.getByRole("link", { name: /details of demo app/i }),
    ).toHaveAttribute("href", "/projects/demo-app");

    const live = screen.getByRole("link", { name: /live demo of demo app/i });
    expect(live).toHaveAttribute("href", "https://demo.example.com");
    expect(live).toHaveAttribute("target", "_blank");

    const code = screen.getByRole("link", { name: /code of demo app/i });
    expect(code).toHaveAttribute("href", "https://github.com/someone/demo-app");
    expect(code).toHaveAttribute("target", "_blank");
  });

  it("leaves out the live demo button when the project is not deployed", () => {
    renderCard({ liveUrl: undefined });

    expect(
      screen.queryByRole("link", { name: /live demo/i }),
    ).not.toBeInTheDocument();
    // The other links are still there.
    expect(
      screen.getByRole("link", { name: /code of demo app/i }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /details of demo app/i }),
    ).toBeVisible();
  });

  it("leaves out the GitHub button when the repository is private", () => {
    renderCard({ repoUrl: undefined });

    expect(
      screen.queryByRole("link", { name: /code of/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /live demo of demo app/i }),
    ).toBeVisible();
  });
});
