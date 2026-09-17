import { CompareIcon, CopyIcon, HeartIcon } from './assets/rowIcons.jsx'

/**
 * The Phase 1 result row, transcribed from the Figma frame
 * "ResultRow (NameGenius)" (node 3:2) via get_design_context.
 *
 * Every size, weight, tracking, color and gap here is a literal from that
 * frame rather than a named token — one designed element isn't enough to
 * systemize. The S1/S2 explorations import these pieces so the screens
 * inherit the row's language instead of restating it.
 *
 * The frame only draws the `available` status. `taken` and `checking` extend
 * it with the same box, padding and radius so the tag can never change size
 * as a domain check resolves — only its fill, border and label change.
 */

// The row's two families. Sizes/colors/spacing stay inline at each use.
export const DISPLAY = '[font-family:Archivo,ui-sans-serif,system-ui,sans-serif]'
export const MONO = "[font-family:'Space_Mono',ui-monospace,monospace]"

const TAG_STATE = {
  available: 'border-[#0a0a0a] bg-[#0a0a0a] text-white',
  taken: 'border-[#c2c2c2] bg-transparent text-[#c2c2c2]',
  checking: 'border-dashed border-[#c2c2c2] bg-transparent text-[#9a9a9a]',
}

const TAG_LABEL = {
  available: 'Available',
  taken: 'Taken',
  checking: 'Checking',
}

export function StatusTag({ status = 'available' }) {
  return (
    <span
      className={`shrink-0 rounded-[2px] border-[0.889px] border-solid px-[12px] py-[6px] ${DISPLAY} text-[11px] font-bold uppercase leading-[16.5px] tracking-[1.1px] ${TAG_STATE[status]}`}
    >
      {TAG_LABEL[status]}
    </span>
  )
}

/** Availability read typographically: bold ink = free, struck gray = taken. */
export function TldStrip({ tlds }) {
  return (
    <div className="flex shrink-0 items-center gap-[14px]">
      {tlds.map(({ ext, available }) => (
        <span
          key={ext}
          className={`${MONO} text-[13px] leading-[19.5px] ${
            available === null
              ? 'text-[#c2c2c2]'
              : available
                ? 'font-bold text-[#0a0a0a]'
                : 'text-[#c2c2c2] line-through decoration-solid [text-decoration-skip-ink:none] [text-underline-position:from-font]'
          }`}
        >
          {ext}
        </span>
      ))}
    </div>
  )
}

function IconButton({ label, children, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="rounded-[2px] p-[8px] text-[#9a9a9a] transition-colors hover:text-[#0a0a0a]"
    >
      {children}
    </button>
  )
}

export function RowActions() {
  return (
    <div className="flex shrink-0 items-center gap-[8px]">
      <IconButton label="Copy domain">
        <CopyIcon className="size-[19px]" />
      </IconButton>
      <IconButton label="Save to shortlist">
        <HeartIcon className="size-[19px]" />
      </IconButton>
      <IconButton label="Add to compare">
        <CompareIcon className="size-[19px]" />
      </IconButton>
    </div>
  )
}

export default function ResultRow({ item, dense = false, showTag = true }) {
  return (
    <div
      className={`flex items-center justify-between gap-[20px] border-b-[0.889px] border-solid border-[#e4e4e4] px-[4px] ${
        dense ? 'py-[12px]' : 'py-[24px]'
      }`}
    >
      <div className="flex min-w-0 flex-col items-start">
        <p
          className={`${DISPLAY} truncate text-[28px] font-semibold leading-[42px] tracking-[-0.56px] text-[#0a0a0a]`}
        >
          {item.name}
        </p>
        <p className={`${MONO} truncate pt-[6px] text-[15px] leading-[22.5px] text-[#6b6b6b]`}>
          {item.domain}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-[20px]">
        <TldStrip tlds={item.tlds} />
        {showTag && <StatusTag status={item.status} />}
        <RowActions />
      </div>
    </div>
  )
}

/** Same geometry as the row above, so nothing shifts when results resolve. */
export function SkeletonRow({ dense = false }) {
  return (
    <div
      className={`flex animate-pulse items-center justify-between gap-[20px] border-b-[0.889px] border-solid border-[#e4e4e4] px-[4px] ${
        dense ? 'py-[12px]' : 'py-[24px]'
      }`}
    >
      <div className="flex flex-col items-start">
        <span className="flex h-[42px] items-center">
          <span className="block h-[20px] w-[164px] rounded-[2px] bg-[#e4e4e4]" />
        </span>
        <span className="flex h-[28.5px] items-center pt-[6px]">
          <span className="block h-[11px] w-[108px] rounded-[2px] bg-[#e4e4e4]" />
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-[20px]">
        <div className="flex items-center gap-[14px]">
          <span className="block h-[13px] w-[32px] rounded-[2px] bg-[#e4e4e4]" />
          <span className="block h-[13px] w-[24px] rounded-[2px] bg-[#e4e4e4]" />
          <span className="block h-[13px] w-[24px] rounded-[2px] bg-[#e4e4e4]" />
        </div>
        <span className="block h-[29.5px] w-[96px] rounded-[2px] bg-[#e4e4e4]" />
        <div className="flex items-center gap-[8px]">
          <span className="block size-[35px] rounded-[2px] bg-[#e4e4e4]" />
          <span className="block size-[35px] rounded-[2px] bg-[#e4e4e4]" />
          <span className="block size-[35px] rounded-[2px] bg-[#e4e4e4]" />
        </div>
      </div>
    </div>
  )
}
