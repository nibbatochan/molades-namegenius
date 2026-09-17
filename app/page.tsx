import { Registers } from "@/components/registers";
import { ThemeToggle } from "@/components/theme-toggle";
import { BoltIcon, CompassIcon, GlobeIcon, ShieldIcon } from "@/components/icons";
import { Card, PaletteDots, SectionLabel } from "@/components/ui";
import { PRIMARY_TLD_IDS, TLDS } from "@/lib/tlds";

const EXPLAINERS = [
  {
    icon: <GlobeIcon />,
    title: "Every name is checked before you see it",
    body: "Suggestions are queried against the registry itself over RDAP, the protocol registries publish for exactly this. A name only reaches your screen once it has come back free, so the list you read is the list you can register.",
  },
  {
    icon: <ShieldIcon />,
    title: "When we can't verify, we say so",
    body: "Some registries answer no machine query at all. Rather than guess and let you find out at checkout, those come back marked as unverified, with the reason. We would rather be unhelpful than wrong.",
  },
  {
    icon: <BoltIcon />,
    title: "Results stream as they clear",
    body: "Checks run in parallel against the registry, and each name appears the moment its answer arrives. Nothing sits behind a progress bar waiting for the slowest lookup in the batch to finish.",
  },
  {
    icon: <CompassIcon />,
    title: "The Vastu route shows its work",
    body: "Names derived from a chart carry the chain that produced them, rule by rule, each tagged with where the rule comes from — a named text, long practice, or our own assembly. You can disagree with a step and see exactly which one.",
  },
];

export default function Home() {
  const primary = TLDS.filter((t) => PRIMARY_TLD_IDS.includes(t.id));

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-hair/70 bg-card/55 backdrop-blur-xl">
        <nav
          aria-label="Main"
          className="mx-auto flex h-16 max-w-[1180px] items-center gap-6 px-5 lg:px-8"
        >
          <a href="/" className="flex items-center gap-2.5 font-semibold tracking-[-0.02em]">
            <span className="flex size-8 items-center justify-center rounded-full bg-[linear-gradient(145deg,#ffc7a0,#ff7a3c)] text-[#1a1714]">
              <GlobeIcon className="size-4" />
            </span>
            <span className="text-[16px]">NameGenius</span>
          </a>

          <div className="ml-auto flex items-center gap-1">
            <a
              href="#how"
              className="hidden rounded-full px-3.5 py-2 text-[13.5px] font-semibold text-ink-2 transition-colors duration-200 hover:text-ink sm:block"
            >
              How it works
            </a>
            <a
              href="#endings"
              className="hidden rounded-full px-3.5 py-2 text-[13.5px] font-semibold text-ink-2 transition-colors duration-200 hover:text-ink sm:block"
            >
              Endings
            </a>
            <span className="ml-2">
              <ThemeToggle />
            </span>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[1180px] flex-1 px-5 pb-24 lg:px-8">
        <section className="pt-14 pb-10 lg:pt-20 lg:pb-12">
          <p className="flex items-center gap-3">
            <PaletteDots />
            <span className="u-label">Domain availability, verified at the registry</span>
          </p>
          <h1 className="mt-4 max-w-[34ch] text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.04] font-semibold tracking-[-0.035em]">
            Names you can actually own.
          </h1>
          <p className="mt-5 max-w-[62ch] text-[16.5px] leading-relaxed text-ink-2">
            Check whether a name is free, and when it&rsquo;s gone, get alternatives
            that aren&rsquo;t. Every suggestion is verified against the registry before
            it reaches you, so nothing on your shortlist turns out to be taken.
          </p>
        </section>

        <Registers />

        <div className="h-px bg-hair" />

        <section id="how" className="scroll-mt-20 pt-14 lg:pt-20">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="mt-4 max-w-[26ch] text-[clamp(1.6rem,3vw,2.25rem)] leading-[1.1] font-semibold tracking-[-0.03em]">
            No name reaches you unverified.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {EXPLAINERS.map((item) => (
              <Card key={item.title} className="p-6 lg:p-7">
                <SectionLabel icon={item.icon}>{item.title}</SectionLabel>
                <p className="mt-3.5 text-[14.5px] leading-relaxed text-ink-2">{item.body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="endings" className="scroll-mt-20 pt-14 lg:pt-20">
          <SectionLabel>Endings</SectionLabel>
          <h2 className="mt-4 max-w-[30ch] text-[clamp(1.6rem,3vw,2.25rem)] leading-[1.1] font-semibold tracking-[-0.03em]">
            Which ending should you take?
          </h2>
          <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-ink-2">
            The ending changes who can register the name, what it signals, and
            whether the registry will answer a query about it at all. These five
            cover most cases; the rest are behind the selector.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {primary.map((tld) => (
              <Card key={tld.id} className="p-6">
                <p className="text-[20px] font-semibold tracking-[-0.02em]">{tld.label}</p>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-2">{tld.note}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-hair/70 bg-card/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-8 gap-y-3 px-5 py-8 lg:px-8">
          <p className="text-[13px] text-ink-3">
            NameGenius checks availability. It does not sell or register domains.
          </p>
          <p className="ml-auto text-[13px] text-ink-3">
            Availability comes from the registry at the moment you asked, and can
            change at any time.
          </p>
        </div>
      </footer>
    </>
  );
}
