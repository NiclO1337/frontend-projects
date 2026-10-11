import { fireEvent, render } from "@testing-library/react";
import CursorTrail from "./CursorTrail.jsx";

// jsdom cannot draw. This stand-in records the calls, so a test can see
// whether anything was drawn.
let ctx;

beforeEach(() => {
  vi.useFakeTimers(); // also fakes requestAnimationFrame and performance.now
  ctx = {
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
  };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctx);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  Object.defineProperty(document, "hidden", {
    configurable: true,
    value: false,
  });
});

const move = (x, y) =>
  fireEvent.pointerMove(window, { clientX: x, clientY: y });

describe("CursorTrail", () => {
  it("renders a canvas that screen readers skip", () => {
    const { container } = render(<CursorTrail />);

    expect(container.querySelector("canvas")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("draws a line between mouse positions", () => {
    render(<CursorTrail />);

    move(10, 10);
    move(40, 30);
    vi.advanceTimersByTime(16); // one animation frame

    expect(ctx.moveTo).toHaveBeenCalledWith(10, 10);
    expect(ctx.lineTo).toHaveBeenCalledWith(40, 30);
    expect(ctx.stroke).toHaveBeenCalled();
  });

  it("changes colour while moving when the theme changes", () => {
    const colors = [];
    ctx.stroke.mockImplementation(() => colors.push(ctx.strokeStyle));
    render(<CursorTrail />);
    move(10, 10);
    move(40, 30);

    document.documentElement.style.setProperty("--color-cursor", "red");
    vi.advanceTimersByTime(16);
    document.documentElement.style.setProperty("--color-cursor", "blue");
    vi.advanceTimersByTime(16);
    document.documentElement.style.removeProperty("--color-cursor");

    expect(colors).toContain("red");
    expect(colors).toContain("blue");
  });

  it("does not animate before the mouse moves", () => {
    render(<CursorTrail />);

    expect(vi.getTimerCount()).toBe(0);
  });

  it("stops animating once the trail has faded away", () => {
    render(<CursorTrail />);
    move(10, 10);
    move(40, 30);
    expect(vi.getTimerCount()).toBe(1); // a frame is waiting

    vi.advanceTimersByTime(1000);

    expect(vi.getTimerCount()).toBe(0);
  });

  it("stops animating when the tab is hidden", () => {
    render(<CursorTrail />);
    move(10, 10);

    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    fireEvent(document, new Event("visibilitychange"));

    expect(vi.getTimerCount()).toBe(0);
  });

  it("starts only one animation frame, however many times the mouse moves meanwhile", () => {
    render(<CursorTrail />);

    for (let i = 0; i < 10; i++) move(i, i);

    expect(vi.getTimerCount()).toBe(1);
  });

  it("keeps only the 60 newest positions", () => {
    render(<CursorTrail />);

    for (let i = 0; i < 70; i++) move(i, i);
    vi.advanceTimersByTime(16);

    // 60 positions make 59 line segments, from the 11th position to the last.
    expect(ctx.lineTo).toHaveBeenCalledTimes(59);
    expect(ctx.moveTo).toHaveBeenNthCalledWith(1, 10, 10);
    expect(ctx.lineTo).toHaveBeenLastCalledWith(69, 69);
  });

  it("draws a new trail after the tab was hidden and is visible again", () => {
    render(<CursorTrail />);
    move(10, 10);
    const setHidden = (value) => {
      Object.defineProperty(document, "hidden", { configurable: true, value });
      fireEvent(document, new Event("visibilitychange"));
    };
    setHidden(true);
    setHidden(false);

    move(100, 100);
    move(120, 120);
    vi.advanceTimersByTime(16);

    // The new trail starts where the mouse is now, not at the old position.
    expect(ctx.moveTo).toHaveBeenCalledWith(100, 100);
    expect(ctx.lineTo).toHaveBeenCalledWith(120, 120);
    expect(ctx.moveTo).not.toHaveBeenCalledWith(10, 10);
  });

  it("does nothing, and does not crash, when the browser has no canvas to draw on", () => {
    HTMLCanvasElement.prototype.getContext.mockReturnValue(null);

    expect(() => render(<CursorTrail />)).not.toThrow();
    move(10, 10);

    expect(vi.getTimerCount()).toBe(0);
  });

  it("uses one canvas pixel per CSS pixel, even on a sharp screen", () => {
    vi.stubGlobal("devicePixelRatio", 3);

    const { container } = render(<CursorTrail />);

    const canvas = container.querySelector("canvas");
    expect(canvas.width).toBe(window.innerWidth);
    expect(canvas.height).toBe(window.innerHeight);
  });

  it("resizes the canvas with the window", () => {
    const { container } = render(<CursorTrail />);

    window.innerWidth = 500;
    fireEvent(window, new Event("resize"));

    expect(container.querySelector("canvas").width).toBe(500);
  });

  it("stops listening when it is removed", () => {
    const { unmount } = render(<CursorTrail />);
    unmount();

    move(10, 10);

    expect(vi.getTimerCount()).toBe(0);
  });
});
