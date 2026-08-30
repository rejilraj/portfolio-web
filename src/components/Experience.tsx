"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { experience } from "@/lib/content";
import { SplitText } from "./SplitText";

const idx = (i: number) => ({ "--i": i }) as CSSProperties;

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();

  /* The rail fills as you read down the list: a progress bar for the career
     narrative, so you can see how far through the history you are. This is
     decorative only, so it is safe to drive from JS. */
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 75%", "end 65%"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section
      id="experience"
      className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 md:py-32"
    >
      <h2 className="mb-14 text-3xl font-semibold tracking-tight sm:text-4xl">
        <SplitText text="Experience" />
      </h2>

      <ol ref={listRef} className="relative pl-0">
        {/* Static track */}
        <span
          aria-hidden
          className="absolute left-0 top-0 h-full w-px bg-border"
        />
        {/* Accent fill, driven by scroll through the list */}
        <motion.span
          aria-hidden
          style={reduce ? { scaleY: 1 } : { scaleY }}
          className="absolute left-0 top-0 h-full w-px origin-top bg-gradient-to-b from-accent to-[var(--violet)]"
        />

        {experience.map((job, i) => (
          <li
            key={job.company}
            style={idx(i)}
            className="reveal group relative pb-14 pl-8 last:pb-0"
          >
            <span
              aria-hidden
              className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_0_4px_var(--bg),0_0_14px_2px_rgba(61,225,255,0.5)]"
            />

            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-accent">
                {job.company}
              </h3>
              <span className="font-mono text-xs tracking-wide text-text-faint">
                {job.period}
              </span>
            </div>
            <p className="mt-1 text-sm text-accent">{job.role}</p>

            <ul className="mt-4 space-y-2.5">
              {job.points.map((point, j) => (
                <li
                  key={point}
                  style={idx(j)}
                  className="reveal-x max-w-[68ch] text-[14px] leading-relaxed text-text-dim before:mr-3 before:text-text-faint before:content-['/']"
                >
                  {point}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
