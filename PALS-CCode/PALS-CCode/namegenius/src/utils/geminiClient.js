// Gemini API client — fetches AI-generated brand names from the /api/generate proxy.
// Falls back gracefully to local generator if the API is unavailable.

const TIMEOUT_MS = 30000 // Groq can take a few seconds for 18 names

/**
 * Fetch AI-generated brand names from the Gemini proxy endpoint.
 * @param {Object} brief - { name, description, competitors, cinematic, tld }
 * @returns {Promise<Array>} Array of name objects matching TactileCard's expected shape
 * @throws Will throw if request fails (caller should catch and use local fallback)
 */
export async function fetchAINames(brief) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brief }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      // If the server explicitly says to fallback, throw to trigger local generator
      if (data?.fallback) throw new Error('Server requested fallback')
      throw new Error(`API responded with ${res.status}`)
    }

    const names = await res.json()
    if (!Array.isArray(names) || names.length === 0) {
      throw new Error('Empty or invalid response from API')
    }

    return names
  } catch (err) {
    clearTimeout(timeout)
    throw err // Caller handles fallback
  }
}
