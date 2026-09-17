import React, { useState } from 'react'
import { Sparkle, ArrowRight, X } from '@phosphor-icons/react'

export default function DiscoveryDrawer({
  question,
  onAnswer,
  onDismiss,
}) {
  const [answer, setAnswer] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!answer.trim()) return
    onAnswer(answer.trim())
    setAnswer('')
  }

  if (!question) return null

  return (
    <div className="relative mx-auto mt-8 max-w-3xl px-4 sm:px-6 animate-toast">
      <div className="skeuo-plate relative overflow-hidden rounded-2xl border-2 border-blue-400 bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-blue-50/90 p-5 shadow-skeuo-button sm:p-6">
        {/* Dismiss button */}
        <button
          type="button"
          onClick={onDismiss}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
          title="Dismiss"
        >
          <X weight="bold" className="text-xs" />
        </button>

        <div className="flex items-center gap-2 font-mono text-xs font-semibold text-blue-700">
          <Sparkle weight="fill" className="text-blue-600 animate-spin" />
          <span>Fine-tune your results</span>
        </div>

        <h3 className="mt-2 font-serif text-lg font-bold text-slate-900 sm:text-xl">
          {question}
        </h3>
        <p className="mt-1 font-sans text-xs text-slate-600">
          Answer this quick question to help guide the next batch of names.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="e.g. fast, simple, calm, developer-friendly..."
            className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2 font-sans text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="skeuo-button-primary inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 font-sans text-xs font-semibold"
          >
            <span>Update names</span>
            <ArrowRight weight="bold" />
          </button>
        </form>
      </div>
    </div>
  )
}
