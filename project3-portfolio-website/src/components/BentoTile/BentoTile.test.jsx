import { render, screen } from "@testing-library/react";
import BentoTile from "./BentoTile.jsx";

describe("BentoTile", () => {
  it("renders its content, with the title as a level 2 heading", () => {
    render(
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
    render(<BentoTile title="Tools" headingLevel={3} />);

    expect(
      screen.getByRole("heading", { level: 3, name: "Tools" }),
    ).toBeInTheDocument();
  });

  it("has no heading when no title is given", () => {
    render(
      <BentoTile>
        <p>Just content</p>
      </BentoTile>,
    );

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByText("Just content")).toBeInTheDocument();
  });
});
