import { render, screen, within } from "@testing-library/react";
import { skillGroups } from "../../data/skills.js";
import TechMarquee from "./TechMarquee.jsx";

describe("TechMarquee", () => {
  it("lists the technologies and frameworks from the skills data", () => {
    render(<TechMarquee />);

    const expected = skillGroups
      .filter((group) => ["technologies", "frameworks"].includes(group.id))
      .flatMap((group) => group.items.map((item) => item.name));

    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual(expected);
  });

  it("hides the repeated copy from screen readers", () => {
    render(<TechMarquee />);

    // Two lists exist in the page, but only one is exposed to assistive tech.
    expect(screen.getAllByRole("list", { hidden: true })).toHaveLength(2);
    expect(screen.getAllByRole("list")).toHaveLength(1);
  });
});
