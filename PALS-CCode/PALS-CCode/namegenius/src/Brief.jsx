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
      <section className="relative min-h-[100dvh] h-screen flex flex-col justify-between pt-3 sm:pt-4 pb-4 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
        {/* Top Navigation Bar: Tactile Hardware Control Strip */}
        <header className="z-20 w-full max-w-7xl mx-auto flex items-center justify-between shrink-0 mb-1 sm:mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white shadow-md border border-slate-800">
                N
              </span>
              <span className="font-sans text-2xl font-bold tracking-tight text-slate-950 uppercase">
                NameGenius
              </span>
            </div>
            <span className="hidden rounded-lg bg-slate-950/10 px-2 py-0.5 font-mono text-[11px] font-black text-slate-900 sm:inline-block border border-slate-950/20">
              HARDWARE EDITION
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
        <div className="w-full max-w-6xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center py-2">
          {/* Left Column: Bold Neo-Pop Headline with Zentarch Font */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-950/30 bg-slate-950/10 px-4 py-1.5 font-mono text-xs font-black text-slate-900 mb-4 backdrop-blur-xs w-fit">
              <Sparkle weight="fill" className="text-amber-600 text-sm" />
              <span>TACTILE DOMAIN GENERATOR</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[62px] font-black hero-header tracking-tight text-slate-950 leading-[0.98] uppercase deboss-light">
              BRAND NAMES
              <span className="block text-purple-950 drop-shadow-xs">
                YOU CAN OWN.
              </span>
            </h1>

            <p className="mt-5 max-w-xl font-sans text-base sm:text-lg font-medium text-slate-900/80 leading-relaxed">
              Find available domain names that sound memorable and roll off the tongue. Check real-time registration across .com, .ai, and global country domains without getting stuck on taken names.
            </p>

            {/* Hardware Feature Spec Pills */}
            <div className="mt-5 flex flex-wrap items-center gap-2 font-mono text-[11px] font-black uppercase text-slate-900">
              <span className="rounded-lg bg-slate-950/10 px-3 py-1 border border-slate-950/20">
                ⚡ REAL-TIME REGISTRAR CHECK
              </span>
              <span className="rounded-lg bg-slate-950/10 px-3 py-1 border border-slate-950/20">
                ● PHONETIC TONE CONTROLS
              </span>
              <span className="rounded-lg bg-slate-950/10 px-3 py-1 border border-slate-950/20">
                ★ 30+ COUNTRY EXTENSIONS
              </span>
            </div>

            {/* Primary Action Button: Massive Terracotta Mechanical Switch */}
            <div className="mt-6 flex items-center gap-4">
              <button
                type="button"
                onClick={handleScrollToConsole}
                className="skeuo-button-terracotta inline-flex items-center justify-center rounded-2xl px-8 py-4 font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-2xl active:scale-95 cursor-pointer"
              >
                <span>FIND MY DOMAIN</span>
              </button>
            </div>
          </div>

          {/* Right Column: Floating Interactive Hardware Gadget Centerpiece */}
          <div className="lg:col-span-5 flex justify-center lg:justify-center items-center">
            <HeroHardwareGadget onInteractWithConsole={handleScrollToConsole} />
          </div>
        </div>

        {/* Hero Bottom Bar / Hardware Status Cue */}
        <footer className="w-full max-w-7xl mx-auto flex items-center justify-between font-mono text-[10px] font-black uppercase tracking-wider text-slate-900/60 pt-2 border-t border-slate-950/15">
          <div>TACTILE HARDWARE EDITION</div>
          <button
            type="button"
            onClick={handleScrollToConsole}
            className="hover:text-slate-950 transition-colors flex items-center gap-1 text-slate-900 font-extrabold cursor-pointer"
          >
            <span>OPERATE MASTER CONSOLE</span>
            <ArrowDown weight="bold" />
          </button>
          <div>VERIFIED REGISTRAR DATA</div>
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
                <h3 className="font-neuropol text-2xl font-bold uppercase tracking-tight text-slate-950">
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
