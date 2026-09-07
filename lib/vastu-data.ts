/**
 * The tables Vastu mode derives from.
 *
 * Provenance is carried in the data, not bolted on in the UI, because the
 * honest label is only useful if it travels with the rule that earned it.
 * Sources are in docs/research/vedic-vastu-naming-research.md; the tags below
 * mean what that document defines them to mean:
 *
 *   scriptural  — stated in a named text, cited on the rule
 *   traditional — long-standing practice, carried by the tradition
 *   modern      — contemporary practitioner convention, not scripture
 *   ours        — assembled by NameGenius from separately cited sources
 */

import type { Provenance } from "./types";

// --- Nakshatras -------------------------------------------------------------
// The Avakahada Chakra: 27 nakshatras of 4 padas, each pada carrying a starting
// syllable. TRADITIONAL, not scriptural — Apastamba GS 6.15.2 mandates a
// nakshatra name but supplies no table, and the table is absent from Brihat
// Samhita and BPHS, both of which are routinely miscited for it.
//
// Verified by partition: sliced into twelve consecutive groups of nine, these
// 108 padas reproduce all twelve published rashi syllable lists exactly.

export type Nakshatra = {
  n: number;
  name: string;
  devanagari: string;
  lord: string;
  /** Starting syllables for padas 1-4, in transliteration. */
  padas: [string, string, string, string];
  padasDevanagari: [string, string, string, string];
  /** Flagged where sources genuinely disagree and we could not adjudicate. */
  lowConfidence?: string;
};

export const NAKSHATRAS: Nakshatra[] = [
  { n: 1, name: "Ashwini", devanagari: "अश्विनी", lord: "Ketu", padas: ["Chu", "Che", "Cho", "La"], padasDevanagari: ["चु", "चे", "चो", "ला"] },
  { n: 2, name: "Bharani", devanagari: "भरणी", lord: "Shukra", padas: ["Li", "Lu", "Le", "Lo"], padasDevanagari: ["ली", "लू", "ले", "लो"] },
  { n: 3, name: "Krittika", devanagari: "कृत्तिका", lord: "Surya", padas: ["A", "I", "U", "E"], padasDevanagari: ["अ", "ई", "उ", "ए"] },
  { n: 4, name: "Rohini", devanagari: "रोहिणी", lord: "Chandra", padas: ["O", "Va", "Vi", "Vu"], padasDevanagari: ["ओ", "वा", "वी", "वू"] },
  { n: 5, name: "Mrigashira", devanagari: "मृगशिरा", lord: "Mangala", padas: ["Ve", "Vo", "Ka", "Ki"], padasDevanagari: ["वे", "वो", "का", "की"] },
  { n: 6, name: "Ardra", devanagari: "आर्द्रा", lord: "Rahu", padas: ["Ku", "Gha", "Nga", "Chha"], padasDevanagari: ["कू", "घ", "ङ", "छ"] },
  { n: 7, name: "Punarvasu", devanagari: "पुनर्वसु", lord: "Guru", padas: ["Ke", "Ko", "Ha", "Hi"], padasDevanagari: ["के", "को", "हा", "ही"] },
  { n: 8, name: "Pushya", devanagari: "पुष्य", lord: "Shani", padas: ["Hu", "He", "Ho", "Da"], padasDevanagari: ["हू", "हे", "हो", "डा"] },
  { n: 9, name: "Ashlesha", devanagari: "आश्लेषा", lord: "Budha", padas: ["Di", "Du", "De", "Do"], padasDevanagari: ["डी", "डू", "डे", "डो"] },
  { n: 10, name: "Magha", devanagari: "मघा", lord: "Ketu", padas: ["Ma", "Mi", "Mu", "Me"], padasDevanagari: ["मा", "मी", "मू", "मे"] },
  { n: 11, name: "Purva Phalguni", devanagari: "पूर्व फाल्गुनी", lord: "Shukra", padas: ["Mo", "Ta", "Ti", "Tu"], padasDevanagari: ["मो", "टा", "टी", "टू"] },
  { n: 12, name: "Uttara Phalguni", devanagari: "उत्तर फाल्गुनी", lord: "Surya", padas: ["Te", "To", "Pa", "Pi"], padasDevanagari: ["टे", "टो", "पा", "पी"] },
  { n: 13, name: "Hasta", devanagari: "हस्त", lord: "Chandra", padas: ["Pu", "Sha", "Na", "Tha"], padasDevanagari: ["पू", "ष", "ण", "ठ"] },
  { n: 14, name: "Chitra", devanagari: "चित्रा", lord: "Mangala", padas: ["Pe", "Po", "Ra", "Ri"], padasDevanagari: ["पे", "पो", "रा", "री"] },
  { n: 15, name: "Swati", devanagari: "स्वाती", lord: "Rahu", padas: ["Ru", "Re", "Ro", "Ta"], padasDevanagari: ["रू", "रे", "रो", "ता"] },
  { n: 16, name: "Vishakha", devanagari: "विशाखा", lord: "Guru", padas: ["Ti", "Tu", "Te", "To"], padasDevanagari: ["ती", "तू", "ते", "तो"] },
  { n: 17, name: "Anuradha", devanagari: "अनुराधा", lord: "Shani", padas: ["Na", "Ni", "Nu", "Ne"], padasDevanagari: ["ना", "नी", "नू", "ने"] },
  { n: 18, name: "Jyeshtha", devanagari: "ज्येष्ठा", lord: "Budha", padas: ["No", "Ya", "Yi", "Yu"], padasDevanagari: ["नो", "या", "यी", "यू"] },
  { n: 19, name: "Mula", devanagari: "मूल", lord: "Ketu", padas: ["Ye", "Yo", "Bha", "Bhi"], padasDevanagari: ["ये", "यो", "भा", "भी"] },
  {
    n: 20,
    name: "Purva Ashadha",
    devanagari: "पूर्वाषाढा",
    lord: "Shukra",
    padas: ["Bhu", "Dha", "Pha", "Dhaa"],
    padasDevanagari: ["भू", "धा", "फा", "ढा"],
    lowConfidence:
      "Padas 3 and 4 are genuinely muddled across sources. Devanagari फा/ढा supports Pha and retroflex Dha; other sources give Bha/Da.",
  },
  { n: 21, name: "Uttara Ashadha", devanagari: "उत्तराषाढा", lord: "Surya", padas: ["Bhe", "Bho", "Ja", "Ji"], padasDevanagari: ["भे", "भो", "जा", "जी"] },
  { n: 22, name: "Shravana", devanagari: "श्रवण", lord: "Chandra", padas: ["Khi", "Khu", "Khe", "Kho"], padasDevanagari: ["खी", "खू", "खे", "खो"] },
  { n: 23, name: "Dhanishta", devanagari: "धनिष्ठा", lord: "Mangala", padas: ["Ga", "Gi", "Gu", "Ge"], padasDevanagari: ["गा", "गी", "गू", "गे"] },
  { n: 24, name: "Shatabhisha", devanagari: "शतभिषा", lord: "Rahu", padas: ["Go", "Sa", "Si", "Su"], padasDevanagari: ["गो", "सा", "सी", "सू"] },
  { n: 25, name: "Purva Bhadrapada", devanagari: "पूर्व भाद्रपदा", lord: "Guru", padas: ["Se", "So", "Da", "Di"], padasDevanagari: ["से", "सो", "दा", "दी"] },
  { n: 26, name: "Uttara Bhadrapada", devanagari: "उत्तर भाद्रपदा", lord: "Shani", padas: ["Du", "Tha", "Jha", "Nya"], padasDevanagari: ["दू", "थ", "झ", "ञ"] },
  { n: 27, name: "Revati", devanagari: "रेवती", lord: "Budha", padas: ["De", "Do", "Cha", "Chi"], padasDevanagari: ["दे", "दो", "च", "ची"] },
];

export const RASHIS = [
  { n: 1, name: "Mesha", english: "Aries", devanagari: "मेष" },
  { n: 2, name: "Vrishabha", english: "Taurus", devanagari: "वृषभ" },
  { n: 3, name: "Mithuna", english: "Gemini", devanagari: "मिथुन" },
  { n: 4, name: "Karka", english: "Cancer", devanagari: "कर्क" },
  { n: 5, name: "Simha", english: "Leo", devanagari: "सिंह" },
  { n: 6, name: "Kanya", english: "Virgo", devanagari: "कन्या" },
  { n: 7, name: "Tula", english: "Libra", devanagari: "तुला" },
  { n: 8, name: "Vrishchika", english: "Scorpio", devanagari: "वृश्चिक" },
  { n: 9, name: "Dhanu", english: "Sagittarius", devanagari: "धनु" },
  { n: 10, name: "Makara", english: "Capricorn", devanagari: "मकर" },
  { n: 11, name: "Kumbha", english: "Aquarius", devanagari: "कुम्भ" },
  { n: 12, name: "Meena", english: "Pisces", devanagari: "मीन" },
];

/**
 * A rashi spans exactly nine padas, so its syllable list is the union of those
 * nine. This is arithmetic on the table above rather than a second source.
 */
export function syllablesForRashi(rashi: number): string[] {
  const all = NAKSHATRAS.flatMap((nak) => nak.padas);
  return all.slice((rashi - 1) * 9, rashi * 9);
}

export function rashiForPada(nakshatra: number, pada: number): number {
  return Math.floor(((nakshatra - 1) * 4 + (pada - 1)) / 9) + 1;
}

// --- Elements and directions ------------------------------------------------

export type Element = "prithvi" | "jala" | "agni" | "vayu" | "akasha";

export const ELEMENTS: Record<
  Element,
  { name: string; devanagari: string; english: string }
> = {
  prithvi: { name: "Prithvi", devanagari: "पृथ्वी", english: "Earth" },
  jala: { name: "Jala", devanagari: "जल", english: "Water" },
  agni: { name: "Agni", devanagari: "अग्नि", english: "Fire" },
  vayu: { name: "Vayu", devanagari: "वायु", english: "Air" },
  akasha: { name: "Akasha", devanagari: "आकाश", english: "Space" },
};

export type DirectionId =
  | "n"
  | "ne"
  | "e"
  | "se"
  | "s"
  | "sw"
  | "w"
  | "nw"
  | "unknown";

export type Direction = {
  id: DirectionId;
  label: string;
  sanskrit: string;
  deity: string;
  element: Element | null;
  qualities: string;
  functions: string;
  /** Practitioner grading of this direction as a commercial entrance. */
  entrance: "best" | "strong" | "workable" | "careful" | "poor";
  entranceNote: string;
};

// The dikpala framework is scriptural and stable. Grading an entrance for a
// *commercial* premises is practitioner convention: the classical texts discuss
// houses, temples, palaces and towns, not businesses.
export const DIRECTIONS: Direction[] = [
  {
    id: "n",
    label: "North",
    sanskrit: "Uttara",
    deity: "Kubera",
    element: "jala",
    qualities: "Wealth, opportunity, cash flow",
    functions: "Accounts, treasury, marketing",
    entrance: "best",
    entranceNote: "Kubera's quarter. Held to be the strongest commercial entrance.",
  },
  {
    id: "ne",
    label: "North-East",
    sanskrit: "Ishana",
    deity: "Ishana",
    element: "jala",
    qualities: "Clarity, purity, guidance",
    functions: "Reception, leadership, quality control",
    entrance: "best",
    entranceNote: "Excellent for premium and quality-led positioning.",
  },
  {
    id: "e",
    label: "East",
    sanskrit: "Purva",
    deity: "Indra",
    element: null,
    qualities: "Fame, recognition, new beginnings",
    functions: "Arrivals, licensing, public relations",
    entrance: "best",
    entranceNote: "Indra's quarter, associated with recognition and standing.",
  },
  {
    id: "se",
    label: "South-East",
    sanskrit: "Agneya",
    deity: "Agni",
    element: "agni",
    qualities: "Heat, power, transformation",
    functions: "Furnaces, electrical, kitchen, production",
    entrance: "workable",
    entranceNote: "Accepted, and particularly suited to fire trades.",
  },
  {
    id: "s",
    label: "South",
    sanskrit: "Dakshina",
    deity: "Yama",
    element: null,
    qualities: "Discipline, order, judgement",
    functions: "Heavy production, storage, staff",
    entrance: "careful",
    entranceNote: "Workable with care; suits discipline-intensive trades.",
  },
  {
    id: "sw",
    label: "South-West",
    sanskrit: "Nairritya",
    deity: "Nirriti",
    element: "prithvi",
    qualities: "Weight, stability, permanence",
    functions: "Owner's cabin, heavy machinery, raw material",
    entrance: "poor",
    entranceNote:
      "Held to be a poor entrance. A practitioner compensates by leaning harder on wealth semantics.",
  },
  {
    id: "w",
    label: "West",
    sanskrit: "Paschima",
    deity: "Varuna",
    element: null,
    qualities: "Gains realised, consolidation",
    functions: "Storage, consultation, catalogues",
    entrance: "strong",
    entranceNote: "Acceptable, associated with results being consolidated.",
  },
  {
    id: "nw",
    label: "North-West",
    sanskrit: "Vayavya",
    deity: "Vayu",
    element: "vayu",
    qualities: "Movement, circulation, turnover",
    functions: "Finished goods, dispatch, sales",
    entrance: "strong",
    entranceNote: "Good where turnover and movement matter.",
  },
];

export const DIRECTION_BY_ID = new Map(DIRECTIONS.map((d) => [d.id, d]));

// --- Varga (consonant classes) ---------------------------------------------

export type VargaId =
  | "ka"
  | "cha"
  | "tta"
  | "ta"
  | "pa"
  | "svara"
  | "antahstha";

export type Varga = {
  id: VargaId;
  name: string;
  articulation: string;
  letters: string[];
  /** Sharada Tilaka Tantra, c. 11th century. TRADITIONAL. */
  planet: string;
  /**
   * Composed, not cited: varga to planet from Sharada Tilaka, then planet to
   * mahabhuta from Brihat Parashara Hora Shastra 3.20. Both links are
   * attributable; the composition is ours, and it agrees with neither of the
   * two published varga-to-element tables, which contradict each other.
   */
  element: Element | null;
  direction: DirectionId;
};

export const VARGAS: Varga[] = [
  {
    id: "ka",
    name: "ka-varga",
    articulation: "guttural (kanthya)",
    letters: ["ka", "kha", "ga", "gha", "nga"],
    planet: "Mangala (Mars)",
    element: "agni",
    direction: "se",
  },
  {
    id: "cha",
    name: "cha-varga",
    articulation: "palatal (talavya)",
    letters: ["cha", "chha", "ja", "jha", "nya"],
    planet: "Shukra (Venus)",
    element: "jala",
    direction: "n",
  },
  {
    id: "tta",
    name: "ta-varga (retroflex)",
    articulation: "retroflex (murdhanya)",
    letters: ["tta", "ttha", "dda", "ddha", "nna"],
    planet: "Budha (Mercury)",
    element: "prithvi",
    direction: "sw",
  },
  {
    id: "ta",
    name: "ta-varga (dental)",
    articulation: "dental (dantya)",
    letters: ["ta", "tha", "da", "dha", "na"],
    planet: "Guru (Jupiter)",
    element: "akasha",
    direction: "ne",
  },
  {
    id: "pa",
    name: "pa-varga",
    articulation: "labial (oshthya)",
    letters: ["pa", "pha", "ba", "bha", "ma"],
    planet: "Shani (Saturn)",
    element: "vayu",
    direction: "nw",
  },
  {
    id: "svara",
    name: "svara (vowels)",
    articulation: "vowels",
    letters: ["a", "i", "u", "e", "o"],
    planet: "Surya (Sun)",
    element: null,
    direction: "e",
  },
  {
    id: "antahstha",
    name: "antahstha and ushman",
    articulation: "semivowels and sibilants",
    letters: ["ya", "ra", "la", "va", "sha", "sa", "ha"],
    planet: "Chandra (Moon)",
    element: "jala",
    direction: "nw",
  },
];

// --- Chaldean numerology ----------------------------------------------------
// MODERN. The system marketed as "ancient Vedic numerology" is a twentieth
// century import via Cheiro, operating on the Roman alphabet — which alone
// dates it. It is what Indian practitioners actually use for business names,
// so we implement it and label it honestly.

export const CHALDEAN: Record<string, number> = {
  a: 1, i: 1, j: 1, q: 1, y: 1,
  b: 2, k: 2, r: 2,
  c: 3, g: 3, l: 3, s: 3,
  d: 4, m: 4, t: 4,
  e: 5, h: 5, n: 5, x: 5,
  u: 6, v: 6, w: 6,
  o: 7, z: 7,
  f: 8, p: 8,
};

export const COMPOUND_READINGS: Record<
  number,
  { name?: string; reading: string; tone: "favourable" | "cautionary" }
> = {
  10: { name: "The Wheel of Fortune", reading: "Self-reliant rise.", tone: "favourable" },
  14: { reading: "Movement, trade, dealings with the public.", tone: "favourable" },
  19: { name: "The Prince of Heaven", reading: "The most fortunate compound in the system: success and honour.", tone: "favourable" },
  21: { name: "The Crown", reading: "Advancement and honour, after struggle.", tone: "favourable" },
  23: { name: "The Royal Star of the Lion", reading: "The luckiest for worldly help and patronage.", tone: "favourable" },
  24: { reading: "Gain through others; magnetic attraction.", tone: "favourable" },
  27: { name: "The Sceptre", reading: "Authority and command; reward for productive intellect.", tone: "favourable" },
  32: { reading: "Unexpected power and popularity.", tone: "favourable" },
  37: { reading: "Fortunate partnerships, alliances and unions.", tone: "favourable" },
  41: { reading: "Commonly cited as strong for enterprise.", tone: "favourable" },
  51: { reading: "Commonly cited as strong for enterprise.", tone: "favourable" },
  13: { name: "Upheaval", reading: "Forced change. Not simply unlucky in Cheiro, but widely avoided.", tone: "cautionary" },
  16: { name: "The Shattered Citadel", reading: "Structures collapsing at the point of completion.", tone: "cautionary" },
  18: { reading: "Betrayal from close associates; conflict.", tone: "cautionary" },
  26: { reading: "The specific business warning: ruin through partnerships and bad advice.", tone: "cautionary" },
  29: { reading: "Uncertainty and unreliable partners.", tone: "cautionary" },
};

export const ROOT_SIGNATURES: Record<
  number,
  { graha: string; character: string }
> = {
  1: { graha: "Surya (Sun)", character: "Leadership, originality, founder-driven brands." },
  2: { graha: "Chandra (Moon)", character: "Partnership, hospitality, public-facing." },
  3: { graha: "Guru (Jupiter)", character: "Knowledge, advisory, teaching, expansion." },
  4: { graha: "Rahu", character: "Disruption and technology, but volatile." },
  5: { graha: "Budha (Mercury)", character: "Commerce, communications, media, fast-moving trade." },
  6: { graha: "Shukra (Venus)", character: "Luxury, design, hospitality, arts. Held to be the strongest general business number." },
  7: { graha: "Ketu", character: "Research, depth, niche mastery." },
  8: { graha: "Shani (Saturn)", character: "Infrastructure and long horizons. Slow and testing." },
  9: { graha: "Mangala (Mars)", character: "Energy, competition, engineering." },
};

/** MODERN. Practitioners disagree on whether to harmonise to the psychic or destiny number. */
export const HARMONY: Record<number, { friendly: number[]; avoid: number[] }> = {
  1: { friendly: [1, 3, 5, 9], avoid: [4, 8] },
  2: { friendly: [2, 6, 7, 9], avoid: [4, 8] },
  3: { friendly: [1, 3, 5, 6, 9], avoid: [4, 8] },
  4: { friendly: [4, 5, 6, 7], avoid: [1, 8, 9] },
  5: { friendly: [1, 3, 5, 6], avoid: [2, 9] },
  6: { friendly: [3, 5, 6, 8], avoid: [1] },
  7: { friendly: [2, 6, 7], avoid: [8, 9] },
  8: { friendly: [5, 6, 8], avoid: [1, 2, 4] },
  9: { friendly: [1, 2, 3, 6, 9], avoid: [5, 7] },
};

// --- Business categories ----------------------------------------------------
// MODERN. Mapping a venture to an element is practitioner extrapolation from
// the scriptural dikpala framework; the classical texts do not discuss trades
// like these. Brihat Samhita ch. 41's rashi-commodity list is the nearest
// classical analogue.

export type CategoryId =
  | "finance"
  | "technology"
  | "manufacturing"
  | "logistics"
  | "education"
  | "wellness"
  | "design"
  | "retail"
  | "legal"
  | "food"
  | "media"
  | "realestate";

export type Category = {
  id: CategoryId;
  label: string;
  element: Element;
  direction: DirectionId;
  planet: string;
  /** Semantic fields the lexicon draws from for this trade. */
  fields: SemanticField[];
};

export const CATEGORIES: Category[] = [
  { id: "finance", label: "Finance, banking or investment", element: "jala", direction: "n", planet: "Budha (Mercury)", fields: ["wealth", "trust", "order"] },
  { id: "technology", label: "Software or technology", element: "akasha", direction: "ne", planet: "Guru (Jupiter)", fields: ["knowledge", "craft", "movement"] },
  { id: "manufacturing", label: "Manufacturing or industry", element: "agni", direction: "se", planet: "Mangala (Mars)", fields: ["craft", "energy", "stability"] },
  { id: "logistics", label: "Logistics or distribution", element: "vayu", direction: "nw", planet: "Chandra (Moon)", fields: ["movement", "trust", "craft"] },
  { id: "education", label: "Education or advisory", element: "akasha", direction: "ne", planet: "Guru (Jupiter)", fields: ["knowledge", "light", "order"] },
  { id: "wellness", label: "Healthcare or wellness", element: "jala", direction: "ne", planet: "Guru (Jupiter)", fields: ["flow", "trust", "light"] },
  { id: "design", label: "Design, media or the arts", element: "jala", direction: "n", planet: "Shukra (Venus)", fields: ["light", "craft", "beauty"] },
  { id: "retail", label: "Retail or consumer goods", element: "vayu", direction: "nw", planet: "Budha (Mercury)", fields: ["movement", "wealth", "beauty"] },
  { id: "legal", label: "Legal, tax or audit", element: "prithvi", direction: "s", planet: "Shani (Saturn)", fields: ["order", "trust", "stability"] },
  { id: "food", label: "Food or hospitality", element: "agni", direction: "se", planet: "Shukra (Venus)", fields: ["energy", "beauty", "flow"] },
  { id: "media", label: "Publishing or communications", element: "vayu", direction: "e", planet: "Budha (Mercury)", fields: ["light", "knowledge", "movement"] },
  { id: "realestate", label: "Real estate or construction", element: "prithvi", direction: "sw", planet: "Shani (Saturn)", fields: ["stability", "craft", "wealth"] },
];

export const CATEGORY_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

// --- Deities ----------------------------------------------------------------
// TRADITIONAL. The Namakarana name is classically the family-deity name; for a
// business, practitioners draw on these.

export type DeityId =
  | "none"
  | "lakshmi"
  | "ganesha"
  | "kubera"
  | "saraswati"
  | "vishvakarma"
  | "hanuman";

export const DEITIES: { id: DeityId; label: string; domain: string; fields: SemanticField[] }[] = [
  { id: "none", label: "No preference", domain: "", fields: [] },
  { id: "lakshmi", label: "Lakshmi", domain: "wealth and fortune", fields: ["wealth", "beauty"] },
  { id: "ganesha", label: "Ganesha", domain: "auspicious beginnings, removing obstacles", fields: ["auspice", "trust"] },
  { id: "kubera", label: "Kubera", domain: "treasury and accumulation", fields: ["wealth", "stability"] },
  { id: "saraswati", label: "Saraswati", domain: "learning and speech", fields: ["knowledge", "light"] },
  { id: "vishvakarma", label: "Vishvakarma", domain: "craft and making", fields: ["craft", "stability"] },
  { id: "hanuman", label: "Hanuman", domain: "strength and service", fields: ["energy", "trust"] },
];

// --- The lexicon ------------------------------------------------------------

export type SemanticField =
  | "wealth"
  | "knowledge"
  | "light"
  | "energy"
  | "movement"
  | "flow"
  | "stability"
  | "craft"
  | "trust"
  | "order"
  | "auspice"
  | "beauty";

export type Morpheme = {
  /** Transliteration, lowercase, as it will appear in the domain label. */
  t: string;
  /** Devanagari, for the reader who wants the actual word. */
  d: string;
  /** Plain-language gloss. */
  gloss: string;
  fields: SemanticField[];
  /** Opening syllable in the pada table's transliteration scheme. */
  initial: string;
  syllables: number;
  /** Can open a name. */
  lead?: boolean;
  /** Can close a compound. Agentive and action-derived forms are preferred. */
  tail?: boolean;
};

/**
 * Sanskrit morphemes with real glosses, chosen to satisfy the scriptural
 * preferences where possible: voiced openings, an internal semivowel, and a
 * vowel ending. Manusmriti 3.9's semantic blocklist is respected — no rivers,
 * mountains, trees, birds, snakes, or constellation names, and nothing
 * carrying death, terror, or servility.
 */
export const LEXICON: Morpheme[] = [
  // Wealth
  { t: "dhana", d: "धन", gloss: "wealth", fields: ["wealth"], initial: "Dha", syllables: 2, lead: true },
  { t: "vasu", d: "वसु", gloss: "treasure, the good", fields: ["wealth"], initial: "Va", syllables: 2, lead: true },
  { t: "nidhi", d: "निधि", gloss: "treasury, store", fields: ["wealth", "stability"], initial: "Ni", syllables: 2, lead: true, tail: true },
  { t: "artha", d: "अर्थ", gloss: "wealth, purpose", fields: ["wealth", "order"], initial: "A", syllables: 2, lead: true },
  { t: "shri", d: "श्री", gloss: "splendour, prosperity", fields: ["wealth", "beauty", "auspice"], initial: "Sha", syllables: 1, lead: true, tail: true },
  { t: "kosha", d: "कोश", gloss: "treasury", fields: ["wealth"], initial: "Ko", syllables: 2, lead: true, tail: true },
  { t: "hema", d: "हेम", gloss: "gold", fields: ["wealth", "beauty"], initial: "He", syllables: 2, lead: true },
  { t: "kanaka", d: "कनक", gloss: "gold", fields: ["wealth"], initial: "Ka", syllables: 3, lead: true },
  { t: "ratna", d: "रत्न", gloss: "jewel", fields: ["wealth", "beauty"], initial: "Ra", syllables: 2, lead: true },
  { t: "vibhava", d: "विभव", gloss: "wealth, might", fields: ["wealth"], initial: "Vi", syllables: 3, lead: true },
  { t: "bhuti", d: "भूति", gloss: "welfare, prosperity", fields: ["wealth", "auspice"], initial: "Bhu", syllables: 2, lead: true, tail: true },
  { t: "mani", d: "मणि", gloss: "gem", fields: ["wealth", "beauty"], initial: "Ma", syllables: 2, lead: true },
  { t: "samriddhi", d: "समृद्धि", gloss: "prosperity", fields: ["wealth"], initial: "Sa", syllables: 3, lead: true, tail: true },

  // Knowledge
  { t: "vidya", d: "विद्या", gloss: "knowledge", fields: ["knowledge"], initial: "Vi", syllables: 2, lead: true },
  { t: "jnana", d: "ज्ञान", gloss: "knowing", fields: ["knowledge"], initial: "Ja", syllables: 2, lead: true },
  { t: "veda", d: "वेद", gloss: "knowledge, the Vedas", fields: ["knowledge"], initial: "Ve", syllables: 2, lead: true, tail: true },
  { t: "bodha", d: "बोध", gloss: "understanding", fields: ["knowledge", "light"], initial: "Bo", syllables: 2, lead: true, tail: true },
  { t: "medha", d: "मेधा", gloss: "intellect", fields: ["knowledge"], initial: "Me", syllables: 2, lead: true },
  { t: "prajna", d: "प्रज्ञा", gloss: "wisdom", fields: ["knowledge"], initial: "Pa", syllables: 2, lead: true },
  { t: "mati", d: "मति", gloss: "thought, judgement", fields: ["knowledge", "order"], initial: "Ma", syllables: 2, lead: true, tail: true },
  { t: "akshara", d: "अक्षर", gloss: "imperishable, syllable", fields: ["knowledge", "stability"], initial: "A", syllables: 3, lead: true },
  { t: "shiksha", d: "शिक्षा", gloss: "teaching", fields: ["knowledge"], initial: "Sha", syllables: 2, lead: true },
  { t: "buddhi", d: "बुद्धि", gloss: "intellect", fields: ["knowledge"], initial: "Bu", syllables: 2, lead: true },

  // Light and renown
  { t: "arka", d: "अर्क", gloss: "the sun, radiance", fields: ["light", "energy"], initial: "A", syllables: 2, lead: true },
  { t: "ravi", d: "रवि", gloss: "the sun", fields: ["light"], initial: "Ra", syllables: 2, lead: true },
  { t: "tejas", d: "तेजस्", gloss: "radiance, keenness", fields: ["light", "energy"], initial: "Te", syllables: 2, lead: true },
  { t: "jyoti", d: "ज्योति", gloss: "light", fields: ["light"], initial: "Ja", syllables: 2, lead: true, tail: true },
  { t: "prabha", d: "प्रभा", gloss: "radiance", fields: ["light", "beauty"], initial: "Pa", syllables: 2, lead: true, tail: true },
  { t: "bhanu", d: "भानु", gloss: "the sun, light", fields: ["light"], initial: "Bha", syllables: 2, lead: true },
  { t: "kirti", d: "कीर्ति", gloss: "fame, renown", fields: ["light"], initial: "Ki", syllables: 2, lead: true, tail: true },
  { t: "yashas", d: "यशस्", gloss: "renown", fields: ["light"], initial: "Ya", syllables: 2, lead: true },
  { t: "dyuti", d: "द्युति", gloss: "splendour", fields: ["light", "beauty"], initial: "Du", syllables: 2, lead: true },
  { t: "udaya", d: "उदय", gloss: "rising, dawn", fields: ["light", "auspice"], initial: "U", syllables: 3, lead: true, tail: true },
  { t: "aloka", d: "आलोक", gloss: "light, sight", fields: ["light", "knowledge"], initial: "A", syllables: 3, lead: true },
  { t: "deepa", d: "दीप", gloss: "lamp", fields: ["light"], initial: "Di", syllables: 2, lead: true, tail: true },
  { t: "soma", d: "सोम", gloss: "the moon, nectar", fields: ["light", "flow"], initial: "So", syllables: 2, lead: true },
  { t: "chandra", d: "चन्द्र", gloss: "the moon", fields: ["light", "beauty"], initial: "Cha", syllables: 2, lead: true },

  // Energy
  { t: "ojas", d: "ओजस्", gloss: "vigour", fields: ["energy"], initial: "O", syllables: 2, lead: true },
  { t: "shakti", d: "शक्ति", gloss: "power, capacity", fields: ["energy"], initial: "Sha", syllables: 2, lead: true, tail: true },
  { t: "bala", d: "बल", gloss: "strength", fields: ["energy", "stability"], initial: "Ba", syllables: 2, lead: true, tail: true },
  { t: "urja", d: "ऊर्जा", gloss: "energy", fields: ["energy"], initial: "U", syllables: 2, lead: true },
  { t: "vira", d: "वीर", gloss: "hero, valorous", fields: ["energy"], initial: "Vi", syllables: 2, lead: true },
  { t: "tapas", d: "तपस्", gloss: "heat, disciplined effort", fields: ["energy", "order"], initial: "Ta", syllables: 2, lead: true },
  { t: "vahni", d: "वह्नि", gloss: "fire", fields: ["energy"], initial: "Va", syllables: 2, lead: true },
  { t: "ghana", d: "घन", gloss: "dense, solid", fields: ["energy", "stability"], initial: "Gha", syllables: 2, lead: true },

  // Movement
  { t: "gati", d: "गति", gloss: "motion, way", fields: ["movement"], initial: "Ga", syllables: 2, lead: true, tail: true },
  { t: "vega", d: "वेग", gloss: "speed", fields: ["movement", "energy"], initial: "Ve", syllables: 2, lead: true },
  { t: "pavana", d: "पवन", gloss: "wind, purifying", fields: ["movement", "flow"], initial: "Pa", syllables: 3, lead: true },
  { t: "marut", d: "मरुत्", gloss: "wind", fields: ["movement"], initial: "Ma", syllables: 2, lead: true },
  { t: "patha", d: "पथ", gloss: "path", fields: ["movement", "order"], initial: "Pa", syllables: 2, lead: true, tail: true },
  { t: "setu", d: "सेतु", gloss: "bridge, bond", fields: ["movement", "trust"], initial: "Se", syllables: 2, lead: true, tail: true },
  { t: "yana", d: "यान", gloss: "journey, vehicle", fields: ["movement"], initial: "Ya", syllables: 2, lead: true, tail: true },
  { t: "kranti", d: "क्रान्ति", gloss: "advance, turning", fields: ["movement", "energy"], initial: "Ka", syllables: 2, lead: true },
  { t: "chara", d: "चर", gloss: "moving, going", fields: ["movement"], initial: "Cha", syllables: 2, lead: true, tail: true },
  { t: "vaha", d: "वह", gloss: "carrying, bearing", fields: ["movement", "trust"], initial: "Va", syllables: 2, tail: true },

  // Flow
  { t: "jala", d: "जल", gloss: "water", fields: ["flow"], initial: "Ja", syllables: 2, lead: true },
  { t: "ambu", d: "अम्बु", gloss: "water", fields: ["flow"], initial: "A", syllables: 2, lead: true },
  { t: "amrita", d: "अमृत", gloss: "nectar, undying", fields: ["flow", "auspice"], initial: "A", syllables: 3, lead: true },
  { t: "rasa", d: "रस", gloss: "essence, savour", fields: ["flow", "beauty"], initial: "Ra", syllables: 2, lead: true, tail: true },
  { t: "toya", d: "तोय", gloss: "water", fields: ["flow"], initial: "To", syllables: 2, lead: true },
  { t: "nira", d: "नीर", gloss: "water", fields: ["flow"], initial: "Ni", syllables: 2, lead: true },
  { t: "megha", d: "मेघ", gloss: "cloud", fields: ["flow", "movement"], initial: "Me", syllables: 2, lead: true },
  { t: "varsha", d: "वर्ष", gloss: "rain, a year", fields: ["flow"], initial: "Va", syllables: 2, lead: true },

  // Stability
  { t: "dhruva", d: "ध्रुव", gloss: "fixed, constant", fields: ["stability", "trust"], initial: "Dha", syllables: 2, lead: true },
  { t: "sthira", d: "स्थिर", gloss: "steady", fields: ["stability"], initial: "Sa", syllables: 2, lead: true },
  { t: "mula", d: "मूल", gloss: "root, foundation", fields: ["stability"], initial: "Mu", syllables: 2, lead: true },
  { t: "nitya", d: "नित्य", gloss: "constant, eternal", fields: ["stability"], initial: "Ni", syllables: 2, lead: true },
  { t: "akshaya", d: "अक्षय", gloss: "undecaying", fields: ["stability", "wealth"], initial: "A", syllables: 3, lead: true },
  { t: "vajra", d: "वज्र", gloss: "diamond, adamant", fields: ["stability", "energy"], initial: "Va", syllables: 2, lead: true },
  { t: "adhara", d: "आधार", gloss: "support, base", fields: ["stability", "trust"], initial: "A", syllables: 3, lead: true, tail: true },
  { t: "stambha", d: "स्तम्भ", gloss: "pillar", fields: ["stability"], initial: "Sa", syllables: 2, lead: true },
  { t: "dhara", d: "धर", gloss: "holding, bearing", fields: ["stability", "trust"], initial: "Dha", syllables: 2, lead: true, tail: true },
  { t: "pratishtha", d: "प्रतिष्ठा", gloss: "firm position, standing", fields: ["stability", "order"], initial: "Pa", syllables: 3, lead: true, tail: true },

  // Craft
  { t: "shilpa", d: "शिल्प", gloss: "craft, art", fields: ["craft", "beauty"], initial: "Shi", syllables: 2, lead: true },
  { t: "kara", d: "कर", gloss: "maker, doer", fields: ["craft"], initial: "Ka", syllables: 2, tail: true },
  { t: "kriti", d: "कृति", gloss: "creation, work", fields: ["craft"], initial: "Ki", syllables: 2, lead: true, tail: true },
  { t: "yantra", d: "यन्त्र", gloss: "device, instrument", fields: ["craft"], initial: "Ya", syllables: 2, lead: true },
  { t: "kalpa", d: "कल्प", gloss: "design, formation", fields: ["craft", "order"], initial: "Ka", syllables: 2, lead: true, tail: true },
  { t: "siddhi", d: "सिद्धि", gloss: "accomplishment", fields: ["craft", "auspice"], initial: "Si", syllables: 2, lead: true, tail: true },
  { t: "udyama", d: "उद्यम", gloss: "enterprise, effort", fields: ["craft", "energy"], initial: "U", syllables: 3, lead: true },
  { t: "sadhana", d: "साधन", gloss: "means, accomplishing", fields: ["craft", "order"], initial: "Sa", syllables: 3, lead: true, tail: true },
  { t: "racana", d: "रचना", gloss: "arrangement, composition", fields: ["craft"], initial: "Ra", syllables: 3, lead: true },

  // Trust and protection
  { t: "mitra", d: "मित्र", gloss: "friend, ally", fields: ["trust"], initial: "Mi", syllables: 2, lead: true, tail: true },
  { t: "raksha", d: "रक्षा", gloss: "protection", fields: ["trust"], initial: "Ra", syllables: 2, lead: true },
  { t: "pala", d: "पाल", gloss: "protector, keeper", fields: ["trust"], initial: "Pa", syllables: 2, tail: true },
  { t: "abhaya", d: "अभय", gloss: "without fear, safety", fields: ["trust"], initial: "A", syllables: 3, lead: true },
  { t: "sharana", d: "शरण", gloss: "refuge", fields: ["trust"], initial: "Sha", syllables: 3, lead: true },
  { t: "bandhu", d: "बन्धु", gloss: "kin, ally", fields: ["trust"], initial: "Ba", syllables: 2, lead: true, tail: true },
  { t: "varma", d: "वर्म", gloss: "armour", fields: ["trust", "stability"], initial: "Va", syllables: 2, lead: true, tail: true },

  // Order and truth
  { t: "satya", d: "सत्य", gloss: "truth", fields: ["order", "trust"], initial: "Sa", syllables: 2, lead: true },
  { t: "rita", d: "ऋत", gloss: "cosmic order", fields: ["order"], initial: "Ri", syllables: 2, lead: true },
  { t: "dharma", d: "धर्म", gloss: "right order, duty", fields: ["order", "trust"], initial: "Dha", syllables: 2, lead: true },
  { t: "niti", d: "नीति", gloss: "policy, right conduct", fields: ["order"], initial: "Ni", syllables: 2, lead: true, tail: true },
  { t: "nyaya", d: "न्याय", gloss: "justice, method", fields: ["order"], initial: "Nya", syllables: 2, lead: true },
  { t: "vrata", d: "व्रत", gloss: "vow, commitment", fields: ["order", "trust"], initial: "Va", syllables: 2, lead: true },
  { t: "maya", d: "मान", gloss: "measure", fields: ["order"], initial: "Ma", syllables: 2, tail: true },

  // Auspicious beginnings
  { t: "mangala", d: "मङ्गल", gloss: "auspicious", fields: ["auspice"], initial: "Ma", syllables: 3, lead: true },
  { t: "shubha", d: "शुभ", gloss: "auspicious, good", fields: ["auspice"], initial: "Shu", syllables: 2, lead: true, tail: true },
  { t: "svasti", d: "स्वस्ति", gloss: "well-being", fields: ["auspice", "trust"], initial: "Sa", syllables: 2, lead: true },
  { t: "kalyana", d: "कल्याण", gloss: "welfare, auspicious", fields: ["auspice"], initial: "Ka", syllables: 3, lead: true },
  { t: "arambha", d: "आरम्भ", gloss: "beginning", fields: ["auspice", "movement"], initial: "A", syllables: 3, lead: true },
  { t: "vinayaka", d: "विनायक", gloss: "remover of obstacles", fields: ["auspice"], initial: "Vi", syllables: 4, lead: true },
  { t: "abhyudaya", d: "अभ्युदय", gloss: "rise, prosperity", fields: ["auspice", "wealth"], initial: "A", syllables: 4, lead: true },

  // Beauty
  { t: "kamala", d: "कमल", gloss: "lotus", fields: ["beauty", "wealth"], initial: "Ka", syllables: 3, lead: true },
  { t: "padma", d: "पद्म", gloss: "lotus", fields: ["beauty", "wealth"], initial: "Pa", syllables: 2, lead: true },
  { t: "ruchi", d: "रुचि", gloss: "taste, lustre", fields: ["beauty"], initial: "Ru", syllables: 2, lead: true, tail: true },
  { t: "lalita", d: "ललित", gloss: "graceful", fields: ["beauty"], initial: "La", syllables: 3, lead: true },
  { t: "sundara", d: "सुन्दर", gloss: "beautiful", fields: ["beauty"], initial: "Su", syllables: 3, lead: true },
  { t: "hari", d: "हरि", gloss: "tawny, Vishnu", fields: ["beauty", "auspice"], initial: "Ha", syllables: 2, lead: true },
  { t: "gaura", d: "गौर", gloss: "fair, radiant", fields: ["beauty", "light"], initial: "Go", syllables: 2, lead: true },

  // Coverage across the pada table. A nakshatra whose four syllables all fall
  // outside the lexicon can only be served by relaxing the syllable rule, and
  // the derivation would then have to report that rule as unmet — so breadth of
  // opening syllable matters here as much as depth of meaning.
  { t: "gita", d: "गीत", gloss: "song, sung", fields: ["beauty", "light"], initial: "Gi", syllables: 2, lead: true },
  { t: "guna", d: "गुण", gloss: "quality, virtue", fields: ["order", "beauty"], initial: "Gu", syllables: 2, lead: true, tail: true },
  { t: "geya", d: "गेय", gloss: "worth singing", fields: ["beauty"], initial: "Ge", syllables: 2, lead: true },
  { t: "gopa", d: "गोप", gloss: "keeper, guardian", fields: ["trust"], initial: "Go", syllables: 2, lead: true, tail: true },
  { t: "gotra", d: "गोत्र", gloss: "lineage", fields: ["stability", "trust"], initial: "Go", syllables: 2, lead: true },
  { t: "jita", d: "जित", gloss: "won, mastered", fields: ["energy", "order"], initial: "Ji", syllables: 2, lead: true, tail: true },
  { t: "jiva", d: "जीव", gloss: "life, the living", fields: ["flow", "energy"], initial: "Ji", syllables: 2, lead: true },
  { t: "bhoga", d: "भोग", gloss: "enjoyment, use", fields: ["wealth", "beauty"], initial: "Bho", syllables: 2, lead: true },
  { t: "dana", d: "दान", gloss: "giving", fields: ["wealth", "trust"], initial: "Da", syllables: 2, lead: true },
  { t: "daksha", d: "दक्ष", gloss: "able, skilful", fields: ["craft", "order"], initial: "Da", syllables: 2, lead: true },
  { t: "divya", d: "दिव्य", gloss: "divine, brilliant", fields: ["light", "auspice"], initial: "Di", syllables: 2, lead: true },
  { t: "deva", d: "देव", gloss: "divine, a god", fields: ["auspice", "light"], initial: "De", syllables: 2, lead: true, tail: true },
  { t: "tunga", d: "तुङ्ग", gloss: "lofty, elevated", fields: ["stability", "light"], initial: "Tu", syllables: 2, lead: true },
  { t: "tulya", d: "तुल्य", gloss: "equal, matched", fields: ["order"], initial: "Tu", syllables: 2, lead: true },
  { t: "naya", d: "नय", gloss: "leading, prudence", fields: ["order", "movement"], initial: "Na", syllables: 2, lead: true, tail: true },
  { t: "punya", d: "पुण्य", gloss: "merit, auspicious", fields: ["auspice", "trust"], initial: "Pu", syllables: 2, lead: true },
  { t: "pushti", d: "पुष्टि", gloss: "nourishment, thriving", fields: ["wealth", "flow"], initial: "Pu", syllables: 2, lead: true, tail: true },
  { t: "moda", d: "मोद", gloss: "gladness", fields: ["beauty", "auspice"], initial: "Mo", syllables: 2, lead: true, tail: true },
  { t: "yukti", d: "युक्ति", gloss: "reasoning, contrivance", fields: ["knowledge", "craft"], initial: "Yu", syllables: 2, lead: true, tail: true },
  { t: "yoga", d: "योग", gloss: "joining, discipline", fields: ["order", "craft"], initial: "Yo", syllables: 2, lead: true, tail: true },
  { t: "rochana", d: "रोचन", gloss: "illuminating", fields: ["light"], initial: "Ro", syllables: 3, lead: true },
  { t: "lipi", d: "लिपि", gloss: "writing, script", fields: ["knowledge", "craft"], initial: "Li", syllables: 2, lead: true },
  { t: "hita", d: "हित", gloss: "benefit, good", fields: ["trust", "order"], initial: "Hi", syllables: 2, lead: true, tail: true },
  { t: "ishta", d: "इष्ट", gloss: "desired, cherished", fields: ["auspice", "beauty"], initial: "I", syllables: 2, lead: true },
  { t: "eka", d: "एक", gloss: "one, singular", fields: ["stability", "order"], initial: "E", syllables: 2, lead: true },
  { t: "chitta", d: "चित्त", gloss: "mind, attention", fields: ["knowledge"], initial: "Chi", syllables: 2, lead: true },
  { t: "kushala", d: "कुशल", gloss: "skilful, well", fields: ["craft", "auspice"], initial: "Ku", syllables: 3, lead: true },
  { t: "ketana", d: "केतन", gloss: "banner, standard", fields: ["light", "stability"], initial: "Ke", syllables: 3, lead: true },
  { t: "sukha", d: "सुख", gloss: "ease, wellbeing", fields: ["auspice", "beauty"], initial: "Su", syllables: 2, lead: true, tail: true },
  { t: "vasati", d: "वसति", gloss: "dwelling, abode", fields: ["stability", "trust"], initial: "Va", syllables: 3, lead: true },
  { t: "bhadra", d: "भद्र", gloss: "auspicious, fortunate", fields: ["auspice", "trust"], initial: "Bha", syllables: 2, lead: true, tail: true },
  { t: "nidesha", d: "निदेश", gloss: "direction, instruction", fields: ["order", "knowledge"], initial: "Ni", syllables: 3, lead: true },

  // Agentive tails, per Paraskara I.17.2's preference for verbal forms
  { t: "da", d: "द", gloss: "giver", fields: ["trust", "wealth"], initial: "Da", syllables: 1, tail: true },
  { t: "vardhana", d: "वर्धन", gloss: "increasing", fields: ["wealth", "movement"], initial: "Va", syllables: 3, tail: true },
  { t: "sena", d: "सेन", gloss: "host, marshal", fields: ["order", "energy"], initial: "Se", syllables: 2, tail: true },
  { t: "loka", d: "लोक", gloss: "world, people", fields: ["movement", "light"], initial: "Lo", syllables: 2, lead: true, tail: true },
  { t: "vana", d: "वन", gloss: "grove, abundance", fields: ["flow", "beauty"], initial: "Va", syllables: 2, tail: true },
];

/** Syllables that can open a name and are voiced (ghoshavat), per Ashvalayana I.15.4. */
export const VOICED_INITIALS = /^(a|i|u|e|o|ga|gi|gu|ge|go|gha|ja|ji|jha|da|di|du|de|do|dha|dhaa|ba|bha|bhi|bhu|bhe|bho|ma|mi|mu|me|mo|na|ni|nu|ne|no|nga|nya|ya|yi|yu|ye|yo|ra|ri|ru|re|ro|la|li|lu|le|lo|va|vi|vu|ve|vo|ha|hi|hu|he|ho)$/i;

export const PROVENANCE_OF_RULE: Record<string, Provenance> = {
  syllable: "traditional",
  count: "scriptural",
  voiced: "scriptural",
  semivowel: "scriptural",
  ending: "scriptural",
  element: "ours",
  direction: "modern",
  numerology: "modern",
  harmony: "modern",
  deity: "traditional",
};
