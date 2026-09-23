import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import generateHandler from './api/generate.js'
import availabilityHandler from './api/availability.js'

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

// Vite does not run Vercel functions. This serves /api/generate during `npm run dev`
// so localhost uses Groq instead of the local name list.
function localApi(path, handler) {
  return {
    name: `local-api-${path}`,
    configureServer(server) {
      server.middlewares.use(path, async (req, res) => {
        try {
          const raw = req.method === 'POST' ? await readBody(req) : undefined
          const webReq = new Request(`http://localhost${path}`, {
            method: req.method,
            headers: { 'content-type': req.headers['content-type'] || 'application/json' },
            body: raw && raw.length ? raw : undefined,
          })
          const webRes = await handler(webReq)
          res.statusCode = webRes.status
          webRes.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(Buffer.from(await webRes.arrayBuffer()))
        } catch (err) {
          console.error(`Local ${path} failed:`, err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Local API failed', fallback: true }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.GROQ_API_KEY) process.env.GROQ_API_KEY = env.GROQ_API_KEY
  if (env.GROQ_MODEL) process.env.GROQ_MODEL = env.GROQ_MODEL

  return {
    plugins: [react(), localApi('/api/generate', generateHandler), localApi('/api/availability', availabilityHandler)],
    server: {
      host: '127.0.0.1',
      port: 5173,
      strictPort: false,
    },
  }
})
