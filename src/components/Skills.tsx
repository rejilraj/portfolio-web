import type { CSSProperties } from "react";
import { skillGroups } from "@/lib/content";
import { SplitText } from "./SplitText";

const idx = (i: number) => ({ "--i": i }) as CSSProperties;

export function Skills() {
  return (
    <section
      id="skills"
      className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 md:py-32"
    >
      <h2 className="mb-14 text-3xl font-semibold tracking-tight sm:text-4xl">
        <SplitText text="Toolkit" />
      </h2>

      <div className="divide-y divide-border border-y border-border">
        {skillGroups.map((group, i) => (
          <div
            key={group.label}
            style={idx(i)}
            className="reveal grid gap-3 py-6 sm:grid-cols-[180px_1fr] sm:gap-8"
          >
            <h3 className="font-mono text-[13px] tracking-wide text-text-faint">
              {group.label}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item, j) => (
                <li
                  key={item}
                  style={idx(j)}
                  className="reveal-pop cursor-default rounded-full border border-border bg-bg-elev px-3 py-1.5 text-[13px] text-text-dim transition-[color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-text"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
