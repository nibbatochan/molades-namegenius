"use client";

import { useState } from "react";
import type { Candidate } from "@/lib/types";
import { Action, Clerk, Folio, Impression, Measured, Nib, Rule } from "./ledger";

export type RunPhase = "idle" | "running" | "done";

const STYLE_COPY: Record<Candidate["style"], string> = {
  variant: "A turn on what you typed",
  compound: "Two words joined",
  blend: "Two words blended",
  metaphor: "A figure from your description",
  affix: "A prefix or suffix added",
};

/**
 * The results ledger. Names arrive as ruled entries, written in as the registry
 * answers, each with its impression already taken — nothing appears here that
 * has not been checked, so a row never changes its mind after you read it.
 *
 * Detail is folded: the entry carries the name and the verdict, and the
 * reasoning opens on request rather than shouting over twenty other rows.
 */
export function ResultsPanel({
  candidates,
  phase,
  checked,
  seedName,
  tld,
}: {
  candidates: Candidate[];
  phase: RunPhase;
  checked: number;
  seedName: string;
  tld: string;
}) {
  const close = candidates.filter((c) => c.group === "close");
  const fresh = candidates.filter((c) => c.group === "fresh");

  return (
    <section aria-label="Names found">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 pb-5">
        <h2 className="font-display text-[26px] leading-none font-semibold tracking-[-0.02em]">
          {phase === "running" ? "Pressing the register" : "The register"}
        </h2>
        <div className="flex items-center gap-5">
          <Measured value={candidates.length} unit={`free on .${tld}`} />
          <Measured value={checked} unit="checked" />
          {phase === "running" ? <Nib /> : null}
        </div>
      </div>

      <Rule strong />

      {candidates.length === 0 && phase === "running" ? (
        <ul aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => (
            <li key={i} className="ruled-b flex items-center gap-6 py-6">
              <span className="h-hair w-10 bg-rule-2" />
              <span
                className="h-5 bg-rule-2"
                style={{ width: `${34 - i * 4}%`, opacity: 1 - i * 0.16 }}
              />
            </li>
          ))}
        </ul>
      ) : null}

      {close.length > 0 ? (
        <Group
          title={seedName ? `Close to ${seedName}` : "Close to what you typed"}
          note="Recognisably the name you came in with, with the smallest change that clears the registry."
          entries={close}
          startAt={1}
          tld={tld}
        />
      ) : null}

      {fresh.length > 0 ? (
        <Group
          title="Fresh names"
          note="Drawn from your description and keywords rather than from the name you typed."
          entries={fresh}
          startAt={close.length + 1}
          tld={tld}
        />
      ) : null}

      {phase === "done" && candidates.length === 0 ? (
        <div className="py-10">
          <p className="max-w-[58ch] text-[15px] leading-relaxed text-ink-2">
            {`Every name the generator drafted is already registered on .${tld}. That is a real answer, not a failure — try another ending, or give the description more to work with.`}
          </p>
        </div>
      ) : null}
    </section>
  );
}

function Group({
  title,
  note,
  entries,
  startAt,
  tld,
}: {
  title: string;
  note: string;
  entries: Candidate[];
  startAt: number;
  tld: string;
}) {
  return (
    <div className="pt-7">
      <Clerk>{title}</Clerk>
      <p className="mt-2 max-w-[64ch] pb-4 text-[13px] leading-relaxed text-ink-3">{note}</p>
      <ul className="ruled">
        {entries.map((candidate, i) => (
          <Entry
            key={candidate.domain}
            candidate={candidate}
            folio={startAt + i}
            tld={tld}
          />
        ))}
      </ul>
    </div>
  );
}

function Entry({
  candidate,
  folio,
  tld,
}: {
  candidate: Candidate;
  folio: number;
  tld: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(candidate.domain);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <li className="ruled-b animate-[write-in_320ms_var(--ease-draw)_both]">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-5">
        <Folio n={folio} className="shrink-0" />

        <div className="min-w-0 flex-1">
          <p className="font-display text-[24px] leading-none font-semibold tracking-[-0.02em]">
            {candidate.name}
          </p>
          <p className="folio mt-2 text-[13px] text-ink-3">{`.${tld}`}</p>
        </div>

        <Impression state={candidate.state} size="sm" animate />

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="clerk border border-rule px-3 py-2 text-ink-2 transition-colors duration-150 hover:bg-band hover:text-ink"
        >
          {open ? "Less" : "Why"}
        </button>
      </div>

      {open ? (
        <div className="grid gap-4 pb-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-8">
          <div>
            <p className="max-w-[62ch] text-[14px] leading-relaxed text-ink">
              {candidate.rationale}
            </p>
            <p className="mt-2 text-[12.5px] text-ink-3">
              {`${STYLE_COPY[candidate.style]} · checked against the registry at ${new Date(
                candidate.checkedAt,
              ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
            </p>
          </div>
          <Action variant="ruled" size="sm" onClick={copy}>
            {copied ? "Copied" : "Copy"}
          </Action>
        </div>
      ) : null}
    </li>
  );
}
