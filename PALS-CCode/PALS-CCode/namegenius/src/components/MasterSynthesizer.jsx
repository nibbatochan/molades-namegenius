import React, { useState } from 'react'
import {
  Globe,
  Check,
  Waveform,
  Lightning,
  Sparkle,
  ArrowRight,
} from '@phosphor-icons/react'
import { BRAND_VIBES } from '../generator'
import { TLD_ORDER, COUNTRY_TLDS } from '../data'

export default function MasterSynthesizer({
  initialBrief,
  onGenerate,
  isGenerating,
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
    }
    setNewTldInput('')
    setIsAddingTld(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (hasNameInMind) {
      if (!name.trim() || name.trim().length < 2) {
        setError('Please enter at least 2 characters for your name or keyword.')
        return
      }
    } else {
      if (!description.trim() && !name.trim()) {
        setError('Please describe what your product or business is building.')
        return
      }
    }
    setError('')
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
    <div id="master-synthesizer-console" className="relative mx-auto max-w-5xl px-4 pt-4 pb-12 sm:px-6">
      {/* Master Skeuomorphic Industrial Chassis (Stacked directional gradients + fine grain noise) */}
      <div className="skeuo-chassis relative overflow-hidden p-6 sm:p-9 shadow-2xl">
        {/* Chassis Hex Corner Screws with directional bevel highlights (from Style Guide §8) */}
        <div className="chassis-screw absolute top-3.5 left-4" title="Chassis Hex Bolt M3">
          <span className="scale-75">+</span>
        </div>
        <div className="chassis-screw absolute top-3.5 right-4" title="Chassis Hex Bolt M3">
          <span className="scale-75">+</span>
        </div>
        <div className="chassis-screw absolute bottom-3.5 left-4" title="Chassis Hex Bolt M3">
          <span className="scale-75">+</span>
        </div>
        <div className="chassis-screw absolute bottom-3.5 right-4" title="Chassis Hex Bolt M3">
          <span className="scale-75">+</span>
        </div>

        {/* Chassis Header: Technical markings + 3x3 Perforated Speaker Grille (Image 2 & 4) */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-300/80 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-black text-white shadow-skeuo-button">
                N
              </div>
              <h2 className="font-serif text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl deboss-light">
                Name Generator
              </h2>
            </div>
            <p className="mt-1 font-sans text-xs font-medium text-slate-600 sm:text-sm">
              Configure your keywords, target extensions, and brand tone to find available names.
            </p>
          </div>

          {/* Technical Audio/Hardware Markings & 3x3 Speaker Grille (Image 2 & 4) */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-right font-mono text-[10px] text-slate-500 uppercase tracking-wider leading-tight">
              <div className="font-bold text-slate-700">NG-01 SYNTHESIZER</div>
              <div className="text-slate-400">48kHz PHONETIC ACCURACY</div>
            </div>
            {/* 3x3 Speaker Grille */}
            <div
              className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-slate-200/70 border border-slate-300/80 shadow-inner"
              title="Perforated acoustic grille"
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="speaker-grille-dot" />
              ))}
            </div>
          </div>
        </div>

        {/* Main Generator Controls Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Starting Question: Name in mind vs Start from Idea */}
          <div className="skeuo-plate rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Sparkle weight="fill" className="text-blue-600 text-sm" />
                  Do you already have a name in mind?
                </span>
                <p className="font-sans text-xs text-slate-500 mt-0.5">
                  Choose how you want to start — explore variations of a keyword or generate names from your idea.
                </p>
              </div>

              {/* Tactile 2-option Segmented Switch inside socket recess */}
              <div className="key-socket inline-flex !p-1 !rounded-2xl shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setHasNameInMind(true)
                    setError('')
                  }}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 font-sans text-xs font-bold transition-all ${
                    hasNameInMind
                      ? 'key-cap-active-dark'
                      : 'key-cap text-slate-700 hover:text-slate-950'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      hasNameInMind ? 'bg-cyan-400 led-glow-cyan' : 'bg-slate-400'
                    }`}
                  />
                  <span>Yes, I have a name</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHasNameInMind(false)
                    setError('')
                  }}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 font-sans text-xs font-bold transition-all ${
                    !hasNameInMind
                      ? 'key-cap-active-dark'
                      : 'key-cap text-slate-700 hover:text-slate-950'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      !hasNameInMind ? 'bg-cyan-400 led-glow-cyan' : 'bg-slate-400'
                    }`}
                  />
                  <span>No, start from my idea</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 1: Primary Input + Immediate Domain Extension Controls */}
          <div className="skeuo-plate rounded-2xl p-5 sm:p-6">
            {hasNameInMind ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <label
                    htmlFor="seed-input"
                    className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800"
                  >
                    1. Name or Keyword
                  </label>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-[10px] font-bold text-slate-600">
                    Required
                  </span>
                </div>

                <div className="mt-4">
                  <input
                    id="seed-input"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (error) setError('')
                    }}
                    placeholder="Ex: Northwind, Prism, Apex, Lumen..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3.5 font-display text-2xl font-bold tracking-tight text-slate-900 placeholder:font-sans placeholder:text-base placeholder:text-gray-400 placeholder:font-normal focus:border-blue-500 focus:outline-none sm:text-3xl"
                  />
                  {error && (
                    <div className="mt-2 font-sans text-xs font-bold text-rose-600 animate-toast">
                      {error}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <label
                    htmlFor="context-input"
                    className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800"
                  >
                    1. What are you building? (Business Context)
                  </label>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-[10px] font-bold text-slate-600">
                    Required
                  </span>
                </div>

                <div className="mt-4">
                  <textarea
                    id="context-input"
                    rows={2}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value)
                      if (error) setError('')
                    }}
                    placeholder="Ex: Fast developer tools, organic specialty coffee roastery, climate intelligence platform..."
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-5 py-3.5 font-sans text-base sm:text-lg font-medium text-slate-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                  {error && (
                    <div className="mt-2 font-sans text-xs font-bold text-rose-600 animate-toast">
                      {error}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* High-Contrast Tactile TLD Switches + Custom Extension Adder */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold text-slate-700">
                <Globe weight="bold" className="text-blue-600 text-sm" />
                <span>Target domain extensions:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {[...TLD_ORDER, ...customTlds].map((tld) => {
                  const isSelected = selectedTlds.includes(tld)
                  const countryMatch = COUNTRY_TLDS.find((c) => c.tld === tld)
                  return (
                    <div key={tld} className="key-socket !p-[2px] !rounded-xl">
                      <button
                        type="button"
                        onClick={() => handleTldToggle(tld)}
                        className={`key-cap flex items-center gap-2 rounded-[10px] px-3.5 py-1.5 font-mono text-xs font-bold transition-all ${
                          isSelected
                            ? 'key-cap-active-dark ring-1 ring-slate-400/40'
                            : 'text-slate-800 hover:text-slate-950'
                        }`}
                      >
                        {countryMatch ? (
                          <img
                            src={`https://flagcdn.com/w40/${countryMatch.code}.png`}
                            srcSet={`https://flagcdn.com/w80/${countryMatch.code}.png 2x`}
                            width="18"
                            height="13"
                            alt={countryMatch.country}
                            className="h-3 w-4 rounded-xs object-cover border border-slate-300 shrink-0"
                            loading="lazy"
                          />
                        ) : (
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              isSelected
                                ? 'bg-cyan-400 led-glow-cyan'
                                : 'bg-slate-300'
                            }`}
                          />
                        )}
                        <span className={isSelected ? 'text-white font-extrabold deboss-dark' : 'text-slate-800 font-bold deboss-light'}>
                          {tld}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] text-cyan-300 font-black">✓</span>
                        )}
                      </button>
                    </div>
                  )
                })}

                {/* Custom TLD Adder */}
                {isAddingTld ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      autoFocus
                      value={newTldInput}
                      onChange={(e) => setNewTldInput(e.target.value)}
                      placeholder=".dev, .app"
                      className="w-24 rounded-xl border border-blue-500 bg-white px-3 py-1.5 font-mono text-xs font-bold text-slate-900 focus:outline-none ring-2 ring-blue-400/40"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddCustomTld(e)
                        if (e.key === 'Escape') setIsAddingTld(false)
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomTld}
                      className="skeuo-button-primary rounded-xl px-2.5 py-1.5 font-mono text-xs font-bold text-white"
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
                    className="skeuo-push-btn flex items-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-slate-50/90 px-3.5 py-2 font-mono text-xs font-bold text-slate-700 hover:text-slate-950 hover:border-slate-400"
                  >
                    <span className="text-sm font-black text-blue-600">+</span>
                    <span>Add extension</span>
                  </button>
                )}

                {/* Searchable Country ccTLD Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCountryPicker((prev) => !prev)}
                    className={`skeuo-push-btn flex items-center gap-2 rounded-xl px-3.5 py-2 font-mono text-xs font-bold transition-all border ${
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
                      <div className="absolute right-0 top-full mt-2 z-50 w-72 sm:w-80 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xl animate-toast">
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
          </div>

          {/* Section 2 & 3: Context / Keywords & Filter Toggles */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Secondary Input: Context or Keywords depending on primary choice */}
            <div className="skeuo-plate rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800">
                    {hasNameInMind ? '2. Business Context' : '2. Seed Keywords or Themes'}
                  </span>
                  <span className="font-sans text-xs text-slate-500">Optional</span>
                </div>
                {hasNameInMind ? (
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Fast developer tools, organic specialty coffee, climate intelligence..."
                    className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white p-3 font-sans text-xs text-slate-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Apex, Flow, Spark, Craft..."
                    className="mt-3 w-full rounded-xl border border-slate-300 bg-white p-3 font-sans text-xs text-slate-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                )}
              </div>
            </div>

            {/* Competitors & Physical Filter Switches */}
            <div className="skeuo-plate rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800">
                    3. Competitors & Filters
                  </span>
                  <span className="font-sans text-xs text-slate-500">Optional</span>
                </div>
                <input
                  type="text"
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                  placeholder="Ex: Linear, Stripe, Arc, Vercel"
                  className="mt-3 w-full rounded-xl border border-slate-300 bg-white p-3 font-sans text-xs text-slate-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Physical Skeuomorphic Toggle Switches */}
              <div className="mt-3 space-y-2 pt-2 border-t border-slate-100 text-xs">
                {/* Switch 1: Avoid -ly, -ify */}
                <div
                  onClick={() =>
                    setAntiPatterns((prev) => ({ ...prev, noLy: !prev.noLy }))
                  }
                  className="flex items-center justify-between cursor-pointer select-none rounded-lg p-1.5 hover:bg-slate-50"
                >
                  <span className="font-sans text-xs text-slate-700">
                    Filter out suffixes (<code className="font-mono text-slate-900 font-bold">-ly</code>, <code className="font-mono text-slate-900 font-bold">-ify</code>)
                  </span>
                  <div
                    className={`relative flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${
                      antiPatterns.noLy ? 'bg-slate-900' : 'bg-slate-300'
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

                {/* Switch 2: Avoid overused generic SaaS words */}
                <div
                  onClick={() =>
                    setAntiPatterns((prev) => ({
                      ...prev,
                      noGenericSaaS: !prev.noGenericSaaS,
                    }))
                  }
                  className="flex items-center justify-between cursor-pointer select-none rounded-lg p-1.5 hover:bg-slate-50"
                >
                  <span className="font-sans text-xs text-slate-700">
                    Avoid buzzwords (<code className="font-mono text-slate-900 font-bold">Cloud, Sync, Hub, Stack</code>)
                  </span>
                  <div
                    className={`relative flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${
                      antiPatterns.noGenericSaaS ? 'bg-slate-900' : 'bg-slate-300'
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

          {/* Section 4: Authentic Brand Vibe and Tone */}
          <div className="skeuo-plate rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800">
                4. Brand Vibe and Tone
              </span>
              <span className="font-sans text-xs text-slate-500">Pick a personality</span>
            </div>

            {/* 6 Real Brand Vibe Cards */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {Object.values(BRAND_VIBES).map((item) => {
                const isActive = vibe === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setVibe(item.id)}
                    className={`rounded-xl p-3.5 text-left transition-all border ${
                      isActive
                        ? 'border-blue-600 bg-blue-50/80 shadow-skeuo-button ring-2 ring-blue-500/50'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-serif text-xs font-bold text-slate-900">
                        {item.label}
                      </div>
                      {isActive && (
                        <span className="h-2 w-2 rounded-full bg-blue-600 led-glow-cyan" />
                      )}
                    </div>
                    <div className="mt-1 font-sans text-[11px] text-slate-500 line-clamp-2 leading-tight">
                      {item.subtitle}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Tactile Sound Tone Slider with Grooved Track & Precision Thumb */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between font-sans text-xs text-slate-700">
                <span className="flex items-center gap-1.5 font-semibold text-amber-800">
                  <Waveform weight="bold" />
                  Soft & friendly (Bouba)
                </span>
                <span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-0.5 font-mono text-[11px] font-bold text-slate-800 shadow-xs">
                  {acousticBias < 40
                    ? 'Soft tone'
                    : acousticBias > 60
                    ? 'Sharp tone'
                    : 'Balanced tone'}
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-cyan-800">
                  <Lightning weight="bold" />
                  Sharp & technical (Kiki)
                </span>
              </div>

              <div className="mt-2 relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={acousticBias}
                  onChange={(e) => setAcousticBias(Number(e.target.value))}
                  className="hardware-slider w-full"
                />
                {/* Hardware Graduation Ticks */}
                <div className="flex justify-between px-2 pt-1 font-mono text-[9px] text-slate-400 select-none">
                  <span>| 0%</span>
                  <span>| 25%</span>
                  <span className="text-slate-600 font-bold">| 50%</span>
                  <span>| 75%</span>
                  <span>| 100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Syllable Length + Terracotta Tactile Action Button */}
          <div className="skeuo-plate flex flex-wrap items-center justify-between gap-5 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800">
                5. Name length:
              </span>
              <div className="key-socket !p-1 !rounded-2xl inline-flex">
                {[
                  { value: 0, label: 'Any length' },
                  { value: 1, label: '1 syllable' },
                  { value: 2, label: '2 syllables' },
                  { value: 3, label: '3 syllables' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setMaxSyllables(opt.value)}
                    className={`rounded-xl px-3.5 py-1.5 font-sans text-xs font-bold transition-all ${
                      maxSyllables === opt.value
                        ? 'key-cap-active-dark'
                        : 'key-cap text-slate-700 hover:text-slate-950'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Signature Terracotta Push Button (Style Guide & Images 1 & 3) */}
            <button
              type="submit"
              disabled={isGenerating}
              className="skeuo-button-terracotta inline-flex items-center gap-3.5 rounded-2xl px-8 py-3.5 font-mono text-xs font-bold tracking-wider uppercase text-white active:scale-95 group"
            >
              {isGenerating ? (
                <>
                  <span className="h-2.5 w-2.5 animate-ping rounded-full bg-white" />
                  <span>Synthesizing domains...</span>
                </>
              ) : (
                <>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/40 bg-white/20 shadow-inner">
                    <Check weight="bold" className="text-sm" />
                  </span>
                  <span className="deboss-dark font-extrabold tracking-wider">Find available names</span>
                  <ArrowRight weight="bold" className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
