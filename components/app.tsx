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
import {
  BoltIcon,
  ChevronIcon,
  ClockIcon,
  CloseIcon,
  LinkIcon,
  SparkIcon,
  TagIcon,
  TargetIcon,
  TextIcon,
} from "./icons";
import { ResultsPanel, type RunPhase } from "./results";
import {
  Button,
  Card,
  ChoicePill,
  CountBadge,
  Hairline,
  SectionLabel,
  StatusPill,
} from "./ui";

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
 * One filled field is enough to run, which is why the name field sits alone at
 * the top and everything else stays folded until asked for.
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
    <div className="space-y-4">
      <Card className="p-6 lg:p-7">
        <EntryLine
          value={name}
          onChange={setName}
          tld={tld}
          onTldChange={setTld}
          onResult={recordCheck}
          onFindAlternatives={run}
        />
      </Card>

      {checks.length > 0 ? (
        <Card className="p-5">
          <SectionLabel icon={<ClockIcon />}>Checked this session</SectionLabel>
          <ul className="mt-3.5 flex flex-wrap items-center gap-2">
            {checks.map((check) => (
              <li key={check.domain}>
                <button
                  type="button"
                  onClick={() => setName(check.domain.split(".")[0])}
                  className="quiet-fill inline-flex items-center gap-2 rounded-full py-1.5 pr-1.5 pl-3 text-[13px] font-semibold transition-all duration-200 ease-soft hover:quiet-fill-hover"
                >
                  {check.domain}
                  <StatusPill state={check.state} compact />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {/* Everything beyond the name is disclosed on request. */}
      <Card>
        <button
          type="button"
          onClick={() => setSheetOpen((v) => !v)}
          aria-expanded={sheetOpen}
          className="flex w-full items-center gap-4 p-6 text-left lg:p-7"
        >
          <span className="min-w-0">
            <span className="block text-[16px] font-semibold tracking-[-0.01em]">
              Tell us what you&rsquo;re building
            </span>
            <span className="mt-1 block text-[13px] text-ink-3">
              Optional, and it makes the suggestions much better.
            </span>
          </span>
          <span className="ml-auto flex shrink-0 items-center gap-3">
            {canRun && !sheetOpen ? <CountBadge>Filled</CountBadge> : null}
            <ChevronIcon
              className={`size-5 text-ink-3 transition-transform duration-200 ease-soft ${
                sheetOpen ? "rotate-180" : ""
              }`}
            />
          </span>
        </button>

        {sheetOpen ? (
          <div className="space-y-6 px-6 pb-7 lg:px-7">
            <Hairline />

            <Field
              icon={<TextIcon />}
              label="What you're building"
              hint="The more specific, the better the names. Who it's for, and what it replaces, both help."
              trailing={
                <span
                  className={`text-[12px] font-semibold tabular-nums ${
                    remaining <= 120 ? "text-warn" : "text-ink-3"
                  }`}
                >
                  {`${description.length}/${DESCRIPTION_MAX}`}
                </span>
              }
            >
              <Textarea
                value={description}
                onChange={(v) => setDescription(v.slice(0, DESCRIPTION_MAX))}
                label="What you're building"
                placeholder="A scheduling tool for independent physiotherapy clinics. Patients book their own appointments, clinicians share one calendar, and reminders go out over SMS the day before."
              />
              {prefilledFrom ? (
                <p className="mt-2 text-[12.5px] text-ok">
                  {`Prefilled from ${prefilledFrom}. Edit anything that isn't right.`}
                </p>
              ) : null}
            </Field>

            <Field
              icon={<LinkIcon />}
              label="Or read it off a site"
              hint="Paste a URL and we read the page's own description and keywords off it. Nothing is stored."
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
            </Field>

            <Field
              icon={<TagIcon />}
              label="Keywords"
              hint="Words the name should feel connected to. Press enter or comma to add."
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
            </Field>

            <Field
              icon={<TargetIcon />}
              label="Competitors"
              hint="Used for positioning. We never suggest a name that collides with one of these."
            >
              <Chips
                values={competitors}
                onChange={setCompetitors}
                placeholder="cliniko, jane app"
                label="Competitors"
              />
            </Field>

            <Field
              icon={<BoltIcon />}
              label="How it should sound"
              hint="Optional. These sharpen the shortlist rather than deciding it."
            >
              <div className="space-y-4">
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
            </Field>
          </div>
        ) : null}
      </Card>

      <Card className="p-6 lg:p-7">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="min-w-0">
            <SectionLabel>Input strength</SectionLabel>
            <div className="mt-3 flex items-center gap-3">
              <span
                className="meter-track w-44"
                role="meter"
                aria-label="Input strength"
                aria-valuemin={0}
                aria-valuemax={STRENGTH_MAX}
                aria-valuenow={strength.score}
              >
                <span
                  className="meter-fill"
                  style={{ width: `${(strength.score / STRENGTH_MAX) * 100}%` }}
                />
              </span>
              <span className="text-[13px] font-semibold tabular-nums text-ink-2">
                {`${strength.score}/${STRENGTH_MAX} · ${strength.level}`}
              </span>
            </div>
            <p className="mt-2.5 max-w-[50ch] text-[13px] leading-relaxed text-ink-3">
              {strength.nextStep
                ? `Nothing is required. The one thing that would sharpen the names most: ${strength.nextStep.toLowerCase()}.`
                : "Everything filled in. The generator has as much to work with as it can get."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {isEmpty ? (
              <Button variant="quiet" onClick={applyExample}>
                Fill in an example
              </Button>
            ) : null}
            <Button size="lg" onClick={run} disabled={!canRun} loading={phase === "running"}>
              <SparkIcon className="size-4" />
              {phase === "running" ? "Finding names" : "Find available names"}
            </Button>
          </div>
        </div>
      </Card>

      <div ref={resultsRef} className="scroll-mt-6">
        {phase !== "idle" ? (
          <div className="pt-6">
            <ResultsPanel
              candidates={candidates}
              phase={phase}
              checked={checkedCount}
              seedName={normalizeName(name, runTld).label}
              tld={runTld}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

// --- Fields -----------------------------------------------------------------

function Field({
  icon,
  label,
  hint,
  children,
  trailing,
}: {
  icon?: ReactNode;
  label: string;
  hint: string;
  children: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <SectionLabel icon={icon} trailing={trailing}>
        {label}
      </SectionLabel>
      <p className="text-[12.5px] leading-relaxed text-ink-3">{hint}</p>
      {children}
    </div>
  );
}

function Textarea({
  value,
  onChange,
  label,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      rows={6}
      aria-label={label}
      placeholder={placeholder}
      className={`field-surface w-full px-4 py-3.5 text-[15px] leading-relaxed ${
        focused ? "field-focus" : ""
      }`}
    />
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
      <legend className="u-label mb-2.5">{legend}</legend>
      <div className="flex flex-wrap items-center gap-2">
        {options.map((option) => (
          <ChoicePill
            key={option.id}
            active={option.id === value}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </ChoicePill>
        ))}
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
  const [focused, setFocused] = useState(false);

  function commit(raw: string) {
    const value = raw.trim().toLowerCase().replace(/\s+/g, " ");
    if (!value || values.includes(value) || values.length >= 10) return;
    onChange([...values, value]);
  }

  return (
    <div className="space-y-3">
      {values.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {values.map((value) => (
            <span
              key={value}
              className="quiet-fill inline-flex items-center gap-1.5 rounded-full py-1.5 pr-2 pl-3 text-[13px] font-semibold"
            >
              {value}
              <button
                type="button"
                onClick={() => onChange(values.filter((v) => v !== value))}
                aria-label={`Remove ${value}`}
                className="text-ink-3 transition-colors duration-200 hover:text-ink"
              >
                <CloseIcon className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : null}

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
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          commit(draft);
          setDraft("");
        }}
        placeholder={values.length >= 10 ? "Ten is the limit" : placeholder}
        aria-label={label}
        disabled={values.length >= 10}
        className={`field-surface h-12 w-full px-4 text-[14.5px] ${focused ? "field-focus" : ""}`}
      />

      {suggestions.length > 0 ? (
        <div className="space-y-2">
          <p className="u-label">From your description</p>
          <ul className="flex flex-wrap items-center gap-2">
            {suggestions.slice(0, 6).map((suggestion) => (
              <li key={suggestion} className="flex items-center">
                <button
                  type="button"
                  onClick={() => onAccept?.(suggestion)}
                  className="rounded-l-full py-1.5 pr-2 pl-3 text-[13px] font-semibold text-accent ring-1 ring-accent-soft transition-all duration-200 ease-soft hover:bg-accent-soft"
                >
                  {`+ ${suggestion}`}
                </button>
                <button
                  type="button"
                  onClick={() => onDismiss?.(suggestion)}
                  aria-label={`Dismiss ${suggestion}`}
                  className="rounded-r-full py-1.5 pr-2.5 pl-1.5 text-ink-3 ring-1 ring-accent-soft transition-colors duration-200 hover:text-ink"
                >
                  <CloseIcon className="size-3.5" />
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
  const [focused, setFocused] = useState(false);

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
            : "We couldn't read anything useful off that page. Type the description instead.",
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
      setMessage("That fetch didn't complete. Type the description instead.");
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              fetchIt();
            }
          }}
          placeholder="https://example.com"
          aria-label="A site to read the description from"
          inputMode="url"
          className={`field-surface h-12 min-w-0 flex-1 px-4 text-[14.5px] ${
            focused ? "field-focus" : ""
          }`}
        />
        <Button variant="outline" onClick={fetchIt} loading={state === "fetching"}>
          {state === "fetching" ? "Reading" : "Read it"}
        </Button>
      </div>
      {message ? (
        <p
          className={`text-[12.5px] leading-relaxed ${
            state === "failed" ? "text-warn" : "text-ok"
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
