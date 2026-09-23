import React, { useState } from 'react'
import { QUESTIONS, availableTlds, domainFor, styleLabel, TLD_ORDER } from './data'
import AppNavbar from './components/AppNavbar'
import DomainDetailModal from './components/DomainDetailModal'
import TactileCard from './components/TactileCard'
import TactileCompareLab from './components/TactileCompareLab'
import {
  BookmarkSimple,
  Scales,
  Trash,
  Copy,
  Check,
  SpeakerHigh,
  ArrowLeft,
  ArrowRight,
  Sparkle,
  ArrowSquareOut,
  Globe,
} from '@phosphor-icons/react'

// Shared shell with persistent tactile yellow AppNavbar
function Shell({
  title,
  meta,
  hideHeader = false,
  activeView,
  onBack,
  onNavigate,
  savedCount = 0,
  compareCount = 0,
  children,
}) {
  return (
    <div className="min-h-screen bg-hardware-canvas text-slate-900 selection:bg-blue-600 selection:text-white pb-24">
      {/* Sticky top navigation bar */}
      <div className="sticky top-0 z-30 pt-2 px-4 sm:px-8 lg:px-12">
        <AppNavbar
          activeView={activeView}
          onNavigate={onNavigate}
          savedCount={savedCount}
          compareCount={compareCount}
          rightExtra={
            onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="skeuo-push-btn inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-xs font-bold text-slate-900 border border-slate-950/20 bg-white/90 active:scale-95 cursor-pointer"
              >
                <ArrowLeft weight="bold" />
                <span className="hidden sm:inline">BACK</span>
              </button>
            ) : null
          }
        />
      </div>

      <main className="mx-auto max-w-5xl px-6 py-6 sm:px-8">
        {!hideHeader && (
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-normal uppercase tracking-tight text-slate-900">
                {title}
              </h1>
            </div>
            {meta && (
              <span className="rounded-full border border-slate-300 bg-white px-3 py-1 font-mono text-xs font-bold text-slate-700 shadow-xs">
                {meta}
              </span>
            )}
          </div>
        )}

        <div className={hideHeader ? 'mt-2' : 'mt-8'}>{children}</div>
      </main>
    </div>
  )
}

function TldStrip({ item, selectedTld = '.com', onSelectTld }) {
  const tldMap = item.tlds || {}
  return (
    <div className="flex flex-wrap items-center gap-1 font-mono text-[11px]">
      {TLD_ORDER.map((t) => {
        const isAvail = Boolean(tldMap[t])
        const isSelected = selectedTld === t
        return (
          <button
            key={t}
            type="button"
            onClick={() => onSelectTld?.(t)}
            className={`rounded-lg px-2 py-0.5 font-bold border transition-all cursor-pointer ${
              isSelected
                ? 'bg-slate-950 text-white border-slate-950 shadow-sm ring-1 ring-slate-950'
                : isAvail
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                : 'border-slate-200 bg-slate-100 text-slate-400 line-through'
            }`}
            title={`Select ${t} (${isAvail ? 'available' : 'taken'})`}
          >
            {t}
          </button>
        )
      })}
    </div>
  )
}

// S4 — Shortlist screen in Skeuomorphic Grid
export function Shortlist({
  saved = [],
  compareSel = [],
  onRemove,
  onToggleCompare,
  onBack,
  onNavigate,
}) {
  return (
    <Shell
      title="Saved Names"
      meta={saved.length > 0 ? `${saved.length} ${saved.length === 1 ? 'name' : 'names'} saved` : null}
      activeView="shortlist"
      onBack={onBack}
      onNavigate={onNavigate}
      savedCount={saved.length}
      compareCount={compareSel.length}
    >
      {saved.length === 0 ? (
        <div className="skeuo-plate rounded-3xl border-2 border-dashed border-slate-300 py-20 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
            <BookmarkSimple weight="fill" className="text-2xl" />
          </div>
          <h2 className="mt-4 font-display text-xl font-normal uppercase tracking-tight text-slate-900">Your shortlist is empty</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-600">
            Save names from the results page to review and compare them here.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => onNavigate('results')}
              className="skeuo-button-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-mono text-xs font-bold cursor-pointer"
            >
              <span>Browse Results</span>
              <ArrowRight weight="bold" />
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((item) => (
              <TactileCard
                key={item.slug}
                item={item}
                isSaved={true}
                isCompared={compareSel.some((c) => c.slug === item.slug)}
                onToggleSave={onRemove}
                onToggleCompare={onToggleCompare}
                selectedTld={item.tld || '.com'}
              />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => onNavigate('results')}
              className="inline-flex items-center gap-1 font-mono text-xs font-bold text-blue-700 hover:text-blue-800 cursor-pointer"
            >
              <ArrowLeft weight="bold" />
              <span>Return to Results</span>
            </button>
            <span className="font-mono text-xs text-slate-500">
              Saved in this browser session
            </span>
          </div>
        </div>
      )}
    </Shell>
  )
}

// S5 — Compare screen (Tactile Benchmark Console)
export function Compare(props) {
  const { saved = [], compareSel = [], onBack, onNavigate } = props
  return (
    <Shell
      title="Benchmark & Compare"
      hideHeader={true}
      activeView="compare"
      onBack={onBack}
      onNavigate={onNavigate}
      savedCount={saved.length}
      compareCount={compareSel.length}
    >
      <TactileCompareLab {...props} />
    </Shell>
  )
}

