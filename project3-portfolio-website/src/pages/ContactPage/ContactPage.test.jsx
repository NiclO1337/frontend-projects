import { screen, within } from "@testing-library/react";
import { renderWithRouter } from "../../test/renderWithRouter.jsx";

describe("ContactPage", () => {
  it("has the heading, the form and links to the profiles", () => {
    renderWithRouter(["/contact"]);
    const main = within(screen.getByRole("main"));

    expect(
      main.getByRole("heading", { level: 1, name: "Let's talk" }),
    ).toBeInTheDocument();
    expect(main.getByLabelText("Name")).toBeInTheDocument();
    expect(main.getByLabelText("Email")).toBeInTheDocument();
    expect(main.getByLabelText("Message")).toBeInTheDocument();
    expect(main.getByRole("link", { name: /github/i })).toBeInTheDocument();
    expect(main.getByRole("link", { name: /linkedin/i })).toBeInTheDocument();
  });

  it("shows no email address or phone number", () => {
    renderWithRouter(["/contact"]);

    const main = screen.getByRole("main");
    expect(main.textContent).not.toMatch(/@\w+\.\w+|\+46|\b0\d{2}[- ]?\d{6,}/);
  });
});
