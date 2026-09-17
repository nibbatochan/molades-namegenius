import React, { useState } from 'react'
import { QUESTIONS, availableTlds, domainFor, styleLabel, TLD_ORDER } from './data'
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
} from '@phosphor-icons/react'

// Shared shell with persistent skeuomorphic top pill navigation
function Shell({ title, meta, activeView, onBack, onNavigate, children }) {
  return (
    <div className="min-h-screen bg-hardware-canvas text-slate-900 selection:bg-blue-600 selection:text-white pb-24">
      {/* Sticky top navigation bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/90 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('brief')}
              className="flex items-center gap-2 text-base font-extrabold tracking-tight text-slate-900 transition-opacity duration-150 hover:opacity-80"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-black text-white shadow-skeuo-button">
                N
              </span>
              <span className="font-serif text-lg font-bold">NameGenius</span>
            </button>
            <span className="hidden rounded-md bg-slate-100/90 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700 sm:inline-block border border-slate-200 shadow-xs">
              MOD. NG-01 // STUDIO
            </span>
          </div>

          {/* Pill navigation cluster inside tactile socket recess */}
          {onNavigate && (
            <nav className="flex items-center gap-1 rounded-full border border-slate-300/80 bg-slate-200/60 p-1 text-xs shadow-inner">
              <button
                type="button"
                onClick={() => onNavigate('brief')}
                className={`rounded-full px-3 py-1 font-semibold transition-all duration-150 ${
                  activeView === 'brief'
                    ? 'bg-white font-bold text-blue-700 shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Generator
              </button>
              <button
                type="button"
                onClick={() => onNavigate('results')}
                className={`rounded-full px-3 py-1 font-semibold transition-all duration-150 ${
                  activeView === 'results'
                    ? 'bg-white font-bold text-blue-700 shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Results
              </button>
              <button
                type="button"
                onClick={() => onNavigate('shortlist')}
                className={`rounded-full px-3 py-1 font-semibold transition-all duration-150 ${
                  activeView === 'shortlist'
                    ? 'bg-white font-bold text-blue-700 shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Saved
              </button>
              <button
                type="button"
                onClick={() => onNavigate('compare')}
                className={`rounded-full px-3 py-1 font-semibold transition-all duration-150 ${
                  activeView === 'compare'
                    ? 'bg-white font-bold text-blue-700 shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Compare
              </button>
            </nav>
          )}

          {/* Secondary cluster: Back button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1 font-mono text-xs font-bold text-slate-700 hover:text-blue-700"
            >
              <ArrowLeft weight="bold" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 sm:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="font-serif text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h1>
          </div>
          {meta && (
            <span className="rounded-full border border-slate-300 bg-white px-3 py-1 font-mono text-xs font-bold text-slate-700 shadow-xs">
              {meta}
            </span>
          )}
        </div>

        <div className="mt-8">{children}</div>
      </main>
    </div>
  )
}

function TldStrip({ item }) {
  const tldMap = item.tlds || {}
  return (
    <div className="flex items-center gap-1.5 font-mono text-[11px]">
      {TLD_ORDER.map((t) => {
        const isAvail = Boolean(tldMap[t])
        return (
          <span
            key={t}
            className={`rounded px-1.5 py-0.5 font-bold border ${
              isAvail
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                : 'border-slate-200 bg-slate-100 text-slate-400 line-through'
            }`}
            title={`${t} is ${isAvail ? 'available' : 'taken'}`}
          >
            {t}
          </span>
        )
      })}
    </div>
  )
}

// S4 — Shortlist screen in Skeuomorphic Grid
export function Shortlist({ saved = [], onRemove, onBack, onNavigate }) {
  const [copiedSlug, setCopiedSlug] = useState(null)

  const handleCopy = (item) => {
    const domainText = domainFor(item, '.com')
    navigator.clipboard?.writeText?.(domainText)
    setCopiedSlug(item.slug)
    setTimeout(() => setCopiedSlug(null), 1800)
  }

  const handleSpeak = (name) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(name)
    utterance.rate = 0.88
    window.speechSynthesis.speak(utterance)
  }

  return (
    <Shell
      title="Saved Names"
      meta={saved.length > 0 ? `${saved.length} ${saved.length === 1 ? 'name' : 'names'} saved` : null}
      activeView="shortlist"
      onBack={onBack}
      onNavigate={onNavigate}
    >
      {copiedSlug && (
        <div className="fixed bottom-6 right-6 z-50 rounded-full bg-slate-900 px-4 py-2 font-mono text-xs font-bold text-white shadow-xl animate-toast">
          Domain copied to clipboard!
        </div>
      )}

      {saved.length === 0 ? (
        <div className="skeuo-plate rounded-3xl border-2 border-dashed border-slate-300 py-20 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
            <BookmarkSimple weight="fill" className="text-2xl" />
          </div>
          <h2 className="mt-4 font-serif text-xl font-extrabold text-slate-900">Your shortlist is empty</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-600">
            Save names from the results page to review and compare them here.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => onNavigate('results')}
              className="skeuo-button-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-mono text-xs font-bold"
            >
              <span>Browse Results</span>
              <ArrowRight weight="bold" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {saved.map((item, idx) => (
              <div
                key={item.slug}
                className="skeuo-card flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5"
              >
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <span className="font-mono text-xs font-bold text-blue-600">
                    #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-2xl font-black tracking-tight text-slate-900 deboss-light">
                        {item.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSpeak(item.name)}
                        className="rounded-lg p-1.5 text-slate-400 hover:text-slate-800"
                        title="Listen to pronunciation"
                      >
                        <SpeakerHigh weight="bold" className="text-sm" />
                      </button>
                    </div>
                    <div className="mt-0.5 font-mono text-xs font-semibold text-slate-500">
                      {domainFor(item, '.com')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <TldStrip item={item} />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(item)}
                      title={`Copy domain`}
                      className="skeuo-push-btn flex h-9 w-9 items-center justify-center rounded-xl text-slate-600"
                    >
                      {copiedSlug === item.slug ? <Check weight="bold" className="text-emerald-600" /> : <Copy weight="bold" />}
                    </button>
                    <a
                      href={`https://porkbun.com/checkout/search?q=${item.slug}.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="skeuo-push-btn flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:text-blue-600"
                      title="Check availability on Porkbun"
                    >
                      <ArrowSquareOut weight="bold" />
                    </a>
                    <button
                      type="button"
                      aria-label={`Remove ${item.name} from shortlist`}
                      onClick={() => onRemove(item)}
                      className="skeuo-push-btn flex h-9 w-9 items-center justify-center rounded-xl text-rose-600 hover:bg-rose-50"
                      title="Remove"
                    >
                      <Trash weight="bold" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => onNavigate('results')}
              className="inline-flex items-center gap-1 font-mono text-xs font-bold text-blue-700 hover:text-blue-800"
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

// S5 — Compare screen
export function Compare({ compareSel = [], onClear, onBack, onNavigate }) {
  if (compareSel.length < 2) {
    return (
      <Shell
        title="Compare Names"
        activeView="compare"
        onBack={onBack}
        onNavigate={onNavigate}
      >
        <div className="skeuo-plate rounded-3xl border-2 border-dashed border-slate-300 py-20 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <Scales weight="fill" className="text-2xl" />
          </div>
          <h2 className="mt-4 font-serif text-xl font-extrabold text-slate-900">
            Pick two names to compare
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-600">
            {compareSel.length === 1
              ? `Selected 1 name (${compareSel[0].name}). Pick one more to see a side-by-side comparison.`
              : 'Click the compare icon on any name card to compare length, rhythm, tone, and domain availability.'}
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => onNavigate('results')}
              className="skeuo-button-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-mono text-xs font-bold"
            >
              <span>Choose names from results</span>
              <ArrowRight weight="bold" />
            </button>
          </div>
        </div>
      </Shell>
    )
  }

  const rows = [
    { label: 'Domain preview', get: (i) => domainFor(i, '.com'), mono: true },
    {
      label: 'Available domains',
      get: (i) => {
        const t = availableTlds(i)
        return t.length ? t.join(', ') : 'None free'
      },
      mono: true,
    },
    { label: 'Character length', get: (i) => `${i.slug.length} characters` },
    { label: 'Syllable count', get: (i) => `${i.syllables || 2} syllables` },
    { label: 'Sound tone', get: (i) => i.phonetic?.label || 'Balanced tone' },
    { label: 'Naming style', get: (i) => styleLabel(i) },
  ]

  return (
    <Shell
      title="Compare Names"
      meta="2 names compared"
      activeView="compare"
      onBack={onBack}
      onNavigate={onNavigate}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {compareSel.map((item, col) => (
          <div
            key={item.slug}
            className="skeuo-card rounded-2xl p-7"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-blue-600">
                Option 0{col + 1}
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-slate-700">
                {styleLabel(item)}
              </span>
            </div>

            <div className="mt-4">
              <div className="font-serif text-3xl font-black tracking-tight text-slate-900 deboss-light">
                {item.name}
              </div>
              <div className="mt-1 font-mono text-sm font-bold text-blue-600">
                {domainFor(item, '.com')}
              </div>
            </div>

            <dl className="mt-6 space-y-4 divide-y divide-slate-100">
              {rows.map((row) => (
                <div key={row.label} className="pt-3 first:pt-0">
                  <dt className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {row.label}
                  </dt>
                  <dd
                    className={
                      'mt-1 text-sm font-semibold text-slate-900 ' +
                      (row.mono ? 'font-mono text-xs text-blue-800' : '')
                    }
                  >
                    {row.get(item)}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <a
                href={`https://porkbun.com/checkout/search?q=${item.slug}.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="skeuo-button-primary inline-flex w-full items-center justify-center gap-2 rounded-xl py-2.5 font-mono text-xs font-bold"
              >
                <span>Check {item.slug}.com on Porkbun</span>
                <ArrowSquareOut weight="bold" />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={onClear}
          className="font-mono text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors"
        >
          Clear comparison
        </button>

        <button
          type="button"
          onClick={() => onNavigate('results')}
          className="inline-flex items-center gap-1 font-mono text-xs font-bold text-blue-700 hover:text-blue-800"
        >
          <ArrowLeft weight="bold" />
          <span>Return to Results</span>
        </button>
      </div>
    </Shell>
  )
}
