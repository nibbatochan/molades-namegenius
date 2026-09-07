import { normalizeName } from "./domain";
import { suggestKeywords } from "./text";
import type { Candidate, RunInput } from "./types";

/**
 * Candidate generation. Deterministic today so the screen works with no API key
 * and no spend; this is the seam where a model call replaces the local strategies.
 * The contract that matters is downstream: whatever produces candidates,
 * nothing reaches the user until the registry has confirmed it is available.
 */

const SUFFIXES = [
  "ly",
  "ify",
  "base",
  "kit",
  "flow",
  "forge",
  "loop",
  "craft",
  "labs",
  "wave",
  "port",
  "mint",
  "grid",
  "stack",
];

const PREFIXES = ["get", "try", "use", "go", "hey", "with"];

const METAPHORS = [
  "atlas",
  "harbor",
  "ember",
  "summit",
  "orbit",
  "canvas",
  "beacon",
  "kestrel",
  "cobalt",
  "vertex",
  "lumen",
  "quarry",
  "meridian",
  "thicket",
  "anvil",
  "compass",
];

const VOWELS = new Set(["a", "e", "i", "o", "u", "y"]);

function titleCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function pronounceability(label: string): number {
  if (!label) return 0;
  let runs = 0;
  let current = 0;
  for (const ch of label) {
    const isVowel = VOWELS.has(ch);
    if (current === 0) current = isVowel ? 1 : -1;
    else {
      const next = isVowel ? 1 : -1;
      if (next === current) runs += 1;
      current = next;
    }
  }
  const vowelCount = [...label].filter((c) => VOWELS.has(c)).length;
  const ratio = vowelCount / label.length;
  const balance = 1 - Math.min(1, Math.abs(ratio - 0.4) / 0.4);
  const clusterPenalty = Math.min(1, runs / Math.max(4, label.length / 2));
  return Math.max(0, balance * 0.7 + (1 - clusterPenalty) * 0.3);
}

/**
 * Rejects labels a person cannot say out loud. Blending two words mechanically
 * produces things like "booics" and "reschook", and shipping those alongside
 * good candidates costs more credibility than the extra options are worth.
 */
function isSayable(label: string): boolean {
  if (/(.)\1\1/.test(label)) return false;
  if (/[aeiouy]{3,}/.test(label)) return false;
  if (/[^aeiouy-]{4,}/.test(label)) return false;
  const vowels = [...label].filter((c) => VOWELS.has(c)).length;
  const ratio = vowels / label.length;
  if (ratio < 0.25 || ratio > 0.6) return false;
  return pronounceability(label) >= 0.5;
}

function brandScore(label: string, terms: string[]): number {
  const lengthFit = label.length <= 6 ? 1 : label.length <= 10 ? 0.85 : label.length <= 14 ? 0.6 : 0.3;
  const clean = /^[a-z]+$/.test(label) ? 1 : 0.7;
  const relevance = terms.some((t) => t && label.includes(t.slice(0, Math.min(4, t.length)))) ? 1 : 0.75;
  return Number((lengthFit * 0.4 + pronounceability(label) * 0.3 + clean * 0.15 + relevance * 0.15).toFixed(3));
}

type Draft = {
  label: string;
  style: Candidate["style"];
  group: Candidate["group"];
  rationale: string;
  /** The seed word this was built from, used to cap how much any one root dominates. */
  root: string;
};

/** Pull the usable single-word terms out of everything the user gave us. */
function seedTerms(input: RunInput): string[] {
  const fromKeywords = input.keywords.flatMap((k) => k.split(/\s+/));
  const fromDescription = input.description.trim()
    ? suggestKeywords(input.description, input.keywords, 6).flatMap((k) => k.split(/\s+/))
    : [];
  const all = [...fromKeywords, ...fromDescription]
    .map((t) => normalizeName(t).label)
    .filter((t) => t.length >= 3 && t.length <= 12);
  return [...new Set(all)];
}

export function draftCandidates(input: RunInput, target: number): Draft[] {
  const seedName = normalizeName(input.name).label;
  const terms = seedTerms(input);
  const avoid = new Set(
    (input.discovery.avoid ?? "")
      .split(/[,\s]+/)
      .map((w) => w.toLowerCase().trim())
      .filter(Boolean),
  );
  const competitorLabels = input.competitors
    .map((c) => normalizeName(c).label)
    .filter((c) => c.length >= 3);

  const drafts: Draft[] = [];
  const seen = new Set<string>();
  const push = (d: Draft) => {
    const label = d.label;
    if (!label || label.length < 3 || label.length > 20) return;
    if (seen.has(label)) return;
    if (avoid.size && [...avoid].some((w) => label.includes(w))) return;
    // Blends are the strategy most likely to produce nonsense, so they face the
    // full sayability bar. Everything else only has to clear the obvious stuff.
    if (d.style === "blend" ? !isSayable(label) : /(.)\1\1|[^aeiouy-]{5,}/.test(label)) return;
    // Never suggest something that collides with a competitor the user named.
    if (competitorLabels.some((c) => label === c || label.includes(c) || c.includes(label))) return;
    seen.add(label);
    drafts.push(d);
  };

  // Close group: recognisably adjacent to the name they already wanted.
  if (seedName) {
    for (const suffix of SUFFIXES) {
      push({
        label: `${seedName}${suffix}`,
        style: "compound",
        group: "close",
        root: seedName,
        rationale: `Keeps "${titleCase(seedName)}" intact and adds a familiar product ending.`,
      });
    }
    for (const prefix of PREFIXES) {
      push({
        label: `${prefix}${seedName}`,
        style: "affix",
        group: "close",
        root: seedName,
        rationale: `The name you wanted, reachable as ${prefix}${seedName}.com.`,
      });
    }
    for (const term of terms.slice(0, 4)) {
      push({
        label: `${seedName}${term}`,
        style: "compound",
        group: "close",
        root: seedName,
        rationale: `Pairs your name with "${term}" from what you described.`,
      });
    }
  }

  // Fresh group: different names, same positioning.
  for (const term of terms) {
    for (const suffix of SUFFIXES) {
      push({
        label: `${term}${suffix}`,
        style: "compound",
        group: "fresh",
        root: term,
        rationale: `Built on "${term}", a word central to what you described.`,
      });
    }
  }

  for (let i = 0; i < terms.length; i++) {
    for (let j = 0; j < terms.length; j++) {
      if (i === j) continue;
      const a = terms[i];
      const b = terms[j];
      push({
        label: `${a.slice(0, Math.max(3, Math.ceil(a.length / 2)))}${b.slice(-Math.max(3, Math.floor(b.length / 2)))}`,
        style: "blend",
        group: "fresh",
        root: a,
        rationale: `A blend of "${a}" and "${b}".`,
      });
    }
  }

  for (const metaphor of METAPHORS) {
    push({
      label: metaphor,
      style: "metaphor",
      group: "fresh",
      root: metaphor,
      rationale: "A real word used as a metaphor, short and easy to say.",
    });
    for (const term of terms.slice(0, 3)) {
      push({
        label: `${metaphor}${term}`,
        style: "metaphor",
        group: "fresh",
        root: metaphor,
        rationale: `"${titleCase(metaphor)}" as a metaphor, anchored by "${term}".`,
      });
    }
  }

  const preferShort = input.discovery.length === "short";
  const wantedStyle = input.discovery.style;

  const ranked = drafts
    .map((d) => ({ d, score: brandScore(d.label, terms) * (d.style === "blend" ? 0.9 : 1) }))
    .sort((a, b) => {
      const styleBias = (x: Draft) => (wantedStyle && matchesStyle(x, wantedStyle) ? 0.12 : 0);
      const lengthBias = (x: Draft) => (preferShort ? Math.max(0, (12 - x.label.length) * 0.012) : 0);
      return (
        b.score + styleBias(b.d) + lengthBias(b.d) - (a.score + styleBias(a.d) + lengthBias(a.d))
      );
    })
    .map(({ d }) => d);

  return interleaveByRoot(ranked, target);
}

/**
 * Ranking alone lets one strong seed word take over: sort by score and you get
 * eleven variations of the same root. Round-robin across roots so whatever
 * prefix of this list survives the registry is still varied.
 */
function interleaveByRoot(ranked: Draft[], target: number): Draft[] {
  const byRoot = new Map<string, Draft[]>();
  for (const draft of ranked) {
    const bucket = byRoot.get(draft.root);
    if (bucket) bucket.push(draft);
    else byRoot.set(draft.root, [draft]);
  }

  // Close variants stay first: someone attached to their own name should see
  // those before we show them something unrelated.
  const buckets = [...byRoot.values()].sort((a, b) => {
    if (a[0].group !== b[0].group) return a[0].group === "close" ? -1 : 1;
    return 0;
  });

  const out: Draft[] = [];
  let depth = 0;
  while (out.length < target && buckets.some((b) => b.length > depth)) {
    for (const bucket of buckets) {
      if (out.length >= target) break;
      if (bucket.length > depth) out.push(bucket[depth]);
    }
    depth += 1;
  }
  return out;
}

function matchesStyle(d: Draft, style: NonNullable<RunInput["discovery"]["style"]>): boolean {
  if (style === "compound") return d.style === "compound";
  if (style === "metaphor") return d.style === "metaphor";
  if (style === "invented") return d.style === "blend";
  if (style === "real-word") return d.style === "metaphor";
  return false;
}

export function toCandidate(
  draft: Draft,
  domain: string,
  state: Candidate["state"],
  checkedAt: string,
  terms: string[],
): Candidate {
  return {
    name: titleCase(draft.label),
    domain,
    style: draft.style,
    group: draft.group,
    rationale: draft.rationale,
    brandScore: brandScore(draft.label, terms),
    state,
    checkedAt,
  };
}

export { seedTerms };
