import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectFilter from "./ProjectFilter.jsx";

const technologies = ["Python", "React", "Next.js"];

function renderFilter({ selected = null, onChange = vi.fn() } = {}) {
  render(
    <ProjectFilter
      technologies={technologies}
      selected={selected}
      onChange={onChange}
    />,
  );
  return { onChange };
}

describe("ProjectFilter", () => {
  it("is a labelled group with an All chip and a chip for every technology", () => {
    renderFilter();

    const group = screen.getByRole("group", { name: "Filter by technology" });
    const chips = within(group).getAllByRole("button");
    expect(chips.map((chip) => chip.textContent)).toEqual([
      "All",
      "Python",
      "React",
      "Next.js",
    ]);
  });

  it("marks All as pressed when nothing is selected", () => {
    renderFilter({ selected: null });

    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Python" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("marks only the selected technology as pressed", () => {
    renderFilter({ selected: "next-js" });

    expect(screen.getByRole("button", { name: "Next.js" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("reports the slug of a clicked technology, and null for All", async () => {
    const user = userEvent.setup();
    const { onChange } = renderFilter({ selected: "python" });

    await user.click(screen.getByRole("button", { name: "Next.js" }));
    expect(onChange).toHaveBeenLastCalledWith("next-js");

    await user.click(screen.getByRole("button", { name: "All" }));
    expect(onChange).toHaveBeenLastCalledWith(null);
  });
});
