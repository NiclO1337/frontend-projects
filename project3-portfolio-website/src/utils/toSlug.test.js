import { toSlug } from "./toSlug.js";

describe("toSlug", () => {
  it.each([
    ["HTML", "html"],
    ["Entity Framework", "entity-framework"],
    ["Next.js", "next-js"],
    ["  PostgreSQL  ", "postgresql"],
  ])("turns %j into %j", (text, slug) => {
    expect(toSlug(text)).toBe(slug);
  });

  it("spells out # and + so C#, C++ and C stay different", () => {
    expect(toSlug("C#")).toBe("c-sharp");
    expect(toSlug("C++")).toBe("c-plus-plus");
    expect(toSlug("C")).toBe("c");
  });
});
