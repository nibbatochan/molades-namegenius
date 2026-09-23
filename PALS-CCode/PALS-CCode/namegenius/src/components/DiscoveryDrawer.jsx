import React, { useState } from 'react'
import {
  Sparkle,
  ArrowRight,
  ArrowLeft,
  X,
  SlidersHorizontal,
  SpeakerHigh,
  Prohibit,
  Users,
  Globe,
  Quotes,
  Check,
  Lightning,
  TreeStructure,
} from '@phosphor-icons/react'
import { playMechanicalClick } from '../utils/audio'

export const STRATEGIC_QUESTIONS = [
  {
    id: 'personality',
    num: '01',
    title: 'How serious or playful should the brand feel?',
    subtitle: 'Dial the tone between understated precision and expressive warmth.',
    icon: SlidersHorizontal,
    type: 'slider',
    leftLabel: 'Plain & Utilitarian',
    leftExample: 'Stripe, Linear',
    rightLabel: 'Warm & Expressive',
    rightExample: 'Figma, Mailchimp',
  },
  {
    id: 'material',
    num: '02',
    title: 'What kind of space or material does it evoke?',
    subtitle: 'Pick the sensory atmosphere that best matches your product.',
    icon: Sparkle,
    type: 'cards',
    options: [
      {
        id: 'dark-metal',
        title: 'Dark Matte Metal',
        desc: 'Sharp, fast, high-precision technical feel',
        badge: 'HIGH-PERFORMANCE',
        accent: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300',
      },
      {
        id: 'wood-paper',
        title: 'Warm Wood & Paper',
        desc: 'Calm, thoughtful, craft-oriented editorial depth',
        badge: 'CRAFT & EDITORIAL',
        accent: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
      },
      {
        id: 'terminal',
        title: 'Bright Terminal Screen',
        desc: 'High energy, modern, developer-first cred',
        badge: 'CYBER & DEVELOPER',
        accent: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
      },
      {
        id: 'greenhouse',
        title: 'Sunlit Greenhouse',
        desc: 'Clean, natural, honest, transparent simplicity',
        badge: 'ORGANIC & HONEST',
        accent: 'border-lime-500/40 bg-lime-950/20 text-lime-300',
      },
    ],
  },
  {
    id: 'structures',
    num: '03',
    title: 'What word structure do you prefer?',
    subtitle: 'Select up to 2 naming structures you naturally respect.',
    icon: TreeStructure,
    type: 'multi_chips',
    maxSelect: 2,
    options: [
      { id: 'made_up', label: 'Made-up / Coined Words', example: 'Spotify, Kodak, Zillow' },
      { id: 'compound', label: 'Two Real Words Combined', example: 'DoorDash, Basecamp' },
      { id: 'metaphor', label: 'Dictionary Words as Metaphors', example: 'Anchor, Scale, Robinhood' },
      { id: 'short', label: 'Short Names (3–5 Letters)', example: 'Arc, Ramp, Oura' },
      { id: 'latin_roots', label: 'Classic Roots with Meaning', example: 'Luminary, Veritas' },
    ],
  },
  {
    id: 'sound',
    num: '04',
    title: 'How should it sound when you say it out loud?',
    subtitle: 'The phonetic mouthfeel and consonant texture.',
    icon: SpeakerHigh,
    type: 'sound_toggle',
    options: [
      {
        id: 'punchy',
        title: 'Sharp & Punchy',
        detail: 'Hard consonants (K, T, P, X)',
        example: 'Apex, Tactiq, Kortex',
        badge: 'SPEED & PRECISION',
      },
      {
        id: 'smooth',
        title: 'Soft & Flowing',
        detail: 'Gentle sounds (M, L, N, R, V)',
        example: 'Lumen, Mira, Solana',
        badge: 'CALM & LUXURY',
      },
      {
        id: 'conversational',
        title: 'Everyday Conversational',
        detail: 'Familiar, vowel-rich cadence',
        example: 'Juno, Alto, Notion',
        badge: 'ACCESSIBLE',
      },
    ],
  },
  {
    id: 'avoid',
    num: '05',
    title: 'What styles do you strictly want to avoid?',
    subtitle: 'Blacklist naming patterns so they never appear.',
    icon: Prohibit,
    type: 'checklist',
    options: [
      { id: 'startup_suffixes', label: 'Common startup suffixes (-ify, -ly, -io)', tag: 'NO -IFY / -LY' },
      { id: 'corporate_jargon', label: 'Corporate tech words (Global, Sys, Smart, Cyber)', tag: 'NO CORP JARGON' },
      { id: 'hard_to_spell', label: 'Words hard to spell over a phone call', tag: 'NO SPELL AMBIGUITY' },
      { id: 'toy_mascots', label: 'Names that sound like toys or mascots', tag: 'NO CUTESY NAMES' },
    ],
  },
  {
    id: 'audience',
    num: '06',
    title: 'Who needs to trust this name the most?',
    subtitle: 'The primary decision maker approving or using the product.',
    icon: Users,
    type: 'cards',
    options: [
      {
        id: 'enterprise',
        title: 'Corporate Buyers & Executives',
        desc: 'Needs solid institutional credibility, compliance feel, and board trust',
        badge: 'ENTERPRISE',
        accent: 'border-blue-500/40 bg-blue-950/20 text-blue-300',
      },
      {
        id: 'developers',
        title: 'Developers & Builders',
        desc: 'Needs sleek simplicity, technical taste, and zero corporate fluff',
        badge: 'PROSUMER / DEV',
        accent: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
      },
      {
        id: 'consumers',
        title: 'Everyday Consumers',
        desc: 'Needs friendly warmth, clear memorability, and effortless clarity',
        badge: 'CONSUMER',
        accent: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
      },
      {
        id: 'designers',
        title: 'Designers & Creatives',
        desc: 'Needs distinct aesthetic courage, editorial tone, and visual style',
        badge: 'CREATIVE',
        accent: 'border-purple-500/40 bg-purple-950/20 text-purple-300',
      },
    ],
  },
  {
    id: 'domainStrategy',
    num: '07',
    title: 'How important is an exact .com domain?',
    subtitle: 'Clarifies your URL acquisition appetite.',
    icon: Globe,
    type: 'radio_tier',
    options: [
      {
        id: 'com_strict',
        title: 'Must be .com',
        desc: 'Happy to add clean verbs like getbrand.com or usebrand.com',
      },
      {
        id: 'modern_tlds',
        title: 'Modern Tech Extensions (.ai, .io, .co, .xyz)',
        desc: 'Flagship identity on contemporary tech domains',
      },
      {
        id: 'brand_hacks',
        title: 'Creative Domain Hacks',
        desc: 'Compact URL combinations like read.cv or amplify.app',
      },
      {
        id: 'name_first',
        title: 'Name Strength First',
        desc: 'Extension is secondary as long as the brand is memorable',
      },
    ],
  },
  {
    id: 'contrast',
    num: '08',
    title: 'The Contrast Anchor',
    subtitle: 'Complete this positioning comparison to guide exact tone.',
    icon: Quotes,
    type: 'contrast_madlib',
  },
]

export default function DiscoveryDrawer({
  initialAnswers = {},
  onApplyAnswers,
  onDismiss,
}) {
  const [activeStep, setActiveStep] = useState(0)
  const [answers, setAnswers] = useState({
    personality: 50,
    material: 'dark-metal',
    structures: ['made_up', 'short'],
    sound: 'punchy',
    avoid: ['startup_suffixes'],
    audience: 'developers',
    domainStrategy: 'modern_tlds',
    contrastPowerful: 'Bloomberg',
    contrastSimple: 'Apple Notes',
    ...initialAnswers,
  })

  const currentQ = STRATEGIC_QUESTIONS[activeStep] || STRATEGIC_QUESTIONS[0]
  const isLast = activeStep === STRATEGIC_QUESTIONS.length - 1

  const handleNext = () => {
    try { playMechanicalClick('click') } catch {}
    if (activeStep < STRATEGIC_QUESTIONS.length - 1) {
      setActiveStep((prev) => prev + 1)
    } else {
      handleApply()
    }
  }

  const handlePrev = () => {
    try { playMechanicalClick('click') } catch {}
    if (activeStep > 0) setActiveStep((prev) => prev - 1)
  }

  const handleApply = () => {
    try { playMechanicalClick('heavy') } catch {}
    onApplyAnswers(answers)
  }

  const toggleMultiChip = (optionId, maxSelect = 2) => {
    try { playMechanicalClick('click') } catch {}
    setAnswers((prev) => {
      const cur = prev[currentQ.id] || []
      if (cur.includes(optionId)) {
        return { ...prev, [currentQ.id]: cur.filter((x) => x !== optionId) }
      }
      if (cur.length >= maxSelect) {
        return { ...prev, [currentQ.id]: [...cur.slice(1), optionId] }
      }
      return { ...prev, [currentQ.id]: [...cur, optionId] }
    })
  }

  const toggleChecklist = (optionId) => {
    try { playMechanicalClick('click') } catch {}
    setAnswers((prev) => {
      const cur = prev.avoid || []
      const next = cur.includes(optionId)
        ? cur.filter((x) => x !== optionId)
        : [...cur, optionId]
      return { ...prev, avoid: next }
    })
  }

  return (
    <div className="relative mx-auto my-8 max-w-4xl px-2 sm:px-4 animate-toast">
      <div
        className="skeuo-chassis relative overflow-hidden rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-300/80"
        style={{
          background: 'linear-gradient(180deg, #181028 0%, #0e071a 100%)',
          boxShadow: '0 20px 50px -10px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.15)',
        }}
      >
        {/* Header telemetry & LED */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 led-glow-emerald animate-pulse" />
              <span>Diagnostic Console · 3+ Regenerations</span>
            </div>
            <span className="hidden sm:inline text-xs font-mono text-slate-400">
              Question {activeStep + 1} of {STRATEGIC_QUESTIONS.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onDismiss}
              title="Dismiss diagnostic"
              className="key-socket-dark !p-[1px] !rounded-lg text-slate-400 hover:text-white cursor-pointer"
            >
              <div className="key-cap-dark !rounded-md p-1.5">
                <X weight="bold" className="text-sm" />
              </div>
            </button>
          </div>
        </div>

        {/* Stepper keycap rail */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {STRATEGIC_QUESTIONS.map((q, idx) => {
            const isActive = idx === activeStep
            const isAnswered = Boolean(answers[q.id])
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  try { playMechanicalClick('click') } catch {}
                  setActiveStep(idx)
                }}
                className={`flex-1 min-w-[38px] py-1.5 px-2 rounded-xl text-center font-mono text-[11px] font-bold transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-1 ring-blue-300'
                    : isAnswered
                    ? 'bg-slate-800/80 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-900/60 text-slate-400 border-white/5 hover:border-white/20 hover:text-white'
                }`}
                title={q.title}
              >
                <span>{q.num}</span>
              </button>
            )
          })}
        </div>

        {/* Question Header */}
        <div className="mt-5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wide">
            {currentQ.icon && <currentQ.icon weight="bold" className="text-sm" />}
            <span>Step {currentQ.num} // {currentQ.type.replace('_', ' ')}</span>
          </div>
          <h3 className="mt-1 font-display text-lg sm:text-xl font-bold uppercase tracking-tight text-white">
            {currentQ.title}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            {currentQ.subtitle}
          </p>
        </div>

        {/* Question Content Body by Type */}
        <div className="mt-6 min-h-[160px]">
          {/* TYPE 1: Spectrum Slider */}
          {currentQ.type === 'slider' && (
            <div className="key-socket-dark !p-5 !rounded-2xl bg-black/40">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 mb-3">
                <div className="text-left">
                  <span className="text-cyan-400">{currentQ.leftLabel}</span>
                  <span className="block text-[10px] text-slate-400 font-normal">e.g. {currentQ.leftExample}</span>
                </div>
                <div className="text-right">
                  <span className="text-amber-400">{currentQ.rightLabel}</span>
                  <span className="block text-[10px] text-slate-400 font-normal">e.g. {currentQ.rightExample}</span>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={answers.personality ?? 50}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  setAnswers((prev) => ({ ...prev, personality: val }))
                }}
                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />

              <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-slate-400">
                <span>0% (Minimal)</span>
                <span className="font-bold text-white px-2 py-0.5 rounded bg-slate-800 border border-white/10">
                  {answers.personality ?? 50}% Dial
                </span>
                <span>100% (Expressive)</span>
              </div>
            </div>
          )}

          {/* TYPE 2: Visual / Material Cards */}
          {currentQ.type === 'cards' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt) => {
                const isSelected = answers[currentQ.id] === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      try { playMechanicalClick('click') } catch {}
                      setAnswers((prev) => ({ ...prev, [currentQ.id]: opt.id }))
                    }}
                    className={`p-4 rounded-2xl text-left transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-slate-800/90 border-blue-400 ring-2 ring-blue-500/50 shadow-lg'
                        : 'bg-black/30 border-white/10 hover:border-white/20 hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-sans text-sm font-bold text-white">{opt.title}</span>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold border ${opt.accent}`}>
                        {opt.badge}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">{opt.desc}</p>
                  </button>
                )
              })}
            </div>
          )}

          {/* TYPE 3: Multi-Select Chips */}
          {currentQ.type === 'multi_chips' && (
            <div className="flex flex-wrap gap-2.5">
              {currentQ.options.map((opt) => {
                const selectedList = answers[currentQ.id] || []
                const isSelected = selectedList.includes(opt.id)
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleMultiChip(opt.id, currentQ.maxSelect)}
                    className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border flex-1 min-w-[240px] ${
                      isSelected
                        ? 'bg-blue-950/70 border-blue-400 ring-1 ring-blue-400 text-white shadow-md'
                        : 'bg-black/30 border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-sans text-xs font-bold">{opt.label}</span>
                      {isSelected && <Check weight="bold" className="text-cyan-300 text-sm shrink-0" />}
                    </div>
                    <span className="block mt-1 font-mono text-[10px] text-slate-400">
                      e.g. {opt.example}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {/* TYPE 4: Sound Switch */}
          {currentQ.type === 'sound_toggle' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentQ.options.map((opt) => {
                const isSelected = answers.sound === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      try { playMechanicalClick('click') } catch {}
                      setAnswers((prev) => ({ ...prev, sound: opt.id }))
                    }}
                    className={`p-4 rounded-2xl text-left transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-blue-950/80 border-blue-400 ring-2 ring-blue-500/40 shadow-lg text-white'
                        : 'bg-black/30 border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-sans text-xs font-bold">{opt.title}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10 font-bold">
                        {opt.badge}
                      </span>
                    </div>
                    <p className="mt-1.5 font-mono text-[11px] text-cyan-300">{opt.detail}</p>
                    <span className="block mt-1 font-mono text-[10px] text-slate-400">e.g. {opt.example}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* TYPE 5: Checklist / Blacklist */}
          {currentQ.type === 'checklist' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQ.options.map((opt) => {
                const selectedList = answers.avoid || []
                const isSelected = selectedList.includes(opt.id)
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleChecklist(opt.id)}
                    className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-rose-950/40 border-rose-500/70 text-rose-200 ring-1 ring-rose-500/50'
                        : 'bg-black/30 border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div>
                      <span className="font-sans text-xs font-semibold">{opt.label}</span>
                      <span className="block mt-0.5 font-mono text-[9px] text-slate-400 font-bold">{opt.tag}</span>
                    </div>
                    <div className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-rose-600 border-rose-400 text-white' : 'border-slate-600 bg-slate-900'
                    }`}>
                      {isSelected && <Check weight="bold" className="text-xs" />}
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* TYPE 7: Radio Tiers */}
          {currentQ.type === 'radio_tier' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQ.options.map((opt) => {
                const isSelected = answers.domainStrategy === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      try { playMechanicalClick('click') } catch {}
                      setAnswers((prev) => ({ ...prev, domainStrategy: opt.id }))
                    }}
                    className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-blue-950/80 border-blue-400 ring-1 ring-blue-400 text-white'
                        : 'bg-black/30 border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <span className="font-sans text-xs font-bold text-white block">{opt.title}</span>
                    <span className="mt-1 font-mono text-[11px] text-slate-400 block">{opt.desc}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* TYPE 8: Contrast Mad-Lib */}
          {currentQ.type === 'contrast_madlib' && (
            <div className="key-socket-dark !p-5 !rounded-2xl bg-black/40 space-y-4">
              <p className="font-sans text-xs sm:text-sm text-slate-300">
                Complete the contrast anchor statement to sharpen the generated positioning:
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-cyan-400 font-bold mb-1">
                    1. As capable & powerful as:
                  </label>
                  <input
                    type="text"
                    value={answers.contrastPowerful || ''}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, contrastPowerful: e.target.value }))}
                    placeholder="e.g. Bloomberg, AWS, Salesforce, Oxford..."
                    className="w-full rounded-xl border border-white/20 bg-slate-900/90 px-3.5 py-2 font-mono text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-amber-400 font-bold mb-1">
                    2. But as simple & warm to use as:
                  </label>
                  <input
                    type="text"
                    value={answers.contrastSimple || ''}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, contrastSimple: e.target.value }))}
                    placeholder="e.g. Apple Notes, Linear, Notion, a local cafe..."
                    className="w-full rounded-xl border border-white/20 bg-slate-900/90 px-3.5 py-2 font-mono text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Hardware Controls */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2">
            {activeStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="key-socket-dark !p-[1px] !rounded-xl cursor-pointer"
              >
                <div className="key-cap-dark !rounded-lg px-3 py-2 font-mono text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ArrowLeft weight="bold" />
                  <span>Previous</span>
                </div>
              </button>
            )}

            {!isLast && (
              <button
                type="button"
                onClick={handleNext}
                className="key-socket-dark !p-[1px] !rounded-xl cursor-pointer"
              >
                <div className="key-cap-dark !rounded-lg px-3 py-2 font-mono text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <span>Next Step</span>
                  <ArrowRight weight="bold" />
                </div>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleApply}
              className="key-socket-dark !p-[2px] !rounded-2xl cursor-pointer shadow-lg"
            >
              <div className="key-cap-cobalt !rounded-xl px-5 py-2.5 font-display text-xs sm:text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Lightning weight="fill" className="text-amber-300 text-base" />
                <span>Apply Diagnostic & Synthesize</span>
                <ArrowRight weight="bold" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
