"use client";

import { useEffect, useState } from "react";

type Stock = "paper" | "deed";

/**
 * The register is printed on one of two stocks. This is a real preference with
 * a real default: the system setting decides until the reader overrides it, and
 * the override persists. The label names the stock rather than the mode,
 * because that is what the reader is choosing.
 */
export function StockToggle() {
  const [stock, setStock] = useState<Stock>("paper");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const current = document.documentElement.dataset.stock;
    setStock(current === "deed" ? "deed" : "paper");
    setReady(true);
  }, []);

  function choose(next: Stock) {
    setStock(next);
    document.documentElement.dataset.stock = next;
    try {
      localStorage.setItem("ng-stock", next);
    } catch {
      // A blocked storage write costs the preference, never the page.
    }
  }

  return (
    <div
      role="group"
      aria-label="Ledger stock"
      className="flex items-stretch"
      // Until the effect reads the pre-paint value, neither tab claims to be
      // active; otherwise the server's guess flickers against the real one.
      data-ready={ready || undefined}
    >
      {(
        [
          { id: "paper", label: "Paper", title: "Light stock" },
          { id: "deed", label: "Deed", title: "Dark stock" },
        ] as const
      ).map((option) => {
        const active = ready && stock === option.id;
        return (
          <button
            key={option.id}
            type="button"
            title={option.title}
            aria-pressed={active}
            onClick={() => choose(option.id)}
            className={`clerk -ml-hair inline-flex h-7 items-center border border-rule px-2.5 transition-colors duration-150 first:ml-0 ${
              active
                ? "z-10 border-ink bg-ink text-stock"
                : "text-ink-3 hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
