import { render, screen, within } from "@testing-library/react";
import SkillGroup from "./SkillGroup.jsx";

// A stand-in for an icon component from react-icons.
function TestIcon(props) {
  return <svg data-testid="icon" {...props} />;
}

const items = [
  { name: "Git", icon: TestIcon },
  { name: "GitHub", icon: TestIcon },
];

describe("SkillGroup", () => {
  it("shows the group name as a heading and every skill as a list item", () => {
    render(<SkillGroup name="Version control" items={items} />);

    expect(
      screen.getByRole("heading", { level: 3, name: "Version control" }),
    ).toBeInTheDocument();

    const skills = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(skills.map((skill) => skill.textContent)).toEqual(["Git", "GitHub"]);
  });

  it("hides the decorative icons from screen readers", () => {
    render(<SkillGroup name="Version control" items={items} />);

    for (const icon of screen.getAllByTestId("icon")) {
      expect(icon).toHaveAttribute("aria-hidden", "true");
    }
  });
});
