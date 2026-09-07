import { createHash } from "node:crypto";

/**
 * Per-subject limiting before accounts exist. In-memory is correct for a single
 * instance only; Phase 3 moves the counter to the database alongside identity.
 */

const buckets = new Map<string, { count: number; resetAt: number }>();

export function subjectFrom(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || req.headers.get("x-real-ip") || "local";
  return createHash("sha256").update(ip).digest("hex").slice(0, 24);
}

export type LimitVerdict = { allowed: boolean; remaining: number; resetAt: number };

export function take(subject: string, scope: string, max: number, windowMs: number): LimitVerdict {
  const key = `${scope}:${subject}`;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: max - 1, resetAt };
  }

  bucket.count += 1;
  return {
    allowed: bucket.count <= max,
    remaining: Math.max(0, max - bucket.count),
    resetAt: bucket.resetAt,
  };
}
