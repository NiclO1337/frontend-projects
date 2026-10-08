import { render, screen } from "@testing-library/react";
import { EffectsProvider } from "../../context/EffectsProvider.jsx";
import { mockMatchMedia } from "../../test/mockMatchMedia.js";
import Reveal from "./Reveal.jsx";

const MOUSE = "(hover: hover) and (pointer: fine)";

function renderReveal(props) {
  render(
    <EffectsProvider>
      <Reveal {...props}>
        <p>Hello</p>
      </Reveal>
    </EffectsProvider>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Reveal", () => {
  it("hides its content until it scrolls into view", () => {
    // In the tests nothing ever scrolls into view (see IntersectionObserver in setup.js).
    mockMatchMedia({ [MOUSE]: true });

    renderReveal();

    expect(screen.getByText("Hello")).not.toBeVisible();
  });

  it("shows its content at once when the effects are off", () => {
    mockMatchMedia({ [MOUSE]: true });
    localStorage.setItem("effects", "false");

    renderReveal();

    expect(screen.getByText("Hello")).toBeVisible();
  });

  it("shows its content at once on a touch screen", () => {
    mockMatchMedia({ [MOUSE]: false });

    renderReveal();

    expect(screen.getByText("Hello")).toBeVisible();
  });

  it("renders the tag it is told to", () => {
    mockMatchMedia({ [MOUSE]: false });

    render(
      <EffectsProvider>
        <ul>
          <Reveal as="li">Item</Reveal>
        </ul>
      </EffectsProvider>,
    );

    expect(screen.getByRole("listitem")).toHaveTextContent("Item");
  });
});
