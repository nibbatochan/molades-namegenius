"use client";

import { useRef, useState, type ReactNode } from "react";
import { ExtensionTabs } from "./extension-tabs";
import {
  ChevronIcon,
  CompassIcon,
  LayersIcon,
  SparkIcon,
  TargetIcon,
} from "./icons";
import {
  Button,
  Card,
  ChoicePill,
  CountBadge,
  Hairline,
  ProvenanceTag,
  SectionLabel,
  Spinner,
  StatusPill,
} from "./ui";
import {
  CATEGORIES,
  DEITIES,
  DIRECTIONS,
  ELEMENTS,
  NAKSHATRAS,
} from "@/lib/vastu-data";
import {
  EMPTY_VASTU_INPUT,
  readiness,
  type DerivedName,
  type VastuContext,
  type VastuInput,
} from "@/lib/vastu";
import type { AvailState } from "@/lib/types";
import { DEFAULT_TLD_ID } from "@/lib/tlds";

type Entry = {
  /** The engine's rank, carried through because results arrive out of order. */
  index: number;
  name: DerivedName;
  domain: string;
  state: AvailState;
  checkedAt: string;
};

type Phase = "asking" | "deriving" | "done";

/**
 * The Vastu register: a longer set of questions, then names derived from the
 * answers, each carrying the chain that produced it.
 *
 * The questions come in three groups rather than all at once. Nothing is
 * required — an unanswered question costs the rule that depended on it, and the
 * derivation says so instead of guessing.
 */
export function VastuRegister() {
  const [input, setInput] = useState<VastuInput>(EMPTY_VASTU_INPUT);
  const [tld, setTld] = useState(DEFAULT_TLD_ID);
  const [open, setOpen] = useState<1 | 2 | 3>(1);
  const [phase, setPhase] = useState<Phase>("asking");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [context, setContext] = useState<VastuContext | null>(null);
  const runRef = useRef<AbortController | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const ready = readiness(input);
  const set = <K extends keyof VastuInput>(key: K, value: VastuInput[K]) =>
    setInput((previous) => ({ ...previous, [key]: value }));

  const nakshatra = input.nakshatra ? NAKSHATRAS[input.nakshatra - 1] : null;

  async function derive() {
    runRef.current?.abort();
    const controller = new AbortController();
    runRef.current = controller;

    setPhase("deriving");
    setEntries([]);
    setContext(null);
    requestAnimationFrame(() =>
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );

    try {
      const res = await fetch("/api/vastu", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ input, tld }),
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
            | { type: "meta"; context: VastuContext }
            | ({ type: "name" } & Entry)
            | { type: "done" };

          if (event.type === "meta") setContext(event.context);
          else if (event.type === "name") {
            const entry: Entry = {
              index: event.index,
              name: event.name,
              domain: event.domain,
              state: event.state,
              checkedAt: event.checkedAt,
            };
            setEntries((previous) => [...previous, entry]);
          } else if (event.type === "done") setPhase("done");
        }
      }
      setPhase("done");
    } catch {
      if (!controller.signal.aborted) setPhase("done");
    }
  }

  // Group by state only. The engine already ordered these to spread the opening
  // word around, and sorting by score here would undo that and stack every
  // name sharing a lead together.
  const ordered = [...entries].sort((a, b) => {
    const rank = (s: AvailState) =>
      s === "available" ? 0 : s === "premium" ? 1 : s === "unverified" ? 2 : 3;
    return rank(a.state) - rank(b.state) || a.index - b.index;
  });

  const available = ordered.filter((e) => e.state === "available");
  const others = ordered.filter((e) => e.state !== "available");

  return (
    <div className="space-y-4">
      <Card tint="cream" className="p-6 lg:p-7">
        <h2 className="text-[22px] font-semibold tracking-[-0.02em]">
          Derive a name from your chart
        </h2>
        <p className="mt-3 max-w-[68ch] text-[14.5px] leading-relaxed text-ink-2">
          Answer what you know and we derive names the way a practitioner would —
          from your birth nakshatra&rsquo;s syllables, the direction your premises
          faces, the trade, and the numerology of the letters. Every name shows
          the full chain, rule by rule, with the source of each rule named.
        </p>
        <p className="mt-3 max-w-[68ch] text-[13px] leading-relaxed text-ink-3">
          This applies a traditional system consistently. It does not claim the
          system is empirically true. We mark which rules have a text behind
          them, which are practitioner convention, and which we assembled
          ourselves — because on the last kind, no text agrees.
        </p>
      </Card>

      <Group
        n={1}
        icon={<SparkIcon />}
        title="The founder"
        summary={
          nakshatra
            ? `${nakshatra.name}${input.pada ? `, pada ${input.pada}` : ", pada unknown"}`
            : "Not answered"
        }
        open={open === 1}
        onOpen={() => setOpen(open === 1 ? 1 : 1)}
      >
        <Ask
          label="Birth nakshatra"
          why="The syllables a name may open with come from here. All four of a nakshatra's syllables are held auspicious, so this alone carries the rule."
        >
          <Select
            value={input.nakshatra === null ? "" : String(input.nakshatra)}
            onChange={(v) => set("nakshatra", v === "" ? null : Number(v))}
            aria-label="Birth nakshatra"
          >
            <option value="">I&rsquo;m not sure</option>
            {NAKSHATRAS.map((nak) => (
              <option key={nak.n} value={nak.n}>
                {`${nak.n}. ${nak.name} — ${nak.devanagari} — ${nak.padas.join(", ")}`}
              </option>
            ))}
          </Select>
        </Ask>

        <Ask
          label="Pada"
          why="The Moon crosses one pada in about an hour, so this needs a birth time you trust. Without it we use all four syllables and say the match isn't exact."
        >
          <Select
            value={input.pada === null ? "" : String(input.pada)}
            onChange={(v) => set("pada", v === "" ? null : Number(v))}
            aria-label="Nakshatra pada"
            disabled={!nakshatra}
          >
            <option value="">I don&rsquo;t know my birth time precisely</option>
            {(nakshatra?.padas ?? ["1", "2", "3", "4"]).map((syllable, i) => (
              <option key={i} value={i + 1}>
                {`Pada ${i + 1} — ${syllable}`}
              </option>
            ))}
          </Select>
          {nakshatra?.lowConfidence ? (
            <p className="mt-2 text-[12.5px] leading-relaxed text-warn">
              {nakshatra.lowConfidence}
            </p>
          ) : null}
        </Ask>

        <Ask
          label="Day of the month you were born"
          why="The psychic number is the day, reduced. It's the number a practitioner harmonises the name against."
        >
          <input
            type="number"
            min={1}
            max={31}
            value={input.birthDay ?? ""}
            onChange={(e) =>
              set("birthDay", e.target.value === "" ? null : Number(e.target.value))
            }
            placeholder="e.g. 23"
            aria-label="Day of the month you were born"
            className="field-surface h-12 w-[14ch] px-4 text-[15px] tabular-nums"
          />
        </Ask>

        <Ask
          label="Are there co-founders or partners?"
          why="A name harmonised to one chart is treated as a partnership risk, and compound 26 is the specific warning about ruin through associations."
        >
          <Pills
            options={[
              { id: "yes", label: "Yes" },
              { id: "no", label: "No, just me" },
            ]}
            value={input.hasPartners === null ? null : input.hasPartners ? "yes" : "no"}
            onChange={(v) => set("hasPartners", v === "yes")}
          />
        </Ask>

        <div className="pt-2">
          <Button variant="outline" onClick={() => setOpen(2)}>
            Next — the business
          </Button>
        </div>
      </Group>

      <Group
        n={2}
        icon={<CompassIcon />}
        title="The business"
        summary={
          input.category
            ? (CATEGORIES.find((c) => c.id === input.category)?.label ?? "Answered")
            : "Not answered"
        }
        open={open === 2}
        onOpen={() => setOpen(2)}
      >
        <Ask
          label="What is the trade?"
          why="This maps the venture to an element and a governing planet. Applying the framework to modern trades is practitioner extrapolation — the texts discuss houses and towns, not businesses."
        >
          <Select
            value={input.category ?? ""}
            onChange={(v) => set("category", v === "" ? null : (v as VastuInput["category"]))}
            aria-label="Trade"
          >
            <option value="">Not answered</option>
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {`${category.label} — ${ELEMENTS[category.element].name} (${ELEMENTS[category.element].english})`}
              </option>
            ))}
          </Select>
        </Ask>

        <Ask
          label="Which direction does the premises entrance face?"
          why="The most heavily weighted variable in commercial practice. Brihat Samhita 53.71–72 grades entrance placement square by square."
        >
          <Select
            value={input.entrance}
            onChange={(v) => set("entrance", v as VastuInput["entrance"])}
            aria-label="Entrance direction"
          >
            <option value="unknown">Not known, or no premises yet</option>
            {DIRECTIONS.map((direction) => (
              <option key={direction.id} value={direction.id}>
                {`${direction.label} — ${direction.deity} — ${direction.entrance} entrance`}
              </option>
            ))}
          </Select>
          {input.entrance !== "unknown" ? (
            <p className="mt-2 text-[12.5px] leading-relaxed text-ink-2">
              {DIRECTIONS.find((d) => d.id === input.entrance)?.entranceNote}
            </p>
          ) : null}
        </Ask>

        <Ask
          label="Are the premises already fixed?"
          why="If the building is chosen, direction is a constraint we work within. If not, it becomes advice we can give you."
        >
          <Pills
            options={[
              { id: "yes", label: "Yes, already there" },
              { id: "no", label: "Not yet" },
            ]}
            value={input.premisesFixed === null ? null : input.premisesFixed ? "yes" : "no"}
            onChange={(v) => set("premisesFixed", v === "yes")}
          />
        </Ask>

        <Ask
          label="Over the next three to five years, which matters more?"
          why="Directly scriptural, and the cleanest rule in the system: Ashvalayana Grhya Sutra I.15.6 gives two syllables for one desiring a firm position, four for one desiring renown."
        >
          <Pills
            options={[
              { id: "stability", label: "A firm position" },
              { id: "renown", label: "Renown and growth" },
            ]}
            value={input.goal}
            onChange={(v) => set("goal", v as VastuInput["goal"])}
          />
        </Ask>

        <Ask
          label="Who is the market?"
          why="Used for directional weighting when the entrance is unknown. East governs standing, north governs wealth flow, north-west governs turnover."
        >
          <Pills
            options={[
              { id: "b2b", label: "Business to business" },
              { id: "b2c", label: "Consumers" },
              { id: "government", label: "Government" },
              { id: "export", label: "Export" },
              { id: "local", label: "Local trade" },
            ]}
            value={input.market}
            onChange={(v) => set("market", v as VastuInput["market"])}
          />
        </Ask>

        <div className="flex flex-wrap gap-2.5 pt-2">
          <Button variant="outline" onClick={() => setOpen(3)}>
            Next — refinements
          </Button>
          <Button variant="quiet" onClick={() => setOpen(1)}>
            Back
          </Button>
        </div>
      </Group>

      <Group
        n={3}
        icon={<LayersIcon />}
        title="Refinements"
        summary="Optional"
        open={open === 3}
        onOpen={() => setOpen(3)}
      >
        <Ask
          label="Is there a deity you want invoked?"
          why="The Namakarana name is classically the family deity's name. For a business this sets the semantic field the lexicon draws from."
        >
          <Select
            value={input.deity}
            onChange={(v) => set("deity", v as VastuInput["deity"])}
            aria-label="Deity"
          >
            {DEITIES.map((deity) => (
              <option key={deity.id} value={deity.id}>
                {deity.domain ? `${deity.label} — ${deity.domain}` : deity.label}
              </option>
            ))}
          </Select>
        </Ask>

        <Ask
          label="Which script will customers read it in?"
          why="The system is sound-based, and not every language carries the distinctions the Sanskrit table depends on. Tamil has no aspirate series, so some syllables collapse."
        >
          <Pills
            options={[
              { id: "devanagari", label: "Devanagari" },
              { id: "tamil", label: "Tamil" },
              { id: "telugu", label: "Telugu" },
              { id: "kannada", label: "Kannada" },
              { id: "latin", label: "Latin only" },
            ]}
            value={input.script}
            onChange={(v) => set("script", v as VastuInput["script"])}
          />
        </Ask>

        <Ask
          label="Should your own name be part of the brand?"
          why="Common in family business. It constrains the string and brings its own numerological weight into the total."
        >
          <input
            value={input.founderName}
            onChange={(e) => set("founderName", e.target.value)}
            placeholder="Leave blank to keep them separate"
            aria-label="Founder's name in the brand"
            className="field-surface h-12 w-full max-w-[38ch] px-4 text-[15px]"
          />
        </Ask>

        <Ask
          label="Is there an existing name you're changing?"
          why="Practitioners treat rectification differently from fresh naming: the classic move is shifting a name off a cautionary compound with the smallest possible spelling change."
        >
          <input
            value={input.existingName}
            onChange={(e) => set("existingName", e.target.value)}
            placeholder="The name being replaced"
            aria-label="Existing name"
            className="field-surface h-12 w-full max-w-[38ch] px-4 text-[15px]"
          />
        </Ask>

        <Ask label="Anything to avoid?" why="Words or fragments that shouldn't appear in a suggestion.">
          <input
            value={input.avoid}
            onChange={(e) => set("avoid", e.target.value)}
            placeholder="Separate with commas"
            aria-label="Words to avoid"
            className="field-surface h-12 w-full max-w-[38ch] px-4 text-[15px]"
          />
        </Ask>

        <div className="pt-2">
          <Button variant="quiet" onClick={() => setOpen(2)}>
            Back
          </Button>
        </div>
      </Group>

      <Card className="p-6 lg:p-7">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="min-w-0">
            <SectionLabel trailing={<CountBadge>{`${ready.answered}/${ready.total}`}</CountBadge>}>
              Answered
            </SectionLabel>
            {ready.missing.length > 0 ? (
              <p className="mt-3 max-w-[52ch] text-[13px] leading-relaxed text-ink-3">
                {`Still open: ${ready.missing.slice(0, 4).join(", ")}${
                  ready.missing.length > 4 ? `, and ${ready.missing.length - 4} more` : ""
                }. Each unanswered question costs the rule that depends on it, and the derivation will say which.`}
              </p>
            ) : (
              <p className="mt-3 text-[13px] text-ink-2">
                Every question answered. The full chain will apply.
              </p>
            )}
          </div>

          <div className="min-w-[280px]">
            <SectionLabel>Ending</SectionLabel>
            <div className="mt-3">
              <ExtensionTabs value={tld} onChange={setTld} id="vastu-extension" />
            </div>
          </div>

          <Button size="lg" onClick={derive} loading={phase === "deriving"}>
            <SparkIcon className="size-4" />
            {phase === "deriving" ? "Deriving" : "Derive names"}
          </Button>
        </div>
      </Card>

      <div ref={resultsRef} className="scroll-mt-6">
        {phase !== "asking" ? (
          <div className="pt-6">
            <Derivation
              context={context}
              available={available}
              others={others}
              phase={phase}
              total={entries.length}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

// --- The question groups ----------------------------------------------------

function Group({
  n,
  icon,
  title,
  summary,
  open,
  onOpen,
  children,
}: {
  n: number;
  icon: ReactNode;
  title: string;
  summary: string;
  open: boolean;
  onOpen: () => void;
  children: ReactNode;
}) {
  return (
    <Card>
      <button
        type="button"
        onClick={onOpen}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-6 text-left lg:p-7"
      >
        <span className="quiet-fill flex size-9 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold tabular-nums text-ink-2">
          {n}
        </span>
        <span className="min-w-0">
          <span className="block text-[16px] font-semibold tracking-[-0.01em]">{title}</span>
          <span className="mt-1 block truncate text-[13px] text-ink-3">{summary}</span>
        </span>
        <span className="ml-auto flex shrink-0 items-center gap-3 text-ink-3">
          <span className="[&>svg]:size-4">{icon}</span>
          <ChevronIcon
            className={`size-5 transition-transform duration-200 ease-soft ${
              open ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {open ? (
        <div className="space-y-6 px-6 pb-7 lg:px-7">
          <Hairline />
          {children}
        </div>
      ) : null}
    </Card>
  );
}

function Ask({
  label,
  why,
  children,
}: {
  label: string;
  why: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,28ch)_minmax(0,1fr)] md:gap-8">
      <div>
        <p className="text-[14.5px] leading-snug font-semibold tracking-[-0.01em]">{label}</p>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-3">{why}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function Select({
  value,
  onChange,
  children,
  disabled,
  ...rest
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  disabled?: boolean;
  "aria-label": string;
}) {
  return (
    <select
      {...rest}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="field-surface h-12 w-full max-w-[54ch] px-4 text-[14.5px] disabled:text-ink-3"
    >
      {children}
    </select>
  );
}

function Pills({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string | null;
  onChange: (id: string) => void;
}) {
  return (
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
  );
}

// --- The derivation ---------------------------------------------------------

function Derivation({
  context,
  available,
  others,
  phase,
  total,
}: {
  context: VastuContext | null;
  available: Entry[];
  others: Entry[];
  phase: Phase;
  total: number;
}) {
  return (
    <section aria-label="Derived names" className="space-y-5">
      {context ? (
        <Card tint="lav" className="grid gap-x-8 gap-y-5 p-6 sm:grid-cols-2 lg:grid-cols-4">
          <Reading label="Nakshatra">
            {context.nakshatraName
              ? `${context.nakshatraName} ${context.nakshatraDevanagari ?? ""}`
              : "Not given"}
          </Reading>
          <Reading label="Syllables allowed">
            {context.syllables.length > 0 ? context.syllables.join(" · ") : "Unconstrained"}
          </Reading>
          <Reading label="Element indicated">
            {context.element
              ? `${ELEMENTS[context.element].name} (${ELEMENTS[context.element].english})`
              : "Not determined"}
          </Reading>
          <Reading label="Psychic number">
            {context.psychic ? String(context.psychic) : "Not given"}
          </Reading>
        </Card>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <h2 className="text-[22px] font-semibold tracking-[-0.02em]">
          {phase === "deriving" ? "Deriving names" : "Derived names"}
        </h2>
        <div className="flex items-center gap-3 text-[13px] font-semibold text-ink-2">
          <CountBadge>{`${available.length} of ${total} free`}</CountBadge>
          {phase === "deriving" ? <Spinner /> : null}
        </div>
      </div>

      {available.length > 0 ? (
        <div className="space-y-3">
          {available.map((entry) => (
            <NameEntry key={entry.domain} entry={entry} />
          ))}
        </div>
      ) : phase === "done" ? (
        <Card className="p-7">
          <p className="max-w-[58ch] text-[15px] leading-relaxed text-ink-2">
            Nothing we derived is free on this ending. Try another ending above —
            the derivation doesn&rsquo;t change, only the availability does.
          </p>
        </Card>
      ) : null}

      {others.length > 0 ? (
        <details className="group">
          <summary className="inline-flex cursor-pointer items-center gap-2 text-[13px] font-semibold text-ink-2 hover:text-ink">
            <TargetIcon className="size-4" />
            {`${others.length} more derived, but not free here`}
          </summary>
          <div className="mt-3 space-y-3">
            {others.map((entry) => (
              <NameEntry key={entry.domain} entry={entry} />
            ))}
          </div>
        </details>
      ) : null}
    </section>
  );
}

function Reading({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="u-label">{label}</p>
      <p className="mt-2 text-[15px] leading-snug font-semibold tracking-[-0.01em]">
        {children}
      </p>
    </div>
  );
}

function NameEntry({ entry }: { entry: Entry }) {
  const [open, setOpen] = useState(false);
  const { name } = entry;

  return (
    <Card className="animate-[fadeIn_320ms_var(--ease-soft)_both] p-5 lg:p-6">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-[22px] leading-none font-semibold tracking-[-0.02em]">
              {name.display}
            </p>
            <p className="text-[16px] leading-none text-ink-2">{name.devanagari}</p>
          </div>
          <p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[13px] text-ink-3">
            <span className="font-semibold text-ink-2">{entry.domain}</span>
            <span>{name.parts.map((p) => p.gloss).join(" + ")}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <CountBadge>{`${name.syllables} syl`}</CountBadge>
          <CountBadge>{`${name.compound} / ${name.root}`}</CountBadge>
          <StatusPill state={entry.state} compact animate />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-ink-2 transition-colors duration-200 hover:text-ink"
        >
          {open ? "Hide derivation" : "Show derivation"}
          <ChevronIcon
            className={`size-4 transition-transform duration-200 ease-soft ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {open ? (
        <div className="mt-5 space-y-4">
          <Hairline />
          <ol className="space-y-4">
            {name.steps.map((step) => (
              <li
                key={step.key}
                className="grid gap-2 md:grid-cols-[minmax(0,24ch)_minmax(0,1fr)] md:gap-8"
              >
                <div className="flex flex-wrap items-start gap-2">
                  <span className="text-[13px] font-semibold">{step.label}</span>
                  <ProvenanceTag kind={step.provenance} />
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-[13.5px] leading-relaxed ${
                      step.outcome === "unmet" ? "text-ink-3" : "text-ink"
                    }`}
                  >
                    {step.detail}
                  </p>
                  {step.citation ? (
                    <p className="mt-1.5 text-[12px] leading-relaxed text-ink-3">
                      {step.citation}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </Card>
  );
}
