import { subjectFrom, take } from "@/lib/ratelimit";
import { safeFetchHtml } from "@/lib/safe-fetch";
import { suggestKeywords } from "@/lib/text";

export const runtime = "nodejs";

/** Reads a public page and proposes a description and keywords. Everything it
 *  returns lands in the form as visibly prefilled, editable values. */
export async function POST(req: Request) {
  const verdict = take(subjectFrom(req), "derive", 12, 60_000);
  if (!verdict.allowed) {
    return Response.json({ error: "rate-limited", resetAt: verdict.resetAt }, { status: 429 });
  }

  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  const fetched = await safeFetchHtml(body.url ?? "");
  if (!fetched.ok) return Response.json({ error: fetched.reason }, { status: 422 });

  const extracted = extract(fetched.html);
  const description = extracted.description.slice(0, 1000);

  if (!description && !extracted.title) {
    return Response.json({ error: "not-html" }, { status: 422 });
  }

  const keywordSource = [extracted.title, description, extracted.headings.join(" ")].join(" ");
  const keywords = extracted.metaKeywords.length
    ? extracted.metaKeywords.slice(0, 6)
    : suggestKeywords(keywordSource, [], 6);

  return Response.json({
    url: fetched.url,
    title: extracted.title,
    description,
    keywords,
  });
}

function decode(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function meta(html: string, patterns: RegExp[]): string {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decode(match[1]);
  }
  return "";
}

function extract(html: string) {
  const head = html.slice(0, 200_000);

  const title = meta(head, [
    /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
    /<title[^>]*>([\s\S]{1,200}?)<\/title>/i,
  ]);

  const metaDescription = meta(head, [
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
  ]);

  const metaKeywords = meta(head, [/<meta[^>]+name=["']keywords["'][^>]+content=["']([^"']+)["']/i])
    .split(",")
    .map((k) => k.trim().toLowerCase())
    .filter((k) => k.length >= 3 && k.length <= 24);

  const headings = [...html.matchAll(/<h[12][^>]*>([\s\S]{1,180}?)<\/h[12]>/gi)]
    .map((m) => decode(m[1].replace(/<[^>]+>/g, " ")))
    .filter(Boolean)
    .slice(0, 4);

  const paragraphs = [...html.matchAll(/<p[^>]*>([\s\S]{40,600}?)<\/p>/gi)]
    .map((m) => decode(m[1].replace(/<[^>]+>/g, " ")))
    .filter((p) => p.length >= 60)
    .slice(0, 3);

  const description = [metaDescription, ...headings.slice(0, 1), ...paragraphs]
    .filter(Boolean)
    .join(" ")
    .slice(0, 1000);

  return { title, description, metaKeywords, headings };
}
