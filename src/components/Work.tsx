"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowUpRightIcon, GithubLogoIcon } from "@phosphor-icons/react";
import { profile, projects, type Project } from "@/lib/content";
import { SplitText } from "./SplitText";

const accentMap: Record<Project["accent"], string> = {
  cyan: "rgba(61,225,255,0.20)",
  violet: "rgba(167,139,250,0.20)",
  amber: "rgba(251,191,36,0.18)",
  rose: "rgba(251,113,133,0.18)",
};

const glowMap: Record<Project["accent"], string> = {
  cyan: "var(--accent)",
  violet: "var(--violet)",
  amber: "var(--amber)",
  rose: "var(--rose)",
};

function Card({ project, index }: { project: Project; index: number }) {
  const wide = project.span === "wide";
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  /* Pointer-driven tilt: the card leans away from the cursor like a physical
     panel, which makes the grid feel touchable instead of printed. */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const config = { stiffness: 200, damping: 22, mass: 0.5 };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), config);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), config);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    // Spotlight position, read by the CSS gradient below.
    el.style.setProperty("--px", `${e.clientX - r.left}px`);
    el.style.setProperty("--py", `${e.clientY - r.top}px`);
    if (reduce) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    /* Two nested elements on purpose: the outer one owns the CSS scroll reveal
       (which fills `transform`), the inner one owns the Motion tilt. Putting
       both on one node would let the finished reveal animation pin the
       transform and kill the tilt. */
    <div
      style={{ "--i": index % 2 } as React.CSSProperties}
      className={`reveal ${wide ? "md:col-span-2" : ""}`}
    >
      <motion.article
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          rotateX: reduce ? undefined : rotateX,
          rotateY: reduce ? undefined : rotateY,
          transformPerspective: 1100,
          backgroundImage: `radial-gradient(60% 80% at 100% 0%, ${
            accentMap[project.accent]
          }, transparent 60%)`,
        }}
        className="group relative flex h-full min-h-[260px] flex-col justify-between overflow-hidden rounded-[var(--radius)] border border-border bg-bg-card p-6 transition-[border-color,box-shadow] duration-300 hover:border-border-strong hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]"
      >
      {/* cursor spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--px) var(--py), rgba(61,225,255,0.10), transparent 70%)",
        }}
      />

      <div
        className={
          wide ? "relative grid gap-6 md:grid-cols-[1.5fr_1fr]" : "relative"
        }
      >
        <div className="flex flex-col">
          <div className="flex items-start justify-between">
            <span className="font-mono text-[12px] text-text-faint">
              {project.tag}
            </span>
            {!wide && (
              <ArrowUpRightIcon
                size={18}
                className="text-text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
              />
            )}
          </div>
          <h3 className="mt-4 text-xl font-semibold tracking-tight sm:text-2xl">
            {project.name}
          </h3>
          <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-text-dim">
            {project.blurb}
          </p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((tech, i) => (
              <li
                key={tech}
                style={{ "--i": i } as React.CSSProperties}
                className="reveal-pop rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-text-dim transition-colors duration-300 group-hover:border-border-strong"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>

        {wide && (
          <div
            aria-hidden
            className="relative hidden overflow-hidden rounded-[10px] border border-border md:block"
          >
            <div
              className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-2xl transition-transform duration-700 group-hover:scale-125"
              style={{ background: glowMap[project.accent], opacity: 0.28 }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:22px_22px] transition-transform duration-700 group-hover:scale-105" />
            <ArrowUpRightIcon
              size={22}
              className="absolute right-4 top-4 text-text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
            />
          </div>
        )}
        </div>
      </motion.article>
    </div>
  );
}

export function Work() {
  return (
    <section
      id="work"
      className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 md:py-32"
    >
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">Selected work</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            <SplitText text="Things I have shipped" />
          </h2>
        </div>
        <a
          href={profile.socials[0].href}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 text-sm text-text-dim transition-colors hover:text-accent"
        >
          <GithubLogoIcon
            size={16}
            className="transition-transform duration-300 group-hover:-translate-y-0.5"
          />
          More on GitHub
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project, i) => (
          <Card key={project.name} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
