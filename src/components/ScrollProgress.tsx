"use client";

import { motion, useScroll, useSpring } from "motion/react";

/*
  Hairline rail across the top edge showing how far through the page you are.
  Orientation feedback on a long single-page site: it answers "how much is
  left" without a scrollbar. Driven by a motion value, so it never re-renders.
*/
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-gradient-to-r from-accent via-accent to-[var(--violet)]"
    />
  );
}
