import type { ReactNode } from "react";

/*
  Scroll reveal via native CSS scroll-driven animation (see globals.css .reveal).
  No JavaScript, no IntersectionObserver: where `animation-timeline: view()` is
  unsupported the content simply renders visible. Communicates reading order.
*/
export function Reveal({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  i?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  return <Tag className={`reveal ${className}`}>{children}</Tag>;
}
