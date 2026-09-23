import { useState } from 'react'
import { Agentation } from 'agentation'
import Brief from './Brief'
import Results from './Results'
import { Shortlist, Compare } from './Screens'
import TestingLab from './TestingLab'

const DEFAULT_BRIEF = {
  name: '',
  description: '',
  competitors: '',
  tld: '.com',
}

function App() {
  const urlParams = new URLSearchParams(window.location.search)
  const initialView = urlParams.get('view') || 'brief'
  const [view, setView] = useState(initialView)
  const [_history, setHistory] = useState([])

  // Clear any residual dark mode class from html and localStorage
  useState(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark')
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('namegenius_theme')
    }
  })

  // Shared, app-wide state so every screen works off the same data.
  const [brief, setBrief] = useState(DEFAULT_BRIEF)
  const [saved, setSaved] = useState([]) // name items on the shortlist
  const [compareSel, setCompareSel] = useState([]) // up to 2 name items
  const [generation, setGeneration] = useState(0) // bump to reshuffle results
  const [resultsCache, setResultsCache] = useState(null) // persistent results cache across navigation

  // History-aware navigation: Back always returns to the previous screen.
  const navigate = (next) => {
    setHistory((h) => [...h, view])
    setView(next)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    if (document.documentElement) document.documentElement.scrollTop = 0
    if (document.body) document.body.scrollTop = 0
  }

  const back = () => {
    setHistory((h) => {
      if (h.length === 0) {
        setView('brief')
        return h
      }
      const copy = h.slice()
      const prev = copy.pop()
      setView(prev)
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      if (document.documentElement) document.documentElement.scrollTop = 0
      if (document.body) document.body.scrollTop = 0
      return copy
    })
  }

  const startSearch = (values) => {
    setBrief(values)
    setGeneration(0)
    setResultsCache(null) // clear cache on new search brief
    navigate('results')
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    if (document.documentElement) document.documentElement.scrollTop = 0
    if (document.body) document.body.scrollTop = 0
  }

  const regenerate = () => {
    setGeneration((g) => g + 1)
  }

  const toggleSaved = (item) =>
    setSaved((list) =>
      list.some((s) => s.slug === item.slug)
        ? list.filter((s) => s.slug !== item.slug)
        : [...list, item]
    )

  const toggleCompare = (item) =>
    setCompareSel((sel) => {
      if (sel.some((s) => s.slug === item.slug)) {
        return sel.filter((s) => s.slug !== item.slug)
      }
      if (sel.length < 2) return [...sel, item]
      return [sel[1], item] // keep it to two: drop the oldest
    })

  const renderCurrentView = () => {
    switch (view) {
      case 'results':
        return (
          <Results
            brief={brief}
            saved={saved}
            compareSel={compareSel}
            generation={generation}
            resultsCache={resultsCache}
            onUpdateResultsCache={setResultsCache}
            onRegenerate={regenerate}
            onToggleSaved={toggleSaved}
            onToggleCompare={toggleCompare}
            onNewSearch={() => navigate('brief')}
            onNavigate={navigate}
          />
        )
      case 'shortlist':
        return (
          <Shortlist
            saved={saved}
            compareSel={compareSel}
            onRemove={toggleSaved}
            onToggleCompare={toggleCompare}
            onBack={back}
            onNavigate={navigate}
          />
        )
      case 'compare':
        return (
          <Compare
            saved={saved}
            compareSel={compareSel}
            onToggleCompare={toggleCompare}
            onSelectCompare={setCompareSel}
            onClear={() => setCompareSel([])}
            onBack={back}
            onNavigate={navigate}
          />
        )
      case 'lab':
        return (
          <TestingLab
            onNavigate={navigate}
            savedCount={saved.length}
            compareCount={compareSel.length}
          />
        )
      case 'brief':
      default:
        return (
          <Brief
            initial={brief}
            saved={saved}
            compareSel={compareSel}
            onFindNames={startSearch}
            onNavigate={navigate}
          />
        )
    }
  }

  return (
    <>
      {renderCurrentView()}
      <Agentation />
    </>
  )
}

export default App
