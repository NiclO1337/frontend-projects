import { useEffect, useRef } from "react";
import { useEffects } from "../../context/EffectsContext.js";
import styles from "./Spotlight.module.css";

/**
 * A soft light that follows the mouse inside its parent element. Put it inside
 * a tile: `<div> <Spotlight /> ... </div>`. The parent needs
 * `position: relative` and `overflow: hidden`, so the light stays inside it.
 * It is used on the BentoTiles only: on the project cards, which are taller
 * and hold a screenshot, it still lagged at 4x CPU throttling and was removed.
 *
 * The light is a small element that is moved with `transform`, so only the
 * light itself is restyled. Changing a CSS variable on the tile, with a
 * gradient that reads it, was tried first and was too slow: each mouse move
 * restyled everything inside the tile. Giving the light its own layer with
 * `will-change` was tried second and lagged when many tiles were on screen
 * (see the CSS file).
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
