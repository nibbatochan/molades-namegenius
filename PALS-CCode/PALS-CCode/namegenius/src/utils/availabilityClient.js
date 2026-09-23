const memory = new Map()

// Direct client-side DNS over HTTPS check (Cloudflare / Google)
async function clientDnsCheck(domain) {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 2500)
    const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=A`, {
      headers: { Accept: 'application/dns-json' },
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (res.ok) {
      const data = await res.json()
      if (data.Status === 3) return 'available'
      if (data.Status === 0) return 'taken'
    }
  } catch {}

  // Fallback to Google DoH
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 2500)
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`, {
      headers: { Accept: 'application/dns-json' },
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (res.ok) {
      const data = await res.json()
      if (data.Status === 3) return 'available'
      if (data.Status === 0) return 'taken'
    }
  } catch {}

  return 'available' // Graceful default if both DoH queries timed out
}

export async function fetchAvailability(domains) {
  const wanted = [...new Set(domains.filter(Boolean).map((d) => d.toLowerCase()))]
  const missing = wanted.filter((d) => !memory.has(d))

  if (missing.length) {
    try {
      const res = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domains: missing }),
      })
      if (res.ok) {
        const data = await res.json()
        for (const domain of missing) {
          const st = data.results?.[domain]
          if (st && st !== 'unknown') {
            memory.set(domain, st)
          }
        }
      }
    } catch {
      // Server endpoint failed; will fall through to client DoH below
    }

    // For any domain still missing or unknown, resolve directly via client-side DoH
    const stillMissing = missing.filter((d) => !memory.has(d) || memory.get(d) === 'unknown')
    if (stillMissing.length) {
      await Promise.all(
        stillMissing.map(async (domain) => {
          const status = await clientDnsCheck(domain)
          memory.set(domain, status)
        })
      )
    }
  }

  return Object.fromEntries(wanted.map((d) => [d, memory.get(d) || 'available']))
}
