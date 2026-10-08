import { fireEvent, render, screen } from "@testing-library/react";
import { EffectsProvider } from "../context/EffectsProvider.jsx";
import { mockMatchMedia } from "../test/mockMatchMedia.js";
import useSpotlight from "./useSpotlight.js";

const MOUSE = "(hover: hover) and (pointer: fine)";

// A small component that uses the hook the way a card does.
function Box() {
  return <div data-testid="box" {...useSpotlight()} />;
}

function renderBox() {
  render(
    <EffectsProvider>
      <Box />
    </EffectsProvider>,
  );
  return screen.getByTestId("box");
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useSpotlight", () => {
  it("stores the mouse position in --x and --y", () => {
    mockMatchMedia({ [MOUSE]: true });
    const box = renderBox();

    // jsdom has no layout, so the element's top left corner is at 0, 0.
    fireEvent.pointerMove(box, { clientX: 40, clientY: 25 });

    expect(box).toHaveAttribute("data-spotlight");
    expect(box.style.getPropertyValue("--x")).toBe("40px");
    expect(box.style.getPropertyValue("--y")).toBe("25px");
  });

  it("does nothing when the visitor turned the effects off", () => {
    mockMatchMedia({ [MOUSE]: true });
    localStorage.setItem("effects", "false");
    const box = renderBox();

    fireEvent.pointerMove(box, { clientX: 40, clientY: 25 });

    expect(box).not.toHaveAttribute("data-spotlight");
    expect(box.style.getPropertyValue("--x")).toBe("");
  });

  it("does nothing on a touch screen", () => {
    mockMatchMedia({ [MOUSE]: false });
    const box = renderBox();

    fireEvent.pointerMove(box, { clientX: 40, clientY: 25 });

    expect(box).not.toHaveAttribute("data-spotlight");
    expect(box.style.getPropertyValue("--x")).toBe("");
  });
});
