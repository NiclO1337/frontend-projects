import { render, screen } from "@testing-library/react";
import { EffectsProvider } from "../../context/EffectsProvider.jsx";
import { mockMatchMedia } from "../../test/mockMatchMedia.js";
import BentoTile from "./BentoTile.jsx";

// The tile has a Spotlight in it, which reads the effects setting, so it needs
// the provider around it.
function renderTile(tile) {
  return render(<EffectsProvider>{tile}</EffectsProvider>);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("BentoTile", () => {
  it("renders its content, with the title as a level 2 heading", () => {
    renderTile(
      <BentoTile title="Currently">
        <p>Learning C#</p>
      </BentoTile>,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Currently" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Learning C#")).toBeInTheDocument();
  });

  it("can use a different heading level for the title", () => {
    renderTile(<BentoTile title="Tools" headingLevel={3} />);

    expect(
      screen.getByRole("heading", { level: 3, name: "Tools" }),
    ).toBeInTheDocument();
  });

  it("has no heading when no title is given", () => {
    renderTile(
      <BentoTile>
        <p>Just content</p>
      </BentoTile>,
    );

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByText("Just content")).toBeInTheDocument();
  });

  it("has a spotlight that follows the mouse when the effects are on", () => {
    mockMatchMedia({ "(hover: hover) and (pointer: fine)": true });
    const { container } = renderTile(<BentoTile>Content</BentoTile>);

    expect(container.firstElementChild.firstElementChild).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
