/**
 * Procedural Surface Roughness & Texture Shader Generator
 * Creates physically-based micro-roughness textures via offscreen canvas
 * using normal-mapped microfacet scattering (directional diffuse + specular flecks).
 */

function createSeededRng(seed = 1337) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

// Smooth Hermite interpolation (S-curve)
function smoothstep(t) {
  return t * t * (3 - 2 * t)
}

/**
 * Creates a tileable 2D grid noise layer that wraps seamlessly at width and height
 */
function createSeamlessNoiseLayer(width, height, cellSize, rng) {
  const gridW = Math.max(2, Math.floor(width / cellSize))
  const gridH = Math.max(2, Math.floor(height / cellSize))
  
  // Create lattice points
  const lattice = new Float32Array(gridW * gridH)
  for (let i = 0; i < lattice.length; i++) {
    lattice[i] = (rng() - 0.5) * 2.0
  }

  const layer = new Float32Array(width * height)

  for (let y = 0; y < height; y++) {
    const gy = (y / height) * gridH
    const y0 = Math.floor(gy) % gridH
    const y1 = (y0 + 1) % gridH
    const fy = smoothstep(gy - Math.floor(gy))

    for (let x = 0; x < width; x++) {
      const gx = (x / width) * gridW
      const x0 = Math.floor(gx) % gridW
      const x1 = (x0 + 1) % gridW
      const fx = smoothstep(gx - Math.floor(gx))

      // 4 lattice corners
      const v00 = lattice[y0 * gridW + x0]
      const v10 = lattice[y0 * gridW + x1]
      const v01 = lattice[y1 * gridW + x0]
      const v11 = lattice[y1 * gridW + x1]

      // Bilinear interpolation with Hermite smoothing
      const top = v00 * (1 - fx) + v10 * fx
      const bottom = v01 * (1 - fx) + v11 * fx
      layer[y * width + x] = top * (1 - fy) + bottom * fy
    }
  }

  return layer
}

/**
 * Generates a seamless physically-based tileable roughness texture
 */
export function generateRoughnessTexture({
  width = 256,
  height = 256,
  cellSizes = [32, 16, 8, 4],
  weights = [0.15, 0.3, 0.35, 0.2],
  fleckIntensity = 0.25, // micro-fine high frequency flecks
  roughness = 0.5,
  specular = 0.35,
  shadow = 0.4,
  seed = 42,
} = {}) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  const imgData = ctx.createImageData(width, height)
  const data = imgData.data

  const rng = createSeededRng(seed)

  // 1. Build multi-scale seamless heightfield
  const heightField = new Float32Array(width * height)

  for (let s = 0; s < cellSizes.length; s++) {
    const layer = createSeamlessNoiseLayer(width, height, cellSizes[s], rng)
    const w = weights[s] || 0.25
    for (let i = 0; i < heightField.length; i++) {
      heightField[i] += layer[i] * w
    }
  }

  // Add micro-fleck layer (1-2px bead-blast sparkle)
  if (fleckIntensity > 0) {
    for (let i = 0; i < heightField.length; i++) {
      heightField[i] += (rng() - 0.5) * fleckIntensity
    }
  }

  // 2. Directional lighting vector (top-left 135 deg: light coming down & right)
  const lx = 0.7071
  const ly = 0.7071

  // 3. Compute surface normal slopes and apply directional microfacet scatter
  for (let y = 0; y < height; y++) {
    const yPrev = (y - 1 + height) % height
    const yNext = (y + 1) % height

    for (let x = 0; x < width; x++) {
      const xPrev = (x - 1 + width) % width
      const xNext = (x + 1) % width

      const idx = y * width + x
      const px = idx * 4

      // Slopes dx, dy (central difference with periodic wrap)
      const dx = (heightField[y * width + xNext] - heightField[y * width + xPrev]) * 0.5
      const dy = (heightField[yNext * width + x] - heightField[yPrev * width + x]) * 0.5

      // Slopes facing top-left (dx < 0, dy < 0) face the incoming light
      const dot = (-dx * lx - dy * ly) * roughness * 8.0

      if (dot > 0) {
        // Micro-specular glint on raised granules
        const alpha = Math.min(1.0, Math.pow(dot, 1.2) * specular)
        data[px] = 255
        data[px + 1] = 255
        data[px + 2] = 255
        data[px + 3] = Math.round(alpha * 255)
      } else {
        // Micro-occlusion shadow in recessed crevices
        const alpha = Math.min(1.0, Math.pow(-dot, 1.1) * shadow)
        data[px] = 0
        data[px + 1] = 0
        data[px + 2] = 0
        data[px + 3] = Math.round(alpha * 255)
      }
    }
  }

  ctx.putImageData(imgData, 0, 0)
  return canvas.toDataURL('image/png')
}

/**
 * Surface Shaders Utility
 * Kept rational and non-destructive: avoids applying noisy digital grit to clean UI components.
 * Real industrial references use smooth molded satin finishes and clean directional lighting.
 */
export function initSurfaceShaders() {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.style.setProperty('--tex-chassis-roughness', 'none')
  root.style.setProperty('--tex-metal-roughness', 'none')
  root.style.setProperty('--tex-canvas-grain', 'none')
}
