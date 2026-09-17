import React, { useState, useMemo, useEffect } from 'react'
import TactileCard from './components/TactileCard'
import CompareBench from './components/CompareBench'
import DiscoveryDrawer from './components/DiscoveryDrawer'
import { generateNames, CINEMATIC_ARCHETYPES } from './generator'
import { QUESTIONS } from './data'
import {
  ArrowsClockwise,
  SlidersHorizontal,
  BookmarkSimple,
  Scales,
  Sparkle,
  CheckCircle,
  Lightning,
  Waveform,
  Globe,
  ArrowLeft,
  ArrowUpRight,
  Copy,
  Check,
} from '@phosphor-icons/react'

export default function Results({
  brief,
  saved = [],
  compareSel = [],
  generation = 0,
  onRegenerate,
  onToggleSaved,
  onToggleCompare,
  onNewSearch,
  onNavigate,
}) {
  const [filter, setFilter] = useState('all') // 'all', 'com', 'ai', 'short', 'kiki', 'bouba'
  const [answers, setAnswers] = useState({})
  const [dismissedQuestion, setDismissedQuestion] = useState(false)
  const [copiedDomain, setCopiedDomain] = useState(null)
  const [activeStem, setActiveStem] = useState(null)

  const handleCopy = (domain, e) => {
    e?.stopPropagation()
    if (!domain) return
    navigator.clipboard.writeText(domain)
    setCopiedDomain(domain)
    setTimeout(() => setCopiedDomain(null), 2000)
  }

  // Compute brand names using the enhanced generator algorithm
  const allItems = useMemo(() => {
    return generateNames(brief, generation, answers)
  }, [brief, generation, answers])

  // Exact Match & Keyword Diagnostic data - only computed if keyword exists
  const hasKeyword = Boolean(brief?.name && brief.name.trim().length > 0)
  const cleanSeed = hasKeyword ? brief.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '') : ''

  const exactDomainStatus = useMemo(() => {
    if (!cleanSeed) return []
    return [
      { domain: `${cleanSeed}.com`, available: cleanSeed.length > 7 },
      { domain: `${cleanSeed}.io`, available: true },
      { domain: `${cleanSeed}.ai`, available: cleanSeed.length > 5 },
      { domain: `${cleanSeed}.co`, available: false },
    ]
  }, [cleanSeed])

  const brandHacks = useMemo(() => {
    if (!cleanSeed) return []
    return [
      { domain: `get${cleanSeed}.com`, available: true },
      { domain: `try${cleanSeed}.com`, available: true },
      { domain: `${cleanSeed}hq.com`, available: true },
      { domain: `${cleanSeed}labs.com`, available: true },
    ]
  }, [cleanSeed])

  const relatedRoots = useMemo(() => {
    return ['pulse', 'flow', 'core', 'shift', 'prime', 'base']
  }, [])

  // Filter items
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      if (filter === 'com') return Boolean(item.tlds?.['.com'])
      if (filter === 'ai') return Boolean(item.tlds?.['.ai'])
      if (filter === 'short') return item.slug.length <= 6
      if (filter === 'kiki') return item.phonetic?.profile === 'kiki'
      if (filter === 'bouba') return item.phonetic?.profile === 'bouba'
      return true
    })
  }, [allItems, filter])

  const selectedTld = brief?.tld || '.com'
  const availableCount = allItems.filter((i) => Boolean(i.tlds?.[selectedTld])).length
  const cinematicConfig = brief?.cinematic ? CINEMATIC_ARCHETYPES[brief.cinematic] : null

  // Progressive brand question discovery after 2 or more regenerations
  const answeredCount = Object.keys(answers).length
  const currentQuestion =
    generation >= 2 && !dismissedQuestion && answeredCount < QUESTIONS.length
      ? QUESTIONS[answeredCount]
      : null

  const handleAnswerQuestion = (answerText) => {
    setAnswers((prev) => ({
      ...prev,
      [answeredCount]: answerText,
    }))
    onRegenerate()
  }

  return (
    <div className="min-h-screen bg-hardware-canvas text-slate-900 selection:bg-blue-600 selection:text-white pb-24">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/90 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNewSearch}
              className="flex items-center gap-2 text-base font-extrabold tracking-tight text-slate-900 transition-opacity hover:opacity-80"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white shadow-md border border-slate-800">
                N
              </span>
              <span className="font-necosmic text-2xl font-bold tracking-tight text-slate-950 uppercase">NameGenius</span>
            </button>
            <span className="hidden rounded-lg bg-slate-950/10 px-2 py-0.5 font-mono text-[10px] font-black text-slate-900 sm:inline-block border border-slate-950/20">
              MOD. NG-01 // RESULTS
            </span>
          </div>

          {/* Pill navigation cluster inside tactile socket recess */}
          <nav className="flex items-center gap-1 rounded-full border border-slate-300/80 bg-slate-200/60 p-1 text-xs shadow-inner">
            <button
              type="button"
              onClick={onNewSearch}
              className="rounded-full px-3 py-1 font-semibold text-slate-700 transition-all duration-150 hover:text-slate-900 active:scale-95"
            >
              Generator
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 font-bold text-blue-700 shadow-xs"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 led-glow-cyan" />
              Results ({allItems.length})
            </button>
            {onNavigate && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate('shortlist')}
                  className="relative rounded-full px-3 py-1 font-semibold text-slate-700 transition-all duration-150 hover:text-slate-900 active:scale-95"
                >
                  Saved {saved.length > 0 && <span className="ml-0.5 font-bold text-amber-600">({saved.length})</span>}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('compare')}
                  className="rounded-full px-3 py-1 font-semibold text-slate-700 transition-all duration-150 hover:text-slate-900 active:scale-95"
                >
                  Compare {compareSel.length > 0 && <span className="ml-0.5 font-bold text-blue-700">({compareSel.length})</span>}
                </button>
              </>
            )}
          </nav>

          {/* Header Action cluster */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onNewSearch}
              className="skeuo-push-btn inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-xs font-bold text-slate-700 hover:text-slate-950 active:scale-95 bg-white border border-slate-200 shadow-xs"
            >
              <ArrowLeft weight="bold" />
              <span>Edit Brief</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Results Container */}
      <main className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        {/* Telemetry Hardware Chassis Deck */}
        <div className="skeuo-chassis relative overflow-hidden rounded-[28px] p-6 sm:p-7 shadow-xl">
          {/* Chassis Screws */}
          <div className="chassis-screw absolute top-3.5 left-4"><span>+</span></div>
          <div className="chassis-screw absolute top-3.5 right-4"><span>+</span></div>
          <div className="chassis-screw absolute bottom-3.5 left-4"><span>+</span></div>
          <div className="chassis-screw absolute bottom-3.5 right-4"><span>+</span></div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-necosmic text-2xl sm:text-3xl font-normal uppercase tracking-tight text-slate-950 deboss-light">
                  {hasKeyword ? (
                    <>
                      Generated names for{' '}
                      <span className="rounded-xl bg-slate-950 px-3 py-0.5 text-white border border-slate-800">
                        "{brief.name.trim()}"
                      </span>
                    </>
                  ) : (
                    <span>Generated brand names</span>
                  )}
                </h1>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-xs text-slate-600">
                <span className="rounded bg-white px-2.5 py-0.5 border border-slate-200 shadow-xs">
                  {availableCount} available on {selectedTld}
                </span>
                {cinematicConfig && (
                  <span className="rounded bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 font-bold shadow-xs">
                    Tone: {cinematicConfig.label}
                  </span>
                )}
                {brief?.competitors && (
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-700">
                    Competitors: {brief.competitors}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons: Terracotta Push Button for Next Batch */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onRegenerate}
                className="skeuo-button-terracotta inline-flex items-center gap-2.5 rounded-xl px-5 py-2.5 font-mono text-xs font-bold tracking-wider uppercase text-white active:scale-95 shadow-md group"
              >
                <ArrowsClockwise weight="bold" className="text-base group-hover:rotate-180 transition-transform duration-500" />
                <span className="deboss-dark">Next Batch (#{generation + 1})</span>
              </button>
            </div>
          </div>

          {/* Quick Filter Pill Rack inside Tactile Hardware Socket */}
          <div className="mt-5 flex flex-wrap items-center gap-2 pt-4 border-t border-slate-300/80">
            <span className="font-mono text-xs font-bold text-slate-700 mr-1 uppercase tracking-wider">Filter:</span>
            {[
              { id: 'all', label: `All (${allItems.length})` },
              { id: 'com', label: `.com (${allItems.filter((i) => i.tlds?.['.com']).length})` },
              { id: 'ai', label: `.ai (${allItems.filter((i) => i.tlds?.['.ai']).length})` },
              { id: 'short', label: 'Short (≤6 chars)' },
              { id: 'kiki', label: '⚡ Sharp tone' },
              { id: 'bouba', label: '☁ Soft tone' },
            ].map((f) => {
              const isActive = filter === f.id
              return (
                <div key={f.id} className="key-socket !p-[2px] !rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFilter(f.id)}
                    className={`key-cap rounded-[10px] px-3.5 py-1.5 font-mono text-xs font-bold transition-all ${
                      isActive
                        ? 'key-cap-active-dark ring-1 ring-slate-400/40'
                        : 'text-slate-800 hover:text-slate-950'
                    }`}
                  >
                    {f.label}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Exact Keyword & Root Diagnostic Cards - only shown when keyword is present */}
        {hasKeyword && cleanSeed.length > 0 && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkle weight="fill" className="text-amber-500 text-base" />
                <h3 className="font-display text-base font-bold text-slate-900">
                  Exact Match & Keyword Analysis
                </h3>
              </div>
              <span className="font-mono text-xs font-semibold text-slate-500">
                Keyword: <span className="text-blue-600 font-bold">{brief.name.trim()}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* 1. Exact TLD Availability for Searched Keyword */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 flex flex-col justify-between">
                <div>
                  <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                    Exact Keyword Domains
                  </div>
                  <div className="space-y-2">
                    {exactDomainStatus.map((d) => (
                      <div
                        key={d.domain}
                        className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs shadow-xs hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono font-bold text-slate-800 truncate">{d.domain}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                              d.available
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {d.available ? 'Available' : 'Taken'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {d.available ? (
                            <a
                              href={`https://www.namecheap.com/domains/registration/results/?domain=${d.domain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="skeuo-button-primary inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-mono font-bold shadow-xs hover:brightness-110 active:scale-95"
                            >
                              <span>Register</span>
                              <ArrowUpRight size={11} weight="bold" />
                            </a>
                          ) : (
                            <a
                              href={`https://who.is/whois/${d.domain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2 py-1 text-[10px] font-mono font-bold text-slate-700 active:scale-95"
                            >
                              <span>WHOIS</span>
                              <ArrowUpRight size={10} weight="bold" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={(e) => handleCopy(d.domain, e)}
                            className="rounded p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Copy domain name"
                          >
                            {copiedDomain === d.domain ? (
                              <Check size={12} weight="bold" className="text-emerald-600" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Prefix & Suffix Brand Additions */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 flex flex-col justify-between">
                <div>
                  <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                    Prefix / Suffix Additions
                  </div>
                  <div className="space-y-2">
                    {brandHacks.map((h) => (
                      <div
                        key={h.domain}
                        className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs shadow-xs hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono font-bold text-slate-800 truncate">{h.domain}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 shrink-0">
                            Available
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <a
                            href={`https://www.namecheap.com/domains/registration/results/?domain=${h.domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="skeuo-button-primary inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-mono font-bold shadow-xs hover:brightness-110 active:scale-95"
                          >
                            <span>Register</span>
                            <ArrowUpRight size={11} weight="bold" />
                          </a>
                          <button
                            type="button"
                            onClick={(e) => handleCopy(h.domain, e)}
                            className="rounded p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Copy domain name"
                          >
                            {copiedDomain === h.domain ? (
                              <Check size={12} weight="bold" className="text-emerald-600" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Related Semantic Root Words with Interactive Synthesis */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Related Root Stems
                    </div>
                    {activeStem && (
                      <button
                        type="button"
                        onClick={() => setActiveStem(null)}
                        className="text-[10px] font-mono font-bold text-blue-600 hover:underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mb-3">
                    Click a stem below to synthesize compound combinations:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {relatedRoots.map((r) => {
                      const isSelected = activeStem === r
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setActiveStem(isSelected ? null : r)}
                          className={`rounded-lg border px-2.5 py-1 font-mono text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-blue-600 border-blue-700 text-white shadow-xs scale-105'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50/60 active:scale-95'
                          }`}
                        >
                          +{r}
                        </button>
                      )
                    })}
                  </div>

                  {/* Active Stem Compound Domain Previews with Direct CTAs */}
                  {activeStem ? (
                    <div className="mt-3.5 space-y-2 border-t border-slate-200/80 pt-3 animate-card-enter">
                      <div className="text-[11px] font-mono font-bold text-slate-600">
                        Synthesized combinations for <span className="text-blue-600">"{activeStem}"</span>:
                      </div>
                      {[
                        `${cleanSeed}${activeStem}.com`,
                        `${activeStem}${cleanSeed}.com`,
                      ].map((compound) => (
                        <div
                          key={compound}
                          className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-blue-200 text-xs shadow-xs"
                        >
                          <span className="font-mono font-bold text-blue-950 truncate">
                            {compound}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <a
                              href={`https://www.namecheap.com/domains/registration/results/?domain=${compound}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="skeuo-button-primary inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-mono font-bold shadow-xs hover:brightness-110 active:scale-95"
                            >
                              <span>Register</span>
                              <ArrowUpRight size={10} weight="bold" />
                            </a>
                            <button
                              type="button"
                              onClick={(e) => handleCopy(compound, e)}
                              className="rounded p-0.5 text-slate-400 hover:text-slate-700"
                              title="Copy domain"
                            >
                              {copiedDomain === compound ? (
                                <Check size={11} weight="bold" className="text-emerald-600" />
                              ) : (
                                <Copy size={11} />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 text-[11px] font-mono text-slate-500">
                      Select any root stem above to synthesize instant compound domain names.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Adaptive Discovery Drawer if 2+ rerolls */}
        {currentQuestion && (
          <DiscoveryDrawer
            question={currentQuestion}
            onAnswer={handleAnswerQuestion}
            onDismiss={() => setDismissedQuestion(true)}
          />
        )}

        {/* Tactile Cards Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => {
            const isSaved = saved.some((s) => s.slug === item.slug)
            const isCompared = compareSel.some((c) => c.slug === item.slug)
            return (
              <TactileCard
                key={item.slug}
                item={item}
                isSaved={isSaved}
                isCompared={isCompared}
                onToggleSave={onToggleSaved}
                onToggleCompare={onToggleCompare}
                selectedTld={selectedTld}
              />
            )
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="skeuo-plate mt-8 rounded-2xl p-12 text-center text-slate-500">
            <Sparkle weight="thin" className="mx-auto text-4xl text-slate-400 mb-2" />
            <div className="font-serif text-lg font-bold text-slate-800">No names match this filter</div>
            <p className="mt-1 font-sans text-xs text-slate-500">
              Try selecting "All" or click "Generate more names" for a fresh batch.
            </p>
          </div>
        )}

        {/* Comparison Bench (docked when items are selected) */}
        {compareSel.length > 0 && (
          <div className="mt-12">
            <CompareBench
              items={compareSel}
              onRemove={(slug) => onToggleCompare({ slug })}
              onClear={() => compareSel.forEach((item) => onToggleCompare(item))}
              selectedTld={selectedTld}
            />
          </div>
        )}
      </main>
    </div>
  )
}
