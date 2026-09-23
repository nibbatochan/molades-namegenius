import React, { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs'
import { Power, Lightning, Warning, ArrowDown } from '@phosphor-icons/react'

const TICKER_MESSAGES = [
  { text: 'cloudsync.com  ──►  $85,000 (Parked by broker)', type: 'error' },
  { text: 'getswiftly.io  ──►  Taken by a reseller', type: 'error' },
  { text: 'try-flow-app-now.co  ──►  Hard to remember', type: 'warn' },
  { text: 'NameGenius  ──►  Find a name you can actually own', type: 'success' },
]

export default function IntroPowerSwitch({ isPowered, onTogglePower, onExploreNarrative }) {
  const [tickerIndex, setTickerIndex] = useState(0)
  const tickerRef = useRef(null)
  const glowRingRef = useRef(null)

  // Split-flap ticker animation loop using anime.js v4
  useEffect(() => {
    if (!isPowered) return

    const interval = setInterval(() => {
      if (tickerRef.current) {
        animate(tickerRef.current, {
          rotateX: [0, -90],
          opacity: [1, 0],
          duration: 260,
          ease: 'inQuad',
          onComplete: () => {
            setTickerIndex((prev) => (prev + 1) % TICKER_MESSAGES.length)
            if (tickerRef.current) {
              animate(tickerRef.current, {
                rotateX: [90, 0],
                opacity: [0, 1],
                duration: 380,
                ease: 'outQuad',
              })
            }
          },
        })
      }
    }, 2800)

    return () => clearInterval(interval)
  }, [isPowered])

  // Power activation burst animation
  const handlePowerClick = () => {
    const nextState = !isPowered
    onTogglePower(nextState)

    if (nextState && glowRingRef.current) {
      animate(glowRingRef.current, {
        scale: [0.8, 1.8],
        opacity: [0.9, 0],
        duration: 900,
        ease: 'outExpo',
      })
    }
  }

  const currentTicker = TICKER_MESSAGES[tickerIndex]

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Top Hardware Faceplate Chassis */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-300/80 bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] p-6 shadow-skeuo-raised sm:p-8">
        {/* Screw heads in 4 corners for skeuomorphic hardware realism */}
        <div className="absolute left-3 top-3 h-3 w-3 rounded-full border border-slate-400 bg-slate-300 shadow-inner flex items-center justify-center">
          <div className="h-1.5 w-0.5 bg-slate-500 transform rotate-45" />
        </div>
        <div className="absolute right-3 top-3 h-3 w-3 rounded-full border border-slate-400 bg-slate-300 shadow-inner flex items-center justify-center">
          <div className="h-1.5 w-0.5 bg-slate-500 transform rotate-12" />
        </div>
        <div className="absolute bottom-3 left-3 h-3 w-3 rounded-full border border-slate-400 bg-slate-300 shadow-inner flex items-center justify-center">
          <div className="h-1.5 w-0.5 bg-slate-500 transform -rotate-30" />
        </div>
        <div className="absolute bottom-3 right-3 h-3 w-3 rounded-full border border-slate-400 bg-slate-300 shadow-inner flex items-center justify-center">
          <div className="h-1.5 w-0.5 bg-slate-500 transform rotate-60" />
        </div>

        {/* Header HUD Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-300/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-skeuo-button">
              <Lightning weight="fill" className="text-amber-400 text-lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-normal uppercase tracking-tight text-slate-900">NameGenius</span>
                <span className="rounded bg-slate-200/80 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                  Ready
                </span>
              </div>
              <p className="font-sans text-xs text-slate-500">Brand naming and domain availability checker</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Status Indicator */}
            <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-3 py-1 shadow-inner">
              <div
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  isPowered
                    ? 'bg-emerald-500 led-glow-emerald'
                    : 'bg-rose-500/80'
                }`}
              />
              <span className="font-mono text-[11px] font-bold tracking-wider text-slate-700">
                {isPowered ? 'Online' : 'Standby'}
              </span>
            </div>

            {/* Heavy Toggle Switch */}
            <button
              type="button"
              onClick={handlePowerClick}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-200 focus:outline-none ${
                isPowered
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-inner'
                  : 'bg-gradient-to-r from-slate-400 to-slate-500 shadow-inner'
              }`}
              title={isPowered ? 'Turn off' : 'Turn on'}
            >
              <div
                className={`flex h-7 w-7 transform items-center justify-center rounded-full bg-white shadow-skeuo-button transition-transform duration-200 ease-out ${
                  isPowered ? 'translate-x-8 text-emerald-600' : 'translate-x-1 text-slate-600'
                }`}
              >
                <Power weight="bold" className="text-sm" />
              </div>
            </button>
          </div>
        </div>

        {/* Main Header Area */}
        <div className="mt-6 flex flex-col items-center justify-center text-center">
          <div className="relative flex items-center justify-center">
            {/* Burst Ring for Power On */}
            <div
              ref={glowRingRef}
              className="pointer-events-none absolute h-24 w-24 rounded-full border-2 border-emerald-400 opacity-0"
            />

            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/80 bg-amber-50/90 px-3 py-1 font-mono text-xs font-semibold text-amber-900 shadow-xs">
              <Warning weight="fill" className="text-amber-600" />
              Most single-word .com domains are already taken or parked
            </span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-normal uppercase tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Find a domain name you can <span className="italic underline decoration-blue-500 decoration-wavy">actually own</span>.
          </h1>
          <p className="mt-3 max-w-2xl font-sans text-base text-slate-600 sm:text-lg">
            Generate short, memorable names based on your product, preferred style, and live domain availability.
          </p>

          {/* Real Domain Ticker Window */}
          <div className="mt-6 w-full max-w-2xl overflow-hidden rounded-xl border border-slate-900/90 bg-[#0c121e] p-3.5 shadow-skeuo-recessed-dark">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 font-mono text-[10px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Live registry status
              </span>
              <span>Examples</span>
            </div>
            <div
              ref={tickerRef}
              style={{ transformOrigin: '50% 50%' }}
              className="mt-2.5 flex items-center justify-center py-2 font-mono text-xs font-bold tracking-wider sm:text-sm"
            >
              {currentTicker.type === 'error' && (
                <span className="text-rose-400 deboss-dark">{currentTicker.text}</span>
              )}
              {currentTicker.type === 'warn' && (
                <span className="text-amber-300 deboss-dark">{currentTicker.text}</span>
              )}
              {currentTicker.type === 'success' && (
                <span className="text-emerald-400 deboss-dark font-extrabold">{currentTicker.text}</span>
              )}
            </div>
          </div>

          {/* Jump to Storyboard or Synthesizer buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onExploreNarrative}
              className="skeuo-push-btn inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-mono text-xs font-bold tracking-wide text-slate-700"
            >
              <ArrowDown weight="bold" />
              <span>How it works</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
