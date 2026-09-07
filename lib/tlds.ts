/**
 * The extensions the register covers.
 *
 * India first, per the audience: `.in` leads and `.co.in` sits beside it, then
 * the endings a founder anywhere reaches for. Each carries a plain-language
 * note, because "which ending should I take" is a real question and a bare
 * list of dots does not answer it.
 */
export type Tld = {
  /** The suffix without a leading dot, e.g. "co.in". */
  id: string;
  /** How it is drawn on a tab. */
  label: string;
  /** One line on who it is for. */
  note: string;
  /** False when the registry has no RDAP service, so we say so up front. */
  rdap: boolean;
};

export const TLDS: Tld[] = [
  { id: "in", label: ".in", note: "India's own ending. Short, and still widely free.", rdap: true },
  { id: "co.in", label: ".co.in", note: "The commercial second level under .in.", rdap: true },
  { id: "com", label: ".com", note: "The default everywhere. Hardest to find free.", rdap: true },
  { id: "io", label: ".io", note: "Long-standing favourite for developer tools.", rdap: true },
  { id: "ai", label: ".ai", note: "Anguilla's ending, adopted by AI products.", rdap: true },
  { id: "co", label: ".co", note: "A short stand-in when .com is gone.", rdap: true },
  { id: "org", label: ".org", note: "Non-profits, communities, and standards.", rdap: true },
  { id: "app", label: ".app", note: "Google's ending. HTTPS is enforced on it.", rdap: true },
];

export const DEFAULT_TLD_ID = "in";

/** The five that get tabs cut into the entry rule; the rest live behind "more". */
export const PRIMARY_TLD_IDS = ["in", "co.in", "com", "io", "ai"];

const BY_ID = new Map(TLDS.map((t) => [t.id, t]));

export function getTld(id: string): Tld {
  return BY_ID.get(id) ?? BY_ID.get(DEFAULT_TLD_ID)!;
}

export function isKnownTld(id: unknown): id is string {
  return typeof id === "string" && BY_ID.has(id);
}

/**
 * Every suffix we recognise when stripping one off what the user typed, longest
 * first so "acme.co.in" loses "co.in" rather than just "in" and leaves "acme.co"
 * standing as the label.
 */
export const STRIPPABLE_SUFFIXES = [
  ...TLDS.map((t) => t.id),
  "co.uk",
  "org.in",
  "net.in",
  "firm.in",
  "gen.in",
  "ind.in",
]
  .map((s) => s.toLowerCase())
  .sort((a, b) => b.length - a.length);

/**
 * The candidate RDAP zones for a domain, longest suffix first. IANA's bootstrap
 * registers `in`, not `co.in`, so a second-level domain has to fall back to its
 * registry's zone or every `.co.in` check reports unverified.
 */
export function rdapZoneCandidates(domain: string): string[] {
  const parts = domain.toLowerCase().split(".").filter(Boolean);
  const zones: string[] = [];
  for (let i = 1; i < parts.length; i++) {
    zones.push(parts.slice(i).join("."));
  }
  return zones;
}
