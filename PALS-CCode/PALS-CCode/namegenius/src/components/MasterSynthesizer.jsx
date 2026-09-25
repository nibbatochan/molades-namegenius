import React, { useState } from 'react'
import {
  Globe,
  Check,
  Waveform,
  Lightning,
  Sparkle,
  ArrowRight,
  X,
} from '@phosphor-icons/react'
import { BRAND_VIBES } from '../generator'
import { TLD_ORDER, COUNTRY_TLDS } from '../data'
import { playMechanicalClick } from '../utils/audio'

export default function MasterSynthesizer({
  initialBrief,
  onGenerate,
  isGenerating,
  onOpenModal,
  onClose,
}) {
  const [hasNameInMind, setHasNameInMind] = useState(
    initialBrief?.name ? true : initialBrief?.description ? false : true
  )
  const [name, setName] = useState(initialBrief?.name || '')
  const [description, setDescription] = useState(initialBrief?.description || '')
  const [competitors, setCompetitors] = useState(initialBrief?.competitors || '')
  const [selectedTlds, setSelectedTlds] = useState(initialBrief?.tlds || ['.com', '.io', '.ai'])
  const [vibe, setVibe] = useState(initialBrief?.cinematic || 'minimal')
  const [maxSyllables, setMaxSyllables] = useState(initialBrief?.maxSyllables || 0)
  const [antiPatterns, setAntiPatterns] = useState(
    initialBrief?.antiPatterns || { noLy: true, noGenericSaaS: true }
  )
  const [acousticBias, setAcousticBias] = useState(initialBrief?.acousticBias || 50)
  const [error, setError] = useState('')
  const [customTlds, setCustomTlds] = useState([])
  const [isAddingTld, setIsAddingTld] = useState(false)
  const [newTldInput, setNewTldInput] = useState('')
  const [showCountryPicker, setShowCountryPicker] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')

  const handleTldToggle = (ext) => {
    playMechanicalClick('click')
    if (selectedTlds.includes(ext)) {
      if (selectedTlds.length > 1) {
        setSelectedTlds(selectedTlds.filter((t) => t !== ext))
      }
    } else {
      setSelectedTlds([...selectedTlds, ext])
    }
  }

  const handleAddCustomTld = (e) => {
    e?.preventDefault()
    let ext = newTldInput.trim().toLowerCase()
    if (!ext) return
    if (!ext.startsWith('.')) ext = '.' + ext
    if (!/^\.[a-z0-9-]+$/.test(ext)) return
    if (!TLD_ORDER.includes(ext) && !customTlds.includes(ext)) {
      setCustomTlds((prev) => [...prev, ext])
      setSelectedTlds((prev) => [...prev, ext])
      playMechanicalClick('click')
    }
    setNewTldInput('')
    setIsAddingTld(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (hasNameInMind) {
      if (!name.trim() || name.trim().length < 2) {
        setError('Please enter at least 2 characters for your name or keyword.')
        const el = document.getElementById('seed-input')
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el.focus()
        }
        return
      }
    } else {
      if (!description.trim() && !name.trim()) {
        setError('Please describe what your product or business is building.')
        const el = document.getElementById('context-input')
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el.focus()
        }
        return
      }
    }
    setError('')
    playMechanicalClick('heavy')
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    if (document.documentElement) document.documentElement.scrollTop = 0
    if (document.body) document.body.scrollTop = 0
    onGenerate({
      name: name.trim(),
      description: description.trim(),
      competitors: competitors.trim(),
      tld: selectedTlds[0] || '.com',
      tlds: selectedTlds,
      cinematic: vibe,
      maxSyllables,
      antiPatterns,
      acousticBias,
    })
  }

  return (
    <div id="master-synthesizer-console" className="relative mx-auto max-w-5xl px-4 pt-6 pb-16 sm:px-6">
      {/* Master Handheld Gadget Chassis (Candy Purple from Style Guide §2 & Reference Image 2) */}
      <div className="skeuo-chassis-purple relative p-6 sm:p-10 shadow-2xl">
        {/* Console Header: Technical markings + 3x3 Perforated Speaker Grille */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-purple-400/30 pb-5">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-slate-950 uppercase deboss-light">
                Domain Synthesizer
              </h2>
            </div>
            <p className="mt-1 font-mono text-xs font-bold text-purple-950/80 uppercase tracking-wider">
              CONFIGURE KEYWORDS, EXTENSION MATRIX & BRAND TONE
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-right font-mono text-[10px] font-black text-slate-900 uppercase tracking-wider leading-tight hidden sm:block">
              <div>NG-01 MASTER CONSOLE</div>
              <div className="text-purple-950/70">MULTI-REGISTRAR SYNC (5 CONNECTED)</div>
            </div>
            {/* 3x3 Perforated Speaker Grille (from Image 2) */}
            <div
              className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-purple-900/40 border border-purple-300/30 shadow-inner"
              title="Perforated acoustic grille"
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="speaker-grille-dot !w-2 !h-2" />
              ))}
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="skeuo-push-btn inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-mono text-xs font-bold text-slate-900 border border-slate-950/20 bg-white/95 hover:bg-white active:scale-95 cursor-pointer shadow-md"
                title="Close console and scroll back to top"
              >
                <X weight="bold" />
                <span>CLOSE</span>
              </button>
            )}
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* ZONE 1: RECESSED CRT / OLED GLASS SCREEN (Flat, Crisp, High-Contrast UI inside Screen Bezel) */}
          <div className="screen-recess p-6 sm:p-7 rounded-3xl bg-slate-950 text-white relative border border-slate-800 shadow-2xl">
            <div className="gloss-sheen" />

            {/* In-Screen Starting Question: Seed Name vs Context First */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                  Do you already have a name in mind?
                </span>
              </div>

              {/* OLED Cyber Segmented Switch */}
              <div className="key-socket-dark inline-flex !p-1 !rounded-2xl shrink-0 border border-slate-700/60">
                <button
                  type="button"
                  onClick={() => {
                    playMechanicalClick('click')
                    setHasNameInMind(true)
                    setError('')
                  }}
                  className={`rounded-xl px-4 py-1.5 font-mono text-xs font-bold transition-all cursor-pointer ${
                    hasNameInMind
                      ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>have name</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playMechanicalClick('click')
                    setHasNameInMind(false)
                    setError('')
                  }}
                  className={`rounded-xl px-4 py-1.5 font-mono text-xs font-bold transition-all cursor-pointer ${
                    !hasNameInMind
                      ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>start from brief</span>
                </button>
              </div>
            </div>

            {/* Primary Seed Input / Context Description Input */}
            <div className="mt-5">
              {hasNameInMind ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="seed-input"
                      className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400"
                    >
                      1. Domain Name
                    </label>
                    <span className="font-mono text-[10px] text-slate-500">REQUIRED</span>
                  </div>
                  <input
                    id="seed-input"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (error) setError('')
                    }}
                    placeholder="Ex: Northwind, Prism, Apex, Lumen..."
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 px-5 py-3.5 font-sans font-bold text-2xl sm:text-3xl text-white tracking-wide placeholder:font-sans placeholder:font-normal placeholder:text-base placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 shadow-inner"
                  />
                  {error && (
                    <div className="mt-2 font-mono text-xs font-bold text-rose-400 animate-toast">
                      ! {error}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="context-input"
                      className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400"
                    >
                      1. What are you building? (Business Context)
                    </label>
                    <span className="font-mono text-[10px] text-slate-500">REQUIRED</span>
                  </div>
                  <textarea
                    id="context-input"
                    rows={2}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value)
                      if (error) setError('')
                    }}
                    placeholder="Ex: Fast developer tools, organic specialty coffee roastery, climate intelligence platform..."
                    className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-900/90 px-5 py-3 font-sans text-base sm:text-lg text-white placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 shadow-inner"
                  />
                  {error && (
                    <div className="mt-2 font-mono text-xs font-bold text-rose-400 animate-toast">
                      ! {error}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ZONE 2: PHYSICAL HARDWARE CONTROLS DECK */}

          {/* Module A: 3x3 Mechanical Keypad for TLDs & Country Selector */}
          <div className="skeuo-plate rounded-3xl p-5 sm:p-7 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Globe weight="bold" className="text-blue-600 text-base" />
                <span className="font-mono text-xs font-black uppercase tracking-wider text-slate-900">
                  2. TLD Hardware Keypad (Select Extensions)
                </span>
              </div>
              <span className="font-mono text-[10px] font-bold text-slate-500">
                CLICK KEYCAPS TO TOGGLE
              </span>
            </div>

            {/* Mechanical Keycaps Matrix */}
            <div className="flex flex-wrap items-center gap-2.5">
              {[...TLD_ORDER, ...customTlds].map((tld, idx) => {
                const isSelected = selectedTlds.includes(tld)
                const countryMatch = COUNTRY_TLDS.find((c) => c.tld === tld)
                
                // All selected TLD keycaps use the signature illuminated cobalt blue skeuomorphic style
                let keycapStyle = isSelected
                  ? 'key-cap-cobalt text-white'
                  : 'key-cap text-slate-800'

                return (
                  <div key={tld} className="key-socket-dark !p-[2.5px] !rounded-[14px]">
                    <button
                      type="button"
                      onClick={() => handleTldToggle(tld)}
                      className={`${keycapStyle} flex items-center gap-2 !rounded-[11px] px-4 py-2 font-mono text-xs font-black transition-all cursor-pointer`}
                    >
                      {countryMatch ? (
                        <img
                          src={`https://flagcdn.com/w40/${countryMatch.code}.png`}
                          srcSet={`https://flagcdn.com/w80/${countryMatch.code}.png 2x`}
                          width="18"
                          height="13"
                          alt={countryMatch.country}
                          className="h-3 w-4 rounded-xs object-cover border border-slate-400 shrink-0"
                          loading="lazy"
                        />
                      ) : (
                        <span
                          className={`h-2 w-2 rounded-full ${
                            isSelected
                              ? 'bg-cyan-300 led-glow-cyan shadow-xs'
                              : 'bg-slate-400'
                          }`}
                        />
                      )}
                      <span className="deboss-light">{tld}</span>
                    </button>
                  </div>
                )
              })}

              {/* Add Custom TLD */}
              {isAddingTld ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    autoFocus
                    value={newTldInput}
                    onChange={(e) => setNewTldInput(e.target.value)}
                    placeholder=".dev, .app"
                    className="w-24 rounded-[14px] border border-blue-500 bg-white px-3 py-2 font-mono text-xs font-bold text-slate-900 focus:outline-none ring-2 ring-blue-400/40 shadow-inner"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddCustomTld(e)
                      if (e.key === 'Escape') setIsAddingTld(false)
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTld}
                    className="skeuo-button-primary rounded-[11px] px-3 py-2 font-mono text-xs font-bold text-white shadow-sm"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingTld(false)}
                    className="rounded-xl px-2 py-1 text-xs text-slate-500 hover:text-slate-800"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingTld(true)}
                  className="skeuo-push-btn flex items-center gap-1.5 !rounded-[14px] border border-dashed border-slate-300 bg-white px-4 py-2 font-mono text-xs font-bold text-slate-700 hover:text-slate-950 hover:border-slate-400"
                >
                  <span className="text-sm font-black text-blue-600">+</span>
                  <span>Add extension</span>
                </button>
              )}

              {/* Searchable Country ccTLD Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    playMechanicalClick('click')
                    setShowCountryPicker((prev) => !prev)
                  }}
                  className={`skeuo-push-btn flex items-center gap-2 !rounded-[14px] px-4 py-2 font-mono text-xs font-bold transition-all border ${
                    showCountryPicker
                      ? 'bg-blue-50 text-blue-900 border-blue-400 ring-2 ring-blue-300/40'
                      : 'bg-white text-slate-800 border-slate-300 hover:text-slate-950'
                  }`}
                >
                  <span className="text-sm">🌐</span>
                  <span>Country domains</span>
                  <span className="text-[9px] text-slate-400">▼</span>
                </button>

                {showCountryPicker && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => {
                        setShowCountryPicker(false)
                        setCountrySearch('')
                      }}
                    />
                    <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 z-50 w-72 sm:w-80 max-w-[calc(100vw-3rem)] rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xl animate-toast">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          Select Country Domain
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCountryPicker(false)
                            setCountrySearch('')
                          }}
                          className="text-slate-400 hover:text-slate-700 text-xs font-bold"
                        >
                          ✕
                        </button>
                      </div>

                      <input
                        type="text"
                        autoFocus
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        placeholder="Search country or extension (e.g. .in, Japan)..."
                        className="mb-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 font-sans text-xs text-slate-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:outline-none"
                      />

                      <div className="max-h-52 overflow-y-auto space-y-1">
                        {COUNTRY_TLDS.filter((c) => {
                          const q = countrySearch.toLowerCase().trim()
                          if (!q) return true
                          return (
                            c.country.toLowerCase().includes(q) ||
                            c.tld.toLowerCase().includes(q)
                          )
                        }).map((c) => {
                          const isSelected = selectedTlds.includes(c.tld)
                          return (
                            <button
                              key={c.tld}
                              type="button"
                              onClick={() => {
                                playMechanicalClick('click')
                                if (!selectedTlds.includes(c.tld)) {
                                  setSelectedTlds((prev) => [...prev, c.tld])
                                  if (
                                    !customTlds.includes(c.tld) &&
                                    !TLD_ORDER.includes(c.tld)
                                  ) {
                                    setCustomTlds((prev) => [...prev, c.tld])
                                  }
                                }
                                setShowCountryPicker(false)
                                setCountrySearch('')
                              }}
                              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left text-xs transition-colors ${
                                isSelected
                                  ? 'bg-blue-50 font-bold text-blue-900 border border-blue-200'
                                  : 'hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={`https://flagcdn.com/w40/${c.code}.png`}
                                  srcSet={`https://flagcdn.com/w80/${c.code}.png 2x`}
                                  width="20"
                                  height="15"
                                  alt={c.country}
                                  className="h-3.5 w-5 rounded-xs object-cover border border-slate-200 shadow-xs shrink-0"
                                  loading="lazy"
                                />
                                <span className="font-medium text-slate-800">
                                  {c.country}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-blue-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">
                                  {c.tld}
                                </span>
                                {isSelected && (
                                  <span className="text-emerald-600 font-bold text-[10px]">
                                    ✓
                                  </span>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Module B: Context / Themes & Competitor Filters */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div
              className={`skeuo-plate rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all ${
                !hasNameInMind
                  ? 'opacity-40 pointer-events-none select-none bg-slate-100/80 border border-dashed border-slate-300 shadow-none'
                  : 'shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 mb-3">
                  <span className="font-mono text-xs font-black uppercase tracking-wider text-slate-900">
                    3. Tell me about your business, product etc.
                  </span>
                  <span className="font-mono text-[10px] font-bold uppercase text-slate-500">
                    {!hasNameInMind ? 'Captured in Step 1' : 'Optional'}
                  </span>
                </div>
                {hasNameInMind ? (
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Developer infrastructure, minimal design, speed focused..."
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white p-3 font-sans text-xs text-slate-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none shadow-inner"
                  />
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-3.5 font-mono text-xs text-slate-500 italic">
                    Already entered in Step 1 above. Domain names will be generated directly from your business brief.
                  </div>
                )}
              </div>
            </div>

            <div className="skeuo-plate rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 mb-3">
                  <span className="font-mono text-xs font-black uppercase tracking-wider text-slate-900">
                    4. Competitors & Filter Rockers
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 uppercase">Optional</span>
                </div>
                <input
                  type="text"
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                  placeholder="Ex: Linear, Stripe, Arc, Vercel"
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 font-sans text-xs text-slate-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none shadow-inner"
                />
              </div>

              {/* Physical Rocker Switches for Anti-Patterns */}
              <div className="mt-4 space-y-2 pt-3 border-t border-slate-200/80 text-xs">
                <div
                  onClick={() => {
                    playMechanicalClick('click')
                    setAntiPatterns((prev) => ({ ...prev, noLy: !prev.noLy }))
                  }}
                  className="flex items-center justify-between cursor-pointer select-none rounded-xl p-1.5 hover:bg-slate-100 transition-colors"
                >
                  <span className="font-mono text-xs font-bold text-slate-800">
                    Filter out suffixes (<code className="text-slate-950 font-black">-ly</code>, <code className="text-slate-950 font-black">-ify</code>)
                  </span>
                  <div
                    className={`relative flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${
                      antiPatterns.noLy ? 'bg-slate-950' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${
                        antiPatterns.noLy ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    >
                      {antiPatterns.noLy && (
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 led-glow-cyan" />
                      )}
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => {
                    playMechanicalClick('click')
                    setAntiPatterns((prev) => ({
                      ...prev,
                      noGenericSaaS: !prev.noGenericSaaS,
                    }))
                  }}
                  className="flex items-center justify-between cursor-pointer select-none rounded-xl p-1.5 hover:bg-slate-100 transition-colors"
                >
                  <span className="font-mono text-xs font-bold text-slate-800">
                    Avoid buzzwords (<code className="text-slate-950 font-black">Cloud, Sync, Hub</code>)
                  </span>
                  <div
                    className={`relative flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${
                      antiPatterns.noGenericSaaS ? 'bg-slate-950' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${
                        antiPatterns.noGenericSaaS ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    >
                      {antiPatterns.noGenericSaaS && (
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 led-glow-cyan" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Module C: Brand Archetype & Tone Bias with Knurled Slider */}
          <div className="skeuo-plate rounded-3xl p-5 sm:p-7 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-4">
              <span className="font-mono text-xs font-black uppercase tracking-wider text-slate-900">
                5. Brand Archetype & Acoustic Tone
              </span>
              <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                Acoustic Phonetics
              </span>
            </div>

            {/* 6 Archetype Tiles */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {Object.values(BRAND_VIBES).map((item) => {
                const isActive = vibe === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      playMechanicalClick('click')
                      setVibe(item.id)
                    }}
                    className={`rounded-2xl p-3.5 text-left transition-all border ${
                      isActive
                        ? 'border-blue-600 bg-blue-50/90 shadow-md ring-2 ring-blue-500/40'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-neuropol text-sm font-bold text-slate-950 uppercase">
                        {item.label}
                      </div>
                      {isActive && (
                        <span className="h-2 w-2 rounded-full bg-blue-600 led-glow-cyan" />
                      )}
                    </div>
                    <div className="mt-1 font-sans text-[11px] text-slate-600 line-clamp-2 leading-tight">
                      {item.subtitle}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Hardware Tone Slider */}
            <div className="mt-6 pt-4 border-t border-slate-200/80">
              <div className="flex items-center justify-between font-mono text-[11px] sm:text-xs font-bold text-slate-800 gap-2">
                <span className="flex items-center gap-1.5 text-amber-800 shrink-0">
                  <Waveform weight="bold" />
                  <span>SMOOTH <span className="hidden sm:inline">& FRIENDLY (WARM)</span></span>
                </span>
                <span className="rounded-full bg-slate-950 px-2.5 sm:px-3.5 py-1 font-mono text-[10px] sm:text-[11px] font-black text-white shadow-xs shrink-0">
                  {acousticBias < 40
                    ? 'SMOOTH'
                    : acousticBias > 60
                    ? 'PUNCHY'
                    : 'BALANCED'}
                </span>
                <span className="flex items-center gap-1.5 text-cyan-800 shrink-0">
                  <Lightning weight="bold" />
                  <span>PUNCHY <span className="hidden sm:inline">& SHARP (CRISP)</span></span>
                </span>
              </div>

              <div className="mt-3 relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={acousticBias}
                  onChange={(e) => {
                    setAcousticBias(Number(e.target.value))
                    if (Number(e.target.value) % 15 === 0) playMechanicalClick('dial')
                  }}
                  className="hardware-slider w-full"
                />
                <div className="flex justify-between px-1 sm:px-2 pt-1 font-mono text-[8.5px] sm:text-[9px] font-bold text-slate-500 select-none">
                  <span>| 0% (SMOOTH)</span>
                  <span className="hidden xs:inline">| 25%</span>
                  <span className="text-slate-900 font-black">| 50% (BALANCED)</span>
                  <span className="hidden xs:inline">| 75%</span>
                  <span>| 100% (PUNCHY)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Module D: Syllable Length + Grand Terracotta Action Button */}
          <div className="skeuo-plate flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-3xl p-5 sm:p-7 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="font-mono text-xs font-black uppercase tracking-wider text-slate-900 shrink-0">
                6. Syllable count:
              </span>
              <div className="key-socket-dark !p-1 !rounded-2xl inline-flex overflow-x-auto no-scrollbar max-w-full">
                {[
                  { value: 0, label: 'Any' },
                  { value: 1, label: '1 syl' },
                  { value: 2, label: '2 syl' },
                  { value: 3, label: '3 syl' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      playMechanicalClick('click')
                      setMaxSyllables(opt.value)
                    }}
                    className={`rounded-xl px-3 sm:px-4 py-1.5 font-mono text-xs font-bold transition-all shrink-0 whitespace-nowrap cursor-pointer ${
                      maxSyllables === opt.value
                        ? 'key-cap-active-dark'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Master Push Button (Full width on mobile, right aligned on desktop) */}
            <button
              type="submit"
              disabled={isGenerating}
              className="skeuo-button-terracotta w-full sm:w-auto inline-flex items-center justify-center gap-3.5 rounded-2xl px-8 sm:px-9 py-3.5 sm:py-4 font-mono text-xs sm:text-sm font-black tracking-wider uppercase text-white active:scale-95 shadow-2xl group cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <span className="h-3 w-3 animate-ping rounded-full bg-white" />
                  <span>SYNTHESIZING NAMES...</span>
                </>
              ) : (
                <>
                  <span className="deboss-dark font-black tracking-widest text-xs sm:text-sm">
                    SYNTHESIZE NAMES ⚡
                  </span>
                  <ArrowRight weight="bold" className="group-hover:translate-x-1.5 transition-transform text-base" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
