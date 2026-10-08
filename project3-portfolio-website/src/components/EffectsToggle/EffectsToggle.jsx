import { FaWandMagicSparkles } from "react-icons/fa6";
import { useEffects } from "../../context/EffectsContext.js";

/**
 * Turns the visual effects (cursor trail, custom cursor, animations) on or
 * off. The label stays "Effects" and `aria-pressed` says whether they are on,
 * the same way as the theme toggle.
 *
 * It renders nothing when the device can't run effects (a touch screen, or
 * "reduce motion" is set): a button that changes nothing would only confuse.
 */
export default function EffectsToggle() {
  const { effectsAvailable, effectsEnabled, toggleEffects } = useEffects();

  if (!effectsAvailable) return null;

  return (
    <button
      type="button"
      className="round-control"
      aria-label="Effects"
      aria-pressed={effectsEnabled}
      onClick={toggleEffects}
    >
      <FaWandMagicSparkles aria-hidden="true" />
    </button>
  );
}
