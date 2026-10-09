import { fireEvent, render, waitFor } from "@testing-library/react";
import CustomCursor from "./CustomCursor.jsx";
import styles from "./CustomCursor.module.css";

// The cursor is two decorative elements, so there is no role or text to find
// them by. They are the cursor's first (ring) and second (dot) child.
function renderCursor(extra = null) {
  const { container } = render(
    <>
      {extra}
      <CustomCursor />
    </>,
  );
  const cursor = container.querySelector("[aria-hidden]");
  const [ring, dot] = cursor.children;
  return { cursor, ring, dot };
}

describe("CustomCursor", () => {
  it("hides the normal pointer while it is on screen, and brings it back after", () => {
    const { unmount } = render(<CustomCursor />);
    expect(document.body).toHaveClass(styles.hideCursor);

    unmount();

    expect(document.body).not.toHaveClass(styles.hideCursor);
  });

  it("is hidden from screen readers", () => {
    const { cursor } = renderCursor();

    expect(cursor).toHaveAttribute("aria-hidden", "true");
  });

  it("shows up when the mouse moves, and hides when it leaves the page", () => {
    const { cursor } = renderCursor();
    expect(cursor).toHaveAttribute("data-visible", "false");

    fireEvent.pointerMove(document, { clientX: 40, clientY: 25 });
    expect(cursor).toHaveAttribute("data-visible", "true");

    fireEvent.pointerLeave(document.documentElement);
    expect(cursor).toHaveAttribute("data-visible", "false");
  });

  it("puts the dot at the pointer", async () => {
    const { dot } = renderCursor();

    fireEvent.pointerMove(document, { clientX: 40, clientY: 25 });

    // Motion applies the position on the next animation frame.
    await waitFor(() => expect(dot.style.transform).toContain("40px"));
    expect(dot.style.transform).toContain("25px");
  });

  it("grows the ring over links, buttons and labels", () => {
    const { ring } = renderCursor(
      <>
        <a href="/about">
          <span>About</span>
        </a>
        <button>Send</button>
        <p>Plain text</p>
      </>,
    );
    expect(ring).toHaveAttribute("data-active", "false");

    // The span is inside the link, so the link is found as a parent.
    fireEvent.pointerOver(document.querySelector("a span"));
    expect(ring).toHaveAttribute("data-active", "true");

    fireEvent.pointerOver(document.querySelector("p"));
    expect(ring).toHaveAttribute("data-active", "false");

    fireEvent.pointerOver(document.querySelector("button"));
    expect(ring).toHaveAttribute("data-active", "true");
  });
});
