import React, { useState, useEffect } from 'react'
import {
  Sparkle,
  ArrowLeft,
  BookOpen,
  X,
  SpeakerHigh,
  SpeakerSlash,
} from '@phosphor-icons/react'
import { playMechanicalClick, isSoundMuted, setSoundMuted } from '../utils/audio'
import StoryboardCanvas from './StoryboardCanvas'

export default function AppNavbar({
  activeView = 'home', // 'home' (or 'brief'), 'results', 'shortlist', 'compare', 'lab'
  onNavigate,
  savedCount = 0,
  compareCount = 0,
  resultsCount = null,
  rightExtra = null,
}) {
  const [showModal, setShowModal] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(!isSoundMuted())

  useEffect(() => {
    setSoundEnabled(!isSoundMuted())
  }, [])

  const handleNavClick = (dest) => {
    if (soundEnabled) playMechanicalClick('click')
    if (onNavigate) onNavigate(dest)
  }

  const handleToggleSound = () => {
    const next = !soundEnabled
    setSoundEnabled(next)
    setSoundMuted(!next)
    if (next) playMechanicalClick('switch')
  }

  const isHomeActive = activeView === 'home' || activeView === 'brief'

  return (
    <>
      <header className="z-30 w-full max-w-7xl mx-auto flex items-center justify-between shrink-0 bg-[#fae127] border-2 border-slate-950 p-1.5 sm:p-2 rounded-2xl shadow-md select-none">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleNavClick('brief')}
            className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-85 text-left"
            title="NameGenius Home"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white shadow-md border border-slate-800">
              N
            </span>
            <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-950 uppercase">
              NameGenius
            </span>
          </button>
        </div>

        {/* Center: Sunk-in Tactile Navigation Cluster with High Contrast */}
        <nav className="flex items-center gap-1 rounded-full border border-slate-950/20 bg-slate-950/10 p-1 text-xs shadow-inner backdrop-blur-xs">
          {/* 1. HOME (formerly CONSOLE/Generator) */}
          <button
            type="button"
            onClick={() => handleNavClick('brief')}
            className={`rounded-full px-3.5 py-1.5 font-mono text-xs transition-all ${
              isHomeActive
                ? 'bg-slate-950 font-black text-white shadow-sm flex items-center ring-1 ring-slate-950'
                : 'font-bold text-slate-950 hover:bg-slate-950/15 active:scale-95 cursor-pointer'
            }`}
          >
            <span>HOME</span>
          </button>

          {/* 2. RESULTS */}
          <button
            type="button"
            onClick={() => handleNavClick('results')}
            className={`rounded-full px-3.5 py-1.5 font-mono text-xs transition-all ${
              activeView === 'results'
                ? 'bg-slate-950 font-black text-white shadow-sm flex items-center ring-1 ring-slate-950'
                : 'font-bold text-slate-950 hover:bg-slate-950/15 active:scale-95 cursor-pointer'
            }`}
          >
            <span>RESULTS</span>
            {resultsCount !== null && resultsCount !== undefined && resultsCount > 0 && (
              <span
                className={`ml-1 font-black ${
                  activeView === 'results' ? 'text-amber-300' : 'text-slate-950'
                }`}
              >
                ({resultsCount})
              </span>
            )}
          </button>

          {/* 3. SAVED */}
          <button
            type="button"
            onClick={() => handleNavClick('shortlist')}
            className={`relative rounded-full px-3.5 py-1.5 font-mono text-xs transition-all cursor-pointer ${
              activeView === 'shortlist'
                ? 'bg-slate-950 font-black text-white shadow-sm flex items-center ring-1 ring-slate-950'
                : 'font-bold text-slate-950 hover:bg-slate-950/15 active:scale-95'
            }`}
          >
            <span>SAVED</span>
            {savedCount > 0 && (
              <span
                className={`ml-1 font-black ${
                  activeView === 'shortlist' ? 'text-amber-300' : 'text-amber-800'
                }`}
              >
                ({savedCount})
              </span>
            )}
          </button>

          {/* 4. COMPARE */}
          <button
            type="button"
            onClick={() => handleNavClick('compare')}
            className={`rounded-full px-3.5 py-1.5 font-mono text-xs transition-all cursor-pointer ${
              activeView === 'compare'
                ? 'bg-slate-950 font-black text-white shadow-sm flex items-center ring-1 ring-slate-950'
                : 'font-bold text-slate-950 hover:bg-slate-950/15 active:scale-95'
            }`}
          >
            <span>COMPARE</span>
            {compareCount > 0 && (
              <span
                className={`ml-1 font-black ${
                  activeView === 'compare' ? 'text-sky-300' : 'text-blue-800'
                }`}
              >
                ({compareCount})
              </span>
            )}
          </button>

          {/* 5. SPRITE LAB */}
          <button
            type="button"
            onClick={() => handleNavClick('lab')}
            className={`rounded-full px-3.5 py-1.5 font-mono text-xs font-black transition-all active:scale-95 cursor-pointer flex items-center gap-1 ${
              activeView === 'lab'
                ? 'bg-slate-950 text-white shadow-sm ring-1 ring-slate-950'
                : 'text-purple-950 bg-purple-200/90 hover:bg-purple-300 border border-purple-400/60'
            }`}
            title="Open Sprite & Boss Testing Lab"
          >
            {activeView === 'lab' ? (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 led-glow-emerald shrink-0" />
            ) : (
              <span>🧪</span>
            )}
            <span>SPRITE LAB</span>
          </button>
        </nav>

        {/* Right: Quick Actions (SFX toggle + Manual / Extra Actions) */}
        <div className="flex items-center gap-2">
          {rightExtra}

          <button
            type="button"
            onClick={handleToggleSound}
            title={soundEnabled ? 'Mechanical audio haptics enabled' : 'Mechanical audio muted'}
            className="skeuo-push-btn hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-xs font-bold text-slate-900 border border-slate-950/20 bg-white/90 cursor-pointer active:scale-95"
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
              if (soundEnabled) playMechanicalClick('click')
              setShowModal(true)
            }}
            className="skeuo-push-btn inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-xs font-bold text-slate-900 border border-slate-950/20 bg-white/90 active:scale-95 cursor-pointer"
          >
            <BookOpen weight="bold" className="text-blue-700 text-sm" />
            <span>MANUAL</span>
          </button>
        </div>
      </header>

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
              <StoryboardCanvas
                onDone={() => {
                  setShowModal(false)
                  handleNavClick('brief')
                }}
                onJumpToConsole={() => {
                  setShowModal(false)
                  handleNavClick('brief')
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
