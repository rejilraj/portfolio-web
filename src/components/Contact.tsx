"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRightIcon,
  CheckCircleIcon,
  CircleNotchIcon,
  EnvelopeSimpleIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { WEB3FORMS_KEY, profile } from "@/lib/content";

type Status = "idle" | "submitting" | "success" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const KEY_IS_SET = /^[0-9a-f-]{30,}$/i.test(WEB3FORMS_KEY);

export function Contact() {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = (data: FormData): Errors => {
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (name.length < 2) next.name = "Please enter your name.";
    if (!EMAIL_RE.test(email)) next.email = "Enter a valid email address.";
    if (message.length < 10)
      next.message = "A little more detail helps (10 characters or more).";
    return next;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // Fail loudly and usefully if the key was never filled in, rather than
    // letting the visitor think the message was delivered.
    if (!KEY_IS_SET) {
      setStatus("error");
      setServerError(
        `The form is not connected yet. Please email me directly at ${profile.email}.`,
      );
      return;
    }

    setStatus("submitting");
    setServerError(null);

    // Honeypot: bots fill hidden fields, humans cannot see them. Silently
    // accept so the bot does not learn it was caught.
    if (String(data.get("botcheck") ?? "")) {
      setStatus("success");
      form.reset();
      return;
    }

    data.append("access_key", WEB3FORMS_KEY);
    data.append("subject", `Portfolio message from ${data.get("name")}`);
    data.append("from_name", "Portfolio site");

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      const result = await res.json().catch(() => null);

      // Web3Forms returns 200 with { success: false } for a bad key, so the
      // status code alone is not enough to call this delivered.
      if (!res.ok || !result?.success) {
        throw new Error(result?.message ?? `Request failed (${res.status})`);
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setServerError(
        `Something went wrong sending that. Please email me directly at ${profile.email}.`,
      );
    }
  };

  const fieldClass =
    "w-full rounded-[10px] border border-border bg-bg-elev px-4 py-3 text-[15px] text-text outline-none transition-colors placeholder:text-text-dim focus:border-accent focus:ring-2 focus:ring-accent/40";

  return (
    <section
      id="contact"
      className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 md:py-32"
    >
      <p className="eyebrow mb-3">Contact</p>
      <h2 className="max-w-[18ch] text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
        Have something to build? Let me hear it.
      </h2>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        {/* form */}
        <div>
          {status === "success" ? (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-start gap-3 rounded-[var(--radius)] border border-accent/40 bg-accent-soft p-8"
            >
              <CheckCircleIcon size={28} weight="fill" className="text-accent" />
              <h3 className="text-lg font-semibold">Message sent</h3>
              <p className="text-sm text-text-dim">
                Thanks for reaching out. I usually reply within a day or two.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-2 text-sm text-accent link-underline"
              >
                Send another
              </button>
            </motion.div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              {/* Honeypot. Hidden from people and from screen readers; only
                  bots fill it in. */}
              <input
                type="checkbox"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Name"
                  name="name"
                  error={errors.name}
                  className={fieldClass}
                  placeholder="Ada Lovelace"
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  error={errors.email}
                  className={fieldClass}
                  placeholder="you@company.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm text-text-dim">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="What are you working on?"
                  aria-invalid={Boolean(errors.message)}
                  className={`${fieldClass} resize-y`}
                />
                {errors.message && <ErrorText>{errors.message}</ErrorText>}
              </div>

              {status === "error" && serverError && (
                <p className="flex items-center gap-2 text-sm text-rose-400">
                  <WarningCircleIcon size={16} weight="fill" />
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition-transform duration-200 hover:-translate-y-[1px] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "submitting" ? (
                  <>
                    <CircleNotchIcon size={16} className="animate-spin" />
                    Sending
                  </>
                ) : (
                  <>
                    Send message
                    <ArrowUpRightIcon size={16} weight="bold" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* aside */}
        <div className="flex flex-col gap-8 lg:pl-8">
          <div>
            <span className="font-mono text-[12px] text-text-faint">
              Direct
            </span>
            <a
              href={`mailto:${profile.email}`}
              className="mt-2 flex items-center gap-2 text-lg font-medium text-text link-underline"
            >
              <EnvelopeSimpleIcon size={18} className="text-accent" />
              {profile.email}
            </a>
          </div>

          <div>
            <span className="font-mono text-[12px] text-text-faint">
              Elsewhere
            </span>
            <ul className="mt-2 space-y-2">
              {profile.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[15px] text-text-dim transition-colors hover:text-accent"
                  >
                    {s.handle}
                    <ArrowUpRightIcon size={13} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <p className="max-w-[34ch] text-[13px] leading-relaxed text-text-faint">
            Currently in Chennai, open to remote and hybrid roles. Replies within
            a day or two.
          </p>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  className,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  className: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm text-text-dim">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={className}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 text-[13px] text-rose-400">
      <WarningCircleIcon size={13} weight="fill" />
      {children}
    </span>
  );
}
