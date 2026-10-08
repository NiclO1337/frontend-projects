import { useEffect, useRef } from "react";
import { useEffects } from "../../context/EffectsContext.js";
import styles from "./Spotlight.module.css";

/**
 * A soft light that follows the mouse inside its parent element. Put it inside
 * a card: `<article> <Spotlight /> ... </article>`. The parent needs
 * `position: relative` and `overflow: hidden`, so the light stays inside it.
 *
 * The light is a small element that is moved with `transform`. The browser
 * moves it on the graphics card and doesn't redraw or restyle anything.
 * Changing a CSS variable on the card, with a gradient that reads it, was tried
 * first and was too slow: each mouse move restyled the whole card and redrew it.
 *
 * It renders nothing when the effects are off.
 */
export default function Spotlight() {
  const { effectsOn } = useEffects();
  const lightRef = useRef(null);

  // The effect sets the light's position straight on the DOM element instead
  // of using state, since state would re-render on every mouse move.
  useEffect(() => {
    if (!effectsOn) return;

    const light = lightRef.current;
    const card = light.parentElement;

    function follow(event) {
      const box = card.getBoundingClientRect();
      const x = event.clientX - box.left;
      const y = event.clientY - box.top;
      light.style.transform = `translate(${x}px, ${y}px)`;
      light.style.opacity = "1";
    }

    function hide() {
      light.style.opacity = "0";
    }

    // pointerenter also positions the light, so it doesn't appear where the
    // mouse left last time.
    card.addEventListener("pointerenter", follow);
    card.addEventListener("pointermove", follow);
    card.addEventListener("pointerleave", hide);
    return () => {
      card.removeEventListener("pointerenter", follow);
      card.removeEventListener("pointermove", follow);
      card.removeEventListener("pointerleave", hide);
    };
  }, [effectsOn]);

  if (!effectsOn) return null;

  return <span ref={lightRef} className={styles.light} aria-hidden="true" />;
}
