import type { ReactNode } from "react";
import type { AvailState, Provenance } from "@/lib/types";

/**
 * The register's vocabulary. Division is a hairline, a group is a ruled block,
 * and a status is an impression pressed into the page. Nothing in this file
 * floats, rounds, or casts a shadow — the ledger has no such objects.
 */

/** A ruled block. The register's only container, and it has no edges of its own. */
export function Block({
  children,
  className = "",
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "aside";
}) {
  return <Tag className={`ruled ${className}`}>{children}</Tag>;
}

/** A clerk's label: the only label form in the book. */
export function Clerk({
  children,
  className = "",
  trailing,
}: {
  children: ReactNode;
  className?: string;
  trailing?: ReactNode;
}) {
  return (
    <div className={`flex items-baseline gap-3 ${className}`}>
      <span className="clerk text-ink-2">{children}</span>
      {trailing ? <span className="ml-auto">{trailing}</span> : null}
    </div>
  );
}

/** A folio number, always tabular so a column of them lines up. */
export function Folio({
  n,
  className = "",
}: {
  n: number | string;
  className?: string;
}) {
  const text = typeof n === "number" ? String(n).padStart(4, "0") : n;
  return (
    <span className={`folio clerk text-ink-3 ${className}`}>{text}</span>
  );
}

/** A hairline, optionally the heavier rule that closes a section. */
export function Rule({
  strong = false,
  className = "",
}: {
  strong?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`h-hair ${strong ? "bg-rule-strong" : "bg-rule"} ${className}`}
    />
  );
}

const IMPRESSION_COPY: Record<AvailState, string> = {
  available: "Available",
  taken: "Registered",
  unverified: "No impression",
  premium: "Reserved",
};

/**
 * The stamp. An impression is eroded at its edges and sits a couple of degrees
 * off square, because a rubber stamp does. `available` and `taken` are inked;
 * `unverified` is a dry press that left almost nothing, which is the honest
 * picture of a registry that would not answer; `premium` is a blind emboss,
 * relief with no ink at all.
 */
export function Impression({
  state,
  detail,
  size = "md",
  animate = false,
}: {
  state: AvailState;
  detail?: string;
  size?: "sm" | "md";
  animate?: boolean;
}) {
  const dims =
    size === "sm"
      ? "px-2.5 py-1 text-[10.5px] tracking-[0.16em]"
      : "px-4 py-2 text-[13px] tracking-[0.18em]";

  const tone =
    state === "available"
      ? "text-stamp border-stamp"
      : state === "taken"
        ? "text-ink border-ink"
        : state === "premium"
          ? "text-seal border-seal"
          : "text-ink-3 border-ink-3";

  // Each state gets its own tilt so a column of stamps never looks printed by
  // machine, and the value is fixed per state rather than random so the server
  // and client agree.
  const tilt =
    state === "available"
      ? "-2.4deg"
      : state === "taken"
        ? "1.8deg"
        : state === "premium"
          ? "-1.2deg"
          : "2.6deg";

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center border-[1.5px] font-semibold uppercase ${tone} ${dims} ${
        state === "unverified" ? "opacity-55 border-dashed" : "impression"
      } ${animate ? "animate-[strike_420ms_var(--ease-stamp)_both]" : ""}`}
      style={{
        // @ts-expect-error -- custom property consumed by the strike keyframes
        "--tilt": tilt,
        transform: `rotate(${tilt})`,
        ...(state === "premium"
          ? {
              textShadow:
                "0 1px 0 color-mix(in oklab, var(--stock) 70%, white), 0 -1px 0 color-mix(in oklab, var(--ink) 22%, transparent)",
            }
          : null),
      }}
    >
      {/* The double rule of a stamp cartouche. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-[3px] border ${
          state === "unverified" ? "border-dashed" : ""
        }`}
        style={{ borderColor: "currentColor", opacity: 0.45 }}
      />
      {detail ?? IMPRESSION_COPY[state]}
    </span>
  );
}

/** The cartouche before the stamp lands: an empty box waiting for the press. */
export function Pending({ size = "md" }: { size?: "sm" | "md" }) {
  const dims =
    size === "sm"
      ? "px-2.5 py-1 text-[10.5px] tracking-[0.16em]"
      : "px-4 py-2 text-[13px] tracking-[0.18em]";
  return (
    <span
      role="status"
      className={`inline-flex shrink-0 items-center gap-2 border-[1.5px] border-dashed border-rule font-semibold uppercase text-ink-3 ${dims}`}
    >
      <span className="size-1.5 animate-pulse bg-ink-3" aria-hidden="true" />
      Checking
    </span>
  );
}

/**
 * Tabs cut into a rule, the way an index tab is cut into a ledger page. The
 * active tab is filled and its label reversed out; the rest are ruled outlines
 * hanging off the same line.
 */
export function CutTabs<T extends string>({
  options,
  value,
  onChange,
  label,
  size = "md",
}: {
  options: { id: T; label: string; title?: string }[];
  value: T;
  onChange: (id: T) => void;
  label: string;
  size?: "sm" | "md";
}) {
  const dims =
    size === "sm" ? "h-7 px-2.5 text-[10.5px]" : "h-9 px-3.5 text-[11.5px]";

  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap items-stretch">
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            role="tab"
            type="button"
            aria-selected={active}
            title={option.title}
            onClick={() => onChange(option.id)}
            className={`clerk -ml-hair inline-flex items-center justify-center border border-rule transition-colors duration-150 first:ml-0 ${dims} ${
              active
                ? "z-10 border-tab-on bg-tab-on text-tab-on-ink"
                : "text-ink-2 hover:bg-band hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * An action. Rectangular and letterspaced, because this world has no pills.
 * `press` is the one vermilion action on a view; everything else is ruled.
 */
export function Action({
  children,
  onClick,
  variant = "press",
  disabled,
  loading,
  size = "md",
  type = "button",
  className = "",
  href,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "press" | "ruled" | "quiet";
  disabled?: boolean;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit";
  className?: string;
  href?: string;
}) {
  const tone = {
    press:
      "bg-stamp-fill text-white border-stamp-fill hover:bg-stamp hover:border-stamp",
    ruled: "border-rule-strong text-ink hover:bg-band",
    quiet: "border-transparent text-ink-2 hover:text-ink hover:bg-band",
  }[variant];

  const dims = {
    sm: "h-8 px-3 text-[10.5px]",
    md: "h-11 px-5 text-[11.5px]",
    lg: "h-[52px] px-7 text-[12.5px]",
  }[size];

  const shared = `clerk inline-flex items-center justify-center gap-2.5 border transition-colors duration-150 disabled:cursor-not-allowed disabled:border-rule-2 disabled:bg-transparent disabled:text-ink-3 ${tone} ${dims} ${className}`;

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={shared}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={shared}
    >
      {loading ? <Nib /> : null}
      {children}
    </button>
  );
}

/** A pen nib turning: the register's loading mark. */
export function Nib({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block size-3 animate-spin border border-current border-r-transparent border-b-transparent ${className}`}
    />
  );
}

/** A figure read against its scale, so no bare number appears in the book. */
export function Measured({
  value,
  of,
  unit,
  className = "",
}: {
  value: number | string;
  of?: number | string;
  unit: string;
  className?: string;
}) {
  return (
    <span className={`folio clerk text-ink-2 ${className}`}>
      <span className="text-ink">{value}</span>
      {of !== undefined ? <span className="text-ink-3">{` / ${of}`}</span> : null}
      <span className="text-ink-3">{` ${unit}`}</span>
    </span>
  );
}

/**
 * Provenance. Every rule in a derivation says where it comes from, so the
 * product never speaks in scripture's voice about something it assembled.
 */
const PROVENANCE_COPY: Record<Provenance, { label: string; title: string }> = {
  scriptural: {
    label: "Scriptural",
    title: "Stated in a named text, cited alongside the rule.",
  },
  traditional: {
    label: "Traditional",
    title: "Long-standing practice, carried by the tradition rather than one text.",
  },
  modern: {
    label: "Modern convention",
    title: "Contemporary practitioner convention, not scripture.",
  },
  ours: {
    label: "Our derivation",
    title: "Assembled by NameGenius from separately cited sources. Not a scriptural rule.",
  },
};

export function ProvenanceMark({ kind }: { kind: Provenance }) {
  const copy = PROVENANCE_COPY[kind];
  return (
    <span
      title={copy.title}
      className={`clerk inline-flex items-center gap-1.5 border px-1.5 py-0.5 ${
        kind === "ours"
          ? "border-stamp text-stamp"
          : kind === "scriptural"
            ? "border-rule-strong text-ink-2"
            : "border-rule text-ink-3"
      }`}
    >
      {copy.label}
    </span>
  );
}
