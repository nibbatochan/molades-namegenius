// Vercel Serverless Function: /api/generate
// Proxies brand name generation to Groq. The API key stays on the server.

export const config = {
  runtime: 'nodejs', // Node.js runtime for reliable process.env access
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

const CINEMATIC_LABELS = {
  minimal: 'Minimal & Modern — crisp, sleek, focused (think Linear, Stripe, Arc)',
  authoritative: 'Bold & Premium — strong, established, trusted (think Vanguard, Apex)',
  friendly: 'Warm & Approachable — human, cheerful, inviting (think Clover, Bloom)',
  technical: 'Technical & Fast — algorithmic, engineering-driven (think Cortex, Nexus)',
  organic: 'Organic & Grounded — natural, sustainable, calm (think Timber, Terra)',
  abstract: 'Abstract & Invented — unique coinages and clean syllables (think Nova, Lumen)',
}

function buildPrompt(brief) {
  const vibe = CINEMATIC_LABELS[brief.cinematic] || 'Any style that fits the brief'
  const competitorLine = brief.competitors?.trim()
    ? `Competitors to differentiate from: "${brief.competitors.trim()}"`
    : 'No specific competitors mentioned — research the space broadly.'

  return `You are a world-class brand naming consultant. Your job is to generate exactly 18 unique, memorable, domain-safe brand names for the following brief.

Use your knowledge of the market and any available search context to research:
- Current competitor positioning and naming patterns in this space
- Trending brand name styles for this industry (2024–2025)
- Semantic fields, metaphors, and concepts that resonate with the target audience

BRIEF:
Keyword / seed: "${brief.name?.trim() || '(none)'}"
Description: "${brief.description?.trim() || '(none)'}"
${competitorLine}
Style vibe: ${vibe}
Preferred TLD: "${brief.tld || '.com'}"

NAMING RULES:
1. Domain-safe slugs: lowercase letters and numbers only, 3–15 characters, no hyphens
2. Each name must be distinct — no two names from the same root word
3. Mix of styles: at least 3 abstract/invented names, at least 3 descriptive/compound names
4. Avoid generic startup clichés: no "ify", "ly" suffixes unless the brief specifically calls for them
5. The rationale must reference the specific industry, competitor landscape, or target audience — no generic statements
6. Phonetic profile: classify each name as "punchy" (hard consonants: k, t, p, x), "smooth" (soft sounds: m, l, n, r), or "balanced"
7. Syllable count must be accurate

RETURN FORMAT — respond with ONLY a valid JSON array, no markdown, no explanation outside the array:
[
  {
    "name": "BrandName",
    "slug": "brandname",
    "rationale": "One concrete sentence explaining why this name fits the brief and stands out in the space.",
    "tags": ["brandable"],
    "syllables": 2,
    "phonetic": { "profile": "punchy", "label": "Short & punchy", "score": 72 },
    "tldSuggestion": ".com"
  }
]

Valid tag values (pick 1–2 per name): "short" (slug ≤ 6 chars), "punchy", "smooth", "descriptive", "catchy", "brandable"

Generate exactly 18 names now.`
}

export default async function handler(req) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'GROQ_API_KEY not configured', fallback: true }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }

  let brief
  try {
    const body = await req.json()
    brief = body.brief
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!brief || (!brief.name && !brief.description)) {
    return new Response(JSON.stringify({ error: 'Brief is required', fallback: true }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const prompt = buildPrompt(brief)

  const groqPayload = {
    model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.9,
    top_p: 0.95,
    max_completion_tokens: 8000,
    reasoning_effort: 'low',
  }

  let groqRes
  try {
    groqRes = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(groqPayload),
    })
  } catch (err) {
    console.error('Groq fetch error:', err)
    return new Response(JSON.stringify({ error: 'Groq unreachable', fallback: true }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!groqRes.ok) {
    const errText = await groqRes.text()
    console.error('Groq API error:', groqRes.status, errText)
    return new Response(
      JSON.stringify({ error: `Groq error ${groqRes.status}`, fallback: true }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const groqData = await groqRes.json()

  let rawText = ''
  try {
    rawText = groqData.choices[0].message.content || ''
  } catch {
    console.error('Unexpected Groq response shape:', JSON.stringify(groqData).slice(0, 500))
    return new Response(JSON.stringify({ error: 'Unexpected Groq response shape', fallback: true }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Parse the JSON array from the response — extract even if wrapped in prose or markdown
  let names
  try {
    // Strategy 1: strip markdown code fences and try direct parse
    let cleaned = rawText.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim()
    // Strategy 2: if that fails, find the first '[' to last ']' — grounded responses sometimes add preamble
    if (!cleaned.startsWith('[')) {
      const start = cleaned.indexOf('[')
      const end = cleaned.lastIndexOf(']')
      if (start !== -1 && end !== -1 && end > start) {
        cleaned = cleaned.slice(start, end + 1)
      }
    }
    names = JSON.parse(cleaned)
    if (!Array.isArray(names)) throw new Error('Not an array')
  } catch (err) {
    console.error('JSON parse error from Groq:', err.message, '\nRaw (first 600 chars):', rawText.slice(0, 600))
    return new Response(JSON.stringify({ error: 'Groq returned malformed JSON', fallback: true }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Normalize and validate each name entry — ensure it matches what TactileCard expects
  const TLD_ORDER = ['.com', '.io', '.co', '.ai', '.xyz', '.app', '.dev', '.store', '.tech', '.gg', '.space', '.design', '.cloud']
  
  function hashStr(str) {
    let h = 2166136261
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i)
      h = Math.imul(h, 16777619)
    }
    return h >>> 0
  }

  function tldAvailability(slug) {
    const thresh = { '.com': 20, '.io': 54, '.co': 60, '.ai': 35, '.xyz': 70 }
    const map = {}
    for (const t of TLD_ORDER) {
      const threshold = thresh[t] ?? 50
      map[t] = hashStr(slug + t) % 100 < threshold
    }
    return map
  }

  const normalized = names
    .filter((n) => n && typeof n.slug === 'string' && n.slug.length >= 3)
    .map((n) => {
      const slug = n.slug.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15)
      return {
        name: n.name || (slug.charAt(0).toUpperCase() + slug.slice(1)),
        slug,
        tlds: tldAvailability(slug),
        tags: Array.isArray(n.tags) && n.tags.length ? n.tags : ['brandable'],
        syllables: typeof n.syllables === 'number' ? n.syllables : 2,
        phonetic: n.phonetic || { profile: 'balanced', label: 'Balanced tone', score: 50 },
        rationale: n.rationale || '',
        aiGenerated: true,
        cinematic: brief.cinematic || null,
      }
    })
    .slice(0, 18)

  if (normalized.length === 0) {
    return new Response(JSON.stringify({ error: 'No valid names in Groq response', fallback: true }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify(normalized), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    },
  })
}
