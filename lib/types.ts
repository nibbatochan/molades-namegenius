/** The four availability states the UI must be able to tell apart, plus premium. */
export type AvailState = "available" | "taken" | "unverified" | "premium";

/**
 * Where a rule comes from. Carried on every rule in a Vastu derivation, so the
 * product can never state its own reasoning in scripture's voice.
 */
export type Provenance = "scriptural" | "traditional" | "modern" | "ours";

export type CheckReason =
  | "not-registered"
  | "registered"
  | "reserved"
  | "no-rdap-server"
  | "rate-limited"
  | "timeout"
  | "bad-response";

export type CheckResult = {
  domain: string;
  state: AvailState;
  reason: CheckReason;
  source: "rdap";
  checkedAt: string;
  /** Present when the registry structurally cannot answer, so no retry is offered. */
  retryable: boolean;
};

export type Candidate = {
  name: string;
  domain: string;
  style: "variant" | "compound" | "blend" | "metaphor" | "affix";
  group: "close" | "fresh";
  rationale: string;
  brandScore: number;
  state: AvailState;
  checkedAt: string;
};

export type RunInput = {
  name: string;
  description: string;
  keywords: string[];
  competitors: string[];
  discovery: DiscoveryAnswers;
  /** The extension being targeted, without a leading dot, e.g. "co.in". */
  tld: string;
};

export type DiscoveryAnswers = {
  tone?: "playful" | "neutral" | "serious";
  style?: "invented" | "real-word" | "compound" | "metaphor";
  length?: "short" | "any";
  avoid?: string;
};

export const EMPTY_DISCOVERY: DiscoveryAnswers = {};
