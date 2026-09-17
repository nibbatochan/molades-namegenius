import React from 'react'
import { Scales, X, ArrowSquareOut, SpeakerHigh } from '@phosphor-icons/react'
import { TLD_ORDER } from '../data'

export default function CompareBench({ items = [], onRemove, onClear, selectedTld = '.com' }) {
  if (items.length === 0) return null

  const handleSpeak = (name) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(name)
    utterance.rate = 0.88
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="relative mx-auto mt-10 max-w-5xl px-4 sm:px-6">
      <div className="skeuo-metal-dark overflow-hidden rounded-3xl border border-slate-700 p-6 text-white shadow-2xl sm:p-8">
        {/* Bench Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <Scales weight="bold" className="text-base" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold text-white">
                  Compare Names
                </span>
                <span className="rounded bg-cyan-500/20 border border-cyan-400/30 px-2 py-0.5 font-mono text-xs font-semibold text-cyan-300">
                  {items.length} of 2 selected
                </span>
              </div>
              <p className="font-sans text-xs text-slate-400">
                Compare length, syllables, tone, and domain availability
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClear}
            className="font-sans text-xs text-slate-400 hover:text-white transition-colors"
          >
            Clear comparison
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {items.map((item, idx) => {
            const tldMap = item.tlds || {}
            return (
              <div
                key={item.slug}
                className="skeuo-recessed-dark relative rounded-2xl border border-slate-700/60 p-5 flex flex-col justify-between"
              >
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => onRemove(item.slug)}
                  className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                  title="Remove from comparison"
                >
                  <X weight="bold" className="text-sm" />
                </button>

                <div>
                  <div className="font-mono text-xs font-semibold text-cyan-400">
                    Option {idx + 1}
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <h4 className="font-serif text-3xl font-black text-white tracking-tight">
                      {item.name}
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleSpeak(item.name)}
                      className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:text-white transition-colors"
                      title="Listen"
                    >
                      <SpeakerHigh weight="bold" className="text-sm" />
                    </button>
                  </div>

                  <div className="mt-4 space-y-2.5 font-sans text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-slate-300">
                      <span className="text-slate-400">Character count:</span>
                      <span className="font-semibold text-white font-mono">{item.slug.length} characters</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-slate-300">
                      <span className="text-slate-400">Syllable count:</span>
                      <span className="font-semibold text-white font-mono">{item.syllables || 2} syllables</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-slate-300">
                      <span className="text-slate-400">Tone:</span>
                      <span className="font-semibold text-cyan-300">
                        {item.phonetic?.profile === 'kiki' || item.phonetic?.profile === 'punchy'
                          ? 'Short & punchy'
                          : item.phonetic?.profile === 'bouba' || item.phonetic?.profile === 'smooth'
                          ? 'Smooth & friendly'
                          : 'Balanced'}
                      </span>
                    </div>

                    {/* TLD Availability */}
                    <div className="pt-1">
                      <span className="text-xs text-slate-400 font-medium">
                        Available extensions:
                      </span>
                      <div className="mt-1.5 grid grid-cols-5 gap-1 text-center font-mono text-xs">
                        {TLD_ORDER.map((ext) => {
                          const isFree = Boolean(tldMap[ext])
                          return (
                            <div
                              key={ext}
                              className={`rounded py-1 font-bold border ${
                                isFree
                                  ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-400'
                                  : 'border-slate-800 bg-slate-900/60 text-slate-600'
                              }`}
                            >
                              <div>{ext}</div>
                              <div className="text-[10px] font-normal">{isFree ? 'Free' : 'Taken'}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-800 pt-3 flex items-center justify-between">
                  <span className="font-sans text-xs text-slate-400">
                    Target: <strong className="text-white font-mono">{item.slug}{selectedTld}</strong>
                  </span>
                  <a
                    href={`https://porkbun.com/checkout/search?q=${item.slug}${selectedTld}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="skeuo-button-primary inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-sans text-xs font-semibold"
                  >
                    <span>Register</span>
                    <ArrowSquareOut weight="bold" />
                  </a>
                </div>
              </div>
            )
          })}

          {items.length === 1 && (
            <div className="skeuo-recessed-dark rounded-2xl border border-dashed border-slate-700 p-8 flex flex-col items-center justify-center text-center text-slate-500">
              <Scales weight="thin" className="text-4xl text-slate-600 mb-2" />
              <div className="font-sans text-xs font-semibold text-slate-300">
                Select one more name
              </div>
              <p className="mt-1 font-sans text-xs text-slate-500 max-w-xs">
                Click the compare icon on another card to view them side by side.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
