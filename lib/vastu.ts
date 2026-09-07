import type { Provenance } from "./types";
import {
  CATEGORY_BY_ID,
  CHALDEAN,
  COMPOUND_READINGS,
  DEITIES,
  DIRECTION_BY_ID,
  ELEMENTS,
  HARMONY,
  LEXICON,
  NAKSHATRAS,
  RASHIS,
  ROOT_SIGNATURES,
  VARGAS,
  VOICED_INITIALS,
  rashiForPada,
  type CategoryId,
  type DeityId,
  type DirectionId,
  type Element,
  type Morpheme,
  type SemanticField,
} from "./vastu-data";

/**
 * The derivation.
 *
 * Every name comes out with the chain that produced it, and every link in that
 * chain names its own provenance. A rule we assembled is never allowed to
 * appear in the same voice as a rule a text actually states — that separation
 * is the whole reason this is buildable honestly.
 */

export type VastuInput = {
  /** 1-27, or null when the founder does not know it. */
  nakshatra: number | null;
  /** 1-4, or null when the birth time is not precise enough to fix a pada. */
  pada: number | null;
  /** Day of the month, for the psychic number. */
  birthDay: number | null;
  hasPartners: boolean | null;
  category: CategoryId | null;
  entrance: DirectionId;
  premisesFixed: boolean | null;
  goal: "stability" | "renown" | null;
  market: "b2b" | "b2c" | "government" | "export" | "local" | null;
  script: "devanagari" | "tamil" | "telugu" | "kannada" | "latin" | null;
  deity: DeityId;
  founderName: string;
  existingName: string;
  avoid: string;
};

export const EMPTY_VASTU_INPUT: VastuInput = {
  nakshatra: null,
  pada: null,
  birthDay: null,
  hasPartners: null,
  category: null,
  entrance: "unknown",
  premisesFixed: null,
  goal: null,
  market: null,
  script: null,
  deity: "none",
  founderName: "",
  existingName: "",
  avoid: "",
};

export type DerivationStep = {
  key: string;
  label: string;
  provenance: Provenance;
  citation?: string;
  /** What this rule contributed, in plain language. */
  detail: string;
  outcome: "met" | "partial" | "unmet" | "note";
};

export type DerivedName = {
  label: string;
  display: string;
  devanagari: string;
  parts: { t: string; d: string; gloss: string }[];
  syllables: number;
  initial: string;
  /** True when the initial matches the exact pada rather than any of the four. */
  exactPada: boolean;
  compound: number;
  root: number;
  score: number;
  steps: DerivationStep[];
};

// --- Numerology -------------------------------------------------------------

export function chaldeanCompound(text: string): number {
  return text
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .split("")
    .reduce((sum, ch) => sum + (CHALDEAN[ch] ?? 0), 0);
}

export function reduceToRoot(n: number): number {
  let value = n;
  while (value > 9) {
    value = String(value)
      .split("")
      .reduce((s, d) => s + Number(d), 0);
  }
  return value;
}

/** Psychic number: the day of the month, reduced. */
export function moolank(day: number | null): number | null {
  if (!day || day < 1 || day > 31) return null;
  return reduceToRoot(day);
}

// --- Context ----------------------------------------------------------------

export type VastuContext = {
  /** The syllables a name may open with. */
  syllables: string[];
  exactSyllable: string | null;
  nakshatraName: string | null;
  nakshatraDevanagari: string | null;
  rashi: (typeof RASHIS)[number] | null;
  targetSyllables: number | null;
  element: Element | null;
  /** Where the element came from: the premises entrance, or the trade. */
  elementFrom: "entrance" | "category" | "market" | null;
  direction: DirectionId;
  fields: SemanticField[];
  psychic: number | null;
  friendly: number[];
  avoidRoots: number[];
  avoidWords: string[];
};

const MARKET_DIRECTION: Record<
  NonNullable<VastuInput["market"]>,
  { direction: DirectionId; why: string }
> = {
  b2b: { direction: "n", why: "North and Kubera govern wealth flow and trade between houses." },
  b2c: { direction: "nw", why: "North-west and Vayu govern high-turnover consumer movement." },
  government: { direction: "e", why: "East and Indra govern standing and dealings with authority." },
  export: { direction: "nw", why: "North-west and Vayu govern dispatch and movement outward." },
  local: { direction: "e", why: "East and Indra govern recognition in the immediate neighbourhood." },
};

export function buildContext(input: VastuInput): VastuContext {
  const nak = input.nakshatra ? NAKSHATRAS[input.nakshatra - 1] : null;

  // All four syllables of the birth nakshatra are held to be auspicious, so an
  // uncertain birth time costs precision rather than the whole rule.
  const syllables = nak ? [...nak.padas] : [];
  const exactSyllable =
    nak && input.pada ? nak.padas[input.pada - 1] : null;

  const category = input.category ? CATEGORY_BY_ID.get(input.category) : undefined;
  const entrance =
    input.entrance !== "unknown" ? DIRECTION_BY_ID.get(input.entrance) : undefined;

  // The entrance outranks the trade: it is the single most-weighted variable in
  // commercial practice. A poor entrance does not change the element, it
  // changes how hard we lean on wealth semantics further down.
  let element: Element | null = null;
  let elementFrom: VastuContext["elementFrom"] = null;
  let direction: DirectionId = "unknown";

  if (entrance) {
    direction = entrance.id;
    element = entrance.element ?? category?.element ?? null;
    elementFrom = entrance.element ? "entrance" : "category";
  } else if (category) {
    direction = category.direction;
    element = category.element;
    elementFrom = "category";
  } else if (input.market) {
    direction = MARKET_DIRECTION[input.market].direction;
    element = DIRECTION_BY_ID.get(direction)?.element ?? null;
    elementFrom = "market";
  }

  const fields: SemanticField[] = [...(category?.fields ?? [])];
  const deity = DEITIES.find((d) => d.id === input.deity);
  if (deity) fields.unshift(...deity.fields);

  // A poor entrance is compensated the way a practitioner would: by weighting
  // wealth semantics harder rather than by pretending the direction is fine.
  if (entrance?.entrance === "poor") fields.unshift("wealth", "stability");
  if (fields.length === 0) fields.push("wealth", "light", "stability");

  const psychic = moolank(input.birthDay);
  const harmony = psychic ? HARMONY[psychic] : undefined;

  return {
    syllables,
    exactSyllable,
    nakshatraName: nak?.name ?? null,
    nakshatraDevanagari: nak?.devanagari ?? null,
    rashi:
      nak && input.pada
        ? RASHIS[rashiForPada(nak.n, input.pada) - 1]
        : null,
    targetSyllables:
      input.goal === "stability" ? 2 : input.goal === "renown" ? 4 : null,
    element,
    elementFrom,
    direction,
    fields: [...new Set(fields)],
    psychic,
    friendly: harmony?.friendly ?? [],
    avoidRoots: harmony?.avoid ?? [],
    avoidWords: input.avoid
      .split(/[,\n]/)
      .map((w) => w.trim().toLowerCase())
      .filter(Boolean),
  };
}

// --- Composition ------------------------------------------------------------

const LEADS = LEXICON.filter((m) => m.lead);
const TAILS = LEXICON.filter((m) => m.tail);

function joinsCleanly(a: Morpheme, b: Morpheme): boolean {
  if (a.t === b.t) return false;
  const seam = a.t.slice(-1) + b.t.slice(0, 1);
  // A vowel meeting a vowel needs sandhi we are not performing, and a doubled
  // consonant at the seam reads as a typo rather than a compound.
  if (/[aeiou][aeiou]/.test(seam)) return false;
  if (a.t.slice(-1) === b.t.slice(0, 1)) return false;
  // Two aspirate clusters in a row is the harshness practitioners warn about.
  if (/h$/.test(a.t.slice(0, -1)) && /^[a-z]h/.test(b.t)) return false;
  return true;
}

const VOWELS = /[aeiou]/;

function countSyllables(text: string): number {
  return (text.toLowerCase().match(/[aeiou]+/g) ?? []).length;
}

type Composition = {
  label: string;
  parts: Morpheme[];
  prefix?: "su";
};

function compose(context: VastuContext): Composition[] {
  const out: Composition[] = [];
  const target = context.targetSyllables;

  const opens = (m: Morpheme) =>
    context.syllables.length === 0 ||
    context.syllables.some((s) => s.toLowerCase() === m.initial.toLowerCase());

  const relevant = (m: Morpheme) =>
    context.fields.length === 0 || m.fields.some((f) => context.fields.includes(f));

  // Two syllables for one desiring firm position; four for one desiring
  // renown. A single morpheme carries the two-syllable case.
  if (target === null || target === 2) {
    for (const lead of LEADS) {
      if (lead.syllables !== 2 || !opens(lead) || !relevant(lead)) continue;
      out.push({ label: lead.t, parts: [lead] });
    }
  }

  if (target === null || target === 4) {
    for (const lead of LEADS) {
      if (!opens(lead)) continue;
      for (const tail of TAILS) {
        if (lead.syllables + tail.syllables !== 4) continue;
        if (!relevant(lead) && !relevant(tail)) continue;
        if (!joinsCleanly(lead, tail)) continue;
        out.push({ label: lead.t + tail.t, parts: [lead, tail] });
      }
    }

    // The su- particle is explicitly endorsed for a firm foundation, and it is
    // how a three-syllable root reaches the four-syllable target.
    for (const lead of LEADS) {
      if (lead.syllables !== 3 || !relevant(lead)) continue;
      if (context.syllables.length > 0 && !context.syllables.some((s) => s.toLowerCase() === "su")) {
        continue;
      }
      out.push({ label: "su" + lead.t, parts: [lead], prefix: "su" });
    }
  }

  return out;
}

// --- Scoring and derivation -------------------------------------------------

function vargaFor(initial: string) {
  const key = initial.toLowerCase();
  return VARGAS.find((v) => v.letters.some((l) => key.startsWith(l))) ?? null;
}

function deriveOne(
  composition: Composition,
  context: VastuInput extends never ? never : VastuContext,
  input: VastuInput,
): DerivedName {
  const label = composition.label;
  const steps: DerivationStep[] = [];
  let score = 0;

  const initial = composition.prefix === "su" ? "Su" : composition.parts[0].initial;
  const syllables = countSyllables(label);
  const exactPada =
    context.exactSyllable !== null &&
    context.exactSyllable.toLowerCase() === initial.toLowerCase();

  // 1. The opening syllable.
  if (context.syllables.length > 0) {
    const matches = context.syllables.some(
      (s) => s.toLowerCase() === initial.toLowerCase(),
    );
    steps.push({
      key: "syllable",
      label: "Opening syllable",
      provenance: "traditional",
      citation:
        "Avakahada Chakra, transmitted through panchang compilations. Apastamba Grhya Sutra 6.15.2 requires a nakshatra name but supplies no table.",
      detail: matches
        ? exactPada
          ? `Opens on ${initial}, the exact syllable of ${context.nakshatraName} pada ${input.pada}.`
          : `Opens on ${initial}, one of the four auspicious syllables of ${context.nakshatraName}. All four padas are held auspicious, so this holds even without a precise birth time.`
        : `Does not open on a syllable of ${context.nakshatraName}.`,
      outcome: matches ? (exactPada ? "met" : "partial") : "unmet",
    });
    if (exactPada) score += 40;
    else if (matches) score += 26;
    else score -= 30;
  } else {
    steps.push({
      key: "syllable",
      label: "Opening syllable",
      provenance: "traditional",
      detail:
        "No nakshatra given, so the syllable rule could not be applied. This is the one rule missing from this derivation.",
      outcome: "unmet",
    });
  }

  // 2. Syllable count. The cleanest scriptural rule in the whole system.
  if (context.targetSyllables) {
    const met = syllables === context.targetSyllables;
    steps.push({
      key: "count",
      label: "Syllable count",
      provenance: "scriptural",
      citation: "Ashvalayana Grhya Sutra I.15.6; Shankhayana I.24.4",
      detail: met
        ? `${syllables} syllables, for ${
            input.goal === "stability"
              ? "one desiring pratishtha, a firm position"
              : "one desiring yashas, renown"
          }.`
        : `${syllables} syllables, against a target of ${context.targetSyllables}.`,
      outcome: met ? "met" : "unmet",
    });
    score += met ? 30 : -20;
  }

  // 3. A voiced opening.
  const voiced = VOICED_INITIALS.test(initial);
  steps.push({
    key: "voiced",
    label: "Voiced opening",
    provenance: "scriptural",
    citation: "Ashvalayana Grhya Sutra I.15.4",
    detail: voiced
      ? `${initial} is ghoshavat, a voiced sound.`
      : `${initial} is unvoiced, which the rule disfavours.`,
    outcome: voiced ? "met" : "unmet",
  });
  score += voiced ? 12 : -6;

  // 4. An internal semivowel.
  const semivowel = /[yrlv]/.test(label.slice(1));
  steps.push({
    key: "semivowel",
    label: "Internal semivowel",
    provenance: "scriptural",
    citation: "Ashvalayana Grhya Sutra I.15.4; Paraskara I.17.2",
    detail: semivowel
      ? "Carries an antahstha (y, r, l or v) inside the name."
      : "Carries no antahstha inside the name.",
    outcome: semivowel ? "met" : "unmet",
  });
  score += semivowel ? 12 : -4;

  // 5. A vowel ending.
  const endsVowel = VOWELS.test(label.slice(-1));
  steps.push({
    key: "ending",
    label: "Vowel ending",
    provenance: "scriptural",
    citation: "Ashvalayana Grhya Sutra I.15.4; Paraskara I.17.2",
    detail: endsVowel
      ? `Ends in -${label.slice(-1)}, an open vowel.`
      : "Ends on a consonant, which the rule disfavours.",
    outcome: endsVowel ? "met" : "unmet",
  });
  score += endsVowel ? 10 : -8;

  // 6. Element, through the composed varga chain. Labelled as ours.
  const varga = vargaFor(initial);
  if (context.element && varga) {
    const met = varga.element === context.element;
    const el = ELEMENTS[context.element];
    steps.push({
      key: "element",
      label: "Element of the opening sound",
      provenance: "ours",
      citation:
        "Composed by NameGenius: varga to planet from Sharada Tilaka Tantra, planet to mahabhuta from Brihat Parashara Hora Shastra 3.20. No source asserts the composed result, and the two published varga-to-element tables contradict each other.",
      detail: met
        ? `${initial} sits in ${varga.name}, which this chain carries to ${el.name} (${el.english}) — the element indicated by ${
            context.elementFrom === "entrance"
              ? "the premises entrance"
              : context.elementFrom === "category"
                ? "the trade"
                : "the target market"
          }.`
        : `${initial} sits in ${varga.name}, which this chain carries to ${
            varga.element ? ELEMENTS[varga.element].name : "no assigned element"
          }, not the indicated ${el.name}.`,
      outcome: met ? "met" : "unmet",
    });
    score += met ? 18 : 0;
  }

  // 7. Numerology.
  const compound = chaldeanCompound(label);
  const root = reduceToRoot(compound);
  const reading = COMPOUND_READINGS[compound];
  steps.push({
    key: "numerology",
    label: "Chaldean value",
    provenance: "modern",
    citation:
      "Cheiro's compound readings, as used by Indian practitioners. A twentieth-century system operating on the Roman alphabet, not a Vedic one.",
    detail: reading
      ? `Compound ${compound}, root ${root}. ${reading.name ? `${reading.name}: ` : ""}${reading.reading}`
      : `Compound ${compound}, root ${root}. ${ROOT_SIGNATURES[root].graha}: ${ROOT_SIGNATURES[root].character}`,
    outcome: reading ? (reading.tone === "favourable" ? "met" : "unmet") : "note",
  });
  if (reading?.tone === "favourable") score += 22;
  if (reading?.tone === "cautionary") score -= 34;
  // 26 is the specific warning about ruin through partnerships.
  if (compound === 26 && input.hasPartners) score -= 40;
  if (root === 6) score += 8;

  // 8. Harmony with the founder's own number.
  if (context.psychic) {
    const friendly = context.friendly.includes(root);
    const hostile = context.avoidRoots.includes(root);
    steps.push({
      key: "harmony",
      label: "Harmony with the founder",
      provenance: "modern",
      citation:
        "Practitioner convention. Sources disagree on whether to harmonise to the psychic or the destiny number, and none gives a principled reason to prefer one.",
      detail: friendly
        ? `Root ${root} is friendly to your psychic number ${context.psychic}.`
        : hostile
          ? `Root ${root} is one your psychic number ${context.psychic} is told to avoid.`
          : `Root ${root} is neutral to your psychic number ${context.psychic}.`,
      outcome: friendly ? "met" : hostile ? "unmet" : "note",
    });
    score += friendly ? 20 : hostile ? -26 : 0;
  }

  // 9. Meaning, and the semantic blocklist.
  const parts = composition.parts.map((m) => ({ t: m.t, d: m.d, gloss: m.gloss }));
  const gloss = composition.prefix
    ? `su- (well, good) + ${parts.map((p) => p.gloss).join(" + ")}`
    : parts.map((p) => p.gloss).join(" + ");
  steps.push({
    key: "meaning",
    label: "Meaning",
    provenance: "scriptural",
    citation: "Manusmriti 2.33 (plain in meaning, easy to say); 3.9 (semantic blocklist)",
    detail: `${gloss}. The lexicon excludes rivers, mountains, trees, birds, snakes and anything carrying death or servility, per the blocklist.`,
    outcome: "met",
  });

  const devanagari = composition.prefix
    ? "सु" + composition.parts.map((p) => p.d).join("")
    : composition.parts.map((p) => p.d).join("");

  return {
    label,
    display: label.charAt(0).toUpperCase() + label.slice(1),
    devanagari,
    parts,
    syllables,
    initial,
    exactPada,
    compound,
    root,
    score,
    steps,
  };
}

/** Names ranked by how well the chain holds, best first. */
export function deriveNames(input: VastuInput, limit = 24): {
  context: VastuContext;
  names: DerivedName[];
} {
  const context = buildContext(input);
  const compositions = compose(context);

  const seen = new Set<string>();
  const names: DerivedName[] = [];

  for (const composition of compositions) {
    if (seen.has(composition.label)) continue;
    if (composition.label.length < 4 || composition.label.length > 22) continue;
    if (context.avoidWords.some((w) => w && composition.label.includes(w))) continue;
    seen.add(composition.label);
    names.push(deriveOne(composition, context, input));
  }

  names.sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));

  // Two names opening on the same word are near-duplicates to a reader, so take
  // one lead at a time and cap how many any single lead may contribute. A
  // nakshatra whose syllables reach only one lead word in the lexicon would
  // otherwise fill the whole page with one prefix; a short varied list is the
  // honest result, and the caller reports the count either way.
  const PER_LEAD = 4;
  const byLead = new Map<string, DerivedName[]>();
  for (const name of names) {
    const key = name.parts[0]?.t ?? name.label;
    if (!byLead.has(key)) byLead.set(key, []);
    byLead.get(key)!.push(name);
  }

  const interleaved: DerivedName[] = [];
  for (let round = 0; round < PER_LEAD && interleaved.length < limit; round++) {
    for (const group of byLead.values()) {
      if (!group[round]) continue;
      interleaved.push(group[round]);
      if (interleaved.length >= limit) break;
    }
  }

  return { context, names: interleaved };
}

/** How complete the answers are, so the flow can say what is still missing. */
export function readiness(input: VastuInput): {
  answered: number;
  total: number;
  missing: string[];
} {
  const checks: [boolean, string][] = [
    [input.nakshatra !== null, "birth nakshatra"],
    [input.pada !== null, "nakshatra pada"],
    [input.birthDay !== null, "day of birth"],
    [input.hasPartners !== null, "co-founders"],
    [input.category !== null, "trade"],
    [input.entrance !== "unknown", "entrance direction"],
    [input.premisesFixed !== null, "premises"],
    [input.goal !== null, "three-to-five year goal"],
    [input.market !== null, "market"],
    [input.script !== null, "script"],
    [input.deity !== "none", "deity"],
    [input.founderName.trim() !== "", "founder's name"],
    [input.existingName.trim() !== "", "existing name"],
    [input.avoid.trim() !== "", "words to avoid"],
  ];
  return {
    answered: checks.filter(([ok]) => ok).length,
    total: checks.length,
    missing: checks.filter(([ok]) => !ok).map(([, label]) => label),
  };
}
