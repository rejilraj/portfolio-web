"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { marqueeIcons } from "@/lib/content";

/** Keeps a value looping inside [min, max) so the track never runs out. */
function wrap(min: number, max: number, value: number) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

const BASE_SPEED = -2.4; // percent of track width per second

/*
  The one marquee on the page. It shows the breadth of the stack without a
  20-item list, and it is coupled to scrolling: flick down and the strip
  accelerates and skews with you, scroll up and it runs backwards. That turns a
  decorative loop into feedback about your own input.

  Under reduced motion it collapses to a static wrapped list.
*/
export function TechMarquee() {
  const reduce = useReducedMotion();
  const row = [...marqueeIcons, ...marqueeIcons];

  const baseX = useMotionValue(0);
  const direction = useRef(1);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1200], [0, 4], {
    clamp: false,
  });
  const skew = useTransform(smoothVelocity, [-2000, 0, 2000], [3, 0, -3], {
    clamp: true,
  });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let moveBy = direction.current * BASE_SPEED * (delta / 1000);

    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;

    moveBy += direction.current * moveBy * Math.abs(factor);
    baseX.set(baseX.get() + moveBy);
  });

  if (reduce) {
    return (
      <div className="relative overflow-hidden border-y border-border bg-bg-elev/50 py-6">
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-5 px-6">
          {marqueeIcons.map((slug) => (
            <Item key={slug} slug={slug} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden border-y border-border bg-bg-elev/50 py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent" />

      <motion.div style={{ skewX: skew }}>
        <motion.div style={{ x }} className="flex w-max gap-12">
          {row.map((slug, i) => (
            <Item key={`${slug}-${i}`} slug={slug} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

function Item({ slug }: { slug: string }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 opacity-60 transition-opacity duration-300 hover:opacity-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://cdn.simpleicons.org/${slug}/9298a4`}
        alt=""
        aria-hidden
        width={18}
        height={18}
        loading="lazy"
        className="h-[18px] w-[18px]"
      />
      <span className="font-mono text-[13px] capitalize tracking-tight text-text-dim">
        {slug.replace("dotjs", ".js").replace("threed", "three")}
      </span>
    </div>
  );
}
