import React, { useState } from 'react'
import MasterSynthesizer from './components/MasterSynthesizer'
import StoryboardCanvas from './components/StoryboardCanvas'
import HeroStreamAnimation from './components/HeroStreamAnimation'
import {
  Sparkle,
  ArrowDown,
  BookOpen,
  X,
} from '@phosphor-icons/react'

export default function Brief({
  initial,
  saved = [],
  compareSel = [],
  onFindNames,
  onNavigate,
}) {
  const [showModal, setShowModal] = useState(false)

  const handleScrollToConsole = () => {
    const el = document.getElementById('master-synthesizer-console')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-hardware-canvas text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar styled as an integrated brushed control strip */}
      <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/90 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-base font-extrabold tracking-tight text-slate-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-black text-white shadow-skeuo-button">
                N
              </span>
              <span className="font-serif text-lg font-bold">NameGenius</span>
            </div>
            <span className="hidden rounded-md bg-slate-100/90 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-600 sm:inline-block border border-slate-200 shadow-xs">
              MOD. NG-01
            </span>
          </div>

          {/* Pill navigation cluster inside tactile socket recess */}
          <nav className="flex items-center gap-1 rounded-full border border-slate-300/80 bg-slate-200/60 p-1 text-xs shadow-inner">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 font-bold text-blue-700 shadow-xs"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 led-glow-cyan" />
              Generator
            </button>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('results')}
              className="rounded-full px-3 py-1 font-semibold text-slate-700 transition-all duration-150 hover:text-slate-900 active:scale-95"
            >
              Results
            </button>
            {onNavigate && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate('shortlist')}
                  className="relative rounded-full px-3 py-1 font-semibold text-slate-700 transition-all duration-150 hover:text-slate-900 active:scale-95"
                >
                  Saved {saved.length > 0 && <span className="ml-0.5 font-bold text-amber-600">({saved.length})</span>}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('compare')}
                  className="rounded-full px-3 py-1 font-semibold text-slate-700 transition-all duration-150 hover:text-slate-900 active:scale-95"
                >
                  Compare {compareSel.length > 0 && <span className="ml-0.5 font-bold text-blue-700">({compareSel.length})</span>}
                </button>
              </>
            )}
          </nav>

          {/* Secondary Action: How It Works Modal Trigger */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="skeuo-push-btn inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-sans text-xs font-semibold text-slate-700 hover:text-slate-900 active:scale-95 bg-white border border-slate-200 shadow-sm"
            >
              <BookOpen weight="bold" className="text-blue-600 text-sm" />
              <span>How it works</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pb-24">
        {/* Unified Hero Section: Free-floating anime.js Domain Streams flowing behind & beside copy */}
        <section className="relative mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6 overflow-hidden">
          {/* Animated Domain Stream Layer */}
          <HeroStreamAnimation />

          {/* Right-edge overlay gradient: white to transparent from right to left so domain trails dissolve */}
          <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-32 sm:w-56 z-10 bg-gradient-to-l from-[#f8fafc] via-[#f8fafc]/80 to-transparent" />

          {/* Hero Content Layer */}
          <div className="relative z-10 max-w-3xl text-left py-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/90 px-3.5 py-1.5 font-sans text-xs font-semibold text-slate-700 shadow-xs mb-5 backdrop-blur-sm">
              <Sparkle weight="fill" className="text-amber-500 text-sm" />
              <span>Tactile Domain & Brand Name Synthesizer</span>
            </div>

            <h1 className="font-serif text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-[3.5rem] leading-[1.12] sm:leading-[1.14] deboss-light">
              Brand names you can own.{' '}
              <span className="block mt-1.5 text-blue-700 italic font-medium">
                Domains ready to claim.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl font-sans text-base text-slate-600 sm:text-lg leading-relaxed">
              Stop falling in love with taken names. NameGenius combines phonetic acoustic science and cinematic branding with real-time registrar checks across .com, .ai, and global country domains.
            </p>

            {/* Clean Single CTA scrolling downwards */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleScrollToConsole}
                className="skeuo-button-primary inline-flex items-center gap-2.5 rounded-2xl px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-skeuo-button active:scale-95"
              >
                <span>Synthesize Your Brand Name</span>
                <ArrowDown weight="bold" />
              </button>
            </div>
          </div>
        </section>

        {/* Master Synthesizer Console */}
        <MasterSynthesizer
          initialBrief={initial}
          onGenerate={onFindNames}
          isGenerating={false}
        />
      </main>

      {/* How It Works Modal Dialog */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-950/70 backdrop-blur-sm animate-toast"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/90 bg-white/95 pb-4 backdrop-blur-sm">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <BookOpen weight="bold" className="text-base" />
                </span>
                <div>
                  <h2 className="font-serif text-lg font-bold text-slate-900">
                    How NameGenius Works
                  </h2>
                  <p className="font-sans text-xs text-slate-500">
                    The naming dilemma and acoustic brand principles
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="skeuo-push-btn flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:text-slate-900"
                aria-label="Close modal"
              >
                <X weight="bold" className="text-sm" />
              </button>
            </div>

            {/* Modal Body: Storyboard Canvas */}
            <div className="mt-4">
              <StoryboardCanvas onJumpToConsole={() => setShowModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

