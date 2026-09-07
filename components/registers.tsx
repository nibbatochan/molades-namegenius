"use client";

import { useState } from "react";
import { OpenRegister } from "./app";
import { CutTabs } from "./ledger";
import { VastuRegister } from "./vastu-register";

type RegisterId = "open" | "vastu";

/**
 * The book has two registers. They are tabs cut into a rule rather than a
 * toggle, because they are two different sheets in the same volume — one asks
 * what you are building, the other asks when you were born.
 */
export function Registers() {
  const [register, setRegister] = useState<RegisterId>("open");

  return (
    <div>
      <div id="registers" className="ruled-b flex flex-wrap items-end justify-between gap-4 pb-5">
        <CutTabs
          label="Register"
          value={register}
          onChange={setRegister}
          options={[
            { id: "open", label: "Open register", title: "Check a name, and get names that are free" },
            { id: "vastu", label: "Vastu register", title: "Derive a name from your chart, the direction, and the trade" },
          ]}
        />
        <p className="clerk max-w-[44ch] leading-relaxed text-ink-3">
          {register === "open"
            ? "One filled row is enough to run"
            : "Fourteen questions, none of them required"}
        </p>
      </div>

      <div className="pt-8">
        {register === "open" ? <OpenRegister /> : <VastuRegister />}
      </div>
    </div>
  );
}
