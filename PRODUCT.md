# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: a founder, indie developer, or product lead naming a company, product, or project they intend to ship within days rather than months. They have a rough sense of what they are building and often a name they are already attached to. They are not brand strategists and do not want a lengthy naming exercise.

Secondary: agencies and freelancers naming on a client's behalf, who need to present options that are defensibly available.

Vastu mode audience: India-first. Hindu founders who want a name derived from traditional Vedic and Vastu rules before they commit to it. This audience changes the domain side — `.in` and `.co.in` are prioritised, and names are Sanskrit-rooted but rendered in Latin script for domain use.

Explicitly not the audience: enterprise brand teams with trademark counsel and a naming agency on retainer.

## Product Purpose

Help someone naming a thing find a name they can actually own. The user checks whether a name's domain is free; when it is not, the product suggests alternatives that are both available and on-brand, driven by their own description, keywords, and competitors.

Success is a session that ends with the user copying or clicking through on at least one available name.

## Positioning

Every name the product suggests has been verified as available at the registry before it is shown. Domain checkers answer availability but know nothing about what the user is building. Name generators produce appealing names that are almost universally already registered. NameGenius closes that loop by generating far more candidates than it displays, checking every one, and discarding everything taken.

The second, narrower claim: availability is reported in three states, never two. When a registry cannot answer, the product says so rather than rounding up to available.

## Operating Context

- Naming happens under time pressure, usually in a single sitting, often with the registrar open in another tab.
- Domain availability comes from RDAP (IANA bootstrap discovery, per-registry rate limits, JSON responses), with a commercial provider as the intended fallback behind a swappable interface.
- Registration itself happens elsewhere. The product hands off to a registrar and takes no payment.
- Phase 1 is anonymous: no accounts, no stored history, no shortlists. A session is ephemeral and the user's output is what they copy before closing the tab.
- Vastu mode is a deliberate, separate flow rather than a filter on normal results. The user switches into it, answers a longer question set, and receives names derived from that input.

## Capabilities and Constraints

Built and working:

- Inline domain availability check on the name field, debounced, with request cancellation and input normalisation shown back to the user.
- Four availability states: available, taken, premium/reserved, and could-not-verify. The last is never cached and never rendered as available.
- Generate-then-verify pipeline: over-generate roughly 5x the displayed count, batch-verify against the registry at bounded concurrency, show only verified-available names, streamed as they clear.
- Three input groups where any one is sufficient to run: a name, a description of up to 1,000 characters, and competitors plus keywords. Nothing is required.
- Four optional brand-discovery questions (tone, kind of name, length, words to avoid).
- URL derive: reads a public page server-side and prefills description and keywords as visibly editable values. Guarded against SSRF — public HTTP(S) only, private and loopback ranges blocked, redirects capped and re-validated, body and time bounded.
- Keyword suggestion from the description, accepted or dismissed per chip.
- Deterministic input-strength score that names the next most useful thing to add, standing in for a validation gate.
- Session-only list of names already checked, in sessionStorage, no server writes.
- Per-subject rate limiting keyed on hashed IP, before any accounts exist.
- Candidate diversity: round-robin across seed roots so one strong term cannot dominate the results, and a sayability bar that rejects unpronounceable blends.

Confirmed scope, not yet built:

- A TLD extension selector so the user can check and target endings beyond `.com` (`.in`, `.co`, `.io`, `.ai` and similar), with `.in` and `.co.in` prioritised for the Vastu audience.
- Light and dark mode.
- Vastu compliance mode: a separate flow of at least ten questions covering birth details, business category, premises orientation, goals, and market, producing names derived deterministically from traditional Vedic and Vastu rules, with the derivation chain shown per name and availability checked afterwards.

Vastu mode constraints established by research (`docs/research/vedic-vastu-naming-research.md`):

- The 108 nakshatra-pada syllables are the derivation's spine and are settled: the table cross-checks against all twelve published rashi syllable lists when sliced into groups of nine. Shravana is Khi/Khu/Khe/Kho; the Ju/Je/Jo variant in circulation double-assigns syllables already held by Uttara Ashadha. Purva Ashadha padas 3 and 4 remain genuinely unresolved between sources and must be treated as low confidence wherever they decide an output.
- There is no settled scriptural rule linking Sanskrit consonant groups to the five elements. Two published varga-to-element mappings contradict each other. The product derives it by chaining two individually citable sources — Sharada Tilaka for letters to planets, Brihat Parashara Hora Shastra 3.20 for planets to elements — and must label that link as the product's own composition wherever a name depends on it. This is the one joint where the feature could quietly become invented mysticism.
- The syllable table is the Avakahada Chakra, a panchang device. It is not in Brihat Samhita or Brihat Parashara Hora Shastra, both of which are routinely miscited for it. The product must not repeat that attribution.
- The Chaldean numerology used for Indian business names is a twentieth-century import operating on the Roman alphabet, not a Vedic system. It is labelled practitioner convention, never scripture.
- The Manusmriti varna naming rules are not implemented. They are scriptural, but 2.31 prescribes that a Shudra's name be contemptible. The product never asks for or infers caste; the four semantic categories are surfaced neutrally as intent options instead.
- Ayanamsa is a recorded output, not an implementation detail. Lahiri (Chitrapaksha, the Government of India standard) is the default; Lahiri against Raman flips roughly 45% of pada assignments, so the ayanamsa name and value are persisted with every derived result and shown in the derivation chain.
- Cleanest scriptural rule available, and it maps onto a question worth asking a founder anyway: Ashvalayana Grhya Sutra I.15.6 gives two syllables for one desiring firm position and four for one desiring renown.

Birth nakshatra is asked for, not computed. The mode presents a nakshatra picker with a rashi fallback, on the basis that most of this audience knows theirs. No ephemeris library is linked, no astronomical computation ships, and birth time and place are never collected — which removes the Swiss Ephemeris licensing question and a sensitive-data liability at the same time. A founder who does not know their nakshatra still gets a derivation from the business inputs alone, explicitly marked as partial, with the syllable rule identified as the part that could not be applied.
- Alternative TLD suggestions for a taken name, social handle availability, trademark conflict screening (US federal only, screening not clearance), accounts, quotas, and Stripe billing.

Technical constraints:

- Candidate generation is currently deterministic local logic, not a model. The swap point is documented in `lib/candidates.ts`.
- USPTO trademark search: the key is free but rate-limited to 60 requests per minute at peak, too low to screen a whole batch, so screening is per-name and on demand. Which USPTO endpoint supports mark-text search rather than serial-number status lookup is an open question that blocks that phase.
- Social handle availability has no official API for most platforms; it will ship as per-platform adapters with declared confidence and an honest unverified state.

Undecided product facts:

- Whether the registrar handoff goes to a single partner (affiliate revenue) or offers a choice (neutrality).
- Which TLD set is the default beyond the prioritised ones.
- Whether saved shortlists arrive with accounts in Phase 3, having been deliberately cut from Phase 1.

## Brand Commitments

- Name: NameGenius.
- Voice: plain and direct. Explain what happened and what it means. No hype, no mysticism in the core product's own claims.
- Never claim a name is available when the registry could not confirm it.
- Never register a name the product suggested to a user. This is both a provider terms requirement and an audience-trust one.
- Trademark results are described as screening, never as clearance. The words "clear" and "safe" do not appear in that context.
- Vastu mode is described as "derived from traditional Vedic and Vastu rules". The derivation chain is shown per name so the reasoning is fully traceable, accompanied by a short note that this is a traditional system rather than an empirical one. The tradition is treated with respect and applied faithfully; it is not dressed up as science.
- Every rule in a derivation chain carries its provenance in the interface: scriptural with its citation, traditional practitioner convention, or the product's own composition. A rule the product invented or assembled is never presented in the voice of scripture. This is what makes the honesty framing structural rather than a disclaimer nobody reads.

## Evidence on Hand

- `PRD.md` — problem framing, phased scope, external dependency recommendations with tradeoffs, success metrics, risks, open questions.
- `FLOWS.md` — master flow plus eight named flows with entry points, states, exits, and edge cases.
- `shots/` — captured screenshots of the incumbent implementation across sixteen states, including live-verified availability results.
- Live RDAP integration: availability results in those screenshots are real, not mocked.
- `docs/research/vedic-vastu-naming-research.md` — the sourced basis for Vastu mode. The complete 108-pada syllable table in both readable and machine-readable form, the twelve rashi syllable lists, the Chaldean letter values with compound and root computation, the eight directions with their elements and business associations, sixteen practitioner questions with what each determines, the ayanamsa comparison quantified, and draft disclaimer copy. Every claim tagged scriptural, traditional, modern convention, or the product's own design choice, with six lowest-confidence claims listed in an appendix.

Absences that must not be fabricated: no users, no testimonials, no traffic, no case studies, no press, no pricing, no launch date, no accuracy benchmarks. No trademark or social-handle data source is integrated yet.

## Product Principles

1. Verified before suggested. Nothing reaches the user that the registry has not confirmed is available.
2. Never round uncertainty up to good news. Could-not-verify is its own answer and is shown as one.
3. Any one input runs. The product nudges toward better input and never blocks on it.
4. Show the reasoning. Every suggestion carries why it was suggested; in Vastu mode, that becomes a full derivation chain.
5. Be honest about scope. Where a data source cannot cover something, the interface says so instead of implying coverage.

## Accessibility & Inclusion

- Asynchronous status that resolves on its own (the availability pill) must be announced, not silently swapped.
- Chip inputs need keyboard add and remove with labelled controls.
- Contrast is a known weakness of the incumbent implementation and an explicit requirement of the redesign, alongside light and dark mode.
- Vastu mode must remain usable by someone who does not know Sanskrit terminology: every shastra term is glossed in place.
