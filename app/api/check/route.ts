import { checkDomain, normalizeName } from "@/lib/domain";
import { subjectFrom, take } from "@/lib/ratelimit";
import { DEFAULT_TLD_ID, isKnownTld } from "@/lib/tlds";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const verdict = take(subjectFrom(req), "check", 120, 60_000);
  if (!verdict.allowed) {
    return Response.json({ error: "rate-limited", resetAt: verdict.resetAt }, { status: 429 });
  }

  let body: { name?: string; tld?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  // Only endings the register actually covers, so a hand-crafted request cannot
  // aim a lookup at an arbitrary suffix.
  const tld = isKnownTld(body.tld) ? body.tld : DEFAULT_TLD_ID;
  const normalized = normalizeName(body.name ?? "", tld);

  if (normalized.error) {
    return Response.json({ normalized, result: null });
  }

  const result = await checkDomain(normalized.domain);
  return Response.json({ normalized, result });
}
