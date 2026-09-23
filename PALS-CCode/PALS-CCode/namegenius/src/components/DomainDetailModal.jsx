import React, { useState, useMemo } from 'react'
import {
  X,
  SpeakerHigh,
  BookmarkSimple,
  Scales,
  ArrowSquareOut,
  Check,
  Copy,
  Globe,
  Storefront,
  Coins,
  ShieldCheck,
  Tag,
} from '@phosphor-icons/react'
import { TLD_ORDER } from '../data'
import { playMechanicalClick } from '../utils/audio'
import {
  getTldBaseline,
  CURRENCIES,
  formatCurrency,
} from '../utils/pricingEngine'

// Registrar metadata catalog
const REGISTRAR_CATALOG = [
  {
    id: 'cloudflare',
    name: 'Cloudflare Registrar',
    badge: 'AT-COST WHOLESALE',
    privacy: 'FREE Forever',
    pros: 'Zero markup over registry fees, enterprise Anycast DNS sync',
    rating: '4.9/5',
    getUrl: (domain) => `https://dash.cloudflare.com/domains/register?query=${encodeURIComponent(domain)}`,
  },
  {
    id: 'porkbun',
    name: 'Porkbun',
    badge: 'ZERO MARKUP',
    privacy: 'FREE Forever',
    pros: 'Wholesale baseline, zero renewal surprises, free WHOIS privacy & SSL',
    rating: '4.9/5',
    getUrl: (domain) => `https://porkbun.com/checkout/search?q=${encodeURIComponent(domain)}`,
  },
  {
    id: 'namecheap',
    name: 'Namecheap',
    badge: 'POPULAR',
    privacy: 'FREE Forever',
    pros: 'Popular management console, free DNSSEC, 24/7 customer live chat',
    rating: '4.6/5',
    getUrl: (domain) => `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(domain)}`,
  },
  {
    id: 'dynadot',
    name: 'Dynadot',
    badge: 'LOW RENEWAL',
    privacy: 'FREE Forever',
    pros: 'Clean API, domain auctions, competitive transparent renewal rates',
    rating: '4.5/5',
    getUrl: (domain) => `https://www.dynadot.com/domain/search?domain=${encodeURIComponent(domain)}`,
  },
  {
    id: 'godaddy',
    name: 'GoDaddy',
    badge: 'PROMO 1ST YR',
    privacy: 'Included (Basic)',
    pros: 'Recognizable global brand, 24/7 phone support, renewal increases apply',
    rating: '3.9/5',
    getUrl: (domain) => `https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${encodeURIComponent(domain)}`,
  },
]

export default function DomainDetailModal({
  item,
  isSaved,
  isCompared,
  onToggleSave,
  onToggleCompare,
  onClose,
  initialTld = '.com',
}) {
  const availability = item?.availability || {}
  const [selectedTld, setSelectedTld] = useState(initialTld)
  const [showAllExtensions, setShowAllExtensions] = useState(false)

  // Currency preference persisted in localStorage
  const [currency, setCurrency] = useState(() => {
    try {
      return localStorage.getItem('preferred_currency') || 'USD'
    } catch {
      return 'USD'
    }
  })

  const handleCurrencyChange = (newCode) => {
    setCurrency(newCode)
    try {
      localStorage.setItem('preferred_currency', newCode)
    } catch {}
    playMechanicalClick('click')
  }

  const [copied, setCopied] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  if (!item) return null

  const currentDomain = `${item.slug}${selectedTld}`
  const registryStatus = availability[selectedTld] || 'checking'
  const openExtensions = TLD_ORDER.filter((ext) => availability[ext] === 'available')
  const baseline = getTldBaseline(selectedTld)

  // Current pricing from multiple domain selling websites
  const registrarPricing = useMemo(() => {
    return REGISTRAR_CATALOG.map((reg) => {
      const regData = baseline[reg.id] || baseline.porkbun
      const currentPrice = regData.reg
      const renewalPrice = regData.renew
      const markup = regData.markup
      return {
        ...reg,
        currentPrice,
        renewalPrice,
        markup,
      }
    })
  }, [selectedTld, baseline])

  // Lowest current registration price registrar
  const cheapestRegistrar = useMemo(() => {
    if (!registrarPricing.length) return null
    return [...registrarPricing].sort((a, b) => a.currentPrice - b.currentPrice)[0]
  }, [registrarPricing])

  const handleCopy = () => {
    navigator.clipboard?.writeText?.(currentDomain)
    setCopied(true)
    playMechanicalClick('click')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSpeak = () => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(item.name)
    utterance.rate = 0.88
    utterance.pitch = 1.05
    utterance.onstart = () => setIsPlayingAudio(true)
    utterance.onend = () => setIsPlayingAudio(false)
    utterance.onerror = () => setIsPlayingAudio(false)
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-card-enter">
      {/* Neo-Skeuomorphic Hardware Inspection Chassis */}
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-[#f8f9fa] border-2 border-slate-950 shadow-2xl overflow-hidden select-none">
        
        {/* Pinned Modal Header with Currency Quick Switcher */}
        <div className="shrink-0 px-6 py-4 sm:px-8 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 z-20">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white shadow-md border border-slate-800">
              N
            </span>
            <div>
              <div className="font-mono text-[10px] font-black uppercase tracking-wider text-slate-500">
                DOMAIN REGISTRATION & LIVE PRICING
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-normal tracking-tight text-slate-950 uppercase leading-none">
                {item.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Header Currency Selector */}
            <div className="flex items-center gap-1 rounded-xl bg-slate-100 border border-slate-300 p-1">
              <Coins weight="bold" className="text-slate-600 text-xs ml-1" />
              <div className="flex items-center gap-0.5">
                {CURRENCIES.map((c) => {
                  const isCur = currency === c.code
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleCurrencyChange(c.code)}
                      className={`px-1.5 py-0.5 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
                        isCur
                          ? 'bg-slate-950 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-950 hover:bg-white'
                      }`}
                      title={`${c.label} (${c.symbol})`}
                    >
                      {c.code}
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSpeak}
              className="skeuo-push-btn p-2 rounded-xl text-slate-700 hover:text-slate-950 cursor-pointer"
              title="Listen to pronunciation"
            >
              <SpeakerHigh weight={isPlayingAudio ? 'fill' : 'bold'} className="text-base" />
            </button>
            <button
              type="button"
              onClick={() => {
                playMechanicalClick('click')
                onClose()
              }}
              className="skeuo-push-btn flex h-9 w-9 items-center justify-center rounded-xl text-slate-700 hover:text-slate-950 cursor-pointer"
              title="Close modal"
            >
              <X weight="bold" className="text-lg" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* ZONE 1: CRT / OLED Telemetry Glass Screen */}
          <div className="screen-recess rounded-2xl bg-slate-950 p-5 sm:p-6 text-white shadow-xl relative border border-slate-800 overflow-hidden">
            <div className="gloss-sheen" />
            <div className="absolute right-0 top-0 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span
                    className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                      registryStatus === 'available'
                        ? 'bg-emerald-400 led-glow-emerald'
                        : registryStatus === 'taken'
                        ? 'bg-rose-400'
                        : 'bg-amber-400 animate-ping'
                    }`}
                  />
                  <span className="font-mono text-xs font-black uppercase tracking-wider text-cyan-300">
                    {registryStatus === 'checking'
                      ? 'CHECKING REGISTRY…'
                      : registryStatus === 'available'
                      ? 'REGISTRY: AVAILABLE TO REGISTER'
                      : registryStatus === 'taken'
                      ? 'REGISTRY: REGISTERED'
                      : 'REGISTRY CHECK FAILED'}
                  </span>
                </div>

                <div className="font-mono text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2.5">
                  <span>{currentDomain}</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="rounded-lg p-1 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    title="Copy domain name"
                  >
                    {copied ? (
                      <Check weight="bold" className="text-emerald-400 text-lg" />
                    ) : (
                      <Copy weight="bold" className="text-lg" />
                    )}
                  </button>
                </div>
              </div>

              {/* Top Quick Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`https://${currentDomain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="skeuo-push-btn inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-mono text-xs font-bold text-slate-900 bg-white hover:bg-slate-50 active:scale-95 cursor-pointer shadow-sm"
                  title="Test if website exists or is parked"
                >
                  <Globe weight="bold" />
                  <span>VISIT URL</span>
                  <ArrowSquareOut weight="bold" />
                </a>

                {cheapestRegistrar && (
                  <a
                    href={cheapestRegistrar.getUrl(currentDomain)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="skeuo-button-primary inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-md active:scale-95 cursor-pointer hover:brightness-110"
                    title={`Buy ${currentDomain} on ${cheapestRegistrar.name} (${formatCurrency(cheapestRegistrar.currentPrice, currency)})`}
                  >
                    <span>BUY ON {cheapestRegistrar.name.split(' ')[0].toUpperCase()} ({formatCurrency(cheapestRegistrar.currentPrice, currency)})</span>
                    <ArrowSquareOut weight="bold" />
                  </a>
                )}
              </div>
            </div>

            {/* Tactile Keypad: Available Extensions Selector */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-black text-slate-300 uppercase tracking-wider">
                    Available Extensions:
                  </span>
                  <span className="rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 font-mono text-[10px] font-bold">
                    {openExtensions.length} Available
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAllExtensions(!showAllExtensions)}
                  className="font-mono text-[11px] font-semibold text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  {showAllExtensions ? '← Show available only' : 'View all extensions →'}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {(showAllExtensions || openExtensions.length === 0 ? TLD_ORDER : openExtensions).map((ext) => {
                  const extStatus = availability[ext] || 'checking'
                  const isAvail = extStatus === 'available'
                  const isCurrent = selectedTld === ext
                  const extBaseline = getTldBaseline(ext)
                  const lowestPrice = Math.min(
                    extBaseline.cloudflare?.reg ?? 99,
                    extBaseline.porkbun?.reg ?? 99,
                    extBaseline.namecheap?.reg ?? 99,
                    extBaseline.dynadot?.reg ?? 99
                  )

                  return (
                    <div key={ext} className="key-socket-dark !p-[2px] !rounded-[12px]">
                      <button
                        type="button"
                        onClick={() => {
                          playMechanicalClick('click')
                          setSelectedTld(ext)
                        }}
                        className={`flex items-center gap-2 !rounded-[10px] px-3.5 py-1.5 font-mono text-xs font-bold transition-all cursor-pointer ${
                          isCurrent
                            ? 'key-cap-cobalt text-white font-black shadow-lg ring-2 ring-cyan-400/50'
                            : isAvail
                            ? 'key-cap text-slate-800 hover:brightness-105'
                            : 'bg-slate-900/90 text-slate-500 line-through border border-slate-800/80'
                        }`}
                      >
                        <span className="text-sm font-black">{ext}</span>
                        <span
                          className={`h-2 w-2 rounded-full ${
                            isCurrent
                              ? 'bg-cyan-300 led-glow-cyan'
                              : isAvail
                              ? 'bg-emerald-400 led-glow-emerald'
                              : 'bg-slate-600'
                          }`}
                        />
                        {isAvail && (
                          <span
                            className={`text-[10px] font-semibold ${
                              isCurrent ? 'text-cyan-200' : 'text-slate-600'
                            }`}
                          >
                            {formatCurrency(lowestPrice, currency)}
                          </span>
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ZONE 2: Current Pricing From Multiple Domain Selling Websites */}
          <div className="skeuo-plate rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Storefront weight="bold" className="text-blue-600 text-lg" />
                <h4 className="font-mono text-sm font-black uppercase tracking-wider text-slate-900">
                  Current Pricing for {currentDomain}
                </h4>
              </div>
            </div>

            {/* Comparison Table of Selling Websites */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-100/90 border-b border-slate-200 font-mono text-[11px] font-bold text-slate-700 uppercase">
                      <th className="py-3 px-4">Domain Seller</th>
                      <th className="py-3 px-4">Current Price</th>
                      <th className="py-3 px-4">Annual Renewal</th>
                      <th className="py-3 px-4">WHOIS Privacy</th>
                      <th className="py-3 px-4 text-right">Direct Register</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {registrarPricing.map((reg) => {
                      const isLowest = reg.id === cheapestRegistrar?.id

                      return (
                        <tr
                          key={reg.id}
                          className={`transition-colors ${
                            isLowest ? 'bg-emerald-50/60 hover:bg-emerald-50' : 'hover:bg-slate-50/80'
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-950 font-sans text-xs sm:text-sm">
                                {reg.name}
                              </span>
                              {isLowest && (
                                <span className="rounded bg-emerald-600 px-1.5 py-0.5 font-mono text-[9px] font-black text-white shadow-xs">
                                  LOWEST PRICE
                                </span>
                              )}
                              {reg.badge && !isLowest && (
                                <span className="rounded bg-slate-200 text-slate-700 px-1.5 py-0.5 font-mono text-[9px] font-bold">
                                  {reg.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[10.5px] text-slate-500 mt-0.5 leading-tight">
                              {reg.pros}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-base font-black text-slate-900">
                            {formatCurrency(reg.currentPrice, currency)}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-600">
                            {formatCurrency(reg.renewalPrice, currency)}/yr
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                            {reg.privacy}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <a
                              href={reg.getUrl(currentDomain)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1 rounded-xl px-3.5 py-2 font-mono text-xs font-bold transition-all cursor-pointer shadow-xs ${
                                isLowest
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  : 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-300'
                              }`}
                              title={`Direct cart checkout at ${reg.name} for ${currentDomain}`}
                            >
                              <span>Buy on {reg.name.split(' ')[0]}</span>
                              <ArrowSquareOut weight="bold" />
                            </a>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ZONE 3: Brand & Vocal Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                Syllable Length
              </div>
              <div className="mt-1 font-sans text-lg font-black text-slate-900">
                {item.syllables || 2} Syllables ({item.slug.length} letters)
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                Brand Tone
              </div>
              <div className="mt-1 font-sans text-lg font-black text-cyan-800">
                {item.phonetic?.profile === 'kiki' || item.phonetic?.profile === 'punchy'
                  ? 'Short & Punchy'
                  : item.phonetic?.profile === 'bouba' || item.phonetic?.profile === 'smooth'
                  ? 'Smooth & Friendly'
                  : 'Balanced Tone'}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                Vocal Flow
              </div>
              <div className="mt-1 font-sans text-lg font-black text-emerald-700">
                High Memorability
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="shrink-0 px-6 py-4 sm:px-8 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 z-20">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleSave?.(item)}
              className={`skeuo-push-btn inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all cursor-pointer ${
                isSaved ? '!bg-amber-500 text-white' : 'text-slate-800 bg-white'
              }`}
            >
              <BookmarkSimple weight={isSaved ? 'fill' : 'bold'} />
              <span>{isSaved ? 'SAVED TO SHORTLIST' : 'SAVE NAME'}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleCompare?.(item)}
              className={`skeuo-push-btn inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all cursor-pointer ${
                isCompared ? '!bg-blue-600 text-white' : 'text-slate-800 bg-white'
              }`}
            >
              <Scales weight={isCompared ? 'fill' : 'bold'} />
              <span>{isCompared ? 'IN COMPARISON' : 'ADD TO COMPARE'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              playMechanicalClick('click')
              onClose()
            }}
            className="skeuo-push-btn rounded-xl px-5 py-2 font-mono text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  )
}
