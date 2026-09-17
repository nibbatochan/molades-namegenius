import { useState } from 'react'
import ResultRow, { DISPLAY, MONO, SkeletonRow } from './ResultRow.jsx'
import { Eyebrow, GhostButton, MonoNote, SolidButton, TldChoice, Title, EmptyResults } from './parts.jsx'
import { BRIEF_EMPTY, BRIEF_FILLED, RESULTS, TLD_CHOICES } from './data.js'

// Version 3 — Split.
// The brief stays on screen as a 320px left column while names arrive on the
// right, so S1 and S2 are the same layout at two moments. Rows run at the
// row's tighter 12px padding to fit more of them above the fold.

function SummaryLine({ label, value }) {
  return (
    <div className="border-b-[0.889px] border-solid border-[#e4e4e4] px-[4px] py-[12px]">
      <Eyebrow>{label}</Eyebrow>
      <p
        className={`${MONO} pt-[6px] text-[13px] leading-[19.5px] ${
          value ? 'text-[#6b6b6b]' : 'text-[#c2c2c2]'
        }`}
      >
        {value || 'not set'}
      </p>
    </div>
  )
}

function CompactField({ label, children }) {
  return (
    <label className="flex flex-col items-start border-b-[0.889px] border-solid border-[#e4e4e4] px-[4px] py-[12px]">
      <Eyebrow>{label}</Eyebrow>
      <span className="w-full pt-[6px]">{children}</span>
    </label>
  )
}

function BriefPanel({ brief, tld }) {
  return (
    <div className="w-[320px] shrink-0">
      <Eyebrow>Brief so far</Eyebrow>
      <div className="pt-[12px]">
        <SummaryLine label="Working name" value={brief.name} />
        <SummaryLine label="What it does" value={brief.does} />
        <SummaryLine label="Competitors" value={brief.competitors} />
        <SummaryLine label="Preferred TLD" value={tld} />
      </div>
    </div>
  )
}

export function SplitS1({ filled }) {
  const brief = filled ? BRIEF_FILLED : BRIEF_EMPTY
  const [tld, setTld] = useState(brief.tld)

  return (
    <div className="mx-auto flex w-[1104px] items-start gap-[24px] py-[48px]">
      <BriefPanel brief={brief} tld={tld} />

      <div className="flex-1 border-l-[0.889px] border-solid border-[#e4e4e4] pl-[24px]">
        <Eyebrow>Step 1 — Brief</Eyebrow>
        <div className="pt-[6px]">
          <Title>Describe it once</Title>
        </div>
        <div className="pt-[6px]">
          <MonoNote>The summary on the left stays with you through the results.</MonoNote>
        </div>

        <div className="pt-[24px]">
          <CompactField label="Working name">
            <input
              key={`name-${filled}`}
              defaultValue={brief.name}
              placeholder="Field notes for builders"
              className={`${DISPLAY} w-full bg-transparent text-[28px] font-semibold leading-[42px] tracking-[-0.56px] text-[#0a0a0a] outline-none placeholder:text-[#c2c2c2]`}
            />
          </CompactField>

          <CompactField label="What it does">
            <input
              key={`does-${filled}`}
              defaultValue={brief.does}
              placeholder="A notebook that turns site visits into shareable reports"
              className={`${MONO} w-full bg-transparent text-[15px] leading-[22.5px] text-[#6b6b6b] outline-none placeholder:text-[#c2c2c2]`}
            />
          </CompactField>

          <CompactField label="Competitors">
            <input
              key={`comp-${filled}`}
              defaultValue={brief.competitors}
              placeholder="Notion, Bear, Craft"
              className={`${MONO} w-full bg-transparent text-[15px] leading-[22.5px] text-[#6b6b6b] outline-none placeholder:text-[#c2c2c2]`}
            />
          </CompactField>

          <CompactField label="Preferred TLD">
            <TldChoice options={TLD_CHOICES} value={tld} onChange={setTld} />
          </CompactField>
        </div>

        <div className="flex items-center justify-between gap-[20px] px-[4px] py-[24px]">
          <SolidButton>Find names</SolidButton>
          <MonoNote tone="faint">Availability is mocked.</MonoNote>
        </div>
      </div>
    </div>
  )
}

export function SplitS2({ state }) {
  const items = state === 'populated' ? RESULTS : []
  const freeCount = items.filter((i) => i.status === 'available').length

  return (
    <div className="mx-auto flex w-[1104px] items-start gap-[24px] py-[48px]">
      <div className="w-[320px] shrink-0">
        <BriefPanel brief={BRIEF_FILLED} tld={BRIEF_FILLED.tld} />
        <div className="pt-[24px]">
          <Eyebrow>Filter</Eyebrow>
          <div className="flex flex-wrap items-center gap-[8px] pt-[12px]">
            <GhostButton>Free only</GhostButton>
            <GhostButton>Short</GhostButton>
          </div>
        </div>
        <div className="pt-[24px]">
          <GhostButton>Edit brief</GhostButton>
        </div>
      </div>

      <div className="flex-1 border-l-[0.889px] border-solid border-[#e4e4e4] pl-[24px]">
        <div className="flex items-end justify-between gap-[20px] px-[4px]">
          <div>
            <Eyebrow>Step 2 — Results</Eyebrow>
            <div className="pt-[6px]">
              <Title>Ten names</Title>
            </div>
          </div>
          <MonoNote>
            {state === 'loading'
              ? 'checking…'
              : state === 'empty'
                ? '0 free'
                : `${freeCount} free of ${items.length}`}
          </MonoNote>
        </div>

        <div className="pt-[24px]">
          {state === 'loading' &&
            Array.from({ length: 7 }, (_, i) => <SkeletonRow key={i} dense />)}
          {state === 'empty' && (
            <EmptyResults note="No names cleared that brief. Loosen a line on the left." />
          )}
          {state === 'populated' &&
            items.map((item) => <ResultRow key={item.name} item={item} dense />)}
        </div>

        <div className="flex items-center justify-between gap-[20px] px-[4px] py-[24px]">
          <GhostButton>Regenerate</GhostButton>
          <MonoNote tone="faint">Bold TLD = free · struck = taken</MonoNote>
        </div>
      </div>
    </div>
  )
}
