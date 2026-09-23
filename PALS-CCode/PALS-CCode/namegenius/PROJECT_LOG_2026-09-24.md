# NameGenius — Project Context, Architecture & Decisions Log

> **Single Source of Truth**: This document contains the full context, architecture, design system, key decisions, API configurations, and component breakdown for NameGenius. Any new chat or developer reading this file can instantly understand the complete state of the project.

---

## 1. Project Overview & Live Endpoints

* **Product Name**: **NameGenius** — Tactile Domain & Brand Name Generator
* **Description**: A tactile, neo-skeuomorphic web application that generates domain-safe, memorable brand names using AI (Groq LLM) with a deterministic fallback engine, live DNS availability checking, a 7-step Strategic Discovery Console, and an integrated 8-bit retro Sprite/Boss Testing Lab.
* **Production URL**: [https://namegenius-lilac.vercel.app](https://namegenius-lilac.vercel.app)
* **GitHub Repository**: [https://github.com/nibbatochan/molades-namegenius](https://github.com/nibbatochan/molades-namegenius) (`main` branch)
* **Local Dev Server**: `http://localhost:5173/` (`npm run dev` or `npx vite --host 0.0.0.0 --port 5173`)

---

## 2. Core Architecture & Tech Stack

* **Framework**: React 19 + Vite 8
* **Styling**: Tailwind CSS with custom Neo-Skeuomorphic tactile tokens (`.skeuo-chassis`, `.skeuo-plate`, `.key-socket`, `.key-socket-dark`, `.key-cap`, `.key-cap-cobalt`, `.key-cap-active-dark`, `.skeuo-button-terracotta`).
* **Icons**: `@phosphor-icons/react`
* **Audio Micro-Haptics**: Custom Web Audio API synthesizer (`src/utils/audio.js`) simulating physical mechanical switches, relays, and click keycaps.
* **Backend API (Serverless)**: Vercel Edge Functions (`export const config = { runtime: 'edge' }`):
  * `/api/generate`: Proxies brand generation prompts to Groq LLM using server-side API keys.
  * `/api/availability`: Batch domain availability checking via Dynadot API & DNS fallback.

---

## 3. Directory & File Structure

```
├── api/
│   ├── generate.js            # Vercel Edge Function: Groq LLM naming prompt & JSON parsing
│   └── availability.js        # Vercel Edge Function: Dynadot API / DNS domain lookup
├── public/
│   ├── favicon.svg            # Vector favicon with inverted white logo on dark chassis
│   ├── favicon.png / .ico     # Chrome tab and browser icon assets
│   ├── logo-white.png         # Inverted white brand mark on transparent bg
│   ├── logo-black.png         # Black brand mark on transparent bg
│   └── grain.png              # Tactile background noise overlay
├── src/
│   ├── App.jsx                # Main application controller, view router, persistent search cache
│   ├── Brief.jsx              # Landing page (HeroHardwareGadget, MasterSynthesizer brief builder)
│   ├── Results.jsx            # Core results dashboard, filter rack, exact/variation tray, card grid
│   ├── Screens.jsx            # Saved Shortlist & Side-by-Side Name Comparison Bench
│   ├── TestingLab.jsx         # 8-bit retro console duel simulator & sprite inspector
│   ├── generator.js          # Deterministic local fallback generator, phonetic classifier, tokens()
│   ├── data.js                # TLD list, fallback questions, brand presets
│   ├── components/
│   │   ├── AppNavbar.jsx          # Tactile yellow header with inverted logo, SFX toggle, Storyboard modal
│   │   ├── DiscoveryDrawer.jsx    # 7-question strategic preferences modal (textured black chassis)
│   │   ├── TactileCard.jsx        # Individual domain/brand card with audio and buy links
│   │   ├── MasterSynthesizer.jsx  # Interactive brief creation console with live feedback
│   │   ├── HeroHardwareGadget.jsx # Interactive 3D/tactile interactive hero console
│   │   ├── DomainDetailModal.jsx  # In-depth brand dossier & phonetic breakdown modal
│   │   └── DomainGameEngine.jsx   # Canvas-based 8-bit platformer & boss fight engine
│   └── utils/
│       ├── audio.js               # Web Audio API mechanical sounds (clicks, switches, heavy buttons)
│       ├── geminiClient.js        # Client-side wrapper calling /api/generate
│       └── availabilityClient.js  # Client-side wrapper calling /api/availability
├── package.json
├── vite.config.js
└── vercel.json
```

---

## 4. Key Functional Features & Decisions

### A. Strategic Discovery Modal (`src/components/DiscoveryDrawer.jsx`)
* **Trigger**: Automatically pops up after **3 regenerations** (`generation >= 3`), and can be opened anytime via the **"Tune Preferences"** button on the results toolbar.
* **Modal Styling**: Floating backdrop blur modal (`fixed inset-0 z-50 bg-black/75 backdrop-blur-md`).
* **Chassis Design**: Textured rich black chassis (`bg-[#0b0f19] text-white border-2 border-slate-700/80`) with micro-grain texture.
* **Removed Live Dots**: Clean debossed status badge without unnecessary pulsing indicator dots.
* **The 7 Strategic Questions**:
  1. **01 Tone & Personality**: Continuous range slider (Utilitarian/Minimal vs. Warm/Expressive).
  2. **02 Material & Atmosphere**: Sensory choice cards (*Dark Matte Metal*, *Warm Wood & Paper*, *Bright Terminal Screen*, *Sunlit Greenhouse*).
  3. **03 Word Structure**: Multi-select chips (max 2: *Made-up*, *Compound*, *Metaphor*, *Short 3–5 letters*, *Latin roots*).
  4. **04 Phonetics & Sound**: Consonant texture (*Sharp & Punchy*, *Soft & Flowing*, *Everyday Conversational*).
  5. **05 Avoid List**: Blacklist anti-patterns (*No -ify/-ly*, *No corp jargon*, *No spelling ambiguity*, *No cutesy names*).
  6. **06 Primary Audience**: Target decision-maker (*Enterprise*, *Developers*, *Consumers*, *Creatives*).
  7. **07 Domain Strategy**: URL appetite (*Must be .com*, *Modern Tech .ai/.io/.co*, *Creative Hacks*, *Name First*).
* **Safe Token Extraction**: `tokens(input)` in `src/generator.js` handles numbers, arrays, strings, and objects recursively to prevent `TypeError: .toLowerCase is not a function` during preference synthesis.

### B. Header & Navigation (`src/components/AppNavbar.jsx`)
* **Visual Styling**: Signature tactile yellow chassis (`bg-[#fae127] border-2 border-slate-950`) with high-contrast sunk-in navigation pills (`HOME`, `RESULTS`, `SAVED`, `COMPARE`, `SPRITE LAB`).
* **Inverted Brand Icon**: Displays the white arch-and-star logo mark inside a dark tactile socket (`/logo-white.png`).
* **End Padding**: Extra horizontal breathing room (`px-4 sm:px-8 lg:px-12` on outer sticky headers, `px-4 sm:px-6 md:px-8` inside the navbar).
* **Audio SFX Toggle**: Quick switch to enable/mute mechanical clicks and haptics.
* **Manual Modal**: Interactive "How NameGenius Works" storyboard walkthrough.

### C. Results View & Variations Tray (`src/Results.jsx`)
* **Toolbar Button**: Solid black background with white text (`bg-black text-white border border-slate-700/80`) for **"Tune Preferences"**.
* **Exact & Variations Layout**:
  * **Exact Matches**: Core TLD chips (`.com`, `.ai`, `.io`, `.co`) with live availability LEDs, direct Namecheap buy links, and 1-click clipboard copy.
  * **Brand Variations**: Clean wrapping flex-grid of high-converting prefix/suffix combinations (`get[brand].com`, `try[brand].com`, `[brand]labs.com`, etc.).
* **AI Generation & Cache**: When user applies strategic answers, previous search cache is cleared, `generation` is bumped, and both `/api/generate` (Groq) and `generateNames()` (local) receive the new preferences to synthesize customized names.

---

## 5. API Keys & Environment Variables

The application is deployed on Vercel with the following environment variables:
* **`GROQ_API_KEY`**: Server-side secret for Groq LLM completions (`openai/gpt-oss-120b` or `openai/gpt-oss-20b`). Configured in Vercel Project Settings and `.env.local` for local development.
* **`DYNADOT_API_KEY`**: (Optional) Key for real-time Dynadot domain availability lookup.

> **Security Note**: API keys are only accessed server-side inside `/api/*` edge functions and are never bundled into client-side JavaScript.

---

## 6. Development & Deployment Commands

* **Install dependencies**: `npm install`
* **Run local development server**: `npm run dev` (starts on `http://localhost:5173/`)
* **Build production bundle**: `npm run build` (outputs to `dist/`)
* **Deploy to Vercel Production**: `npx vercel --prod --yes`
* **Commit and Push to Git**:
  ```bash
  git add .
  git commit -m "your message"
  git push origin main
  ```
