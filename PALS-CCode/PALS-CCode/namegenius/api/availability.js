// Registry availability. 200 means the domain is registered, 404 means it is not.
// Prices stay out of this endpoint.

const RDAP_BASE = {
  com: 'https://rdap.verisign.com/com/v1/domain/',
  io: 'https://rdap.identitydigital.services/rdap/domain/',
  ai: 'https://rdap.identitydigital.services/rdap/domain/',
  co: 'https://rdap.registry.co/co/domain/',
  xyz: 'https://rdap.centralnic.com/xyz/domain/',
}

const CACHE = new Map()
const DOMAIN_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.(com|io|ai|co|xyz)$/

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    },
  })
}

async function checkOne(domain) {
  if (CACHE.has(domain)) return CACHE.get(domain)
  const tld = domain.slice(domain.lastIndexOf('.') + 1)
  const base = RDAP_BASE[tld]
  if (!base) return 'unknown'

  try {
    const res = await fetch(base + domain, {
      headers: { Accept: 'application/rdap+json' },
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    })
    if (res.status === 404) {
      CACHE.set(domain, 'available')
      return 'available'
    }
    if (res.status === 200) {
      CACHE.set(domain, 'taken')
      return 'taken'
    }
    return 'unknown'
  } catch {
    return 'unknown'
  }
}

async function mapPool(items, limit, fn) {
  const out = new Array(items.length)
  let next = 0
  async function worker() {
    while (next < items.length) {
      const index = next++
      out[index] = await fn(items[index])
    }
  }
  const workers = Math.min(limit, items.length)
  await Promise.all(Array.from({ length: workers }, worker))
  return out
}

export default async function handler(req) {
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

  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  let domains
  try {
    const body = await req.json()
    domains = body.domains
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  if (!Array.isArray(domains)) return json({ error: 'domains array required' }, 400)

  const unique = [...new Set(
    domains
      .filter((d) => typeof d === 'string')
      .map((d) => d.trim().toLowerCase())
      .filter((d) => DOMAIN_RE.test(d))
  )].slice(0, 120)

  const statuses = await mapPool(unique, 6, checkOne)
  const results = {}
  unique.forEach((domain, i) => {
    results[domain] = statuses[i]
  })

  return json({ results })
}
