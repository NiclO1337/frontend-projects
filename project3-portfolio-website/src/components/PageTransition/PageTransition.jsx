import { motion } from "motion/react";
import { useLocation } from "react-router";
import { useEffects } from "../../context/EffectsContext.js";

/**
 * Fades the page in and slides it up a little each time the visitor goes to a
 * different page. There is no exit animation: the old page is replaced at once.
 *
 * The `key` is what makes it work. When a key changes, React throws the old
 * element away and mounts a new one, and a freshly mounted motion.div plays its
 * `initial` -> `animate` animation. Only the pathname is used, so changing the
 * project filter (?tech=...) does not replay it.
 *
 * With the effects off, `initial={false}` makes it start in its final state.
 * @param {object} props
 * @param {React.ReactNode} props.children the page, usually <Outlet />
 */
export default function PageTransition({ children }) {
  const { pathname } = useLocation();
  const { effectsOn } = useEffects();

  return (
    <motion.div
      key={pathname}
      initial={effectsOn ? { opacity: 0, y: 65 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      {children}
    </motion.div>
  );
}
