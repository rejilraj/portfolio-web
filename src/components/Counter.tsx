"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

/*
  Counts a metric up from zero the first time it scrolls into view, so the eye
  lands on the number instead of sliding past it. Non-numeric characters
  ("50%", "4+") are preserved around the digits.

  Correctness rule: this must never leave a *wrong* number on screen. The real
  value is what renders from the server, and the element is only reset to zero
  when it starts below the fold, where nobody can read it. If the tile is
  already visible on load, or the observer never fires, or motion is reduced,
  the true value just stays put.
*/
export function Counter({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const started = useRef(false);
  // Only safe to show a placeholder zero if the tile began off-screen.
  const canPrime = useRef(false);

  const match = value.match(/^(\D*)([\d.]+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const digits = match?.[2] ?? "";
  const suffix = match?.[3] ?? "";

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || !digits) return;

    const target = parseFloat(digits);
    const decimals = digits.includes(".") ? digits.split(".")[1].length : 0;
    const render = (v: number) => {
      el.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`;
    };
    const settle = () => render(target);

    if (!started.current && !inView) {
      // Only replace the real number with a placeholder zero when we are sure
      // the count-up can actually run: the page is being rendered, and the tile
      // is far enough down that nobody can read it yet.
      if (!canPrime.current) {
        canPrime.current =
          document.visibilityState === "visible" &&
          el.getBoundingClientRect().top > window.innerHeight * 0.9;
      }
      if (canPrime.current) render(0);
      return;
    }

    if (started.current) return;
    started.current = true;

    if (!canPrime.current) return; // never primed, so the truth is already shown

    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: render,
      onComplete: settle,
    });

    // If the page is hidden mid-count the frame loop stops, which would strand a
    // wrong value. Correctness beats the animation: snap to the real number.
    const onHide = () => {
      if (document.visibilityState === "hidden") {
        controls.stop();
        settle();
      }
    };
    document.addEventListener("visibilitychange", onHide);

    return () => {
      controls.stop();
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [inView, reduce, prefix, digits, suffix]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
