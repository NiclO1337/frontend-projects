import { render, screen, within } from "@testing-library/react";
import { skillGroups } from "../../data/skills.js";
import TechMarquee from "./TechMarquee.jsx";

const getNames = (list) =>
  within(list)
    .getAllByRole("listitem", { hidden: true })
    .map((item) => item.textContent);

describe("TechMarquee", () => {
  it("lists the technologies and frameworks from the skills data", () => {
    render(<TechMarquee />);

    const expected = skillGroups
      .filter((group) => ["technologies", "frameworks"].includes(group.id))
      .flatMap((group) => group.items.map((item) => item.name));

    // The order is random, so compare the items without caring about order.
    expect(getNames(screen.getByRole("list")).sort()).toEqual(expected.sort());
  });

  it("hides the repeated copy from screen readers", () => {
    render(<TechMarquee />);

    // Two lists exist in the page, but only one is exposed to assistive tech.
    expect(screen.getAllByRole("list", { hidden: true })).toHaveLength(2);
    expect(screen.getAllByRole("list")).toHaveLength(1);
  });

  it("uses the same order in both copies, so the loop has no seam", () => {
    render(<TechMarquee />);

    const [original, copy] = screen.getAllByRole("list", { hidden: true });

    expect(getNames(copy)).toEqual(getNames(original));
  });
});
