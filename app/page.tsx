import type { ReactNode } from "react";
import { GuillocheBand, GuillocheRosette, RuleOrnament } from "@/components/guilloche";
import { Clerk, Rule } from "@/components/ledger";
import { Registers } from "@/components/registers";
import { StockToggle } from "@/components/stock-toggle";

export default function Home() {
  return (
    <>
      {/* The plate: engine-turned line work, the way a deed carries a border. */}
      <div className="plate">
        <div className="text-deed-ink/70">
          <GuillocheBand height={40} tile={140} curves={11} />
        </div>
      </div>

      <header className="ruled-b">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-8 gap-y-4 px-6 py-5">
          <a href="#registers" className="flex items-center gap-3 no-underline">
            <span className="text-ink-2">
              <GuillocheRosette size={30} />
            </span>
            <span className="font-display text-[19px] leading-none font-semibold tracking-[-0.01em]">
              NameGenius
            </span>
          </a>

          <nav aria-label="Sections" className="hidden items-center gap-7 md:flex">
            <NavLink href="#registers">The registers</NavLink>
            <NavLink href="#checked">What is checked</NavLink>
            <NavLink href="#vastu-note">On Vastu mode</NavLink>
            <NavLink href="#sources">Sources</NavLink>
          </nav>

          <div className="ml-auto flex items-center gap-5">
            <Clerk className="hidden lg:flex">Stock</Clerk>
            <StockToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1180px] flex-1 px-6">
        {/* Hero */}
        <section className="pt-12 pb-10 md:pt-16">
          {/* The measure lives on the heading, not a wrapper: a ch value on a
              16px parent would resolve against that, not the display size. */}
          <h1 className="font-display max-w-[24ch] text-[clamp(2.5rem,5.4vw,4.3rem)] leading-[1] font-semibold tracking-[-0.035em] text-balance">
            A name is not yours until the register says so.
          </h1>
          <p className="mt-6 max-w-[62ch] text-[17px] leading-relaxed text-ink-2">
            Type a name and NameGenius asks the registry itself, not a guess. When
            it is gone, you get names that are not — every one of them checked
            before it reaches you, and none of them claimed free unless the
            registry said so.
          </p>
        </section>

        <Registers />

        <RuleOrnament className="py-14" />

        {/* Explainer: what gets checked */}
        <section id="checked" className="pb-16">
          <h2 className="font-display text-[clamp(1.7rem,3.2vw,2.6rem)] leading-[1.06] font-semibold tracking-[-0.025em]">
            What the register actually checks
          </h2>
          <p className="mt-4 max-w-[66ch] text-[15px] leading-relaxed text-ink-2">
            Availability is a claim that can cost you money, so it is the one
            thing here that is never inferred.
          </p>

          <div className="mt-10 grid gap-x-10 gap-y-9 md:grid-cols-3">
            <Explainer
              n="i"
              title="The registry, over RDAP"
              body="RDAP is the registries' own protocol and the authoritative answer for whether a domain exists. We ask it directly. A registry that will not answer gets reported as unverified rather than guessed at — a dry stamp, not a green one."
            />
            <Explainer
              n="ii"
              title="Four states, not two"
              body="Available, registered, reserved as premium, and could-not-check. Collapsing the last two into either of the first two is how a name-checker ends up lying to you, so each one prints its own impression."
            />
            <Explainer
              n="iii"
              title="Nothing cached for long"
              body="An available answer is held for two minutes, because it is the claim that can hurt you if it goes stale. A registered answer is safe to hold for an hour. Unverified is never cached at all."
            />
          </div>
        </section>

        <Rule strong />

        {/* Explainer: the honest note on Vastu mode */}
        <section id="vastu-note" className="py-16">
          <div className="grid gap-10 md:grid-cols-[minmax(0,34ch)_minmax(0,1fr)] md:gap-16">
            <div>
              <h2 className="font-display text-[clamp(1.7rem,3.2vw,2.6rem)] leading-[1.06] font-semibold tracking-[-0.025em]">
                On the Vastu register
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
                It applies a traditional system consistently. It does not claim
                the system is empirically true, and it never puts our own
                reasoning in scripture&rsquo;s voice.
              </p>
            </div>

            <div>
              <ul>
                <Claim
                  mark="Scriptural"
                  body="Rules stated in a named text, cited on the rule itself. The syllable-count rule is the clearest of them: Ashvalayana Grhya Sutra I.15.6 gives two syllables for one desiring a firm position, four for one desiring renown."
                />
                <Claim
                  mark="Traditional"
                  body="Carried by the tradition rather than one text. The 108-syllable nakshatra table is the main one — it is genuinely old and genuinely standard, but it is not in the Grhya Sutras, in Manusmriti, in Brihat Samhita, or in BPHS, all of which get miscited for it."
                />
                <Claim
                  mark="Modern convention"
                  body="Contemporary practice, not scripture. The numerology is the clear case: the system sold as ancient Vedic numerology is a twentieth-century import that operates on the Roman alphabet, which alone dates it. Practitioners do use it, so we implement it and say what it is."
                />
                <Claim
                  mark="Our derivation"
                  body="Assembled by us from separately cited sources. Mapping a sound's class to an element is the honest sore point: the two published tables contradict each other, so we chain two links that are each attributable and label the result as ours. No text asserts it."
                />
              </ul>
            </div>
          </div>
        </section>

        <Rule strong />

        {/* Sources */}
        <section id="sources" className="py-16">
          <h2 className="font-display text-[clamp(1.7rem,3.2vw,2.6rem)] leading-[1.06] font-semibold tracking-[-0.025em]">
            Where the rules come from
          </h2>
          <ul className="mt-9 grid gap-x-10 gap-y-7 md:grid-cols-2">
            <Source
              text="Ashvalayana Grhya Sutra I.15.4–7; Shankhayana I.24.4; Paraskara I.17.2"
              note="Syllable count, voiced openings, an internal semivowel, a vowel ending."
            />
            <Source
              text="Apastamba Grhya Sutra 6.15.2, 6.15.9–10"
              note="A nakshatra name; noun-plus-verb compounds; the su- particle."
            />
            <Source
              text="Manusmriti 2.33, 3.9"
              note="Easy to say and plain in meaning; the semantic blocklist."
            />
            <Source
              text="Brihat Samhita 53"
              note="The Vastu Purusha Mandala, the 81-square grid for secular buildings, and graded entrance placement."
            />
            <Source
              text="Sharada Tilaka Tantra; Brihat Parashara Hora Shastra 3.20"
              note="Sound class to planet, and planet to element. The two links we chain, and label as ours once chained."
            />
            <Source
              text="Cheiro's compound number readings"
              note="The Chaldean numerology practitioners actually use for business names. Modern, and marked as such."
            />
          </ul>
        </section>
      </main>

      <footer className="ruled">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-baseline gap-x-10 gap-y-4 px-6 py-9">
          <Clerk>NameGenius</Clerk>
          <p className="max-w-[62ch] text-[13px] leading-relaxed text-ink-3">
            Availability comes from the registries over RDAP and is accurate to
            the moment it was checked. A domain can be taken between your check
            and your registration. We take no payment and register nothing on
            your behalf.
          </p>
          <p className="clerk ml-auto text-ink-3">Folio 41</p>
        </div>
        <div className="plate">
          <div className="text-deed-ink/60">
            <GuillocheBand height={26} tile={120} curves={9} />
          </div>
        </div>
      </footer>
    </>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="clerk text-ink-2 no-underline transition-colors duration-150 hover:text-ink"
    >
      {children}
    </a>
  );
}

function Explainer({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: string;
}) {
  return (
    <div className="ruled pt-5">
      <Clerk>{n}</Clerk>
      <h3 className="mt-3 font-display text-[19px] leading-snug font-semibold tracking-[-0.01em]">
        {title}
      </h3>
      <p className="mt-2.5 text-[14px] leading-relaxed text-ink-2">{body}</p>
    </div>
  );
}

function Claim({ mark, body }: { mark: string; body: string }) {
  return (
    <li className="ruled grid gap-3 py-5 sm:grid-cols-[minmax(0,17ch)_minmax(0,1fr)] sm:gap-8">
      <span className="clerk pt-0.5 text-ink">{mark}</span>
      <p className="text-[14px] leading-relaxed text-ink-2">{body}</p>
    </li>
  );
}

function Source({ text, note }: { text: string; note: string }) {
  return (
    <li className="ruled pt-4">
      <p className="font-display text-[16px] leading-snug">{text}</p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-3">{note}</p>
    </li>
  );
}
