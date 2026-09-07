"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { normalizeName } from "@/lib/domain";
import { loadChecks, saveChecks, type SessionCheck } from "@/lib/session";
import { hasAnyInput, scoreStrength, STRENGTH_MAX } from "@/lib/text";
import { DEFAULT_TLD_ID } from "@/lib/tlds";
import {
  EMPTY_DISCOVERY,
  type Candidate,
  type CheckResult,
  type DiscoveryAnswers,
  type RunInput,
} from "@/lib/types";
import { EntryLine } from "./entry-line";
import { RuleOrnament } from "./guilloche";
import { Action, Clerk, Impression, Measured, Rule } from "./ledger";
import { ResultsPanel, type RunPhase } from "./results";

const DESCRIPTION_MAX = 1000;

const EXAMPLE = {
  name: "northwind",
  description:
    "A scheduling tool for independent physiotherapy clinics. Patients book and reschedule their own appointments, clinicians share one calendar, and no-shows drop because reminders go out over SMS the day before.",
  keywords: ["physiotherapy", "appointment booking", "clinic scheduling"],
  competitors: ["cliniko", "jane app"],
  discovery: { tone: "neutral", style: "compound", length: "short" } as DiscoveryAnswers,
};

/**
 * The open register: check a name, and when it is gone, get names that are not.
 *
 * Everything optional stays folded until asked for. One filled row is enough to
 * run, which is why the entry line sits alone above the fold and the rest of
 * the sheet is disclosed underneath it.
 */
export function OpenRegister() {
  const [name, setName] = useState("");
  const [tld, setTld] = useState(DEFAULT_TLD_ID);
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [discovery, setDiscovery] = useState<DiscoveryAnswers>(EMPTY_DISCOVERY);

  const [suggested, setSuggested] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [checks, setChecks] = useState<SessionCheck[]>([]);
  const [prefilledFrom, setPrefilledFrom] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const [phase, setPhase] = useState<RunPhase>("idle");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [checkedCount, setCheckedCount] = useState(0);
  const [runTld, setRunTld] = useState(DEFAULT_TLD_ID);
  const runRef = useRef<AbortController | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const input: RunInput = useMemo(
    () => ({ name, description, keywords, competitors, discovery, tld }),
    [name, description, keywords, competitors, discovery, tld],
  );
  const strength = useMemo(() => scoreStrength(input), [input]);
  const canRun = hasAnyInput(input);
  const isEmpty = !canRun && Object.values(discovery).every((v) => !v);

  useEffect(() => setChecks(loadChecks()), []);

  // Keyword suggestions run on a long debounce, not per keystroke.
  useEffect(() => {
    if (description.trim().length < 40) {
      setSuggested([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/keywords", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ description, existing: keywords }),
        });
        const data = (await res.json()) as { keywords: string[] };
        setSuggested(
          data.keywords.filter((k) => !dismissed.includes(k) && !keywords.includes(k)),
        );
      } catch {
        setSuggested([]);
      }
    }, 900);
    return () => clearTimeout(timer);
  }, [description, keywords, dismissed]);

  const recordCheck = useCallback((result: CheckResult) => {
    setChecks((previous) => {
      const next = [
        { domain: result.domain, state: result.state },
        ...previous.filter((c) => c.domain !== result.domain),
      ].slice(0, 8);
      saveChecks(next);
      return next;
    });
  }, []);

  function applyExample() {
    setName(EXAMPLE.name);
    setDescription(EXAMPLE.description);
    setKeywords(EXAMPLE.keywords);
    setCompetitors(EXAMPLE.competitors);
    setDiscovery(EXAMPLE.discovery);
    setPrefilledFrom("the example");
    setSheetOpen(true);
  }

  async function run() {
    runRef.current?.abort();
    const controller = new AbortController();
    runRef.current = controller;

    setPhase("running");
    setCandidates([]);
    setCheckedCount(0);
    setRunTld(tld);
    // The results land below the sheet, so take the reader with them.
    requestAnimationFrame(() =>
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
        signal: controller.signal,
      });
      if (!res.body) {
        setPhase("done");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as
            | { type: "meta" }
            | { type: "candidate"; candidate: Candidate }
            | { type: "done"; checked: number };

          if (event.type === "candidate") {
            setCandidates((previous) => [...previous, event.candidate]);
            setCheckedCount((c) => c + 1);
          } else if (event.type === "done") {
            setCheckedCount(event.checked);
            setPhase("done");
          }
        }
      }
      setPhase("done");
    } catch {
      if (!controller.signal.aborted) setPhase("done");
    }
  }

  const remaining = DESCRIPTION_MAX - description.length;

  return (
    <div>
      <EntryLine
        value={name}
        onChange={setName}
        tld={tld}
        onTldChange={setTld}
        onResult={recordCheck}
        onFindAlternatives={run}
      />

      {checks.length > 0 ? (
        <div className="ruled flex flex-wrap items-center gap-x-6 gap-y-3 py-4">
          <Clerk>Checked this session</Clerk>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {checks.map((check) => (
              <li key={check.domain}>
                <button
                  type="button"
                  onClick={() => setName(check.domain.split(".")[0])}
                  className="folio flex items-center gap-2 text-[13px] text-ink-2 hover:text-ink"
                >
                  {check.domain}
                  <Impression state={check.state} size="sm" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Everything beyond the name is disclosed on request. */}
      <div className="ruled">
        <button
          type="button"
          onClick={() => setSheetOpen((v) => !v)}
          aria-expanded={sheetOpen}
          className="flex w-full items-baseline gap-5 py-5 text-left"
        >
          <span className="font-display text-[19px] font-semibold tracking-[-0.01em]">
            Tell the register what you are building
          </span>
          <span className="clerk ml-auto text-ink-3">
            {sheetOpen ? "Close" : canRun ? "Open — filled" : "Open — optional"}
          </span>
        </button>

        {sheetOpen ? (
          <div className="pb-8">
            <Row
              label="What you are building"
              why="The more specific, the better the names. Who it is for, and what it replaces, both help."
              trailing={
                <span
                  className={`folio clerk ${remaining <= 120 ? "text-stamp" : "text-ink-3"}`}
                >
                  {`${description.length} / ${DESCRIPTION_MAX}`}
                </span>
              }
            >
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, DESCRIPTION_MAX))}
                rows={6}
                aria-label="What you are building"
                placeholder="A scheduling tool for independent physiotherapy clinics. Patients book their own appointments, clinicians share one calendar, and reminders go out over SMS the day before."
                className="w-full border border-rule bg-transparent px-3.5 py-3 text-[15px] leading-relaxed focus:border-ink-2"
              />
              {prefilledFrom ? (
                <p className="mt-2 text-[12.5px] text-ink-2">
                  {`Prefilled from ${prefilledFrom}. Edit anything that is not right.`}
                </p>
              ) : null}
            </Row>

            <Row
              label="Read it off a site"
              why="Paste a URL and we read the page's own description and keywords off it. Nothing is stored."
            >
              <UrlRow
                onDerived={(derived) => {
                  if (derived.description) {
                    setDescription(derived.description.slice(0, DESCRIPTION_MAX));
                  }
                  if (derived.keywords.length) {
                    setKeywords((previous) =>
                      [...new Set([...previous, ...derived.keywords])].slice(0, 10),
                    );
                  }
                  setPrefilledFrom(derived.title || derived.url);
                }}
              />
            </Row>

            <Row
              label="Keywords"
              why="Words the name should feel connected to. Press enter or comma to add."
            >
              <Chips
                values={keywords}
                onChange={setKeywords}
                placeholder="scheduling, clinics, reminders"
                label="Keywords"
                suggestions={suggested}
                onAccept={(value) => {
                  setKeywords((previous) => [...new Set([...previous, value])].slice(0, 10));
                  setSuggested((previous) => previous.filter((s) => s !== value));
                }}
                onDismiss={(value) => {
                  setDismissed((previous) => [...previous, value]);
                  setSuggested((previous) => previous.filter((s) => s !== value));
                }}
              />
            </Row>

            <Row
              label="Competitors"
              why="Used for positioning. We never suggest a name that collides with one of these."
            >
              <Chips
                values={competitors}
                onChange={setCompetitors}
                placeholder="cliniko, jane app"
                label="Competitors"
              />
            </Row>

            <Row
              label="How it should sound"
              why="Optional. These sharpen the shortlist rather than deciding it."
            >
              <div className="grid gap-5">
                <Pick
                  legend="Tone"
                  options={[
                    { id: "playful", label: "Playful" },
                    { id: "neutral", label: "Neutral" },
                    { id: "serious", label: "Serious" },
                  ]}
                  value={discovery.tone ?? null}
                  onChange={(v) =>
                    setDiscovery({ ...discovery, tone: v as DiscoveryAnswers["tone"] })
                  }
                />
                <Pick
                  legend="Form"
                  options={[
                    { id: "invented", label: "Invented" },
                    { id: "real-word", label: "A real word" },
                    { id: "compound", label: "Two words joined" },
                    { id: "metaphor", label: "A metaphor" },
                  ]}
                  value={discovery.style ?? null}
                  onChange={(v) =>
                    setDiscovery({ ...discovery, style: v as DiscoveryAnswers["style"] })
                  }
                />
                <Pick
                  legend="Length"
                  options={[
                    { id: "short", label: "Short" },
                    { id: "any", label: "Any" },
                  ]}
                  value={discovery.length ?? null}
                  onChange={(v) =>
                    setDiscovery({ ...discovery, length: v as DiscoveryAnswers["length"] })
                  }
                />
              </div>
            </Row>
          </div>
        ) : null}
      </div>

      <Rule strong />

      <div className="flex flex-wrap items-end justify-between gap-6 py-7">
        <div>
          <Clerk>Input strength</Clerk>
          <div className="mt-2 flex items-center gap-4">
            <Measured value={strength.score} of={STRENGTH_MAX} unit={strength.level} />
            <span aria-hidden="true" className="flex items-center gap-1">
              {Array.from({ length: STRENGTH_MAX }, (_, i) => (
                <span
                  key={i}
                  className={`h-2.5 w-6 ${i < strength.score ? "bg-ink" : "bg-rule-2"}`}
                />
              ))}
            </span>
          </div>
          <p className="mt-2.5 max-w-[52ch] text-[13px] leading-relaxed text-ink-3">
            {strength.nextStep
              ? `Nothing is required. The one thing that would sharpen the names most: ${strength.nextStep.toLowerCase()}.`
              : "Everything filled in. The generator has as much to work with as it can get."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {isEmpty ? (
            <Action variant="ruled" onClick={applyExample}>
              Fill in an example
            </Action>
          ) : null}
          <Action size="lg" onClick={run} disabled={!canRun} loading={phase === "running"}>
            {phase === "running" ? "Pressing" : "Find names that are free"}
          </Action>
        </div>
      </div>

      <div ref={resultsRef}>
        {phase !== "idle" ? (
          <>
            <RuleOrnament className="py-2" />
            <div className="pt-8">
              <ResultsPanel
                candidates={candidates}
                phase={phase}
                checked={checkedCount}
                seedName={normalizeName(name, runTld).label}
                tld={runTld}
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

// --- Sheet rows -------------------------------------------------------------

function Row({
  label,
  why,
  children,
  trailing,
}: {
  label: string;
  why: string;
  children: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div className="ruled grid gap-4 py-5 md:grid-cols-[minmax(0,26ch)_minmax(0,1fr)] md:gap-8">
      <div>
        <div className="flex items-baseline gap-3">
          <p className="text-[15px] leading-snug font-semibold tracking-[-0.01em]">{label}</p>
          {trailing ? <span className="ml-auto md:ml-0">{trailing}</span> : null}
        </div>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-3">{why}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function Pick({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: { id: string; label: string }[];
  value: string | null;
  onChange: (id: string) => void;
}) {
  return (
    <fieldset>
      <legend className="clerk mb-2.5 text-ink-3">{legend}</legend>
      <div className="flex flex-wrap items-stretch">
        {options.map((option) => {
          const active = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.id)}
              className={`clerk -ml-hair inline-flex h-10 items-center border px-3.5 transition-colors duration-150 first:ml-0 ${
                active
                  ? "z-10 border-ink bg-ink text-stock"
                  : "border-rule text-ink-2 hover:bg-band hover:text-ink"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Chips({
  values,
  onChange,
  placeholder,
  label,
  suggestions = [],
  onAccept,
  onDismiss,
}: {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  label: string;
  suggestions?: string[];
  onAccept?: (value: string) => void;
  onDismiss?: (value: string) => void;
}) {
  const [draft, setDraft] = useState("");

  function commit(raw: string) {
    const value = raw.trim().toLowerCase().replace(/\s+/g, " ");
    if (!value || values.includes(value) || values.length >= 10) return;
    onChange([...values, value]);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {values.map((value) => (
          <span
            key={value}
            className="inline-flex items-center gap-2 border border-rule px-2.5 py-1.5 text-[13px]"
          >
            {value}
            <button
              type="button"
              onClick={() => onChange(values.filter((v) => v !== value))}
              aria-label={`Remove ${value}`}
              className="text-ink-3 hover:text-stamp"
            >
              &times;
            </button>
          </span>
        ))}
      </div>

      <input
        value={draft}
        onChange={(e) => {
          if (e.target.value.endsWith(",")) {
            commit(e.target.value.slice(0, -1));
            setDraft("");
          } else setDraft(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit(draft);
            setDraft("");
          } else if (e.key === "Backspace" && !draft && values.length) {
            onChange(values.slice(0, -1));
          }
        }}
        onBlur={() => {
          commit(draft);
          setDraft("");
        }}
        placeholder={values.length >= 10 ? "Ten is the limit" : placeholder}
        aria-label={label}
        disabled={values.length >= 10}
        className={`h-11 w-full border border-rule bg-transparent px-3 text-[14.5px] focus:border-ink-2 ${
          values.length ? "mt-2.5" : ""
        }`}
      />

      {suggestions.length > 0 ? (
        <div className="mt-3">
          <Clerk className="mb-2">From your description</Clerk>
          <ul className="flex flex-wrap items-center gap-2">
            {suggestions.slice(0, 6).map((suggestion) => (
              <li key={suggestion} className="flex items-stretch">
                <button
                  type="button"
                  onClick={() => onAccept?.(suggestion)}
                  className="border border-dashed border-rule-strong px-2.5 py-1.5 text-[13px] text-ink-2 hover:bg-band hover:text-ink"
                >
                  {`+ ${suggestion}`}
                </button>
                <button
                  type="button"
                  onClick={() => onDismiss?.(suggestion)}
                  aria-label={`Dismiss ${suggestion}`}
                  className="-ml-hair border border-dashed border-rule-strong px-2 text-ink-3 hover:text-stamp"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

type Derived = { url: string; title: string; description: string; keywords: string[] };

function UrlRow({ onDerived }: { onDerived: (derived: Derived) => void }) {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<"idle" | "fetching" | "done" | "failed">("idle");
  const [message, setMessage] = useState("");

  async function fetchIt() {
    if (!url.trim()) return;
    setState("fetching");
    setMessage("");
    try {
      const res = await fetch("/api/derive", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = (await res.json()) as Partial<Derived> & { error?: string };
      if (!res.ok || data.error || (!data.description && !data.keywords?.length)) {
        setState("failed");
        setMessage(
          data.error === "blocked"
            ? "That address is not one we will fetch."
            : "We could not read anything useful off that page. Type the description instead.",
        );
        return;
      }
      onDerived({
        url,
        title: data.title ?? "",
        description: data.description ?? "",
        keywords: data.keywords ?? [],
      });
      setState("done");
      setMessage(`Read from ${data.title || url}.`);
    } catch {
      setState("failed");
      setMessage("That fetch did not complete. Type the description instead.");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-stretch gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              fetchIt();
            }
          }}
          placeholder="https://example.com"
          aria-label="A site to read the description from"
          inputMode="url"
          className="folio h-11 min-w-0 flex-1 border border-rule bg-transparent px-3 text-[14.5px] focus:border-ink-2"
        />
        <Action variant="ruled" onClick={fetchIt} loading={state === "fetching"}>
          {state === "fetching" ? "Reading" : "Read it"}
        </Action>
      </div>
      {message ? (
        <p
          className={`mt-2 text-[12.5px] leading-relaxed ${
            state === "failed" ? "text-stamp" : "text-ink-2"
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
