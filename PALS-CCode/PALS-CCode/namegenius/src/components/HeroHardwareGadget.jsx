import React, { useState, useEffect, useRef } from 'react'
import { animate } from 'animejs'
import { playMechanicalClick } from '../utils/audio'
import { Waveform, Check } from '@phosphor-icons/react'

const STREAM_ITEMS = [
  { name: 'northwind', tld: '.com', status: 'AVAILABLE', price: '$9.73/yr', score: '98%' },
  { name: 'cadence', tld: '.ai', status: 'AVAILABLE', price: '$69/yr', score: '94%' },
  { name: 'linear', tld: '.app', status: 'TAKEN', price: 'Claimed', score: '89%' },
  { name: 'lumen', tld: '.io', status: 'AVAILABLE', price: '$34/yr', score: '92%' },
  { name: 'prism', tld: '.co', status: 'AVAILABLE', price: '$12/yr', score: '95%' },
]

export default function HeroHardwareGadget({ onInteractWithConsole }) {
  const [activeKey, setActiveKey] = useState('.com')
  const [dialAngle, setDialAngle] = useState(25)
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0)
  const [soundMode, setSoundMode] = useState('BOUBA')
  const streamCardRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStreamIndex((prev) => (prev + 1) % STREAM_ITEMS.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!streamCardRef.current) return
    try {
      animate(streamCardRef.current, {
        opacity: [
          { to: 0, duration: 0 },
          { to: 1, duration: 350, ease: 'outQuad' },
          { to: 1, duration: 1800 },
          { to: 0, duration: 350, ease: 'inQuad' },
        ],
        translateX: [
          { to: -16, duration: 0 },
          { to: 0, duration: 400, ease: 'outQuad' },
          { to: 0, duration: 1750 },
          { to: 16, duration: 350, ease: 'inQuad' },
        ],
        scale: [
          { to: 0.95, duration: 0 },
          { to: 1, duration: 350, ease: 'outQuad' },
          { to: 1, duration: 1750 },
          { to: 0.96, duration: 350, ease: 'inQuad' },
        ],
        duration: 2500,
        ease: 'linear',
      })
    } catch (_) {}
  }, [currentStreamIndex])

  const handleKeyClick = (key) => {
    playMechanicalClick('click')
    setActiveKey(key)
  }

  const handleDialClick = () => {
    playMechanicalClick('dial')
    setDialAngle((prev) => (prev + 45) % 360)
    setSoundMode((prev) => (prev === 'BOUBA' ? 'BALANCED' : prev === 'BALANCED' ? 'KIKI' : 'BOUBA'))
  }

  const activeItem = STREAM_ITEMS[currentStreamIndex]

  return (
    <div className="relative mx-auto w-full max-w-[440px] select-none">
      {/* Ambient Floor Shadow */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 h-10 w-4/5 rounded-full bg-black/35 blur-xl pointer-events-none" />

      {/* Main Molded Plastic Chassis (Candy Purple from Image 2) */}
      <div className="skeuo-chassis-purple relative p-5 sm:p-6 shadow-2xl animate-float-subtle">
        {/* Left Side Lanyard Strap Bracket & Braided Cord */}
        <div className="absolute -left-4 top-1/3 -translate-y-1/2 flex items-center z-10 pointer-events-auto">
          <div className="lanyard-bracket">
            <div className="lanyard-bracket-slot" />
          </div>
          {/* Braided Purple Rope Loop hanging down */}
          <div className="absolute left-[-22px] top-4 pointer-events-none flex flex-col items-center">
            <svg width="44" height="96" viewBox="0 0 44 96" fill="none" className="drop-shadow-md">
              <path
                d="M 28 6 C 14 18, 6 36, 12 58 C 16 72, 28 84, 22 94"
                stroke="#a855f7"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="4 2"
              />
              <path
                d="M 28 6 C 14 18, 6 36, 12 58 C 16 72, 28 84, 22 94"
                stroke="#c084fc"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="14" cy="62" r="7" fill="#7e22ce" stroke="#c084fc" strokeWidth="2" />
              <circle cx="16" cy="64" r="4" fill="#a855f7" />
            </svg>
          </div>
        </div>

        {/* Right Side Grip Port Notch */}
        <div className="absolute -right-2.5 top-1/3 -translate-y-1/2 w-3 h-12 rounded-r-md bg-purple-900/60 shadow-inner" />

        {/* Corner Screws */}
        <div className="chassis-screw absolute top-3 left-3.5"><span className="scale-75">+</span></div>
        <div className="chassis-screw absolute top-3 right-3.5"><span className="scale-75">+</span></div>
        <div className="chassis-screw absolute bottom-3 left-3.5"><span className="scale-75">+</span></div>
        <div className="chassis-screw absolute bottom-3 right-3.5"><span className="scale-75">+</span></div>

        {/* Top Control Header: Compass mark + Top Knurled Dial */}
        <div className="flex items-center justify-between px-1 pb-3 border-b border-purple-400/30">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-[9px] font-black text-white shadow-inner border border-slate-700">
              <span>N</span>
            </div>
            <div className="leading-tight">
              <div className="font-mono text-[11px] font-black tracking-wider text-slate-950 uppercase">
                NG-01 POCKET
              </div>
              <div className="font-mono text-[9px] font-bold text-purple-950/75">
                48kHz PHONETIC UNIT
              </div>
            </div>
          </div>

          {/* Knurled Orange Dial Knob with '*' */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] font-bold text-slate-900 uppercase tracking-wider hidden sm:inline-block">
              TONE: {soundMode}
            </span>
            <div
              onClick={handleDialClick}
              className="knurled-dial-knob"
              title="Click to turn acoustic tone dial"
              style={{ transform: `rotate(${dialAngle}deg)` }}
            >
              <div className="knurled-dial-cap">
                <span className="select-none font-sans font-black text-amber-950">*</span>
              </div>
            </div>
          </div>
        </div>

        {/* Zone 1: Recessed CRT / OLED Glass Screen */}
        <div className="screen-recess mt-3 p-4 rounded-2xl bg-slate-950 text-white relative">
          <div className="gloss-sheen" />

          {/* Status Bar inside the Screen */}
          <div className="flex items-center justify-between text-[10px] font-mono border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 led-glow-emerald" />
              <span className="text-emerald-400 font-bold tracking-wider">ONLINE // LIVE STREAM</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span>48kHz</span>
              <div className="flex items-center gap-0.5">
                <div className="h-2.5 w-1 rounded-xs bg-emerald-400" />
                <div className="h-2.5 w-1 rounded-xs bg-emerald-400" />
                <div className="h-2.5 w-1 rounded-xs bg-slate-700" />
              </div>
            </div>
          </div>

          {/* Dynamic Sound Wave & Telemetry */}
          <div className="my-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <Waveform weight="bold" className="text-base animate-pulse" />
              <span className="font-mono text-[10px] font-semibold tracking-wider text-slate-300">
                PHONETIC BIAS:
              </span>
              <span className="rounded bg-cyan-950/80 px-1.5 py-0.5 font-mono text-[10px] font-bold text-cyan-300 border border-cyan-800/60">
                {soundMode}
              </span>
            </div>
            <span className="font-mono text-[9px] text-slate-500">
              LATENCY 24ms
            </span>
          </div>

          {/* Live Domain Card Stream */}
          <div className="relative h-20 w-full rounded-xl bg-slate-900/90 border border-slate-800 p-3 flex items-center justify-between overflow-hidden shadow-inner">
            <div
              ref={streamCardRef}
              className="flex w-full items-center justify-between opacity-0 will-change-transform"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                    activeItem.status === 'AVAILABLE'
                      ? 'bg-emerald-400 led-glow-emerald'
                      : 'bg-amber-400 led-glow-amber'
                  }`}
                />
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display font-extrabold text-xl text-white tracking-tight">
                      {activeItem.name}
                    </span>
                    <span className="font-mono font-bold text-sm text-cyan-300">
                      {activeItem.tld}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-slate-400 flex items-center gap-2">
                    <span className="text-emerald-400 font-semibold">{activeItem.price}</span>
                    <span>•</span>
                    <span>Resonance {activeItem.score}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-extrabold tracking-wider uppercase border ${
                    activeItem.status === 'AVAILABLE'
                      ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700/60'
                      : 'bg-amber-950/90 text-amber-300 border-amber-700/60'
                  }`}
                >
                  {activeItem.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Zone 2: Physical Hardware Controls Deck */}
        <div className="mt-4 pt-1">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] font-black uppercase tracking-wider text-slate-950">
              TACTILE EXTENSION MATRIX
            </span>
            <span className="font-mono text-[9px] font-bold text-purple-950/80">
              CLICK KEYCAPS TO ENGAGE
            </span>
          </div>

          {/* Mechanical Keycaps inside Dark Sockets */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '.COM', key: '.com', type: 'terracotta' },
              { label: '.AI', key: '.ai', type: 'cobalt' },
              { label: '.IO', key: '.io', type: 'dark' },
              { label: '.CO', key: '.co', type: 'stone' },
            ].map((btn) => {
              const isSelected = activeKey === btn.key
              let btnClass = 'key-cap text-slate-800 font-bold'
              if (btn.type === 'terracotta' && isSelected) btnClass = 'key-cap-terracotta'
              else if (btn.type === 'cobalt' && isSelected) btnClass = 'key-cap-cobalt'
              else if (isSelected) btnClass = 'key-cap-active-dark'

              return (
                <div key={btn.key} className="key-socket-dark !p-[2.5px] !rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleKeyClick(btn.key)}
                    className={`${btnClass} w-full py-2.5 rounded-[10px] font-mono text-xs text-center transition-all`}
                  >
                    {btn.label}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Bottom Deck: Speaker Grille + Rocker Pill + Circular Check Button */}
          <div className="mt-3.5 flex items-center justify-between gap-3 pt-2">
            {/* Rocker Pill Switch */}
            <div className="flex items-center gap-1.5">
              <div className="rocker-pill">
                <button
                  type="button"
                  onClick={() => {
                    playMechanicalClick('click')
                    setSoundMode('BOUBA')
                  }}
                  className={`px-3 py-1 rounded-full font-mono text-[10px] font-extrabold transition-all ${
                    soundMode === 'BOUBA'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SOFT
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playMechanicalClick('click')
                    setSoundMode('KIKI')
                  }}
                  className={`px-3 py-1 rounded-full font-mono text-[10px] font-extrabold transition-all ${
                    soundMode === 'KIKI'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SHARP
                </button>
              </div>
            </div>

            {/* 3x3 Perforated Speaker Grille */}
            <div
              className="grid grid-cols-3 gap-1 p-1.5 rounded-lg bg-purple-900/40 border border-purple-300/30 shadow-inner"
              title="Acoustic resonator grille"
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="speaker-grille-dot !w-1.5 !h-1.5" />
              ))}
            </div>

            {/* Circular Terracotta Push Button with Debossed Checkmark */}
            <button
              type="button"
              onClick={() => {
                playMechanicalClick('heavy')
                if (onInteractWithConsole) onInteractWithConsole()
              }}
              title="Initialize full console"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-b from-orange-500 to-orange-700 border border-orange-800 text-white shadow-lg active:scale-90 transition-transform"
            >
              <Check weight="bold" className="text-base deboss-dark" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
