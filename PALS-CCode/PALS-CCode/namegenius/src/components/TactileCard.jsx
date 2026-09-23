import React, { useState } from 'react'
import {
  SpeakerHigh,
  BookmarkSimple,
  Scales,
  ArrowSquareOut,
  Info,
} from '@phosphor-icons/react'
import { TLD_ORDER } from '../data'
import DomainDetailModal from './DomainDetailModal'

function RegistryMark({ status }) {
  if (status === 'available') {
    return (
      <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 led-glow-emerald" />
        Available
      </span>
    )
  }
  if (status === 'taken') {
    return (
      <span className="inline-flex items-center gap-1 font-medium text-slate-400">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
        Taken
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 font-medium text-amber-600">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
      {status === 'unknown' ? 'Unknown' : 'Checking'}
    </span>
  )
}

export default function TactileCard({
  item,
  isSaved,
  isCompared,
  onToggleSave,
  onToggleCompare,
  selectedTld = '.com',
  rationale = null,
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [isExpandedRationale, setIsExpandedRationale] = useState(false)

  // Web Speech API text-to-speech pronunciation
  const handleSpeak = (e) => {
    e.stopPropagation()
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

  const availability = item.availability || {}
  const primaryStatus = availability[selectedTld] || 'checking'

  return (
    <>
      <div className="skeuo-card relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 transition-all sm:p-6">
        {/* Specular Diagonal Gloss Sheen Overlay */}
        <div className="gloss-sheen" />

        {/* Top Meta Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 relative z-10">
          <div className="flex items-center gap-1.5 min-w-0">
            {/* Syllable Pill */}
            <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 font-sans text-xs text-slate-700 font-medium border border-slate-200 shadow-xs">
              {item.syllables || 2} syl
            </span>

            {/* Tone profile badge — trimmed to eliminate right extend */}
            {item.phonetic && (
              <span
                className={`shrink-0 rounded-md px-2 py-0.5 font-sans text-xs font-semibold shadow-xs ${
                  item.phonetic.profile === 'kiki' || item.phonetic.profile === 'punchy'
                    ? 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                    : item.phonetic.profile === 'bouba' || item.phonetic.profile === 'smooth'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {item.phonetic.profile === 'kiki' || item.phonetic.profile === 'punchy'
                  ? 'Punchy'
                  : item.phonetic.profile === 'bouba' || item.phonetic.profile === 'smooth'
                  ? 'Smooth'
                  : 'Balanced'}
              </span>
            )}
          </div>

          {/* Micro-Switches in Tactile Sockets with Matched Concentric Radii */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="key-socket !p-[2.5px] !rounded-[10px]">
              <button
                type="button"
                onClick={handleSpeak}
                title="Listen to pronunciation"
                className={`key-cap !rounded-[7.5px] p-1.5 transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'key-cap-active-dark !text-cyan-300 animate-pulse'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <SpeakerHigh weight={isPlayingAudio ? 'fill' : 'bold'} className="text-sm" />
              </button>
            </div>

            <div className="key-socket !p-[2.5px] !rounded-[10px]">
              <button
                type="button"
                onClick={() => onToggleSave(item)}
                title={isSaved ? 'Remove from saved' : 'Save to shortlist'}
                className={`key-cap !rounded-[7.5px] p-1.5 transition-all cursor-pointer ${
                  isSaved
                    ? '!bg-none !bg-amber-500 !text-white !border-amber-600 shadow-inner'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <BookmarkSimple
                  weight={isSaved ? 'fill' : 'bold'}
                  className={`text-sm ${isSaved ? '!text-white' : ''}`}
                />
              </button>
            </div>

            <div className="key-socket !p-[2.5px] !rounded-[10px]">
              <button
                type="button"
                onClick={() => onToggleCompare(item)}
                title={isCompared ? 'Remove from comparison' : 'Add to compare'}
                className={`key-cap !rounded-[7.5px] p-1.5 transition-all cursor-pointer ${
                  isCompared
                    ? '!bg-none !bg-blue-600 !text-white !border-blue-700 shadow-inner'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <Scales
                  weight={isCompared ? 'fill' : 'bold'}
                  className={`text-sm ${isCompared ? '!text-white' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Brand Name Window */}
        <div 
          onClick={() => {
            try { playMechanicalClick('click') } catch {}
            setShowDetailModal(true)
          }}
          className="my-5 relative z-10 cursor-pointer group"
          title="Click to view pricing & details"
        >
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-display font-normal text-2xl sm:text-3xl tracking-tight text-slate-950 uppercase deboss-light group-hover:text-blue-900 transition-colors">
              {item.name}
            </h3>
            <span className="font-mono text-xs text-slate-400">
              {item.slug.length} letters
            </span>
          </div>

          <p className="mt-1 font-mono text-xs text-slate-500 flex items-center gap-1.5">
            <span className="text-slate-700 font-semibold">{item.slug}{selectedTld}</span>
            <RegistryMark status={primaryStatus} />
          </p>

          {/* AI Rationale — shown only when AI provided one */}
          {rationale && (
            <div className="mt-2 text-[11px] text-slate-600 leading-relaxed">
              <p className={`font-sans not-italic transition-all ${isExpandedRationale ? '' : 'line-clamp-2'}`} title={rationale}>
                {rationale}
              </p>
              {rationale.length > 75 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsExpandedRationale((prev) => !prev)
                  }}
                  className="mt-0.5 inline-flex items-center text-[10px] font-mono font-bold text-slate-500 hover:text-slate-800 cursor-pointer not-italic transition-colors"
                >
                  {isExpandedRationale ? 'Show less ▴' : 'Read more ▾'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Domain Availability Matrix inside Recessed Socket (Clickable for full cost breakdown) */}
        <div
          onClick={() => setShowDetailModal(true)}
          className="key-socket !p-2.5 !rounded-2xl relative z-10 cursor-pointer hover:border-slate-400/80 transition-all group"
          title="Click to compare registrar prices & buy"
        >
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-600 mb-1.5 font-bold">
            <span>Extension Matrix:</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 text-center font-mono text-xs">
            {TLD_ORDER.map((ext) => {
              const status = availability[ext] || 'checking'
              const open = status === 'available'
              return (
                <div
                  key={ext}
                  className={`rounded-xl py-1 font-bold transition-all shadow-xs ${
                    open
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                      : status === 'taken'
                      ? 'bg-white/70 text-slate-400 border border-slate-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  <div className="text-[11px]">{ext}</div>
                  <div className="text-[9px] mt-0.5 font-bold flex items-center justify-center gap-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-emerald-500 led-glow-emerald' : status === 'taken' ? 'bg-slate-300' : 'bg-amber-400'}`} />
                    <span>{status === 'available' ? 'Open' : status === 'taken' ? 'Taken' : status === 'unknown' ? 'Unknown' : '…'}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Bar: Tags left, single Blue Register button right */}
        <div 
          onClick={() => {
            try { playMechanicalClick('click') } catch {}
            setShowDetailModal(true)
          }}
          className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 relative z-10 cursor-pointer"
          title="Click to view pricing & register domain"
        >
          <div 
            className="flex flex-wrap gap-1"
            onClick={(e) => {
              e.stopPropagation()
              setShowDetailModal(true)
            }}
          >
            {item.tags?.slice(0, 2).map((t) => (
              <span key={t} className="rounded bg-slate-100 px-1.5 py-0.5 font-sans text-[11px] text-slate-600 capitalize border border-slate-200 hover:bg-slate-200 transition-colors">
                {t}
              </span>
            ))}
          </div>

          <div 
            className="flex items-center"
            onClick={(e) => {
              e.stopPropagation()
              setShowDetailModal(true)
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                try { playMechanicalClick('click') } catch {}
                setShowDetailModal(true)
              }}
              className="skeuo-button-primary inline-flex items-center gap-1.5 rounded-xl px-4 py-1.5 font-mono text-xs font-bold text-white shadow-xs hover:brightness-110 active:scale-95 cursor-pointer"
              title={`Compare prices & register ${item.slug}${selectedTld}`}
            >
              <span>Register</span>
              <ArrowSquareOut weight="bold" />
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Domain & Registrar Comparison Modal */}
      {showDetailModal && (
        <DomainDetailModal
          item={item}
          isSaved={isSaved}
          isCompared={isCompared}
          onToggleSave={onToggleSave}
          onToggleCompare={onToggleCompare}
          initialTld={selectedTld}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </>
  )
}
