import type { RunInput } from "./types";

const STOPWORDS = new Set(
  `a about above after again against all also am an and any are as at be because been before being below between both
  but by can cannot could did do does doing down during each few for from further had has have having he her here hers
  him his how i if in into is it its itself just like made make many me more most my no nor not of off on once only or
  other our out over own same she should so some such than that the their them then there these they this those through
  to too under until up use used using very was we well were what when where which while who whom why will with would
  you your our us it's we're they're new best top great good really much thing things want need help lets let get`
    .split(/\s+/)
    .filter(Boolean),
);

const GENERIC = new Set([
  "app",
  "platform",
  "product",
  "startup",
  "company",
  "business",
  "software",
  "tool",
  "tools",
  "service",
  "services",
  "solution",
  "solutions",
  "website",
  "site",
  "team",
  "teams",
  "user",
  "users",
  "people",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Heuristic keyword extraction. Deterministic, free, and good enough to propose
 * chips the user accepts or dismisses. Swap point for a model call: same
 * signature, same output shape.
 */
export function suggestKeywords(description: string, existing: string[] = [], max = 6): string[] {
  const have = new Set(existing.map((k) => k.toLowerCase().trim()));
  const words = tokenize(description);
  if (words.length === 0) return [];

  const scores = new Map<string, number>();
  const bump = (term: string, by: number) => {
    if (term.length < 4 || term.length > 18) return;
    if (STOPWORDS.has(term) || have.has(term)) return;
    scores.set(term, (scores.get(term) ?? 0) + by);
  };

  words.forEach((w, i) => {
    bump(w, GENERIC.has(w) ? 0.35 : 1);
    // Position bias: the first sentence usually carries the actual subject.
    if (i < 12) bump(w, 0.5);
  });

  for (let i = 0; i < words.length - 1; i++) {
    const [a, b] = [words[i], words[i + 1]];
    if (STOPWORDS.has(a) || STOPWORDS.has(b)) continue;
    const bigram = `${a} ${b}`;
    if (bigram.length <= 22 && !have.has(bigram)) {
      scores.set(bigram, (scores.get(bigram) ?? 0) + 1.4);
    }
  }

  const ranked = [...scores.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].length - b[0].length)
    .map(([term]) => term);

  // Drop single words that are already covered by a higher-ranked bigram.
  const picked: string[] = [];
  for (const term of ranked) {
    if (picked.length >= max) break;
    const covered = picked.some((p) => p.includes(term) || term.includes(p));
    if (!covered) picked.push(term);
  }
  return picked;
}

export type Strength = {
  score: number;
  level: "empty" | "thin" | "good" | "strong";
  /** The single most useful thing the user could add next. */
  nextStep: string | null;
  parts: { label: string; earned: number; of: number }[];
};

/**
 * Deterministic and explainable on purpose: this meter replaces a validation
 * gate, so it has to be able to say exactly what would raise it.
 */
export function scoreStrength(input: RunInput): Strength {
  const description = input.description.trim();
  const substantive = description.length >= 120;
  const someDescription = description.length > 0;

  const parts = [
    { label: "A name to check", earned: input.name.trim() ? 1 : 0, of: 1 },
    {
      label: "A description of what you're building",
      earned: substantive ? 2 : someDescription ? 1 : 0,
      of: 2,
    },
    { label: "Three or more keywords", earned: input.keywords.length >= 3 ? 1 : 0, of: 1 },
    { label: "At least one competitor", earned: input.competitors.length >= 1 ? 1 : 0, of: 1 },
    {
      label: "Brand questions answered",
      earned: Object.values(input.discovery).some(Boolean) ? 1 : 0,
      of: 1,
    },
  ];

  const score = parts.reduce((sum, p) => sum + p.earned, 0);
  const level: Strength["level"] =
    score === 0 ? "empty" : score <= 2 ? "thin" : score <= 4 ? "good" : "strong";

  const missing = parts.find((p) => p.earned < p.of);
  return { score, level, parts, nextStep: missing ? missing.label : null };
}

export function hasAnyInput(input: RunInput): boolean {
  return Boolean(
    input.name.trim() ||
      input.description.trim() ||
      input.keywords.length ||
      input.competitors.length,
  );
}

export const STRENGTH_MAX = 6;
