import { render, screen, within } from "@testing-library/react";
import { EffectsProvider } from "../../context/EffectsProvider.jsx";
import SkillGroup from "./SkillGroup.jsx";

// A stand-in for an icon component from react-icons.
function TestIcon(props) {
  return <svg data-testid="icon" {...props} />;
}

const items = [
  { name: "Git", icon: TestIcon },
  { name: "GitHub", icon: TestIcon },
];

// SkillGroup is a BentoTile, which has a Spotlight and so needs the provider.
function renderGroup() {
  render(
    <EffectsProvider>
      <SkillGroup name="Version control" items={items} />
    </EffectsProvider>,
  );
}

describe("SkillGroup", () => {
  it("shows the group name as a heading and every skill as a list item", () => {
    renderGroup();

    expect(
      screen.getByRole("heading", { level: 3, name: "Version control" }),
    ).toBeInTheDocument();

    const skills = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(skills.map((skill) => skill.textContent)).toEqual(["Git", "GitHub"]);
  });

  it("hides the decorative icons from screen readers", () => {
    renderGroup();

    for (const icon of screen.getAllByTestId("icon")) {
      expect(icon).toHaveAttribute("aria-hidden", "true");
    }
  });
});
