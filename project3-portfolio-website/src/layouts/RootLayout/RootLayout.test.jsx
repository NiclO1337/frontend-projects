import { screen } from "@testing-library/react";
import cursorStyles from "../../effects/CustomCursor/CustomCursor.module.css";
import { mockMatchMedia } from "../../test/mockMatchMedia.js";
import { renderWithRouter } from "../../test/renderWithRouter.jsx";

const MOUSE = "(hover: hover) and (pointer: fine)";

beforeEach(() => {
  // jsdom cannot create a canvas context. An empty one is enough for these tests.
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({});
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("RootLayout", () => {
  // The cursor trail is a canvas. The custom cursor hides the normal pointer
  // with a class on <body>.
  it("shows the cursor effects when the effects are on", async () => {
    mockMatchMedia({ [MOUSE]: true });

    const { container } = renderWithRouter(["/about"]);
    await screen.findByRole("heading", { level: 1 });

    expect(container.querySelector("canvas")).toBeInTheDocument();
    expect(document.body).toHaveClass(cursorStyles.hideCursor);
  });

  it("leaves out the cursor effects when the effects are off", async () => {
    mockMatchMedia({ [MOUSE]: true });
    localStorage.setItem("effects", "false");

    const { container } = renderWithRouter(["/about"]);
    await screen.findByRole("heading", { level: 1 });

    expect(container.querySelector("canvas")).not.toBeInTheDocument();
    expect(document.body).not.toHaveClass(cursorStyles.hideCursor);
  });

  it("leaves out the cursor effects on a touch screen", async () => {
    mockMatchMedia({ [MOUSE]: false });

    const { container } = renderWithRouter(["/about"]);
    await screen.findByRole("heading", { level: 1 });

    expect(container.querySelector("canvas")).not.toBeInTheDocument();
    expect(document.body).not.toHaveClass(cursorStyles.hideCursor);
  });
});
