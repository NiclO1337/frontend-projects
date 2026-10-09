import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import styles from "./CustomCursor.module.css";

// Things the ring grows over, to show that they can be clicked.
const INTERACTIVE = "a, button, [role=button], label";

// A spring pulls the ring towards the pointer. A higher stiffness pulls harder
// and a higher damping stops the overshoot, so it glides and settles smoothly.
const RING_SPRING = { stiffness: 1500, damping: 30, mass: 0.6 };

/**
 * Replaces the mouse pointer with a small neon dot exactly at the pointer and
 * a ring that glides after it. The ring grows over links and buttons.
 * Only render it when the effects are on (see EffectsContext): unmounting it
 * brings the normal pointer back.
 *
 * The positions are Motion "motion values". They move the elements by
 * changing their transform directly, without React re-rendering on every
 * mouse move. `useSpring` makes a motion value that follows another one with
 * a spring, which is where the ring's gliding comes from. Motion stops its
 * animation loop by itself when the spring has settled.
 */
export default function CustomCursor() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ringX = useSpring(x, RING_SPRING);
  const ringY = useSpring(y, RING_SPRING);

  const [visible, setVisible] = useState(false);
  const [overInteractive, setOverInteractive] = useState(false);

  // Everything here talks to the browser (document, body), which is what
  // effects are for. The cleanup function undoes all of it.
  useEffect(() => {
    // The class hides the normal pointer everywhere, except in text fields.
    document.body.classList.add(styles.hideCursor);

    let shown = false;

    function handlePointerMove(event) {
      if (!shown) {
        // First move since the pointer came into the page: put the ring under
        // it at once, instead of letting it glide in from where it was.
        ringX.jump(event.clientX);
        ringY.jump(event.clientY);
        shown = true;
        setVisible(true);
      }
      x.set(event.clientX);
      y.set(event.clientY);
    }

    // pointerover fires each time the pointer enters a new element. One
    // listener on the document is enough for the whole page: `closest` looks
    // for the element itself or any parent that matches ("event delegation").
    function handlePointerOver(event) {
      setOverInteractive(
        event.target instanceof Element &&
          event.target.closest(INTERACTIVE) !== null,
      );
    }

    function handlePointerLeave() {
      shown = false;
      setVisible(false);
    }

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerover", handlePointerOver);
    document.documentElement.addEventListener(
      "pointerleave",
      handlePointerLeave,
    );

    return () => {
      document.body.classList.remove(styles.hideCursor);
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerover", handlePointerOver);
      document.documentElement.removeEventListener(
        "pointerleave",
        handlePointerLeave,
      );
    };
  }, [x, y, ringX, ringY]);

  return (
    <div className={styles.cursor} data-visible={visible} aria-hidden="true">
      <motion.div
        className={styles.ring}
        data-active={overInteractive}
        style={{ x: ringX, y: ringY }}
        animate={{ scale: overInteractive ? 1.6 : 1 }}
      />
      <motion.div className={styles.dot} style={{ x, y }} />
    </div>
  );
}
