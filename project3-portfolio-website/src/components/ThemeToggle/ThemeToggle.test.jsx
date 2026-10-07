import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "../../context/ThemeProvider.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

function renderToggle() {
  render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  );
}

const getToggle = () => screen.getByRole("button", { name: /dark mode/i });

describe("ThemeToggle", () => {
  it("starts in the dark theme", () => {
    renderToggle();

    expect(getToggle()).toHaveAttribute("aria-pressed", "true");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("switches to the light theme and back", async () => {
    const user = userEvent.setup();
    renderToggle();

    await user.click(getToggle());

    expect(getToggle()).toHaveAttribute("aria-pressed", "false");
    expect(document.documentElement).toHaveAttribute("data-theme", "light");

    await user.click(getToggle());

    expect(getToggle()).toHaveAttribute("aria-pressed", "true");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("saves the choice in localStorage", async () => {
    const user = userEvent.setup();
    renderToggle();

    await user.click(getToggle());

    expect(localStorage.getItem("theme")).toBe('"light"');
  });

  it("starts in the saved theme", () => {
    localStorage.setItem("theme", JSON.stringify("light"));

    renderToggle();

    expect(getToggle()).toHaveAttribute("aria-pressed", "false");
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
  });
});
