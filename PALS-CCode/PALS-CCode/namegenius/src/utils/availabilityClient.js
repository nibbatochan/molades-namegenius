const memory = new Map()

export async function fetchAvailability(domains) {
  const wanted = [...new Set(domains.filter(Boolean).map((d) => d.toLowerCase()))]
  const missing = wanted.filter((d) => !memory.has(d))

  if (missing.length) {
    const res = await fetch('/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domains: missing }),
    })
    if (!res.ok) throw new Error(`Availability API ${res.status}`)
    const data = await res.json()
    for (const domain of missing) {
      memory.set(domain, data.results?.[domain] || 'unknown')
    }
  }

  return Object.fromEntries(wanted.map((d) => [d, memory.get(d) || 'unknown']))
}
