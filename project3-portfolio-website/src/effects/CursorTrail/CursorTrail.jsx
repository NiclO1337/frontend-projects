import { useEffect, useRef } from "react";
import styles from "./CursorTrail.module.css";

const MAX_POINTS = 60; // how many recent mouse positions make up the trail
const LIFETIME = 600; // ms until a position has faded away completely

/**
 * Draws the line through the mouse positions. The newest part is bright and
 * thick, the oldest is faint and thin. Each segment gets two strokes: a wide
 * faint one that looks like a glow, and a thin bright one on top. Canvas's
 * `shadowBlur` would give a real glow, but it is far too slow to use every frame.
 *
 * Segments are drawn one by one, so where two meet, their ends must not paint
 * the same spot twice. A see-through stroke painted twice looks darker there
 * and shows up as a bead on the line. The glow therefore has flat ends, which
 * touch but don't overlap, and the core line is fully opaque and fades by
 * getting thinner. Painting an opaque colour twice looks the same as once.
 */
function drawTrail(ctx, points, now, color) {
  ctx.strokeStyle = color;

  for (let i = 1; i < points.length; i++) {
    const from = points[i - 1];
    const to = points[i];
    const life = 1 - (now - to.time) / LIFETIME; // 1 = new, 0 = gone

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);

    ctx.lineCap = "butt";
    ctx.globalAlpha = life * 0.2;
    ctx.lineWidth = 12 * life;
    ctx.stroke();

    ctx.lineCap = "round";
    ctx.globalAlpha = 1;
    ctx.lineWidth = 4 * life;
    ctx.stroke();
  }
}

/**
 * A fading neon line that follows the mouse, drawn on a full-screen canvas.
 * Only render it when the effects are on (see EffectsContext): unmounting it
 * stops everything.
 *
 * The animation loop (requestAnimationFrame) only runs while there is
 * something to draw. It starts when the mouse moves and stops when the last
 * point has faded, or when the browser tab is hidden.
 */
export default function CursorTrail() {
  const canvasRef = useRef(null);

  // Everything here talks to the browser (canvas, window, document), which is
  // what effects are for. The cleanup function undoes all of it.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let points = [];
    let frameId = null;

    // One canvas pixel per CSS pixel, even on sharp screens (which have 2 to 3
    // device pixels per CSS pixel). That is 4 to 9 times fewer pixels to clear
    // and draw each frame, and a soft glowing line doesn't need the sharpness.
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function clear() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }

    function drawFrame() {
      const now = performance.now();
      points = points.filter((point) => now - point.time < LIFETIME);
      clear();

      if (points.length === 0) {
        frameId = null; // nothing left to draw, so the loop ends here
        return;
      }
      // Read every frame, so the trail changes colour the moment the theme does.
      const color = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-accent")
        .trim();
      drawTrail(ctx, points, now, color);
      frameId = requestAnimationFrame(drawFrame);
    }

    function handlePointerMove(event) {
      points.push({
        x: event.clientX,
        y: event.clientY,
        time: performance.now(),
      });
      if (points.length > MAX_POINTS) points.shift();

      if (frameId === null) frameId = requestAnimationFrame(drawFrame);
    }

    function handleVisibilityChange() {
      if (!document.hidden) return;
      cancelAnimationFrame(frameId);
      frameId = null;
      points = [];
      clear();
    }

    resize();
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
  );
}
