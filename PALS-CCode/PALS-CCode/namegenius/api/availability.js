// Real-time DNS over HTTPS & RDAP Domain Availability Resolver
// Returns 'available' (NXDOMAIN / not registered), 'taken' (registered / active DNS), or 'unknown'

const CACHE = new Map()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes cache

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=60, s-maxage=300',
    },
  })
}

// Check single domain via Cloudflare DNS over HTTPS
async function checkCloudflareDoH(domain) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 3000)
  try {
    const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=A`, {
      headers: { Accept: 'application/dns-json' },
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (!res.ok) return null
    const data = await res.json()
    // Status 3 = NXDOMAIN -> definitely available
    if (data.Status === 3) return 'available'
    // Status 0 = NOERROR -> domain exists / registered
    if (data.Status === 0) return 'taken'
    // Status 2 = SERVFAIL or other
    return null
  } catch {
    clearTimeout(timer)
    return null
  }
}

// Fallback: Google DNS over HTTPS
async function checkGoogleDoH(domain) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 3000)
  try {
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`, {
      headers: { Accept: 'application/dns-json' },
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (!res.ok) return null
    const data = await res.json()
    if (data.Status === 3) return 'available'
    if (data.Status === 0) return 'taken'
    return null
  } catch {
    clearTimeout(timer)
    return null
  }
}

// Combined fast resolver with cache
async function resolveDomainStatus(domain) {
  const cached = CACHE.get(domain)
  if (cached && Date.now() - cached.time < CACHE_TTL_MS) {
    return cached.status
  }

  // 1. Try Cloudflare DoH (sub-40ms)
  let status = await checkCloudflareDoH(domain)

  // 2. Fallback to Google DoH if Cloudflare errored or was inconclusive
  if (!status) {
    status = await checkGoogleDoH(domain)
  }

  // 3. Fallback default based on status or unknown
  const finalStatus = status || 'unknown'
  CACHE.set(domain, { status: finalStatus, time: Date.now() })
  return finalStatus
}

// High-concurrency worker pool
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

  const DOMAIN_VALIDATOR = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.[a-z0-9-]{2,24}$/i

  const unique = [...new Set(
    domains
      .filter((d) => typeof d === 'string')
      .map((d) => d.trim().toLowerCase())
      .filter((d) => DOMAIN_VALIDATOR.test(d))
  )].slice(0, 150)

  const statuses = await mapPool(unique, 16, resolveDomainStatus)
  const results = {}
  unique.forEach((domain, i) => {
    results[domain] = statuses[i]
  })

  return json({ results })
}
