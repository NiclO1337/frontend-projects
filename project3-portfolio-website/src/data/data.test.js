import { education } from "./education.js";
import { experience } from "./experience.js";
import { profile } from "./profile.js";
import { projects } from "./projects.js";
import { skillGroups } from "./skills.js";

// Components use `id` as the React `key` and rely on the order of the lists,
// so these checks protect the assumptions the rendering code makes.
describe("data files", () => {
  it("has unique ids in every list that is rendered with .map", () => {
    const lists = {
      "skill groups": skillGroups,
      experience,
      education,
      "social links": profile.social,
    };

    for (const [label, list] of Object.entries(lists)) {
      const ids = list.map((entry) => entry.id);
      expect(new Set(ids).size, `duplicate id in ${label}`).toBe(ids.length);
    }
  });

  it("gives every skill a name and an icon component", () => {
    for (const group of skillGroups) {
      expect(group.items.length).toBeGreaterThan(0);
      for (const item of group.items) {
        expect(item.name).toBeTruthy();
        // Icon components from react-icons are plain functions.
        expect(item.icon, `no icon for ${item.name}`).toBeTypeOf("function");
      }
    }
  });

  it.each([
    ["experience", experience],
    ["education", education],
  ])("lists %s newest first, with at least one bullet each", (_label, list) => {
    const starts = list.map((entry) => entry.start);
    expect(starts).toEqual([...starts].sort((a, b) => b - a));

    for (const entry of list) {
      expect(entry.bullets.length).toBeGreaterThan(0);
    }
  });

  describe("projects", () => {
    it("has unique, URL-friendly slugs", () => {
      const slugs = projects.map((project) => project.slug);

      expect(new Set(slugs).size).toBe(slugs.length);
      for (const slug of slugs) {
        expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      }
    });

    it("lists the projects newest first", () => {
      const years = projects.map((project) => project.year);

      expect(years).toEqual([...years].sort((a, b) => b - a));
    });

    it("has exactly one featured project (shown on the Home page)", () => {
      expect(projects.filter((project) => project.featured)).toHaveLength(1);
    });

    it("gives every project everything the cards and detail page show", () => {
      for (const project of projects) {
        const label = project.slug;

        expect(project.title, label).toBeTruthy();
        expect(project.type, label).toBeTruthy();
        expect(project.summary, label).toBeTruthy();
        expect(project.description.length, label).toBeGreaterThan(0);
        expect(project.highlights.length, label).toBeGreaterThan(0);
        expect(project.tech.length, label).toBeGreaterThan(0);
        // Images are imported, so they arrive here as a URL string.
        expect(project.image, label).toBeTypeOf("string");
        expect(project.imageAlt, label).toBeTruthy();
      }
    });

    it("only uses https links, and github.com for the repository", () => {
      for (const project of projects) {
        // Both links are optional (not deployed, or a private repository).
        if (project.liveUrl) {
          expect(project.liveUrl, project.slug).toMatch(/^https:\/\//);
        }
        if (project.repoUrl) {
          expect(project.repoUrl, project.slug).toMatch(
            /^https:\/\/github\.com\//,
          );
        }
      }
    });
  });

  it("has external social links over https and no email or phone", () => {
    for (const link of profile.social) {
      expect(link.url).toMatch(/^https:\/\//);
    }
    expect(JSON.stringify(profile)).not.toMatch(/mailto:|@|\+46|tel:/);
  });
});
