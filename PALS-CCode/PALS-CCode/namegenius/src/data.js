// Derivation helpers and mock datasets shared across screens.
// Standard mock items feature realistic names and pre-calculated
// domain availability across .com, .io, and .co (with 3 Available / 2 Taken mix).

export const TLD_ORDER = ['.com', '.io', '.co', '.ai', '.xyz']

export const COUNTRY_TLDS = [
  { country: 'India', tld: '.in', code: 'in', flag: '🇮🇳' },
  { country: 'European Union', tld: '.eu', code: 'eu', flag: '🇪🇺' },
  { country: 'United Kingdom', tld: '.co.uk', code: 'gb', flag: '🇬🇧' },
  { country: 'Japan', tld: '.jp', code: 'jp', flag: '🇯🇵' },
  { country: 'Germany', tld: '.de', code: 'de', flag: '🇩🇪' },
  { country: 'Canada', tld: '.ca', code: 'ca', flag: '🇨🇦' },
  { country: 'Australia', tld: '.com.au', code: 'au', flag: '🇦🇺' },
  { country: 'France', tld: '.fr', code: 'fr', flag: '🇫🇷' },
  { country: 'Singapore', tld: '.sg', code: 'sg', flag: '🇸🇬' },
  { country: 'United Arab Emirates', tld: '.ae', code: 'ae', flag: '🇦🇪' },
  { country: 'Brazil', tld: '.com.br', code: 'br', flag: '🇧🇷' },
  { country: 'Switzerland', tld: '.ch', code: 'ch', flag: '🇨🇭' },
  { country: 'Netherlands', tld: '.nl', code: 'nl', flag: '🇳🇱' },
  { country: 'Sweden', tld: '.se', code: 'se', flag: '🇸🇪' },
  { country: 'Spain', tld: '.es', code: 'es', flag: '🇪🇸' },
  { country: 'Italy', tld: '.it', code: 'it', flag: '🇮🇹' },
  { country: 'South Korea', tld: '.kr', code: 'kr', flag: '🇰🇷' },
  { country: 'Indonesia', tld: '.id', code: 'id', flag: '🇮🇩' },
  { country: 'Mexico', tld: '.mx', code: 'mx', flag: '🇲🇽' },
  { country: 'South Africa', tld: '.co.za', code: 'za', flag: '🇿🇦' },
  { country: 'United States', tld: '.us', code: 'us', flag: '🇺🇸' },
]

export const MOCK_BATCHES = [
  [
    {
      name: 'Northwind',
      slug: 'northwind',
      domain: 'northwind.com',
      status: 'available',
      tlds: [
        { ext: '.com', available: true },
        { ext: '.io', available: true },
        { ext: '.co', available: true },
      ],
      tags: ['short', 'brandable'],
    },
    {
      name: 'Lumina',
      slug: 'lumina',
      domain: 'lumina.com',
      status: 'taken',
      tlds: [
        { ext: '.com', available: false },
        { ext: '.io', available: true },
        { ext: '.co', available: false },
      ],
      tags: ['catchy'],
    },
    {
      name: 'Fieldnotes',
      slug: 'fieldnotes',
      domain: 'fieldnotes.io',
      status: 'available',
      tlds: [
        { ext: '.com', available: false },
        { ext: '.io', available: true },
        { ext: '.co', available: true },
      ],
      tags: ['descriptive'],
    },
    {
      name: 'Apexflow',
      slug: 'apexflow',
      domain: 'apexflow.com',
      status: 'available',
      tlds: [
        { ext: '.com', available: true },
        { ext: '.io', available: false },
        { ext: '.co', available: true },
      ],
      tags: ['brandable'],
    },
    {
      name: 'Vanguard',
      slug: 'vanguard',
      domain: 'vanguard.com',
      status: 'taken',
      tlds: [
        { ext: '.com', available: false },
        { ext: '.io', available: false },
        { ext: '.co', available: false },
      ],
      tags: ['established'],
    },
  ],
  [
    {
      name: 'Kitecraft',
      slug: 'kitecraft',
      domain: 'kitecraft.com',
      status: 'available',
      tlds: [
        { ext: '.com', available: true },
        { ext: '.io', available: true },
        { ext: '.co', available: true },
      ],
      tags: ['catchy'],
    },
    {
      name: 'Forma',
      slug: 'forma',
      domain: 'forma.com',
      status: 'taken',
      tlds: [
        { ext: '.com', available: false },
        { ext: '.io', available: true },
        { ext: '.co', available: true },
      ],
      tags: ['short'],
    },
    {
      name: 'Basecamp',
      slug: 'basecamp',
      domain: 'basecamp.io',
      status: 'available',
      tlds: [
        { ext: '.com', available: false },
        { ext: '.io', available: true },
        { ext: '.co', available: true },
      ],
      tags: ['established'],
    },
    {
      name: 'Sublime',
      slug: 'sublime',
      domain: 'sublime.com',
      status: 'taken',
      tlds: [
        { ext: '.com', available: false },
        { ext: '.io', available: false },
        { ext: '.co', available: true },
      ],
      tags: ['catchy'],
    },
    {
      name: 'Hyperion',
      slug: 'hyperion',
      domain: 'hyperion.com',
      status: 'available',
      tlds: [
        { ext: '.com', available: true },
        { ext: '.io', available: false },
        { ext: '.co', available: false },
      ],
      tags: ['brandable'],
    },
  ],
  [
    {
      name: 'Aether',
      slug: 'aether',
      domain: 'aether.io',
      status: 'available',
      tlds: [
        { ext: '.com', available: false },
        { ext: '.io', available: true },
        { ext: '.co', available: true },
      ],
      tags: ['short', 'catchy'],
    },
    {
      name: 'Beacon',
      slug: 'beacon',
      domain: 'beacon.com',
      status: 'taken',
      tlds: [
        { ext: '.com', available: false },
        { ext: '.io', available: false },
        { ext: '.co', available: true },
      ],
      tags: ['brandable'],
    },
    {
      name: 'Foundry',
      slug: 'foundry',
      domain: 'foundry.com',
      status: 'available',
      tlds: [
        { ext: '.com', available: true },
        { ext: '.io', available: true },
        { ext: '.co', available: false },
      ],
      tags: ['established'],
    },
    {
      name: 'Zenith',
      slug: 'zenith',
      domain: 'zenith.com',
      status: 'taken',
      tlds: [
        { ext: '.com', available: false },
        { ext: '.io', available: false },
        { ext: '.co', available: false },
      ],
      tags: ['short'],
    },
    {
      name: 'Truepulse',
      slug: 'truepulse',
      domain: 'truepulse.com',
      status: 'available',
      tlds: [
        { ext: '.com', available: true },
        { ext: '.io', available: false },
        { ext: '.co', available: true },
      ],
      tags: ['descriptive'],
    },
  ],
]

export function getMockBatch(batchIndex = 0) {
  return MOCK_BATCHES[batchIndex % MOCK_BATCHES.length]
}

// Five brand discovery questions (Phase 5)
export const QUESTIONS = [
  'Who is your audience?',
  'What problem do you solve?',
  'What feeling should the name evoke?',
  'Which brands do you admire, and why?',
  'What should the name never sound like?',
]

export function availableTlds(item) {
  return TLD_ORDER.filter((t) => item.tlds?.[t] ?? item.tlds?.some?.((x) => x.ext === t && x.available))
}

export function primaryTld(item, tldFilter) {
  if (tldFilter && tldFilter !== 'any TLD') return tldFilter
  const free = availableTlds(item)
  return free[0] || '.com'
}

export function domainFor(item, tldFilter) {
  if (item.domain) return item.domain
  return `${item.slug}${primaryTld(item, tldFilter)}`
}

export function isAvailable(item, tldFilter) {
  if (item.status) return item.status === 'available'
  return Boolean(item.tlds?.[primaryTld(item, tldFilter)])
}

export function matchesLength(item, lengthFilter) {
  if (lengthFilter === 'short') return item.slug.length <= 6
  if (lengthFilter === 'catchy') return item.tags?.includes('catchy')
  return true
}

export function styleLabel(item) {
  if (item?.tags?.includes('catchy')) return 'Catchy'
  if (item?.tags?.includes('short')) return 'Short'
  return 'Descriptive'
}
