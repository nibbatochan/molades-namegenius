import React, { useState } from 'react'
import MasterSynthesizer from './components/MasterSynthesizer'
import StoryboardCanvas from './components/StoryboardCanvas'
import HeroHardwareGadget from './components/HeroHardwareGadget'
import AppNavbar from './components/AppNavbar'
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
  const [soundEnabled, setSoundEnabled] = useState(false)

  const handleScrollToConsole = () => {
    playMechanicalClick('heavy')
    const el = document.getElementById('master-synthesizer-console')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleScrollToHeader = () => {
    playMechanicalClick('click')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavClick = (dest) => {
    playMechanicalClick('click')
    if (onNavigate) onNavigate(dest)
  }

  return (
    <div className="min-h-screen bg-hardware-canvas text-slate-950 selection:bg-slate-950 selection:text-[#fae127] relative">
      {/* Background Dark Grain Texture Layer (Behind Header & Container UI) */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.14] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0.12 0 0 0 0  0 0.12 0 0 0  0 0 0.12 0 0  0 0 0 1.2 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseGrain)'/%3E%3C/svg%3E"), url('/grain.png')`,
          backgroundSize: '160px 160px, 96px 96px',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* RESPONSIVE FULL-HEIGHT HERO SECTION */}
      <section className="relative min-h-[100dvh] h-auto lg:h-screen flex flex-col justify-between pt-2 sm:pt-3 pb-3 sm:pb-3 px-3 sm:px-8 lg:px-12 overflow-visible select-none">
        {/* Top Navigation Bar: Unified Tactile Yellow AppNavbar */}
        <div className="w-full shrink-0 mb-3 sm:mb-2">
          <AppNavbar
            activeView="home"
            onNavigate={onNavigate}
            savedCount={saved.length}
            compareCount={compareSel.length}
          />
        </div>

        {/* Hero Center Stage: Neo-Pop Typography Left + Hardware Gadget Right (Mobile Stack / Desktop Grid) */}
        <div className="w-full max-w-6xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-2 items-center py-2 sm:py-4 lg:py-1">
          {/* Left Column: Bold Neo-Pop Headline with Zentarch Font */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-950/30 bg-slate-950/10 px-3.5 py-1 sm:px-4 sm:py-1.5 font-mono text-[11px] sm:text-xs font-black text-slate-900 mb-3 sm:mb-4 backdrop-blur-xs w-fit">
              <Sparkle weight="fill" className="text-amber-600 text-sm" />
              <span>TACTILE DOMAIN GENERATOR</span>
            </div>

            <div className="relative inline-block my-1">
              <h1 className="font-display text-3xl sm:text-5xl lg:text-[62px] font-black uppercase tracking-tight text-slate-950 leading-[1.02] sm:leading-[0.98] [text-shadow:2px_2px_0px_rgba(245,158,11,0.3),4px_4px_0px_rgba(0,0,0,0.06)] sm:[text-shadow:3px_3px_0px_rgba(245,158,11,0.3),6px_6px_0px_rgba(0,0,0,0.06)]">
                BRAND NAMES
                <span className="block text-purple-600 [text-shadow:2px_2px_0px_rgba(126,34,206,0.3)] sm:[text-shadow:3px_3px_0px_rgba(126,34,206,0.3)]">
                  YOU CAN OWN.
                </span>
              </h1>
            </div>

            <p className="mt-3 sm:mt-5 max-w-xl font-sans text-sm sm:text-lg font-medium text-slate-900/80 leading-relaxed">
              Find available domain names that sound memorable and roll off the tongue. Check real-time registration across .com, .ai, and global country domains without getting stuck on taken names.
            </p>

            {/* Hardware Feature Spec Pills */}
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-2 font-mono text-[10px] sm:text-[11px] font-black uppercase text-slate-900">
              <span className="rounded-lg bg-slate-950/10 px-2.5 sm:px-3 py-1 border border-slate-950/20">
                ⚡ REAL-TIME REGISTRAR CHECK
              </span>
              <span className="rounded-lg bg-slate-950/10 px-2.5 sm:px-3 py-1 border border-slate-950/20">
                ● SET BY TONE
              </span>
            </div>

            {/* Primary Action Button: Massive Terracotta Mechanical Switch */}
            <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleScrollToConsole}
                className="skeuo-button-terracotta w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl px-8 py-3.5 sm:py-4 font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-2xl active:scale-95 cursor-pointer group"
              >
                <span>FIND MY DOMAIN</span>
                <ArrowDown weight="bold" className="text-base group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Floating Interactive Hardware Gadget Centerpiece */}
          <div className="lg:col-span-5 flex justify-center lg:justify-center items-center w-full overflow-hidden sm:overflow-visible">
            <HeroHardwareGadget onInteractWithConsole={handleScrollToConsole} />
          </div>
        </div>

        {/* Hero Bottom Bar / Hardware Status Cue */}
        <footer className="w-full max-w-7xl mx-auto flex items-center justify-between font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-900/60 pt-2 border-t border-slate-950/15">
          <div className="hidden sm:block">TACTILE HARDWARE EDITION</div>
          <button
            type="button"
            onClick={handleScrollToConsole}
            className="hover:text-slate-950 transition-colors flex items-center justify-center gap-1 text-slate-900 font-extrabold cursor-pointer w-full sm:w-auto"
          >
            <span>OPERATE MASTER CONSOLE</span>
            <ArrowDown weight="bold" />
          </button>
          <div className="hidden sm:block">VERIFIED REGISTRAR DATA</div>
        </footer>
      </section>

      {/* SECTION 2: THE FULL WORKING HARDWARE CONSOLE */}
      <main className="pb-24">
        <MasterSynthesizer
          initialBrief={initial}
          onGenerate={onFindNames}
          isGenerating={false}
          onOpenModal={() => setShowModal(true)}
          onClose={handleScrollToHeader}
        />
      </main>

      {/* Storyboard / How It Works Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-card-enter">
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-white border-2 border-slate-950 shadow-2xl overflow-hidden text-slate-900">
            {/* Pinned Modal Header — Edge-to-edge with Dedicated Padding & Centering */}
            <div className="shrink-0 px-6 py-4 sm:px-8 bg-white border-b border-slate-200 flex items-center justify-between z-20">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white shadow-md border border-slate-800">
                  N
                </span>
                <h3 className="font-display text-2xl font-normal uppercase tracking-tight text-slate-950 leading-none">
                  How NameGenius Works
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="skeuo-push-btn flex h-9 w-9 items-center justify-center rounded-xl text-slate-700 hover:text-slate-950 cursor-pointer"
                title="Close modal"
              >
                <X weight="bold" className="text-lg" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="overflow-y-auto p-6 sm:p-8">
              <StoryboardCanvas onDone={() => setShowModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
