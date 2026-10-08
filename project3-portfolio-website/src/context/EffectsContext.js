import { createContext, useContext } from "react";

// The provider component lives in EffectsProvider.jsx: Fast Refresh needs files
// that export components to export nothing else (same split as ThemeContext).
export const EffectsContext = createContext(null);

/**
 * Returns:
 * - `effectsOn`: whether the effects should run right now. This is the one
 *   flag every effect checks.
 * - `effectsAvailable`: whether this visitor's device can run effects at all
 *   (a mouse, and no "reduce motion" setting). The toggle hides itself if not.
 * - `effectsEnabled`: the visitor's own choice, set with the toggle.
 * - `toggleEffects`: switches the visitor's choice.
 * Only works inside an EffectsProvider.
 */
export function useEffects() {
  const context = useContext(EffectsContext);
  if (context === null) {
    throw new Error("useEffects must be used inside an <EffectsProvider>");
  }
  return context;
}
