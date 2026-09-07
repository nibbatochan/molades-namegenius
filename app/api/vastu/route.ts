import { checkDomain, mapLimit } from "@/lib/domain";
import { subjectFrom, take } from "@/lib/ratelimit";
import { DEFAULT_TLD_ID, isKnownTld } from "@/lib/tlds";
import { deriveNames, EMPTY_VASTU_INPUT, type VastuInput } from "@/lib/vastu";

export const runtime = "nodejs";

const TARGET = 18;
const CONCURRENCY = 6;

export async function POST(req: Request) {
  const verdict = take(subjectFrom(req), "vastu", 6, 60_000);
  if (!verdict.allowed) {
    return Response.json({ error: "rate-limited", resetAt: verdict.resetAt }, { status: 429 });
  }

  let raw: { input?: Partial<VastuInput>; tld?: string };
  try {
    raw = await req.json();
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  const tld = isKnownTld(raw.tld) ? raw.tld : DEFAULT_TLD_ID;
  const input: VastuInput = {
    ...EMPTY_VASTU_INPUT,
    ...raw.input,
    founderName: (raw.input?.founderName ?? "").slice(0, 80),
    existingName: (raw.input?.existingName ?? "").slice(0, 80),
    avoid: (raw.input?.avoid ?? "").slice(0, 200),
  };

  const { context, names } = deriveNames(input, TARGET);
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: unknown) =>
        controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));

      send({ type: "meta", derived: names.length, context, tld });

      let available = 0;
      let registered = 0;
      let unverified = 0;

      // Unlike ordinary generation, a derived name is the deliverable, so a
      // registered one is reported rather than dropped — the reader may want it
      // on another ending. The state is always the registry's answer, never a
      // rounded-up guess.
      await mapLimit(names, CONCURRENCY, async (name, index) => {
        const domain = `${name.label}.${tld}`;
        const result = await checkDomain(domain);

        if (result.state === "available") available += 1;
        else if (result.state === "taken") registered += 1;
        else unverified += 1;

        // The derived order spreads the opening word around, and these land in
        // whatever order the registries answer, so the rank travels with them.
        send({
          type: "name",
          index,
          name,
          domain,
          state: result.state,
          checkedAt: result.checkedAt,
        });
      });

      send({
        type: "done",
        derived: names.length,
        available,
        registered,
        unverified,
      });
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
