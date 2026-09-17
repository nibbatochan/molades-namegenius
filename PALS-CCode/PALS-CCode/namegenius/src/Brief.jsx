import React, { useState } from 'react'
import MasterSynthesizer from './components/MasterSynthesizer'
import StoryboardCanvas from './components/StoryboardCanvas'
import HeroHardwareGadget from './components/HeroHardwareGadget'
import { playMechanicalClick } from './utils/audio'
import {
  Sparkle,
  ArrowDown,
  BookOpen,
  X,
  SpeakerHigh,
  SpeakerSlash,
} from '@phosphor-icons/react'

export default function Brief({
  initial,
  saved = [],
  compareSel = [],
  onFindNames,
  onNavigate,
}) {
  const [showModal, setShowModal] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const handleScrollToConsole = () => {
    playMechanicalClick('heavy')
    const el = document.getElementById('master-synthesizer-console')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleNavClick = (dest) => {
    playMechanicalClick('click')
    if (onNavigate) onNavigate(dest)
  }

  return (
    <div className="min-h-screen bg-hardware-canvas text-slate-950 selection:bg-slate-950 selection:text-[#fae127]">
      {/* FULL-SCREEN 100vh HERO SECTION ON LOAD */}
      <section className="relative min-h-[100dvh] h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-hidden select-none">
        {/* Technical Periphery Markings (Style Guide §2 & Reference Image 2) */}
        <div className="pointer-events-none absolute top-3 left-6 font-mono text-[10px] font-black tracking-widest text-slate-900/60 uppercase hidden sm:block">
          NG-01 // TACTILE SYNTHESIZER
        </div>
        <div className="pointer-events-none absolute top-3 right-6 font-mono text-[10px] font-black tracking-widest text-slate-900/60 uppercase hidden sm:block">
          48kHz PHONETIC ENGINE // STEREO
        </div>

        {/* Top Navigation Bar: Tactile Hardware Control Strip */}
        <header className="z-20 w-full max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white shadow-md border border-slate-800">
                N
              </span>
              <span className="font-necosmic text-2xl font-bold tracking-tight text-slate-950 uppercase">
                NameGenius
              </span>
            </div>
            <span className="hidden rounded-lg bg-slate-950/10 px-2 py-0.5 font-mono text-[11px] font-black text-slate-900 sm:inline-block border border-slate-950/20">
              MOD. NG-01
            </span>
          </div>

          {/* Sunk-in Tactile Navigation Cluster */}
          <nav className="flex items-center gap-1 rounded-full border border-slate-950/20 bg-slate-950/10 p-1 text-xs shadow-inner backdrop-blur-xs">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full bg-slate-950 px-3.5 py-1.5 font-mono text-xs font-bold text-white shadow-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 led-glow-emerald" />
              CONSOLE
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('results')}
              className="rounded-full px-3.5 py-1.5 font-mono text-xs font-bold text-slate-900 transition-all hover:bg-slate-950/10 active:scale-95"
            >
              RESULTS
            </button>
            {onNavigate && (
              <>
                <button
                  type="button"
                  onClick={() => handleNavClick('shortlist')}
                  className="relative rounded-full px-3.5 py-1.5 font-mono text-xs font-bold text-slate-900 transition-all hover:bg-slate-950/10 active:scale-95"
                >
                  SAVED {saved.length > 0 && <span className="ml-1 font-black text-amber-700">({saved.length})</span>}
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('compare')}
                  className="rounded-full px-3.5 py-1.5 font-mono text-xs font-bold text-slate-900 transition-all hover:bg-slate-950/10 active:scale-95"
                >
                  COMPARE {compareSel.length > 0 && <span className="ml-1 font-black text-blue-700">({compareSel.length})</span>}
                </button>
              </>
            )}
          </nav>

          {/* Quick Actions: Audio SFX toggle + How it works */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled
                setSoundEnabled(next)
                if (next) playMechanicalClick('click')
              }}
              title={soundEnabled ? 'Mechanical audio haptics enabled' : 'Mechanical audio muted'}
              className="skeuo-push-btn hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-xs font-bold text-slate-900 border border-slate-950/20 bg-white/80"
            >
              {soundEnabled ? (
                <>
                  <SpeakerHigh weight="bold" className="text-emerald-600 text-sm" />
                  <span>SFX ON</span>
                </>
              ) : (
                <>
                  <SpeakerSlash weight="bold" className="text-slate-500 text-sm" />
                  <span>MUTED</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                playMechanicalClick('click')
                setShowModal(true)
              }}
              className="skeuo-push-btn inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-xs font-bold text-slate-900 border border-slate-950/20 bg-white/80 active:scale-95"
            >
              <BookOpen weight="bold" className="text-blue-700 text-sm" />
              <span>MANUAL</span>
            </button>
          </div>
        </header>

        {/* Hero Center Stage: Neo-Pop Typography Left + Hardware Gadget Right */}
        <div className="w-full max-w-7xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4">
          {/* Left Column: Bold Neo-Pop Headline with Necosmic Font */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-950/30 bg-slate-950/10 px-4 py-1.5 font-mono text-xs font-black text-slate-900 mb-6 backdrop-blur-xs w-fit">
              <Sparkle weight="fill" className="text-amber-600 text-sm" />
              <span>TACTILE HARDWARE & DOMAIN SYNTHESIZER</span>
            </div>

            <h1 className="font-necosmic text-5xl sm:text-7xl lg:text-[5.4rem] font-normal tracking-tight text-slate-950 leading-[0.92] uppercase deboss-light">
              BRAND NAMES
              <span className="block text-purple-950 drop-shadow-xs">
                YOU CAN OWN.
              </span>
            </h1>

            <p className="mt-6 max-w-xl font-sans text-base sm:text-xl font-medium text-slate-900/80 leading-relaxed">
              Stop falling in love with taken names. NameGenius combines acoustic phonetic scoring, semantic resonance, and real-time registrar milling across .com, .ai, and global country domains.
            </p>

            {/* Hardware Telemetry Spec Pills */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5 font-mono text-[11px] font-black uppercase text-slate-900">
              <span className="rounded-lg bg-slate-950/10 px-3 py-1 border border-slate-950/20">
                ● 48kHz PHONETIC ENGINE
              </span>
              <span className="rounded-lg bg-slate-950/10 px-3 py-1 border border-slate-950/20">
                ⚡ LIVE REGISTRAR VERIFIED
              </span>
              <span className="rounded-lg bg-slate-950/10 px-3 py-1 border border-slate-950/20">
                ★ SKEUOMORPHIC CONSOLE
              </span>
            </div>

            {/* Primary Action Button: Massive Terracotta Mechanical Switch */}
            <div className="mt-8 flex items-center gap-4">
              <button
                type="button"
                onClick={handleScrollToConsole}
                className="skeuo-button-terracotta inline-flex items-center gap-3 rounded-2xl px-8 py-4 font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-2xl active:scale-95 group"
              >
                <span>INITIALIZE SYNTHESIZER [↓]</span>
                <ArrowDown weight="bold" className="group-hover:translate-y-1 transition-transform text-lg" />
              </button>
            </div>
          </div>

          {/* Right Column: Floating Interactive Hardware Gadget Centerpiece */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <HeroHardwareGadget onInteractWithConsole={handleScrollToConsole} />
          </div>
        </div>

        {/* Hero Bottom Bar / Hardware Status Cue */}
        <footer className="w-full max-w-7xl mx-auto flex items-center justify-between font-mono text-[10px] font-black uppercase tracking-wider text-slate-900/60 pt-2 border-t border-slate-950/15">
          <div>MILLED HARDWARE SPEC // 2026</div>
          <button
            type="button"
            onClick={handleScrollToConsole}
            className="hover:text-slate-950 transition-colors flex items-center gap-1 text-slate-900 font-extrabold cursor-pointer"
          >
            <span>OPERATE MASTER CONSOLE</span>
            <ArrowDown weight="bold" />
          </button>
          <div>NYC MMXXIV // STEREO PHONETICS</div>
        </footer>
      </section>

      {/* SECTION 2: THE FULL WORKING HARDWARE CONSOLE */}
      <main className="pb-24">
        <MasterSynthesizer
          initialBrief={initial}
          onGenerate={onFindNames}
          isGenerating={false}
          onOpenModal={() => setShowModal(true)}
        />
      </main>

      {/* Storyboard / How It Works Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-card-enter">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-300 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950 text-xs font-black text-white">
                  N
                </span>
                <h3 className="font-necosmic text-2xl font-bold uppercase tracking-tight text-slate-950">
                  How NameGenius Works
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                <X weight="bold" />
              </button>
            </div>

            <div className="mt-6">
              <StoryboardCanvas onDone={() => setShowModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
