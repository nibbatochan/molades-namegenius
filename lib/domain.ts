import { DEFAULT_TLD_ID, rdapZoneCandidates, STRIPPABLE_SUFFIXES } from "./tlds";
import type { AvailState, CheckReason, CheckResult } from "./types";

export const DEFAULT_TLD = DEFAULT_TLD_ID;

export type Normalized = {
  /** The domain label, e.g. "acmecoffeeco". Empty when the input yields nothing usable. */
  label: string;
  /** The full domain we will check, e.g. "acmecoffeeco.com". */
  domain: string;
  /** True when we altered what the user typed, so the UI can show it back to them. */
  changed: boolean;
  error?: "too-short" | "too-long" | "empty";
};

/**
 * Turns anything a person might type into a domain label. Pasting a full URL,
 * capitals, spaces, accents and punctuation all normalize rather than fail, and
 * the caller shows the result back so nothing changes silently.
 */
export function normalizeName(raw: string, tld = DEFAULT_TLD): Normalized {
  const input = (raw ?? "").trim();
  if (!input) return { label: "", domain: "", changed: false, error: "empty" };

  let work = input.toLowerCase();
  work = work.replace(/^[a-z][a-z0-9+.-]*:\/\//, "");
  work = work.replace(/^www\./, "");
  work = work.split(/[/?#]/)[0];
  // Drop a trailing suffix so "acme.com" and "acme" behave the same. Longest
  // match first, or "acme.co.in" would keep "co" and check "acmeco.in".
  const suffix = STRIPPABLE_SUFFIXES.find((s) => work.endsWith(`.${s}`));
  if (suffix) work = work.slice(0, -(suffix.length + 1));
  else work = work.replace(/\.[a-z]{2,24}$/, "");

  work = work.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  work = work.replace(/&/g, "and");
  work = work.replace(/['’`"]/g, "");
  work = work.replace(/[\s_.]+/g, "");
  work = work.replace(/[^a-z0-9-]/g, "");
  work = work.replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");

  const label = work;
  const changed = label !== input.toLowerCase();

  if (!label) return { label: "", domain: "", changed, error: "empty" };
  if (label.length < 2) return { label, domain: `${label}.${tld}`, changed, error: "too-short" };
  if (label.length > 63) return { label, domain: `${label}.${tld}`, changed, error: "too-long" };

  return { label, domain: `${label}.${tld}`, changed };
}

// --- RDAP -------------------------------------------------------------------
// RDAP is the primary source: free, JSON, and authoritative for gTLDs. The
// tradeoff is that we own bootstrap discovery, per-registry rate limits and
// backoff. Everything here sits behind checkDomain() so a commercial provider
// can be dropped in as a fallback without touching callers.

const BOOTSTRAP_URL = "https://data.iana.org/rdap/dns.json";
const BOOTSTRAP_TTL_MS = 12 * 60 * 60 * 1000;

let bootstrap: { map: Map<string, string>; fetchedAt: number } | null = null;
let bootstrapInFlight: Promise<Map<string, string>> | null = null;

type BootstrapDoc = { services?: [string[], string[]][] };

async function loadBootstrap(): Promise<Map<string, string>> {
  if (bootstrap && Date.now() - bootstrap.fetchedAt < BOOTSTRAP_TTL_MS) return bootstrap.map;
  if (bootstrapInFlight) return bootstrapInFlight;

  bootstrapInFlight = (async () => {
    const map = new Map<string, string>();
    try {
      const res = await fetch(BOOTSTRAP_URL, {
        signal: AbortSignal.timeout(6000),
        headers: { accept: "application/json" },
      });
      if (res.ok) {
        const doc = (await res.json()) as BootstrapDoc;
        for (const [tlds, servers] of doc.services ?? []) {
          const server = servers.find((s) => s.startsWith("https://")) ?? servers[0];
          if (!server) continue;
          for (const tld of tlds) map.set(tld.toLowerCase(), server.replace(/\/+$/, ""));
        }
      }
    } catch {
      // Leave the map empty; every lookup then reports unverified rather than guessing.
    }
    if (map.size > 0) bootstrap = { map, fetchedAt: Date.now() };
    bootstrapInFlight = null;
    return map;
  })();

  return bootstrapInFlight;
}

const cache = new Map<string, { result: CheckResult; expiresAt: number }>();

/**
 * Available results expire fast because that is the claim that can hurt a user.
 * Taken results are safe to hold. Unverified is never cached.
 */
function ttlFor(state: AvailState): number {
  if (state === "available") return 2 * 60 * 1000;
  if (state === "premium") return 10 * 60 * 1000;
  if (state === "taken") return 60 * 60 * 1000;
  return 0;
}

function result(
  domain: string,
  state: AvailState,
  reason: CheckReason,
  retryable: boolean,
): CheckResult {
  return { domain, state, reason, source: "rdap", checkedAt: new Date().toISOString(), retryable };
}

const RESERVED_HINTS = ["reserved", "premium", "blocked", "excluded"];

export async function checkDomain(domain: string): Promise<CheckResult> {
  const key = domain.toLowerCase();
  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.result;

  const map = await loadBootstrap();
  // Longest zone first: `co.in` is not in the bootstrap, so a second-level
  // domain has to fall back to the `in` registry that actually serves it.
  const base = rdapZoneCandidates(key)
    .map((zone) => map.get(zone))
    .find((server): server is string => Boolean(server));

  let out: CheckResult;

  if (!base) {
    // Structural: this registry does not speak RDAP, so a retry fails identically.
    out = result(key, "unverified", "no-rdap-server", false);
  } else {
    out = await queryRdap(base, key);
    if (out.reason === "rate-limited" || out.reason === "timeout") {
      await sleep(250 + Math.random() * 350);
      out = await queryRdap(base, key);
    }
  }

  const ttl = ttlFor(out.state);
  if (ttl > 0) cache.set(key, { result: out, expiresAt: Date.now() + ttl });
  return out;
}

async function queryRdap(base: string, domain: string): Promise<CheckResult> {
  try {
    const res = await fetch(`${base}/domain/${encodeURIComponent(domain)}`, {
      signal: AbortSignal.timeout(5000),
      headers: { accept: "application/rdap+json, application/json" },
      redirect: "follow",
    });

    if (res.status === 404) return result(domain, "available", "not-registered", true);
    if (res.status === 429) return result(domain, "unverified", "rate-limited", true);

    if (res.ok) {
      const doc = (await res.json()) as { status?: string[]; ldhName?: string };
      const statuses = (doc.status ?? []).map((s) => s.toLowerCase());
      const reserved = statuses.some((s) => RESERVED_HINTS.some((h) => s.includes(h)));
      if (reserved) return result(domain, "premium", "reserved", true);
      return result(domain, "taken", "registered", true);
    }

    return result(domain, "unverified", "bad-response", true);
  } catch (err) {
    const timeout = err instanceof Error && /abort|timeout/i.test(err.name + err.message);
    return result(domain, "unverified", timeout ? "timeout" : "bad-response", true);
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Bounded-concurrency map, so a batch verify does not stampede one registry. */
export async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      out[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return out;
}
