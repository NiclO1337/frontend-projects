import { screen } from "@testing-library/react";
import { mockMatchMedia } from "../../test/mockMatchMedia.js";
import { renderWithRouter } from "../../test/renderWithRouter.jsx";

const MOUSE = "(hover: hover) and (pointer: fine)";

beforeEach(() => {
  // jsdom cannot create a canvas context. An empty one is enough for these tests.
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    setTransform: () => {},
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("RootLayout", () => {
  it("shows the cursor trail when the effects are on", async () => {
    mockMatchMedia({ [MOUSE]: true });

    const { container } = renderWithRouter(["/about"]);
    await screen.findByRole("heading", { level: 1 });

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("leaves out the cursor trail when the effects are off", async () => {
    mockMatchMedia({ [MOUSE]: true });
    localStorage.setItem("effects", "false");

    const { container } = renderWithRouter(["/about"]);
    await screen.findByRole("heading", { level: 1 });

    expect(container.querySelector("canvas")).not.toBeInTheDocument();
  });

  it("leaves out the cursor trail on a touch screen", async () => {
    mockMatchMedia({ [MOUSE]: false });

    const { container } = renderWithRouter(["/about"]);
    await screen.findByRole("heading", { level: 1 });

    expect(container.querySelector("canvas")).not.toBeInTheDocument();
  });
});
