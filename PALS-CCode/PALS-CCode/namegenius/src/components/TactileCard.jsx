import React, { useState } from 'react'
import {
  SpeakerHigh,
  BookmarkSimple,
  Scales,
  ArrowSquareOut,
} from '@phosphor-icons/react'
import { TLD_ORDER } from '../data'

export default function TactileCard({
  item,
  isSaved,
  isCompared,
  onToggleSave,
  onToggleCompare,
  selectedTld = '.com',
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

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

  // TLD availability map
  const tldMap = item.tlds || {}
  const primaryAvailable = Boolean(tldMap[selectedTld] ?? tldMap['.com'])

  return (
    <div className="skeuo-card relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 transition-all sm:p-6">
      {/* Specular Diagonal Gloss Sheen Overlay */}
      <div className="gloss-sheen" />

      {/* Top Meta Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 relative z-10">
        <div className="flex items-center gap-2">
          {/* Syllable Pill */}
          <span className="rounded-md bg-slate-100 px-2 py-0.5 font-sans text-xs text-slate-700 font-medium border border-slate-200 shadow-xs">
            {item.syllables || 2} syllable{(item.syllables || 2) > 1 ? 's' : ''}
          </span>

          {/* Tone profile badge */}
          {item.phonetic && (
            <span
              className={`rounded-md px-2 py-0.5 font-sans text-xs font-medium shadow-xs ${
                item.phonetic.profile === 'kiki' || item.phonetic.profile === 'punchy'
                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                  : item.phonetic.profile === 'bouba' || item.phonetic.profile === 'smooth'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {item.phonetic.profile === 'kiki' || item.phonetic.profile === 'punchy'
                ? 'Short & punchy'
                : item.phonetic.profile === 'bouba' || item.phonetic.profile === 'smooth'
                ? 'Smooth & friendly'
                : 'Balanced'}
            </span>
          )}
        </div>

        {/* Micro-Switches in Tactile Sockets */}
        <div className="flex items-center gap-1.5">
          <div className="key-socket !p-[2px] !rounded-lg">
            <button
              type="button"
              onClick={handleSpeak}
              title="Listen to pronunciation"
              className={`key-cap rounded-md p-1.5 transition-all ${
                isPlayingAudio
                  ? 'key-cap-active-dark !text-cyan-300 animate-pulse'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <SpeakerHigh weight={isPlayingAudio ? 'fill' : 'bold'} className="text-sm" />
            </button>
          </div>

          <div className="key-socket !p-[2px] !rounded-lg">
            <button
              type="button"
              onClick={() => onToggleSave(item)}
              title={isSaved ? 'Remove from saved' : 'Save to shortlist'}
              className={`key-cap rounded-md p-1.5 transition-all ${
                isSaved
                  ? '!bg-amber-500 !text-white !border-amber-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookmarkSimple weight={isSaved ? 'fill' : 'bold'} className="text-sm" />
            </button>
          </div>

          <div className="key-socket !p-[2px] !rounded-lg">
            <button
              type="button"
              onClick={() => onToggleCompare(item)}
              title={isCompared ? 'Remove from comparison' : 'Add to compare'}
              className={`key-cap rounded-md p-1.5 transition-all ${
                isCompared
                  ? '!bg-blue-600 !text-white !border-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Scales weight={isCompared ? 'fill' : 'bold'} className="text-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Brand Name Window */}
      <div className="my-5 relative z-10">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-slate-950 uppercase deboss-light">
            {item.name}
          </h3>
          <span className="font-mono text-xs text-slate-400">
            {item.slug.length} letters
          </span>
        </div>

        <p className="mt-1 font-mono text-xs text-slate-500 flex items-center gap-1.5">
          <span className="text-slate-700 font-semibold">{item.slug}{selectedTld}</span>
          {primaryAvailable ? (
            <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 led-glow-emerald" />
              Available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-medium text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              Taken
            </span>
          )}
        </p>
      </div>

      {/* Domain Availability Matrix inside Recessed Socket */}
      <div className="key-socket !p-2 !rounded-xl relative z-10">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-600 mb-1 font-bold">
          <span>Extension Matrix:</span>
        </div>
        <div className="grid grid-cols-5 gap-1 text-center font-mono text-xs">
          {TLD_ORDER.map((ext) => {
            const avail = Boolean(tldMap[ext])
            return (
              <div
                key={ext}
                className={`rounded-lg py-1 font-bold transition-all shadow-xs ${
                  avail
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                    : 'bg-white/70 text-slate-400 border border-slate-200'
                }`}
              >
                <div>{ext}</div>
                <div className="text-[9px] mt-0.5 font-bold flex items-center justify-center gap-1">
                  <span className={`h-1.5 w-1.5 rounded-full ${avail ? 'bg-emerald-500 led-glow-emerald' : 'bg-slate-300'}`} />
                  {avail ? 'Free' : 'Taken'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Registrar Link */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 relative z-10">
        <div className="flex flex-wrap gap-1">
          {item.tags?.slice(0, 2).map((t) => (
            <span key={t} className="rounded bg-slate-100 px-1.5 py-0.5 font-sans text-[11px] text-slate-600 capitalize border border-slate-200">
              {t}
            </span>
          ))}
        </div>

        <div className="key-socket !p-[2px] !rounded-lg">
          <a
            href={`https://porkbun.com/checkout/search?q=${item.slug}${selectedTld}`}
            target="_blank"
            rel="noopener noreferrer"
            className="key-cap inline-flex items-center gap-1.5 rounded-md px-3 py-1 font-mono text-xs font-bold text-slate-800 hover:text-blue-700"
          >
            <span>Register</span>
            <ArrowSquareOut weight="bold" />
          </a>
        </div>
      </div>
    </div>
  )
}
