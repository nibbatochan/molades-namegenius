import { TLD_ORDER } from './data'

// Improved, deterministic name generator.
// Derives brandable candidates from the user's keyword, description,
// competitors and any brand-discovery answers, then returns a varied set
// that reshuffles on each `generation` and reflects newly given answers.

const STOP = new Set([
  'the', 'and', 'for', 'with', 'your', 'you', 'our', 'from', 'into', 'that',
  'this', 'are', 'app', 'name', 'names', 'like', 'want', 'need', 'make',
])
const PREFIXES = [
  'get', 'try', 'use', 'go', 'join', 'hey', 'open', 'pure', 'meta', 'hyper',
  'omni', 'super', 'the', 'my', 'run', 'on', 'pro', 'neo', 'zen', 'apex',
]
const SUFFIXES = [
  'ly', 'labs', 'hq', 'base', 'kit', 'hub', 'flow', 'wave', 'forge', 'craft',
  'loop', 'works', 'peak', 'stack', 'sync', 'yard', 'pilot', 'scout', 'space',
  'link', 'io', 'ai', 'zone', 'grid', 'wire', 'nest', 'shift', 'vault', 'pulse',
  'mind', 'gen', 'bot', 'box',
]
const ABSTRACT = [
  'nova', 'lumen', 'atlas', 'ferra', 'quill', 'orbit', 'nimbus', 'cadence',
  'harbor', 'verve', 'onyx', 'sable', 'mira', 'vela', 'luma', 'riva', 'fable',
  'juno', 'halo', 'wren',
]
const VOWELS = 'aeiou'

function hashStr(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle(arr, rnd) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

function tokens(str) {
  return (str || '')
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((w) => w.length >= 3 && !STOP.has(w))
}

export const BRAND_VIBES = {
  'minimal': {
    id: 'minimal',
    label: 'Minimal & Modern',
    subtitle: 'Crisp, sleek, and focused',
    roots: ['linear', 'stripe', 'arc', 'mono', 'plane', 'forma', 'prism', 'base', 'frame', 'axis', 'flux', 'nord'],
  },
  'authoritative': {
    id: 'authoritative',
    label: 'Bold & Premium',
    subtitle: 'Strong, established, and trusted',
    roots: ['vanguard', 'mercer', 'sterling', 'apex', 'crown', 'summit', 'sovereign', 'pillar', 'heritage', 'crest', 'monarch'],
  },
  'friendly': {
    id: 'friendly',
    label: 'Warm & Approachable',
    subtitle: 'Human, cheerful, and inviting',
    roots: ['clover', 'piper', 'meadow', 'fable', 'quill', 'whistle', 'spark', 'sprout', 'haven', 'sunny', 'bloom', 'locket'],
  },
  'technical': {
    id: 'technical',
    label: 'Technical & Fast',
    subtitle: 'Algorithmic, engineering-driven',
    roots: ['cortex', 'nexus', 'vector', 'cipher', 'axon', 'synth', 'turing', 'grid', 'pulse', 'spectre', 'matrix', 'kairo'],
  },
  'organic': {
    id: 'organic',
    label: 'Organic & Grounded',
    subtitle: 'Natural, sustainable, and calm',
    roots: ['timber', 'breeze', 'willow', 'terra', 'acorn', 'stone', 'ember', 'canopy', 'cedar', 'moss', 'flint'],
  },
  'abstract': {
    id: 'abstract',
    label: 'Abstract & Invented',
    subtitle: 'Unique coinages and clean syllables',
    roots: ['nova', 'lumen', 'atlas', 'verve', 'riva', 'onyx', 'sable', 'mira', 'vela', 'luma', 'juno', 'nimbus'],
  },
}

export const CINEMATIC_ARCHETYPES = BRAND_VIBES

export function countSyllables(word) {
  if (!word) return 1
  word = word.toLowerCase().trim()
  if (word.length <= 3) return 1
  word = word.replace(/(?:[^laeiouy]|ed|es|e)$/, '')
  word = word.replace(/^y/, '')
  const matches = word.match(/[aeiouy]{1,2}/g)
  return matches ? Math.max(1, matches.length) : 1
}

export function calculatePhoneticProfile(word) {
  if (!word) return { score: 50, label: 'Balanced tone', profile: 'balanced', tone: 'balanced' }
  const lower = word.toLowerCase()
  const smoothLetters = new Set(['b', 'm', 'l', 'n', 'r', 'w', 'u', 'o'])
  const punchyLetters = new Set(['k', 't', 'p', 'z', 'x', 'c', 'q', 'i', 'e'])
  let sCount = 0
  let pCount = 0
  for (const ch of lower) {
    if (smoothLetters.has(ch)) sCount++
    if (punchyLetters.has(ch)) pCount++
  }
  const total = sCount + pCount
  if (total === 0) return { score: 50, label: 'Balanced tone', profile: 'balanced', tone: 'balanced' }
  const ratio = Math.round((pCount / total) * 100)
  if (ratio > 62) return { score: ratio, label: 'Short & punchy', profile: 'punchy', legacyProfile: 'kiki', tone: 'punchy' }
  if (ratio < 38) return { score: ratio, label: 'Smooth & friendly', profile: 'smooth', legacyProfile: 'bouba', tone: 'smooth' }
  return { score: ratio, label: 'Balanced tone', profile: 'balanced', legacyProfile: 'balanced', tone: 'balanced' }
}

// Deterministic per-TLD availability with realistic scarcity (.com rare, .ai growing).
function tldAvailability(slug) {
  const thresh = { '.com': 20, '.io': 54, '.co': 60, '.ai': 35, '.xyz': 70 }
  const map = {}
  for (const t of TLD_ORDER) {
    const threshold = thresh[t] ?? 50
    map[t] = hashStr(slug + t) % 100 < threshold
  }
  return map
}

function tagsFor(slug, roots) {
  const tags = []
  if (slug.length <= 6) tags.push('short')
  const last = slug[slug.length - 1]
  if (slug.length <= 8 && (VOWELS.includes(last) || /(.)\1/.test(slug))) {
    tags.push('catchy')
  }
  if (roots.some((r) => r.length >= 3 && slug.includes(r))) tags.push('descriptive')
  if (tags.length === 0) tags.push('brandable')
  return tags
}

function buildCandidates(seed, mods, cinematicId, antiPatterns = {}) {
  const set = new Map() // slug -> display name
  const add = (nameParts) => {
    const name = nameParts
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (slug.length >= 3 && slug.length <= 15 && !set.has(slug)) {
      // Check anti-patterns
      if (antiPatterns?.noLy && (slug.endsWith('ly') || slug.endsWith('ify'))) return
      if (antiPatterns?.noGenericSaaS && (slug.includes('cloud') || slug.includes('sync') || slug.includes('hub') || slug.includes('stack') || slug.includes('base'))) return
      set.set(slug, name)
    }
  }

  // Active cinematic roots
  const cinematicRoots = cinematicId && CINEMATIC_ARCHETYPES[cinematicId]
    ? CINEMATIC_ARCHETYPES[cinematicId].roots
    : []

  if (seed) {
    add(cap(seed))
    for (const suf of SUFFIXES) {
      if (antiPatterns?.noLy && suf === 'ly') continue
      add(cap(seed) + suf)
    }
    for (const pre of PREFIXES) add(cap(pre) + cap(seed))
  }

  // Integrate cinematic roots
  for (const cr of cinematicRoots) {
    add(cap(cr))
    if (seed) {
      add(cap(cr) + cap(seed).slice(0, 4))
      add(cap(seed) + cap(cr).slice(0, 4))
    }
  }

  for (const m of mods) {
    add(cap(m))
    for (const suf of SUFFIXES.slice(0, 10)) {
      if (antiPatterns?.noLy && suf === 'ly') continue
      add(cap(m) + suf)
    }
  }

  if (seed) {
    for (const m of mods) add(cap(seed) + cap(m).slice(0, 4))
  }

  for (const ab of ABSTRACT) {
    add(cap(ab))
    if (seed) add(cap(ab) + cap(seed).slice(0, 4))
  }

  return set
}

export function generateNames(brief, generation = 0, answers = {}) {
  const seedTokens = tokens(brief?.name)
  const descTokens = tokens(brief?.description)
  const seed = seedTokens[0] || descTokens[0] || 'brand'
  const baseMods = [
    ...seedTokens.slice(seedTokens[0] ? 1 : 0),
    ...(seedTokens[0] ? descTokens : descTokens.slice(1)),
    ...tokens(brief?.competitors),
  ]
  const answerTokens = Object.values(answers || {}).flatMap((v) => tokens(v))
  const mods = Array.from(new Set([...baseMods, ...answerTokens]))
  const roots = [seed, ...mods]

  const cinematicId = brief?.cinematic || null
  const antiPatterns = brief?.antiPatterns || {}
  const maxSyllables = brief?.maxSyllables || 0

  const set = buildCandidates(seed, mods, cinematicId, antiPatterns)
  let items = Array.from(set, ([slug, name]) => {
    const syllables = countSyllables(slug)
    const phonetic = calculatePhoneticProfile(slug)
    return {
      name,
      slug,
      tlds: tldAvailability(slug),
      tags: tagsFor(slug, roots),
      syllables,
      phonetic,
      cinematic: cinematicId,
    }
  })

  // Syllable filter if requested
  if (maxSyllables > 0) {
    items = items.filter((item) => item.syllables <= maxSyllables)
  }

  const rnd = mulberry32(
    hashStr(`${brief?.name || ''}|${generation}|${answerTokens.length}|${cinematicId || ''}`)
  )
  items = shuffle(items, rnd)

  // Surface names shaped by answers first
  if (answerTokens.length) {
    items.sort((a, b) => {
      const aw = answerTokens.some((t) => a.slug.includes(t)) ? 0 : 1
      const bw = answerTokens.some((t) => b.slug.includes(t)) ? 0 : 1
      return aw - bw
    })
  }

  return items.slice(0, 18)
}
