// S3 — Result card. A single, self-contained component whose layout and
// hierarchy are borrowed from real product screens on Mobbin, then rendered in
// the repo's strictly monochrome, typographic design system.
//
// Reference (layout + hierarchy only — no color, gradient, or shadow taken):
//   • Preply "saved tutor" card  — master layout: a bordered result card with a
//     dominant name headline, a chip/badge row directly beneath it, and an
//     action cluster to the right.
//     https://mobbin.com/screens/4678dc04-b586-4928-880c-526517fd9433
//   • Apple Store "Top Result"   — the labeled-indicator idea for the TLD row.
//     https://mobbin.com/screens/168b3f82-185a-4c24-ba33-86dd4573013a
//   • Vercel domain search       — weighting the TLD bold against the name in
//     the domain string (northpeak.com).
//     https://mobbin.com/screens/68fb3e43-4f7f-4319-8504-a8909187e432
//
// Two axes, one component:
//   status:  'available' (solid badge, free TLDs bold, domain TLD bold)
//          | 'taken'     (outlined muted badge, TLDs + domain struck through)
//   variant: 'featured' (Preply-style bordered "Top pick" card)
//          | 'row'       (compact list line)
//
// Data is mocked and the action icons are not wired this phase — the buttons
// render, focus, and carry labels, but their handlers default to no-ops.

import { useState } from 'react'

function ResultCard({
  name,
  domain,
  status,
  availability,
  tlds = [],
  tags = [],
  index,
  variant = 'tile',
  isShortlisted = false,
  isComparing = false,
  onCopy = () => {},
  onShortlist = () => {},
  onCompare = () => {},
}) {
  const taken = availability !== undefined ? !availability : status === 'taken'

  const actions = (
    <Actions
      domain={domain}
      isShortlisted={isShortlisted}
      isComparing={isComparing}
      onCopy={onCopy}
      onShortlist={onShortlist}
      onCompare={onCompare}
    />
  )

  if (variant === 'tile') {
    return (
      <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:border-slate-400 hover:shadow-md">
        {/* Top meta row: Technical index mark + Status badge */}
        <div>
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold">
              {index && <span className="font-bold text-blue-700">{index}</span>}
              {tags.length > 0 && (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-700">
                  {tags[0]}
                </span>
              )}
            </div>
            <StatusBadge taken={taken} />
          </div>

          {/* Name & Domain */}
          <div className="mt-4">
            <h3
              className={
                'text-2xl font-extrabold tracking-tight transition-colors duration-150 ' +
                (taken ? 'text-slate-500' : 'text-slate-900 group-hover:text-blue-700')
              }
            >
              {name}
            </h3>
            <div className="mt-1.5">
              <Domain domain={domain} taken={taken} />
            </div>
          </div>
        </div>

        {/* Bottom row: TLD indicators + Action buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <TldStrip tlds={tlds} />
          <div>{actions}</div>
        </div>
      </div>
    )
  }

  if (variant === 'featured') {
    return (
      <div className="flex flex-wrap items-start justify-between gap-6 rounded-2xl border border-slate-200 bg-white px-8 py-7 shadow-sm transition-all duration-200 hover:border-blue-600 hover:shadow-md">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-blue-900">
              Top Pick
            </span>
            {index && <span className="font-mono text-xs font-semibold text-slate-500">{index}</span>}
          </div>
          <div
            className={
              'mt-3 text-[36px] font-extrabold leading-none tracking-tight ' +
              (taken ? 'text-slate-500' : 'text-slate-900')
            }
          >
            {name}
          </div>
          <div className="mt-2.5">
            <Domain domain={domain} taken={taken} size="lg" />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <StatusBadge taken={taken} />
            <TldStrip tlds={tlds} showSummary />
          </div>
        </div>
        <div className="shrink-0">{actions}</div>
      </div>
    )
  }

  // 'row'
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-3 py-5 transition-colors duration-150 hover:bg-slate-50/80">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          {index && <span className="font-mono text-xs font-bold text-blue-700">{index}</span>}
          <div
            className={
              'text-[24px] font-extrabold tracking-tight ' +
              (taken ? 'text-slate-500' : 'text-slate-900')
            }
          >
            {name}
          </div>
        </div>
        <div className="mt-1">
          <Domain domain={domain} taken={taken} />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <TldStrip tlds={tlds} />
        <StatusBadge taken={taken} />
        {actions}
      </div>
    </div>
  )
}

function Domain({ domain, taken, size = 'md' }) {
  const dot = domain.lastIndexOf('.')
  const base = dot === -1 ? domain : domain.slice(0, dot)
  const ext = dot === -1 ? '' : domain.slice(dot)
  const cls = size === 'lg' ? 'text-[16px]' : 'text-[14px]'
  return (
    <span className={'font-mono ' + cls + (taken ? ' text-slate-500' : ' text-slate-700')}>
      {base}
      <span
        className={
          (taken ? 'line-through text-slate-400 font-medium ' : 'font-bold text-blue-700 ')
        }
      >
        {ext}
      </span>
    </span>
  )
}

function StatusBadge({ taken }) {
  return taken ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-100 px-3 py-1 font-mono text-xs font-semibold text-slate-700">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
      Taken
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-100/90 px-3 py-1 font-mono text-xs font-bold text-emerald-950 shadow-xs">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
      Available
    </span>
  )
}

function TldStrip({ tlds = [], showSummary = false }) {
  const freeCount = tlds.filter((t) => t.available).length
  return (
    <div className="flex items-center gap-2 font-mono text-xs">
      {tlds.map(({ ext, available }) =>
        available ? (
          <span
            key={ext}
            className="rounded-md border border-emerald-300 bg-emerald-100/80 px-2 py-0.5 font-bold text-emerald-950"
            title={`${ext} is available to register`}
          >
            {ext}
          </span>
        ) : (
          <span
            key={ext}
            className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 font-medium text-slate-500 line-through"
            title={`${ext} is already registered`}
          >
            {ext}
          </span>
        )
      )}
      {showSummary && (
        <span className="text-xs font-sans font-medium text-slate-600">
          {freeCount === 0
            ? 'None free'
            : freeCount === tlds.length
              ? 'All 3 available'
              : `${freeCount} available`}
        </span>
      )}
    </div>
  )
}

function Actions({ domain, isShortlisted, isComparing, onCopy, onShortlist, onCompare }) {
  const [copied, setCopied] = useState(false)

  const handleCopyClick = () => {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="relative flex items-center gap-1.5">
      {/* Inline copy feedback badge */}
      {copied && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-2 py-0.5 font-mono text-[10px] font-bold text-white shadow-md animate-toast">
          Copied!
        </span>
      )}

      <IconButton
        label={`Copy ${domain} to clipboard`}
        onClick={handleCopyClick}
        active={copied}
        activeColor="bg-emerald-50 text-emerald-800 border-emerald-300"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </IconButton>

      <IconButton
        label={isShortlisted ? 'Remove from saved shortlist' : 'Save to shortlist'}
        active={isShortlisted}
        activeColor="bg-rose-50 text-rose-600 border-rose-300 shadow-xs"
        pop={isShortlisted}
        onClick={onShortlist}
      >
        <HeartIcon filled={isShortlisted} />
      </IconButton>

      <IconButton
        label={isComparing ? 'Remove from compare' : 'Add to side-by-side compare'}
        active={isComparing}
        activeColor="bg-blue-50 text-blue-700 border-blue-300 shadow-xs"
        onClick={onCompare}
      >
        <CompareIcon />
      </IconButton>
    </div>
  )
}

function IconButton({
  label,
  children,
  onClick,
  active,
  pop = false,
  activeColor = 'bg-slate-900 text-white',
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      onClick={onClick}
      className={
        'flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-150 ease-out active:scale-90 hover:scale-105 ' +
        (active
          ? `${activeColor} ${pop ? 'animate-pop' : ''}`
          : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900')
      }
    >
      {children}
    </button>
  )
}

const iconProps = {
  width: 17,
  height: 17,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function CopyIcon() {
  return (
    <svg {...iconProps}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg {...iconProps} className="text-emerald-700">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function HeartIcon({ filled }) {
  return (
    <svg {...iconProps} fill={filled ? 'currentColor' : 'none'}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  )
}

function CompareIcon() {
  return (
    <svg {...iconProps}>
      <path d="M3 6h18M3 12h18M3 18h18" />
      <circle cx="8" cy="6" r="2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="12" r="2" fill="currentColor" stroke="none" />
      <circle cx="8" cy="18" r="2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default ResultCard
