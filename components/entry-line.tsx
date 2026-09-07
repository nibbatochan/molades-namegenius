"use client";

import { useEffect, useRef, useState } from "react";
import { normalizeName } from "@/lib/domain";
import { getTld } from "@/lib/tlds";
import type { CheckResult } from "@/lib/types";
import { ExtensionTabs } from "./extension-tabs";
import { GlobeIcon, SparkIcon } from "./icons";
import { Button, CheckingPill, SectionLabel, StatusPill } from "./ui";

const REASON_COPY: Record<string, string> = {
  "not-registered": "The registry has no record of it.",
  registered: "The registry holds a record for it.",
  reserved: "Held back by the registry as premium or reserved.",
  "no-rdap-server":
    "This registry does not answer machine queries, so nobody can verify it from here.",
  "rate-limited": "The registry throttled us. Worth another try in a moment.",
  timeout: "The registry did not answer in time.",
  "bad-response": "The registry answered with something we could not read.",
};

/**
 * The name field. The check is debounced and every superseded request is
 * aborted, so the verdict shown always belongs to what is currently typed.
 */
export function EntryLine({
  value,
  onChange,
  tld,
  onTldChange,
  onResult,
  onFindAlternatives,
  compact = false,
}: {
  value: string;
  onChange: (value: string) => void;
  tld: string;
  onTldChange: (tld: string) => void;
  onResult?: (result: CheckResult) => void;
  onFindAlternatives?: () => void;
  compact?: boolean;
}) {
  const [result, setResult] = useState<CheckResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [focused, setFocused] = useState(false);
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
    <div className="space-y-4">
      <SectionLabel icon={<GlobeIcon />}>The name you want</SectionLabel>

      <div className={`field-surface flex items-center gap-3 px-4 ${focused ? "field-focus" : ""} ${compact ? "py-2.5" : "py-3"}`}>
        <label htmlFor="entry" className="sr-only">
          The name you want to check
        </label>
        <input
          id="entry"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="arkavista"
          autoComplete="off"
          spellCheck={false}
          aria-describedby="entry-status"
          className={`min-w-0 flex-1 bg-transparent font-semibold tracking-[-0.02em] ${
            compact ? "text-[18px]" : "text-[24px]"
          }`}
        />
        {normalized.label ? (
          <span
            className={`shrink-0 font-semibold tracking-[-0.01em] text-ink-3 ${
              compact ? "text-[15px]" : "text-[19px]"
            }`}
          >
            {`.${tld}`}
          </span>
        ) : null}

        <span id="entry-status" role="status" aria-live="polite">
          {checking ? (
            <CheckingPill compact={compact} />
          ) : result ? (
            <StatusPill state={result.state} compact={compact} animate />
          ) : null}
        </span>
      </div>

      <ExtensionTabs value={tld} onChange={onTldChange} id="entry-extension" />

      <div className="space-y-3">
        {normalized.changed && normalized.label && !normalized.error ? (
          <p className="text-[13px] leading-relaxed text-ink-2">
            {"Checking "}
            <span className="font-semibold text-ink">{normalized.domain}</span>
            {". Capitals, spaces and punctuation cannot appear in a domain."}
          </p>
        ) : null}

        {tooShort ? (
          <p className="text-[13px] text-warn">
            A domain label needs at least two characters.
          </p>
        ) : null}

        {tooLong ? (
          <p className="text-[13px] text-warn">
            A domain label stops at 63 characters. This one is longer.
          </p>
        ) : null}

        {result ? (
          <div className="space-y-3.5">
            <p className="max-w-[62ch] text-[13.5px] leading-relaxed text-ink-2">
              {REASON_COPY[result.reason] ??
                "The registry gave an answer we could not classify."}
              {result.state === "unverified" && !result.retryable
                ? ` ${getTld(tld).label} cannot be verified from here, so we will not claim it either way.`
                : ""}
            </p>

            {result.state === "available" ? (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
                <Button size="sm" onClick={copy}>
                  {copied ? "Copied" : "Copy the name"}
                </Button>
                <span className="max-w-[46ch] text-[12.5px] leading-relaxed text-ink-3">
                  Registration happens at a registrar. We take no payment and
                  never register a name we suggested.
                </span>
              </div>
            ) : null}

            {result.state === "taken" || result.state === "premium" ? (
              <Button size="sm" variant="outline" onClick={onFindAlternatives}>
                <SparkIcon className="size-4" />
                Find names that are free
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
