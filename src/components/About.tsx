import { about } from "@/lib/content";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";
import { Parallax } from "./Parallax";
import { Counter } from "./Counter";

export function About() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 md:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* The two columns drift at different rates, so the block reads as
            layered rather than as one flat slab. */}
        <Parallax speed={0.16}>
          <h2 className="max-w-[16ch] text-3xl font-semibold tracking-tight sm:text-4xl">
            <SplitText text="Building the parts of a product that have to work" />{" "}
            <SplitText text="in real time." className="text-text-dim" delay={0.2} />
          </h2>
        </Parallax>

        <Parallax speed={-0.08} className="space-y-5">
          {about.body.map((p, i) => (
            <Reveal key={i} i={i}>
              <p className="max-w-[62ch] text-[15px] leading-relaxed text-text-dim">
                {p}
              </p>
            </Reveal>
          ))}
        </Parallax>
      </div>

      <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius)] border border-border bg-border sm:mt-20 lg:grid-cols-4">
        {about.stats.map((s, i) => (
          <Reveal
            key={s.label}
            i={i}
            className="group relative bg-bg-elev p-6 transition-colors duration-300 hover:bg-bg-card"
          >
            <div className="font-mono text-3xl font-bold text-accent">
              <Counter value={s.value} />
            </div>
            <div className="mt-2 text-[13px] leading-snug text-text-dim">
              {s.label}
            </div>
            <span className="absolute inset-x-0 bottom-0 h-px scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
