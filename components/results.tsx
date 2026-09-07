"use client";

import { useState } from "react";
import type { Candidate } from "@/lib/types";
import { ChevronIcon, LayersIcon, SparkIcon } from "./icons";
import { Button, Card, CountBadge, Hairline, SectionLabel, Spinner, StatusPill } from "./ui";

export type RunPhase = "idle" | "running" | "done";

const STYLE_COPY: Record<Candidate["style"], string> = {
  variant: "A turn on what you typed",
  compound: "Two words joined",
  blend: "Two words blended",
  metaphor: "A figure from your description",
  affix: "A prefix or suffix added",
};

/**
 * The results. Names appear as the registry answers, each already checked, so
 * a card never changes its mind after you have read it. The reasoning is folded
 * away rather than shouting over twenty other cards.
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
    <section aria-label="Names found" className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <h2 className="text-[22px] font-semibold tracking-[-0.02em]">
          {phase === "running" ? "Checking names" : "Names you can own"}
        </h2>
        <div className="flex items-center gap-3 text-[13px] font-semibold text-ink-2">
          <CountBadge>{`${candidates.length} free on .${tld}`}</CountBadge>
          <CountBadge>{`${checked} checked`}</CountBadge>
          {phase === "running" ? <Spinner /> : null}
        </div>
      </div>

      {candidates.length === 0 && phase === "running" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Card key={i} className="p-5">
              <div
                className="quiet-fill h-6 rounded-full"
                style={{ width: `${68 - i * 6}%` }}
              />
              <div className="quiet-fill mt-3 h-4 w-1/3 rounded-full" />
            </Card>
          ))}
        </div>
      ) : null}

      {close.length > 0 ? (
        <Group
          icon={<LayersIcon />}
          title={seedName ? `Close to ${seedName}` : "Close to what you typed"}
          note="Recognisably the name you came in with, with the smallest change that clears the registry."
          entries={close}
          tld={tld}
        />
      ) : null}

      {fresh.length > 0 ? (
        <Group
          icon={<SparkIcon />}
          title="Fresh names"
          note="Drawn from your description and keywords rather than from the name you typed."
          entries={fresh}
          tld={tld}
        />
      ) : null}

      {phase === "done" && candidates.length === 0 ? (
        <Card className="p-7">
          <p className="max-w-[58ch] text-[15px] leading-relaxed text-ink-2">
            {`Every name we drafted is already registered on .${tld}. That is a real answer, not a failure — try another ending, or give the description more to work with.`}
          </p>
        </Card>
      ) : null}
    </section>
  );
}

function Group({
  icon,
  title,
  note,
  entries,
  tld,
}: {
  icon: React.ReactNode;
  title: string;
  note: string;
  entries: Candidate[];
  tld: string;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <SectionLabel icon={icon} trailing={<CountBadge>{entries.length}</CountBadge>}>
          {title}
        </SectionLabel>
        <p className="max-w-[64ch] text-[13px] leading-relaxed text-ink-3">{note}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {entries.map((candidate) => (
          <Entry key={candidate.domain} candidate={candidate} tld={tld} />
        ))}
      </div>
    </div>
  );
}

function Entry({ candidate, tld }: { candidate: Candidate; tld: string }) {
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
    <Card className="animate-[fadeIn_320ms_var(--ease-soft)_both] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[20px] font-semibold tracking-[-0.02em]">
            {candidate.name}
          </p>
          <p className="mt-1 truncate text-[13px] text-ink-3">{`.${tld}`}</p>
        </div>
        <StatusPill state={candidate.state} compact animate />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button size="sm" variant="quiet" onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </Button>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="ml-auto inline-flex items-center gap-1 text-[12.5px] font-semibold text-ink-2 transition-colors duration-200 hover:text-ink"
        >
          {open ? "Less" : "Why this one"}
          <ChevronIcon
            className={`size-4 transition-transform duration-200 ease-soft ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {open ? (
        <div className="mt-4 space-y-3">
          <Hairline />
          <p className="text-[13.5px] leading-relaxed text-ink">{candidate.rationale}</p>
          <p className="text-[12px] text-ink-3">
            {`${STYLE_COPY[candidate.style]} · checked at ${new Date(
              candidate.checkedAt,
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
          </p>
        </div>
      ) : null}
    </Card>
  );
}
