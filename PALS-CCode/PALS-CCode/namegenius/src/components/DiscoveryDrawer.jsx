import React, { useState, useEffect } from 'react'
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
        accent: 'border-blue-300 bg-blue-50 text-blue-800',
      },
      {
        id: 'wood-paper',
        title: 'Warm Wood & Paper',
        desc: 'Calm, thoughtful, craft-oriented editorial depth',
        badge: 'CRAFT & EDITORIAL',
        accent: 'border-amber-300 bg-amber-50 text-amber-800',
      },
      {
        id: 'terminal',
        title: 'Bright Terminal Screen',
        desc: 'High energy, modern, developer-first cred',
        badge: 'CYBER & DEVELOPER',
        accent: 'border-emerald-300 bg-emerald-50 text-emerald-800',
      },
      {
        id: 'greenhouse',
        title: 'Sunlit Greenhouse',
        desc: 'Clean, natural, honest, transparent simplicity',
        badge: 'ORGANIC & HONEST',
        accent: 'border-lime-300 bg-lime-50 text-lime-800',
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
        accent: 'border-blue-300 bg-blue-50 text-blue-800',
      },
      {
        id: 'developers',
        title: 'Developers & Builders',
        desc: 'Needs sleek simplicity, technical taste, and zero corporate fluff',
        badge: 'PROSUMER / DEV',
        accent: 'border-emerald-300 bg-emerald-50 text-emerald-800',
      },
      {
        id: 'consumers',
        title: 'Everyday Consumers',
        desc: 'Needs friendly warmth, clear memorability, and effortless clarity',
        badge: 'CONSUMER',
        accent: 'border-amber-300 bg-amber-50 text-amber-800',
      },
      {
        id: 'designers',
        title: 'Designers & Creatives',
        desc: 'Needs distinct aesthetic courage, editorial tone, and visual style',
        badge: 'CREATIVE',
        accent: 'border-purple-300 bg-purple-50 text-purple-800',
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
]

export default function DiscoveryDrawer({
  initialAnswers = {},
  onApplyAnswers,
  onClose,
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
    ...initialAnswers,
  })

  const handleClose = () => {
    onClose?.()
    onDismiss?.()
  }

  // Keyboard escape listener to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/65 backdrop-blur-sm overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl p-6 sm:p-8 bg-[#fbf9f4] text-slate-950 border-2 border-slate-900 shadow-2xl my-auto"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45), inset 0 2px 3px rgba(255, 255, 255, 0.9)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Textured Background Grain */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.14] mix-blend-multiply"
          style={{
            backgroundImage: `url('/grain.png')`,
            backgroundSize: '96px 96px',
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Header Console Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/90 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/10 border border-slate-950/20 text-[10.5px] font-mono text-slate-900 font-black uppercase tracking-wider shadow-xs">
              <span>Diagnostic Console · 7 Steps</span>
            </div>
            <span className="hidden sm:inline text-xs font-mono font-bold text-slate-600">
              Step {activeStep + 1} of {STRATEGIC_QUESTIONS.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="key-socket !p-[2px] !rounded-xl">
              <button
                type="button"
                onClick={handleClose}
                title="Close modal"
                className="key-cap !rounded-lg p-2 text-slate-700 hover:text-slate-950 cursor-pointer"
              >
                <X weight="bold" className="text-sm" />
              </button>
            </div>
          </div>
        </div>

        {/* Stepper Keycap Rail (Exact match with Domain Synthesizer extension keycaps) */}
        <div className="relative z-10 mt-5 flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {STRATEGIC_QUESTIONS.map((q, idx) => {
            const isActive = idx === activeStep
            const isAnswered = Boolean(answers[q.id])
            const keycapStyle = isActive
              ? 'key-cap-cobalt text-white'
              : 'key-cap text-slate-800'

            return (
              <div key={q.id} className="key-socket-dark !p-[2.5px] !rounded-[14px] flex-1 min-w-[44px]">
                <button
                  type="button"
                  onClick={() => {
                    try { playMechanicalClick('click') } catch {}
                    setActiveStep(idx)
                  }}
                  className={`${keycapStyle} w-full flex items-center justify-center gap-1.5 !rounded-[11px] py-2 font-mono text-xs font-black transition-all cursor-pointer`}
                  title={q.title}
                >
                  <span
                    className={`h-2 w-2 rounded-full shrink-0 ${
                      isActive
                        ? 'bg-cyan-300 led-glow-cyan shadow-xs'
                        : isAnswered
                        ? 'bg-emerald-400 led-glow-emerald shadow-xs'
                        : 'bg-slate-400'
                    }`}
                  />
                  <span className="deboss-light">{q.num}</span>
                </button>
              </div>
            )
          })}
        </div>

        {/* Question Header */}
        <div className="relative z-10 mt-6">
          <div className="flex items-center gap-2 text-xs font-mono font-black text-blue-700 uppercase tracking-wide">
            {currentQ.icon && <currentQ.icon weight="bold" className="text-sm" />}
            <span>Step {currentQ.num} // {currentQ.id.toUpperCase()}</span>
          </div>
          <h3 className="mt-1 font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950">
            {currentQ.title}
          </h3>
          <p className="mt-1 text-xs sm:text-sm font-sans font-medium text-slate-700 leading-relaxed">
            {currentQ.subtitle}
          </p>
        </div>

        {/* Question Content Body */}
        <div className="relative z-10 mt-6 min-h-[170px]">
          {/* TYPE 1: Spectrum Slider */}
          {currentQ.type === 'slider' && (
            <div className="skeuo-plate rounded-2xl p-5 border border-slate-300/80 bg-white shadow-xs">
              <div className="flex items-center justify-between text-xs font-mono font-bold mb-3">
                <div className="text-left">
                  <span className="text-slate-950 font-black">{currentQ.leftLabel}</span>
                  <span className="block text-[11px] text-slate-500 font-mono">e.g. {currentQ.leftExample}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-950 font-black">{currentQ.rightLabel}</span>
                  <span className="block text-[11px] text-slate-500 font-mono">e.g. {currentQ.rightExample}</span>
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
                className="hardware-slider w-full"
              />

              <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-slate-600">
                <span>0% (Minimal)</span>
                <span className="font-bold text-slate-900 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-300 font-mono text-[11px] shadow-xs">
                  {answers.personality ?? 50}% Dial Position
                </span>
                <span>100% (Expressive)</span>
              </div>
            </div>
          )}

          {/* TYPE 2 & 6: Visual Cards / Persona Cards */}
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
                    className={`p-4 rounded-2xl text-left transition-all cursor-pointer border-2 shadow-xs ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-400/40 text-slate-950'
                        : 'bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-sans text-sm font-bold text-slate-950">{opt.title}</span>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-black border uppercase ${opt.accent}`}>
                        {opt.badge}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-sans">{opt.desc}</p>
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
                    className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border-2 flex-1 min-w-[240px] shadow-xs ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-600 ring-1 ring-blue-400/40 text-slate-950'
                        : 'bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-sans text-xs font-bold text-slate-950">{opt.label}</span>
                      {isSelected && <Check weight="bold" className="text-blue-600 text-sm shrink-0" />}
                    </div>
                    <span className="block mt-1 font-mono text-[10px] text-slate-500">
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
                    className={`p-4 rounded-2xl text-left transition-all cursor-pointer border-2 shadow-xs ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-400/40 text-slate-950'
                        : 'bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-sans text-xs font-bold text-slate-950">{opt.title}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300 font-bold">
                        {opt.badge}
                      </span>
                    </div>
                    <p className="mt-1.5 font-mono text-[11px] text-blue-700 font-bold">{opt.detail}</p>
                    <span className="block mt-1 font-mono text-[10px] text-slate-500">e.g. {opt.example}</span>
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
                    className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border-2 flex items-center justify-between gap-3 shadow-xs ${
                      isSelected
                        ? 'bg-rose-50/90 border-rose-600 text-slate-950 ring-1 ring-rose-400'
                        : 'bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div>
                      <span className="font-sans text-xs font-bold text-slate-950">{opt.label}</span>
                      <span className="block mt-0.5 font-mono text-[9px] text-rose-700 font-black">{opt.tag}</span>
                    </div>
                    <div className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300 bg-white'
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
                    className={`p-4 rounded-2xl text-left transition-all cursor-pointer border-2 shadow-xs ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-400/40 text-slate-950'
                        : 'bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <span className="font-sans text-xs font-bold text-slate-950 block">{opt.title}</span>
                    <span className="mt-1 font-mono text-[11px] text-slate-600 block">{opt.desc}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer Hardware Controls */}
        <div className="relative z-10 mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200/90 pt-4">
          <div className="flex items-center gap-2">
            {activeStep > 0 && (
              <div className="key-socket !p-[2px] !rounded-xl">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="key-cap !rounded-lg px-3.5 sm:px-4 py-2 font-mono text-xs font-bold text-slate-800 hover:text-slate-950 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft weight="bold" />
                  <span>Prev</span>
                </button>
              </div>
            )}

            {!isLast && (
              <div className="key-socket !p-[2px] !rounded-xl">
                <button
                  type="button"
                  onClick={handleNext}
                  className="key-cap !rounded-lg px-3.5 sm:px-4 py-2 font-mono text-xs font-black text-blue-700 hover:text-blue-900 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next Step</span>
                  <ArrowRight weight="bold" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 sm:ml-auto w-full sm:w-auto">
            <button
              type="button"
              onClick={handleApply}
              className="skeuo-button-terracotta w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl px-5 sm:px-6 py-3 font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-xl cursor-pointer active:scale-95 group"
            >
              <Lightning weight="fill" className="text-amber-200 text-base" />
              <span>Apply & Synthesize</span>
              <ArrowRight weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
