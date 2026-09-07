import { lookup } from "node:dns/promises";
import net from "node:net";

/**
 * Fetching a user-supplied URL from our own server is an SSRF hole unless every
 * hop is validated. Rules: public HTTP(S) only, no private or loopback targets,
 * redirects capped and re-validated, body and time bounded.
 */

const MAX_REDIRECTS = 3;
const MAX_BYTES = 512 * 1024;
const TIMEOUT_MS = 6000;

export type SafeFetchOk = { ok: true; url: string; html: string };
export type SafeFetchErr = {
  ok: false;
  reason: "bad-url" | "blocked-host" | "unreachable" | "not-html" | "too-many-redirects";
};
export type SafeFetchResult = SafeFetchOk | SafeFetchErr;

function isBlockedIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true; // link-local, includes cloud metadata
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 192 && b === 0) return true;
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
    if (a === 198 && (b === 18 || b === 19)) return true;
    if (a >= 224) return true; // multicast and reserved
    return false;
  }
  if (net.isIPv6(ip)) {
    const v = ip.toLowerCase();
    if (v === "::" || v === "::1") return true;
    if (v.startsWith("fe80") || v.startsWith("fc") || v.startsWith("fd")) return true;
    const mapped = v.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isBlockedIp(mapped[1]);
    return false;
  }
  return true;
}

async function assertPublicHost(hostname: string): Promise<boolean> {
  const host = hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) return false;
  if (net.isIP(host)) return !isBlockedIp(host);
  try {
    const addrs = await lookup(host, { all: true, verbatim: true });
    if (addrs.length === 0) return false;
    return addrs.every((a) => !isBlockedIp(a.address));
  } catch {
    return false;
  }
}

function parse(raw: string): URL | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url;
  } catch {
    return null;
  }
}

export async function safeFetchHtml(rawUrl: string): Promise<SafeFetchResult> {
  let url = parse(rawUrl);
  if (!url) return { ok: false, reason: "bad-url" };

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (!(await assertPublicHost(url.hostname))) return { ok: false, reason: "blocked-host" };

    let res: Response;
    try {
      res = await fetch(url, {
        redirect: "manual",
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: {
          accept: "text/html,application/xhtml+xml",
          "user-agent": "NameGeniusBot/0.1 (+reads page text to prefill a form)",
        },
      });
    } catch {
      return { ok: false, reason: "unreachable" };
    }

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) return { ok: false, reason: "unreachable" };
      const next = parse(new URL(location, url).toString());
      if (!next) return { ok: false, reason: "bad-url" };
      url = next;
      continue;
    }

    if (!res.ok) return { ok: false, reason: "unreachable" };

    const type = res.headers.get("content-type") ?? "";
    if (!/text\/html|application\/xhtml/i.test(type)) return { ok: false, reason: "not-html" };

    const html = await readCapped(res);
    return { ok: true, url: url.toString(), html };
  }

  return { ok: false, reason: "too-many-redirects" };
}

async function readCapped(res: Response): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder("utf-8");
  let out = "";
  let bytes = 0;
  while (bytes < MAX_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    out += decoder.decode(value, { stream: true });
  }
  await reader.cancel().catch(() => {});
  return out;
}
