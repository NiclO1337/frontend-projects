import { render, screen } from "@testing-library/react";
import Timeline from "./Timeline.jsx";

const entries = [
  {
    id: "newer",
    title: "Developer",
    organisation: "Acme",
    location: "Stockholm, Sweden",
    start: 2026,
    end: null,
    bullets: ["Built things", "Fixed things"],
  },
  {
    id: "older",
    title: "Coordinator",
    organisation: "Initech",
    start: 2013,
    end: 2024,
    bullets: ["Coordinated things"],
  },
];

describe("Timeline", () => {
  it("renders the entries in the order given", () => {
    render(<Timeline entries={entries} />);

    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings.map((heading) => heading.textContent)).toEqual([
      "Developer",
      "Coordinator",
    ]);
  });

  it("shows each period with <time> elements, and Ongoing when there is no end", () => {
    render(<Timeline entries={entries} />);

    const start = screen.getByText("2013");
    const end = screen.getByText("2024");
    expect(start.tagName).toBe("TIME");
    expect(start).toHaveAttribute("datetime", "2013");
    expect(end.tagName).toBe("TIME");
    expect(end).toHaveAttribute("datetime", "2024");

    // The newer entry has no end year.
    expect(screen.getByText("2026").tagName).toBe("TIME");
    expect(screen.getByText(/ongoing/i)).toBeInTheDocument();
  });

  it("shows the organisation, the location when known, and the bullets", () => {
    render(<Timeline entries={entries} />);

    expect(screen.getByText("Acme · Stockholm, Sweden")).toBeInTheDocument();
    // No location for this one, so no separator.
    expect(screen.getByText("Initech")).toBeInTheDocument();
    expect(screen.getByText("Built things")).toBeInTheDocument();
    expect(screen.getByText("Fixed things")).toBeInTheDocument();
  });
});
