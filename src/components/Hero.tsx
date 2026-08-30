"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowDownRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { hero, marqueeIcons, profile } from "@/lib/content";
import { Magnetic } from "./Magnetic";
import { SplitText } from "./SplitText";

/*
  Two motion systems, kept strictly apart so they never fight over `transform`:

  - Entrances are CSS (`.fade-up`, `.split-mount`). They run without JS, so the
    hero can never be left invisible by a script failure.
  - Parallax is Motion, applied only to wrapper elements. Nothing that carries a
    motion transform also carries a CSS animation.
*/
export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  /* ---------- scroll parallax: the hero separates into planes on exit ------
     Type sits nearest the viewer so it travels furthest; the portrait is the
     far plane, drifting down and scaling slightly as the type flies past it. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const yGreeting = useTransform(scrollYProgress, [0, 1], [0, -220]);
  const ySolid = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const yOutline = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const yPortraitScroll = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const yFooter = useTransform(scrollYProgress, [0, 1], [0, -260]);
  const heroFade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const heroFilter = useTransform(
    useTransform(scrollYProgress, [0.3, 1], [0, 6]),
    (b) => `blur(${b}px)`,
  );

  /* ---------- pointer drift: the scene breathes with the cursor at rest ---- */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 55, damping: 20, mass: 0.6 };
  const px = useSpring(mx, spring);
  const py = useSpring(my, spring);

  const portraitDriftX = useTransform(px, [-0.5, 0.5], [-20, 20]);
  const portraitDriftY = useTransform(py, [-0.5, 0.5], [-14, 14]);
  const typeDriftX = useTransform(px, [-0.5, 0.5], [12, -12]);
  const outlineDriftX = useTransform(px, [-0.5, 0.5], [22, -22]);

  // Scroll travel and pointer drift stack on the same axis.
  const yPortrait = useTransform(
    [yPortraitScroll, portraitDriftY] as MotionValue<number>[],
    ([a, b]: number[]) => a + b,
  );

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce || !sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const resetPointer = () => {
    mx.set(0);
    my.set(0);
  };

  // Only hand motion values to the DOM when motion is allowed.
  const mv = <T,>(value: T) => (reduce ? undefined : value);
  const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

  const silhouetteMask: CSSProperties = {
    WebkitMaskImage: `url(${profile.photo}), linear-gradient(to bottom, #000 0, #000 48%, transparent 82%)`,
    maskImage: `url(${profile.photo}), linear-gradient(to bottom, #000 0, #000 48%, transparent 82%)`,
    WebkitMaskSize: "contain, 100% 100%",
    maskSize: "contain, 100% 100%",
    WebkitMaskPosition: "top, top",
    maskPosition: "top, top",
    WebkitMaskRepeat: "no-repeat, no-repeat",
    maskRepeat: "no-repeat, no-repeat",
    WebkitMaskComposite: "source-in",
    maskComposite: "intersect",
  };

  // The error event can fire before hydration during SSR, so re-check on mount.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      onPointerMove={onPointerMove}
      onPointerLeave={resetPointer}
      className="relative mx-auto flex min-h-[100dvh] max-w-[1180px] flex-col items-center justify-center overflow-hidden px-5 pt-28 pb-16 text-center sm:px-8"
    >
      <motion.div
        style={{ opacity: mv(heroFade), filter: mv(heroFilter) }}
        className="flex w-full flex-col items-center"
      >
        <motion.div style={{ y: mv(yGreeting) }}>
          <p
            style={delay(0.1)}
            className="fade-up flex items-center gap-2 text-[15px] text-text-dim"
          >
            <span
              aria-hidden
              className="animate-[wave_2.6s_ease-in-out_infinite] text-lg [transform-origin:70%_80%]"
            >
              &#128075;
            </span>
            {hero.greeting}
          </p>
        </motion.div>

        {/* Display block: two lines of type with the portrait layered between */}
        <div className="relative mt-3 w-full sm:mt-5">
          <h1 className="flex flex-col items-center font-bold leading-[0.8] tracking-[-0.03em]">
            <motion.span
              style={{ y: mv(ySolid), x: mv(typeDriftX) }}
              className="relative z-10 block text-[clamp(3rem,15vw,9.75rem)] text-text"
            >
              <SplitText
                text={hero.lineTop}
                by="char"
                mode="mount"
                stagger={0.035}
                delay={0.2}
              />
            </motion.span>
            <motion.span
              style={{ y: mv(yOutline), x: mv(outlineDriftX) }}
              className="text-outline relative z-0 block text-[clamp(3rem,15vw,9.75rem)]"
            >
              <SplitText
                text={hero.lineBottom}
                by="word"
                mode="mount"
                stagger={0.07}
                delay={0.45}
              />
            </motion.span>
          </h1>

          {/* Portrait: head sits near the line seam, torso flows down behind the
              CTAs and fades out. Nudge `top-[...]` / the width clamp to reframe. */}
          <motion.div
            style={{
              y: mv(yPortrait),
              x: mv(portraitDriftX),
              scale: mv(portraitScale),
            }}
            className="pointer-events-none absolute left-1/2 top-[16%] z-20 -translate-x-1/2"
          >
            <div
              style={delay(0.35)}
              className="fade-up relative h-[clamp(400px,58vh,620px)] w-[clamp(280px,38vw,450px)]"
            >
              {/* Slow idle float, so the hero is never fully static */}
              <div className="h-full w-full animate-[float_8s_ease-in-out_infinite] will-change-transform">
                <div className="absolute left-1/2 top-4 h-52 w-52 -translate-x-1/2 -z-10 animate-[pulse-glow_6s_ease-in-out_infinite] rounded-full bg-accent/15 blur-3xl" />
                {!failed ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      ref={imgRef}
                      src={profile.photo}
                      alt={`Portrait of ${profile.name}`}
                      onError={() => setFailed(true)}
                      className="hero-portrait-fade h-full w-full object-contain object-top contrast-[1.02]"
                    />
                    {/* Gentle accent tint, clipped to the portrait silhouette */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 mix-blend-color"
                      style={{
                        ...silhouetteMask,
                        background:
                          "linear-gradient(158deg, rgba(61,225,255,0.6) 8%, rgba(61,225,255,0.24) 46%, rgba(167,139,250,0.5) 96%)",
                      }}
                    />
                  </>
                ) : (
                  <div className="flex h-full w-full flex-col items-center gap-2 bg-[radial-gradient(58%_36%_at_50%_24%,rgba(61,225,255,0.22),rgba(167,139,250,0.12)_60%,transparent_75%)] pt-16">
                    <span className="font-mono text-5xl font-bold text-text">
                      RR
                    </span>
                    <span className="max-w-[150px] text-center font-mono text-[10px] leading-relaxed text-text-faint">
                      add app/public/rejil.png
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Arrow badge */}
          <motion.div
            style={{ y: mv(ySolid) }}
            className="absolute left-[26%] top-[40%] z-30"
          >
            <a
              href="#work"
              aria-label="See selected work"
              style={delay(0.9)}
              className="fade-up group relative grid h-11 w-11 place-items-center rounded-full border border-border-strong bg-bg text-text transition-[transform,border-color,color] duration-300 hover:scale-110 hover:border-accent hover:text-accent active:scale-95 sm:h-14 sm:w-14"
            >
              <span className="absolute inset-0 animate-[ring_3s_ease-out_infinite] rounded-full border border-accent/50" />
              <ArrowUpRightIcon
                size={18}
                weight="bold"
                className="transition-transform duration-300 group-hover:rotate-45"
              />
            </a>
          </motion.div>
        </div>

        {/* Sub-row: location left, tech cluster right */}
        <motion.div
          style={{ y: mv(yFooter) }}
          className="relative z-30 mt-7 w-full sm:mt-10"
        >
          <div
            style={delay(0.75)}
            className="fade-up flex w-full flex-col items-center gap-3 md:flex-row md:justify-between"
          >
            <span className="text-sm text-text-dim">{hero.location}</span>
            <div className="flex items-center gap-3">
              {marqueeIcons.slice(0, 5).map((slug, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={slug}
                  style={delay(0.95 + i * 0.06)}
                  src={`https://cdn.simpleicons.org/${slug}/5c626e`}
                  alt=""
                  aria-hidden
                  width={20}
                  height={20}
                  className="fade-up h-5 w-5 opacity-70 transition-[opacity,transform] duration-300 hover:-translate-y-0.5 hover:opacity-100"
                />
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{ y: mv(yFooter) }}
          className="relative z-30 mt-20 sm:mt-40"
        >
          <div
            style={delay(0.85)}
            className="fade-up flex flex-wrap items-center justify-center gap-4"
          >
            <Magnetic>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition-transform duration-200 hover:-translate-y-[1px] active:scale-[0.98]"
              >
                Get in touch
                <ArrowDownRightIcon size={16} weight="bold" />
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-full border border-border-strong px-6 py-3 text-sm text-text transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                View work
                <ArrowUpRightIcon size={16} weight="bold" />
              </a>
            </Magnetic>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
