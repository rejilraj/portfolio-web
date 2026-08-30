import { profile } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="font-mono text-[13px] text-text-faint">
          {profile.name} <span className="text-accent">/</span>{" "}
          {new Date().getFullYear()}
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-text-dim">
          <a
            href={`mailto:${profile.email}`}
            className="transition-colors hover:text-accent"
          >
            {profile.email}
          </a>
          {profile.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              {s.label}
            </a>
          ))}
          <a href="#top" className="transition-colors hover:text-accent">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
