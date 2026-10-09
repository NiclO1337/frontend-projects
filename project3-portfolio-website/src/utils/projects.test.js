import {
  filterProjectsByTech,
  getAdjacentProjects,
  getHostName,
  getProjectBySlug,
  getTechList,
} from "./projects.js";

// A small made-up list, so the tests don't depend on the real projects.
// "Vite" and "Jupyter" are in `tech` only: shown on a card, but not a filter.
const list = [
  {
    slug: "newest",
    tech: ["React", "Next.js", "Vite"],
    filters: ["React", "Next.js"],
  },
  {
    slug: "middle",
    tech: ["Python", "React", "CSS"],
    filters: ["Python", "React", "CSS"],
  },
  {
    slug: "oldest",
    tech: ["Python", "HTML", "Jupyter"],
    filters: ["Python", "HTML"],
  },
];

describe("getProjectBySlug", () => {
  it("finds a project by its slug", () => {
    expect(getProjectBySlug("middle", list)).toBe(list[1]);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProjectBySlug("nope", list)).toBeUndefined();
  });
});

describe("getTechList", () => {
  it("lists every filter technology once, most used first, then alphabetically", () => {
    // React and Python are used twice. The rest are used once.
    expect(getTechList(list)).toEqual([
      "Python",
      "React",
      "CSS",
      "HTML",
      "Next.js",
    ]);
  });

  it("leaves out technologies that are not in any project's filters", () => {
    expect(getTechList(list)).not.toContain("Vite");
    expect(getTechList(list)).not.toContain("Jupyter");
  });

  it("returns an empty list when there are no projects", () => {
    expect(getTechList([])).toEqual([]);
  });
});

describe("filterProjectsByTech", () => {
  it("returns every project when no technology is chosen", () => {
    expect(filterProjectsByTech(list, null)).toEqual(list);
    expect(filterProjectsByTech(list, "")).toEqual(list);
  });

  it("returns the projects that use the technology", () => {
    expect(filterProjectsByTech(list, "python").map((p) => p.slug)).toEqual([
      "middle",
      "oldest",
    ]);
  });

  it("matches on the slug, so next-js finds Next.js", () => {
    expect(filterProjectsByTech(list, "next-js").map((p) => p.slug)).toEqual([
      "newest",
    ]);
  });

  it("returns an empty list for a technology nobody uses", () => {
    expect(filterProjectsByTech(list, "cobol")).toEqual([]);
  });

  it("only matches the filters, not the rest of a project's tech", () => {
    // "newest" lists Vite in `tech`, but Vite is not one of its filters.
    expect(filterProjectsByTech(list, "vite")).toEqual([]);
  });
});

describe("getHostName", () => {
  it.each([
    ["https://frontend-projects-project1-modern-c.vercel.app/", "Vercel"],
    ["https://niclo1337.github.io/pp2-playtime/", "GitHub Pages"],
    ["https://banana-palace-9ad263ab8cf3.herokuapp.com/", "Heroku"],
  ])("recognises %s as %s", (url, name) => {
    expect(getHostName(url)).toBe(name);
  });

  it("returns undefined for an unknown host or a missing URL", () => {
    expect(getHostName("https://example.com/")).toBeUndefined();
    // Only a real subdomain counts, not a lookalike ending in the same text.
    expect(getHostName("https://notvercel.app/")).toBeUndefined();
    expect(getHostName(undefined)).toBeUndefined();
  });
});

describe("getAdjacentProjects", () => {
  it("returns the project before and after", () => {
    expect(getAdjacentProjects("middle", list)).toEqual({
      previous: list[0],
      next: list[2],
    });
  });

  it("wraps around at both ends", () => {
    expect(getAdjacentProjects("newest", list).previous).toBe(list[2]);
    expect(getAdjacentProjects("oldest", list).next).toBe(list[0]);
  });

  it("returns nothing for an unknown slug", () => {
    expect(getAdjacentProjects("nope", list)).toEqual({
      previous: null,
      next: null,
    });
  });
});
