"use client";

import { useEffect, useState } from "react";
import { nav, profile } from "@/lib/content";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("nav-sentinel");
    if (!sentinel) return;
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: "0px" },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  return (
    // Entrance is CSS so the navigation can never be hidden by a script
    // failure; only the scrolled/unscrolled chrome swap needs JS.
    <header
      style={{ "--d": "0.1s" } as React.CSSProperties}
      className="fade-down fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 transition-colors duration-300 sm:px-8 ${
          scrolled
            ? "border-b border-border bg-bg/80 backdrop-blur-md"
            : "border-b border-transparent"
        }`}
      >
        <a
          href="#top"
          className="font-mono text-[13px] tracking-[0.14em] text-text"
          aria-label="Back to top"
        >
          RRP<span className="text-accent">.</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="link-underline text-sm text-text-dim transition-colors hover:text-text"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm text-text-dim transition-colors hover:text-text sm:block"
          >
            Resume
          </a>
          <a
            href="#contact"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-transform duration-200 hover:-translate-y-[1px] active:scale-[0.97]"
          >
            Get in touch
          </a>
        </div>
      </div>
    </header>
  );
}
