import { DISPLAY, MONO } from './ResultRow.jsx'

// Small pieces lifted straight off the Phase 1 row: its 11px caps tag text,
// its 28px display line, its 15px mono line, and the tag shape reused as a
// button. Values stay literal at each use.

export function Eyebrow({ children, tone = 'muted' }) {
  return (
    <p
      className={`${DISPLAY} text-[11px] font-bold uppercase leading-[16.5px] tracking-[1.1px] ${
        tone === 'ink' ? 'text-[#0a0a0a]' : 'text-[#9a9a9a]'
      }`}
    >
      {children}
    </p>
  )
}

export function Title({ children }) {
  return (
    <p
      className={`${DISPLAY} text-[28px] font-semibold leading-[42px] tracking-[-0.56px] text-[#0a0a0a]`}
    >
      {children}
    </p>
  )
}

export function MonoNote({ children, tone = 'muted' }) {
  return (
    <p
      className={`${MONO} text-[15px] leading-[22.5px] ${
        tone === 'faint' ? 'text-[#c2c2c2]' : 'text-[#6b6b6b]'
      }`}
    >
      {children}
    </p>
  )
}

export function SolidButton({ children, wide = false }) {
  return (
    <button
      type="button"
      className={`rounded-[2px] border-[0.889px] border-solid border-[#0a0a0a] bg-[#0a0a0a] px-[24px] py-[12px] ${DISPLAY} text-[11px] font-bold uppercase leading-[16.5px] tracking-[1.1px] text-white transition-colors hover:bg-white hover:text-[#0a0a0a] ${
        wide ? 'w-full' : ''
      }`}
    >
      {children}
    </button>
  )
}

export function GhostButton({ children }) {
  return (
    <button
      type="button"
      className={`rounded-[2px] border-[0.889px] border-solid border-[#c2c2c2] bg-transparent px-[12px] py-[6px] ${DISPLAY} text-[11px] font-bold uppercase leading-[16.5px] tracking-[1.1px] text-[#6b6b6b] transition-colors hover:border-[#0a0a0a] hover:text-[#0a0a0a]`}
    >
      {children}
    </button>
  )
}

/** Availability-style chips for picking a TLD — same mono 13px as the strip. */
export function TldChoice({ options, value, onChange }) {
  return (
    <div className="flex items-center gap-[14px]">
      {options.map((ext) => (
        <button
          key={ext}
          type="button"
          onClick={() => onChange(ext)}
          className={`${MONO} rounded-[2px] border-[0.889px] border-solid px-[12px] py-[6px] text-[13px] leading-[19.5px] transition-colors ${
            value === ext
              ? 'border-[#0a0a0a] font-bold text-[#0a0a0a]'
              : 'border-[#e4e4e4] text-[#c2c2c2] hover:border-[#c2c2c2] hover:text-[#6b6b6b]'
          }`}
        >
          {ext}
        </button>
      ))}
    </div>
  )
}

export function EmptyResults({ note }) {
  return (
    <div className="flex flex-col items-start gap-[12px] border-b-[0.889px] border-solid border-[#e4e4e4] px-[4px] py-[24px]">
      <Eyebrow>No names matched</Eyebrow>
      <MonoNote>{note}</MonoNote>
      <div className="pt-[6px]">
        <GhostButton>Loosen the brief</GhostButton>
      </div>
    </div>
  )
}
