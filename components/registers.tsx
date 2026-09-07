"use client";

import { useState } from "react";
import { OpenRegister } from "./app";
import { VastuRegister } from "./vastu-register";
import { Segmented } from "./ui";

type Register = "open" | "vastu";

/**
 * The two ways in. Kept as one control rather than two pages, because the
 * choice is about method, not about a different product.
 */
export function Registers() {
  const [register, setRegister] = useState<Register>("open");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Segmented
          label="How you want to find a name"
          value={register}
          onChange={setRegister}
          options={[
            { id: "open", label: "Check and suggest" },
            { id: "vastu", label: "Vastu derivation" },
          ]}
        />
        <p className="text-[13px] leading-relaxed text-ink-3">
          {register === "open"
            ? "Type a name, see whether it's free, get alternatives that are."
            : "Answer questions about your chart and premises; names are derived from the answers."}
        </p>
      </div>

      {register === "open" ? <OpenRegister /> : <VastuRegister />}
    </div>
  );
}
