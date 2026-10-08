import { motion } from "motion/react";
import { useEffects } from "../../context/EffectsContext.js";

/**
 * Fades its content in and slides it up the first time it scrolls into view.
 * Content further down the page then appears as the visitor gets to it.
 *
 * `whileInView` is Motion's way to run an animation when the element enters
 * the screen. `once` plays it only the first time, and `amount: 0.2` waits
 * until 20% of the element is visible.
 *
 * With the effects off, the content simply starts in its final state.
 * @param {object} props
 * @param {string} [props.as] HTML tag to render, for example "li" when the
 *   reveal is a list item. Default is "div".
 * @param {React.ReactNode} props.children
 */
export default function Reveal({ as = "div", children }) {
  const { effectsOn } = useEffects();

  // motion.div, motion.li, ... all exist as properties of `motion`.
  const MotionTag = motion[as];

  // When the effects are off, `animate` also brings along content that was
  // still hidden, in case the visitor turns them off before scrolling to it.
  const animation = effectsOn
    ? {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.4 },
      }
    : { initial: false, animate: { opacity: 1, y: 0 } };

  return <MotionTag {...animation}>{children}</MotionTag>;
}
