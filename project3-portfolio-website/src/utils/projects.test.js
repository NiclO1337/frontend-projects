import {
  filterProjectsByTech,
  getAdjacentProjects,
  getProjectBySlug,
  getTechList,
} from "./projects.js";

// A small made-up list, so the tests don't depend on the real projects.
const list = [
  { slug: "newest", tech: ["React", "Next.js"] },
  { slug: "middle", tech: ["Python", "React", "CSS"] },
  { slug: "oldest", tech: ["Python", "HTML"] },
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
  it("lists every technology once, most used first, then alphabetically", () => {
    // React and Python are used twice. The rest are used once.
    expect(getTechList(list)).toEqual([
      "Python",
      "React",
      "CSS",
      "HTML",
      "Next.js",
    ]);
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
