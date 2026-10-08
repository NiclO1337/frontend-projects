import { MotionConfig } from "motion/react";
import useLocalStorage from "../hooks/useLocalStorage.js";
import useMediaQuery from "../hooks/useMediaQuery.js";
import { EffectsContext } from "./EffectsContext.js";

/**
 * Decides whether the visual effects (cursor trail, custom cursor, animations)
 * run, and wraps the app in Motion's config so one switch controls all of
 * Motion's animations. Wrap the app in it.
 *
 * Effects run only when all of these are true:
 * - the visitor has not turned them off with the toggle (saved in localStorage)
 * - the visitor has not asked their system for reduced motion
 * - the device has a mouse or trackpad (not a touch screen)
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export function EffectsProvider({ children }) {
  const [effectsEnabled, setEffectsEnabled] = useLocalStorage("effects", true);
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );
  const hasMouse = useMediaQuery("(hover: hover) and (pointer: fine)");

  const effectsAvailable = hasMouse && !prefersReducedMotion;
  const effectsOn = effectsEnabled && effectsAvailable;

  function toggleEffects() {
    setEffectsEnabled((current) => !current);
  }

  return (
    <EffectsContext
      value={{ effectsOn, effectsAvailable, effectsEnabled, toggleEffects }}
    >
      {/* "user" follows the system's reduced-motion setting. "always" turns
          Motion's movement off: it skips transform animations (slides, scaling)
          and keeps only gentle ones like fades. */}
      <MotionConfig reducedMotion={effectsOn ? "user" : "always"}>
        {children}
      </MotionConfig>
    </EffectsContext>
  );
}
