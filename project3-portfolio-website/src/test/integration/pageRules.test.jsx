import { screen } from "@testing-library/react";
import { projects } from "../../data/projects.js";
import { renderWithRouter } from "../renderWithRouter.jsx";

// The code standards say every page needs one <h1>, a logical heading order,
// alt text on images, labels on controls and so on. A unit test checks one
// component. These tests visit every page through the real routes, so a page
// or a data change that breaks a rule is found wherever it happens.

const urls = [
  "/",
  "/about",
  "/resume",
  "/projects",
  ...projects.map((project) => `/projects/${project.slug}`),
  "/contact",
  "/no-such-page",
];

// Renders a page and waits until it is there (project pages load first).
async function openPage(url) {
  const result = renderWithRouter([url]);
  await screen.findByRole("heading", { level: 1 });
  return result;
}

describe.each(urls)("page %s", (url) => {
  beforeEach(() => openPage(url));

  it("has one <h1>, and no heading level is skipped", () => {
    const levels = screen
      .getAllByRole("heading")
      .map((heading) => Number(heading.tagName.slice(1)));

    expect(levels.filter((level) => level === 1)).toHaveLength(1);
    expect(levels[0], "the page starts with its <h1>").toBe(1);
    levels.forEach((level, index) => {
      if (index > 0) {
        expect(level, `heading levels: ${levels}`).toBeLessThanOrEqual(
          levels[index - 1] + 1,
        );
      }
    });
  });

  it("has one main landmark, and the skip link leads to it", () => {
    const main = screen.getByRole("main");

    const skipLink = screen.getByRole("link", { name: /skip to main/i });
    expect(skipLink.hash).toBe(`#${main.id}`);
  });

  it("uses no id twice", () => {
    const ids = [...document.querySelectorAll("[id]")].map((el) => el.id);

    const repeated = ids.filter((id, index) => ids.indexOf(id) !== index);
    expect(repeated).toEqual([]);
  });

  it("gives every image alt text", () => {
    for (const image of document.querySelectorAll("img")) {
      expect(image.getAttribute("alt"), image.src).toBeTruthy();
    }
  });

  it("gives every link, button and form field a name", () => {
    // The hidden spam-trap checkbox is left out on purpose: it is hidden from
    // screen readers, so it has no accessible name to check.
    const controls = [
      ...screen.getAllByRole("link"),
      ...screen.getAllByRole("button"),
      ...document.querySelectorAll(
        'input:not([aria-hidden="true"]), textarea, select',
      ),
    ];

    for (const control of controls) {
      expect(control, control.outerHTML).toHaveAccessibleName();
    }
  });

  it("opens every link to another site in a new tab that cannot reach this page", () => {
    for (const link of document.querySelectorAll('a[href^="http"]')) {
      expect(link, link.href).toHaveAttribute("target", "_blank");
      expect(link.getAttribute("rel"), link.href).toMatch(/noopener/);
    }
  });
});

describe("all pages", () => {
  it("each have their own title", async () => {
    const titles = [];

    for (const url of urls) {
      const { unmount } = await openPage(url);
      titles.push(document.title);
      unmount();
    }

    const repeated = titles.filter((title, i) => titles.indexOf(title) !== i);
    expect(repeated).toEqual([]);
  });
});
