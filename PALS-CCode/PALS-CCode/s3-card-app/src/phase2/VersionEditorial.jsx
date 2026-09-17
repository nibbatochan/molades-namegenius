import { useState } from 'react'
import ResultRow, { DISPLAY, MONO, SkeletonRow } from './ResultRow.jsx'
import { Eyebrow, GhostButton, MonoNote, SolidButton, TldChoice, Title, EmptyResults } from './parts.jsx'
import { BRIEF_EMPTY, BRIEF_FILLED, RESULTS, STATUS_GROUP_LABEL, TLD_CHOICES, groupByStatus } from './data.js'

// Version 2 — Editorial.
// A single narrow 720px column. The brief becomes one question per line at the
// row's 28px display size, and the results are grouped under the row's own
// 11px caps label so availability is read as a heading before it's read as a tag.

function StackedField({ label, children }) {
  return (
    <label className="flex flex-col items-start border-b-[0.889px] border-solid border-[#e4e4e4] px-[4px] pb-[12px] pt-[24px]">
      <Eyebrow>{label}</Eyebrow>
      <span className="w-full pt-[6px]">{children}</span>
    </label>
  )
}

export function EditorialS1({ filled }) {
  const brief = filled ? BRIEF_FILLED : BRIEF_EMPTY
  const [tld, setTld] = useState(brief.tld)

  return (
    <div className="mx-auto w-[720px] py-[48px]">
      <Eyebrow>NameGenius — Step 1 of 2</Eyebrow>
      <div className="pt-[12px]">
        <p
          className={`${DISPLAY} text-[28px] font-semibold leading-[42px] tracking-[-0.56px] text-[#0a0a0a]`}
        >
          What are you naming,
          <br />
          and what should it sound like?
        </p>
      </div>
      <div className="pt-[12px]">
        <MonoNote>Answer what you can. Every line sharpens the ten names.</MonoNote>
      </div>

      <div className="pt-[24px]">
        <StackedField label="The thing itself">
          <input
            key={`name-${filled}`}
            defaultValue={brief.name}
            placeholder="Field notes for builders"
            className={`${DISPLAY} w-full bg-transparent text-[28px] font-semibold leading-[42px] tracking-[-0.56px] text-[#0a0a0a] outline-none placeholder:text-[#c2c2c2]`}
          />
        </StackedField>

        <StackedField label="What it does">
          <input
            key={`does-${filled}`}
            defaultValue={brief.does}
            placeholder="A notebook that turns site visits into shareable reports"
            className={`${MONO} w-full bg-transparent text-[15px] leading-[22.5px] text-[#6b6b6b] outline-none placeholder:text-[#c2c2c2]`}
          />
        </StackedField>

        <StackedField label="Names you admire">
          <input
            key={`comp-${filled}`}
            defaultValue={brief.competitors}
            placeholder="Notion, Bear, Craft"
            className={`${MONO} w-full bg-transparent text-[15px] leading-[22.5px] text-[#6b6b6b] outline-none placeholder:text-[#c2c2c2]`}
          />
        </StackedField>

        <StackedField label="Check this TLD first">
          <TldChoice options={TLD_CHOICES} value={tld} onChange={setTld} />
        </StackedField>
      </div>

      <div className="pt-[24px]">
        <SolidButton wide>Find names</SolidButton>
      </div>
      <div className="pt-[12px] text-center">
        <MonoNote tone="faint">Availability is mocked in this prototype.</MonoNote>
      </div>
    </div>
  )
}

export function EditorialS2({ state }) {
  const groups = state === 'populated' ? groupByStatus(RESULTS) : []

  return (
    <div className="mx-auto w-[720px] py-[48px]">
      <Eyebrow>NameGenius — Step 2 of 2</Eyebrow>
      <div className="pt-[12px]">
        <Title>Ten names for a builder&rsquo;s notebook</Title>
      </div>
      <div className="pt-[12px]">
        <MonoNote>
          {state === 'loading'
            ? 'Checking .com, .io and .co for each name…'
            : state === 'empty'
              ? 'Nothing came back for that brief.'
              : 'Grouped by what you can actually register today.'}
        </MonoNote>
      </div>

      {state === 'loading' && (
        <div className="pt-[24px]">
          <div className="flex items-baseline justify-between gap-[20px] border-b-[0.889px] border-solid border-[#0a0a0a] px-[4px] pb-[8px]">
            <Eyebrow tone="ink">{STATUS_GROUP_LABEL.checking}</Eyebrow>
            <MonoNote tone="faint">…</MonoNote>
          </div>
          {Array.from({ length: 4 }, (_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      )}

      {state === 'empty' && (
        <div className="pt-[24px]">
          <EmptyResults note="Try a broader description, or drop the competitor list." />
        </div>
      )}

      {groups.map((group) => (
        <div key={group.status} className="pt-[24px]">
          <div className="flex items-baseline justify-between gap-[20px] border-b-[0.889px] border-solid border-[#0a0a0a] px-[4px] pb-[8px]">
            <Eyebrow tone="ink">{STATUS_GROUP_LABEL[group.status]}</Eyebrow>
            <span className={`${MONO} text-[13px] leading-[19.5px] text-[#6b6b6b]`}>
              {group.items.length}
            </span>
          </div>
          {group.items.map((item) => (
            <ResultRow key={item.name} item={item} />
          ))}
        </div>
      ))}

      <div className="flex items-center justify-between gap-[20px] px-[4px] py-[24px]">
        <GhostButton>Regenerate</GhostButton>
        <MonoNote tone="faint">Bold TLD = free · struck = taken</MonoNote>
      </div>
    </div>
  )
}
