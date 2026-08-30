import type { CSSProperties } from "react";

/*
  Reveals a headline one word (or character) at a time, each sliding up from
  behind a clipping mask. Communicates reading order and gives display type a
  sense of physical weight.

  Deliberately CSS-only (see globals.css): a headline must never be able to get
  stuck hidden because JavaScript failed, an in-view observer never fired, or
  the browser lacks scroll-driven animations. In every one of those cases the
  text simply renders. `mode="mount"` animates once on load, `mode="view"`
  animates as the heading scrolls into view.
*/
export function SplitText({
  text,
  by = "word",
  mode = "view",
  className,
  stagger = 0.045,
  delay = 0,
}: {
  text: string;
  by?: "word" | "char";
  mode?: "mount" | "view";
  className?: string;
  /** Seconds between pieces. Only used by mode="mount". */
  stagger?: number;
  /** Seconds before the first piece moves. Only used by mode="mount". */
  delay?: number;
}) {
  const pieces = by === "char" ? [...text] : text.split(" ");

  return (
    <span
      className={`${mode === "mount" ? "split-mount" : "split-view"} ${
        className ?? ""
      }`}
      style={
        {
          "--stagger": `${stagger}s`,
          "--d": `${delay}s`,
        } as CSSProperties
      }
    >
      {pieces.map((p, i) => (
        <span
          key={`${p}-${i}`}
          className="split-piece"
          style={{ "--i": i } as CSSProperties}
        >
          <span>
            {p}
            {by === "word" && i < pieces.length - 1 ? " " : null}
          </span>
        </span>
      ))}
    </span>
  );
}
