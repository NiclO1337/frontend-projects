import { useEffect, useRef } from "react";
import styles from "./CursorTrail.module.css";

const MAX_POINTS = 60; // how many recent mouse positions make up the trail
const LIFETIME = 600; // ms until a position has faded away completely
const MAX_PIXEL_RATIO = 2; // a sharper canvas than this costs speed, not looks

/**
 * Draws the line through the mouse positions. The newest part is bright and
 * thick, the oldest is faint and thin. Each segment gets two strokes: a wide
 * faint one that looks like a glow, and a thin bright one on top. Canvas's
 * `shadowBlur` would give a real glow, but it is far too slow to use every frame.
 */
function drawTrail(ctx, points, now, color) {
  ctx.lineCap = "round";
  ctx.strokeStyle = color;

  for (let i = 1; i < points.length; i++) {
    const from = points[i - 1];
    const to = points[i];
    const life = 1 - (now - to.time) / LIFETIME; // 1 = new, 0 = gone

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);

    ctx.globalAlpha = life * 0.2;
    ctx.lineWidth = 12 * life;
    ctx.stroke();

    ctx.globalAlpha = life * 0.9;
    ctx.lineWidth = 2 * life;
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
    let color = "";

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
      // The canvas has more pixels than CSS pixels on sharp screens. The
      // transform lets us keep drawing in CSS pixels. (Setting the size
      // also resets the context, so the transform is set again here.)
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
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

      if (frameId === null) {
        // Read the colour when the loop starts, so a theme change is picked up.
        color = getComputedStyle(document.documentElement)
          .getPropertyValue("--color-accent")
          .trim();
        frameId = requestAnimationFrame(drawFrame);
      }
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
