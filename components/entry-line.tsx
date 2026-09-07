"use client";

import { useEffect, useRef, useState } from "react";
import { normalizeName } from "@/lib/domain";
import { getTld } from "@/lib/tlds";
import type { CheckResult } from "@/lib/types";
import { ExtensionTabs } from "./extension-tabs";
import { Action, Clerk, Folio, Impression, Pending, Rule } from "./ledger";

const REASON_COPY: Record<string, string> = {
  "not-registered": "The registry has no record of it.",
  registered: "The registry holds a record for it.",
  reserved: "Held back by the registry as premium or reserved.",
  "no-rdap-server": "This registry does not answer machine queries, so nobody can verify it from here.",
  "rate-limited": "The registry throttled us. Worth another press in a moment.",
  timeout: "The registry did not answer in time.",
  "bad-response": "The registry answered with something we could not read.",
};

/**
 * The entry line: one ruled ledger row where a name is typed, with the folio
 * number struck in at the left margin, the extension tabs cut into the rule
 * beneath, and the stamp cartouche at the right end taking the impression.
 *
 * The check is debounced and every superseded request is aborted, so the
 * impression that lands always belongs to what is currently typed.
 */
export function EntryLine({
  value,
  onChange,
  tld,
  onTldChange,
  onResult,
  onFindAlternatives,
  folio = 41,
}: {
  value: string;
  onChange: (value: string) => void;
  tld: string;
  onTldChange: (tld: string) => void;
  onResult?: (result: CheckResult) => void;
  onFindAlternatives?: () => void;
  folio?: number;
}) {
  const [result, setResult] = useState<CheckResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const normalized = normalizeName(value, tld);
  const tooShort = normalized.error === "too-short";
  const tooLong = normalized.error === "too-long";

  useEffect(() => {
    setResult(null);
    setCopied(false);

    if (!normalized.label || normalized.error) {
      setChecking(false);
      abortRef.current?.abort();
      return;
    }

    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setChecking(true);

      try {
        const res = await fetch("/api/check", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name: normalized.label, tld }),
          signal: controller.signal,
        });
        const data = (await res.json()) as { result: CheckResult | null };
        if (controller.signal.aborted) return;
        setResult(data.result);
        if (data.result) onResult?.(data.result);
      } catch {
        // An aborted request is the expected case while someone is still typing.
      } finally {
        if (!controller.signal.aborted) setChecking(false);
      }
    }, 450);

    return () => clearTimeout(timer);
    // The label and ending are what a check depends on; the raw string is not.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalized.label, normalized.error, tld]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(normalized.domain);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <Rule strong />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 py-6 md:flex-nowrap">
        <Folio n={folio} className="shrink-0" />

        <div className="min-w-0 flex-1">
          <label htmlFor="entry" className="sr-only">
            The name you want to check
          </label>
          <div className="flex items-baseline">
            <input
              id="entry"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="arkavista"
              autoComplete="off"
              spellCheck={false}
              aria-describedby="entry-status"
              className="font-display w-full min-w-0 bg-transparent text-[clamp(1.75rem,4vw,2.75rem)] leading-none font-semibold tracking-[-0.03em] placeholder:text-ink-3"
            />
            {normalized.label ? (
              <span className="font-display shrink-0 text-[clamp(1.1rem,2vw,1.5rem)] leading-none tracking-[-0.02em] text-ink-3">
                {`.${tld}`}
              </span>
            ) : null}
          </div>
        </div>

        <div className="shrink-0" id="entry-status" role="status" aria-live="polite">
          {checking ? (
            <Pending />
          ) : result ? (
            <Impression state={result.state} animate />
          ) : (
            <span className="clerk text-ink-3">Awaiting a name</span>
          )}
        </div>
      </div>

      {/* The tabs are cut into this rule, so the rule closes the row above them. */}
      <div className="ruled pt-5">
        <ExtensionTabs value={tld} onChange={onTldChange} id="entry-extension" />
      </div>

      <div className="min-h-[92px] pt-6">
        {normalized.changed && normalized.label && !normalized.error ? (
          <p className="text-[13.5px] leading-relaxed text-ink-2">
            {`Entered into the register as `}
            <span className="folio text-ink">{normalized.domain}</span>
            {`. Capitals, spaces and punctuation cannot appear in a domain.`}
          </p>
        ) : null}

        {tooShort ? (
          <p className="text-[13.5px] text-stamp">
            A domain label needs at least two characters.
          </p>
        ) : null}

        {tooLong ? (
          <p className="text-[13.5px] text-stamp">
            A domain label stops at 63 characters. This one is longer.
          </p>
        ) : null}

        {result ? (
          <div className="mt-1 flex flex-wrap items-center gap-x-8 gap-y-4">
            <p className="max-w-[54ch] text-[14.5px] leading-relaxed text-ink-2">
              {REASON_COPY[result.reason] ?? "The registry gave an answer we could not classify."}
              {result.state === "unverified" && !result.retryable
                ? ` ${getTld(tld).label} cannot be verified from here, so we will not claim it either way.`
                : ""}
            </p>

            <div className="flex flex-wrap items-center gap-2.5">
              {result.state === "available" ? (
                <>
                  <Action onClick={copy}>{copied ? "Copied" : "Copy the name"}</Action>
                  <span className="max-w-[38ch] text-[12.5px] leading-relaxed text-ink-2">
                    Registration happens at a registrar. We take no payment and
                    never register a name we suggested.
                  </span>
                </>
              ) : null}

              {result.state === "taken" || result.state === "premium" ? (
                <Action variant="ruled" onClick={onFindAlternatives}>
                  Find names that are free
                </Action>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
