import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EffectsProvider } from "../../context/EffectsProvider.jsx";
import { mockMatchMedia } from "../../test/mockMatchMedia.js";
import EffectsToggle from "./EffectsToggle.jsx";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const MOUSE = "(hover: hover) and (pointer: fine)";

function renderToggle() {
  render(
    <EffectsProvider>
      <EffectsToggle />
    </EffectsProvider>,
  );
}

const getToggle = () => screen.getByRole("button", { name: "Effects" });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("EffectsToggle", () => {
  it("starts with the effects on", () => {
    mockMatchMedia({ [MOUSE]: true });

    renderToggle();

    expect(getToggle()).toHaveAttribute("aria-pressed", "true");
  });

  it("turns the effects off and on, and saves the choice", async () => {
    const user = userEvent.setup();
    mockMatchMedia({ [MOUSE]: true });
    renderToggle();

    await user.click(getToggle());

    expect(getToggle()).toHaveAttribute("aria-pressed", "false");
    expect(localStorage.getItem("effects")).toBe("false");

    await user.click(getToggle());

    expect(getToggle()).toHaveAttribute("aria-pressed", "true");
    expect(localStorage.getItem("effects")).toBe("true");
  });

  it("starts in the saved state", () => {
    mockMatchMedia({ [MOUSE]: true });
    localStorage.setItem("effects", "false");

    renderToggle();

    expect(getToggle()).toHaveAttribute("aria-pressed", "false");
  });

  it("is not shown on a touch screen", () => {
    mockMatchMedia({ [MOUSE]: false });

    renderToggle();

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("is not shown when the visitor asked for reduced motion", () => {
    mockMatchMedia({ [MOUSE]: true, [REDUCED_MOTION]: true });

    renderToggle();

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
