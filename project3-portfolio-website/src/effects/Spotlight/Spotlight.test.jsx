import { fireEvent, render, screen } from "@testing-library/react";
import { EffectsProvider } from "../../context/EffectsProvider.jsx";
import { mockMatchMedia } from "../../test/mockMatchMedia.js";
import Spotlight from "./Spotlight.jsx";

const MOUSE = "(hover: hover) and (pointer: fine)";

// The spotlight goes inside a card and follows the mouse over that card.
function renderCard() {
  render(
    <EffectsProvider>
      <div data-testid="card">
        <Spotlight />
      </div>
    </EffectsProvider>,
  );
  return screen.getByTestId("card");
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Spotlight", () => {
  it("moves its light to the mouse and shows it", () => {
    mockMatchMedia({ [MOUSE]: true });
    const card = renderCard();
    const light = card.firstElementChild;

    // jsdom has no layout, so the card's top left corner is at 0, 0.
    fireEvent.pointerMove(card, { clientX: 40, clientY: 25 });

    expect(light).toHaveStyle({
      transform: "translate(40px, 25px)",
      opacity: "1",
    });
  });

  it("hides its light when the mouse leaves", () => {
    mockMatchMedia({ [MOUSE]: true });
    const card = renderCard();
    const light = card.firstElementChild;
    fireEvent.pointerMove(card, { clientX: 40, clientY: 25 });

    fireEvent.pointerLeave(card);

    expect(light).toHaveStyle({ opacity: "0" });
  });

  it("is hidden from screen readers", () => {
    mockMatchMedia({ [MOUSE]: true });
    const card = renderCard();

    expect(card.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("renders nothing when the visitor turned the effects off", () => {
    mockMatchMedia({ [MOUSE]: true });
    localStorage.setItem("effects", "false");

    expect(renderCard()).toBeEmptyDOMElement();
  });

  it("renders nothing on a touch screen", () => {
    mockMatchMedia({ [MOUSE]: false });

    expect(renderCard()).toBeEmptyDOMElement();
  });
});
