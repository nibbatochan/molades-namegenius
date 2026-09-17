import React, { useState } from 'react'
import {
  Waveform,
  CheckCircle,
  ArrowRight,
  Sparkle,
  Globe,
  FilmStrip,
} from '@phosphor-icons/react'

export default function StoryboardCanvas({ onJumpToConsole }) {
  const [activePhoneticTab, setActivePhoneticTab] = useState('sharp')
  const [interactiveSeed, setInteractiveSeed] = useState('cloud')

  return (
    <section className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6">
      {/* Section Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-3.5 py-1 font-mono text-xs font-semibold text-slate-700 shadow-xs">
          <FilmStrip weight="fill" className="text-blue-600" />
          <span>Why NameGenius exists</span>
        </div>
        <h2 className="mt-4 font-serif text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          The naming problem and how to solve it
        </h2>
        <p className="mx-auto mt-2 max-w-xl font-sans text-sm text-slate-600 sm:text-base">
          Finding a good business name usually means running into expensive brokers or settling for an awkward URL.
        </p>
      </div>

      {/* 3 Steps Grid Layout */}
      <div className="space-y-8">
        {/* Step 1: The Domain Problem */}
        <div className="skeuo-plate relative overflow-hidden rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 font-mono text-xs text-slate-500">
            <span className="font-bold text-rose-600">
              1. THE DOMAIN PROBLEM
            </span>
            <span className="rounded bg-rose-50 px-2 py-0.5 font-bold text-rose-700 border border-rose-200">
              Current reality
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h3 className="font-serif text-xl font-bold text-slate-900 sm:text-2xl">
                You find a good name, but the .com costs $75,000.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Most common dictionary words are already registered or parked by brokers. Typical domain generators
                respond by adding generic words like <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs text-slate-800">get</code>,{' '}
                <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs text-slate-800">try</code>, or dated suffixes like{' '}
                <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs text-slate-800">-ly</code>.
              </p>
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50/70 p-4 font-sans text-xs text-rose-950">
                <p className="font-semibold text-rose-900">
                  Why this hurts:
                </p>
                <p className="mt-1 text-rose-800 leading-relaxed">
                  Names like <span className="font-mono font-medium">trycloudsynchqapp.io</span> are long, hard to say out loud, and easy for customers to misspell.
                </p>
              </div>
            </div>

            {/* Interactive Domain Checker */}
            <div className="skeuo-recessed rounded-xl p-4 lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  Try a common keyword
                </span>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={interactiveSeed}
                    onChange={(e) => setInteractiveSeed(e.target.value)}
                    placeholder="Enter a keyword"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-mono text-xs font-bold text-slate-800 focus:outline-none"
                  />
                </div>
                <div className="mt-3 space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between rounded bg-white/80 p-2 border border-slate-200">
                    <span className="font-bold text-slate-800">{interactiveSeed || 'word'}.com</span>
                    <span className="font-semibold text-rose-600">$48,000 (Parked)</span>
                  </div>
                  <div className="flex items-center justify-between rounded bg-white/80 p-2 border border-slate-200">
                    <span className="font-bold text-slate-800">get{interactiveSeed || 'word'}.com</span>
                    <span className="font-semibold text-rose-600">Taken</span>
                  </div>
                  <div className="flex items-center justify-between rounded bg-white/80 p-2 border border-slate-200">
                    <span className="font-bold text-slate-800">the-{interactiveSeed || 'word'}hq.io</span>
                    <span className="font-semibold text-amber-700">Available (Clunky)</span>
                  </div>
                </div>
              </div>
              <p className="mt-3 font-sans text-[11px] text-slate-500">
                Most standard search tools simply add prefixes to taken words.
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: What makes good names work */}
        <div className="skeuo-plate relative overflow-hidden rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 font-mono text-xs text-slate-500">
            <span className="font-bold text-blue-600">
              2. WHAT MAKES GOOD NAMES WORK
            </span>
            <span className="rounded bg-blue-50 px-2 py-0.5 font-bold text-blue-700 border border-blue-200">
              Naming principles
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h3 className="font-serif text-xl font-bold text-slate-900 sm:text-2xl">
                Linear. Stripe. Figma. Apple. Notion.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Memorable company names are rarely literal descriptions of product features. They tend to share three simple qualities:
              </p>
              <ul className="mt-3 space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle weight="fill" className="mt-0.5 text-blue-600 text-sm shrink-0" />
                  <span><strong>Short length:</strong> 1 or 2 syllables make a name easy to pronounce and remember.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle weight="fill" className="mt-0.5 text-blue-600 text-sm shrink-0" />
                  <span><strong>Tone:</strong> Sharp consonants (K, T, X) sound technical and fast, while soft letters (M, L, O) feel approachable and calm.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle weight="fill" className="mt-0.5 text-blue-600 text-sm shrink-0" />
                  <span><strong>Evocative associations:</strong> Borrowing imagery from architecture, nature, or science instead of SaaS buzzwords.</span>
                </li>
              </ul>
            </div>

            {/* Interactive Tone Demo */}
            <div className="skeuo-recessed rounded-xl p-4 lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                    Tone comparison
                  </span>
                  <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5 shadow-inner text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={() => setActivePhoneticTab('sharp')}
                      className={`rounded px-2.5 py-0.5 font-semibold transition-all ${
                        activePhoneticTab === 'sharp'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Sharp & Technical
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePhoneticTab('soft')}
                      className={`rounded px-2.5 py-0.5 font-semibold transition-all ${
                        activePhoneticTab === 'soft'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Soft & Friendly
                    </button>
                  </div>
                </div>

                {activePhoneticTab === 'sharp' ? (
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="rounded-lg border border-cyan-200 bg-cyan-50/60 p-3 text-cyan-950">
                      <div className="flex items-center justify-between font-bold font-mono">
                        <span>Apexflow</span>
                        <span className="rounded bg-cyan-200/80 px-1.5 py-0.2 text-[10px]">Sharp</span>
                      </div>
                      <p className="mt-1 text-[11px] text-cyan-800">
                        Hard consonant stops (P, X, K). Fits developer tools, infrastructure, and analytics.
                      </p>
                    </div>
                    <div className="rounded-lg border border-cyan-200 bg-cyan-50/60 p-3 text-cyan-950">
                      <div className="flex items-center justify-between font-bold font-mono">
                        <span>Vanguard</span>
                        <span className="rounded bg-cyan-200/80 px-1.5 py-0.2 text-[10px]">Sharp</span>
                      </div>
                      <p className="mt-1 text-[11px] text-cyan-800">
                        Firm consonants that sound established and institutional.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-amber-950">
                      <div className="flex items-center justify-between font-bold font-mono">
                        <span>Lumina</span>
                        <span className="rounded bg-amber-200/80 px-1.5 py-0.2 text-[10px]">Soft</span>
                      </div>
                      <p className="mt-1 text-[11px] text-amber-800">
                        Flowing sounds (L, M, N). Fits creative software, design tools, and community apps.
                      </p>
                    </div>
                    <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-amber-950">
                      <div className="flex items-center justify-between font-bold font-mono">
                        <span>Meadow</span>
                        <span className="rounded bg-amber-200/80 px-1.5 py-0.2 text-[10px]">Soft</span>
                      </div>
                      <p className="mt-1 text-[11px] text-amber-800">
                        Gentle vowels and soft transitions that feel warm and approachable.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: How NameGenius helps */}
        <div className="skeuo-plate relative overflow-hidden rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 font-mono text-xs text-slate-500">
            <span className="font-bold text-emerald-600">
              3. HOW NAMEGENIUS HELPS
            </span>
            <span className="rounded bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 border border-emerald-200">
              The solution
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h3 className="font-serif text-xl font-bold text-slate-900 sm:text-2xl">
                Combine your keywords with real styles and live availability.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Instead of tacking on random affixes, NameGenius combines your core concept with different naming styles:
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <span className="font-bold text-blue-700">Domain options</span>
                  <p className="mt-1 text-slate-600">Check availability across .com, .io, .co, .ai, and .xyz.</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <span className="font-bold text-blue-700">Product context</span>
                  <p className="mt-1 text-slate-600">Use words related to what your product actually does.</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <span className="font-bold text-blue-700">Styles to avoid</span>
                  <p className="mt-1 text-slate-600">Filter out overused suffixes like -ly and generic SaaS buzzwords.</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <span className="font-bold text-blue-700">Tone and personality</span>
                  <p className="mt-1 text-slate-600">Choose styles inspired by different genres and aesthetics.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 p-6 text-center text-white shadow-skeuo-recessed-dark">
              <Sparkle weight="fill" className="text-amber-400 text-3xl animate-pulse" />
              <div className="mt-3 font-serif text-lg font-bold">Ready to find a name?</div>
              <p className="mt-1 font-sans text-xs text-slate-300">
                Enter your keyword below to see available names.
              </p>
              <button
                type="button"
                onClick={onJumpToConsole}
                className="skeuo-button-primary mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-mono text-xs font-bold"
              >
                <span>Get started</span>
                <ArrowRight weight="bold" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
