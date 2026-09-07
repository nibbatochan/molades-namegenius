"use client";

import { useState } from "react";
import { getTld, PRIMARY_TLD_IDS, TLDS } from "@/lib/tlds";

/**
 * The extension selector, cut into the rule beneath the entry line the way an
 * index tab is cut into a ledger page. Five endings sit on the rule; the rest
 * stay folded away, because a wall of twenty dots is a list, not a choice.
 *
 * The active ending explains itself underneath. "Which ending should I take" is
 * a real question and a row of dots does not answer it.
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

  return (
    <div>
      <div
        role="tablist"
        aria-label="Domain extension"
        className="flex flex-wrap items-stretch"
      >
        {primary.map((tld) => (
          <Tab
            key={tld.id}
            tld={tld.id}
            label={tld.label}
            note={tld.note}
            active={tld.id === value}
            onSelect={onChange}
          />
        ))}

        {expanded || activeIsHidden
          ? rest.map((tld) => (
              <Tab
                key={tld.id}
                tld={tld.id}
                label={tld.label}
                note={tld.note}
                active={tld.id === value}
                onSelect={onChange}
              />
            ))
          : null}

        {!expanded && !activeIsHidden ? (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            aria-expanded={false}
            className="clerk -ml-hair inline-flex h-9 items-center border border-rule px-3 text-ink-3 transition-colors duration-150 hover:bg-band hover:text-ink"
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
        <span className="text-ink">{active.label}</span>
        {` — ${active.note}`}
      </p>
    </div>
  );
}

function Tab({
  tld,
  label,
  note,
  active,
  onSelect,
}: {
  tld: string;
  label: string;
  note: string;
  active: boolean;
  onSelect: (tld: string) => void;
}) {
  return (
    <button
      role="tab"
      type="button"
      aria-selected={active}
      title={note}
      onClick={() => onSelect(tld)}
      className={`folio -ml-hair inline-flex h-9 items-center justify-center border px-3.5 text-[12.5px] font-semibold tracking-[0.06em] transition-colors duration-150 first:ml-0 ${
        active
          ? "z-10 border-tab-on bg-tab-on text-tab-on-ink"
          : "border-rule text-ink-2 hover:bg-band hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}
