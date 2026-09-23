import React, { useState } from 'react'
import {
  Scales,
  ArrowLeft,
  ArrowRight,
  ArrowSquareOut,
  SpeakerHigh,
  Sparkle,
  Copy,
  Check,
  Globe,
  DeviceMobile,
  Terminal,
  ShieldCheck,
  CurrencyDollar,
  Trash,
  Ruler,
  Waveform,
  Keyboard,
  Tag,
} from '@phosphor-icons/react'
import { styleLabel } from '../data'
import { getTldBaseline, formatCurrency } from '../utils/pricingEngine'

// Helper to analyze candidate metrics
function analyzeName(item) {
  const len = item?.slug?.length || 0
  const syllables = item?.syllables || 2
  const profile = item?.phonetic?.profile || 'balanced'
  const isPunchy = profile === 'kiki' || profile === 'punchy'
  const isSmooth = profile === 'bouba' || profile === 'smooth'
  
  const tldMap = item?.tlds || item?.availability || {}
  const availCount = Object.values(tldMap).filter((v) => v === true || v === 'available').length
  const availList = Object.entries(tldMap)
    .filter(([_, v]) => v === true || v === 'available')
    .map(([ext]) => ext)

  const typingIndex = Math.max(4, Math.min(10, Math.round(11 - len * 0.75)))
  
  return {
    len,
    syllables,
    profile,
    isPunchy,
    isSmooth,
    availCount,
    availList,
    typingIndex,
  }
}

export default function TactileCompareLab({
  saved = [],
  compareSel = [],
  onToggleCompare,
  onSelectCompare,
  onClear,
  onBack,
  onNavigate,
}) {
  const [selectedTld, setSelectedTld] = useState('.com')
  const [copiedSlug, setCopiedSlug] = useState(null)
  const [speakingItem, setSpeakingItem] = useState(null)

  const handleCopy = (text, slug, e) => {
    e?.stopPropagation()
    navigator.clipboard.writeText(text)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  const speak = (name, id, delay = 0) => {
    if (!window.speechSynthesis) return
    setTimeout(() => {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(name)
      u.rate = 0.88
      u.pitch = 1.05
      u.onstart = () => setSpeakingItem(id)
      u.onend = () => setSpeakingItem(null)
      u.onerror = () => setSpeakingItem(null)
      window.speechSynthesis.speak(u)
    }, delay)
  }

  const speakBoth = (nameA, nameB) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const u1 = new SpeechSynthesisUtterance(nameA)
    u1.rate = 0.88
    u1.pitch = 1.05
    u1.onstart = () => setSpeakingItem('both_a')
    u1.onend = () => {
      setSpeakingItem('both_pause')
      setTimeout(() => {
        const u2 = new SpeechSynthesisUtterance(nameB)
        u2.rate = 0.88
        u2.pitch = 1.05
        u2.onstart = () => setSpeakingItem('both_b')
        u2.onend = () => setSpeakingItem(null)
        u2.onerror = () => setSpeakingItem(null)
        window.speechSynthesis.speak(u2)
      }, 400)
    }
    window.speechSynthesis.speak(u1)
  }

  // Not enough names selected
  if (!compareSel || compareSel.length < 2) {
    const candidateA = compareSel?.[0]
    return (
      <div className="w-full">
        <div className="skeuo-plate rounded-[28px] border-2 border-dashed border-slate-300 p-8 sm:p-12 text-center shadow-xs">
          <div className="key-socket !p-[3px] !rounded-2xl mx-auto w-14 h-14 flex items-center justify-center">
            <div className="key-cap !rounded-xl p-3 flex items-center justify-center text-slate-900 bg-amber-300 shadow-sm">
              <Scales weight="fill" className="text-2xl" />
            </div>
          </div>
          <h2 className="mt-4 font-display text-2xl sm:text-3xl font-normal uppercase tracking-tight text-slate-900">
            {candidateA ? 'Select One More Candidate' : 'Pick Two Names to Compare'}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            {candidateA ? (
              <>
                Slot 1 is loaded with <strong className="text-slate-900 font-mono">"{candidateA.name}"</strong>.
                Choose a second name from your saved list below or browse results to compare them.
              </>
            ) : (
              'Compare length, sound feel, live website previews, and registrar prices side-by-side.'
            )}
          </p>

          {/* Quick-pick from saved candidates if available */}
          {candidateA && saved.length > 1 && (
            <div className="mt-6 max-w-xl mx-auto text-left bg-white/80 rounded-2xl p-4 border border-slate-200">
              <div className="text-[11px] font-mono font-bold text-slate-500 uppercase mb-2">
                Available in your saved list:
              </div>
              <div className="flex flex-wrap gap-2">
                {saved
                  .filter((s) => s.slug !== candidateA.slug)
                  .map((item) => (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => onSelectCompare?.([candidateA, item])}
                      className="skeuo-push-btn inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-mono text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:border-blue-500 hover:text-blue-700 active:scale-95 cursor-pointer shadow-xs"
                    >
                      <span>+ {item.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({item.slug}.com)</span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('results')}
              className="skeuo-button-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-mono text-xs font-bold cursor-pointer"
            >
              <span>Browse Results</span>
              <ArrowRight weight="bold" />
            </button>
            {saved.length > 0 && (
              <button
                type="button"
                onClick={() => onNavigate('shortlist')}
                className="skeuo-push-btn inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-mono text-xs font-bold text-slate-800 bg-white border border-slate-300"
              >
                <span>View Shortlist ({saved.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  const [itemA, itemB] = compareSel
  const metaA = analyzeName(itemA)
  const metaB = analyzeName(itemB)

  const shorterItem = metaA.len < metaB.len ? 'A' : metaA.len > metaB.len ? 'B' : 'TIE'
  const baseline = getTldBaseline(selectedTld)

  return (
    <div className="space-y-6">
      {/* 1. Master Header Chassis */}
      <div className="skeuo-chassis rounded-[28px] p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Skeuomorphic Key Socket for Scales Icon */}
            <div className="key-socket !p-[3px] !rounded-xl shrink-0">
              <div className="key-cap !rounded-[9px] p-2 flex items-center justify-center text-slate-900 bg-gradient-to-b from-amber-200 to-amber-400 border border-amber-500/40 shadow-sm">
                <Scales weight="fill" className="text-lg" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black uppercase tracking-wider text-amber-300">
                  domain comparision
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-white drop-shadow-sm my-0.5">
                {itemA.name} <span className="text-amber-300 font-normal">vs</span> {itemB.name}
              </h2>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => speakBoth(itemA.name, itemB.name)}
              className="skeuo-push-btn inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-mono text-[11px] font-bold text-slate-900 bg-white shadow-sm hover:bg-slate-100 active:scale-95 cursor-pointer"
              title="Speak both names back-to-back"
            >
              <SpeakerHigh weight="bold" className="text-blue-600 text-sm" />
              <span>Ear-Test Both</span>
            </button>

            {/* Red Skeuomorphic Reset Button with High Contrast */}
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-mono text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 border-2 border-rose-800 shadow-[0_3px_0_#881337] active:translate-y-0.5 active:shadow-none cursor-pointer transition-all"
              title="Reset comparison"
            >
              <Trash weight="bold" className="text-sm text-white" />
              <span className="text-white font-bold">RESET</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Side-by-Side Candidate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Candidate A Card */}
        <div className="skeuo-card rounded-2xl p-6 border-t-4 border-t-amber-500 relative">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black uppercase text-amber-600 tracking-wider">
                Candidate A
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-slate-700">
                {styleLabel(itemA)}
              </span>
              <button
                type="button"
                onClick={() => speak(itemA.name, 'a')}
                className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                title="Pronounce name"
              >
                <SpeakerHigh size={15} weight={speakingItem === 'a' || speakingItem === 'both_a' ? 'fill' : 'bold'} />
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-3xl font-black uppercase tracking-tight text-slate-900 deboss-light">
                {itemA.name}
              </h3>
              <span className="font-mono text-xs font-bold text-amber-600">
                {metaA.len} letters
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-blue-600">{itemA.slug}.com</span>
              <button
                type="button"
                onClick={(e) => handleCopy(`${itemA.slug}.com`, itemA.slug, e)}
                className="text-slate-400 hover:text-slate-900 text-xs inline-flex items-center gap-1 cursor-pointer"
                title="Copy domain"
              >
                {copiedSlug === itemA.slug ? <Check className="text-emerald-500" /> : <Copy />}
              </button>
            </div>
          </div>

          {/* Candidate Swapper (if more saved names exist) */}
          {saved.length > 2 && (
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Swap Candidate:</span>
              <select
                value={itemA.slug}
                onChange={(e) => {
                  const target = saved.find((s) => s.slug === e.target.value)
                  if (target) onSelectCompare?.([target, itemB])
                }}
                className="bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-slate-700 font-bold"
              >
                <option value={itemA.slug}>{itemA.name} (Active)</option>
                {saved
                  .filter((s) => s.slug !== itemA.slug && s.slug !== itemB.slug)
                  .map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Registration 1-Click Buttons */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
            <a
              href={`https://dash.cloudflare.com/domains/register?query=${encodeURIComponent(`${itemA.slug}.com`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="skeuo-push-btn flex-1 inline-flex items-center justify-center gap-1 rounded-xl py-2 px-2 font-mono text-[11px] font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50"
            >
              <span>Cloudflare (${baseline.cloudflare?.reg || 9.77}/yr)</span>
              <ArrowSquareOut size={12} weight="bold" className="text-slate-400" />
            </a>
            <a
              href={`https://porkbun.com/checkout/search?q=${encodeURIComponent(`${itemA.slug}.com`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="skeuo-push-btn flex-1 inline-flex items-center justify-center gap-1 rounded-xl py-2 px-2 font-mono text-[11px] font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50"
            >
              <span>Porkbun</span>
              <ArrowSquareOut size={12} weight="bold" className="text-slate-400" />
            </a>
          </div>
        </div>

        {/* Candidate B Card */}
        <div className="skeuo-card rounded-2xl p-6 border-t-4 border-t-cyan-500 relative">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black uppercase text-cyan-600 tracking-wider">
                Candidate B
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-slate-700">
                {styleLabel(itemB)}
              </span>
              <button
                type="button"
                onClick={() => speak(itemB.name, 'b')}
                className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                title="Pronounce name"
              >
                <SpeakerHigh size={15} weight={speakingItem === 'b' || speakingItem === 'both_b' ? 'fill' : 'bold'} />
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-3xl font-black uppercase tracking-tight text-slate-900 deboss-light">
                {itemB.name}
              </h3>
              <span className="font-mono text-xs font-bold text-cyan-600">
                {metaB.len} letters
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-blue-600">{itemB.slug}.com</span>
              <button
                type="button"
                onClick={(e) => handleCopy(`${itemB.slug}.com`, itemB.slug, e)}
                className="text-slate-400 hover:text-slate-900 text-xs inline-flex items-center gap-1 cursor-pointer"
                title="Copy domain"
              >
                {copiedSlug === itemB.slug ? <Check className="text-emerald-500" /> : <Copy />}
              </button>
            </div>
          </div>

          {/* Candidate Swapper (if more saved names exist) */}
          {saved.length > 2 && (
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Swap Candidate:</span>
              <select
                value={itemB.slug}
                onChange={(e) => {
                  const target = saved.find((s) => s.slug === e.target.value)
                  if (target) onSelectCompare?.([itemA, target])
                }}
                className="bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-slate-700 font-bold"
              >
                <option value={itemB.slug}>{itemB.name} (Active)</option>
                {saved
                  .filter((s) => s.slug !== itemA.slug && s.slug !== itemB.slug)
                  .map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Registration 1-Click Buttons */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
            <a
              href={`https://dash.cloudflare.com/domains/register?query=${encodeURIComponent(`${itemB.slug}.com`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="skeuo-push-btn flex-1 inline-flex items-center justify-center gap-1 rounded-xl py-2 px-2 font-mono text-[11px] font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50"
            >
              <span>Cloudflare (${baseline.cloudflare?.reg || 9.77}/yr)</span>
              <ArrowSquareOut size={12} weight="bold" className="text-slate-400" />
            </a>
            <a
              href={`https://porkbun.com/checkout/search?q=${encodeURIComponent(`${itemB.slug}.com`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="skeuo-push-btn flex-1 inline-flex items-center justify-center gap-1 rounded-xl py-2 px-2 font-mono text-[11px] font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50"
            >
              <span>Porkbun</span>
              <ArrowSquareOut size={12} weight="bold" className="text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* 4. Side-by-Side Comparison Matrix */}
      <div className="skeuo-card rounded-2xl p-6 sm:p-7">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Sparkle weight="bold" className="text-amber-500" />
            <span>Side-by-side details</span>
          </h4>
          <span className="font-mono text-[10px] text-slate-400">Comparing both names</span>
        </div>

        {/* Column Headers with Candidate Names */}
        <div className="grid grid-cols-3 items-center pb-2.5 mb-2 border-b border-slate-200 text-xs font-mono font-black">
          <div className="text-amber-600 uppercase flex items-center gap-1.5 font-bold">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>{itemA.name}</span>
          </div>
          <div className="text-center text-slate-400 uppercase text-[10px] tracking-wider">
            Attribute
          </div>
          <div className="text-right text-cyan-600 uppercase flex items-center justify-end gap-1.5 font-bold">
            <span>{itemB.name}</span>
            <span className="h-2 w-2 rounded-full bg-cyan-500" />
          </div>
        </div>

        <div className="space-y-4">
          {/* Row 1: Length */}
          <div className="grid grid-cols-3 items-center py-2.5 border-b border-slate-100">
            <div className="font-mono text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className={`px-2 py-0.5 rounded text-[11px] ${shorterItem === 'A' ? 'bg-emerald-100 text-emerald-800 font-black' : 'text-slate-700'}`}>
                {metaA.len} letters
              </span>
            </div>
            <div className="text-center font-mono text-[11px] font-bold uppercase text-slate-500 flex items-center justify-center gap-1.5">
              <Ruler weight="bold" className="text-slate-400" />
              <span>Length</span>
            </div>
            <div className="text-right font-mono text-xs font-bold text-slate-900 flex items-center justify-end gap-1.5">
              <span className={`px-2 py-0.5 rounded text-[11px] ${shorterItem === 'B' ? 'bg-emerald-100 text-emerald-800 font-black' : 'text-slate-700'}`}>
                {metaB.len} letters
              </span>
            </div>
          </div>

          {/* Row 2: Syllable Count */}
          <div className="grid grid-cols-3 items-center py-2.5 border-b border-slate-100">
            <div className="font-mono text-xs font-bold text-slate-800">
              {metaA.syllables} {metaA.syllables === 1 ? 'syllable' : 'syllables'}
            </div>
            <div className="text-center font-mono text-[11px] font-bold uppercase text-slate-500 flex items-center justify-center gap-1.5">
              <Waveform weight="bold" className="text-slate-400" />
              <span>Syllables</span>
            </div>
            <div className="text-right font-mono text-xs font-bold text-slate-800">
              {metaB.syllables} {metaB.syllables === 1 ? 'syllable' : 'syllables'}
            </div>
          </div>

          {/* Row 3: Sound & Style */}
          <div className="grid grid-cols-3 items-center py-2.5 border-b border-slate-100">
            <div className="font-mono text-xs text-slate-800">
              <span className="font-bold text-slate-900">{itemA.phonetic?.label || 'Balanced'}</span>
              <span className="block text-[10.5px] text-slate-500">{metaA.isPunchy ? 'Crisp & punchy' : 'Soft & flowing'}</span>
            </div>
            <div className="text-center font-mono text-[11px] font-bold uppercase text-slate-500 flex items-center justify-center gap-1.5">
              <Sparkle weight="bold" className="text-slate-400" />
              <span>Sound feel</span>
            </div>
            <div className="text-right font-mono text-xs text-slate-800">
              <span className="font-bold text-slate-900">{itemB.phonetic?.label || 'Balanced'}</span>
              <span className="block text-[10.5px] text-slate-500">{metaB.isPunchy ? 'Crisp & punchy' : 'Soft & flowing'}</span>
            </div>
          </div>

          {/* Row 4: Typing ease */}
          <div className="grid grid-cols-3 items-center py-2.5 border-b border-slate-100">
            <div className="font-mono text-xs font-bold text-slate-900">
              <span>{metaA.typingIndex} / 10</span>
              <div className="w-24 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${metaA.typingIndex * 10}%` }} />
              </div>
            </div>
            <div className="text-center font-mono text-[11px] font-bold uppercase text-slate-500 flex items-center justify-center gap-1.5">
              <Keyboard weight="bold" className="text-slate-400" />
              <span>Typing ease</span>
            </div>
            <div className="text-right font-mono text-xs font-bold text-slate-900 flex flex-col items-end">
              <span>{metaB.typingIndex} / 10</span>
              <div className="w-24 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${metaB.typingIndex * 10}%` }} />
              </div>
            </div>
          </div>

          {/* Row 5: Available extensions */}
          <div className="grid grid-cols-3 items-center py-2.5 border-b border-slate-100">
            <div className="font-mono text-xs font-bold text-slate-800">
              <span>{metaA.availCount} free</span>
              <span className="block text-[10px] text-slate-400 font-normal">
                {metaA.availList.slice(0, 4).join(', ') || 'None'}
              </span>
            </div>
            <div className="text-center font-mono text-[11px] font-bold uppercase text-slate-500 flex items-center justify-center gap-1.5">
              <Globe weight="bold" className="text-slate-400" />
              <span>Available domains</span>
            </div>
            <div className="text-right font-mono text-xs font-bold text-slate-800">
              <span>{metaB.availCount} free</span>
              <span className="block text-[10px] text-slate-400 font-normal">
                {metaB.availList.slice(0, 4).join(', ') || 'None'}
              </span>
            </div>
          </div>

          {/* Row 6: Wholesale Price (.com) */}
          <div className="grid grid-cols-3 items-center py-2.5">
            <div className="font-mono text-xs font-bold text-emerald-700">
              ${baseline.cloudflare?.reg || 9.77} / yr
            </div>
            <div className="text-center font-mono text-[11px] font-bold uppercase text-slate-500 flex items-center justify-center gap-1.5">
              <Tag weight="bold" className="text-slate-400" />
              <span>Wholesale .com price</span>
            </div>
            <div className="text-right font-mono text-xs font-bold text-emerald-700">
              ${baseline.cloudflare?.reg || 9.77} / yr
            </div>
          </div>
        </div>
      </div>

      {/* 5. Live Brand Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Safari Browser Tab Mockup */}
        <div className="skeuo-card rounded-2xl p-5">
          <div className="font-mono text-xs font-bold uppercase text-slate-600 mb-3 flex items-center gap-2">
            <Globe weight="bold" className="text-blue-600" />
            <span>Website Address Preview</span>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-300 bg-slate-100 p-2.5 shadow-xs">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="ml-2 font-mono text-[10px] text-slate-500 font-bold truncate">
                  {itemA.name}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-1 border border-slate-200 shadow-inner">
                <ShieldCheck size={13} className="text-emerald-600 shrink-0" weight="fill" />
                <span className="font-mono text-[11px] text-slate-900 font-bold truncate">
                  https://<span className="text-amber-600">{itemA.slug}</span>.com
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-300 bg-slate-100 p-2.5 shadow-xs">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="ml-2 font-mono text-[10px] text-slate-500 font-bold truncate">
                  {itemB.name}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-1 border border-slate-200 shadow-inner">
                <ShieldCheck size={13} className="text-emerald-600 shrink-0" weight="fill" />
                <span className="font-mono text-[11px] text-slate-900 font-bold truncate">
                  https://<span className="text-cyan-600">{itemB.slug}</span>.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* App Icon Mockup */}
        <div className="skeuo-card rounded-2xl p-5">
          <div className="font-mono text-xs font-bold uppercase text-slate-600 mb-3 flex items-center gap-2">
            <DeviceMobile weight="bold" className="text-purple-600" />
            <span>App Icon Lettermark</span>
          </div>
          <div className="flex items-center justify-around py-3">
            <div className="text-center">
              <div className="h-14 w-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 shadow-md flex items-center justify-center text-white font-display text-xl font-black uppercase border border-amber-300/40">
                {itemA.name.slice(0, 2)}
              </div>
              <span className="block mt-2 font-sans text-xs font-bold text-slate-800">{itemA.name}</span>
            </div>
            <span className="text-slate-300 font-mono text-xs font-bold">VS</span>
            <div className="text-center">
              <div className="h-14 w-14 mx-auto rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-700 shadow-md flex items-center justify-center text-white font-display text-xl font-black uppercase border border-cyan-300/40">
                {itemB.name.slice(0, 2)}
              </div>
              <span className="block mt-2 font-sans text-xs font-bold text-slate-800">{itemB.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Footer Navigation Bar */}
      <div className="mt-8 flex items-center justify-end border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={() => onNavigate('results')}
          className="skeuo-push-btn inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-mono text-xs font-bold text-blue-700 hover:text-blue-800 bg-white border border-slate-300 cursor-pointer shadow-xs active:scale-95"
        >
          <ArrowLeft weight="bold" />
          <span>Return to Results</span>
        </button>
      </div>
    </div>
  )
}
