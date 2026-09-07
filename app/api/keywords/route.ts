import { suggestKeywords } from "@/lib/text";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { description?: string; existing?: string[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  const description = (body.description ?? "").slice(0, 1000);
  if (description.trim().length < 24) return Response.json({ keywords: [] });

  return Response.json({ keywords: suggestKeywords(description, body.existing ?? [], 6) });
}
