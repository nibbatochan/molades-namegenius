import { draftCandidates, seedTerms, toCandidate } from "@/lib/candidates";
import { checkDomain, mapLimit, normalizeName } from "@/lib/domain";
import { subjectFrom, take } from "@/lib/ratelimit";
import { DEFAULT_TLD_ID, isKnownTld } from "@/lib/tlds";
import { EMPTY_DISCOVERY, type RunInput } from "@/lib/types";

export const runtime = "nodejs";

const TARGET_RESULTS = 20;
const OVERDRAFT = 5; // Generate 5x what we intend to show; the registry culls the rest.
const CONCURRENCY = 8;

export async function POST(req: Request) {
  const verdict = take(subjectFrom(req), "generate", 8, 60_000);
  if (!verdict.allowed) {
    return Response.json({ error: "rate-limited", resetAt: verdict.resetAt }, { status: 429 });
  }

  let raw: Partial<RunInput>;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  const input: RunInput = {
    name: (raw.name ?? "").slice(0, 120),
    description: (raw.description ?? "").slice(0, 1000),
    keywords: (raw.keywords ?? []).slice(0, 10),
    competitors: (raw.competitors ?? []).slice(0, 10),
    discovery: raw.discovery ?? EMPTY_DISCOVERY,
    tld: isKnownTld(raw.tld) ? raw.tld : DEFAULT_TLD_ID,
  };

  const drafts = draftCandidates(input, TARGET_RESULTS * OVERDRAFT);
  const terms = seedTerms(input);
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: unknown) =>
        controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));

      send({ type: "meta", drafted: drafts.length, target: TARGET_RESULTS, tld: input.tld });

      let shown = 0;
      let checked = 0;
      let closed = false;

      await mapLimit(drafts, CONCURRENCY, async (draft) => {
        if (closed || shown >= TARGET_RESULTS) return;

        const domain = `${draft.label}.${input.tld}`;
        const result = await checkDomain(domain);
        checked += 1;

        // Only verified-available names reach the user. Taken and unverified are
        // dropped silently, which is the reason for the overdraft above.
        if (result.state !== "available" || shown >= TARGET_RESULTS) return;

        shown += 1;
        send({
          type: "candidate",
          candidate: toCandidate(draft, domain, result.state, result.checkedAt, terms),
        });
      });

      send({ type: "done", shown, checked, drafted: drafts.length });
      closed = true;
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export async function GET() {
  const seed = normalizeName("example");
  return Response.json({ ok: true, seed: seed.domain });
}
