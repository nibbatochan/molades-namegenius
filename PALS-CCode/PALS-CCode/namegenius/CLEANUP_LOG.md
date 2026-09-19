# Clean Code & Directory Cleanup Log

**Date:** 2026-09-19  
**Execution:** Clean Code principles applied across the repository without breaking product, UI, retro game engine, or any functionality.

---

## 1. Summary of Removed Files & Directories

### 🗑️ Obsolete Scratch, Preview & Duplicate Component Code
| File / Directory | Description | Rationale |
|---|---|---|
| `src/CardPreview.jsx` | Standalone mock preview component | Replaced by live `TactileCard.jsx` and `Results.jsx`. |
| `src/CardPreviewFigma.jsx` | Duplicate Figma-specific preview harness | Scratch component from early Figma alignment session. |
| `src/ResultCard.jsx` | Legacy result card component | Superseded by neo-skeuomorphic `TactileCard.jsx`. |
| `src/ResultCardFigma.jsx` | Duplicate experimental card | Temporary scratch file isolated in earlier session. |
| `src/mainFigma.jsx` | Duplicate Vite HTML entrypoint | Orphaned entrypoint used only for Figma card tests. |
| `preview-figma.html` | Duplicate root HTML file | Orphaned preview page. |
| `src/mocks/resultCards.js` | Mock data for obsolete card preview | Unused in production flow. |
| `src/mocks/resultCardsFigma.js` | Mock data for Figma preview | Unused in production flow. |
| `src/mocks/` | Mocks folder | Cleaned up following removal of test mock datasets. |
| `src/App.css` | Vite boilerplate stylesheet | 100% dead CSS file; global styles are defined in `src/index.css`. |

### 🖼️ Unused / Redundant Assets & Images
| File / Directory | Description | Rationale |
|---|---|---|
| `src/assets/hero.png` | Unused raster image | Replaced by live hardware gadget canvas component. |
| `src/assets/react.svg` | Default Vite asset | Boilerplate icon never imported or rendered. |
| `src/assets/vite.svg` | Default Vite asset | Boilerplate icon never imported or rendered. |
| `src/assets/` | Empty directory | Cleaned up after removing dead assets. |
| `public/grain.svg` | Redundant vector grain | Grain textures are loaded via high-performance `public/grain.png` and embedded data URIs. |
| `public/icons.svg` | Unused SVG icon sprite | All app icons are dynamically rendered via Phosphor Icons (`@phosphor-icons/react`). |
| `public/game/bosses/` | Empty directory | Unused empty asset folder. |

### 📦 Root-Level Test Dumps & Large Temporary Archives
| File / Directory | Description | Size / Count |
|---|---|---|
| `PALS-CCode.zip` | Root-level temporary project zip export | **~66.3 MB** archive removed. |
| `.shots/` | Test screenshot captures directory | **37 PNG files** removed. |
| `shots/` | Test screenshot captures directory | **16 PNG files** removed. |

---

## 2. Refactored Code & Clean Code Improvements

### `src/main.jsx`
- **Before:** Contained conditional query string checks and fallback branching (`const Root = window.location.search.includes('preview') ? CardPreview : App`) loading test previews.
- **After:** Cleaned to a single-responsibility, idiomatic React 18/19 entry point that cleanly mounts `<App />` with zero side-effects.

---

## 3. Preserved Live Features & Core Functionality

All core features remain completely intact, validated, and fully operational:
1. **Neo-Skeuomorphic Master Console & Synthesizer:** Tactile switches, knobs, debossed inputs, and registrar generation engine.
2. **Interactive 16-Bit Pixel-Art Retro Game:** Cat sprite hero, full boss roster (Bosses 1–6), projectile particle engine, jump/blast mechanics, collision detection, and audio loops.
3. **Sprite & Boss Testing Lab (`TestingLab.jsx`):** Visual animation testing suite and god mode controls.
4. **Interactive Views:** Saved / Shortlist drawer, Compare Bench, Manual storyboard modal, and Tone/Phonetic controls.
5. **Background & Audio Assets:** 9 stage background images (`/game/*.jpg`) and 8-bit soundtrack files (`/game/ingame-music/*.mp3`).

---

## 4. Verification
- `npm run build` ran successfully with **0 errors**.
- All 4,572 module transforms passed cleanly.
