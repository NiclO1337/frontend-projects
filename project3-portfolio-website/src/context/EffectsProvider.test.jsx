import { render, screen } from "@testing-library/react";
import { mockMatchMedia } from "../test/mockMatchMedia.js";
import { useEffects } from "./EffectsContext.js";
import { EffectsProvider } from "./EffectsProvider.jsx";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const MOUSE = "(hover: hover) and (pointer: fine)";

// A tiny component that shows what the context says.
function Status() {
  const { effectsOn, effectsAvailable, effectsEnabled } = useEffects();
  return (
    <p>
      on:{String(effectsOn)} available:{String(effectsAvailable)} enabled:
      {String(effectsEnabled)}
    </p>
  );
}

function renderStatus() {
  render(
    <EffectsProvider>
      <Status />
    </EffectsProvider>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("EffectsProvider", () => {
  it("runs the effects for a visitor with a mouse who has not turned them off", () => {
    mockMatchMedia({ [MOUSE]: true });

    renderStatus();

    expect(
      screen.getByText("on:true available:true enabled:true"),
    ).toBeVisible();
  });

  it("turns the effects off when the visitor chose so", () => {
    mockMatchMedia({ [MOUSE]: true });
    localStorage.setItem("effects", "false");

    renderStatus();

    expect(
      screen.getByText("on:false available:true enabled:false"),
    ).toBeVisible();
  });

  it("turns the effects off for a visitor who asked for reduced motion", () => {
    mockMatchMedia({ [MOUSE]: true, [REDUCED_MOTION]: true });

    renderStatus();

    // They are not "available" at all, whatever the visitor's own choice is.
    expect(
      screen.getByText("on:false available:false enabled:true"),
    ).toBeVisible();
  });

  it("turns the effects off on a touch screen", () => {
    mockMatchMedia({ [MOUSE]: false });

    renderStatus();

    expect(
      screen.getByText("on:false available:false enabled:true"),
    ).toBeVisible();
  });

  it("throws a helpful error when used outside the provider", () => {
    // React logs the error it catches, which would clutter the test output.
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Status />)).toThrow(/inside an <EffectsProvider>/);
  });
});
