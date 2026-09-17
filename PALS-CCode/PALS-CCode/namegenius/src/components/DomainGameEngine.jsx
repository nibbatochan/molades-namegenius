import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import {
  playPixelJump,
  playPowerupChime,
  playGameOver,
  playCountdownBeep,
  playCannonBlast,
  playLaserShoot,
  playEnemyExplode,
  playBossWarning,
  playBossHit,
  playBossDefeated,
} from '../utils/audio'

// Curated list of 160+ high-quality brandable domain platforms
const DOMAIN_PLATFORMS = [
  { name: 'zenith', tld: '.com', color: '#ea580c' },
  { name: 'hyper', tld: '.ai', color: '#0284c7' },
  { name: 'lumina', tld: '.io', color: '#7c3aed' },
  { name: 'kroma', tld: '.co', color: '#059669' },
  { name: 'aura', tld: '.app', color: '#d97706' },
  { name: 'velox', tld: '.xyz', color: '#db2777' },
  { name: 'spark', tld: '.gg', color: '#e11d48' },
  { name: 'prism', tld: '.dev', color: '#4f46e5' },
  { name: 'omni', tld: '.cloud', color: '#0284c7' },
  { name: 'nexus', tld: '.ai', color: '#0284c7' },
  { name: 'vortex', tld: '.io', color: '#7c3aed' },
  { name: 'solis', tld: '.co', color: '#059669' },
  { name: 'strata', tld: '.dev', color: '#4f46e5' },
  { name: 'axiom', tld: '.ai', color: '#0284c7' },
  { name: 'drift', tld: '.app', color: '#d97706' },
  { name: 'pulse', tld: '.tech', color: '#06b6d4' },
  { name: 'nova', tld: '.io', color: '#7c3aed' },
  { name: 'atlas', tld: '.co', color: '#059669' },
  { name: 'glyph', tld: '.design', color: '#ec4899' },
  { name: 'flux', tld: '.ai', color: '#0284c7' },
  { name: 'arcadia', tld: '.com', color: '#ea580c' },
  { name: 'cipher', tld: '.xyz', color: '#db2777' },
  { name: 'ember', tld: '.io', color: '#7c3aed' },
  { name: 'zeno', tld: '.app', color: '#d97706' },
  { name: 'cobalt', tld: '.store', color: '#3b82f6' },
  { name: 'echo', tld: '.gg', color: '#e11d48' },
  { name: 'beacon', tld: '.com', color: '#ea580c' },
  { name: 'haven', tld: '.ai', color: '#0284c7' },
  { name: 'stride', tld: '.io', color: '#7c3aed' },
  { name: 'quarry', tld: '.dev', color: '#4f46e5' },
  { name: 'apex', tld: '.co', color: '#059669' },
  { name: 'tempo', tld: '.app', color: '#d97706' },
  { name: 'bloom', tld: '.design', color: '#ec4899' },
  { name: 'ridge', tld: '.io', color: '#7c3aed' },
  { name: 'summit', tld: '.ai', color: '#0284c7' },
  { name: 'pilot', tld: '.dev', color: '#4f46e5' },
  { name: 'forge', tld: '.com', color: '#ea580c' },
  { name: 'breeze', tld: '.cloud', color: '#0284c7' },
  { name: 'grove', tld: '.co', color: '#059669' },
  { name: 'oasis', tld: '.io', color: '#7c3aed' },
  { name: 'zenon', tld: '.ai', color: '#0284c7' },
  { name: 'origin', tld: '.com', color: '#ea580c' },
  { name: 'orbit', tld: '.space', color: '#8b5cf6' },
  { name: 'craft', tld: '.co', color: '#059669' },
  { name: 'synergy', tld: '.dev', color: '#4f46e5' },
  { name: 'zephyr', tld: '.io', color: '#7c3aed' },
  { name: 'stellar', tld: '.ai', color: '#0284c7' },
  { name: 'mirage', tld: '.world', color: '#d97706' },
  { name: 'terra', tld: '.com', color: '#ea580c' },
  { name: 'solstice', tld: '.co', color: '#059669' },
  { name: 'quartz', tld: '.dev', color: '#4f46e5' },
  { name: 'canyon', tld: '.io', color: '#7c3aed' },
  { name: 'harbor', tld: '.ai', color: '#0284c7' },
  { name: 'cascade', tld: '.com', color: '#ea580c' },
  { name: 'aurora', tld: '.app', color: '#d97706' },
  { name: 'creed', tld: '.pro', color: '#059669' },
  { name: 'dyno', tld: '.xyz', color: '#db2777' },
  { name: 'kinetic', tld: '.tech', color: '#4f46e5' },
  { name: 'radius', tld: '.io', color: '#7c3aed' },
  { name: 'fable', tld: '.ai', color: '#0284c7' },
  { name: 'verge', tld: '.com', color: '#ea580c' },
  { name: 'pinnacle', tld: '.co', color: '#059669' },
  { name: 'vectra', tld: '.dev', color: '#4f46e5' },
  { name: 'synthetix', tld: '.ai', color: '#0284c7' },
  { name: 'nimbus', tld: '.cloud', color: '#7c3aed' },
  { name: 'solara', tld: '.app', color: '#d97706' },
  { name: 'paragon', tld: '.com', color: '#ea580c' },
  { name: 'monolith', tld: '.co', color: '#059669' },
  { name: 'aeris', tld: '.xyz', color: '#db2777' },
  { name: 'cortex', tld: '.ai', color: '#0284c7' },
  { name: 'halcyon', tld: '.io', color: '#7c3aed' },
  { name: 'prismatix', tld: '.dev', color: '#4f46e5' },
  { name: 'spectra', tld: '.com', color: '#ea580c' },
  { name: 'zenithal', tld: '.app', color: '#d97706' },
  { name: 'arcane', tld: '.gg', color: '#e11d48' },
  { name: 'foundry', tld: '.co', color: '#059669' },
  { name: 'novus', tld: '.ai', color: '#0284c7' },
  { name: 'tessera', tld: '.io', color: '#7c3aed' },
  { name: 'valiant', tld: '.dev', color: '#4f46e5' },
  { name: 'solarium', tld: '.com', color: '#ea580c' },
  { name: 'chronos', tld: '.ai', color: '#0284c7' },
  { name: 'astral', tld: '.space', color: '#7c3aed' },
  { name: 'hyperion', tld: '.com', color: '#ea580c' },
  { name: 'elysium', tld: '.co', color: '#059669' },
  { name: 'omnichain', tld: '.link', color: '#3b82f6' },
  { name: 'pixel', tld: '.design', color: '#ec4899' },
  { name: 'synapse', tld: '.ai', color: '#0284c7' },
  { name: 'quantum', tld: '.tech', color: '#06b6d4' },
  { name: 'apexmind', tld: '.ai', color: '#0284c7' },
  { name: 'neon', tld: '.gg', color: '#e11d48' },
  { name: 'vital', tld: '.app', color: '#d97706' },
  { name: 'velocity', tld: '.dev', color: '#4f46e5' },
  { name: 'core', tld: '.io', color: '#7c3aed' },
  { name: 'metaverse', tld: '.world', color: '#8b5cf6' },
  { name: 'zenlogic', tld: '.ai', color: '#0284c7' },
  { name: 'infinity', tld: '.cloud', color: '#0284c7' },
]

const POWERUP_TYPES = [
  { label: '.AI', color: '#38bdf8', score: 50, weapon: 'railgun', weaponName: 'CYBER RAILGUN' },
  { label: '.COM', color: '#fb923c', score: 30, weapon: null },
  { label: '.IO', color: '#a78bfa', score: 40, weapon: 'spread', weaponName: 'TRIPLE SPREAD' },
  { label: '.GG', color: '#f43f5e', score: 60, weapon: 'missile', weaponName: 'MICRO-MISSILE' },
  { label: '.DEV', color: '#818cf8', score: 45, weapon: null },
  { label: '.APP', color: '#fbbf24', score: 35, weapon: null },
]

// 9 Custom Panoramic Landscape Biomes
const BIOMES = [
  {
    id: 'sea',
    chapter: '01',
    name: 'AZURE COASTLINE',
    file: '/game/sea.jpg',
    badgeText: '🌊 SEA',
    skyTop: [96, 165, 250],
    accentColor: '#38bdf8',
    cardBorder: '#0369a1',
    cardAccent: '#38bdf8',
    cardFace: '#f0fdfa',
    cardTop: '#0d9488',
    cardTuft: '#2dd4bf',
    soilTop: '#0f766e',
    soilBottom: '#115e59',
    weather: 'wind',
    windColor: 'rgba(255, 255, 255, 0.75)',
    moteColor: 'rgba(56, 189, 248, 0.85)',
    hasBirds: true,
  },
  {
    id: 'farm',
    chapter: '02',
    name: 'SUMMER PASTURE',
    file: '/game/farm.jpg',
    badgeText: '🌾 FARM',
    skyTop: [59, 130, 246],
    accentColor: '#84cc16',
    cardBorder: '#3f6212',
    cardAccent: '#84cc16',
    cardFace: '#fefce8',
    cardTop: '#15803d',
    cardTuft: '#4ade80',
    soilTop: '#92400e',
    soilBottom: '#78350f',
    weather: 'motes',
    windColor: 'rgba(254, 240, 138, 0.75)',
    moteColor: 'rgba(250, 204, 21, 0.85)',
    hasBirds: true,
  },
  {
    id: 'village',
    chapter: '03',
    name: 'SERENE COUNTRYSIDE',
    file: '/game/village.jpg',
    badgeText: '⛩️ VILLAGE',
    skyTop: [192, 160, 205],
    accentColor: '#f472b6',
    cardBorder: '#9d174d',
    cardAccent: '#f472b6',
    cardFace: '#fdf2f8',
    cardTop: '#db2777',
    cardTuft: '#f472b6',
    soilTop: '#831843',
    soilBottom: '#500724',
    weather: 'petals',
    windColor: 'rgba(244, 114, 182, 0.65)',
    moteColor: 'rgba(244, 114, 182, 0.9)',
    hasBirds: false,
  },
  {
    id: 'farm-senset',
    chapter: '04',
    name: 'GOLDEN HARVEST SUNSET',
    file: '/game/farm-senset.jpg',
    badgeText: '🌅 SUNSET FARM',
    skyTop: [234, 88, 12],
    accentColor: '#f97316',
    cardBorder: '#9a3412',
    cardAccent: '#f97316',
    cardFace: '#fff7ed',
    cardTop: '#b45309',
    cardTuft: '#f59e0b',
    soilTop: '#7c2d12',
    soilBottom: '#451a03',
    weather: 'leaves',
    windColor: 'rgba(254, 215, 170, 0.75)',
    moteColor: 'rgba(249, 115, 22, 0.95)',
    hasBirds: true,
  },
  {
    id: 'mountain',
    chapter: '05',
    name: 'ALPINE PEAKS',
    file: '/game/mountain.jpg',
    badgeText: '🏔️ MOUNTAIN',
    skyTop: [79, 70, 229],
    accentColor: '#60a5fa',
    cardBorder: '#1e40af',
    cardAccent: '#60a5fa',
    cardFace: '#f8fafc',
    cardTop: '#38bdf8',
    cardTuft: '#e0f2fe',
    soilTop: '#334155',
    soilBottom: '#1e293b',
    weather: 'snow',
    windColor: 'rgba(255, 255, 255, 0.85)',
    moteColor: 'rgba(224, 242, 254, 0.95)',
    hasBirds: true,
  },
  {
    id: 'flowerfields',
    chapter: '06',
    name: 'BLOOMING MEADOWS',
    file: '/game/flowerfields.jpg',
    badgeText: '🌸 FLOWERS',
    skyTop: [74, 172, 238],
    accentColor: '#ec4899',
    cardBorder: '#15803d',
    cardAccent: '#ec4899',
    cardFace: '#fdf4ff',
    cardTop: '#059669',
    cardTuft: '#ec4899',
    soilTop: '#15803d',
    soilBottom: '#14532d',
    weather: 'spores',
    windColor: 'rgba(244, 114, 182, 0.65)',
    moteColor: 'rgba(52, 211, 153, 0.95)',
    hasBirds: true,
  },
  {
    id: 'city-evening',
    chapter: '07',
    name: 'TWILIGHT METROPOLIS',
    file: '/game/city-evening.jpg',
    badgeText: '🌆 CITY EVENING',
    skyTop: [30, 27, 75],
    accentColor: '#a855f7',
    cardBorder: '#581c87',
    cardAccent: '#a855f7',
    cardFace: '#1e1b4b',
    cardTop: '#7e22ce',
    cardTuft: '#c084fc',
    soilTop: '#3b0764',
    soilBottom: '#0f0d1e',
    weather: 'rain',
    windColor: 'rgba(192, 132, 252, 0.65)',
    moteColor: 'rgba(254, 240, 138, 0.9)',
    hasBirds: false,
  },
  {
    id: 'city-indian',
    chapter: '08',
    name: 'VIBRANT INDIAN CITY',
    file: '/game/city-indian.jpg',
    badgeText: '🛺 VIBRANT CITY',
    skyTop: [249, 115, 22],
    accentColor: '#eab308',
    cardBorder: '#854d0e',
    cardAccent: '#eab308',
    cardFace: '#fffbeb',
    cardTop: '#d97706',
    cardTuft: '#facc15',
    soilTop: '#9a3412',
    soilBottom: '#7c2d12',
    weather: 'motes',
    windColor: 'rgba(253, 224, 71, 0.7)',
    moteColor: 'rgba(249, 115, 22, 0.9)',
    hasBirds: true,
  },
  {
    id: 'sunset-wildlands',
    chapter: '09',
    name: 'WILDLAND HORIZON',
    file: '/game/sunset-wildlands.jpg',
    badgeText: '🌄 WILDLANDS',
    skyTop: [154, 52, 18],
    accentColor: '#fb923c',
    cardBorder: '#7c2d12',
    cardAccent: '#fb923c',
    cardFace: '#fff7ed',
    cardTop: '#ea580c',
    cardTuft: '#fb923c',
    soilTop: '#831843',
    soilBottom: '#4c0519',
    weather: 'wind',
    windColor: 'rgba(254, 215, 170, 0.8)',
    moteColor: 'rgba(251, 146, 60, 0.95)',
    hasBirds: true,
  },
]

// Universal top-level canvas rounded rectangle helper
function roundRect(ctx, x, y, width, height, radius) {
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath()
    ctx.roundRect(x, y, width, height, radius)
    return
  }
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

// Procedural Crack Generator
function generateCracks(width = 120, height = 26) {
  if (Math.random() > 0.40) return []
  const count = 1 + Math.floor(Math.random() * 2)
  const cracks = []
  for (let i = 0; i < count; i++) {
    const startX = 14 + Math.random() * (width - 48)
    const startY = 2 + Math.random() * 4
    const midX = startX + (Math.random() * 10 - 5)
    const midY = startY + 7 + Math.random() * 6
    const endX = midX + (Math.random() * 8 - 4)
    const endY = height - 2 - Math.random() * 3
    cracks.push([startX, startY, midX, midY, endX, endY])
  }
  return cracks
}

// All 9 rotating custom biome background images cache
const BIOME_IMAGES = Array.from({ length: BIOMES.length }, () => null)

function initGameAssets() {
  if (typeof window === 'undefined') return
  BIOMES.forEach((b, i) => {
    if (!BIOME_IMAGES[i]) {
      const img = new Image()
      img.src = b.file
      img.onload = () => { BIOME_IMAGES[i] = img }
    }
  })
}

if (typeof window !== 'undefined') {
  initGameAssets()
}

// 12 Equipable pixel-art accessories for Arabella the Cat
const ACCESSORIES_LIST = [
  'goggles',
  'party_hat',
  'wizard_hat',
  'crown',
  'flower',
  'sunglasses',
  'pirate_hat',
  'chef_hat',
  'viking_helmet',
  'halo',
  'vr_visor',
  'straw_hat',
]

const ACCESSORY_NAMES = {
  goggles: '🥽 AVIATOR GOGGLES',
  party_hat: '🎉 PARTY HAT',
  wizard_hat: '🧙 WIZARD HAT',
  crown: '👑 ROYAL CROWN',
  flower: '🌸 BLOSSOM CLIP',
  sunglasses: '🕶️ COOL SHADES',
  pirate_hat: '🏴‍☠️ CAPTAIN HAT',
  chef_hat: '👨‍🍳 CHEF TOQUE',
  viking_helmet: '🪖 VIKING HORNS',
  halo: '😇 GOLDEN HALO',
  vr_visor: '🥽 CYBER VISOR',
  straw_hat: '🤠 STRAW HAT',
}

// Handcrafted Feline Walkcycle Sprite with 12 Accessories
function renderCatSprite(ctx, x, y, isGrounded, vy, frameCounter, isDead, accessory = null) {
  ctx.save()
  ctx.translate(Math.round(x), Math.round(y))

  const cycle = 32
  const phase = (frameCounter % cycle) / cycle

  const getLegMotion = (legPhaseOffset) => {
    const p = (phase + legPhaseOffset) % 1
    const xOffset = -Math.cos(p * Math.PI * 2) * 4.6
    const lift = p < 0.5 ? Math.sin(p * Math.PI * 2) * 3.4 : 0
    return { xOffset, lift }
  }

  const fr = getLegMotion(0.0)
  const fl = getLegMotion(0.5)
  const hr = getLegMotion(0.75)
  const hl = getLegMotion(0.25)

  const spineBob = isGrounded ? Math.sin(phase * Math.PI * 4) * 1.0 : 0
  const headBob = isGrounded ? -Math.sin(phase * Math.PI * 4) * 0.7 : 0
  const tailSwayAngle = isGrounded
    ? Math.sin(frameCounter * 0.10) * 0.20
    : vy < 0
    ? -0.50
    : 0.12

  const furMain = isDead ? '#94a3b8' : '#ea580c'
  const furLight = isDead ? '#cbd5e1' : '#f97316'
  const furShade = isDead ? '#64748b' : '#c2410c'
  const furDarkShade = isDead ? '#475569' : '#9a3412'
  const whiteSock = '#ffffff'
  const creamSock = '#f1f5f9'

  // Far Hind Leg
  if (isGrounded) {
    ctx.fillStyle = furDarkShade
    ctx.fillRect(5 + hl.xOffset, 18 + spineBob - hl.lift, 3.5, 6)
    ctx.fillStyle = creamSock
    ctx.fillRect(5 + hl.xOffset, 22 + spineBob - hl.lift, 4, 2.8)
  } else if (vy < 0) {
    ctx.fillStyle = furDarkShade
    ctx.fillRect(1, 16, 6, 3.5)
    ctx.fillStyle = creamSock
    ctx.fillRect(-1, 17, 3.5, 2.5)
  } else {
    ctx.fillStyle = furDarkShade
    ctx.fillRect(3, 18, 3.5, 6)
    ctx.fillStyle = creamSock
    ctx.fillRect(3, 22, 4, 2.5)
  }

  // Far Front Leg
  if (isGrounded) {
    ctx.fillStyle = furShade
    ctx.fillRect(18 + fl.xOffset, 18 + spineBob - fl.lift, 3.5, 6)
    ctx.fillStyle = creamSock
    ctx.fillRect(18 + fl.xOffset, 22 + spineBob - fl.lift, 4, 2.8)
  } else if (vy < 0) {
    ctx.fillStyle = furShade
    ctx.fillRect(21, 15, 6, 3.5)
    ctx.fillStyle = creamSock
    ctx.fillRect(25, 16, 3.5, 2.5)
  } else {
    ctx.fillStyle = furShade
    ctx.fillRect(19, 18, 3.5, 6)
    ctx.fillStyle = creamSock
    ctx.fillRect(19, 22, 4, 2.5)
  }

  // Feline Tail
  ctx.save()
  ctx.translate(3, 15 + spineBob)
  ctx.rotate(tailSwayAngle)
  ctx.lineWidth = 3.6
  ctx.lineCap = 'round'
  ctx.strokeStyle = furMain
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.quadraticCurveTo(-8, -7, -13, -13)
  ctx.stroke()

  ctx.strokeStyle = whiteSock
  ctx.lineWidth = 3.2
  ctx.beginPath()
  ctx.moveTo(-10, -10)
  ctx.lineTo(-13, -13)
  ctx.stroke()
  ctx.restore()

  // Torso / Body
  ctx.fillStyle = furLight
  roundRect(ctx, 4, 8 + spineBob, 22, 14, 7)
  ctx.fill()
  ctx.strokeStyle = '#7c2d12'
  ctx.lineWidth = 1.1
  ctx.stroke()

  if (!isDead) {
    ctx.fillStyle = furShade
    ctx.fillRect(9, 8 + spineBob, 2.5, 5)
    ctx.fillRect(14, 8 + spineBob, 2.5, 5)
  }

  ctx.fillStyle = whiteSock
  roundRect(ctx, 14, 12 + spineBob, 10, 8, 3.5)
  ctx.fill()

  // Near Hind Leg
  if (isGrounded) {
    ctx.fillStyle = furShade
    ctx.fillRect(6 + hr.xOffset, 19 + spineBob - hr.lift, 4, 6)
    ctx.fillStyle = whiteSock
    ctx.fillRect(6 + hr.xOffset, 23 + spineBob - hr.lift, 4.5, 2.8)
  } else if (vy < 0) {
    ctx.fillStyle = furShade
    ctx.fillRect(2, 15, 7, 4)
    ctx.fillStyle = whiteSock
    ctx.fillRect(0, 16, 4, 3)
  } else {
    ctx.fillStyle = furShade
    ctx.fillRect(5, 19, 4, 6.5)
    ctx.fillStyle = whiteSock
    ctx.fillRect(5, 23, 4.5, 2.8)
  }

  // Near Front Leg
  if (isGrounded) {
    ctx.fillStyle = furMain
    ctx.fillRect(19 + fr.xOffset, 19 + spineBob - fr.lift, 4, 6)
    ctx.fillStyle = whiteSock
    ctx.fillRect(19 + fr.xOffset, 23 + spineBob - fr.lift, 4.5, 2.8)
  } else if (vy < 0) {
    ctx.fillStyle = furMain
    ctx.fillRect(23, 14, 7, 4)
    ctx.fillStyle = whiteSock
    ctx.fillRect(27, 15, 4.5, 3)
  } else {
    ctx.fillStyle = furMain
    ctx.fillRect(21, 19, 4, 6.5)
    ctx.fillStyle = whiteSock
    ctx.fillRect(21, 23, 4.5, 2.8)
  }

  // Crimson Collar with Golden Bell
  ctx.fillStyle = '#dc2626'
  ctx.fillRect(16, 9 + spineBob, 3.5, 7)
  ctx.fillStyle = '#facc15'
  ctx.beginPath()
  ctx.arc(17.5, 16 + spineBob, 2.6, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#854d0e'
  ctx.lineWidth = 0.8
  ctx.stroke()
  ctx.fillStyle = '#78350f'
  ctx.fillRect(17, 16.5 + spineBob, 1, 1)

  // Cat Head & Facial Features
  const headX = 14
  const headY = 2 + headBob
  ctx.fillStyle = isDead ? '#cbd5e1' : '#fb923c'
  roundRect(ctx, headX, headY, 18, 15, 6)
  ctx.fill()
  ctx.strokeStyle = '#7c2d12'
  ctx.lineWidth = 1.2
  ctx.stroke()

  // Left Ear
  ctx.fillStyle = isDead ? '#94a3b8' : '#ea580c'
  ctx.beginPath()
  ctx.moveTo(headX + 2, headY + 3)
  ctx.lineTo(headX + 5, headY - 5)
  ctx.lineTo(headX + 9, headY + 1)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#f472b6'
  ctx.beginPath()
  ctx.moveTo(headX + 3.5, headY + 2)
  ctx.lineTo(headX + 5, headY - 3)
  ctx.lineTo(headX + 7.5, headY + 1)
  ctx.closePath()
  ctx.fill()

  // Right Ear
  ctx.fillStyle = isDead ? '#94a3b8' : '#ea580c'
  ctx.beginPath()
  ctx.moveTo(headX + 11, headY + 1)
  ctx.lineTo(headX + 15, headY - 5)
  ctx.lineTo(headX + 17, headY + 3)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#f472b6'
  ctx.beginPath()
  ctx.moveTo(headX + 12, headY + 1)
  ctx.lineTo(headX + 14.5, headY - 3)
  ctx.lineTo(headX + 16, headY + 2)
  ctx.closePath()
  ctx.fill()

  if (!isDead) {
    ctx.fillStyle = '#c2410c'
    ctx.fillRect(headX + 7, headY + 2, 2, 3)
    ctx.fillRect(headX + 10, headY + 2, 2, 3)
    ctx.fillRect(headX + 8, headY + 4, 3, 1.5)
  }

  // Eyes
  if (isDead) {
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(headX + 5, headY + 6)
    ctx.lineTo(headX + 9, headY + 10)
    ctx.moveTo(headX + 9, headY + 6)
    ctx.lineTo(headX + 5, headY + 10)
    ctx.moveTo(headX + 12, headY + 6)
    ctx.lineTo(headX + 16, headY + 10)
    ctx.moveTo(headX + 16, headY + 6)
    ctx.lineTo(headX + 12, headY + 10)
    ctx.stroke()
  } else {
    // Emerald Eyes
    ctx.fillStyle = '#10b981'
    roundRect(ctx, headX + 5, headY + 5, 4.5, 6, 2)
    ctx.fill()
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(headX + 6, headY + 6, 2.5, 4)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(headX + 5.5, headY + 5.5, 1.5, 1.5)
    ctx.fillRect(headX + 7.5, headY + 8.5, 1, 1)

    ctx.fillStyle = '#10b981'
    roundRect(ctx, headX + 12, headY + 5, 4.5, 6, 2)
    ctx.fill()
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(headX + 13, headY + 6, 2.5, 4)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(headX + 12.5, headY + 5.5, 1.5, 1.5)
    ctx.fillRect(headX + 14.5, headY + 8.5, 1, 1)
  }

  // Pink Nose & Mouth
  ctx.fillStyle = '#f472b6'
  ctx.beginPath()
  ctx.moveTo(headX + 9, headY + 10)
  ctx.lineTo(headX + 12, headY + 10)
  ctx.lineTo(headX + 10.5, headY + 11.5)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = '#7c2d12'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(headX + 8.5, headY + 12.5)
  ctx.quadraticCurveTo(headX + 9.5, headY + 13.5, headX + 10.5, headY + 12.5)
  ctx.quadraticCurveTo(headX + 11.5, headY + 13.5, headX + 12.5, headY + 12.5)
  ctx.stroke()

  // Whiskers
  ctx.strokeStyle = isDead ? '#94a3b8' : '#7c2d12'
  ctx.lineWidth = 0.9
  ctx.beginPath()
  ctx.moveTo(headX + 4, headY + 9)
  ctx.lineTo(headX - 3, headY + 8)
  ctx.moveTo(headX + 4, headY + 11)
  ctx.lineTo(headX - 4, headY + 12)
  ctx.moveTo(headX + 4, headY + 13)
  ctx.lineTo(headX - 3, headY + 15)
  ctx.moveTo(headX + 16, headY + 9)
  ctx.lineTo(headX + 23, headY + 8)
  ctx.moveTo(headX + 16, headY + 11)
  ctx.lineTo(headX + 24, headY + 12)
  ctx.moveTo(headX + 16, headY + 13)
  ctx.lineTo(headX + 23, headY + 15)
  ctx.stroke()

  // 12 Equipable Accessories
  if (accessory && !isDead) {
    if (accessory === 'goggles') {
      ctx.fillStyle = '#92400e'
      ctx.fillRect(headX + 1, headY + 3, 16, 2.5)
      ctx.fillStyle = '#ca8a04'
      ctx.fillRect(headX + 4, headY + 1.5, 5, 5.5)
      ctx.fillStyle = '#38bdf8'
      ctx.fillRect(headX + 5, headY + 2.5, 3, 3.5)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(headX + 5.5, headY + 2.5, 1, 1)
      ctx.fillStyle = '#ca8a04'
      ctx.fillRect(headX + 10, headY + 1.5, 5, 5.5)
      ctx.fillStyle = '#38bdf8'
      ctx.fillRect(headX + 11, headY + 2.5, 3, 3.5)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(headX + 11.5, headY + 2.5, 1, 1)
    } else if (accessory === 'party_hat') {
      ctx.fillStyle = '#ec4899'
      ctx.beginPath()
      ctx.moveTo(headX + 5, headY - 1)
      ctx.lineTo(headX + 9, headY - 14)
      ctx.lineTo(headX + 13, headY - 1)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = '#facc15'
      ctx.beginPath()
      ctx.arc(headX + 9, headY - 14.5, 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(headX + 7, headY - 5, 1.5, 1.5)
      ctx.fillRect(headX + 10, headY - 8, 1.5, 1.5)
    } else if (accessory === 'wizard_hat') {
      ctx.fillStyle = '#4338ca'
      roundRect(ctx, headX + 2, headY - 2, 14, 3, 1.5)
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(headX + 4, headY - 2)
      ctx.lineTo(headX + 8, headY - 15)
      ctx.quadraticCurveTo(headX + 13, headY - 17, headX + 14, headY - 12)
      ctx.lineTo(headX + 12, headY - 2)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = '#facc15'
      ctx.fillRect(headX + 4.5, headY - 4, 9, 2)
      ctx.fillRect(headX + 8, headY - 9, 2, 2)
    } else if (accessory === 'crown') {
      ctx.fillStyle = '#facc15'
      ctx.fillRect(headX + 5, headY - 3, 8, 3)
      ctx.fillRect(headX + 5, headY - 7, 2, 4)
      ctx.fillRect(headX + 8, headY - 8, 2, 5)
      ctx.fillRect(headX + 11, headY - 7, 2, 4)
      ctx.fillStyle = '#ef4444'
      ctx.fillRect(headX + 8.5, headY - 4, 1.5, 2)
    } else if (accessory === 'flower') {
      ctx.fillStyle = '#f472b6'
      ctx.beginPath()
      ctx.arc(headX + 15, headY - 1, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#fdf2f8'
      ctx.beginPath()
      ctx.arc(headX + 15, headY - 1, 1.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#fbbf24'
      ctx.fillRect(headX + 14.5, headY - 1.5, 1, 1)
    } else if (accessory === 'sunglasses') {
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(headX + 3, headY + 6, 13, 4.5)
      ctx.fillRect(headX + 8, headY + 6.5, 2, 2)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(headX + 4.5, headY + 7, 2, 1)
      ctx.fillRect(headX + 10.5, headY + 7, 2, 1)
    } else if (accessory === 'pirate_hat') {
      ctx.fillStyle = '#0f172a'
      roundRect(ctx, headX + 1, headY - 3, 16, 4, 1.5)
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(headX + 2, headY - 3)
      ctx.lineTo(headX + 9, headY - 12)
      ctx.lineTo(headX + 16, headY - 3)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#facc15'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(headX + 8, headY - 7, 2.5, 2.5)
    } else if (accessory === 'chef_hat') {
      ctx.fillStyle = '#ffffff'
      roundRect(ctx, headX + 4, headY - 2, 10, 3, 1)
      ctx.fill()
      roundRect(ctx, headX + 3, headY - 14, 12, 12, 4)
      ctx.fill()
      ctx.strokeStyle = '#cbd5e1'
      ctx.lineWidth = 1
      ctx.stroke()
    } else if (accessory === 'viking_helmet') {
      ctx.fillStyle = '#475569'
      roundRect(ctx, headX + 3, headY - 3, 12, 5, 3)
      ctx.fill()
      ctx.fillStyle = '#fef3c7'
      ctx.beginPath()
      ctx.moveTo(headX + 4, headY - 2)
      ctx.quadraticCurveTo(headX - 1, headY - 7, headX, headY - 10)
      ctx.lineTo(headX + 5, headY - 3)
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(headX + 14, headY - 2)
      ctx.quadraticCurveTo(headX + 19, headY - 7, headX + 18, headY - 10)
      ctx.lineTo(headX + 13, headY - 3)
      ctx.fill()
    } else if (accessory === 'halo') {
      ctx.save()
      ctx.strokeStyle = '#facc15'
      ctx.lineWidth = 2.2
      ctx.beginPath()
      ctx.ellipse(headX + 9, headY - 7, 7, 2.5, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    } else if (accessory === 'vr_visor') {
      ctx.fillStyle = '#06b6d4'
      roundRect(ctx, headX + 3, headY + 5, 14, 6, 2)
      ctx.fill()
      ctx.fillStyle = '#a5f3fc'
      ctx.fillRect(headX + 5, headY + 6.5, 10, 2)
    } else if (accessory === 'straw_hat') {
      ctx.fillStyle = '#fef08a'
      roundRect(ctx, headX - 1, headY - 2, 20, 3, 1.5)
      ctx.fill()
      roundRect(ctx, headX + 4, headY - 8, 10, 6, 2)
      ctx.fill()
      ctx.fillStyle = '#16a34a'
      ctx.fillRect(headX + 4, headY - 3, 10, 1.5)
    }
  }

  ctx.restore()
}

// Biome-Specific Themed Domain Platforms
function drawThemedDomainCard(ctx, p, biomeIdx, isFloating) {
  const x = Math.round(p.x)
  const y = Math.round(p.y)
  const w = Math.round(p.w)
  const h = Math.round(p.h || 42)

  const b = BIOMES[biomeIdx] || BIOMES[0]
  const border = b.cardBorder || '#0f172a'
  const cardFace = b.cardFace || '#f8fafc'
  const cardTop = b.cardTop || '#15803d'
  const cardTuft = b.cardTuft || '#4ade80'
  const soilTop = b.soilTop || '#92400e'
  const soilBottom = b.soilBottom || '#78350f'

  if (isFloating) {
    ctx.save()
    ctx.globalAlpha = 0.32 + Math.sin((p.floatAngle || 0) * 2.2) * 0.15
    ctx.strokeStyle = b.accentColor || '#38bdf8'
    ctx.lineWidth = 4
    roundRect(ctx, x - 3, y - 3, w + 6, h + 6, 7)
    ctx.stroke()
    ctx.restore()
  }

  // 1. Drop Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  roundRect(ctx, x + 2, y + 3, w, h, 6)
  ctx.fill()

  // 2. Main Card Body Face
  ctx.fillStyle = cardFace
  roundRect(ctx, x, y, w, h, 6)
  ctx.fill()
  ctx.strokeStyle = border
  ctx.lineWidth = 1.5
  ctx.stroke()

  // 3. Biome-Specific Craft Details
  if (b.id === 'sea') {
    ctx.fillStyle = cardTop
    ctx.fillRect(x + 1, y, w - 2, 9)
    ctx.fillStyle = cardTuft
    for (let gx = x + 3; gx < x + w - 4; gx += 6) {
      ctx.beginPath()
      ctx.arc(gx + 3, y + 2, 3, Math.PI, 0)
      ctx.fill()
    }
    ctx.fillStyle = 'rgba(14, 165, 233, 0.15)'
    ctx.fillRect(x + 4, y + 16, w - 8, 2)
    ctx.fillRect(x + 12, y + 22, w - 24, 1.5)
    ctx.fillStyle = '#d97706'
    ctx.fillRect(x + 3, y + h - 10, 2, 2)
    ctx.fillRect(x + w - 5, y + h - 10, 2, 2)
  } else if (b.id === 'farm') {
    ctx.fillStyle = cardTop
    ctx.fillRect(x + 1, y, w - 2, 8)
    ctx.fillStyle = '#facc15'
    for (let gx = x + 4; gx < x + w - 5; gx += 7) {
      ctx.fillRect(gx, y - 3, 2, 4)
      ctx.fillRect(gx + 1, y - 5, 2, 3)
    }
    ctx.fillStyle = 'rgba(146, 64, 14, 0.15)'
    ctx.fillRect(x + 1, y + 20, w - 2, 1)
  } else if (b.id === 'village') {
    ctx.fillStyle = cardTop
    ctx.fillRect(x + 1, y, w - 2, 9)
    ctx.fillStyle = cardTuft
    for (let gx = x + 2; gx < x + w - 4; gx += 5) {
      ctx.fillRect(gx, y + 1, 3, 3)
      ctx.fillRect(gx + 1, y - 2, 2, 3)
    }
    ctx.fillStyle = '#dc2626'
    ctx.fillRect(x + w - 8, y + 10, 3, 4)
  } else if (b.id === 'mountain') {
    ctx.fillStyle = cardTop
    ctx.fillRect(x + 1, y, w - 2, 8)
    ctx.fillStyle = '#e0f2fe'
    for (let gx = x + 3; gx < x + w - 5; gx += 6) {
      ctx.fillRect(gx, y + 8, 2.5, 4)
      ctx.fillRect(gx + 1, y + 12, 1, 2.5)
    }
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(x + 6, y + 18, 2, 2)
  } else if (b.id === 'flowerfields') {
    ctx.fillStyle = cardTop
    ctx.fillRect(x + 1, y, w - 2, 8)
    const flowerCols = ['#ec4899', '#facc15', '#ffffff', '#38bdf8']
    let fIdx = 0
    for (let gx = x + 4; gx < x + w - 6; gx += 8) {
      ctx.fillStyle = flowerCols[fIdx % flowerCols.length]
      ctx.fillRect(gx, y - 2, 3, 3)
      ctx.fillRect(gx + 1, y - 3, 1, 5)
      fIdx++
    }
  } else if (b.id === 'city-evening') {
    ctx.fillStyle = cardTop
    ctx.fillRect(x + 1, y, w - 2, 7)
    ctx.fillStyle = '#22d3ee'
    ctx.fillRect(x + 1, y + 7, w - 2, 1.5)
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x + 6, y + 18)
    ctx.lineTo(x + 22, y + 18)
    ctx.lineTo(x + 28, y + 24)
    ctx.stroke()
  } else if (b.id === 'city-indian') {
    ctx.fillStyle = cardTop
    ctx.fillRect(x + 1, y, w - 2, 8)
    ctx.fillStyle = '#facc15'
    for (let gx = x + 3; gx < x + w - 5; gx += 5) {
      ctx.beginPath()
      ctx.arc(gx + 2.5, y + 8, 2.5, 0, Math.PI)
      ctx.fill()
    }
  } else {
    ctx.fillStyle = cardTop
    ctx.fillRect(x + 1, y, w - 2, 8)
    ctx.fillStyle = 'rgba(251, 146, 60, 0.25)'
    ctx.fillRect(x + 1, y + 16, w - 2, 2)
    ctx.fillRect(x + 1, y + 22, w - 2, 1.5)
  }

  // 4. Unified Branded Domain Pill
  const namePart = (p.text || '').replace(p.tld || '', '')
  const tldPart = p.tld || '.com'

  ctx.font = 'bold 11px "JetBrains Mono", monospace'
  const nameWidth = ctx.measureText(namePart).width
  ctx.font = 'bold 9px "JetBrains Mono", monospace'
  const tldWidth = ctx.measureText(tldPart).width

  const pillPadX = 6
  const pillW = nameWidth + tldWidth + pillPadX * 2 + 5
  const pillH = 18
  const pillX = x + 8
  const pillY = y + 15

  ctx.fillStyle = b.id === 'city-evening' ? '#0f172a' : '#090d16'
  roundRect(ctx, pillX, pillY, pillW, pillH, 4)
  ctx.fill()
  ctx.strokeStyle = border
  ctx.lineWidth = 1
  ctx.stroke()

  // Domain Name
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 10.5px "JetBrains Mono", monospace'
  ctx.textAlign = 'start'
  ctx.textBaseline = 'middle'
  ctx.fillText(namePart, pillX + pillPadX, pillY + pillH / 2)

  // Domain TLD Extension Badge (Directly adjacent to name!)
  const tldBadgeX = pillX + pillPadX + nameWidth + 3
  const tldBadgeY = pillY + 2
  const tldBadgeW = tldWidth + 6
  const tldBadgeH = pillH - 4

  ctx.fillStyle = p.color || b.accentColor || '#ea580c'
  roundRect(ctx, tldBadgeX, tldBadgeY, tldBadgeW, tldBadgeH, 3)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 8.5px "JetBrains Mono", monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(tldPart, tldBadgeX + tldBadgeW / 2, tldBadgeY + tldBadgeH / 2)

  // 5. Bottom edge soil base
  ctx.fillStyle = soilTop
  ctx.fillRect(x + 1, y + h - 5, w - 2, 4)
  ctx.fillStyle = soilBottom
  ctx.fillRect(x + 1, y + h - 2, w - 2, 1)

  ctx.textAlign = 'start'
  ctx.textBaseline = 'alphabetic'
}

// Handcrafted Pixel-Art Cannon for Rescue & Launch sequence
function renderRescueCannon(ctx, cannon) {
  if (!cannon || !cannon.active) return
  ctx.save()
  ctx.translate(Math.round(cannon.x), Math.round(cannon.y))

  // 1. Heavy Wooden & Iron Cart Base / Wheels
  ctx.fillStyle = '#451a03'
  roundRect(ctx, 4, 18, 32, 10, 3)
  ctx.fill()
  ctx.strokeStyle = '#1e1b4b'
  ctx.lineWidth = 1.2
  ctx.stroke()

  // Spoked Iron Wheels
  const wheelX1 = 9
  const wheelX2 = 31
  const wheelY = 24
  const wheelR = 7.5

  ;[wheelX1, wheelX2].forEach((wx) => {
    ctx.fillStyle = '#1e293b'
    ctx.beginPath()
    ctx.arc(wx, wheelY, wheelR, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#94a3b8'
    ctx.lineWidth = 1.2
    ctx.stroke()

    // Wheel hub
    ctx.fillStyle = '#f59e0b'
    ctx.beginPath()
    ctx.arc(wx, wheelY, 2.5, 0, Math.PI * 2)
    ctx.fill()
  })

  // 2. Iron Cannon Barrel (Rotated towards platform)
  ctx.save()
  ctx.translate(20, 14)
  ctx.rotate(((cannon.barrelAngle || -45) * Math.PI) / 180)

  // Recoil kickback
  if (cannon.recoil > 0) {
    ctx.translate(-cannon.recoil, 0)
  }

  // Tapered Heavy Iron Barrel
  const grad = ctx.createLinearGradient(0, -9, 0, 9)
  grad.addColorStop(0, '#64748b')
  grad.addColorStop(0.35, '#334155')
  grad.addColorStop(0.75, '#1e293b')
  grad.addColorStop(1, '#0f172a')
  ctx.fillStyle = grad

  ctx.beginPath()
  ctx.moveTo(-10, -8)
  ctx.lineTo(24, -6)
  ctx.lineTo(24, 6)
  ctx.lineTo(-10, 8)
  ctx.arc(-10, 0, 8, Math.PI / 2, -Math.PI / 2)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = '#020617'
  ctx.lineWidth = 1.2
  ctx.stroke()

  // Brass Reinforcing Bands
  ctx.fillStyle = '#d97706'
  roundRect(ctx, 4, -7.5, 3.5, 15, 1)
  ctx.fill()
  roundRect(ctx, 16, -6.8, 3.5, 13.6, 1)
  ctx.fill()

  // Gold Muzzle Ring
  ctx.fillStyle = '#fbbf24'
  roundRect(ctx, 22, -8, 4, 16, 1.5)
  ctx.fill()
  ctx.strokeStyle = '#78350f'
  ctx.lineWidth = 0.8
  ctx.stroke()

  // Cute cat face peeking out of muzzle when loaded inside
  if (cannon.catInside && (cannon.phase === 'rise' || cannon.phase === 'aim')) {
    ctx.fillStyle = '#ea580c'
    ctx.beginPath()
    ctx.moveTo(25, -5)
    ctx.lineTo(31, -9)
    ctx.lineTo(29, -2)
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(25, 5)
    ctx.lineTo(31, 9)
    ctx.lineTo(29, 2)
    ctx.fill()

    ctx.fillStyle = '#22c55e'
    ctx.fillRect(26, -3, 2, 2)
    ctx.fillRect(26, 1, 2, 2)
  }

  ctx.restore()
  ctx.restore()
}

// 1. Pixel-Art Laser Projectiles & Micro-Missiles
function renderProjectiles(ctx, projectiles) {
  if (!projectiles || projectiles.length === 0) return
  ctx.save()
  for (let i = 0; i < projectiles.length; i++) {
    const p = projectiles[i]
    ctx.save()
    ctx.translate(Math.round(p.x), Math.round(p.y))

    if (p.type === 'railgun') {
      // Piercing Cyan Beam
      ctx.fillStyle = '#06b6d4'
      roundRect(ctx, -6, -2, p.w + 12, p.h + 4, 3)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      roundRect(ctx, 0, 0, p.w, p.h, 2)
      ctx.fill()
    } else if (p.type === 'missile') {
      // Micro-Rocket
      ctx.fillStyle = '#475569'
      roundRect(ctx, -2, -3, 3, 8, 1)
      ctx.fill()
      ctx.fillStyle = '#ea580c'
      roundRect(ctx, 0, -2, p.w, p.h, 2)
      ctx.fill()
      ctx.fillStyle = '#fbbf24'
      ctx.beginPath()
      ctx.moveTo(p.w, -2)
      ctx.lineTo(p.w + 4, p.h / 2 - 2)
      ctx.lineTo(p.w, p.h)
      ctx.fill()
    } else if (p.type === 'spread') {
      // Triple Violet Energy Crystal
      ctx.fillStyle = '#c084fc'
      roundRect(ctx, 0, -1, p.w, p.h + 2, 2)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(2, 0, p.w - 4, p.h)
    } else {
      // Standard Red/Amber Plasma Pulse
      ctx.fillStyle = '#f43f5e'
      roundRect(ctx, 0, -1, p.w, p.h + 2, 2)
      ctx.fill()
      ctx.fillStyle = '#fef08a'
      ctx.fillRect(1.5, 0, p.w - 3, p.h)
    }
    ctx.restore()
  }
  ctx.restore()
}

// 2. 404 Glitch Bug Sprite
function renderGlitchBug(ctx, bug) {
  ctx.save()
  ctx.translate(Math.round(bug.x), Math.round(bug.y))

  if (bug.hitFlash > 0) {
    ctx.fillStyle = '#ffffff'
    roundRect(ctx, 0, 0, bug.w, bug.h, 3)
    ctx.fill()
    ctx.restore()
    return
  }

  // Bug crawling legs
  const legWiggle = Math.sin((bug.frame || 0) * 0.4) * 2.5
  ctx.strokeStyle = '#064e3b'
  ctx.lineWidth = 1.2
  ;[3, 8, 13].forEach((lx, idx) => {
    const offset = idx % 2 === 0 ? legWiggle : -legWiggle
    ctx.beginPath()
    ctx.moveTo(lx, 10)
    ctx.lineTo(lx - 2, 13 + offset)
    ctx.stroke()
  })

  // Dark emerald/purple carapace body
  ctx.fillStyle = '#065f46'
  roundRect(ctx, 1, 2, bug.w - 2, bug.h - 3, 3)
  ctx.fill()
  ctx.strokeStyle = '#022c22'
  ctx.lineWidth = 1
  ctx.stroke()

  // Glowing Visor / Eyes
  ctx.fillStyle = '#ef4444'
  ctx.fillRect(bug.vx > 0 ? bug.w - 5 : 2, 4, 3, 2)

  // 404 text micro badge
  ctx.fillStyle = '#a7f3d0'
  ctx.font = 'bold 6px monospace'
  ctx.fillText('404', 3, 8.5)

  ctx.restore()
}

// 3. Squatter Drone Sprite
function renderSquatterDrone(ctx, drone) {
  ctx.save()
  ctx.translate(Math.round(drone.x), Math.round(drone.y))

  if (drone.hitFlash > 0) {
    ctx.fillStyle = '#ffffff'
    roundRect(ctx, 0, 0, drone.w, drone.h, 4)
    ctx.fill()
    ctx.restore()
    return
  }

  // Spinning top rotor blade
  const rPhase = ((drone.frame || 0) * 0.6) % Math.PI
  ctx.strokeStyle = '#38bdf8'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(drone.w / 2 - Math.cos(rPhase) * 8, -2)
  ctx.lineTo(drone.w / 2 + Math.cos(rPhase) * 8, -2)
  ctx.stroke()

  // Rotor mast
  ctx.fillStyle = '#64748b'
  ctx.fillRect(drone.w / 2 - 1, -2, 2, 3)

  // Drone Sphere Chassis
  ctx.fillStyle = '#1e293b'
  roundRect(ctx, 1, 1, drone.w - 2, drone.h - 2, 4)
  ctx.fill()
  ctx.strokeStyle = '#475569'
  ctx.lineWidth = 1.2
  ctx.stroke()

  // Golden Padlock Icon
  ctx.fillStyle = '#f59e0b'
  roundRect(ctx, 5, 6, 8, 7, 2)
  ctx.fill()
  ctx.strokeStyle = '#d97706'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(9, 6, 2.5, Math.PI, 0)
  ctx.stroke()

  // Jet spark underneath
  ctx.fillStyle = '#06b6d4'
  ctx.fillRect(drone.w / 2 - 1.5, drone.h - 1, 3, 2)

  ctx.restore()
}

// 4. Epic Boss: Megabyte Squatter Mecha
function renderBossMech(ctx, boss) {
  if (!boss) return
  ctx.save()
  ctx.translate(Math.round(boss.x), Math.round(boss.y))

  if (boss.hitFlash > 0) {
    ctx.fillStyle = '#ffffff'
    roundRect(ctx, 0, 0, boss.w, boss.h, 6)
    ctx.fill()
    ctx.restore()
    return
  }

  // Animated Twin Rocket Jet Exhaust
  const flameLen = 6 + Math.random() * 8
  ctx.fillStyle = '#f97316'
  ctx.beginPath()
  ctx.moveTo(8, boss.h - 4)
  ctx.lineTo(13, boss.h + flameLen)
  ctx.lineTo(18, boss.h - 4)
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(boss.w - 18, boss.h - 4)
  ctx.lineTo(boss.w - 13, boss.h + flameLen)
  ctx.lineTo(boss.w - 8, boss.h - 4)
  ctx.fill()

  ctx.fillStyle = '#fef08a'
  ctx.fillRect(10, boss.h - 3, 6, flameLen * 0.5)
  ctx.fillRect(boss.w - 16, boss.h - 3, 6, flameLen * 0.5)

  // Heavy Armored Hull
  ctx.fillStyle = '#0f172a'
  roundRect(ctx, 4, 4, boss.w - 8, boss.h - 8, 6)
  ctx.fill()
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Gunmetal Armor Plates
  ctx.fillStyle = '#1e293b'
  roundRect(ctx, 8, 8, boss.w - 16, 14, 3)
  ctx.fill()
  roundRect(ctx, 10, 24, boss.w - 20, 10, 2)
  ctx.fill()

  // Brass Plating Trim
  ctx.fillStyle = '#d97706'
  ctx.fillRect(6, 6, 4, boss.h - 12)
  ctx.fillRect(boss.w - 10, 6, 4, boss.h - 12)

  // Dual Plasma Blaster Barrels
  ctx.fillStyle = '#475569'
  ctx.fillRect(-4, 16, 8, 5)
  ctx.fillRect(-4, 26, 8, 5)
  ctx.fillStyle = '#ef4444'
  ctx.fillRect(-5, 17, 2, 3)
  ctx.fillRect(-5, 27, 2, 3)

  // Pulsing Cyclops Visor Eye
  const eyePulse = Math.sin(Date.now() * 0.008) * 0.5 + 0.5
  ctx.fillStyle = `rgb(239, 68, 68)`
  roundRect(ctx, 14, 11, boss.w - 28, 7, 2)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(18 + Math.round(eyePulse * 8), 12, 4, 5)

  // Segmented Chest Grill
  ctx.fillStyle = '#020617'
  for (let gy = 26; gy <= 32; gy += 3) {
    ctx.fillRect(14, gy, boss.w - 28, 1.5)
  }

  ctx.restore()

  // Render Boss Projectiles / 404 Glitch Orbs
  if (boss.bullets && boss.bullets.length > 0) {
    ctx.save()
    for (let i = 0; i < boss.bullets.length; i++) {
      const b = boss.bullets[i]
      ctx.save()
      ctx.translate(Math.round(b.x), Math.round(b.y))
      ctx.fillStyle = 'rgba(239, 68, 68, 0.35)'
      ctx.beginPath()
      ctx.arc(0, 0, b.size + 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(0, 0, b.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 7px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('404', 0, 0)
      ctx.restore()
    }
    ctx.restore()
  }
}

// 5. Boss Health Bar Overlay HUD
function renderBossHud(ctx, boss, w) {
  if (!boss || boss.hp <= 0) return
  const barW = 190
  const barH = 13
  const barX = (w - barW) / 2
  const barY = 28

  ctx.save()
  ctx.fillStyle = '#090d16'
  roundRect(ctx, barX - 2, barY - 1, barW + 4, barH + 2, 4)
  ctx.fill()
  ctx.strokeStyle = '#ef4444'
  ctx.lineWidth = 1.2
  ctx.stroke()

  const pct = Math.max(0, Math.min(1, boss.hp / boss.maxHp))
  const fillW = Math.max(0, Math.round((barW - 2) * pct))

  const grad = ctx.createLinearGradient(barX, 0, barX + barW, 0)
  grad.addColorStop(0, '#ef4444')
  grad.addColorStop(0.5, '#f59e0b')
  grad.addColorStop(1, '#22c55e')
  ctx.fillStyle = grad
  roundRect(ctx, barX + 1, barY + 1, fillW, barH - 2, 2)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 8px "JetBrains Mono", monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`☠️ ${boss.name}: ${Math.round(pct * 100)}%`, w / 2, barY + barH / 2)
  ctx.restore()
}

const DomainGameEngine = forwardRef(function DomainGameEngine(
  {
    isAutoMode = true,
    onToggleAutoMode,
    soundEnabled = true,
    onMilestone,
  },
  ref
) {
  const canvasRef = useRef(null)
  const soundEnabledRef = useRef(soundEnabled)
  useEffect(() => {
    soundEnabledRef.current = soundEnabled
  }, [soundEnabled])

  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('ng_tamagotchi_highscore') || '420', 10)
    } catch (_) {
      return 420
    }
  })
  const [lives, setLives] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [revives, setRevives] = useState(0)
  const [bubbleText, setBubbleText] = useState('')

  const lastScoreMilestoneRef = useRef(0)
  const lastHighMilestoneRef = useRef(0)

  // Curated list of 160+ high-quality brandable domain platforms
  const BASE_SPEED = 1.35
  const BIOME_DURATION_MS = 20000 // Exactly 20.000 seconds per biome (slower, relaxed panorama)
  const PAN_DURATION_MS = 18000   // 18.0 seconds to pan the full 2016px panorama
  const TRANSITION_DURATION_MS = 2000 // 2.0 seconds smooth velvet crossfade

  const stateRef = useRef({
    gameState: isAutoMode ? 'PLAYING' : 'COUNTDOWN',
    countdown: 3,
    countdownTimer: 60,
    score: 0,
    highScore: 420,
    lives: 1,
    cannon: {
      active: false,
      phase: 'idle',
      x: 18,
      y: 246,
      targetY: 246,
      timer: 0,
      barrelAngle: -45,
      recoil: 0,
      catInside: false,
    },
    isAuto: isAutoMode,
    gameOver: false,
    revives: 0,
    currentBiome: 0,
    bgTimeMs: 0,
    jumpBuffer: 0,
    celesteWind: Array.from({ length: 14 }).map((_, i) => ({
      x: (i * 28 + 10) % 380,
      y: 20 + (i * 12) % 180,
      len: 6 + ((i * 7) % 14),
      speed: 2.2 + (i % 4) * 0.4,
      wobblePhase: i * 0.8,
      alpha: 0.35 + (i % 4) * 0.15,
    })),
    celesteMotes: Array.from({ length: 20 }).map((_, i) => ({
      x: (i * 19 + 5) % 380,
      baseY: 35 + (i * 10) % 190,
      phase: i * 0.5,
      phaseSpeed: 0.03 + (i % 3) * 0.015,
      amp: 2.5 + (i % 3) * 1.5,
      size: (i % 4 === 0) ? 2 : 1.5,
      speedX: 0.25 + (i % 4) * 0.15,
    })),
    celesteWeather: Array.from({ length: 24 }).map((_, i) => ({
      x: (i * 16 + 7) % 380,
      y: (i * 12 + 3) % 260,
      vx: -(0.9 + (i % 3) * 0.4),
      vy: 0.8 + (i % 4) * 0.3,
      size: 1.5 + (i % 3) * 0.5,
      swayPhase: i * 0.6,
    })),
    cat: {
      x: 35,
      y: 158,
      w: 32,
      h: 26,
      vx: 0,
      vy: 0,
      isGrounded: true,
      frameCounter: 0,
      accessory: 'goggles',
      canAirCannon: true,
      coyoteFrames: 8,
    },
    // Calibrated starter platforms with 55px-58px gaps for rewarding athletic leaps
    platforms: [
      { x: 15, y: 198, baseY: 198, w: 130, h: 42, text: 'genesis.com', tld: '.com', color: '#ea580c', cracks: [] },
      { x: 200, y: 182, baseY: 182, w: 125, h: 42, text: 'zenith.ai', tld: '.ai', color: '#0284c7', cracks: generateCracks(125, 42) },
      { x: 382, y: 204, baseY: 204, w: 125, h: 42, text: 'lumina.io', tld: '.io', color: '#7c3aed', cracks: [] },
      { x: 565, y: 180, baseY: 180, w: 125, h: 42, text: 'hyper.co', tld: '.co', color: '#059669', cracks: generateCracks(125, 42), isFloating: true, floatAngle: 0, floatAmp: 14, floatSpeed: 0.04 },
      { x: 748, y: 198, baseY: 198, w: 125, h: 42, text: 'kroma.app', tld: '.app', color: '#d97706', cracks: [] },
    ],
    recentDomains: ['genesis', 'zenith', 'lumina', 'hyper', 'kroma'],
    powerups: [],
    particles: [],
    projectiles: [],
    enemies: [],
    boss: null,
    lastBossMilestone: 0,
    weapon: 'plasma',
    shootCooldown: 0,
    screenshake: 0,
    bubbleTimer: 0,
    bubbleText: '',
    speed: BASE_SPEED,
  })

  // Start manual countdown and reposition cat on the safe left part of current card
  const startManualCountdown = () => {
    const s = stateRef.current
    s.gameOver = false
    s.gameState = 'COUNTDOWN'
    s.countdown = 3
    s.countdownTimer = 60
    setGameOver(false)

    // Move cat to the left part of the platform with maximum runway ahead
    const curPlat = s.platforms.find((p) => s.cat.x + s.cat.w > p.x && s.cat.x < p.x + p.w) || s.platforms[0]
    if (curPlat) {
      s.cat.x = Math.max(25, curPlat.x + 14)
      s.cat.y = curPlat.y - s.cat.h
      s.cat.vy = 0
      s.cat.isGrounded = true
      s.cat.canAirCannon = true
      s.cat.coyoteFrames = 8
    }

    if (soundEnabledRef.current) playCountdownBeep(false)
  }

  const prevAutoModeRef = useRef(isAutoMode)
  useEffect(() => {
    const wasAuto = prevAutoModeRef.current
    prevAutoModeRef.current = isAutoMode
    stateRef.current.isAuto = isAutoMode

    if (wasAuto && !isAutoMode) {
      startManualCountdown()
    } else if (!wasAuto && isAutoMode) {
      stateRef.current.gameState = 'PLAYING'
    }
  }, [isAutoMode])

  useEffect(() => {
    stateRef.current.highScore = highScore
  }, [highScore])

  const executeJump = (fromUser = false) => {
    const s = stateRef.current

    if (s.gameState === 'GAMEOVER' || s.gameOver) {
      resetGame(true)
      return
    }

    if (fromUser && s.isAuto) {
      if (onToggleAutoMode) onToggleAutoMode(false)
      s.isAuto = false
      startManualCountdown()
      return
    }

    // Instant bypass countdown if user clicks/presses jump during countdown
    if (s.gameState === 'COUNTDOWN') {
      s.gameState = 'PLAYING'
      s.countdown = 0
      s.countdownTimer = 0
    }

    // 1. Primary Ground / Platform Jump (with Coyote Time support)
    if (s.cat.isGrounded || (s.cat.coyoteFrames && s.cat.coyoteFrames > 0)) {
      s.cat.vy = -7.4
      s.cat.isGrounded = false
      s.cat.coyoteFrames = 0
      s.jumpBuffer = 0

      if (soundEnabledRef.current) playPixelJump()

      // Jump ground launch dust
      for (let k = 0; k < 6; k++) {
        s.particles.push({
          x: s.cat.x + 8 + Math.random() * 16,
          y: s.cat.y + s.cat.h,
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * 1.5 + 0.5,
          color: '#e2e8f0',
          life: 14,
          size: 2.5,
        })
      }
      return
    }

    s.jumpBuffer = 10
  }

  const executeShoot = (fromUser = false) => {
    const s = stateRef.current
    if (s.gameState === 'GAMEOVER' || s.gameOver) {
      resetGame(true)
      return
    }

    if (fromUser && s.isAuto) {
      if (onToggleAutoMode) onToggleAutoMode(false)
      s.isAuto = false
      startManualCountdown()
      return
    }

    if (s.gameState === 'COUNTDOWN') {
      s.gameState = 'PLAYING'
      s.countdown = 0
      s.countdownTimer = 0
    }

    if (s.shootCooldown > 0) return
    s.shootCooldown = s.weapon === 'railgun' ? 14 : s.weapon === 'missile' ? 16 : 8

    const muzzleX = s.cat.x + s.cat.w + 2
    const muzzleY = s.cat.y + 11

    if (soundEnabledRef.current) playLaserShoot(s.weapon)

    // Gun recoil muzzle flash spark
    s.particles.push({
      x: muzzleX,
      y: muzzleY,
      vx: 1.5 + Math.random() * 2,
      vy: (Math.random() - 0.5) * 2,
      color: '#fbbf24',
      life: 8,
      size: 2.2,
    })

    if (s.weapon === 'spread') {
      ;[-1.5, 0, 1.5].forEach((angleVy) => {
        s.projectiles.push({
          x: muzzleX,
          y: muzzleY,
          vx: 6.8,
          vy: angleVy,
          damage: 1,
          color: '#c084fc',
          type: 'spread',
          life: 55,
          w: 8,
          h: 4,
        })
      })
    } else if (s.weapon === 'railgun') {
      s.projectiles.push({
        x: muzzleX,
        y: muzzleY,
        vx: 9.5,
        vy: 0,
        damage: 2,
        color: '#06b6d4',
        type: 'railgun',
        piercing: true,
        life: 45,
        w: 16,
        h: 3.5,
      })
    } else if (s.weapon === 'missile') {
      s.projectiles.push({
        x: muzzleX,
        y: muzzleY,
        vx: 5.6,
        vy: -0.5,
        damage: 3,
        color: '#f97316',
        type: 'missile',
        isMissile: true,
        life: 60,
        w: 10,
        h: 6,
      })
    } else {
      s.projectiles.push({
        x: muzzleX,
        y: muzzleY,
        vx: 7.4,
        vy: 0,
        damage: 1,
        color: '#f43f5e',
        type: 'plasma',
        life: 50,
        w: 7,
        h: 3.5,
      })
    }
  }

  const resetGame = (triggerCountdown = false) => {
    const s = stateRef.current
    s.gameOver = false
    s.score = 0
    s.speed = BASE_SPEED
    s.revives = 0
    s.lives = 1
    s.weapon = 'plasma'
    s.shootCooldown = 0
    s.projectiles = []
    s.enemies = []
    s.boss = null
    s.lastBossMilestone = 0
    s.screenshake = 0
    s.cannon = {
      active: false,
      phase: 'idle',
      x: 18,
      y: 246,
      targetY: 246,
      timer: 0,
      barrelAngle: -42,
      recoil: 0,
      catInside: false,
    }
    s.jumpBuffer = 0
    s.cat.x = 35
    s.cat.y = 158
    s.cat.vx = 0
    s.cat.vy = 0
    s.cat.isGrounded = true
    s.cat.canAirCannon = true
    s.cat.coyoteFrames = 8
    s.powerups = []
    s.particles = []
    s.bubbleTimer = 0
    s.bubbleText = ''
    s.recentDomains = ['genesis', 'zenith', 'lumina', 'hyper', 'kroma']

    s.platforms = [
      { x: 15, y: 198, baseY: 198, w: 130, h: 42, text: 'genesis.com', tld: '.com', color: '#ea580c', cracks: [] },
      { x: 200, y: 182, baseY: 182, w: 125, h: 42, text: 'zenith.ai', tld: '.ai', color: '#0284c7', cracks: generateCracks(125, 42) },
      { x: 382, y: 204, baseY: 204, w: 125, h: 42, text: 'lumina.io', tld: '.io', color: '#7c3aed', cracks: [] },
      { x: 565, y: 180, baseY: 180, w: 125, h: 42, text: 'hyper.co', tld: '.co', color: '#059669', cracks: generateCracks(125, 42), isFloating: true, floatAngle: 0, floatAmp: 14, floatSpeed: 0.04 },
      { x: 748, y: 198, baseY: 198, w: 125, h: 42, text: 'kroma.app', tld: '.app', color: '#d97706', cracks: [] },
    ]

    setGameOver(false)
    setScore(0)
    setRevives(0)
    setLives(1)

    if (triggerCountdown || !s.isAuto) {
      startManualCountdown()
    } else {
      s.gameState = 'PLAYING'
    }
  }

  const nextBiome = () => {
    stateRef.current.bgTimeMs = (Math.floor(stateRef.current.bgTimeMs / BIOME_DURATION_MS) + 1) * BIOME_DURATION_MS
    stateRef.current.currentBiome = Math.floor(stateRef.current.bgTimeMs / BIOME_DURATION_MS) % BIOMES.length
  }

  useImperativeHandle(ref, () => ({
    jump: () => executeJump(true),
    shoot: () => executeShoot(true),
    restart: () => resetGame(true),
    nextBiome: () => nextBiome(),
  }))

  const updateGame = () => {
    const s = stateRef.current
    if (s.gameState === 'GAMEOVER') return

    const cat = s.cat
    const gravity = 0.19
    const maxFallSpeed = 5.4

    s.speed = s.isAuto
      ? BASE_SPEED
      : Math.min(1.75, BASE_SPEED + Math.min(s.score, 100) * 0.0035)

    const activeBiome = BIOMES[Math.floor(s.bgTimeMs / BIOME_DURATION_MS) % BIOMES.length] || BIOMES[0]

    // Weather animations
    if (s.celesteWind) {
      for (let i = 0; i < s.celesteWind.length; i++) {
        const w = s.celesteWind[i]
        w.x -= w.speed
        w.wobblePhase += 0.04
        if (w.x + w.len < -20) {
          w.x = 380 + Math.random() * 40
          w.y = 15 + Math.random() * 180
          w.len = 6 + Math.random() * 14
          w.speed = 2.2 + Math.random() * 1.8
        }
      }
    }

    if (s.celesteMotes) {
      for (let i = 0; i < s.celesteMotes.length; i++) {
        const m = s.celesteMotes[i]
        m.x -= m.speedX
        m.phase += m.phaseSpeed
        if (m.x < -10) {
          m.x = 390
          m.baseY = 25 + Math.random() * 200
        }
      }
    }

    if (s.celesteWeather) {
      for (let i = 0; i < s.celesteWeather.length; i++) {
        const p = s.celesteWeather[i]
        if (activeBiome.weather === 'rain') {
          p.x -= 1.8
          p.y += 5.5
        } else if (activeBiome.weather === 'petals') {
          p.x += p.vx * 0.6 + Math.sin(p.swayPhase) * 0.7
          p.y += 0.75
        } else {
          p.x += p.vx + Math.sin(p.swayPhase) * 0.3
          p.y += p.vy
        }
        p.swayPhase += 0.05
        if (p.y > 280 || p.x < -20 || p.x > 400) {
          p.y = -10
          p.x = Math.random() * 410
        }
      }
    }

    if (s.gameState === 'COUNTDOWN') {
      s.countdownTimer--
      if (s.countdownTimer <= 0) {
        if (s.countdown > 1) {
          s.countdown--
          s.countdownTimer = 60
          if (soundEnabledRef.current) playCountdownBeep(false)
        } else if (s.countdown === 1) {
          s.countdown = 0
          s.countdownTimer = 45
          if (soundEnabledRef.current) playCountdownBeep(true)
        } else {
          s.gameState = 'PLAYING'
        }
      }
      cat.isGrounded = true
      cat.vy = 0
      const curPlat = s.platforms.find((p) => cat.x + cat.w > p.x && cat.x < p.x + p.w) || s.platforms[0]
      if (curPlat) {
        cat.x = Math.max(25, curPlat.x + 14)
        cat.y = curPlat.y - cat.h
      } else {
        cat.y = 158
      }
      cat.frameCounter++
      return
    }

    // Active Rescue Cannon State Machine (shoots from bottom only)
    if (s.cannon && s.cannon.active) {
      s.cannon.timer++
      if (s.cannon.phase === 'aim') {
        s.cannon.y = 246
        cat.x = s.cannon.x + 6
        cat.y = s.cannon.y - 6
        cat.vy = 0
        cat.vx = 0

        // Fuse spark puffs at back of cannon
        if (s.cannon.timer % 2 === 0) {
          s.particles.push({
            x: s.cannon.x + 5,
            y: s.cannon.y + 12,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -1.0 - Math.random() * 1.0,
            color: '#fbbf24',
            life: 10,
            size: 2,
          })
        }

        if (s.cannon.timer >= 12) {
          s.cannon.phase = 'fire'
          s.cannon.timer = 0
          s.cannon.recoil = 12
          if (soundEnabledRef.current) playCannonBlast()

          // Muzzle Blast Point
          const rad = ((s.cannon.barrelAngle || -45) * Math.PI) / 180
          const muzzleX = s.cannon.x + 20 + Math.cos(rad) * 24
          const muzzleY = s.cannon.y + 14 + Math.sin(rad) * 24

          // Muzzle Blast Explosive Fire & Smoke
          for (let k = 0; k < 32; k++) {
            const angle = (s.cannon.barrelAngle + (Math.random() - 0.5) * 45) * (Math.PI / 180)
            const spd = 4.5 + Math.random() * 8.0
            s.particles.push({
              x: muzzleX,
              y: muzzleY,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd,
              color: k % 4 === 0 ? '#fbbf24' : k % 4 === 1 ? '#f97316' : k % 4 === 2 ? '#ef4444' : '#ffffff',
              life: 25,
              size: 3.5 + Math.random() * 2.5,
            })
          }

          // High-Arc Parabolic Launch directly to comfortable left running zone
          const T = 30
          const startX = muzzleX
          const startY = muzzleY
          const targetPlat =
            s.cannon.targetPlatform && s.platforms.includes(s.cannon.targetPlatform)
              ? s.cannon.targetPlatform
              : s.platforms.find((p) => p.x + p.w > 40 && p.x < 130) || s.platforms[0]
          const destX = targetPlat
            ? Math.max(38, Math.min(68, targetPlat.x + 20))
            : 48
          const destY = targetPlat ? targetPlat.y - cat.h : 170

          cat.x = startX
          cat.y = startY
          cat.vx = (destX - startX) / T - s.speed
          cat.vy = (destY - startY) / T - (gravity * (T + 1)) / 2
          cat.isGrounded = false
          cat.inRescueFlight = true
          s.cannon.catInside = false
          s.gameState = 'PLAYING'
          s.bubbleText = s.lives > 0 ? `💥 CANNON BLAST! [❤️ x ${s.lives}]` : `💥 CANNON BLAST! [0 LIVES!]`
          s.bubbleTimer = 65
          setBubbleText(s.bubbleText)
        }
        return
      } else if (s.cannon.phase === 'fire') {
        if (s.cannon.recoil > 0) {
          s.cannon.recoil = Math.max(0, s.cannon.recoil - 0.8)
        }
        if (s.cannon.timer > 22) {
          s.cannon.phase = 'lower'
        }
      } else if (s.cannon.phase === 'lower') {
        s.cannon.y += 2.5
        if (s.cannon.y > 310) {
          s.cannon.active = false
        }
      }
    }

    // Move platforms & apply vertical oscillation
    for (let i = 0; i < s.platforms.length; i++) {
      const p = s.platforms[i]
      p.x -= s.speed
      if (p.isFloating) {
        p.floatAngle = (p.floatAngle || 0) + (p.floatSpeed || 0.04)
        p.y = p.baseY + Math.sin(p.floatAngle) * (p.floatAmp || 14)
      }
    }

    for (let i = 0; i < s.powerups.length; i++) {
      s.powerups[i].x -= s.speed
      s.powerups[i].bobAngle = (s.powerups[i].bobAngle || 0) + 0.04
    }

    if (s.platforms.length > 0 && s.platforms[0].x + s.platforms[0].w < -40) {
      s.platforms.shift()
    }

    if (s.platforms.length === 0) {
      s.platforms.push({
        x: 20,
        y: 200,
        baseY: 200,
        w: 130,
        h: 42,
        text: 'genesis.com',
        tld: '.com',
        color: '#ea580c',
        cracks: [],
      })
    }

    // Spawn new platforms with 50px to 74px gaps
    while (
      s.platforms.length > 0 &&
      s.platforms[s.platforms.length - 1].x + s.platforms[s.platforms.length - 1].w < 580
    ) {
      const prevP = s.platforms[s.platforms.length - 1]
      const currentRightmost = prevP.x + prevP.w
      const tierSteps = [-20, -12, 0, 12, 20]
      const step = tierSteps[Math.floor(Math.random() * tierSteps.length)]
      const targetBaseY = Math.max(158, Math.min(218, (prevP ? prevP.baseY : 190) + step))

      const gap = 50 + Math.random() * 24
      const spawnX = currentRightmost + gap

      if (!s.recentDomains) s.recentDomains = []
      const available = DOMAIN_PLATFORMS.filter((d) => !s.recentDomains.includes(d.name))
      const pool = available.length > 0 ? available : DOMAIN_PLATFORMS
      const item = pool[Math.floor(Math.random() * pool.length)]
      s.recentDomains.push(item.name)
      if (s.recentDomains.length > 15) s.recentDomains.shift()

      const width = 105 + Math.random() * 25
      const isFloating = Math.random() < 0.35
      const floatAmp = 12 + Math.random() * 6
      const floatSpeed = 0.035 + Math.random() * 0.02

      s.platforms.push({
        x: spawnX,
        y: targetBaseY,
        baseY: targetBaseY,
        w: width,
        h: 42,
        text: `${item.name}${item.tld}`,
        tld: item.tld,
        color: item.color,
        isFloating,
        floatAngle: Math.random() * Math.PI * 2,
        floatAmp,
        floatSpeed,
        cracks: generateCracks(width, 42),
      })

      // Floating Domain Extension Life Badge / Weapon Pickup (32% spawn rate)
      if (Math.random() < 0.32 && s.powerups.length < 2) {
        const pwr = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)]
        s.powerups.push({
          x: spawnX + width / 2 - 18,
          y: targetBaseY - 38,
          w: 36,
          h: 22,
          label: pwr.label,
          color: pwr.color,
          score: pwr.score,
          weapon: pwr.weapon,
          weaponName: pwr.weaponName,
          bobAngle: Math.random() * Math.PI,
        })
      }

      // 24% chance of 404 Glitch Bug crawling on platform (when no boss)
      if (!s.boss && Math.random() < 0.24 && s.enemies.length < 3) {
        s.enemies.push({
          type: 'glitch_bug',
          x: spawnX + width * 0.4,
          y: targetBaseY - 14,
          w: 16,
          h: 12,
          vx: 0.6,
          patrolLeft: spawnX + 8,
          patrolRight: spawnX + width - 18,
          hp: 1,
          maxHp: 1,
          frame: Math.random() * 20,
          hitFlash: 0,
        })
      }

      // 16% chance of Squatter Drone hovering in gap (when no boss)
      if (!s.boss && Math.random() < 0.16 && s.enemies.length < 3) {
        s.enemies.push({
          type: 'squatter_drone',
          x: spawnX - gap * 0.5,
          y: targetBaseY - 45 - Math.random() * 20,
          w: 18,
          h: 18,
          vx: 0,
          vy: 0,
          baseY: targetBaseY - 45,
          bobAngle: Math.random() * Math.PI * 2,
          hp: 2,
          maxHp: 2,
          frame: 0,
          hitFlash: 0,
        })
      }
    }

    // Weapon cooldown decrement
    if (s.shootCooldown > 0) s.shootCooldown--

    // Boss Encounter trigger every 200 score (at score 200, 400, 600...)
    if (s.score >= 200 && Math.floor(s.score / 200) > s.lastBossMilestone && !s.boss) {
      s.lastBossMilestone = Math.floor(s.score / 200)
      const bossHp = 16 + Math.min(24, s.lastBossMilestone * 4)
      s.boss = {
        active: true,
        name: 'MEGABYTE SQUATTER',
        x: 395,
        targetX: 285,
        y: 95,
        baseY: 95,
        w: 48,
        h: 44,
        hp: bossHp,
        maxHp: bossHp,
        floatAngle: 0,
        attackTimer: 0,
        phase: 'enter',
        hitFlash: 0,
        bullets: [],
        deathTimer: 0,
      }
      if (soundEnabledRef.current) playBossWarning()
      s.bubbleText = '⚠️ BOSS ALERT: MEGABYTE SQUATTER!'
      s.bubbleTimer = 90
      setBubbleText(s.bubbleText)
    }

    // Boss State Machine
    if (s.boss && s.boss.active) {
      const boss = s.boss
      if (boss.hitFlash > 0) boss.hitFlash--

      if (boss.phase === 'enter') {
        boss.x += (boss.targetX - boss.x) * 0.08
        if (Math.abs(boss.x - boss.targetX) < 4) {
          boss.phase = 'battle'
          boss.attackTimer = 0
        }
      } else if (boss.phase === 'battle') {
        boss.floatAngle += 0.04
        boss.y = boss.baseY + Math.sin(boss.floatAngle) * 20

        boss.attackTimer++
        if (boss.attackTimer >= 75) {
          boss.attackTimer = 0
          // Fire 404 Glitch Bullet towards player
          const dy = (cat.y + cat.h / 2) - (boss.y + 20)
          const dx = (cat.x + cat.w / 2) - (boss.x + 10)
          const angle = Math.atan2(dy, dx)
          boss.bullets.push({
            x: boss.x + 6,
            y: boss.y + 20,
            vx: Math.cos(angle) * 3.4,
            vy: Math.sin(angle) * 3.4,
            size: 6,
            life: 110,
          })
          if (soundEnabledRef.current) playLaserShoot('plasma')
        }
      } else if (boss.phase === 'death') {
        boss.deathTimer++
        s.screenshake = 4
        if (boss.deathTimer % 3 === 0) {
          for (let k = 0; k < 6; k++) {
            s.particles.push({
              x: boss.x + Math.random() * boss.w,
              y: boss.y + Math.random() * boss.h,
              vx: (Math.random() - 0.5) * 5,
              vy: (Math.random() - 0.5) * 5 - 1.5,
              color: ['#fbbf24', '#f97316', '#ef4444', '#06b6d4'][k % 4],
              life: 25,
              size: 3.5,
            })
          }
        }
        if (boss.deathTimer >= 35) {
          if (soundEnabledRef.current) playBossDefeated()
          s.score += 100
          setScore(s.score)
          // Guaranteed life badge drop!
          s.powerups.push({
            x: Math.min(220, boss.x - 30),
            y: 140,
            w: 36,
            h: 22,
            label: '.COM',
            color: '#ea580c',
            score: 100,
            weapon: null,
            bobAngle: 0,
          })
          s.bubbleText = '🏆 BOSS DESTROYED! +100 PTS!'
          s.bubbleTimer = 90
          setBubbleText(s.bubbleText)
          s.boss = null
          s.screenshake = 0
        }
      }

      // Update Boss Bullets
      if (boss && boss.bullets) {
        for (let i = boss.bullets.length - 1; i >= 0; i--) {
          const b = boss.bullets[i]
          b.x += b.vx
          b.y += b.vy
          b.life--
          if (b.x < -20 || b.y > 290 || b.life <= 0) {
            boss.bullets.splice(i, 1)
            continue
          }

          // Check collision with Cat
          if (
            !cat.inRescueFlight &&
            s.gameState === 'PLAYING' &&
            cat.x < b.x + b.size &&
            cat.x + cat.w > b.x - b.size &&
            cat.y < b.y + b.size &&
            cat.y + cat.h > b.y - b.size
          ) {
            boss.bullets.splice(i, 1)
            if (soundEnabledRef.current) playEnemyExplode()
            for (let k = 0; k < 10; k++) {
              s.particles.push({
                x: cat.x + cat.w / 2,
                y: cat.y + cat.h / 2,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                color: '#ef4444',
                life: 18,
                size: 3,
              })
            }
            if (s.lives > 0) {
              s.lives = Math.max(0, s.lives - 1)
              setLives(s.lives)
              s.bubbleText = s.lives > 0 ? `OUCH! ❤️ x ${s.lives}` : `WARNING! 0 LIVES!`
              s.bubbleTimer = 45
              setBubbleText(s.bubbleText)
            }
          }
        }
      }
    }

    // Update Enemies
    for (let i = s.enemies.length - 1; i >= 0; i--) {
      const en = s.enemies[i]
      if (en.hitFlash > 0) en.hitFlash--
      en.frame = (en.frame || 0) + 1

      if (en.type === 'glitch_bug') {
        en.x += en.vx - s.speed
        en.patrolLeft -= s.speed
        en.patrolRight -= s.speed
        if (en.x <= en.patrolLeft) {
          en.vx = Math.abs(en.vx)
        } else if (en.x >= en.patrolRight) {
          en.vx = -Math.abs(en.vx)
        }
      } else if (en.type === 'squatter_drone') {
        en.x -= s.speed
        en.bobAngle = (en.bobAngle || 0) + 0.05
        en.y = en.baseY + Math.sin(en.bobAngle) * 8
      }

      if (en.x < -30) {
        s.enemies.splice(i, 1)
        continue
      }

      // Cat touch collision with enemy
      if (
        !cat.inRescueFlight &&
        s.gameState === 'PLAYING' &&
        cat.x < en.x + en.w &&
        cat.x + cat.w > en.x &&
        cat.y < en.y + en.h &&
        cat.y + cat.h > en.y
      ) {
        // If cat landed on top of bug -> stomp defeat!
        if (cat.vy > 0 && cat.y + cat.h - cat.vy <= en.y + 6) {
          cat.vy = -6.5
          if (soundEnabledRef.current) playEnemyExplode()
          s.score += 20
          setScore(s.score)
          for (let k = 0; k < 12; k++) {
            s.particles.push({
              x: en.x + en.w / 2,
              y: en.y + en.h / 2,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              color: '#10b981',
              life: 18,
              size: 2.5,
            })
          }
          s.enemies.splice(i, 1)
          continue
        } else {
          // Side collision: take hit
          en.x -= 25
          if (soundEnabledRef.current) playEnemyExplode()
          if (s.lives > 0) {
            s.lives = Math.max(0, s.lives - 1)
            setLives(s.lives)
            s.bubbleText = s.lives > 0 ? `OUCH! ❤️ x ${s.lives}` : `0 LIVES LEFT!`
            s.bubbleTimer = 45
            setBubbleText(s.bubbleText)
          }
        }
      }
    }

    // Update Player Projectiles & Collisions
    for (let i = s.projectiles.length - 1; i >= 0; i--) {
      const p = s.projectiles[i]
      p.x += p.vx
      p.y += p.vy
      p.life--

      if (p.isMissile && p.life % 2 === 0) {
        s.particles.push({
          x: p.x - 2,
          y: p.y + p.h / 2,
          vx: -1.5,
          vy: (Math.random() - 0.5) * 0.8,
          color: '#cbd5e1',
          life: 10,
          size: 1.8,
        })
      }

      if (p.x > 390 || p.x < -10 || p.y < -10 || p.y > 290 || p.life <= 0) {
        s.projectiles.splice(i, 1)
        continue
      }

      let projHit = false

      // Hit Enemies
      for (let j = s.enemies.length - 1; j >= 0; j--) {
        const en = s.enemies[j]
        if (
          p.x < en.x + en.w &&
          p.x + p.w > en.x &&
          p.y < en.y + en.h &&
          p.y + p.h > en.y
        ) {
          en.hp -= p.damage
          en.hitFlash = 5
          if (en.hp <= 0) {
            if (soundEnabledRef.current) playEnemyExplode()
            s.score += en.type === 'squatter_drone' ? 30 : 15
            setScore(s.score)
            for (let k = 0; k < 14; k++) {
              s.particles.push({
                x: en.x + en.w / 2,
                y: en.y + en.h / 2,
                vx: (Math.random() - 0.5) * 4.5,
                vy: (Math.random() - 0.5) * 4.5,
                color: en.type === 'squatter_drone' ? '#38bdf8' : '#34d399',
                life: 20,
                size: 2.8,
              })
            }
            s.enemies.splice(j, 1)
          } else {
            if (soundEnabledRef.current) playBossHit()
          }
          if (!p.piercing) {
            projHit = true
            break
          }
        }
      }

      if (projHit) {
        s.projectiles.splice(i, 1)
        continue
      }

      // Hit Boss Bullets
      if (s.boss && s.boss.bullets) {
        for (let k = s.boss.bullets.length - 1; k >= 0; k--) {
          const bb = s.boss.bullets[k]
          if (
            p.x < bb.x + bb.size &&
            p.x + p.w > bb.x - bb.size &&
            p.y < bb.y + bb.size &&
            p.y + p.h > bb.y - bb.size
          ) {
            s.boss.bullets.splice(k, 1)
            if (soundEnabledRef.current) playBossHit()
            for (let m = 0; m < 6; m++) {
              s.particles.push({
                x: bb.x,
                y: bb.y,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                color: '#ef4444',
                life: 10,
                size: 2,
              })
            }
            if (!p.piercing) {
              projHit = true
              break
            }
          }
        }
      }

      if (projHit) {
        s.projectiles.splice(i, 1)
        continue
      }

      // Hit Boss
      if (s.boss && s.boss.active && s.boss.phase === 'battle') {
        const boss = s.boss
        if (
          p.x < boss.x + boss.w &&
          p.x + p.w > boss.x &&
          p.y < boss.y + boss.h &&
          p.y + p.h > boss.y
        ) {
          boss.hp -= p.damage
          boss.hitFlash = 5
          if (soundEnabledRef.current) playBossHit()
          for (let k = 0; k < 6; k++) {
            s.particles.push({
              x: p.x,
              y: p.y,
              vx: (Math.random() - 0.5) * 3,
              vy: (Math.random() - 0.5) * 3,
              color: '#fbbf24',
              life: 12,
              size: 2.2,
            })
          }
          if (boss.hp <= 0) {
            boss.phase = 'death'
            boss.deathTimer = 0
          }
          if (!p.piercing) {
            s.projectiles.splice(i, 1)
            continue
          }
        }
      }
    }

    // Auto-Pilot Auto-Shooting
    if (s.isAuto && s.shootCooldown <= 0) {
      const hasTargetInSight =
        (s.boss && s.boss.active && s.boss.phase === 'battle') ||
        s.enemies.some((en) => en.x > cat.x && en.x < cat.x + 230) ||
        (s.boss && s.boss.bullets && s.boss.bullets.some((b) => b.x > cat.x && b.x < cat.x + 130))
      if (hasTargetInSight) {
        executeShoot(false)
      }
    }

    // Cat Physics & Horizontal movement
    if (cat.vx) {
      cat.x += cat.vx
      if (!cat.inRescueFlight) {
        cat.vx *= 0.96
        if (Math.abs(cat.vx) < 0.05) cat.vx = 0
      }
    }

    cat.vy = Math.min(maxFallSpeed, cat.vy + gravity)
    cat.y += cat.vy
    cat.frameCounter++

    let groundedThisFrame = false
    for (let i = 0; i < s.platforms.length; i++) {
      const p = s.platforms[i]
      const catFeet = cat.y + cat.h
      const catPrevFeet = catFeet - cat.vy

      if (cat.x + cat.w - 4 > p.x && cat.x + 4 < p.x + p.w) {
        if (catFeet >= p.y - 2 && catPrevFeet <= p.y + 20 && cat.vy >= 0) {
          cat.y = p.y - cat.h
          cat.vy = 0
          cat.vx = 0
          cat.inRescueFlight = false
          groundedThisFrame = true
          break
        }
      }
    }
    cat.isGrounded = groundedThisFrame

    if (cat.isGrounded) {
      cat.canAirCannon = true
      cat.coyoteFrames = 8
      // Smoothly settle cat into the comfortable left runway zone (x ~ 35-50)
      if (cat.x > 55) {
        cat.x -= 0.35
      } else if (cat.x < 30) {
        cat.x += 0.2
      }
      const activePlat = s.platforms.find((p) => cat.x + cat.w > p.x && cat.x < p.x + p.w)
      if (activePlat && activePlat.isFloating) {
        cat.y = activePlat.y - cat.h
      }
    } else {
      if (cat.coyoteFrames > 0) cat.coyoteFrames--
    }

    // Hard horizontal bounds clamp
    cat.x = Math.max(15, Math.min(130, cat.x))

    if (s.jumpBuffer > 0) {
      if (cat.isGrounded || (cat.coyoteFrames && cat.coyoteFrames > 0)) {
        cat.vy = -7.4
        cat.isGrounded = false
        cat.coyoteFrames = 0
        s.jumpBuffer = 0
        if (soundEnabledRef.current) playPixelJump()
      } else {
        s.jumpBuffer--
      }
    }

    // Auto-Pilot AI: Infallible platform jumping & life powerup collection
    if (s.isAuto) {
      const curPlat = s.platforms.find((p) => cat.x + cat.w > p.x && cat.x < p.x + p.w)
      
      // Auto-hop to pick up floating domain extension lives
      if (cat.isGrounded && s.powerups.length > 0) {
        const upcomingPwr = s.powerups.find((pwr) => pwr.x > cat.x && pwr.x - cat.x < 75)
        if (upcomingPwr) {
          executeJump(false)
        }
      }

      // Auto-hop over gaps with calibrated edge lead time
      if (cat.isGrounded) {
        if (curPlat) {
          const distToEnd = (curPlat.x + curPlat.w) - (cat.x + cat.w)
          if (distToEnd <= 26) {
            executeJump(false)
          }
        } else {
          executeJump(false)
        }
      }
    }

    // Power-Up / Domain Extension Life Catching & Weapon Equipping
    for (let i = s.powerups.length - 1; i >= 0; i--) {
      const pwr = s.powerups[i]
      const currentY = pwr.y + Math.sin(pwr.bobAngle) * 4
      if (
        cat.x < pwr.x + pwr.w &&
        cat.x + cat.w > pwr.x &&
        cat.y < currentY + pwr.h &&
        cat.y + cat.h > currentY
      ) {
        s.score += pwr.score
        
        // Catching domain extensions acts as LIFE!
        s.lives = Math.min(5, (s.lives || 0) + 1)
        setLives(s.lives)

        // Equips specific weapon if available
        if (pwr.weapon) {
          s.weapon = pwr.weapon
        }

        // Equips specific accessory gear directly to Arabella the Cat
        const TLD_GEAR_MAP = {
          '.AI': 'vr_visor',
          '.COM': 'crown',
          '.IO': 'sunglasses',
          '.GG': 'viking_helmet',
          '.DEV': 'wizard_hat',
          '.APP': 'party_hat',
        }
        const newAcc = TLD_GEAR_MAP[pwr.label] || ACCESSORIES_LIST[Math.floor(Math.random() * ACCESSORIES_LIST.length)]
        cat.accessory = newAcc
        s.cat.accessory = newAcc

        s.bubbleText = pwr.weaponName
          ? `+1 LIFE! ❤️ [${pwr.label}] ${pwr.weaponName}!`
          : `+1 LIFE! ❤️ [${pwr.label}] ${ACCESSORY_NAMES[newAcc] || 'NEW GEAR!'}`
        s.bubbleTimer = 85
        setBubbleText(s.bubbleText)
        setScore(s.score)

        if (s.score > 0) {
          const scoreM = Math.floor(s.score / 500)
          if (scoreM > lastScoreMilestoneRef.current) {
            lastScoreMilestoneRef.current = scoreM
            if (onMilestone) onMilestone(s.score)
          }
        }
        if (s.score > s.highScore) {
          s.highScore = s.score
          setHighScore(s.highScore)
          try {
            localStorage.setItem('ng_tamagotchi_highscore', s.score.toString())
          } catch (_) {}
          const highM = Math.floor(s.highScore / 500)
          if (highM > lastHighMilestoneRef.current) {
            lastHighMilestoneRef.current = highM
            if (onMilestone) onMilestone(s.highScore)
          }
        }

        if (soundEnabledRef.current) playPowerupChime()

        // Heart & Sparkle Burst Particles
        for (let k = 0; k < 14; k++) {
          s.particles.push({
            x: pwr.x + pwr.w / 2,
            y: currentY + pwr.h / 2,
            vx: (Math.random() - 0.5) * 4.5,
            vy: (Math.random() - 0.5) * 4.5 - 1.2,
            color: k % 2 === 0 ? '#f43f5e' : pwr.color,
            life: 25,
            size: 3,
          })
        }

        s.powerups.splice(i, 1)
      }
    }

    // Falling Down -> Cannon Rescue Sequence or Game Over
    if (cat.y > 230 && !cat.inRescueFlight) {
      if (s.gameState !== 'CANNON_RESCUE' && ((s.lives && s.lives > 0) || s.isAuto)) {
        s.gameState = 'CANNON_RESCUE'
        if (s.isAuto) {
          s.lives = Math.max(1, s.lives || 1)
        } else {
          s.lives = Math.max(0, (s.lives || 1) - 1)
        }
        setLives(s.lives)

        // Find safe platform closest to the comfortable front-left runway zone
        const safePlat =
          s.platforms.find((p) => p.x + p.w > 40 && p.x < 130) ||
          s.platforms.find((p) => p.x >= 0 && p.x < 180) ||
          s.platforms[0] ||
          { x: 20, y: 195, w: 120 }
        const cannonX = 20
        const targetX = Math.max(38, Math.min(68, safePlat ? safePlat.x + 20 : 48))
        const targetY = safePlat ? safePlat.y - cat.h : 170
        const dx = targetX - (cannonX + 20)
        const dy = targetY - 260
        const angleDeg = Math.max(-75, Math.min(-35, Math.atan2(dy, dx) * (180 / Math.PI)))

        s.cannon = {
          active: true,
          phase: 'aim',
          x: cannonX,
          y: 246,
          targetY: 246,
          timer: 0,
          barrelAngle: angleDeg,
          recoil: 0,
          catInside: true,
          targetPlatform: safePlat,
          targetX,
          targetY,
        }
        cat.x = cannonX + 6
        cat.y = 246
        cat.vy = 0
        cat.vx = 0
        cat.inRescueFlight = false
      } else if (!s.isAuto && (!s.lives || s.lives <= 0) && cat.y > 260 && s.gameState !== 'CANNON_RESCUE' && (!s.cannon || !s.cannon.active)) {
        s.gameState = 'GAMEOVER'
        s.gameOver = true
        setGameOver(true)
        if (soundEnabledRef.current) playGameOver()
      }
    }

    // Particles
    for (let i = s.particles.length - 1; i >= 0; i--) {
      const pt = s.particles[i]
      pt.x += pt.vx
      pt.y += pt.vy
      pt.life--
      if (pt.life <= 0) s.particles.splice(i, 1)
    }

    // Distance score increments
    if (cat.isGrounded && cat.frameCounter % 28 === 0) {
      s.score += 1
      setScore(s.score)

      if (s.score > 0) {
        const scoreM = Math.floor(s.score / 500)
        if (scoreM > lastScoreMilestoneRef.current) {
          lastScoreMilestoneRef.current = scoreM
          if (onMilestone) onMilestone(s.score)
        }
      }

      if (s.score > s.highScore) {
        s.highScore = s.score
        setHighScore(s.highScore)
        try {
          localStorage.setItem('ng_tamagotchi_highscore', s.score.toString())
        } catch (_) {}

        const highM = Math.floor(s.highScore / 500)
        if (highM > lastHighMilestoneRef.current) {
          lastHighMilestoneRef.current = highM
          if (onMilestone) onMilestone(s.highScore)
        }
      }
    }

    if (s.bubbleTimer > 0) {
      s.bubbleTimer--
      if (s.bubbleTimer === 0) setBubbleText('')
    }
  }

  const renderGame = (ctx) => {
    const s = stateRef.current
    const w = 380
    const h = 280

    // Exact 15.000s real-world time per biome cycle (independent of 60Hz/120Hz/144Hz screen refresh rate)
    const currentBiomeIdx = Math.floor(s.bgTimeMs / BIOME_DURATION_MS) % BIOMES.length
    const nextBiomeIdx = (currentBiomeIdx + 1) % BIOMES.length
    const elapsedInBiome = s.bgTimeMs % BIOME_DURATION_MS

    ctx.imageSmoothingEnabled = false

    const b = BIOMES[currentBiomeIdx] || BIOMES[0]
    const nextB = BIOMES[nextBiomeIdx] || BIOMES[0]

    const [r, g, bl] = b.skyTop || [96, 165, 250]
    ctx.fillStyle = `rgb(${r},${g},${bl})`
    ctx.fillRect(0, 0, w, h)

    const currentImg = BIOME_IMAGES[currentBiomeIdx]
    const nextImg = BIOME_IMAGES[nextBiomeIdx]

    // Complete panoramic right-to-left move takes exactly 13.5 real seconds.
    // The image starts touching left edge at x = 0 and pans across its full width,
    // reaching the far right edge at 13.5 seconds.
    // From 13.5s to 15.0s (the final 1.5 seconds), the smooth crossfade transition into the next biome occurs.
    if (currentImg && currentImg.complete && currentImg.naturalWidth && currentImg.naturalHeight) {
      const scaleA = h / currentImg.naturalHeight
      const scaledW_A = Math.round(currentImg.naturalWidth * scaleA)
      const maxScrollA = Math.max(0, scaledW_A - w)
      
      // Pan smoothly from 0% to 100% of the panorama over 0.0s -> 13.5s
      const panProgress = Math.min(1.0, elapsedInBiome / PAN_DURATION_MS)
      const xA = -Math.round(panProgress * maxScrollA)
      ctx.drawImage(currentImg, xA, 0, scaledW_A, h)

      // Smooth seamless crossfade transition starts at 13.5s and completes at 15.0s
      if (elapsedInBiome > PAN_DURATION_MS && nextImg && nextImg.complete && nextImg.naturalWidth && nextImg.naturalHeight) {
        const blendAlpha = (elapsedInBiome - PAN_DURATION_MS) / TRANSITION_DURATION_MS
        const scaleB = h / nextImg.naturalHeight
        const scaledW_B = Math.round(nextImg.naturalWidth * scaleB)
        ctx.save()
        ctx.globalAlpha = blendAlpha
        // Next biome starts cleanly at x = 0 (left edge)
        ctx.drawImage(nextImg, 0, 0, scaledW_B, h)
        ctx.restore()
      }
    } else if (nextImg && nextImg.complete && nextImg.naturalWidth) {
      const scaleB = h / nextImg.naturalHeight
      const scaledW_B = Math.round(nextImg.naturalWidth * scaleB)
      ctx.drawImage(nextImg, 0, 0, scaledW_B, h)
    }

    // Sky Animations: Birds
    if (b.hasBirds !== false) {
      const birdPhase = s.cat.frameCounter * 0.07
      const birds = [
        { x: ((w + 100) - ((s.cat.frameCounter * 0.7 + 40) % (w + 140))), y: 36, size: 2.2, phase: birdPhase },
        { x: ((w + 160) - ((s.cat.frameCounter * 0.6 + 180) % (w + 180))), y: 24, size: 1.8, phase: birdPhase + 1.4 },
        { x: ((w + 140) - ((s.cat.frameCounter * 0.8 + 300) % (w + 200))), y: 46, size: 1.5, phase: birdPhase + 2.6 },
      ]
      ctx.strokeStyle = (b.id === 'city-evening' || b.id === 'mountain') ? 'rgba(255, 255, 255, 0.75)' : 'rgba(15, 23, 42, 0.65)'
      ctx.lineWidth = 1.2
      for (let i = 0; i < birds.length; i++) {
        const bd = birds[i]
        if (bd.x >= -20 && bd.x <= w + 20) {
          const flap = Math.sin(bd.phase) * (bd.size * 0.9)
          ctx.beginPath()
          ctx.moveTo(bd.x - bd.size * 2, bd.y - flap)
          ctx.lineTo(bd.x, bd.y)
          ctx.lineTo(bd.x + bd.size * 2, bd.y - flap)
          ctx.stroke()
        }
      }
    }

    // Wind
    if (s.celesteWind) {
      ctx.fillStyle = b.windColor || 'rgba(255, 255, 255, 0.65)'
      for (let i = 0; i < s.celesteWind.length; i++) {
        const wnd = s.celesteWind[i]
        const wy = Math.round(wnd.y + Math.sin(wnd.wobblePhase) * 1.8)
        ctx.fillRect(Math.round(wnd.x), wy, Math.round(wnd.len), 1.5)
      }
    }

    // Motes
    if (s.celesteMotes) {
      ctx.fillStyle = b.moteColor || 'rgba(255, 255, 255, 0.85)'
      for (let i = 0; i < s.celesteMotes.length; i++) {
        const m = s.celesteMotes[i]
        const my = Math.round(m.baseY + Math.sin(m.phase) * m.amp)
        ctx.fillRect(Math.round(m.x), my, m.size, m.size)
      }
    }

    // Weather
    if (s.celesteWeather) {
      if (b.weather === 'rain') {
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.7)'
        ctx.lineWidth = 1.2
        for (let i = 0; i < s.celesteWeather.length; i++) {
          const pt = s.celesteWeather[i]
          ctx.beginPath()
          ctx.moveTo(Math.round(pt.x), Math.round(pt.y))
          ctx.lineTo(Math.round(pt.x - 3), Math.round(pt.y + 7))
          ctx.stroke()
        }
      } else if (b.weather === 'petals') {
        for (let i = 0; i < s.celesteWeather.length; i++) {
          const pt = s.celesteWeather[i]
          ctx.fillStyle = (i % 2 === 0) ? '#f472b6' : '#fbcfe8'
          ctx.fillRect(Math.round(pt.x), Math.round(pt.y), 2.5, 2)
        }
      } else if (b.weather === 'snow') {
        ctx.fillStyle = '#ffffff'
        for (let i = 0; i < s.celesteWeather.length; i++) {
          const pt = s.celesteWeather[i]
          ctx.fillRect(Math.round(pt.x), Math.round(pt.y), pt.size, pt.size)
        }
      } else if (b.weather === 'leaves') {
        for (let i = 0; i < s.celesteWeather.length; i++) {
          const pt = s.celesteWeather[i]
          ctx.fillStyle = (i % 3 === 0) ? '#ea580c' : (i % 3 === 1) ? '#f59e0b' : '#b45309'
          ctx.fillRect(Math.round(pt.x), Math.round(pt.y), 2.5, 2.5)
        }
      } else if (b.weather === 'spores') {
        for (let i = 0; i < s.celesteWeather.length; i++) {
          const pt = s.celesteWeather[i]
          ctx.fillStyle = (i % 2 === 0) ? '#ec4899' : '#34d399'
          ctx.fillRect(Math.round(pt.x), Math.round(pt.y), 2, 2)
        }
      }
    }

    // Platforms
    for (let i = 0; i < s.platforms.length; i++) {
      drawThemedDomainCard(ctx, s.platforms[i], currentBiomeIdx, s.platforms[i].isFloating)
    }

    // Enemies (404 Glitch Bugs & Squatter Drones)
    if (s.enemies && s.enemies.length > 0) {
      for (let i = 0; i < s.enemies.length; i++) {
        const en = s.enemies[i]
        if (en.type === 'glitch_bug') {
          renderGlitchBug(ctx, en)
        } else if (en.type === 'squatter_drone') {
          renderSquatterDrone(ctx, en)
        }
      }
    }

    // Epic Boss Mech
    if (s.boss && s.boss.active) {
      renderBossMech(ctx, s.boss)
    }

    // Floating Gear & Weapon Badges
    for (let i = 0; i < s.powerups.length; i++) {
      const pwr = s.powerups[i]
      const curY = pwr.y + Math.sin(pwr.bobAngle) * 4

      // Glowing Badge Pill
      ctx.fillStyle = pwr.color
      roundRect(ctx, pwr.x - 2, curY, 28, 16, 4)
      ctx.fill()
      ctx.strokeStyle = '#0f172a'
      ctx.lineWidth = 1.2
      ctx.stroke()

      // Glint highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
      roundRect(ctx, pwr.x - 1, curY + 1, 26, 6, 2)
      ctx.fill()

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 9.5px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(pwr.label, pwr.x + 12, curY + 8.5)
    }

    // Player Blaster Laser & Missile Projectiles
    if (s.projectiles && s.projectiles.length > 0) {
      renderProjectiles(ctx, s.projectiles)
    }

    // Sparkle & Blast Particles
    for (let i = 0; i < s.particles.length; i++) {
      const pt = s.particles[i]
      ctx.fillStyle = pt.color || '#facc15'
      const size = pt.size || 2.5
      ctx.fillRect(pt.x, pt.y, size, size)
    }

    // Handcrafted Rescue Cannon
    if (s.cannon && s.cannon.active) {
      renderRescueCannon(ctx, s.cannon)
    }

    // Arabella the Cat (render only if not hidden inside cannon)
    if (!s.cannon || !s.cannon.active || !s.cannon.catInside) {
      renderCatSprite(
        ctx,
        s.cat.x,
        s.cat.y,
        s.cat.isGrounded,
        s.cat.vy,
        s.cat.frameCounter,
        s.gameState === 'GAMEOVER',
        s.cat.accessory
      )
    }

    // Dust puffs
    if (s.cat.isGrounded && s.gameState === 'PLAYING' && s.cat.frameCounter % 10 === 0) {
      s.particles.push({
        type: 'dust',
        x: s.cat.x - 4,
        y: s.cat.y + 20,
        vx: -0.5 - Math.random() * 0.3,
        vy: -0.2 - Math.random() * 0.2,
        color: 'rgba(255, 255, 255, 0.65)',
        life: 14,
        size: 2.2,
      })
    }

    // Clean HUD Bar
    ctx.fillStyle = '#090d16'
    ctx.fillRect(0, 0, w, 26)
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, 26.5)
    ctx.lineTo(w, 26.5)
    ctx.stroke()

    // 1. High Score
    ctx.fillStyle = '#38bdf8'
    ctx.font = 'bold 10px "JetBrains Mono", monospace'
    ctx.textAlign = 'start'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText(`★ HI:${s.highScore}`, 7, 17)

    // 2. Current Score
    ctx.fillStyle = '#facc15'
    ctx.font = 'bold 10.5px "JetBrains Mono", monospace'
    ctx.fillText(`SCORE:${s.score}`, 80, 17)

    // 3. Lives Counter
    const curLives = Math.max(0, s.lives ?? 1)
    ctx.fillStyle = curLives > 1 ? '#f43f5e' : curLives === 1 ? '#fb923c' : '#94a3b8'
    ctx.font = 'bold 10px "JetBrains Mono", monospace'
    ctx.fillText(`❤️x${curLives}`, 164, 17)

    // 4. Equipped Weapon Indicator
    const weaponBadge =
      s.weapon === 'railgun'
        ? '⚡.AI'
        : s.weapon === 'spread'
        ? '💥.IO'
        : s.weapon === 'missile'
        ? '🚀.GG'
        : '🔫PEW'
    const weaponCol =
      s.weapon === 'railgun'
        ? '#06b6d4'
        : s.weapon === 'spread'
        ? '#c084fc'
        : s.weapon === 'missile'
        ? '#f97316'
        : '#94a3b8'
    ctx.fillStyle = weaponCol
    ctx.font = 'bold 9.5px "JetBrains Mono", monospace'
    ctx.fillText(`${weaponBadge}`, 214, 17)

    // 5. Biome Badge
    ctx.fillStyle = '#a78bfa'
    ctx.font = 'bold 9.5px "JetBrains Mono", monospace'
    ctx.textAlign = 'end'
    ctx.fillText(`${b.badgeText || 'BIOME'}`, w - 8, 17)
    ctx.textAlign = 'start'

    // Boss Health Bar HUD
    if (s.boss && s.boss.active && s.boss.hp > 0) {
      renderBossHud(ctx, s.boss, w)
    }

    // Speech bubble
    if (s.bubbleText && s.bubbleTimer > 0) {
      ctx.save()
      const bx = Math.min(w - 150, Math.max(10, s.cat.x + 24))
      const by = Math.max(32, s.cat.y - 20)
      ctx.fillStyle = '#ffffff'
      roundRect(ctx, bx, by, 140, 22, 6)
      ctx.fill()
      ctx.strokeStyle = '#0f172a'
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.moveTo(bx - 4, by + 13)
      ctx.lineTo(bx + 3, by + 10)
      ctx.lineTo(bx + 3, by + 16)
      ctx.fill()

      ctx.fillStyle = '#0f172a'
      ctx.font = 'bold 9.5px "JetBrains Mono", monospace'
      ctx.textAlign = 'start'
      ctx.textBaseline = 'alphabetic'
      ctx.fillText(s.bubbleText, bx + 6, by + 15)
      ctx.restore()
    }

    // Countdown Overlay (Manual mode)
    if (s.gameState === 'COUNTDOWN') {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.65)'
      ctx.fillRect(0, 0, w, h)

      const label = s.countdown === 0 ? 'GO!' : s.countdown.toString()
      const boxW = 140
      const boxH = 80
      const boxX = (w - boxW) / 2
      const boxY = (h - boxH) / 2

      ctx.fillStyle = '#090d16'
      roundRect(ctx, boxX, boxY, boxW, boxH, 12)
      ctx.fill()
      ctx.strokeStyle = s.countdown === 0 ? '#10b981' : '#f59e0b'
      ctx.lineWidth = 2.5
      ctx.stroke()

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = s.countdown === 0 ? '#10b981' : '#f59e0b'
      ctx.font = '800 36px "JetBrains Mono", monospace'
      ctx.fillText(label, w / 2, boxY + 32)

      ctx.fillStyle = '#94a3b8'
      ctx.font = '600 10.5px "JetBrains Mono", monospace'
      ctx.fillText(s.countdown === 0 ? 'HOP TO IT!' : 'MANUAL READY', w / 2, boxY + 62)
      ctx.textAlign = 'start'
      ctx.textBaseline = 'alphabetic'
    }

    // Game Over Overlay
    if (s.gameState === 'GAMEOVER') {
      ctx.fillStyle = 'rgba(3, 7, 18, 0.88)'
      ctx.fillRect(0, 0, w, h)

      const boxW = 260
      const boxX = (w - boxW) / 2
      ctx.fillStyle = '#0f172a'
      roundRect(ctx, boxX, 38, boxW, 204, 14)
      ctx.fill()
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 2.5
      ctx.stroke()

      ctx.fillStyle = '#ef4444'
      ctx.font = '800 16px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'alphabetic'
      ctx.fillText('● GAME OVER ●', w / 2, 68)

      // Clean neatly aligned stats rows
      ctx.font = '700 11px "JetBrains Mono", monospace'

      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'start'
      ctx.fillText('DOMAINS HOPPED:', boxX + 16, 98)
      ctx.textAlign = 'end'
      ctx.fillText(`${s.score}`, boxX + boxW - 16, 98)

      ctx.fillStyle = '#38bdf8'
      ctx.textAlign = 'start'
      ctx.fillText('ALL-TIME BEST:', boxX + 16, 120)
      ctx.textAlign = 'end'
      ctx.fillText(`${s.highScore}`, boxX + boxW - 16, 120)

      const biomeObj = BIOMES[s.currentBiome % BIOMES.length] || BIOMES[0]
      ctx.fillStyle = '#a78bfa'
      ctx.textAlign = 'start'
      ctx.fillText('BIOME REACHED:', boxX + 16, 142)
      ctx.textAlign = 'end'
      ctx.fillText(`${biomeObj.badgeText || biomeObj.name}`, boxX + boxW - 16, 142)

      ctx.fillStyle = '#0284c7'
      roundRect(ctx, w / 2 - 80, 162, 160, 30, 8)
      ctx.fill()
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.fillStyle = '#ffffff'
      ctx.font = '700 12px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('↻ RETRY RUN', w / 2, 177)

      ctx.fillStyle = '#94a3b8'
      ctx.font = '500 9.5px "JetBrains Mono", monospace'
      ctx.fillText('CLICK SCREEN OR [RETRY] KEY', w / 2, 218)
      ctx.textAlign = 'start'
      ctx.textBaseline = 'alphabetic'
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    let animationId = null

    resetGame()

    let lastTime = performance.now()
    let physicsAccumulator = 0
    const FIXED_STEP_MS = 1000 / 60 // 16.666ms per physics step

    const loop = (currentTime) => {
      animationId = requestAnimationFrame(loop)
      if (!lastTime) lastTime = currentTime
      let delta = currentTime - lastTime
      lastTime = currentTime

      // Clamp delta to prevent time-skips when tab is inactive
      if (delta > 200) delta = 200
      if (delta < 0) delta = 0

      // Exact real-world millisecond timing for biomes (immune to 120Hz/144Hz/240Hz monitor rate)
      stateRef.current.bgTimeMs =
        (stateRef.current.bgTimeMs + delta) % (BIOME_DURATION_MS * BIOMES.length)
      stateRef.current.currentBiome =
        Math.floor(stateRef.current.bgTimeMs / BIOME_DURATION_MS) % BIOMES.length

      // Fixed 60Hz physics accumulator
      physicsAccumulator += delta
      let steps = 0
      while (physicsAccumulator >= FIXED_STEP_MS && steps < 4) {
        updateGame()
        physicsAccumulator -= FIXED_STEP_MS
        steps++
      }

      try {
        renderGame(ctx)
      } catch (err) {
        console.error('Game render error:', err)
      }
    }

    const handleKeyDown = (e) => {
      if (
        e.code === 'Space' ||
        e.code === 'ArrowUp' ||
        e.code === 'KeyW'
      ) {
        // Prevent page scroll when jumping
        if (e.code === 'Space' || e.code === 'ArrowUp') {
          e.preventDefault()
        }
        executeJump(true)
      } else if (
        e.code === 'KeyF' ||
        e.code === 'KeyX' ||
        e.code === 'KeyJ' ||
        e.code === 'KeyZ' ||
        e.code === 'Enter' ||
        e.code === 'ShiftLeft' ||
        e.code === 'ShiftRight'
      ) {
        executeShoot(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    animationId = requestAnimationFrame(loop)
    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div
      onPointerDown={(e) => {
        e.preventDefault()
        executeJump(true)
      }}
      className="relative w-full overflow-hidden rounded-xl border border-slate-700 shadow-inner cursor-pointer select-none group"
      title="Click anywhere to jump or switch to manual! (1-click mouse control)"
    >
      <canvas
        ref={canvasRef}
        width={380}
        height={280}
        className="w-full h-auto block object-contain"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-black/[0.03] to-transparent bg-[length:100%_4px]" />
    </div>
  )
})

export default DomainGameEngine
