import { useEffects } from "../context/EffectsContext.js";

/**
 * Props for an element that shows a soft light following the mouse. Spread
 * them on the element: `<article {...useSpotlight()}>`.
 *
 * The hook only stores the pointer position in the CSS variables `--x` and
 * `--y` (relative to the element). The element's CSS draws the light there
 * with a radial gradient, for example in a `[data-spotlight]::before` rule.
 *
 * It sets the variables straight on the DOM element instead of using state.
 * State would re-render the component on every mouse move, which is wasteful
 * when the result is only a CSS change.
 *
 * Returns nothing when the effects are off, so the card gets no spotlight.
 * @returns {{ "data-spotlight": boolean, onPointerMove: (event: React.PointerEvent) => void } | {}}
 */
export default function useSpotlight() {
  const { effectsOn } = useEffects();

  if (!effectsOn) return {};

  function onPointerMove(event) {
    const element = event.currentTarget;
    const box = element.getBoundingClientRect();
    element.style.setProperty("--x", `${event.clientX - box.left}px`);
    element.style.setProperty("--y", `${event.clientY - box.top}px`);
  }

  return { "data-spotlight": true, onPointerMove };
}
