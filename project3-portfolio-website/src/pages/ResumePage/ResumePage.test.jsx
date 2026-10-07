import { screen, within } from "@testing-library/react";
import { education } from "../../data/education.js";
import { experience } from "../../data/experience.js";
import { profile } from "../../data/profile.js";
import { renderWithRouter } from "../../test/renderWithRouter.jsx";

describe("ResumePage", () => {
  it("has the heading and a CV download button", () => {
    renderWithRouter(["/resume"]);
    const main = within(screen.getByRole("main"));

    expect(
      main.getByRole("heading", { level: 1, name: "Resume" }),
    ).toBeInTheDocument();

    const cvLink = main.getByRole("link", { name: "Download CV" });
    expect(cvLink).toHaveAttribute("href", profile.cvPath);
    expect(cvLink).toHaveAttribute("download");
  });

  it("lists experience and education, newest first, under their own headings", () => {
    renderWithRouter(["/resume"]);
    const main = within(screen.getByRole("main"));

    expect(
      main.getByRole("heading", { level: 2, name: "Experience" }),
    ).toBeInTheDocument();
    expect(
      main.getByRole("heading", { level: 2, name: "Education" }),
    ).toBeInTheDocument();

    // Entries are <h3>s, in the page order: experience first, then education.
    const titles = main
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);
    expect(titles).toEqual(
      [...experience, ...education].map((entry) => entry.title),
    );
  });
});
