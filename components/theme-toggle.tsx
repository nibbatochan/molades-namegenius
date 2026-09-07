"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "./icons";

type Theme = "light" | "dark";

/**
 * A real preference with a real default: the system setting decides until the
 * reader overrides it, and the override persists.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === "dark" ? "dark" : "light");
    setReady(true);
  }, []);

  function choose(next: Theme) {
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("ng-theme", next);
    } catch {
      // A blocked storage write costs the preference, never the page.
    }
  }

  return (
    <div
      role="group"
      aria-label="Theme"
      className="quiet-fill inline-flex items-center gap-1 rounded-full p-1"
    >
      {(
        [
          { id: "light", label: "Light", Icon: SunIcon },
          { id: "dark", label: "Dark", Icon: MoonIcon },
        ] as const
      ).map(({ id, label, Icon }) => {
        // Until the effect reads the pre-paint value, neither side claims to be
        // active; otherwise the server's guess flickers against the real one.
        const active = ready && theme === id;
        return (
          <button
            key={id}
            type="button"
            title={`${label} theme`}
            aria-label={`${label} theme`}
            aria-pressed={active}
            onClick={() => choose(id)}
            className={`inline-flex size-8 items-center justify-center rounded-full transition-all duration-200 ease-soft ${
              active
                ? "bg-card text-ink shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
                : "text-ink-3 hover:text-ink"
            }`}
          >
            <Icon className="size-4" />
          </button>
        );
      })}
    </div>
  );
}
