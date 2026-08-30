"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/*
  Moves its children at a fraction of scroll speed while they cross the
  viewport, so neighbouring columns separate into planes instead of sliding as
  one flat sheet. Offsets are a percentage of the element's own height, so the
  effect scales with the content instead of needing per-breakpoint numbers.

  `speed` is the total travel: 0.1 means the element drifts 10% of its height
  against the scroll. Keep it small; this should be felt, not watched.
*/
export function Parallax({
  children,
  speed = 0.1,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Scroll-linked values are already frame-smooth; a spring here only adds lag.
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${speed * 50}%`, `${-speed * 50}%`],
  );

  return (
    <motion.div ref={ref} style={reduce ? undefined : { y }} className={className}>
      {children}
    </motion.div>
  );
}
