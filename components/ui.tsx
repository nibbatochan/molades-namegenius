import type { ReactNode } from "react";
import { CheckIcon, ClockIcon, GlobeIcon, ShieldIcon } from "./icons";
import type { AvailState, Provenance } from "@/lib/types";

// Written out rather than interpolated: a class assembled at runtime is not in
// the source Tailwind scans, so `bg-tint-${tint}` would silently never exist.
const TINT = {
  lav: "bg-tint-lav",
  cream: "bg-tint-cream",
  pink: "bg-tint-pink",
  mint: "bg-tint-mint",
} as const;

export function Card({
  children,
  className = "",
  tint,
}: {
  children: ReactNode;
  className?: string;
  tint?: keyof typeof TINT;
}) {
  return (
    <section
      className={`card-surface ${
        tint ? `${TINT[tint]} shadow-none ring-1 ring-hair` : "bg-card"
      } ${className}`}
    >
      {children}
    </section>
  );
}

/** The uppercase micro-label that opens every group. */
export function SectionLabel({
  children,
  icon,
  trailing,
}: {
  children: ReactNode;
  icon?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5">
      {icon ? (
        <span className="quiet-fill flex size-7 shrink-0 items-center justify-center rounded-[9px] text-ink-2">
          <span className="[&>svg]:size-4">{icon}</span>
        </span>
      ) : null}
      <span className="u-label">{children}</span>
      {trailing ? <span className="ml-auto">{trailing}</span> : null}
    </div>
  );
}

export function Hairline() {
  return <div className="h-px bg-hair" />;
}

const PILL_TONE = {
  available: "bg-ok-soft text-ok",
  taken: "bg-taken-soft text-taken",
  unverified: "bg-warn-soft text-warn",
  premium: "bg-prem-soft text-prem",
} as const;

const PILL_COPY: Record<AvailState, string> = {
  available: "Available",
  taken: "Taken",
  unverified: "Couldn't check",
  premium: "Premium",
};

export function StatusPill({
  state,
  detail,
  compact = false,
  animate = false,
}: {
  state: AvailState;
  detail?: string;
  compact?: boolean;
  animate?: boolean;
}) {
  const icon =
    state === "available" ? (
      <CheckIcon />
    ) : state === "unverified" ? (
      <ClockIcon />
    ) : state === "premium" ? (
      <ShieldIcon />
    ) : (
      <GlobeIcon />
    );

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full font-semibold ${PILL_TONE[state]} ${
        compact ? "px-2 py-1 text-[11px]" : "px-2.5 py-1.5 text-[12.5px]"
      } ${animate ? "animate-[popIn_260ms_var(--ease-soft)_both]" : ""}`}
    >
      <span className="[&>svg]:size-3.5">{icon}</span>
      {detail ?? PILL_COPY[state]}
    </span>
  );
}

export function CheckingPill({ compact = false }: { compact?: boolean }) {
  return (
    <span
      role="status"
      className={`quiet-fill inline-flex shrink-0 items-center gap-1.5 rounded-full font-semibold text-ink-2 ${
        compact ? "px-2 py-1 text-[11px]" : "px-2.5 py-1.5 text-[12.5px]"
      }`}
    >
      <span className="size-1.5 animate-pulse rounded-full bg-ink-3" />
      Checking
    </span>
  );
}

export function Button({
  children,
  onClick,
  variant = "accent",
  disabled,
  loading,
  size = "md",
  className = "",
  type = "button",
  href,
  pressed,
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "accent" | "obsidian" | "quiet" | "lime" | "outline";
  disabled?: boolean;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  href?: string;
  pressed?: boolean;
  title?: string;
}) {
  const tone = {
    accent: "bg-accent-fill text-accent-fg hover:bg-[var(--accent-fill-hover)]",
    obsidian: "bg-obsidian text-obsidian-fg hover:opacity-90",
    quiet: "quiet-fill text-ink hover:quiet-fill-hover",
    lime: "bg-lime text-[#14161a] hover:brightness-[0.97]",
    outline: "ring-1 ring-hair text-ink hover:quiet-fill",
  }[variant];

  const dims = {
    sm: "h-9 px-3.5 text-[13px] rounded-full",
    md: "h-11 px-5 text-[14.5px] rounded-full",
    lg: "h-14 px-7 text-[15.5px] rounded-full",
  }[size];

  const shared = `inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 ease-soft ${tone} ${dims} ${className}`;

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" title={title} className={shared}>
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
      aria-pressed={pressed}
      title={title}
      className={`${shared} disabled:cursor-not-allowed disabled:bg-[var(--hover)] disabled:text-ink-3 disabled:ring-0`}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`size-3.5 animate-spin rounded-full border-[2px] border-current border-t-transparent opacity-70 ${className}`}
      aria-hidden
    />
  );
}

export function CountBadge({ children }: { children: ReactNode }) {
  return (
    <span className="quiet-fill rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums text-ink-2">
      {children}
    </span>
  );
}

/**
 * A segmented control: the pill-shaped switch this design language uses wherever
 * one option out of a few is chosen.
 */
export function Segmented<T extends string>({
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
  const dims = size === "sm" ? "h-8 px-3 text-[12px]" : "h-10 px-4 text-[13.5px]";
  return (
    <div
      role="tablist"
      aria-label={label}
      className="quiet-fill inline-flex items-center gap-1 rounded-full p-1"
    >
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
            className={`inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 ease-soft ${dims} ${
              active
                ? "bg-card text-ink shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
                : "text-ink-2 hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** A choice chip, for the optional questions where nothing is preselected. */
export function ChoicePill({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full px-3.5 py-2 text-[13.5px] font-semibold transition-all duration-200 ease-soft ${
        active
          ? "bg-obsidian text-obsidian-fg"
          : "quiet-fill text-ink-2 hover:quiet-fill-hover hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

const PROVENANCE_COPY: Record<
  Provenance,
  { label: string; title: string; tone: string }
> = {
  scriptural: {
    label: "Scriptural",
    title: "Stated in a named text, cited alongside the rule.",
    tone: "bg-accent-soft text-accent",
  },
  traditional: {
    label: "Traditional",
    title: "Long-standing practice, carried by the tradition rather than one text.",
    tone: "bg-prem-soft text-prem",
  },
  modern: {
    label: "Modern convention",
    title: "Contemporary practitioner convention, not scripture.",
    tone: "bg-taken-soft text-taken",
  },
  ours: {
    label: "Our derivation",
    title:
      "Assembled by NameGenius from separately cited sources. Not a scriptural rule.",
    tone: "bg-warn-soft text-warn",
  },
};

/**
 * Where a rule comes from. Every rule in a Vastu derivation carries one, so the
 * product never states its own reasoning in scripture's voice.
 */
export function ProvenanceTag({ kind }: { kind: Provenance }) {
  const copy = PROVENANCE_COPY[kind];
  return (
    <span
      title={copy.title}
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${copy.tone}`}
    >
      {copy.label}
    </span>
  );
}
