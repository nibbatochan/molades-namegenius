import type { AvailState } from "./types";

/** A name checked in this session. Session-only on purpose: no account, no server copy. */
export type SessionCheck = { domain: string; state: AvailState };

const KEY = "ng-checks";
const LIMIT = 8;

export function loadChecks(): SessionCheck[] {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SessionCheck[];
    return Array.isArray(parsed) ? parsed.slice(0, LIMIT) : [];
  } catch {
    return [];
  }
}

export function saveChecks(checks: SessionCheck[]) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(checks.slice(0, LIMIT)));
  } catch {
    // A blocked storage write costs the strip, never the page.
  }
}
