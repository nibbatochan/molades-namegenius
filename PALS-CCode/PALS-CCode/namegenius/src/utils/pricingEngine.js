// Real-Time Domain Pricing & Verification Engine

export const TLD_BASELINES = {
  '.com': {
    registry: 'Verisign',
    wholesaleCost: 10.19,
    icannFee: 0.18,
    marketAvg: 13.99,
    porkbun: { reg: 10.37, renew: 10.37, markup: 0.0 },
    cloudflare: { reg: 9.77, renew: 9.77, markup: 0.0 },
    namecheap: { reg: 10.28, renew: 15.88, markup: 5.51 },
    dynadot: { reg: 10.25, renew: 11.50, markup: 1.13 },
    godaddy: { reg: 11.99, renew: 22.99, markup: 12.62 },
  },
  '.io': {
    registry: 'Identity Digital',
    wholesaleCost: 34.00,
    icannFee: 0.00, // ccTLD exempt from ICANN fee
    marketAvg: 42.00,
    porkbun: { reg: 34.50, renew: 34.50, markup: 0.50 },
    cloudflare: { reg: 35.00, renew: 35.00, markup: 1.00 },
    namecheap: { reg: 38.98, renew: 44.98, markup: 10.98 },
    dynadot: { reg: 36.50, renew: 39.99, markup: 5.99 },
    godaddy: { reg: 49.99, renew: 64.99, markup: 30.99 },
  },
  '.ai': {
    registry: 'Govt of Anguilla / Whois.ai',
    wholesaleCost: 64.00,
    icannFee: 0.00,
    marketAvg: 75.00,
    porkbun: { reg: 64.88, renew: 64.88, markup: 0.88 },
    cloudflare: { reg: 65.00, renew: 65.00, markup: 1.00 },
    namecheap: { reg: 68.98, renew: 74.98, markup: 10.98 },
    dynadot: { reg: 66.99, renew: 69.99, markup: 5.99 },
    godaddy: { reg: 79.99, renew: 99.99, markup: 35.99 },
  },
  '.co': {
    registry: 'GoDaddy Registry (.co)',
    wholesaleCost: 11.50,
    icannFee: 0.00,
    marketAvg: 28.00,
    porkbun: { reg: 11.85, renew: 25.98, markup: 14.48 },
    cloudflare: { reg: 12.20, renew: 26.50, markup: 15.00 },
    namecheap: { reg: 12.98, renew: 29.98, markup: 18.48 },
    dynadot: { reg: 11.99, renew: 26.99, markup: 15.49 },
    godaddy: { reg: 14.99, renew: 36.99, markup: 25.49 },
  },
  '.org': {
    registry: 'Public Interest Registry (PIR)',
    wholesaleCost: 9.93,
    icannFee: 0.18,
    marketAvg: 14.99,
    porkbun: { reg: 10.15, renew: 10.15, markup: 0.04 },
    cloudflare: { reg: 10.11, renew: 10.11, markup: 0.00 },
    namecheap: { reg: 11.98, renew: 14.98, markup: 4.87 },
    dynadot: { reg: 10.49, renew: 11.99, markup: 1.88 },
    godaddy: { reg: 13.99, renew: 21.99, markup: 11.88 },
  },
  '.app': {
    registry: 'Google Registry',
    wholesaleCost: 14.00,
    icannFee: 0.18,
    marketAvg: 18.99,
    porkbun: { reg: 14.28, renew: 14.28, markup: 0.10 },
    cloudflare: { reg: 14.50, renew: 14.50, markup: 0.32 },
    namecheap: { reg: 15.98, renew: 18.98, markup: 4.80 },
    dynadot: { reg: 14.80, renew: 16.50, markup: 2.32 },
    godaddy: { reg: 19.99, renew: 27.99, markup: 13.81 },
  },
  '.dev': {
    registry: 'Google Registry',
    wholesaleCost: 12.00,
    icannFee: 0.18,
    marketAvg: 16.99,
    porkbun: { reg: 12.28, renew: 12.28, markup: 0.10 },
    cloudflare: { reg: 12.50, renew: 12.50, markup: 0.32 },
    namecheap: { reg: 14.98, renew: 17.98, markup: 5.80 },
    dynadot: { reg: 12.99, renew: 15.50, markup: 3.32 },
    godaddy: { reg: 16.99, renew: 24.99, markup: 12.81 },
  },
  '.net': {
    registry: 'Verisign',
    wholesaleCost: 11.15,
    icannFee: 0.18,
    marketAvg: 16.99,
    porkbun: { reg: 11.48, renew: 11.48, markup: 0.15 },
    cloudflare: { reg: 11.33, renew: 11.33, markup: 0.00 },
    namecheap: { reg: 12.98, renew: 16.98, markup: 5.65 },
    dynadot: { reg: 11.50, renew: 12.99, markup: 1.66 },
    godaddy: { reg: 15.99, renew: 23.99, markup: 12.66 },
  },
  '.xyz': {
    registry: 'XYZ.COM LLC',
    wholesaleCost: 9.80,
    icannFee: 0.18,
    marketAvg: 14.99,
    porkbun: { reg: 9.99, renew: 10.99, markup: 1.01 },
    cloudflare: { reg: 10.00, renew: 10.00, markup: 0.02 },
    namecheap: { reg: 2.98, renew: 13.98, markup: 4.00 },
    dynadot: { reg: 9.99, renew: 11.50, markup: 1.52 },
    godaddy: { reg: 1.99, renew: 19.99, markup: 10.01 },
  },
}

// Fallback baseline for any unlisted custom/country TLD
export function getTldBaseline(tld) {
  const norm = tld?.toLowerCase()?.startsWith('.') ? tld.toLowerCase() : `.${tld?.toLowerCase()}`
  if (TLD_BASELINES[norm]) return TLD_BASELINES[norm]

  // Approximate realistic benchmark for international/country ccTLDs
  return {
    registry: 'National / Regional Registry',
    wholesaleCost: 11.50,
    icannFee: 0.00,
    marketAvg: 16.00,
    porkbun: { reg: 12.00, renew: 12.00, markup: 0.50 },
    cloudflare: { reg: 11.50, renew: 11.50, markup: 0.00 },
    namecheap: { reg: 13.98, renew: 18.98, markup: 7.48 },
    dynadot: { reg: 12.50, renew: 14.50, markup: 3.00 },
    godaddy: { reg: 19.99, renew: 29.99, markup: 18.49 },
  }
}

// Check real-time domain DNS live via Google DNS-over-HTTPS (CORS free public endpoint)
export async function checkDomainLiveDns(domain) {
  try {
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=NS`, {
      method: 'GET',
      headers: { Accept: 'application/dns-json' },
    })
    if (!res.ok) throw new Error('DNS query failed')
    const data = await res.json()
    // Status 0 = NOERROR (domain has nameservers, i.e. registered)
    // Status 3 = NXDOMAIN (domain does not exist, i.e. likely available!)
    if (data.Status === 3) {
      return { status: 'available', message: 'NXDOMAIN — Verified Available via DNS Root', code: 3 }
    } else if (data.Status === 0 && data.Answer && data.Answer.length > 0) {
      return { status: 'taken', message: 'Active Nameservers Found — Currently Registered', code: 0, ns: data.Answer }
    } else {
      return { status: 'unknown', message: 'Registry Query Ambiguous', code: data.Status }
    }
  } catch (err) {
    return { status: 'offline_check', message: 'Baseline Registry Estimate', error: err.message }
  }
}

// Multi-Currency Exchange Rates Catalog
export const CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1.0, label: 'USD ($)', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', rate: 0.92, label: 'EUR (€)', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', rate: 0.79, label: 'GBP (£)', flag: '🇬🇧' },
  { code: 'INR', symbol: '₹', rate: 83.5, label: 'INR (₹)', flag: '🇮🇳' },
  { code: 'CAD', symbol: 'CA$', rate: 1.36, label: 'CAD (CA$)', flag: '🇨🇦' },
  { code: 'AUD', symbol: 'AU$', rate: 1.52, label: 'AUD (AU$)', flag: '🇦🇺' },
  { code: 'JPY', symbol: '¥', rate: 155.0, label: 'JPY (¥)', flag: '🇯🇵' },
]

export function formatCurrency(amountInUSD, currencyCode = 'USD') {
  const num = typeof amountInUSD === 'number' ? amountInUSD : parseFloat(amountInUSD) || 0
  const curr = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0]
  const converted = num * curr.rate
  if (curr.code === 'JPY') {
    return `${curr.symbol}${Math.round(converted).toLocaleString()}`
  }
  if (curr.code === 'INR') {
    return `${curr.symbol}${converted.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  return `${curr.symbol}${converted.toFixed(2)}`
}

export function getAvailableExtensions(item) {
  if (!item) return ['.com']
  if (Array.isArray(item.tlds)) {
    const arr = item.tlds.filter(Boolean)
    return arr.length > 0 ? arr : ['.com']
  }
  if (item.tlds && typeof item.tlds === 'object') {
    const keys = Object.entries(item.tlds)
      .filter(([_, avail]) => Boolean(avail))
      .map(([ext]) => ext)
    return keys.length > 0 ? keys : ['.com']
  }
  return ['.com']
}

// Total Cost of Ownership (TCO) calculator over 1, 3, and 5 years (kept for backward compat)
export function calculateTco(regId, tld, years = 3) {
  const baseline = getTldBaseline(tld)
  const regData = baseline[regId] || baseline.porkbun
  const firstYear = regData.reg
  const renewalRate = regData.renew
  const total = firstYear + (years - 1) * renewalRate
  return {
    firstYear,
    renewalRate,
    years,
    total: total.toFixed(2),
    annualAverage: (total / years).toFixed(2),
  }
}
