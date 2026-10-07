import { education } from "./education.js";
import { experience } from "./experience.js";
import { profile } from "./profile.js";
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

  it("has external social links over https and no email or phone", () => {
    for (const link of profile.social) {
      expect(link.url).toMatch(/^https:\/\//);
    }
    expect(JSON.stringify(profile)).not.toMatch(/mailto:|@|\+46|tel:/);
  });
});
