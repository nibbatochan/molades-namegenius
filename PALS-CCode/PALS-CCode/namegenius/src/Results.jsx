import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import TactileCard from './components/TactileCard'
import CompareBench from './components/CompareBench'
import DiscoveryDrawer from './components/DiscoveryDrawer'
import AppNavbar from './components/AppNavbar'
import { generateNames, CINEMATIC_ARCHETYPES } from './generator'
import { fetchAINames } from './utils/geminiClient'
import { QUESTIONS, TLD_ORDER } from './data'
import { fetchAvailability } from './utils/availabilityClient'
import { playMechanicalClick } from './utils/audio'
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
  Robot,
  Warning,
} from '@phosphor-icons/react'

export default function Results({
  brief,
  saved = [],
  compareSel = [],
  generation = 0,
  resultsCache = null,
  onUpdateResultsCache,
  onRegenerate,
  onToggleSaved,
  onToggleCompare,
  onNewSearch,
  onNavigate,
}) {
  const briefKey = useMemo(() => JSON.stringify(brief || {}), [brief])
  const [answers, setAnswers] = useState(resultsCache?.answers || {})
  const answersKey = useMemo(() => JSON.stringify(answers || {}), [answers])

  const isCacheValid =
    resultsCache &&
    resultsCache.briefKey === briefKey &&
    resultsCache.generation === generation &&
    resultsCache.answersKey === answersKey

  const [filters, setFilters] = useState(isCacheValid?.filters || ['all'])
  const [dismissedQuestion, setDismissedQuestion] = useState(false)
  const [showDiscoveryDrawer, setShowDiscoveryDrawer] = useState(() => generation >= 3)
  const [copiedDomain, setCopiedDomain] = useState(null)
  const [activeStem, setActiveStem] = useState(null)
  const [registry, setRegistry] = useState(isCacheValid?.registry || {})

  // AI generation state (read from cache if navigating back to results)
  const [aiItems, setAiItems] = useState(isCacheValid ? resultsCache.aiItems : null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState(isCacheValid ? resultsCache.aiError : null)
  const fetchIdRef = useRef(0)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    if (document.documentElement) document.documentElement.scrollTop = 0
    if (document.body) document.body.scrollTop = 0
    if (generation >= 3 && !dismissedQuestion) {
      setShowDiscoveryDrawer(true)
    }
  }, [generation, dismissedQuestion])

  // Trigger Gemini/Groq fetch on brief, generation, or answers change
  useEffect(() => {
    if (!brief) return
    if (
      resultsCache &&
      resultsCache.briefKey === briefKey &&
      resultsCache.generation === generation &&
      resultsCache.answersKey === answersKey &&
      (resultsCache.aiItems || resultsCache.aiError)
    ) {
      // Results already cached from previous view — preserve without re-fetching
      return
    }

    const id = ++fetchIdRef.current
    setAiLoading(true)
    setAiError(null)
    setAiItems(null)

    fetchAINames({ ...brief, answers })
      .then((names) => {
        if (fetchIdRef.current !== id) return // stale
        setAiItems(names)
        setAiLoading(false)
        onUpdateResultsCache?.((prev) => ({
          ...prev,
          briefKey,
          answersKey,
          generation,
          aiItems: names,
          aiError: null,
          registry: prev?.registry || {},
          filters,
          answers,
        }))
      })
      .catch((err) => {
        if (fetchIdRef.current !== id) return
        const isTimeout = err?.name === 'AbortError' || err?.message?.includes('timeout')
        const errType = isTimeout ? 'timeout' : 'fallback'
        setAiError(errType)
        setAiLoading(false)
        setAiItems(null) // will fall back to local generator
        onUpdateResultsCache?.((prev) => ({
          ...prev,
          briefKey,
          answersKey,
          generation,
          aiItems: null,
          aiError: errType,
          registry: prev?.registry || {},
          filters,
          answers,
        }))
      })
  }, [briefKey, generation, answersKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleFilter = (filterId) => {
    if (filterId === 'all') {
      setFilters(['all'])
      return
    }
    setFilters((prev) => {
      const withoutAll = prev.filter((x) => x !== 'all')
      const exists = withoutAll.includes(filterId)
      const next = exists ? withoutAll.filter((x) => x !== filterId) : [...withoutAll, filterId]
      return next.length === 0 ? ['all'] : next
    })
  }

  const handleCopy = (domain, e) => {
    e?.stopPropagation()
    if (!domain) return
    navigator.clipboard.writeText(domain)
    setCopiedDomain(domain)
    setTimeout(() => setCopiedDomain(null), 2000)
  }

  // Local fallback: computed deterministically
  const localItems = useMemo(() => {
    return generateNames(brief, generation, answers)
  }, [brief, generation, answers])

  // Primary source: AI results when available, local generator as silent fallback
  const allItems = aiItems && aiItems.length > 0 ? aiItems : localItems

  const hasKeyword = Boolean(brief?.name && brief.name.trim().length > 0)
  const cleanSeed = hasKeyword ? brief.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '') : ''

  const exactDomains = useMemo(() => {
    if (!cleanSeed) return []
    return ['.com', '.io', '.ai', '.co'].map((ext) => `${cleanSeed}${ext}`)
  }, [cleanSeed])

  // Rich set of brand hacks and prefix/suffix variations
  const brandHackDomains = useMemo(() => {
    if (!cleanSeed) return []
    return [
      `get${cleanSeed}.com`,
      `try${cleanSeed}.com`,
      `use${cleanSeed}.com`,
      `join${cleanSeed}.com`,
      `${cleanSeed}labs.com`,
      `${cleanSeed}hq.com`,
      `${cleanSeed}app.com`,
      `${cleanSeed}hub.com`,
      `${cleanSeed}flow.com`,
      `${cleanSeed}sync.com`,
      `the${cleanSeed}.com`,
      `${cleanSeed}craft.com`,
      `meta${cleanSeed}.com`,
      `${cleanSeed}base.com`,
    ]
  }, [cleanSeed])

  const slugKey = allItems.map((item) => item.slug).join('|')

  useEffect(() => {
    if (aiLoading || !slugKey) return
    const domains = [
      ...allItems.flatMap((item) => TLD_ORDER.map((ext) => `${item.slug}${ext}`)),
      ...exactDomains,
      ...brandHackDomains,
    ]
    let cancel = false
    fetchAvailability(domains)
      .then((map) => {
        if (!cancel) {
          setRegistry((prev) => ({ ...prev, ...map }))
          onUpdateResultsCache?.((prev) => prev ? ({ ...prev, registry: { ...prev.registry, ...map } }) : prev)
        }
      })
      .catch(() => {
        if (cancel) return
        const failed = {}
        for (const domain of domains) failed[domain] = 'unknown'
        setRegistry((prev) => ({ ...prev, ...failed }))
      })
    return () => {
      cancel = true
    }
  }, [slugKey, aiLoading, exactDomains, brandHackDomains]) // eslint-disable-line react-hooks/exhaustive-deps

  const itemsWithRegistry = useMemo(() => {
    return allItems.map((item) => ({
      ...item,
      availability: Object.fromEntries(
        TLD_ORDER.map((ext) => [ext, registry[`${item.slug}${ext}`] || 'checking'])
      ),
    }))
  }, [allItems, registry])

  const relatedRoots = useMemo(() => {
    return ['pulse', 'flow', 'core', 'shift', 'prime', 'base']
  }, [])

  // Multi-select filtered items with comprehensive categories
  const filteredItems = useMemo(() => {
    return itemsWithRegistry.filter((item) => {
      if (filters.includes('all') || filters.length === 0) return true
      if (filters.includes('com') && item.availability['.com'] !== 'available') return false
      if (filters.includes('ai') && item.availability['.ai'] !== 'available') return false
      if (filters.includes('io') && item.availability['.io'] !== 'available') return false
      if (filters.includes('co') && item.availability['.co'] !== 'available') return false
      if (filters.includes('short') && item.slug.length > 6) return false
      if (filters.includes('one_syl') && (item.syllables || 2) !== 1) return false
      if (filters.includes('two_syl') && (item.syllables || 2) !== 2) return false
      if (filters.includes('punchy') && !(item.phonetic?.profile === 'kiki' || item.phonetic?.profile === 'punchy')) return false
      if (filters.includes('smooth') && !(item.phonetic?.profile === 'bouba' || item.phonetic?.profile === 'smooth')) return false
      if (filters.includes('saved') && !saved.some((s) => s.slug === item.slug)) return false
      return true
    })
  }, [itemsWithRegistry, filters, saved])

  const selectedTld = brief?.tld || '.com'
  const availableCount = itemsWithRegistry.filter((i) => i.availability?.[selectedTld] === 'available').length
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
      {/* Top Sticky Navigation Bar */}
      <div className="sticky top-0 z-30 pt-2 px-4 sm:px-8 lg:px-12">
        <AppNavbar
          activeView="results"
          onNavigate={onNavigate}
          savedCount={saved.length}
          compareCount={compareSel.length}
          resultsCount={allItems.length}
          rightExtra={
            <button
              type="button"
              onClick={onNewSearch}
              className="skeuo-push-btn inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-xs font-bold text-slate-900 border border-slate-950/20 bg-white/90 active:scale-95 cursor-pointer"
            >
              <ArrowLeft weight="bold" />
              <span className="hidden sm:inline">EDIT BRIEF</span>
            </button>
          }
        />
      </div>

      {/* Main Results Container */}
      <main className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        {/* Telemetry Hardware Chassis Deck (Purple Header) */}
        <div className="skeuo-chassis relative overflow-hidden rounded-[28px] p-5 sm:p-6 shadow-xl text-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
                {hasKeyword ? (
                  <>
                    Generated names for{' '}
                    <span className="rounded-xl bg-slate-950/80 px-3 py-0.5 text-[#fae127] border border-purple-400/40 shadow-inner">
                      "{brief.name.trim()}"
                    </span>
                  </>
                ) : (
                  <span>Generated brand names</span>
                )}
              </h1>
            </div>

            {/* Action Buttons: Terracotta Push Button for Next Batch */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onRegenerate}
                disabled={aiLoading}
                className="skeuo-button-terracotta inline-flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-bold tracking-wider uppercase text-white active:scale-95 shadow-md group cursor-pointer disabled:opacity-50 disabled:cursor-wait"
              >
                <ArrowsClockwise weight="bold" className={`text-sm transition-transform duration-500 ${aiLoading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                <span className="deboss-dark">{aiLoading ? 'Generating…' : `Next Batch (#${generation + 1})`}</span>
              </button>
            </div>
          </div>

          {/* Structured Exact & High-Converting Variations Tray */}
          {hasKeyword && cleanSeed.length > 0 && (
            <div className="mt-4 pt-3.5 border-t border-purple-400/30 space-y-2.5">
              {/* Row 1: Exact Domain Matches */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-purple-200">
                    Exact Matches
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {exactDomains.map((domain) => {
                    const status = registry[domain] || 'checking'
                    const open = status === 'available'
                    return (
                      <div
                        key={domain}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950/90 border border-amber-400/50 px-2.5 py-1 text-[11px] font-mono shadow-sm"
                      >
                        <span
                          className={`h-2 w-2 rounded-full shrink-0 ${
                            open
                              ? 'bg-emerald-400 led-glow-emerald'
                              : status === 'taken'
                              ? 'bg-rose-400'
                              : 'bg-amber-400 animate-pulse'
                          }`}
                        />
                        <span className="font-black text-amber-200">{domain}</span>
                        {open ? (
                          <a
                            href={`https://www.namecheap.com/domains/registration/results/?domain=${domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-300 hover:text-emerald-100 uppercase"
                          >
                            Buy ↗
                          </a>
                        ) : (
                          <span className="ml-1 text-[9px] text-slate-400 font-semibold uppercase">
                            {status === 'taken' ? 'Taken' : '…'}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => handleCopy(domain, e)}
                          className="ml-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Copy domain"
                        >
                          {copiedDomain === domain ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Row 2: Popular Brand Variations & Prefixes (Clean Grid/Wrap) */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-purple-200">
                    High-Converting Brand Variations ({brandHackDomains.length})
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 max-h-[108px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-purple-500/40">
                  {brandHackDomains.map((domain) => {
                    const status = registry[domain] || 'checking'
                    const open = status === 'available'
                    return (
                      <div
                        key={domain}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900/90 border border-purple-400/30 px-2 py-0.5 text-[10.5px] font-mono shadow-xs"
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                            open
                              ? 'bg-emerald-400'
                              : status === 'taken'
                              ? 'bg-rose-400/80'
                              : 'bg-amber-400'
                          }`}
                        />
                        <span className="font-medium text-slate-100">{domain}</span>
                        {open ? (
                          <a
                            href={`https://www.namecheap.com/domains/registration/results/?domain=${domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-0.5 inline-flex items-center gap-0.5 text-[8.5px] font-bold text-emerald-300 hover:text-emerald-100 uppercase"
                          >
                            Buy ↗
                          </a>
                        ) : (
                          <span className="ml-0.5 text-[8.5px] text-slate-400 font-semibold uppercase">
                            {status === 'taken' ? 'Taken' : '…'}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => handleCopy(domain, e)}
                          className="ml-0.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Copy domain"
                        >
                          {copiedDomain === domain ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Quick Filter Pill Rack */}
          <div className="mt-3.5 flex flex-wrap items-center gap-1.5 pt-3 border-t border-purple-400/30">
            <span className="font-mono text-[10.5px] font-black text-purple-200 mr-1 uppercase tracking-wider">Filter:</span>
            {[
              { id: 'all', label: `All (${allItems.length})` },
              { id: 'com', label: `.com (${itemsWithRegistry.filter((i) => i.availability['.com'] === 'available').length})` },
              { id: 'ai', label: `.ai (${itemsWithRegistry.filter((i) => i.availability['.ai'] === 'available').length})` },
              { id: 'io', label: `.io (${itemsWithRegistry.filter((i) => i.availability['.io'] === 'available').length})` },
              { id: 'co', label: `.co (${itemsWithRegistry.filter((i) => i.availability['.co'] === 'available').length})` },
              { id: 'short', label: 'Short (≤6)' },
              { id: 'one_syl', label: '1 Syl' },
              { id: 'two_syl', label: '2 Syl' },
              { id: 'punchy', label: '⚡ Punchy' },
              { id: 'smooth', label: '☁ Smooth' },
              { id: 'saved', label: `★ Saved (${saved.length})` },
            ].map((f) => {
              const isActive = filters.includes(f.id)
              return (
                <div key={f.id} className="key-socket-dark !p-[1px] !rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleToggleFilter(f.id)}
                    className={`key-cap !rounded-md px-2.5 py-1 font-mono text-[11px] transition-all cursor-pointer ${
                      isActive
                        ? 'key-cap-active-dark ring-1 ring-amber-400 text-amber-300 font-black'
                        : 'text-slate-950 hover:text-black font-black'
                    }`}
                  >
                    {f.label}
                  </button>
                </div>
              )
            })}

            {/* Diagnostic Console Button — High Contrast Dark Mechanical Button */}
            <div className="key-socket-dark !p-[1.5px] !rounded-lg ml-auto">
              <button
                type="button"
                onClick={() => {
                  try { playMechanicalClick('click') } catch {}
                  setShowDiscoveryDrawer((prev) => !prev)
                }}
                title="Open 7-question strategic brand discovery diagnostic"
                className={`key-cap-active-dark !rounded-md px-3.5 py-1.5 font-mono text-[11px] font-black transition-all cursor-pointer flex items-center gap-1.5 text-white hover:text-amber-300 active:scale-95 shadow-md ${
                  showDiscoveryDrawer ? 'ring-2 ring-amber-400' : 'ring-1 ring-slate-600'
                }`}
              >
                <SlidersHorizontal weight="bold" className="text-xs shrink-0 text-amber-400" />
                <span className="text-white font-black">{generation >= 3 ? 'Tune Preferences (3+ Rerolls)' : 'Tune Preferences'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Strategic Diagnostic Discovery Console (Modal with blur behind) */}
        {showDiscoveryDrawer && (
          <DiscoveryDrawer
            initialAnswers={answers}
            onApplyAnswers={(newAnswers) => {
              setAnswers(newAnswers)
              setShowDiscoveryDrawer(false)
              onUpdateResultsCache?.(null) // invalidate previous cache to force re-synthesis
              onRegenerate?.(newAnswers)
            }}
            onClose={() => {
              setDismissedQuestion(true)
              setShowDiscoveryDrawer(false)
            }}
            onDismiss={() => {
              setDismissedQuestion(true)
              setShowDiscoveryDrawer(false)
            }}
          />
        )}

        {/* Tactile Cards Grid — Loading Skeleton while AI fetches */}
        {aiLoading ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="skeuo-plate rounded-2xl p-5 animate-pulse"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="h-8 w-3/4 rounded-xl bg-slate-300/60 mb-3" />
                <div className="h-3 w-1/2 rounded bg-slate-200/70 mb-2" />
                <div className="h-3 w-2/3 rounded bg-slate-200/50 mb-5" />
                <div className="flex gap-2">
                  <div className="h-7 flex-1 rounded-lg bg-slate-200/60" />
                  <div className="h-7 flex-1 rounded-lg bg-slate-200/40" />
                </div>
              </div>
            ))}
          </div>
        ) : (
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
                  rationale={item.rationale || null}
                />
              )
            })}
          </div>
        )}

        {!aiLoading && filteredItems.length === 0 && (
          <div className="skeuo-plate mt-8 rounded-2xl p-12 text-center text-slate-500">
            <Sparkle weight="thin" className="mx-auto text-4xl text-slate-400 mb-2" />
            <div className="font-display text-lg font-normal uppercase tracking-tight text-slate-800">No names match this filter</div>
            <p className="mt-1 font-sans text-xs text-slate-500">
              Try selecting "All" or click "Generate more names" for a fresh batch.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
