import { useState } from 'react'
import ResultRow, { DISPLAY, MONO, SkeletonRow } from './ResultRow.jsx'
import { Eyebrow, GhostButton, MonoNote, SolidButton, TldChoice, Title, EmptyResults } from './parts.jsx'
import { BRIEF_EMPTY, BRIEF_FILLED, RESULTS, TLD_CHOICES } from './data.js'

// Version 1 — Ledger.
// The row is the whole grammar: everything on both screens is a full-width
// 1104px line with the same 0.889px rule under it and the same 24px vertical
// padding, so the brief reads as the same ledger the results do.

function Field({ label, hint, children }) {
  return (
    <label className="flex items-baseline justify-between gap-[20px] border-b-[0.889px] border-solid border-[#e4e4e4] px-[4px] py-[24px]">
      <span className="w-[240px] shrink-0">
        <Eyebrow>{label}</Eyebrow>
        <span className={`${MONO} block pt-[6px] text-[13px] leading-[19.5px] text-[#c2c2c2]`}>
          {hint}
        </span>
      </span>
      <span className="flex-1">{children}</span>
    </label>
  )
}

export function LedgerS1({ filled }) {
  const brief = filled ? BRIEF_FILLED : BRIEF_EMPTY
  const [tld, setTld] = useState(brief.tld)

  return (
    <div className="mx-auto w-[1104px] py-[48px]">
      <div className="px-[4px] pb-[24px]">
        <Eyebrow>Step 1 — Brief</Eyebrow>
        <div className="pt-[6px]">
          <Title>Tell us what you&rsquo;re naming</Title>
        </div>
        <div className="pt-[6px]">
          <MonoNote>Four lines in. Ten names with domains out.</MonoNote>
        </div>
      </div>

      <Field label="Working name" hint="or the idea in two words">
        <input
          key={`name-${filled}`}
          defaultValue={brief.name}
          placeholder="Field notes for builders"
          className={`${DISPLAY} w-full bg-transparent text-[28px] font-semibold leading-[42px] tracking-[-0.56px] text-[#0a0a0a] outline-none placeholder:text-[#c2c2c2]`}
        />
      </Field>

      <Field label="What it does" hint="one plain sentence">
        <input
          key={`does-${filled}`}
          defaultValue={brief.does}
          placeholder="A notebook that turns site visits into shareable reports"
          className={`${MONO} w-full bg-transparent text-[15px] leading-[22.5px] text-[#6b6b6b] outline-none placeholder:text-[#c2c2c2]`}
        />
      </Field>

      <Field label="Competitors" hint="comma separated, optional">
        <input
          key={`comp-${filled}`}
          defaultValue={brief.competitors}
          placeholder="Notion, Bear, Craft"
          className={`${MONO} w-full bg-transparent text-[15px] leading-[22.5px] text-[#6b6b6b] outline-none placeholder:text-[#c2c2c2]`}
        />
      </Field>

      <Field label="Preferred TLD" hint="checked first on every name">
        <TldChoice options={TLD_CHOICES} value={tld} onChange={setTld} />
      </Field>

      <div className="flex items-center justify-between gap-[20px] px-[4px] py-[24px]">
        <SolidButton>Find names</SolidButton>
        <MonoNote tone="faint">Availability is mocked in this prototype.</MonoNote>
      </div>
    </div>
  )
}

export function LedgerS2({ state }) {
  const items = state === 'populated' ? RESULTS : []
  const freeCount = items.filter((i) => i.status === 'available').length

  return (
    <div className="mx-auto w-[1104px] py-[48px]">
      <div className="flex items-end justify-between gap-[20px] px-[4px] pb-[24px]">
        <div>
          <Eyebrow>Step 2 — Results</Eyebrow>
          <div className="pt-[6px]">
            <Title>Field notes for builders</Title>
          </div>
        </div>
        <MonoNote>
          {state === 'loading'
            ? 'checking domains…'
            : state === 'empty'
              ? '0 names'
              : `${items.length} names · ${freeCount} free`}
        </MonoNote>
      </div>

      <div className="flex items-center justify-between gap-[20px] border-b-[0.889px] border-solid border-[#0a0a0a] px-[4px] pb-[8px]">
        <Eyebrow>Name</Eyebrow>
        <div className="flex items-center gap-[20px]">
          <Eyebrow>Other TLDs</Eyebrow>
          <Eyebrow>Status</Eyebrow>
        </div>
      </div>

      {state === 'loading' && Array.from({ length: 5 }, (_, i) => <SkeletonRow key={i} />)}
      {state === 'empty' && (
        <EmptyResults note="Nothing came back for that brief. Try a broader description." />
      )}
      {state === 'populated' && items.map((item) => <ResultRow key={item.name} item={item} />)}

      <div className="flex items-center justify-between gap-[20px] px-[4px] py-[24px]">
        <GhostButton>Regenerate</GhostButton>
        <MonoNote tone="faint">Bold TLD = free · struck = taken</MonoNote>
      </div>
    </div>
  )
}
