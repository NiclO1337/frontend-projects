import { existsSync } from "node:fs";
import { join } from "node:path";
import { toSlug } from "../utils/toSlug.js";
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

  // Some lists have no id, so the text itself is the React `key`. Two equal
  // texts in one list would give React two children with the same key.
  it("has no repeated text in lists where the text is the key", () => {
    const lists = {
      "about paragraphs": profile.about,
      "language names": profile.languages.map((language) => language.name),
      // The Home page marquee shows the skills of two groups in one list, so
      // every skill name must be different, not only within its own group.
      "skill names": skillGroups.flatMap((group) =>
        group.items.map((item) => item.name),
      ),
    };
    for (const entry of [...experience, ...education]) {
      lists[`bullets of ${entry.id}`] = entry.bullets;
    }
    for (const project of projects) {
      lists[`tech of ${project.slug}`] = project.tech;
      lists[`description of ${project.slug}`] = project.description;
      lists[`highlights of ${project.slug}`] = project.highlights;
    }

    for (const [label, list] of Object.entries(lists)) {
      expect(new Set(list).size, `repeated text in ${label}`).toBe(list.length);
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
        // WAVE flags alt text over 100 characters as "long alternative text".
        expect(project.imageAlt.length, label).toBeLessThanOrEqual(100);
      }
    });

    it("only offers filters for technologies the project shows in `tech`", () => {
      for (const project of projects) {
        expect(project.filters.length, project.slug).toBeGreaterThan(0);
        for (const name of project.filters) {
          expect(project.tech, project.slug).toContain(name);
        }
      }
    });

    it("gives every filter technology its own URL slug", () => {
      // The filter keeps the choice in the URL as a slug. If two names gave
      // the same slug, choosing one chip would also select the other.
      const names = [
        ...new Set(projects.flatMap((project) => project.filters)),
      ];
      const slugs = names.map(toSlug);

      for (const slug of slugs) {
        expect(slug).not.toBe("");
      }
      expect(new Set(slugs).size, `same slug for: ${names}`).toBe(names.length);
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

    it("has links that can be read as URLs", () => {
      // The prefix check above accepts a typo like "https://". Such a link
      // would be broken, and getHostName could not name its host.
      for (const project of projects) {
        for (const url of [project.liveUrl, project.repoUrl]) {
          if (url)
            expect(URL.canParse(url), `${project.slug}: ${url}`).toBe(true);
        }
      }
    });
  });

  it("points the CV link at a file that exists", () => {
    // The file is in public/, so the path starts at the site root. A wrong
    // name would only show up as a dead "Download CV" button on the live site.
    // The path is worked out from this file location: src/data/ -> public/.
    const cvFile = join(import.meta.dirname, "../../public", profile.cvPath);

    expect(existsSync(cvFile)).toBe(true);
  });

  it("has the GitHub and LinkedIn profiles that other parts of the site look up by id", () => {
    // The contact form's error message finds LinkedIn by this id.
    const ids = profile.social.map((link) => link.id);

    expect(ids).toContain("github");
    expect(ids).toContain("linkedin");
  });

  it("has external social links over https and no email or phone", () => {
    for (const link of profile.social) {
      expect(link.url).toMatch(/^https:\/\//);
    }
    expect(JSON.stringify(profile)).not.toMatch(/mailto:|@|\+46|tel:/);
  });
});
