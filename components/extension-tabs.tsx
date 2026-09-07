"use client";

import { useState } from "react";
import { getTld, PRIMARY_TLD_IDS, TLDS } from "@/lib/tlds";

/**
 * The extension selector. Five endings sit out front; the rest stay folded
 * away, because a wall of twenty dots is a list, not a choice.
 *
 * The selected ending explains itself underneath. "Which ending should I take"
 * is a real question and a row of dots does not answer it.
 */
export function ExtensionTabs({
  value,
  onChange,
  id = "extension",
}: {
  value: string;
  onChange: (tld: string) => void;
  id?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const primary = TLDS.filter((t) => PRIMARY_TLD_IDS.includes(t.id));
  const rest = TLDS.filter((t) => !PRIMARY_TLD_IDS.includes(t.id));
  const active = getTld(value);
  const activeIsHidden = !PRIMARY_TLD_IDS.includes(value);
  const shown = expanded || activeIsHidden ? [...primary, ...rest] : primary;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Domain extension"
        className="quiet-fill inline-flex flex-wrap items-center gap-1 rounded-full p-1"
      >
        {shown.map((tld) => {
          const isActive = tld.id === value;
          return (
            <button
              key={tld.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              title={tld.note}
              onClick={() => onChange(tld.id)}
              className={`inline-flex h-9 items-center justify-center rounded-full px-3.5 text-[13.5px] font-semibold tabular-nums transition-all duration-200 ease-soft ${
                isActive
                  ? "bg-obsidian text-obsidian-fg"
                  : "text-ink-2 hover:bg-card hover:text-ink"
              }`}
            >
              {tld.label}
            </button>
          );
        })}

        {!expanded && !activeIsHidden ? (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            aria-expanded={false}
            className="inline-flex h-9 items-center rounded-full px-3 text-[13px] font-semibold text-ink-3 transition-all duration-200 ease-soft hover:bg-card hover:text-ink"
          >
            {`+${rest.length} more`}
          </button>
        ) : null}
      </div>

      <p
        id={`${id}-note`}
        aria-live="polite"
        className="mt-2.5 text-[13px] leading-relaxed text-ink-2"
      >
        <span className="font-semibold text-ink">{active.label}</span>
        {` — ${active.note}`}
      </p>
    </div>
  );
}
