// Mock fixtures for the S1/S2 explorations. No generation, no RDAP — the
// availability values below are hand-picked to exercise every status.

export const BRIEF_EMPTY = {
  name: '',
  does: '',
  competitors: '',
  tld: '.com',
}

export const BRIEF_FILLED = {
  name: 'Field notes for builders',
  does: 'A notebook that turns site visits into shareable reports',
  competitors: 'Notion, Bear, Craft',
  tld: '.io',
}

export const TLD_CHOICES = ['.com', '.io', '.co']

const tlds = (com, io, co) => [
  { ext: '.com', available: com },
  { ext: '.io', available: io },
  { ext: '.co', available: co },
]

export const RESULTS = [
  { name: 'Fable', domain: 'fable.io', status: 'available', tlds: tlds(false, true, true) },
  { name: 'Sitelight', domain: 'sitelight.com', status: 'available', tlds: tlds(true, true, false) },
  { name: 'Fieldnote', domain: 'fieldnote.com', status: 'taken', tlds: tlds(false, true, true) },
  { name: 'Roundtrip', domain: 'roundtrip.co', status: 'available', tlds: tlds(false, false, true) },
  { name: 'Marginalia', domain: 'marginalia.com', status: 'taken', tlds: tlds(false, false, false) },
  { name: 'Notebase', domain: 'notebase.io', status: 'checking', tlds: tlds(null, null, null) },
  { name: 'Walkabout', domain: 'walkabout.io', status: 'available', tlds: tlds(false, true, true) },
  { name: 'Ledgerly', domain: 'ledgerly.com', status: 'taken', tlds: tlds(false, true, false) },
]

export const STATUS_ORDER = ['available', 'checking', 'taken']

export const STATUS_GROUP_LABEL = {
  available: 'Available',
  checking: 'Still checking',
  taken: 'Taken',
}

export function groupByStatus(items) {
  return STATUS_ORDER.map((status) => ({
    status,
    items: items.filter((i) => i.status === status),
  })).filter((g) => g.items.length > 0)
}
