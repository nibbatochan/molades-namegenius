import type { Metadata } from "next";
import { Archivo, Eczar } from "next/font/google";
import "./globals.css";

// Eczar carries the display voice and ships a matched Devanagari, which the
// Vastu register needs beside its Latin transliterations. Archivo takes labels,
// tables, and every tabular figure in the ledger.
const eczar = Eczar({
  variable: "--font-display",
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700", "800"],
});

const archivo = Archivo({
  variable: "--font-text",
  subsets: ["latin"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: "NameGenius — a name is not yours until the register says so",
  description:
    "Check whether a name's domain is free, and get alternatives that are both available and on-brand. Every name NameGenius suggests is verified against the registry first.",
};

const DIRECTION_CONTRACT = `<!--
THESIS: A name is not yours until the register says so. Refuses this category's
centred field floating on a gradient.

OWN-WORLD: Laid paper, registrar ink, deed blue-black, stamp vermilion. Hairline
rules and ruled columns do every division — no cards, no shadows, no gradients.
Engine-turned guilloche at page scale. Eczar display, Archivo small caps,
tabular figures.

STORY: Availability is stamped, not promised. The visitor checks a name, reads
why each suggestion cleared, and leaves with one they can own.

FIRST VIEWPORT: Guilloche band; wordmark left, register tabs right. Thesis at
plate scale. One full-width ruled entry row: folio numeral in the margin, name
set large, extension tabs cut into the rule beneath, stamp cartouche at its
right end. Primary action isolated, lower right. Signature: the stamp lands with
one ink-bleed compression as a check resolves; a registered entry is struck
through by a rule that draws across it. Nothing else animates.

FORM: Land-registry ledger and title deed; candidate 3 of 7; seed 3fc19da4.

FINISH: unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, DESIGN.md, and every shipping raster carrying its
provenance.
-->`;

// Runs before paint so the chosen ledger stock never flashes the other one.
const THEME_INIT = `(function(){try{var s=localStorage.getItem("ng-stock");var m=window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.stock=s==="paper"||s==="deed"?s:(m?"deed":"paper")}catch(e){document.documentElement.dataset.stock="paper"}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-stock="paper"
      className={`${eczar.variable} ${archivo.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <div hidden dangerouslySetInnerHTML={{ __html: DIRECTION_CONTRACT }} />
        {children}
      </body>
    </html>
  );
}
