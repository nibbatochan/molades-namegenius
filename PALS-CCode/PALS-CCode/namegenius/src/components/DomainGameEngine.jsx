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
  playVictoryFanfare,
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

const GUN_TYPES = [
  { label: '.AI', color: '#06b6d4', score: 0, weapon: 'railgun', weaponName: 'CYBER RAILGUN', icon: '⚡' },
  { label: '.IO', color: '#c084fc', score: 0, weapon: 'spread', weaponName: 'TRIPLE SPREAD', icon: '💥' },
  { label: '.GG', color: '#f97316', score: 0, weapon: 'missile', weaponName: 'MICRO-MISSILE', icon: '🚀' },
]

const DOMAIN_LIFE_TYPES = [
  { label: '.COM', color: '#ea580c', score: 0, accessory: 'crown' },
  { label: '.AI', color: '#0284c7', score: 0, accessory: 'vr_visor' },
  { label: '.IO', color: '#7c3aed', score: 0, accessory: 'sunglasses' },
  { label: '.CO', color: '#059669', score: 0, accessory: 'viking_helmet' },
  { label: '.APP', color: '#d97706', score: 0, accessory: 'party_hat' },
  { label: '.DEV', color: '#4f46e5', score: 0, accessory: 'wizard_hat' },
  { label: '.XYZ', color: '#db2777', score: 0, accessory: 'flower' },
  { label: '.GG', color: '#e11d48', score: 0, accessory: 'pirate_hat' },
  { label: '.TECH', color: '#06b6d4', score: 0, accessory: 'goggles' },
  { label: '.SPACE', color: '#8b5cf6', score: 0, accessory: 'halo' },
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

// Handcrafted Feline Walkcycle Sprite with 12 Accessories & Damage I-Frames
function renderCatSprite(ctx, x, y, isGrounded, vy, frameCounter, isDead, accessory = null, hitFlash = 0) {
  ctx.save()
  ctx.translate(Math.round(x), Math.round(y))

  // I-Frames flash effect when damaged
  if (hitFlash > 0 && Math.floor(hitFlash / 3) % 2 === 1) {
    ctx.globalAlpha = 0.4
  }

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

  // 0. Subtle Fading Motion Trail Behind Domain Platform Card
  ctx.save()
  const trailW = 24
  const trailGrad = ctx.createLinearGradient(x + w, y, x + w + trailW, y)
  trailGrad.addColorStop(0, p.color || b.accentColor || 'rgba(56, 189, 248, 0.45)')
  trailGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = trailGrad
  ctx.globalAlpha = 0.32 + Math.sin((p.floatAngle || 0) * 2) * 0.08
  roundRect(ctx, x + w - 4, y + 4, trailW, h - 8, 4)
  ctx.fill()

  // Fine fading pixel speed streaks
  ctx.fillStyle = b.cardAccent || p.color || '#38bdf8'
  ctx.globalAlpha = 0.26
  ctx.fillRect(x + w, y + 7, 14, 1.5)
  ctx.fillRect(x + w + 4, y + 17, 16, 1.5)
  ctx.fillRect(x + w + 1, y + 27, 11, 1.5)
  ctx.restore()

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

// ============================================================================
// AUTHENTIC 16-BIT RETRO PIXEL ART CLASSIC COMMON MOBS
// ============================================================================

// 1. 404 Glitch Bug Sprite (Industrial Slate Chassis, 404 Stencil, Gold Rotor, Cyclops Optic)
function renderGlitchBug(ctx, drone, customAction = null, customFrame = null) {
  ctx.save()
  const frame = customFrame !== null ? customFrame : (drone.frame || 0)
  const isAttack =
    customAction === 'attack' ||
    drone.actionState === 'attack' ||
    (drone.laserTimer && drone.laserTimer > 0)

  const cycleFrame = Math.floor(frame / 6) % 4
  let bobY = 0
  if (!isAttack) {
    bobY = cycleFrame === 1 ? 2 : cycleFrame === 2 ? -2 : 0
  }

  ctx.translate(Math.round(drone.x || 0), Math.round((drone.y || 0) + bobY))

  if (drone.hitFlash > 0) {
    ctx.fillStyle = '#ffffff'
    roundRect(ctx, 0, 0, drone.w || 26, drone.h || 24, 5)
    ctx.fill()
    ctx.restore()
    return
  }

  const w = drone.w || 26
  const h = drone.h || 24
  const centerX = w / 2
  const isFacingLeft = (drone.vx || -1) < 0

  // 1. Top Propeller: Golden-Yellow Halo Ring Rotor
  const rAng = isAttack ? frame * 0.4 : cycleFrame * (Math.PI / 2) + frame * 0.18
  const rSpan = Math.cos(rAng) * 14
  const rThick = Math.abs(Math.sin(rAng)) * 2 + 2

  ctx.fillStyle = '#1e293b'
  ctx.fillRect(centerX - 1, -4, 2, 5)
  ctx.fillStyle = '#64748b'
  ctx.fillRect(centerX - 0.5, -4, 1, 2)

  ctx.strokeStyle = '#eab308'
  ctx.lineWidth = rThick
  ctx.beginPath()
  ctx.ellipse(centerX, -4.5, 14, 3, 0, 0, Math.PI * 2)
  ctx.stroke()

  ctx.strokeStyle = '#fef08a'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.ellipse(centerX, -4.5, 13, 2, 0, 0, Math.PI * 2)
  ctx.stroke()

  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(centerX - rSpan, -4.5)
  ctx.lineTo(centerX + rSpan, -4.5)
  ctx.stroke()

  ctx.fillStyle = '#ca8a04'
  ctx.fillRect(centerX - 1.5, -6, 3, 3)

  // 2. Rear Turbine Exhaust
  ctx.fillStyle = '#1e293b'
  roundRect(ctx, 0, 5, 5, 12, 2)
  ctx.fill()
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.fillStyle = '#475569'
  ctx.fillRect(1, 7, 3, 8)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0.5, 9, 2, 4)

  // 3. Bottom Dual Landing Skids
  ctx.fillStyle = '#334155'
  ctx.fillRect(4, h - 3, 4, 3)
  ctx.fillRect(w - 7, h - 3, 4, 3)
  ctx.fillStyle = '#0f172a'
  roundRect(ctx, 3, h - 1.5, 7, 2, 1)
  ctx.fill()
  roundRect(ctx, w - 8, h - 1.5, 7, 2, 1)
  ctx.fill()

  // 4. Main Boxy Industrial Chassis
  const grad = ctx.createLinearGradient(centerX, 0, centerX, h)
  grad.addColorStop(0, '#475569')
  grad.addColorStop(0.3, '#334155')
  grad.addColorStop(0.7, '#1e293b')
  grad.addColorStop(1, '#0f172a')
  ctx.fillStyle = grad
  roundRect(ctx, 4, 1, w - 6, h - 4, 5)
  ctx.fill()
  ctx.strokeStyle = '#020617'
  ctx.lineWidth = 1.3
  ctx.stroke()

  ctx.fillStyle = '#64748b'
  ctx.fillRect(centerX - 5, 2, 10, 1.6)

  // 5. Side Panel Plate with "404"
  ctx.fillStyle = '#1e293b'
  roundRect(ctx, 6, 6, 11, 10, 2)
  ctx.fill()
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 0.9
  ctx.stroke()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 6.5px "JetBrains Mono", monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('404', 11.5, 11.5)

  // 6. Front Cyclops Optic Core
  const eyeX = w - 6.5
  const eyeY = 11.5
  const eyeR = 4.5

  ctx.fillStyle = '#020617'
  roundRect(ctx, w - 10, 6, 8, 11, 2)
  ctx.fill()
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 1
  ctx.stroke()

  if (isAttack) {
    const attFrame = customAction === 'attack' ? cycleFrame : (drone.laserPhase || 0)
    if (attFrame === 0) {
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(eyeX - 1.5, eyeY - 1.5, 3, 3)
    } else if (attFrame === 1 || attFrame === 2) {
      ctx.fillStyle = '#00f0ff'
      ctx.beginPath()
      ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(eyeX, eyeY, 2.5, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.fillStyle = '#450a0a'
      ctx.beginPath()
      ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2)
      ctx.fill()
    }
  } else {
    let irisColor = '#ef4444'
    let pupilColor = '#991b1b'
    let hasGlint = true
    if (cycleFrame === 1) {
      irisColor = '#991b1b'
      pupilColor = '#450a0a'
      hasGlint = false
    } else if (cycleFrame === 2) {
      irisColor = '#f87171'
      pupilColor = '#dc2626'
      hasGlint = true
    }
    ctx.fillStyle = irisColor
    ctx.beginPath()
    ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = pupilColor
    ctx.beginPath()
    ctx.arc(eyeX, eyeY, 2.2, 0, Math.PI * 2)
    ctx.fill()
    if (hasGlint) {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(eyeX - 1.8, eyeY - 1.8, 1.6, 1.6)
    }
  }

  ctx.restore()
}

// 2. Squatter Recon Drone Sprite (Spherical Gunmetal Chassis, Cyan Equator, Padlock, Radar Eye)
function renderSquatterDrone(ctx, drone, customAction = null, customFrame = null) {
  ctx.save()
  const frame = customFrame !== null ? customFrame : (drone.frame || 0)
  const isAttack =
    customAction === 'attack' ||
    drone.actionState === 'attack' ||
    (drone.laserTimer && drone.laserTimer > 0)

  const cycleFrame = Math.floor(frame / 6) % 4
  const bobY = !isAttack ? (cycleFrame === 1 ? 1.5 : cycleFrame === 2 ? -1.5 : 0) : 0

  ctx.translate(Math.round(drone.x || 0), Math.round((drone.y || 0) + bobY))

  if (drone.hitFlash > 0) {
    ctx.fillStyle = '#ffffff'
    roundRect(ctx, 0, 0, drone.w || 26, drone.h || 26, 6)
    ctx.fill()
    ctx.restore()
    return
  }

  const w = drone.w || 26
  const h = drone.h || 26
  const centerX = w / 2

  // 1. Top Propeller Halo
  const rPhase = frame * 0.35
  const bladeSpan1 = Math.cos(rPhase) * 14
  const bladeSpan2 = Math.sin(rPhase) * 14

  ctx.fillStyle = '#1e293b'
  ctx.fillRect(centerX - 1, -4, 2, 5)

  ctx.strokeStyle = '#38bdf8'
  ctx.lineWidth = 1.8
  ctx.beginPath()
  ctx.ellipse(centerX, -4.5, 14, 3, 0, 0, Math.PI * 2)
  ctx.stroke()

  ctx.strokeStyle = '#e0f2fe'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(centerX - bladeSpan1, -4.5)
  ctx.lineTo(centerX + bladeSpan1, -4.5)
  ctx.moveTo(centerX - bladeSpan2 * 0.7, -4.5)
  ctx.lineTo(centerX + bladeSpan2 * 0.7, -4.5)
  ctx.stroke()

  ctx.fillStyle = '#94a3b8'
  ctx.fillRect(centerX - 1.5, -5.5, 3, 2)

  // 2. Ventral Spotlight
  if (!isAttack) {
    const spotSpread = 5 + cycleFrame * 3.5
    ctx.save()
    const spotGrad = ctx.createLinearGradient(centerX, h - 2, centerX, h + 22)
    spotGrad.addColorStop(0, 'rgba(6, 182, 212, 0.55)')
    spotGrad.addColorStop(1, 'rgba(6, 182, 212, 0.0)')
    ctx.fillStyle = spotGrad
    ctx.beginPath()
    ctx.moveTo(centerX - 2, h - 2)
    ctx.lineTo(centerX - spotSpread, h + 22)
    ctx.lineTo(centerX + spotSpread, h + 22)
    ctx.lineTo(centerX + 2, h - 2)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  // 3. Spherical Chassis
  const grad = ctx.createLinearGradient(centerX, 0, centerX, h)
  grad.addColorStop(0, '#334155')
  grad.addColorStop(0.4, '#1e293b')
  grad.addColorStop(1, '#0f172a')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(centerX, h / 2, 11, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#020617'
  ctx.lineWidth = 1.4
  ctx.stroke()

  ctx.strokeStyle = '#06b6d4'
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.arc(centerX, h / 2, 11, Math.PI * 0.1, Math.PI * 0.9)
  ctx.stroke()

  // 4. Padlock Emblem
  ctx.fillStyle = '#f59e0b'
  roundRect(ctx, 3, h / 2 - 2, 5.5, 5.5, 1.5)
  ctx.fill()
  ctx.strokeStyle = '#d97706'
  ctx.lineWidth = 0.8
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(5.75, h / 2 - 2, 1.8, Math.PI, 0)
  ctx.stroke()
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(5.25, h / 2, 1, 1.8)

  // 5. Central Radar Scanner Eye
  const eyeX = centerX + 3.5
  const eyeY = h / 2
  const eyeR = 6

  ctx.fillStyle = '#020617'
  ctx.beginPath()
  ctx.arc(eyeX, eyeY, eyeR + 1.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#38bdf8'
  ctx.lineWidth = 1
  ctx.stroke()

  if (isAttack) {
    const attFrame = customAction === 'attack' ? cycleFrame : (drone.laserPhase || 0)
    if (attFrame === 0 || attFrame === 1) {
      ctx.fillStyle = '#f59e0b'
      ctx.beginPath()
      ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(eyeX, eyeY, 2.5, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.fillStyle = '#00f0ff'
      ctx.beginPath()
      ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(eyeX, eyeY, 3, 0, Math.PI * 2)
      ctx.fill()
    }
  } else {
    ctx.fillStyle = '#0f172a'
    ctx.beginPath()
    ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)'
    ctx.lineWidth = 0.8
    ctx.beginPath()
    ctx.arc(eyeX, eyeY, 3.5, 0, Math.PI * 2)
    ctx.stroke()

    const needleAngle = cycleFrame * (Math.PI / 2) - Math.PI * 0.6
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 1.3
    ctx.beginPath()
    ctx.moveTo(eyeX, eyeY)
    ctx.lineTo(eyeX + Math.cos(needleAngle) * 5, eyeY + Math.sin(needleAngle) * 5)
    ctx.stroke()
  }

  ctx.restore()
}

// 3. Cyber Packet Bat Sprite (Royal Purple / Indigo, Cyan Visor, Fangs & Sonar Screech)
function renderPacketBat(ctx, bat, customAction = null, customFrame = null) {
  ctx.save()
  const frame = customFrame !== null ? customFrame : (bat.frame || 0)
  const isAttack =
    customAction === 'attack' ||
    bat.actionState === 'attack' ||
    (bat.laserTimer && bat.laserTimer > 0)

  const cycleFrame = Math.floor(frame / 6) % 4
  ctx.translate(Math.round(bat.x || 0), Math.round(bat.y || 0))

  if (bat.hitFlash > 0) {
    ctx.fillStyle = '#ffffff'
    roundRect(ctx, 0, 0, bat.w || 28, bat.h || 20, 5)
    ctx.fill()
    ctx.restore()
    return
  }

  const w = bat.w || 28
  const h = bat.h || 20
  const centerX = w / 2

  // 1. Articulated Cyber Wings
  const wingStrokeY = !isAttack
    ? cycleFrame === 0 ? -4 : cycleFrame === 1 ? 0 : cycleFrame === 2 ? 4 : 1
    : cycleFrame === 0 ? -6 : cycleFrame === 1 ? -2 : 3

  // Left Wing
  ctx.fillStyle = '#581c87'
  ctx.beginPath()
  ctx.moveTo(centerX - 4, 8)
  ctx.lineTo(0, 3 + wingStrokeY)
  ctx.lineTo(2, 16 + wingStrokeY * 0.5)
  ctx.lineTo(centerX - 3, 13)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = '#9333ea'
  ctx.lineWidth = 1
  ctx.stroke()

  // Right Wing
  ctx.fillStyle = '#581c87'
  ctx.beginPath()
  ctx.moveTo(centerX + 4, 8)
  ctx.lineTo(w, 3 + wingStrokeY)
  ctx.lineTo(w - 2, 16 + wingStrokeY * 0.5)
  ctx.lineTo(centerX + 3, 13)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = '#9333ea'
  ctx.lineWidth = 1
  ctx.stroke()

  // 2. Torso
  ctx.fillStyle = '#1e1b4b'
  roundRect(ctx, centerX - 6, 5, 12, 13, 4)
  ctx.fill()
  ctx.strokeStyle = '#581c87'
  ctx.lineWidth = 1.2
  ctx.stroke()

  // Bat Ears
  ctx.fillStyle = '#7c3aed'
  ctx.beginPath()
  ctx.moveTo(centerX - 5, 5)
  ctx.lineTo(centerX - 7, -1)
  ctx.lineTo(centerX - 2, 5)
  ctx.moveTo(centerX + 2, 5)
  ctx.lineTo(centerX + 7, -1)
  ctx.lineTo(centerX + 5, 5)
  ctx.fill()

  // Cyan Visor & Fangs
  ctx.fillStyle = '#06b6d4'
  roundRect(ctx, centerX - 4.5, 7, 9, 4, 1.5)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(centerX - 3, 13, 1.5, 2.5)
  ctx.fillRect(centerX + 1.5, 13, 1.5, 2.5)

  ctx.restore()
}

// 4. Malware Titan Golem Sprite (Obsidian Mech Brute, Spiked Pauldrons, Molten Core, Stomp Smash)
function renderMalwareGolem(ctx, golem, customAction = null, customFrame = null) {
  ctx.save()
  const frame = customFrame !== null ? customFrame : (golem.frame || 0)
  const isAttack =
    customAction === 'attack' ||
    golem.actionState === 'attack' ||
    (golem.laserTimer && golem.laserTimer > 0)

  const cycleFrame = Math.floor(frame / 6) % 4
  ctx.translate(Math.round(golem.x || 0), Math.round(golem.y || 0))

  if (golem.hitFlash > 0) {
    ctx.fillStyle = '#ffffff'
    roundRect(ctx, 0, 0, golem.w || 32, golem.h || 30, 6)
    ctx.fill()
    ctx.restore()
    return
  }

  const w = golem.w || 32
  const h = golem.h || 30
  const centerX = w / 2

  // Smokestacks
  ctx.fillStyle = '#1e293b'
  ctx.fillRect(centerX - 6, -4, 3, 6)
  ctx.fillRect(centerX + 3, -4, 3, 6)

  // Hydraulic Legs
  const legStride = !isAttack
    ? cycleFrame === 0 ? -2.5 : cycleFrame === 1 ? 0 : cycleFrame === 2 ? 2.5 : 0
    : 0

  ctx.fillStyle = '#1e293b'
  ctx.fillRect(centerX - 10 + legStride, h - 11, 7, 7)
  ctx.fillRect(centerX + 3 - legStride, h - 11, 7, 7)
  ctx.fillStyle = '#0f172a'
  roundRect(ctx, centerX - 12 + legStride, h - 4, 10, 4, 2)
  ctx.fill()
  roundRect(ctx, centerX + 1 - legStride, h - 4, 10, 4, 2)
  ctx.fill()

  // Spiked Arms
  let armRaise = 0
  const attFrame = customAction === 'attack' ? cycleFrame : (golem.laserPhase || 0)
  if (isAttack) {
    armRaise = attFrame === 0 ? -10 : attFrame === 1 ? -4 : attFrame === 2 ? 4 : 0
  }

  ctx.fillStyle = '#334155'
  roundRect(ctx, 0, 4 + armRaise * 0.5, 8, 8, 3)
  ctx.fill()
  roundRect(ctx, w - 8, 4 + armRaise * 0.5, 8, 8, 3)
  ctx.fill()

  // Torso
  ctx.fillStyle = '#1e293b'
  roundRect(ctx, centerX - 10, 3, 20, 18, 5)
  ctx.fill()
  ctx.strokeStyle = '#020617'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Head
  ctx.fillStyle = '#0f172a'
  roundRect(ctx, centerX - 6, -1, 12, 7, 3)
  ctx.fill()
  ctx.fillStyle = '#ea580c'
  ctx.fillRect(centerX - 4, 1, 2.5, 2)
  ctx.fillRect(centerX + 1.5, 1, 2.5, 2)

  // Molten Core
  const coreGrad = ctx.createRadialGradient(centerX, 12, 1, centerX, 12, 6)
  coreGrad.addColorStop(0, '#ffffff')
  coreGrad.addColorStop(0.3, '#fbbf24')
  coreGrad.addColorStop(0.7, '#ea580c')
  coreGrad.addColorStop(1, '#7c2d12')
  ctx.fillStyle = coreGrad
  ctx.beginPath()
  ctx.arc(centerX, 12, 5.5, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

// ============================================================================
// ENEMY BULLETS & PROJECTILE RENDERING
// ============================================================================
function renderEnemyBullets(ctx, bullets) {
  if (!bullets || bullets.length === 0) return
  ctx.save()

  for (let i = 0; i < bullets.length; i++) {
    const b = bullets[i]
    ctx.save()
    ctx.translate(Math.round(b.x), Math.round(b.y))

    if (b.type === 'glitch_pulse') {
      // Cyan Glitch Pulse
      ctx.fillStyle = '#00f0ff'
      roundRect(ctx, -b.size, -2, b.size * 2, 4, 2)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(-b.size * 0.5, -1, b.size, 2)
    } else if (b.type === 'emp_spark') {
      // Yellow/Amber EMP Spark Ring
      ctx.strokeStyle = '#facc15'
      ctx.lineWidth = 1.8
      ctx.beginPath()
      ctx.arc(0, 0, b.size, 0, Math.PI * 2)
      ctx.stroke()
      ctx.fillStyle = '#38bdf8'
      ctx.fillRect(-1.5, -1.5, 3, 3)
    } else if (b.type === 'sonar_wave') {
      // Triple Concentric Violet Sonar Arc
      ctx.strokeStyle = '#c084fc'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(b.size, 0, b.size * 1.5, -Math.PI * 0.4, Math.PI * 0.4)
      ctx.stroke()
      ctx.strokeStyle = '#f43f5e'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.arc(b.size + 3, 0, b.size * 2, -Math.PI * 0.35, Math.PI * 0.35)
      ctx.stroke()
    } else if (b.type === 'magma_boulder') {
      // Molten Magma Boulder with Fire Glow
      b.rot = (b.rot || 0) + 0.2
      ctx.rotate(b.rot)
      ctx.fillStyle = '#7c2d12'
      ctx.beginPath()
      ctx.arc(0, 0, b.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#f97316'
      ctx.fillRect(-2, -2, 4, 4)
      ctx.fillStyle = '#fde047'
      ctx.fillRect(-1, -1, 2, 2)
    } else if (b.type === 'plasmic_slug') {
      // Heavy Terracotta/Gold Plasmic Overload Bolt
      ctx.fillStyle = 'rgba(234, 88, 12, 0.45)'
      roundRect(ctx, -14, -4, 28, 8, 3)
      ctx.fill()
      ctx.fillStyle = '#ea580c'
      roundRect(ctx, -10, -2.5, 20, 5, 2)
      ctx.fill()
      ctx.fillStyle = '#fde047'
      ctx.fillRect(-6, -1, 12, 2)
    } else if (b.type === 'railgun_slug') {
      // High-Velocity Cyan Railgun Beam
      ctx.fillStyle = 'rgba(6, 182, 212, 0.5)'
      roundRect(ctx, -20, -3.5, 40, 7, 2)
      ctx.fill()
      ctx.fillStyle = '#00f0ff'
      roundRect(ctx, -16, -2, 32, 4, 2)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(-12, -1, 24, 2)
    } else if (b.type === 'volt_needle') {
      // Sharp Yellow/Cyan Electric Needle
      ctx.fillStyle = '#facc15'
      roundRect(ctx, -8, -1.5, 16, 3, 1)
      ctx.fill()
      ctx.fillStyle = '#38bdf8'
      ctx.fillRect(-4, -0.75, 8, 1.5)
    } else if (b.type === 'bio_mortar') {
      // Parabolic Toxic Bio-Mortar Canister
      b.rot = (b.rot || 0) + 0.15
      ctx.rotate(b.rot)
      ctx.fillStyle = '#581c87'
      roundRect(ctx, -b.size, -b.size * 0.7, b.size * 2, b.size * 1.4, 3)
      ctx.fill()
      ctx.fillStyle = '#22c55e'
      ctx.beginPath()
      ctx.arc(0, 0, b.size * 0.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#86efac'
      ctx.lineWidth = 1.2
      ctx.stroke()
    } else if (b.type === 'seismic_shockwave') {
      // Ground Shockwave Crack Barrier
      ctx.fillStyle = 'rgba(253, 224, 71, 0.7)'
      ctx.beginPath()
      ctx.moveTo(-10, 0)
      ctx.lineTo(0, -16)
      ctx.lineTo(10, 0)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#ea580c'
      ctx.lineWidth = 1.5
      ctx.stroke()
    } else if (b.type === 'diamond_pulse') {
      // Expanding Concentric Diamond Energy Ring
      b.rot = (b.rot || 0) + 0.08
      ctx.rotate(b.rot)
      ctx.strokeStyle = '#ec4899'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, -b.size)
      ctx.lineTo(b.size, 0)
      ctx.lineTo(0, b.size)
      ctx.lineTo(-b.size, 0)
      ctx.closePath()
      ctx.stroke()
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, -b.size * 0.6)
      ctx.lineTo(b.size * 0.6, 0)
      ctx.lineTo(0, b.size * 0.6)
      ctx.lineTo(-b.size * 0.6, 0)
      ctx.closePath()
      ctx.stroke()
    } else {
      ctx.fillStyle = b.color || '#ef4444'
      ctx.beginPath()
      ctx.arc(0, 0, b.size || 4, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }

  ctx.restore()
}

// ============================================================================
// AUTHENTIC 16-BIT RETRO PIXEL ART CYBERNETIC ENEMIES (DERIVED FROM SPRITE SHEETS)
// ============================================================================

// 1. Cybernetic Beetle Infantry (Terracotta shell, hydraulic piston legs, golden eye, plasmic overload laser beam)
function renderBeetleInfantry(ctx, mob, customAction = null, customFrame = null) {
  ctx.save()
  const frame = customFrame !== null ? customFrame : (mob.frame || 0)
  const isAttack =
    customAction === 'attack' ||
    (customAction && customAction.startsWith('attack')) ||
    mob.actionState === 'attack' ||
    (mob.laserTimer && mob.laserTimer > 0)

  const cycleFrame = Math.floor(frame / 6) % 4
  const attFrame = isAttack ? (customFrame !== null ? cycleFrame : (mob.attackPhase || mob.laserPhase || 0)) : 0

  const w = mob.w || 34
  const h = mob.h || 24
  const centerX = w / 2

  let bobY = 0
  if (!isAttack) {
    bobY = cycleFrame === 1 ? 1 : cycleFrame === 2 ? -1 : 0
  } else {
    bobY = attFrame === 0 ? 1 : attFrame === 3 ? 2 : 0
  }

  ctx.translate(Math.round(mob.x || 0), Math.round((mob.y || 0) + bobY))

  if (mob.hitFlash > 0) {
    ctx.fillStyle = '#ffffff'
    roundRect(ctx, 0, 0, w, h, 4)
    ctx.fill()
    ctx.restore()
    return
  }

  // 1. Hydraulic Piston Walking Legs (4 articulated legs)
  const legStride = !isAttack
    ? cycleFrame === 0 ? -2 : cycleFrame === 1 ? 0 : cycleFrame === 2 ? 2 : 0
    : attFrame === 3 ? 1 : 0

  // Rear Legs (Dark Iron)
  ctx.fillStyle = '#1e293b'
  ctx.fillRect(4 + legStride, h - 8, 3, 8)
  ctx.fillRect(w - 7 - legStride, h - 8, 3, 8)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(3 + legStride, h - 2, 5, 2)
  ctx.fillRect(w - 8 - legStride, h - 2, 5, 2)

  // Front Hydraulic Pistons (Silver Piston Rods + Terracotta Foot Sabatons)
  ctx.fillStyle = '#94a3b8'
  ctx.fillRect(8 - legStride, h - 7, 2.5, 7)
  ctx.fillRect(w - 11 + legStride, h - 7, 2.5, 7)
  ctx.fillStyle = '#ea580c'
  roundRect(ctx, 6 - legStride, h - 3, 5, 3, 1)
  ctx.fill()
  roundRect(ctx, w - 13 + legStride, h - 3, 5, 3, 1)
  ctx.fill()

  // 2. Terracotta Armored Shell Body (Rounded Heavy Beetle Carapace)
  const shellGrad = ctx.createLinearGradient(0, 2, 0, h - 4)
  shellGrad.addColorStop(0, '#f97316')
  shellGrad.addColorStop(0.3, '#ea580c')
  shellGrad.addColorStop(0.8, '#c2410c')
  shellGrad.addColorStop(1, '#7c2d12')
  ctx.fillStyle = shellGrad
  roundRect(ctx, 4, 3, w - 8, h - 8, 6)
  ctx.fill()
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 1.2
  ctx.stroke()

  // Shell Dorsal Seamline & Brass Rivets
  ctx.strokeStyle = '#7c2d12'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(centerX, 4)
  ctx.lineTo(centerX, h - 6)
  ctx.stroke()

  ctx.fillStyle = '#fbbf24'
  ctx.fillRect(7, 6, 1.5, 1.5)
  ctx.fillRect(w - 9, 6, 1.5, 1.5)
  ctx.fillRect(7, h - 10, 1.5, 1.5)
  ctx.fillRect(w - 9, h - 10, 1.5, 1.5)

  // Top Carapace Highlight Bevel
  ctx.fillStyle = '#fdba74'
  ctx.fillRect(8, 4.5, w - 16, 1.5)

  // 3. Dark Slate Head Segment with Antenna Sensors
  ctx.fillStyle = '#1e293b'
  roundRect(ctx, 0, 7, 7, 10, 2)
  ctx.fill()
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 0.9
  ctx.stroke()

  // Antennae
  ctx.strokeStyle = '#64748b'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(2, 7)
  ctx.lineTo(-2, 3)
  ctx.moveTo(2, 17)
  ctx.lineTo(-2, 21)
  ctx.stroke()
  ctx.fillStyle = '#fbbf24'
  ctx.fillRect(-3, 2, 2, 2)
  ctx.fillRect(-3, 20, 2, 2)

  // 4. Golden Circular Optical Eye Lens
  const eyeX = 3
  const eyeY = 12
  const eyeR = 3.5

  ctx.fillStyle = '#020617'
  ctx.beginPath()
  ctx.arc(eyeX, eyeY, eyeR + 1, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#fbbf24'
  ctx.beginPath()
  ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(eyeX - 1, eyeY - 1, 1.5, 1.5)

  // 5. ATTACK: 4-Frame Plasmic Overload Dynamics
  if (isAttack) {
    if (attFrame === 0) {
      // F1: Eye Lens Flare Ignition
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(eyeX, eyeY, eyeR + 3, 0, Math.PI * 2)
      ctx.stroke()
    } else if (attFrame === 1) {
      // F2: Overcharge Plasma Buildup & Cyan Energy Rings
      ctx.strokeStyle = '#00f0ff'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(eyeX - 4, eyeY, 6, 0, Math.PI * 2)
      ctx.stroke()
      ctx.strokeStyle = '#fbbf24'
      ctx.beginPath()
      ctx.arc(eyeX - 8, eyeY, 9, 0, Math.PI * 2)
      ctx.stroke()
    } else if (attFrame === 2) {
      // F3: Solid Horizontal Cyan/Yellow Plasma Laser Blast
      const bLen = 140
      ctx.save()
      // Outer Cyan Plasma Glow
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)'
      ctx.lineWidth = 8
      ctx.beginPath()
      ctx.moveTo(eyeX, eyeY)
      ctx.lineTo(eyeX - bLen, eyeY)
      ctx.stroke()

      // Mid Cyan Beam
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 4.5
      ctx.beginPath()
      ctx.moveTo(eyeX, eyeY)
      ctx.lineTo(eyeX - bLen, eyeY)
      ctx.stroke()

      // Inner Pure White Core
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(eyeX, eyeY)
      ctx.lineTo(eyeX - bLen, eyeY)
      ctx.stroke()

      // Radial Golden Muzzle Flash Sparks
      ;[0, 45, 90, 135, 180, 225, 270, 315].forEach((deg) => {
        const rad = (deg * Math.PI) / 180
        ctx.fillStyle = '#fde047'
        ctx.fillRect(eyeX + Math.cos(rad) * 6 - 1, eyeY + Math.sin(rad) * 6 - 1, 2, 2)
      })
      ctx.restore()
    } else if (attFrame === 3) {
      // F4: Head Dip & Dual Grey Exhaust Smoke Clouds
      ctx.fillStyle = 'rgba(148, 163, 184, 0.8)'
      ctx.beginPath()
      ctx.arc(w - 6, 0, 4, 0, Math.PI * 2)
      ctx.arc(w - 2, -4, 5, 0, Math.PI * 2)
      ctx.arc(w - 10, -3, 3.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  ctx.restore()
}

// 2. Cyber-Mantis Sniper (Emerald metallic carapace, titanium spine, red optic flare, hyper railgun beam)
function renderMantisSniper(ctx, mob, customAction = null, customFrame = null) {
  ctx.save()
  const frame = customFrame !== null ? customFrame : (mob.frame || 0)
  const isAttack =
    customAction === 'attack' ||
    (customAction && customAction.startsWith('attack')) ||
    mob.actionState === 'attack' ||
    (mob.laserTimer && mob.laserTimer > 0)

  const cycleFrame = Math.floor(frame / 6) % 4
  const attFrame = isAttack ? (customFrame !== null ? cycleFrame : (mob.attackPhase || mob.laserPhase || 0)) : 0

  const w = mob.w || 36
  const h = mob.h || 32

  let bobY = 0
  if (!isAttack) {
    bobY = cycleFrame === 1 ? -1.5 : cycleFrame === 2 ? 1 : 0
  } else {
    bobY = attFrame === 3 ? 2 : 0
  }

  ctx.translate(Math.round(mob.x || 0), Math.round((mob.y || 0) + bobY))

  if (mob.hitFlash > 0) {
    ctx.fillStyle = '#ffffff'
    roundRect(ctx, 0, 0, w, h, 4)
    ctx.fill()
    ctx.restore()
    return
  }

  // 1. Digitigrade Titanium Legs (Slender Articulated Piston Struts)
  const legOffset = !isAttack
    ? cycleFrame === 0 ? -2 : cycleFrame === 1 ? 2 : cycleFrame === 2 ? 0 : -1
    : attFrame === 3 ? 3 : 0 // recoil slide back

  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 1.6
  // Rear leg
  ctx.beginPath()
  ctx.moveTo(w - 12 + legOffset, h - 14)
  ctx.lineTo(w - 6 + legOffset, h - 6)
  ctx.lineTo(w - 8 + legOffset, h)
  ctx.stroke()
  // Front leg
  ctx.beginPath()
  ctx.moveTo(w - 20 - legOffset, h - 14)
  ctx.lineTo(w - 26 - legOffset, h - 6)
  ctx.lineTo(w - 24 - legOffset, h)
  ctx.stroke()

  ctx.fillStyle = '#059669'
  ctx.fillRect(w - 10 + legOffset, h - 2, 4, 2)
  ctx.fillRect(w - 26 - legOffset, h - 2, 4, 2)

  // 2. Articulated Segmented Carapace & Spine (Emerald Green)
  const spineGrad = ctx.createLinearGradient(0, 0, 0, h)
  spineGrad.addColorStop(0, '#34d399')
  spineGrad.addColorStop(0.3, '#10b981')
  spineGrad.addColorStop(0.8, '#059669')
  spineGrad.addColorStop(1, '#064e3b')
  ctx.fillStyle = spineGrad

  // Thorax
  roundRect(ctx, w - 24, 10, 16, 12, 4)
  ctx.fill()
  ctx.strokeStyle = '#022c22'
  ctx.lineWidth = 1
  ctx.stroke()

  // Abdomen
  roundRect(ctx, w - 16, 16, 12, 12, 5)
  ctx.fill()
  ctx.stroke()

  // Heatsink Vents on Back
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(w - 14, 12, 6, 1.5)
  ctx.fillRect(w - 14, 15, 6, 1.5)

  // 3. Angular Cyber-Head & Red Targeting Optic Flare
  const headX = w - 28
  const headY = 6
  ctx.fillStyle = '#059669'
  ctx.beginPath()
  ctx.moveTo(headX + 8, headY)
  ctx.lineTo(headX, headY + 5)
  ctx.lineTo(headX + 4, headY + 11)
  ctx.lineTo(headX + 10, headY + 7)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = '#022c22'
  ctx.lineWidth = 1
  ctx.stroke()

  // Piercing Red Optic Eye
  ctx.fillStyle = '#ef4444'
  ctx.beginPath()
  ctx.arc(headX + 2, headY + 6, 2.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(headX + 1.5, headY + 5, 1, 1)

  // 4. Folding Scythe Arms / Railgun Barrel Assembly
  let scythePitch = 0
  if (!isAttack) {
    // Idle scythe sway
    scythePitch = cycleFrame === 0 ? 0.1 : cycleFrame === 1 ? -0.15 : cycleFrame === 2 ? 0.2 : 0
  } else {
    // Attack barrel alignment
    scythePitch = attFrame === 0 ? -0.1 : attFrame === 1 ? 0 : attFrame === 2 ? 0 : 0.25
  }

  ctx.save()
  ctx.translate(headX + 4, headY + 8)
  ctx.rotate(scythePitch)

  if (!isAttack || attFrame === 0) {
    // Folded Curved Scythes
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(-10, -6)
    ctx.lineTo(-14, 4)
    ctx.stroke()

    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(-2, 0)
    ctx.lineTo(-10, -5)
    ctx.lineTo(-14, 4)
    ctx.stroke()
  } else {
    // Locked Horizontal Precision Railgun Rifle Barrel
    ctx.fillStyle = '#1e293b'
    roundRect(ctx, -20, -3, 20, 5, 1.5)
    ctx.fill()
    ctx.fillStyle = '#10b981'
    ctx.fillRect(-18, -2, 16, 1.5)
    ctx.fillStyle = '#00f0ff'
    ctx.fillRect(-22, -1.5, 3, 2)
  }
  ctx.restore()

  // 5. ATTACK: 4-Frame Railgun Blast & Recoil
  if (isAttack) {
    if (attFrame === 0) {
      // F1: Red Optic Sniper Lens Flare Crosshair
      ctx.save()
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.moveTo(headX + 2 - 12, headY + 6)
      ctx.lineTo(headX + 2 + 12, headY + 6)
      ctx.moveTo(headX + 2, headY + 6 - 12)
      ctx.lineTo(headX + 2, headY + 6 + 12)
      ctx.stroke()
      ctx.fillStyle = '#f87171'
      ctx.beginPath()
      ctx.arc(headX + 2, headY + 6, 4, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    } else if (attFrame === 1) {
      // F2: Barrel Locked + Cyan Vortex Charge Focus
      ctx.fillStyle = '#00f0ff'
      ctx.beginPath()
      ctx.arc(headX - 16, headY + 8, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1
      ctx.stroke()
    } else if (attFrame === 2) {
      // F3: Thick Cyan Railgun Beam Discharge + Yellow Star Burst
      const bLen = 160
      ctx.save()
      // Outer Cyan Beam
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)'
      ctx.lineWidth = 7
      ctx.beginPath()
      ctx.moveTo(headX - 16, headY + 8)
      ctx.lineTo(headX - 16 - bLen, headY + 8)
      ctx.stroke()

      // Solid Core Beam
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 3.5
      ctx.beginPath()
      ctx.moveTo(headX - 16, headY + 8)
      ctx.lineTo(headX - 16 - bLen, headY + 8)
      ctx.stroke()

      // Pure White Laser Spine
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1.6
      ctx.beginPath()
      ctx.moveTo(headX - 16, headY + 8)
      ctx.lineTo(headX - 16 - bLen, headY + 8)
      ctx.stroke()

      // Explosive Yellow 8-Point Star
      const starX = headX - 16
      const starY = headY + 8
      ctx.fillStyle = '#fde047'
      ;[0, 45, 90, 135].forEach((deg) => {
        const rad = (deg * Math.PI) / 180
        ctx.fillRect(starX + Math.cos(rad) * 6 - 1, starY + Math.sin(rad) * 6 - 1, 2.5, 2.5)
        ctx.fillRect(starX - Math.cos(rad) * 6 - 1, starY - Math.sin(rad) * 6 - 1, 2.5, 2.5)
      })
      ctx.restore()
    } else if (attFrame === 3) {
      // F4: Heavy Recoil Slide Back + White Exhaust Plumes
      ctx.fillStyle = 'rgba(241, 245, 249, 0.85)'
      ctx.beginPath()
      ctx.arc(w - 8, 8, 4.5, 0, Math.PI * 2)
      ctx.arc(w - 2, 4, 6, 0, Math.PI * 2)
      ctx.arc(w + 4, 6, 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  ctx.restore()
}

// 3. Volt-Hornet Drone (Black/yellow hazard abdomen, cyan ion ports, rapid translucent wings, 3-needle burst)
function renderVoltHornet(ctx, mob, customAction = null, customFrame = null) {
  ctx.save()
  const frame = customFrame !== null ? customFrame : (mob.frame || 0)
  const isAttack =
    customAction === 'attack' ||
    (customAction && customAction.startsWith('attack')) ||
    mob.actionState === 'attack' ||
    (mob.laserTimer && mob.laserTimer > 0)

  const cycleFrame = Math.floor(frame / 6) % 4
  const attFrame = isAttack ? (customFrame !== null ? cycleFrame : (mob.attackPhase || mob.laserPhase || 0)) : 0

  const w = mob.w || 30
  const h = mob.h || 26
  const centerX = w / 2

  let hoverY = 0
  if (!isAttack) {
    hoverY = Math.sin(frame * 0.25) * 3
  } else {
    hoverY = attFrame === 0 ? 2 : attFrame === 1 ? -1 : 0
  }

  ctx.translate(Math.round(mob.x || 0), Math.round((mob.y || 0) + hoverY))

  if (mob.hitFlash > 0) {
    ctx.fillStyle = '#ffffff'
    roundRect(ctx, 0, 0, w, h, 4)
    ctx.fill()
    ctx.restore()
    return
  }

  // 1. Translucent High-Speed Buzzing Wings (Multi-frame blur)
  const wingAngle = cycleFrame === 0 ? 0.3 : cycleFrame === 1 ? 0 : cycleFrame === 2 ? -0.3 : 0.1
  ctx.save()
  ctx.translate(centerX, 8)
  ctx.rotate(wingAngle)

  ctx.fillStyle = 'rgba(224, 242, 254, 0.75)'
  ctx.beginPath()
  ctx.ellipse(0, -10, 14, 4.5, -0.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#38bdf8'
  ctx.lineWidth = 1
  ctx.stroke()

  // Wing Motion Blur Lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
  ctx.lineWidth = 0.8
  ctx.beginPath()
  ctx.moveTo(-10, -10)
  ctx.lineTo(10, -10)
  ctx.stroke()
  ctx.restore()

  // 2. Drone Head & Angled Compound Eyes
  ctx.fillStyle = '#0f172a'
  roundRect(ctx, 4, 10, 8, 9, 3)
  ctx.fill()
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 0.9
  ctx.stroke()

  // Cyan Compound Eye
  ctx.fillStyle = '#06b6d4'
  ctx.fillRect(4, 12, 3, 4.5)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(4.5, 12.5, 1.2, 1.2)

  // 3. Black-and-Yellow Hazard Striped Curved Abdomen
  let abdCurl = 0
  if (isAttack && (attFrame === 0 || attFrame === 1)) {
    abdCurl = -0.5 // curls forward under head
  }

  ctx.save()
  ctx.translate(12, 14)
  ctx.rotate(abdCurl)

  // Abdomen Body
  ctx.fillStyle = '#eab308'
  roundRect(ctx, 0, -4, 16, 12, 4)
  ctx.fill()
  ctx.strokeStyle = '#020617'
  ctx.lineWidth = 1.1
  ctx.stroke()

  // Hazard Stripes
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(4, -4, 3.5, 12)
  ctx.fillRect(10, -4, 3.5, 12)

  // Cyan Ion Exhaust Ports on Rear
  ctx.fillStyle = '#06b6d4'
  ctx.fillRect(15, 0, 2, 4)
  ctx.fillStyle = 'rgba(6, 182, 212, 0.6)'
  ctx.fillRect(17, 0.5, 3, 3)

  // Sharp Electric Stinger Needle
  ctx.fillStyle = '#475569'
  ctx.beginPath()
  ctx.moveTo(16, 2)
  ctx.lineTo(22, 2)
  ctx.lineTo(16, 5)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#00f0ff'
  ctx.fillRect(20, 1.5, 2, 1.5)
  ctx.restore()

  // 4. ATTACK: 4-Frame Arc Charge & 3-Needle Volt Burst
  if (isAttack) {
    if (attFrame === 1) {
      // F2: Jagged Cyan Lightning Arcs between Stinger & Antennae
      ctx.strokeStyle = '#67e8f9'
      ctx.lineWidth = 1.4
      ctx.beginPath()
      ctx.moveTo(4, 8)
      ctx.lineTo(0, 14)
      ctx.lineTo(6, 18)
      ctx.lineTo(2, 22)
      ctx.stroke()
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 13, 2, 2)
      ctx.fillRect(2, 21, 2, 2)
    } else if (attFrame === 2) {
      // F3: Triple-Needle Electric Projectile Volley
      const needles = [
        { x: -14, y: 10, vy: -2 },
        { x: -22, y: 14, vy: 0 },
        { x: -14, y: 18, vy: 2 },
      ]

      ctx.save()
      needles.forEach((nd) => {
        ctx.fillStyle = '#00f0ff'
        roundRect(ctx, nd.x, nd.y, 10, 2.5, 1)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(nd.x + 2, nd.y + 0.5, 6, 1.5)
        ctx.fillStyle = '#fde047'
        ctx.fillRect(nd.x - 2, nd.y - 1, 3, 4.5)
      })

      // Yellow Muzzle Burst Star
      ctx.fillStyle = '#facc15'
      ctx.fillRect(0, 12, 4, 4)
      ctx.restore()
    } else if (attFrame === 3) {
      // F4: Spark Dissipation
      ctx.fillStyle = '#67e8f9'
      ctx.fillRect(-4, 12, 2, 2)
      ctx.fillRect(-8, 16, 1.5, 1.5)
      ctx.fillRect(0, 8, 1.5, 1.5)
    }
  }

  ctx.restore()
}

// 4. Centipede Artillery (Royal purple segmented shell, 10 robotic micro-legs, green visor, bio-mortar launch)
function renderCentipedeArtillery(ctx, mob, customAction = null, customFrame = null) {
  ctx.save()
  const frame = customFrame !== null ? customFrame : (mob.frame || 0)
  const isAttack =
    customAction === 'attack' ||
    (customAction && customAction.startsWith('attack')) ||
    mob.actionState === 'attack' ||
    (mob.laserTimer && mob.laserTimer > 0)

  const cycleFrame = Math.floor(frame / 6) % 4
  const attFrame = isAttack ? (customFrame !== null ? cycleFrame : (mob.attackPhase || mob.laserPhase || 0)) : 0

  const w = mob.w || 44
  const h = mob.h || 22

  let archAngle = 0
  if (!isAttack) {
    archAngle = cycleFrame === 1 ? 0.05 : cycleFrame === 2 ? -0.05 : 0
  } else {
    archAngle = attFrame === 0 ? -0.25 : attFrame === 1 ? -0.35 : attFrame === 2 ? -0.35 : 0
  }

  ctx.translate(Math.round(mob.x || 0), Math.round(mob.y || 0))

  if (mob.hitFlash > 0) {
    ctx.fillStyle = '#ffffff'
    roundRect(ctx, 0, 0, w, h, 4)
    ctx.fill()
    ctx.restore()
    return
  }

  // 1. 10 Synchronized Robotic Titanium Micro-Legs (5 Pairs)
  ctx.fillStyle = '#334155'
  for (let l = 0; l < 5; l++) {
    const lx = 6 + l * 8
    const legBob = !isAttack
      ? ((cycleFrame + l) % 2 === 0 ? 0 : -2)
      : (attFrame > 0 && l < 2 ? -5 : 0) // front legs lift off floor in attack

    ctx.fillRect(lx, h - 6 + legBob, 2.5, 6 - legBob)
    ctx.fillStyle = '#1e1b4b'
    ctx.fillRect(lx - 1, h - 2, 4, 2)
    ctx.fillStyle = '#334155'
  }

  // 2. Segmented Royal Purple Armored Shell Body (5 Overlapping Plates)
  ctx.save()
  if (archAngle !== 0) {
    ctx.rotate(archAngle)
  }

  const pColors = ['#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87']
  for (let s = 4; s >= 0; s--) {
    const sx = 4 + s * 7.5
    ctx.fillStyle = pColors[s % pColors.length]
    roundRect(ctx, sx, 4, 10, 12, 3)
    ctx.fill()
    ctx.strokeStyle = '#1e1b4b'
    ctx.lineWidth = 1
    ctx.stroke()

    // Top Highlight Bevel
    ctx.fillStyle = '#d8b4fe'
    ctx.fillRect(sx + 1.5, 5, 7, 1.5)
  }

  // 3. Forward Armored Head & Glowing Lime-Green Visor
  ctx.fillStyle = '#581c87'
  roundRect(ctx, 0, 6, 8, 9, 2)
  ctx.fill()
  ctx.strokeStyle = '#1e1b4b'
  ctx.lineWidth = 1
  ctx.stroke()

  // Glowing Green Visor
  ctx.fillStyle = '#22c55e'
  ctx.fillRect(0, 8.5, 3.5, 3.5)
  ctx.fillStyle = '#86efac'
  ctx.fillRect(0.5, 9, 1.5, 1.5)

  // 4. ATTACK: Dorsal Petal Split & Bio-Mortar Canister Launch
  if (isAttack) {
    if (attFrame === 1 || attFrame === 2) {
      // Split Shell Petals revealing Glowing Green Bio-Mortar Silo
      ctx.fillStyle = '#14532d'
      roundRect(ctx, 16, 0, 12, 8, 2)
      ctx.fill()
      ctx.fillStyle = '#22c55e'
      ctx.fillRect(18, 1, 8, 4)
      ctx.fillStyle = '#86efac'
      ctx.fillRect(20, 2, 4, 2)

      // Raised purple petal flaps
      ctx.fillStyle = '#9333ea'
      ctx.beginPath()
      ctx.moveTo(15, 2)
      ctx.lineTo(13, -5)
      ctx.lineTo(20, 2)
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(25, 2)
      ctx.lineTo(30, -5)
      ctx.lineTo(29, 2)
      ctx.fill()
    }

    if (attFrame === 2) {
      // F3: Parabolic Green Bio-Mortar Canister Launch Trajectory
      const mortX = -10
      const mortY = -18
      ctx.fillStyle = '#15803d'
      roundRect(ctx, mortX, mortY, 8, 8, 2)
      ctx.fill()
      ctx.fillStyle = '#4ade80'
      ctx.fillRect(mortX + 1.5, mortY + 1.5, 5, 5)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(mortX + 2.5, mortY + 2.5, 2, 2)

      // Green energy trajectory arc
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.7)'
      ctx.lineWidth = 1.5
      ctx.setLineDash([3, 2])
      ctx.beginPath()
      ctx.moveTo(20, -2)
      ctx.quadraticCurveTo(5, -22, mortX, mortY)
      ctx.stroke()
      ctx.setLineDash([])
    } else if (attFrame === 3) {
      // F4: Toxic Vapor Venting from Side Gills
      ctx.fillStyle = 'rgba(74, 222, 128, 0.75)'
      ctx.beginPath()
      ctx.arc(14, 0, 4, 0, Math.PI * 2)
      ctx.arc(22, -3, 5, 0, Math.PI * 2)
      ctx.arc(30, 0, 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.restore()

  ctx.restore()
}

// 5. Hydraulic Crab Juggernaut (Cobalt blue armor, hazard stripes, crusher claws with glowing orange pistons, seismic slam)
function renderCrabJuggernaut(ctx, mob, customAction = null, customFrame = null) {
  ctx.save()
  const frame = customFrame !== null ? customFrame : (mob.frame || 0)
  const isAttack =
    customAction === 'attack' ||
    (customAction && customAction.startsWith('attack')) ||
    mob.actionState === 'attack' ||
    (mob.laserTimer && mob.laserTimer > 0)

  const cycleFrame = Math.floor(frame / 6) % 4
  const attFrame = isAttack ? (customFrame !== null ? cycleFrame : (mob.attackPhase || mob.laserPhase || 0)) : 0

  const w = mob.w || 42
  const h = mob.h || 32
  const centerX = w / 2

  let tilt = 0
  if (!isAttack) {
    tilt = cycleFrame === 1 ? 0.04 : cycleFrame === 3 ? -0.04 : 0
  } else {
    tilt = attFrame === 0 ? -0.08 : attFrame === 1 ? 0.08 : 0
  }

  ctx.translate(Math.round(mob.x || 0), Math.round(mob.y || 0))

  if (mob.hitFlash > 0) {
    ctx.fillStyle = '#ffffff'
    roundRect(ctx, 0, 0, w, h, 6)
    ctx.fill()
    ctx.restore()
    return
  }

  // 1. Stout Industrial Piston Legs (4 heavy legs)
  const lStep = !isAttack
    ? cycleFrame === 0 ? -2 : cycleFrame === 1 ? 0 : cycleFrame === 2 ? 2 : 0
    : 0

  ctx.fillStyle = '#1e293b'
  ctx.fillRect(4 + lStep, h - 8, 6, 8)
  ctx.fillRect(w - 10 - lStep, h - 8, 6, 8)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(2 + lStep, h - 2, 8, 3)
  ctx.fillRect(w - 12 - lStep, h - 2, 8, 3)

  // 2. Twin Vertical Exhaust Chimney Smokestacks
  ctx.fillStyle = '#1e293b'
  ctx.fillRect(centerX - 8, 0, 4, 8)
  ctx.fillRect(centerX + 4, 0, 4, 8)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(centerX - 9, 0, 6, 2)
  ctx.fillRect(centerX + 3, 0, 6, 2)

  // 3. Heavy Armored Cobalt Blue Chassis
  ctx.save()
  if (tilt !== 0) ctx.rotate(tilt)

  const crabGrad = ctx.createLinearGradient(0, 6, 0, h - 6)
  crabGrad.addColorStop(0, '#3b82f6')
  crabGrad.addColorStop(0.4, '#2563eb')
  crabGrad.addColorStop(0.8, '#1d4ed8')
  crabGrad.addColorStop(1, '#1e3a8a')
  ctx.fillStyle = crabGrad
  roundRect(ctx, 6, 6, w - 12, h - 12, 6)
  ctx.fill()
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 1.4
  ctx.stroke()

  // Yellow/Black Hazard Caution Stripes on Brow
  ctx.fillStyle = '#eab308'
  roundRect(ctx, 10, 8, w - 20, 4, 1)
  ctx.fill()
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(14, 8, 3, 4)
  ctx.fillRect(21, 8, 3, 4)
  ctx.fillRect(28, 8, 3, 4)

  // Glowing Orange Optical Sensor Visor
  ctx.fillStyle = '#ea580c'
  ctx.fillRect(centerX - 6, 14, 12, 3.5)
  ctx.fillStyle = '#fde047'
  ctx.fillRect(centerX - 4, 14.5, 8, 1.5)

  // 4. Massive Dual Crusher Claws with Glowing Orange Hydraulic Cylinders
  let clawRaise = 0
  if (!isAttack) {
    clawRaise = cycleFrame === 1 ? -2 : cycleFrame === 3 ? 2 : 0
  } else {
    clawRaise = attFrame === 0 ? -12 : attFrame === 1 ? 4 : attFrame === 2 ? 6 : 0
  }

  // Left Crusher Claw
  ctx.fillStyle = '#2563eb'
  roundRect(ctx, 0, 10 + clawRaise, 8, 12, 3)
  ctx.fill()
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 1
  ctx.stroke()
  // Exposed Glowing Orange Hydraulic Cylinder
  ctx.fillStyle = isAttack && attFrame === 0 ? '#fb923c' : '#ea580c'
  ctx.fillRect(2, 12 + clawRaise, 4, 4)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(3, 13 + clawRaise, 1.5, 1.5)
  // Claw Pincer Teeth
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(-2, 16 + clawRaise, 4, 3)
  ctx.fillRect(1, 19 + clawRaise, 3, 3)

  // Right Crusher Claw
  ctx.fillStyle = '#2563eb'
  roundRect(ctx, w - 8, 10 - clawRaise * 0.5, 8, 12, 3)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = isAttack && attFrame === 0 ? '#fb923c' : '#ea580c'
  ctx.fillRect(w - 6, 12 - clawRaise * 0.5, 4, 4)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(w - 5, 13 - clawRaise * 0.5, 1.5, 1.5)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(w - 2, 16 - clawRaise * 0.5, 4, 3)
  ctx.fillRect(w - 4, 19 - clawRaise * 0.5, 3, 3)
  ctx.restore()

  // 5. ATTACK: Seismic Ground Slam, Shockwave Cracks & Steam
  if (isAttack) {
    if (attFrame === 2) {
      // F3: Explosive Flash + Ground Crack Shockwave
      ctx.save()
      // Ground Impact Flash
      ctx.fillStyle = 'rgba(251, 146, 60, 0.45)'
      ctx.beginPath()
      ctx.ellipse(centerX, h, 28, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // Jagged Ground Cracks
      ctx.strokeStyle = '#fde047'
      ctx.lineWidth = 1.8
      ;[-24, -14, -4, 6, 16, 26].forEach((cx) => {
        ctx.beginPath()
        ctx.moveTo(centerX + cx, h)
        ctx.lineTo(centerX + cx - 4, h + 3)
        ctx.lineTo(centerX + cx + 2, h + 6)
        ctx.stroke()
      })

      // Yellow Kinetic Sparks
      ctx.fillStyle = '#ffffff'
      ;[-18, -8, 8, 18].forEach((sx) => {
        ctx.fillRect(centerX + sx, h - 4 - Math.random() * 6, 2.5, 2.5)
      })
      ctx.restore()
    } else if (attFrame === 3) {
      // F4: White Steam Plumes Puffing from Chimney Stacks
      ctx.fillStyle = 'rgba(241, 245, 249, 0.8)'
      ctx.beginPath()
      ctx.arc(centerX - 6, -4, 4, 0, Math.PI * 2)
      ctx.arc(centerX - 8, -8, 5, 0, Math.PI * 2)
      ctx.arc(centerX + 6, -4, 4, 0, Math.PI * 2)
      ctx.arc(centerX + 8, -8, 5, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  ctx.restore()
}

// 6. Quantum Moth Phantom (Violet/magenta wings with white PCB traces, hot magenta optics, concentric diamond pulse, spectral fade)
function renderMothPhantom(ctx, mob, customAction = null, customFrame = null) {
  ctx.save()
  const frame = customFrame !== null ? customFrame : (mob.frame || 0)
  const isAttack =
    customAction === 'attack' ||
    (customAction && customAction.startsWith('attack')) ||
    mob.actionState === 'attack' ||
    (mob.laserTimer && mob.laserTimer > 0)

  const cycleFrame = Math.floor(frame / 6) % 4
  const attFrame = isAttack ? (customFrame !== null ? cycleFrame : (mob.attackPhase || mob.laserPhase || 0)) : 0

  const w = mob.w || 38
  const h = mob.h || 32
  const centerX = w / 2

  let floatY = 0
  if (!isAttack) {
    floatY = Math.sin(frame * 0.2) * 3
  } else {
    floatY = attFrame === 1 ? -2 : attFrame === 3 ? 1 : 0
  }

  // F4 Phase-fade: 35% Translucent Ghost Silhouette
  if (isAttack && attFrame === 3) {
    ctx.globalAlpha = 0.38
  }

  ctx.translate(Math.round(mob.x || 0), Math.round((mob.y || 0) + floatY))

  if (mob.hitFlash > 0) {
    ctx.fillStyle = '#ffffff'
    roundRect(ctx, 0, 0, w, h, 6)
    ctx.fill()
    ctx.restore()
    return
  }

  // 1. Holographic Circuit-Traced Violet / Magenta Wings (4-Frame Wing Stroke)
  const wingSpread = !isAttack
    ? (cycleFrame === 0 ? 1.0 : cycleFrame === 1 ? 0.75 : cycleFrame === 2 ? 0.6 : 0.85)
    : (attFrame === 1 ? 0.5 : 1.0)

  // Left Wing
  ctx.save()
  ctx.translate(centerX - 4, 12)
  ctx.scale(wingSpread, 1)

  const wGrad = ctx.createLinearGradient(-18, -12, 0, 14)
  wGrad.addColorStop(0, '#ec4899')
  wGrad.addColorStop(0.5, '#c084fc')
  wGrad.addColorStop(1, '#7c3aed')
  ctx.fillStyle = wGrad

  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(-18, -12)
  ctx.lineTo(-16, 6)
  ctx.lineTo(0, 10)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = '#4c1d95'
  ctx.lineWidth = 1
  ctx.stroke()

  // White PCB Circuit Board Traces
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 0.8
  ctx.beginPath()
  ctx.moveTo(-2, 0)
  ctx.lineTo(-12, -6)
  ctx.lineTo(-10, 2)
  ctx.stroke()
  ctx.fillStyle = '#38bdf8'
  ctx.fillRect(-13, -7, 2, 2)
  ctx.fillRect(-11, 1, 2, 2)
  ctx.restore()

  // Right Wing
  ctx.save()
  ctx.translate(centerX + 4, 12)
  ctx.scale(wingSpread, 1)

  ctx.fillStyle = wGrad
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(18, -12)
  ctx.lineTo(16, 6)
  ctx.lineTo(0, 10)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = '#4c1d95'
  ctx.lineWidth = 1
  ctx.stroke()

  // White PCB Circuit Traces
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 0.8
  ctx.beginPath()
  ctx.moveTo(2, 0)
  ctx.lineTo(12, -6)
  ctx.lineTo(10, 2)
  ctx.stroke()
  ctx.fillStyle = '#38bdf8'
  ctx.fillRect(11, -7, 2, 2)
  ctx.fillRect(9, 1, 2, 2)
  ctx.restore()

  // 2. Obsidian Cyber-Body & Hot Magenta Optics
  ctx.fillStyle = '#0f172a'
  roundRect(ctx, centerX - 4, 6, 8, 16, 4)
  ctx.fill()
  ctx.strokeStyle = '#38bdf8'
  ctx.lineWidth = 0.8
  ctx.stroke()

  // Feathered Curved Cyber-Antennae
  ctx.strokeStyle = '#a855f7'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(centerX - 2, 6)
  ctx.lineTo(centerX - 6, -2)
  ctx.moveTo(centerX + 2, 6)
  ctx.lineTo(centerX + 6, -2)
  ctx.stroke()

  // Hot Magenta Eye Sensors
  ctx.fillStyle = '#f43f5e'
  ctx.fillRect(centerX - 3, 9, 2, 2.5)
  ctx.fillRect(centerX + 1, 9, 2, 2.5)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(centerX - 2.5, 9.5, 1, 1)
  ctx.fillRect(centerX + 1.5, 9.5, 1, 1)

  // 3. ATTACK: Binary Glitch Matrix & Concentric Diamond Energy Ring Pulse
  if (isAttack) {
    if (attFrame === 0) {
      // F1: Binary Matrix Glitch (Scanlines + Floating "110", "010" code)
      ctx.fillStyle = '#22c55e'
      ctx.font = 'bold 6px monospace'
      ctx.fillText('110', centerX - 16, 4)
      ctx.fillText('010', centerX + 8, 8)
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.65)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, 14)
      ctx.lineTo(w, 14)
      ctx.stroke()
    } else if (attFrame === 2) {
      // F3: Expanding Concentric Diamond Energy Ring Pulse Wave
      const dX = centerX - 18
      const dY = 14
      ;[6, 12, 18].forEach((dR, idx) => {
        ctx.strokeStyle = idx === 0 ? '#ffffff' : idx === 1 ? '#38bdf8' : '#ec4899'
        ctx.lineWidth = 1.6
        ctx.beginPath()
        ctx.moveTo(dX, dY - dR)
        ctx.lineTo(dX + dR, dY)
        ctx.lineTo(dX, dY + dR)
        ctx.lineTo(dX - dR, dY)
        ctx.closePath()
        ctx.stroke()
      })
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(dX - 1.5, dY - 1.5, 3, 3)
    }
  }

  ctx.restore()
}

// 6. Boss 1: Megabyte Squatter Mecha (1000 pts - Bipedal Crimson/Gunmetal Mech, 404 Blue Visor, Diamond Drill & Thruster Dash)
function renderBossMech(ctx, boss, customAction = null, customFrame = null) {
  const frame = customFrame !== null ? customFrame : Date.now() * 0.008
  const isAttack =
    customAction === 'attack' ||
    (customAction && customAction.startsWith('attack')) ||
    boss.actionState === 'attack' ||
    (boss.actionState && boss.actionState.includes('DASH')) ||
    (boss.actionState && boss.actionState.includes('SALVO')) ||
    (boss.actionState && boss.actionState.includes('MORTAR')) ||
    boss.isDashing
  const cycleFrame = Math.floor(frame / 6) % 4
  const attFrame = isAttack ? (customFrame !== null ? cycleFrame : (boss.attackPhase || 0)) : 0

  const w = boss.w || 56
  const h = boss.h || 50
  const centerX = w / 2

  // Body Y and tilt offsets based on 4-frame cycle
  let bodyY = 0
  let bodyTilt = 0
  if (!isAttack) {
    // IDLE: 4-Frame Diesel Combat Walker Cycle (I1, I2, I3, I4)
    bodyY = cycleFrame === 0 ? 0 : cycleFrame === 1 ? 1.5 : cycleFrame === 2 ? -1.5 : 1
  } else {
    // ATTACK: 4-Frame Rocket Drill Dash Cycle (A1, A2, A3, A4)
    bodyY = attFrame === 0 ? 4 : attFrame === 1 ? -2 : attFrame === 2 ? -1 : 2
    bodyTilt = attFrame === 0 ? 0.12 : attFrame === 1 ? 0.35 : attFrame === 2 ? 0.25 : 0
  }

  ctx.save()
  ctx.translate(0, bodyY)
  if (bodyTilt !== 0) {
    ctx.rotate(bodyTilt)
  }

  // 1. REAR BACKPACK TURBINE & THRUSTER FLAMES
  const bpX = w - 12
  const bpY = 12

  // Heavy Cylindrical Jet Backpack Unit
  ctx.fillStyle = '#1e293b'
  roundRect(ctx, bpX, bpY, 10, 22, 3)
  ctx.fill()
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 1.2
  ctx.stroke()
  ctx.fillStyle = '#475569'
  ctx.fillRect(bpX + 2, bpY + 3, 6, 3)
  ctx.fillRect(bpX + 2, bpY + 16, 6, 3)

  // Thruster Flames
  if (!isAttack) {
    // IDLE (I1-I4): Dual Flame Puff + Floating Ember Sparks
    const fLen = 8 + Math.sin(frame * 0.4) * 4 + (cycleFrame === 2 ? 3 : 0)
    ctx.fillStyle = '#f97316'
    ctx.beginPath()
    ctx.moveTo(bpX + 8, bpY + 10)
    ctx.lineTo(bpX + 8 + fLen, bpY + 14)
    ctx.lineTo(bpX + 8, bpY + 18)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = '#fde047'
    ctx.beginPath()
    ctx.moveTo(bpX + 8, bpY + 12)
    ctx.lineTo(bpX + 8 + fLen * 0.6, bpY + 14)
    ctx.lineTo(bpX + 8, bpY + 16)
    ctx.closePath()
    ctx.fill()

    // Floating Ember Sparks (I1, I2, I3)
    const sp1 = (frame * 0.3) % 10
    const sp2 = (frame * 0.3 + 5) % 10
    ctx.fillStyle = '#fde047'
    ctx.fillRect(bpX + 10 + sp1, bpY + 11 - (sp1 % 4), 2, 2)
    ctx.fillRect(bpX + 12 + sp2, bpY + 16 + (sp2 % 4), 1.5, 1.5)
  } else {
    // ATTACK: 4-Frame Rocket Thruster Dynamics
    if (attFrame === 0) {
      // A1: Huge Multi-Layered Blue & Yellow Rocket Ignition Plume
      const fLen = 28 + Math.sin(frame * 0.6) * 6
      ctx.fillStyle = 'rgba(6, 182, 212, 0.45)'
      ctx.beginPath()
      ctx.moveTo(bpX + 8, bpY + 6)
      ctx.lineTo(bpX + 8 + fLen + 6, bpY + 14)
      ctx.lineTo(bpX + 8, bpY + 22)
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = '#38bdf8'
      ctx.beginPath()
      ctx.moveTo(bpX + 8, bpY + 8)
      ctx.lineTo(bpX + 8 + fLen, bpY + 14)
      ctx.lineTo(bpX + 8, bpY + 20)
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = '#fde047'
      ctx.beginPath()
      ctx.moveTo(bpX + 8, bpY + 10)
      ctx.lineTo(bpX + 8 + fLen * 0.65, bpY + 14)
      ctx.lineTo(bpX + 8, bpY + 18)
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(bpX + 8, bpY + 12.5, fLen * 0.35, 3)
    } else if (attFrame === 1) {
      // A2: High-Speed Blazing Horizontal Orange/Yellow Speed Thrust & Streaks
      const fLen = 36 + Math.sin(frame * 0.8) * 8
      ctx.fillStyle = '#ea580c'
      ctx.beginPath()
      ctx.moveTo(bpX + 8, bpY + 6)
      ctx.lineTo(bpX + 8 + fLen, bpY + 14)
      ctx.lineTo(bpX + 8, bpY + 22)
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = '#fde047'
      ctx.beginPath()
      ctx.moveTo(bpX + 8, bpY + 9)
      ctx.lineTo(bpX + 8 + fLen * 0.7, bpY + 14)
      ctx.lineTo(bpX + 8, bpY + 19)
      ctx.closePath()
      ctx.fill()

      // Speed lines rushing behind
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.75)'
      ctx.lineWidth = 1.2
      ;[-6, 0, 6, 12].forEach((sy, idx) => {
        const lx = bpX + 16 + (idx * 6)
        ctx.beginPath()
        ctx.moveTo(lx, bpY + 14 + sy)
        ctx.lineTo(lx + 18, bpY + 14 + sy)
        ctx.stroke()
      })
    } else if (attFrame === 2) {
      // A3: Billowing Grey Exhaust Smoke Cloud + Afterburner Flame
      ctx.fillStyle = 'rgba(100, 116, 139, 0.75)'
      ctx.beginPath()
      ctx.arc(bpX + 16, bpY + 14, 8, 0, Math.PI * 2)
      ctx.arc(bpX + 24, bpY + 10, 9, 0, Math.PI * 2)
      ctx.arc(bpX + 26, bpY + 18, 7.5, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#f97316'
      ctx.beginPath()
      ctx.moveTo(bpX + 8, bpY + 10)
      ctx.lineTo(bpX + 20, bpY + 14)
      ctx.lineTo(bpX + 8, bpY + 18)
      ctx.closePath()
      ctx.fill()
    } else if (attFrame === 3) {
      // A4: Skid Dust & Smoke Clouds at feet
      ctx.fillStyle = 'rgba(148, 163, 184, 0.7)'
      ctx.beginPath()
      ctx.arc(4, h + 2, 7, 0, Math.PI * 2)
      ctx.arc(-4, h - 2, 8, 0, Math.PI * 2)
      ctx.arc(w - 4, h + 2, 6, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // 2. BIPEDAL MECH LEGS WITH HYDRAULIC PISTONS & RED SABATONS
  if (!isAttack) {
    // IDLE 4-Frame Walking Strides
    let lLegX = 12
    let lLegY = h - 8
    let rLegX = 26
    let rLegY = h - 8

    if (cycleFrame === 0) {
      lLegX = 10
      rLegX = 24
    } else if (cycleFrame === 1) {
      lLegX = 14
      lLegY = h - 11 // raised
      rLegX = 26
    } else if (cycleFrame === 2) {
      lLegX = 26
      rLegX = 8
    } else {
      lLegX = 22
      rLegX = 18
      rLegY = h - 11 // raised
    }

    // Rear Leg (Left)
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(lLegX, lLegY, 6.5, 10)
    ctx.fillStyle = '#dc2626'
    roundRect(ctx, lLegX - 1.5, lLegY + 1, 9, 5.5, 1.5) // Red knee pad
    ctx.fill()
    ctx.fillStyle = '#dc2626'
    roundRect(ctx, lLegX - 2, lLegY + 8, 10, 3.5, 1) // Red ankle armor
    ctx.fill()
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(lLegX - 3, lLegY + 10, 11, 2.5) // Sole

    // Front Leg (Right)
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(rLegX, rLegY, 7, 10)
    ctx.fillStyle = '#b91c1c'
    roundRect(ctx, rLegX - 1.5, rLegY + 1, 9.5, 6, 1.5) // Red knee pad
    ctx.fill()
    ctx.fillStyle = '#b91c1c'
    roundRect(ctx, rLegX - 2, rLegY + 8, 10.5, 4, 1) // Red ankle armor
    ctx.fill()
    ctx.fillStyle = '#020617'
    ctx.fillRect(rLegX - 3, rLegY + 10.5, 12, 2.5) // Sole
  } else {
    // ATTACK Leg Postures
    if (attFrame === 0) {
      // A1: Deep crouch stance
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(10, h - 5, 8, 7)
      ctx.fillRect(24, h - 5, 8, 7)
      ctx.fillStyle = '#dc2626'
      roundRect(ctx, 8, h - 3, 11, 5, 1.5)
      roundRect(ctx, 22, h - 3, 11, 5, 1.5)
      ctx.fill()
    } else if (attFrame === 1 || attFrame === 2) {
      // A2/A3: Horizontal sprint flight trailing behind
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(w - 2, h - 16, 10, 6)
      ctx.fillRect(w + 6, h - 22, 10, 6)
      ctx.fillStyle = '#dc2626'
      roundRect(ctx, w - 1, h - 18, 7, 8, 1.5)
      roundRect(ctx, w + 7, h - 24, 7, 8, 1.5)
      ctx.fill()
    } else {
      // A4: Skid brake stance
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(8, h - 6, 8, 8)
      ctx.fillRect(24, h - 6, 8, 8)
      ctx.fillStyle = '#dc2626'
      roundRect(ctx, 6, h - 4, 11, 6, 1.5)
      roundRect(ctx, 22, h - 4, 11, 6, 1.5)
      ctx.fill()
    }
  }

  // 3. REAR ARM (RIGHT GAUNTLET)
  ctx.fillStyle = '#1e293b'
  roundRect(ctx, w - 14, 16, 6, 12, 2)
  ctx.fill()
  ctx.fillStyle = '#dc2626'
  roundRect(ctx, w - 16, 14, 8, 6, 2) // Shoulder pauldron
  ctx.fill()
  roundRect(ctx, w - 15, 24, 7, 6, 2) // Red fist
  ctx.fill()

  // 4. MAIN HEAVY ARMORED CRIMSON CHASSIS & TORSO
  ctx.fillStyle = boss.hitFlash > 0 ? '#ffffff' : '#b91c1c'
  roundRect(ctx, 6, 4, w - 14, h - 14, 6)
  ctx.fill()
  ctx.strokeStyle = '#020617'
  ctx.lineWidth = 1.6
  ctx.stroke()

  // Red Chest Armor Plate with Top Highlights
  ctx.fillStyle = '#dc2626'
  roundRect(ctx, 8, 12, w - 18, 14, 3)
  ctx.fill()
  ctx.fillStyle = '#f87171'
  ctx.fillRect(10, 13, w - 22, 2) // Highlight bevel

  // Dark Segmented Chest Vent Grilles
  ctx.fillStyle = '#0f172a'
  for (let gy = 20; gy <= 24; gy += 2.5) {
    ctx.fillRect(14, gy, w - 30, 1.2)
  }

  // 5. CRIMSON DOME HELMET & GLOWING CYAN 404 DIGITAL VISOR
  ctx.fillStyle = '#dc2626'
  roundRect(ctx, 12, 0, w - 26, 12, 5)
  ctx.fill()
  ctx.strokeStyle = '#020617'
  ctx.lineWidth = 1.4
  ctx.stroke()

  // Helmet Top Highlight
  ctx.fillStyle = '#f87171'
  ctx.fillRect(16, 1.5, w - 34, 1.5)

  // Shiny Black Visor Housing
  ctx.fillStyle = '#020617'
  roundRect(ctx, 15, 4, w - 30, 8, 2.5)
  ctx.fill()
  ctx.strokeStyle = '#083344'
  ctx.lineWidth = 0.9
  ctx.stroke()

  // Glowing Cyan Digital "404" Matrix Text
  ctx.fillStyle = '#00f0ff'
  ctx.font = 'bold 7px "JetBrains Mono", monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('404', centerX - 1, 8)
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'start'

  // 6. FORWARD LEFT ARM & ROTATING CONICAL DIAMOND DRILL
  let drillX = 2
  let drillY = h / 2 - 2
  let drillRot = !isAttack ? frame * 0.3 : frame * 0.8
  let drillPitch = 0

  if (!isAttack) {
    drillPitch = cycleFrame === 0 ? 0.25 : cycleFrame === 1 ? -0.1 : cycleFrame === 2 ? 0.0 : 0.2
  } else {
    drillPitch = attFrame === 0 ? 0.05 : attFrame === 1 ? 0 : attFrame === 2 ? 0 : 0.4
    drillX = attFrame === 1 ? -4 : attFrame === 2 ? -6 : 2
  }

  // Red Shoulder Pauldron (Left)
  ctx.fillStyle = '#dc2626'
  roundRect(ctx, drillX + 10, drillY - 4, 10, 8, 3)
  ctx.fill()
  ctx.strokeStyle = '#020617'
  ctx.lineWidth = 1
  ctx.stroke()

  // Slate Forearm Mount
  ctx.fillStyle = '#334155'
  roundRect(ctx, drillX + 6, drillY - 2, 7, 6, 2)
  ctx.fill()

  // Diamond Spiral Drill Assembly
  ctx.save()
  ctx.translate(drillX + 6, drillY + 1)
  ctx.rotate(drillPitch)

  // Rotating Drill Cone
  ctx.fillStyle = '#cbd5e1'
  ctx.beginPath()
  ctx.moveTo(0, -7.5)
  ctx.lineTo(-18, 0)
  ctx.lineTo(0, 7.5)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 1.2
  ctx.stroke()

  // Steel Drill Spiral Flute Cuts & Diamond Facets
  for (let fl = 0; fl < 4; fl++) {
    const flPhase = (drillRot + fl * (Math.PI / 2)) % (Math.PI * 2)
    const flX = -3 - fl * 3.5
    const flH = 6.5 - fl * 1.2
    ctx.strokeStyle = (fl % 2 === 0) ? '#475569' : '#00f0ff'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(flX, -flH * Math.cos(flPhase))
    ctx.lineTo(flX - 2.5, flH * Math.sin(flPhase))
    ctx.stroke()
  }

  // Sharp Drill Needle Point
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(-19, -1, 3, 2)

  // ATTACK A3: Massive Circular Shower of Radial Impact Sparks from Drill Tip
  if (isAttack && attFrame === 2) {
    ctx.save()
    const sparkColors = ['#fde047', '#f97316', '#ffffff', '#ea580c']
    for (let spk = 0; spk < 10; spk++) {
      const spkAng = (spk * Math.PI) / 5 + frame * 0.4
      const spkDist = 8 + (spk % 3) * 5
      ctx.fillStyle = sparkColors[spk % sparkColors.length]
      ctx.fillRect(-18 + Math.cos(spkAng) * spkDist, Math.sin(spkAng) * spkDist, 2.5, 2.5)
    }
    // High-RPM White Motion Blur Arcs
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.lineWidth = 1.4
    ctx.beginPath()
    ctx.arc(-8, 0, 9, -Math.PI * 0.4, Math.PI * 0.4)
    ctx.stroke()
    ctx.restore()
  }

  // ATTACK A4: Residual Sparks on Ground
  if (isAttack && attFrame === 3) {
    ctx.fillStyle = '#fde047'
    ;[-14, -18, -22].forEach((sx, idx) => {
      ctx.fillRect(sx, 6 + (idx % 2) * 3, 2, 2)
    })
  }

  ctx.restore()
  ctx.restore()
}

// 7. Boss 2: Toxic Phishing Hydra (1800 pts - Bio-Vat Tank & 3 Undulating Toxic Serpent Heads)
function renderPhishingHydra(ctx, boss, customAction = null, customFrame = null) {
  const frame = customFrame !== null ? customFrame : Date.now() * 0.006
  const isAttack =
    customAction === 'attack' ||
    boss.actionState === 'attack' ||
    (boss.actionState && boss.actionState.includes('VENOM')) ||
    (boss.actionState && boss.actionState.includes('SLIME')) ||
    (boss.actionState && boss.actionState.includes('ACID'))
  const cycleFrame = Math.floor(frame / 6) % 4
  const attFrame = customAction === 'attack' ? cycleFrame : (boss.attackPhase || 0)

  const w = boss.w || 64
  const h = boss.h || 58
  const centerX = w / 2

  // 1. Heavy Reinforced Bio-Vat Tank with Hydraulic Anchor Feet
  ctx.fillStyle = '#1e293b'
  roundRect(ctx, 4, h - 22, w - 8, 22, 4)
  ctx.fill()
  ctx.strokeStyle = '#020617'
  ctx.lineWidth = 1.4
  ctx.stroke()

  // Base platform footings
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(2, h - 4, 8, 4)
  ctx.fillRect(w - 10, h - 4, 8, 4)
  ctx.fillRect(centerX - 6, h - 3, 12, 3)

  // Vertical Fluid Level Meter Tubes with Glowing Green Acid
  ctx.fillStyle = '#020617'
  roundRect(ctx, 8, h - 18, 5, 12, 1)
  roundRect(ctx, w - 13, h - 18, 5, 12, 1)
  ctx.fill()
  ctx.fillStyle = '#22c55e'
  ctx.fillRect(9, h - 16, 3, 8)
  ctx.fillRect(w - 12, h - 16, 3, 8)

  // Dark Iron Reinforcing Hoops
  ctx.fillStyle = '#334155'
  ctx.fillRect(4, h - 20, w - 8, 2.5)
  ctx.fillRect(4, h - 8, w - 8, 2.5)

  // 2. Bubbling Luminescent Lime-Green Slime Overflowing Rim
  ctx.fillStyle = '#10b981'
  ctx.fillRect(6, h - 23, w - 12, 6)
  // Slime drips
  ctx.fillStyle = '#22c55e'
  ctx.fillRect(10, h - 18, 3, 5)
  ctx.fillRect(w - 18, h - 18, 3.5, 7)
  ctx.fillRect(centerX - 2, h - 18, 4, 4)

  // Animated bubbling slime bubbles
  for (let b = 0; b < 4; b++) {
    const bPhase = (frame * 0.3 + b * 1.5) % 3
    const bx = 12 + b * 11
    const by = h - 22 - bPhase * 3
    ctx.fillStyle = '#86efac'
    ctx.beginPath()
    ctx.arc(bx, by, 2, 0, Math.PI * 2)
    ctx.fill()
  }

  // 3. 3 Cybernetic Serpent Heads (Left, Middle, Right)
  const neckGlow = isAttack && attFrame === 0

  ;[-1, 0, 1].forEach((pos, idx) => {
    // S-curve wave offset
    let headYOffset = 0
    let neckSway = 0

    if (!isAttack) {
      // IDLE 4-Frame Undulation (Staggered Heights)
      if (cycleFrame === 0) {
        headYOffset = pos === -1 ? 2 : pos === 0 ? -6 : 5
      } else if (cycleFrame === 1) {
        headYOffset = pos === -1 ? 6 : pos === 0 ? -4 : 0
      } else if (cycleFrame === 2) {
        headYOffset = pos === -1 ? 1 : pos === 0 ? -8 : -3
      } else {
        headYOffset = pos === -1 ? -5 : pos === 0 ? 0 : 4
      }
      neckSway = Math.sin(frame * 0.2 + idx * 2) * 3
    } else {
      // ATTACK Stances
      if (attFrame === 0) {
        headYOffset = -4
      } else if (attFrame === 1 || attFrame === 2) {
        headYOffset = pos === 0 ? -8 : -4
        neckSway = pos * 3
      } else {
        headYOffset = 6 // recoil back into vat
      }
    }

    const hx = centerX + pos * 18 + neckSway
    const hy = 16 + headYOffset

    // Coiling Serpent Neck
    ctx.save()
    if (neckGlow) {
      ctx.strokeStyle = '#86efac'
      ctx.lineWidth = 11
      ctx.beginPath()
      ctx.moveTo(hx, hy + 6)
      ctx.quadraticCurveTo(centerX + pos * 12, (hy + h - 22) / 2, centerX + pos * 14, h - 20)
      ctx.stroke()
    }

    ctx.strokeStyle = neckGlow ? '#22c55e' : '#064e3b'
    ctx.lineWidth = 8
    ctx.beginPath()
    ctx.moveTo(hx, hy + 6)
    ctx.quadraticCurveTo(centerX + pos * 12, (hy + h - 22) / 2, centerX + pos * 14, h - 20)
    ctx.stroke()

    // Inner neck scale segment
    ctx.strokeStyle = neckGlow ? '#ffffff' : '#047857'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(hx, hy + 6)
    ctx.quadraticCurveTo(centerX + pos * 12, (hy + h - 22) / 2, centerX + pos * 14, h - 20)
    ctx.stroke()
    ctx.restore()

    // Viper Head
    ctx.save()
    ctx.translate(hx, hy)
    ctx.fillStyle = neckGlow ? '#22c55e' : '#0f766e'
    roundRect(ctx, -8, -6, 16, 13, 4)
    ctx.fill()
    ctx.strokeStyle = '#022c22'
    ctx.lineWidth = 1.2
    ctx.stroke()

    // Snout and upper jaw
    ctx.fillStyle = neckGlow ? '#86efac' : '#10b981'
    roundRect(ctx, -6, -4, 12, 7, 2)
    ctx.fill()

    // Glowing Crimson Eyes
    ctx.fillStyle = '#ef4444'
    ctx.fillRect(-5, -2, 3, 2.5)
    ctx.fillRect(2, -2, 3, 2.5)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(-4, -1.5, 1, 1)
    ctx.fillRect(3, -1.5, 1, 1)

    // Razor Sharp White Fangs
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(-4, 5, 2, 4)
    ctx.fillRect(2, 5, 2, 4)

    // Dripping Neon Acid Droplets
    ctx.fillStyle = '#22c55e'
    ctx.fillRect(-3, 8, 1.5, 3)
    ctx.fillRect(3, 8, 1.5, 3)
    ctx.restore()

    // 4. ATTACK: Venom Lasers & Acid Sprays
    if (isAttack) {
      if (attFrame === 1) {
        // Frame 1: Criss-Crossing Venom Laser Bolts
        ctx.save()
        ctx.strokeStyle = '#86efac'
        ctx.lineWidth = 2.5
        ;[-1, 1].forEach((crossDir) => {
          ctx.beginPath()
          ctx.moveTo(hx + pos * 4, hy + 6)
          ctx.lineTo(hx - 28, hy + 6 + crossDir * 14)
          ctx.stroke()
        })
        ctx.strokeStyle = '#22c55e'
        ctx.lineWidth = 1.2
        ;[-1, 1].forEach((crossDir) => {
          ctx.beginPath()
          ctx.moveTo(hx + pos * 4, hy + 6)
          ctx.lineTo(hx - 28, hy + 6 + crossDir * 14)
          ctx.stroke()
        })
        ctx.restore()
      } else if (attFrame === 2) {
        // Frame 2: Toxic Acid Spray & Corrosive Vapor Clouds
        ctx.save()
        ctx.fillStyle = 'rgba(34, 197, 94, 0.45)'
        ctx.beginPath()
        ctx.arc(hx - 14, hy + 4, 6, 0, Math.PI * 2)
        ctx.arc(hx - 22, hy - 2, 7.5, 0, Math.PI * 2)
        ctx.fill()

        // Sizzling acid droplets
        ctx.fillStyle = '#86efac'
        ;[-10, -18, -26].forEach((dx, dIdx) => {
          ctx.fillRect(hx + dx, hy + 4 + (dIdx % 2) * 5, 2.5, 2.5)
        })
        ctx.restore()
      }
    }
  })
}

// 8. Boss 3: DDoS Swarm Titan (2500 pts - Monolithic Obsidian Obelisk, Violet Plasma Core & Sawblade Drones)
function renderDDoSTitan(ctx, boss, customAction = null, customFrame = null) {
  const frame = customFrame !== null ? customFrame : (Date.now() * 0.005)
  const isAttack =
    customAction === 'attack' ||
    boss.actionState === 'attack' ||
    (boss.actionState && boss.actionState.includes('SWARM')) ||
    (boss.actionState && boss.actionState.includes('DRONE')) ||
    (boss.actionState && boss.actionState.includes('BEAM'))
  const cycleFrame = Math.floor(frame / 6) % 4
  const attFrame = customAction === 'attack' ? cycleFrame : (boss.attackPhase || 0)

  const w = boss.w || 64
  const h = boss.h || 60
  const centerX = w / 2
  const bobY = !isAttack ? (cycleFrame === 1 ? -2 : cycleFrame === 2 ? 2 : 0) : 0

  ctx.save()
  ctx.translate(0, bobY)

  // 1. Orbiting Deployable Sawblade Escort Drones (Left & Right)
  const droneAng1 = frame * 0.4
  const droneAng2 = frame * 0.4 + Math.PI

  const d1X = centerX + Math.cos(droneAng1) * 28 - (isAttack && attFrame === 2 ? 18 : 0)
  const d1Y = h / 2 + Math.sin(droneAng1) * 12
  const d2X = centerX + Math.cos(droneAng2) * 28 - (isAttack && attFrame === 2 ? 18 : 0)
  const d2Y = h / 2 + Math.sin(droneAng2) * 12

  ;[
    { x: d1X, y: d1Y },
    { x: d2X, y: d2Y },
  ].forEach((dr) => {
    ctx.save()
    ctx.translate(dr.x, dr.y)
    ctx.rotate(frame * 0.8)

    // Outer Sawblade Teeth
    ctx.fillStyle = '#64748b'
    for (let t = 0; t < 6; t++) {
      const a = (t * Math.PI) / 3
      ctx.fillRect(Math.cos(a) * 6 - 1.5, Math.sin(a) * 6 - 1.5, 3.5, 3.5)
    }

    // Sawblade Core
    ctx.fillStyle = '#1e1b4b'
    ctx.beginPath()
    ctx.arc(0, 0, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#a855f7'
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(-1, -1, 2, 2)
    ctx.restore()
  })

  // 2. Monolithic Obsidian Obelisk Chassis with Beveled Apex
  const grad = ctx.createLinearGradient(centerX, 0, centerX, h)
  grad.addColorStop(0, '#3b0764')
  grad.addColorStop(0.3, '#1e1b4b')
  grad.addColorStop(0.7, '#0f0d1e')
  grad.addColorStop(1, '#020617')
  ctx.fillStyle = grad

  // Tapered Obelisk Silhouette
  ctx.beginPath()
  ctx.moveTo(centerX - 10, 4)
  ctx.lineTo(centerX, 0)
  ctx.lineTo(centerX + 10, 4)
  ctx.lineTo(centerX + 16, h - 8)
  ctx.lineTo(centerX, h)
  ctx.lineTo(centerX - 16, h - 8)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = '#8b5cf6'
  ctx.lineWidth = 1.6
  ctx.stroke()

  // Heavy Beveled Edge Facets
  ctx.strokeStyle = '#3b0764'
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(centerX, 0)
  ctx.lineTo(centerX, h)
  ctx.moveTo(centerX - 10, 4)
  ctx.lineTo(centerX - 14, h - 10)
  ctx.moveTo(centerX + 10, 4)
  ctx.lineTo(centerX + 14, h - 10)
  ctx.stroke()

  // 3. Side Missile Bay Hatches (Open during attack)
  const isBayOpen = isAttack && (attFrame === 0 || attFrame === 1 || attFrame === 2)
  if (isBayOpen) {
    // Left Bay
    ctx.fillStyle = '#020617'
    roundRect(ctx, centerX - 24, 14, 8, 22, 2)
    ctx.fill()
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 1
    ctx.stroke()
    // Red LED Missile Tubes
    ctx.fillStyle = '#ef4444'
    ctx.fillRect(centerX - 22, 17, 4, 3)
    ctx.fillRect(centerX - 22, 23, 4, 3)
    ctx.fillRect(centerX - 22, 29, 4, 3)

    // Right Bay
    ctx.fillStyle = '#020617'
    roundRect(ctx, centerX + 16, 14, 8, 22, 2)
    ctx.fill()
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.fillStyle = '#ef4444'
    ctx.fillRect(centerX + 18, 17, 4, 3)
    ctx.fillRect(centerX + 18, 23, 4, 3)
    ctx.fillRect(centerX + 18, 29, 4, 3)
  }

  // 4. Central Pulsating Violet Plasma Reactor Core
  const coreX = centerX
  const coreY = h / 2 - 2
  const isOvercharging = isAttack && attFrame === 0
  const coreR = isOvercharging ? 10 : 7.5

  // Dark Cavity Bezel
  ctx.fillStyle = '#020617'
  ctx.beginPath()
  ctx.arc(coreX, coreY, coreR + 2, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#a855f7'
  ctx.lineWidth = 1.4
  ctx.stroke()

  // Crackling Vertical Lightning Arcs Inside Core Channel
  ctx.strokeStyle = '#c084fc'
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(coreX, 6)
  ctx.lineTo(coreX + (Math.sin(frame * 0.5) * 3), coreY - coreR)
  ctx.moveTo(coreX, h - 8)
  ctx.lineTo(coreX - (Math.cos(frame * 0.5) * 3), coreY + coreR)
  ctx.stroke()

  // Radiant Plasma Core
  const pGrad = ctx.createRadialGradient(coreX, coreY, 1, coreX, coreY, coreR)
  pGrad.addColorStop(0, '#ffffff')
  pGrad.addColorStop(0.3, isOvercharging ? '#fde047' : '#c084fc')
  pGrad.addColorStop(0.7, '#8b5cf6')
  pGrad.addColorStop(1, '#3b0764')
  ctx.fillStyle = pGrad
  ctx.beginPath()
  ctx.arc(coreX, coreY, coreR, 0, Math.PI * 2)
  ctx.fill()

  // 5. ATTACK: 5-Way Swarm Salvo Fan Launch
  if (isAttack) {
    if (attFrame === 0) {
      // Core Nova Flare
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(coreX, coreY, 12, 0, Math.PI * 2)
      ctx.fill()
    } else if (attFrame === 1 || attFrame === 2) {
      // 5-Way Spread Fan of Micro Swarm Rockets
      const angles = [-0.55, -0.28, 0, 0.28, 0.55]
      const dist = attFrame === 1 ? 26 : 48

      angles.forEach((ang) => {
        const rx = coreX - Math.cos(ang) * dist
        const ry = coreY + Math.sin(ang) * dist

        ctx.save()
        ctx.translate(rx, ry)
        ctx.rotate(ang + Math.PI)

        // Trailing purple propulsion streak
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.7)'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(14, 0)
        ctx.lineTo(-4, 0)
        ctx.stroke()

        // Rocket Body
        ctx.fillStyle = '#8b5cf6'
        roundRect(ctx, -5, -2.5, 10, 5, 2)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(-2, -1, 3, 2)

        // Exhaust smoke puffs (Frame 2)
        if (attFrame === 2) {
          ctx.fillStyle = 'rgba(148, 163, 184, 0.5)'
          ctx.beginPath()
          ctx.arc(10, 0, 3, 0, Math.PI * 2)
          ctx.arc(16, (Math.random() - 0.5) * 4, 3.5, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      })
    }
  }

  ctx.restore()
}

// 9. Boss 4: DNS Hijacker Prime (3200 pts - Quantum Saucer, Concentric 3D Gyro Rings, Ion Rail Beam & Coordinate Grid)
function renderDNSSaucer(ctx, boss, customAction = null, customFrame = null) {
  const frame = customFrame !== null ? customFrame : (Date.now() * 0.006)
  const isAttack =
    customAction === 'attack' ||
    boss.actionState === 'attack' ||
    (boss.actionState && boss.actionState.includes('RAIL')) ||
    (boss.actionState && boss.actionState.includes('WARP')) ||
    (boss.actionState && boss.actionState.includes('GRAVITY')) ||
    (boss.actionState && boss.actionState.includes('LASER'))
  const cycleFrame = Math.floor(frame / 6) % 4
  const attFrame = customAction === 'attack' ? cycleFrame : (boss.attackPhase || 0)

  const w = boss.w || 64
  const h = boss.h || 48
  const centerX = w / 2

  // 1. Concentric 3D Levitating Orbital Gyro-Rings
  const isRingsLocked = isAttack && (attFrame === 0 || attFrame === 1 || attFrame === 2)
  const ringTilt1 = isRingsLocked ? 0 : Math.sin(frame * 0.25) * 0.6
  const ringTilt2 = isRingsLocked ? 0 : Math.cos(frame * 0.25) * 0.6

  // Outer Gyro-Ring
  ctx.save()
  ctx.translate(centerX, h / 2)
  ctx.rotate(ringTilt1)
  ctx.strokeStyle = '#06b6d4'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.ellipse(0, 0, w * 0.52, h * 0.38, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.strokeStyle = '#a5f3fc'
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.ellipse(0, 0, w * 0.52, h * 0.38, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()

  // Inner Gyro-Ring
  ctx.save()
  ctx.translate(centerX, h / 2)
  ctx.rotate(ringTilt2 + Math.PI * 0.3)
  ctx.strokeStyle = '#0891b2'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.ellipse(0, 0, w * 0.44, h * 0.3, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()

  // 2. Ventral Ion Engine Thruster & Warp Flames
  ctx.fillStyle = '#0f172a'
  roundRect(ctx, centerX - 7, h / 2 + 6, 14, 8, 3)
  ctx.fill()
  ctx.strokeStyle = '#06b6d4'
  ctx.lineWidth = 1
  ctx.stroke()

  if (!isAttack) {
    const warpLen = 6 + Math.sin(frame * 0.4) * 3
    ctx.fillStyle = '#00f0ff'
    ctx.beginPath()
    ctx.moveTo(centerX - 5, h / 2 + 14)
    ctx.lineTo(centerX, h / 2 + 14 + warpLen)
    ctx.lineTo(centerX + 5, h / 2 + 14)
    ctx.closePath()
    ctx.fill()
  }

  // 3. Metallic Chrome & Cyan Disc Hull
  const sGrad = ctx.createLinearGradient(centerX, 4, centerX, h)
  sGrad.addColorStop(0, '#67e8f9')
  sGrad.addColorStop(0.3, '#0891b2')
  sGrad.addColorStop(0.7, '#0e7490')
  sGrad.addColorStop(1, '#083344')
  ctx.fillStyle = sGrad
  ctx.beginPath()
  ctx.ellipse(centerX, h / 2, w * 0.42, h * 0.22, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#020617'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Hull Rim Light Trims
  ctx.strokeStyle = '#a5f3fc'
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.ellipse(centerX, h / 2 + 1, w * 0.36, h * 0.16, 0, 0, Math.PI * 2)
  ctx.stroke()

  // 4. Glowing Aqua Cockpit Dome with Specular Glint
  ctx.fillStyle = '#00f0ff'
  ctx.beginPath()
  ctx.arc(centerX, h / 2 - 3, 11, Math.PI, 0)
  ctx.fill()
  ctx.strokeStyle = '#a5f3fc'
  ctx.lineWidth = 1.2
  ctx.stroke()

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(centerX - 6, h / 2 - 11, 5, 3)

  // 5. ATTACK: Ion Rail Beam & Quantum Coordinate Grid
  if (isAttack) {
    if (attFrame === 0) {
      // Frame 0: Charging Ventral Ion Emitter
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(centerX - 18, h / 2, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#00f0ff'
      ctx.lineWidth = 2
      ctx.stroke()
    } else if (attFrame === 1 || attFrame === 2) {
      // Frame 1/2: Massive Horizontal Cyan Rail Beam + Dispersion Rings
      ctx.save()
      // Concentric Particle Dispersion Rings
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)'
      ctx.lineWidth = 1.6
      ;[centerX - 24, centerX - 34].forEach((rx, idx) => {
        ctx.beginPath()
        ctx.ellipse(rx, h / 2, 5 + idx * 3, 11 + idx * 5, 0, 0, Math.PI * 2)
        ctx.stroke()
      })

      // Quantum Coordinate Targeting Grid (Frame 2)
      if (attFrame === 2) {
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)'
        ctx.lineWidth = 0.8
        for (let gx = -10; gx < centerX - 20; gx += 8) {
          ctx.beginPath()
          ctx.moveTo(gx, h / 2 - 18)
          ctx.lineTo(gx, h / 2 + 18)
          ctx.stroke()
        }
        for (let gy = h / 2 - 16; gy <= h / 2 + 16; gy += 8) {
          ctx.beginPath()
          ctx.moveTo(-10, gy)
          ctx.lineTo(centerX - 20, gy)
          ctx.stroke()
        }
      }

      // Main Blinding Rail Beam
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)'
      ctx.lineWidth = 14
      ctx.beginPath()
      ctx.moveTo(centerX - 18, h / 2)
      ctx.lineTo(-40, h / 2)
      ctx.stroke()

      ctx.strokeStyle = '#00f0ff'
      ctx.lineWidth = 8
      ctx.beginPath()
      ctx.moveTo(centerX - 18, h / 2)
      ctx.lineTo(-40, h / 2)
      ctx.stroke()

      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 3.5
      ctx.beginPath()
      ctx.moveTo(centerX - 18, h / 2)
      ctx.lineTo(-40, h / 2)
      ctx.stroke()
      ctx.restore()
    } else {
      // Frame 3: Steam Vapor Clouds from Ring Exhausts
      ctx.fillStyle = 'rgba(165, 243, 252, 0.65)'
      ctx.beginPath()
      ctx.arc(centerX - 20, h / 2 - 8, 4, 0, Math.PI * 2)
      ctx.arc(centerX + 20, h / 2 - 8, 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

// 10. Boss 5: Ransomware Dreadnought (4200 pts - Gothic Castle Fortress Tank, 4 Smokestacks & Padlock Core)
function renderRansomDreadnought(ctx, boss, customAction = null, customFrame = null) {
  const frame = customFrame !== null ? customFrame : (Date.now() * 0.007)
  const isAttack =
    customAction === 'attack' ||
    boss.actionState === 'attack' ||
    (boss.actionState && boss.actionState.includes('FIREWALL')) ||
    (boss.actionState && boss.actionState.includes('SKULL')) ||
    (boss.actionState && boss.actionState.includes('GRINDER'))
  const cycleFrame = Math.floor(frame / 6) % 4
  const attFrame = customAction === 'attack' ? cycleFrame : (boss.attackPhase || 0)

  const w = boss.w || 68
  const h = boss.h || 58
  const centerX = w / 2

  // 1. Four Smoking Industrial Chimney Smokestacks
  ;[10, 20, w - 24, w - 14].forEach((cx, idx) => {
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(cx, 0, 5, 8)
    ctx.strokeStyle = '#0f172a'
    ctx.lineWidth = 1
    ctx.strokeRect(cx, 0, 5, 8)

    // Dark soot smoke puffs
    const sPhase = (frame * 0.2 + idx * 1.2) % 3
    ctx.fillStyle = 'rgba(51, 65, 85, 0.75)'
    ctx.beginPath()
    ctx.arc(cx + 2 - sPhase * 2, -4 - sPhase * 5, 3 + sPhase * 1.5, 0, Math.PI * 2)
    ctx.fill()
  })

  // 2. Heavy Caterpillar Tank Treads & Rolling Bogie Wheels
  ctx.fillStyle = '#0f172a'
  roundRect(ctx, 2, h - 14, w - 4, 14, 5)
  ctx.fill()
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 1.4
  ctx.stroke()

  // 5 Bogie Wheels
  const treadOffset = Math.sin(frame * 0.3) * 2
  for (let wheel = 0; wheel < 5; wheel++) {
    const wx = 8 + wheel * 13 + treadOffset
    ctx.fillStyle = '#334155'
    ctx.beginPath()
    ctx.arc(wx, h - 7, 4.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#64748b'
    ctx.fillRect(wx - 1, h - 8, 2, 2)
  }

  // 3. Black Iron Gothic Castle Fortress with Battlements & Stone Turrets
  ctx.fillStyle = '#1e293b'
  roundRect(ctx, 4, 8, w - 8, h - 22, 4)
  ctx.fill()
  ctx.strokeStyle = '#020617'
  ctx.lineWidth = 1.6
  ctx.stroke()

  // Castle Crenellations (Top Battlements)
  ctx.fillStyle = '#0f172a'
  for (let bx = 6; bx < w - 8; bx += 8) {
    ctx.fillRect(bx, 5, 5, 4)
  }

  // Stone Brick Texture
  ctx.fillStyle = '#78350f'
  ctx.fillRect(6, 18, 12, 14)
  ctx.fillRect(w - 18, 18, 12, 14)

  // 4. Heavy Forward Dual Artillery Cannons
  let cannonAngle = isAttack ? -Math.PI * 0.25 : -Math.PI * 0.15
  ctx.save()
  ctx.translate(14, 26)
  ctx.rotate(cannonAngle)
  ctx.fillStyle = '#334155'
  roundRect(ctx, -14, -4, 18, 8, 2)
  ctx.fill()
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.restore()

  ctx.save()
  ctx.translate(w - 14, 26)
  ctx.rotate(-Math.PI + cannonAngle)
  ctx.fillStyle = '#334155'
  roundRect(ctx, -14, -4, 18, 8, 2)
  ctx.fill()
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.restore()

  // 5. Central Fortified Gate & Glowing Golden Padlock Core
  const lockGateX = centerX - 8
  const lockGateY = 16
  const isGateGlowing = isAttack && (attFrame === 0 || attFrame === 1)

  ctx.fillStyle = isGateGlowing ? '#78350f' : '#020617'
  roundRect(ctx, lockGateX, lockGateY, 16, 18, 4)
  ctx.fill()
  ctx.strokeStyle = isGateGlowing ? '#f59e0b' : '#334155'
  ctx.lineWidth = 1.4
  ctx.stroke()

  // Padlock Emblem
  ctx.fillStyle = isGateGlowing ? '#fde047' : '#f59e0b'
  roundRect(ctx, lockGateX + 3, lockGateY + 5, 10, 9, 2)
  ctx.fill()
  ctx.strokeStyle = '#78350f'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(centerX, lockGateY + 5, 3.5, Math.PI, 0)
  ctx.stroke()
  ctx.fillStyle = '#020617'
  ctx.fillRect(centerX - 1, lockGateY + 8, 2, 3)

  // 6. ATTACK: Incendiary Firewall Spikes & Pixel Skull Mines
  if (isAttack) {
    if (attFrame === 1 || attFrame === 2) {
      // Massive Incendiary Firewall Spikes from Cannons
      ;[14, w - 14].forEach((cx, idx) => {
        ctx.save()
        ctx.translate(cx, 26)
        ctx.rotate(idx === 0 ? -Math.PI * 0.25 : -Math.PI * 0.75)

        // Blazing Muzzle Flash
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(-18, 0, 5, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#fbbf24'
        ctx.beginPath()
        ctx.moveTo(-16, -6)
        ctx.lineTo(-32, 0)
        ctx.lineTo(-16, 6)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = '#ea580c'
        ctx.beginPath()
        ctx.moveTo(-18, -4)
        ctx.lineTo(-40, 0)
        ctx.lineTo(-18, 4)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      })

      // Frame 2: Floating Pixel Proximity Skull Mines
      if (attFrame === 2) {
        ;[-18, 0, 18].forEach((sx, sIdx) => {
          const skX = centerX + sx
          const skY = -12 - (sIdx % 2) * 8

          ctx.fillStyle = '#e2e8f0'
          roundRect(ctx, skX - 4, skY - 4, 8, 7, 2)
          ctx.fill()
          ctx.fillStyle = '#ef4444'
          ctx.fillRect(skX - 2.5, skY - 2, 1.5, 1.5)
          ctx.fillRect(skX + 1, skY - 2, 1.5, 1.5)
        })
      }
    } else if (attFrame === 3) {
      // Cooldown Barrel Red Heat Glow & Smoke
      ctx.fillStyle = 'rgba(239, 68, 68, 0.75)'
      ctx.fillRect(4, 20, 4, 4)
      ctx.fillRect(w - 8, 20, 4, 4)
    }
  }
}

// 11. Boss 6: Zero-Day Overlord (Final Boss - 5000 pts - 6-Winged Celestial Prismatic Seraph & Singularity Core)
function renderZeroDayOverlord(ctx, boss, customAction = null, customFrame = null) {
  const frame = customFrame !== null ? customFrame : (Date.now() * 0.006)
  const isAttack =
    customAction === 'attack' ||
    boss.actionState === 'attack' ||
    (boss.actionState && boss.actionState.includes('STARBURST')) ||
    (boss.actionState && boss.actionState.includes('SMITE')) ||
    (boss.actionState && boss.actionState.includes('VOID'))
  const cycleFrame = Math.floor(frame / 6) % 4
  const attFrame = customAction === 'attack' ? cycleFrame : (boss.attackPhase || 0)

  const w = boss.w || 74
  const h = boss.h || 64
  const centerX = w / 2

  // Wing Span Sweep Motion across 4 frames
  let wingSpan = 0
  if (!isAttack) {
    // IDLE: 0 (Neutral), 1 (Wide Fan), 2 (High Divine Arc), 3 (Downward Protective Guard)
    wingSpan = cycleFrame === 0 ? 0 : cycleFrame === 1 ? 8 : cycleFrame === 2 ? 14 : -12
  } else {
    wingSpan = attFrame === 0 ? 6 : attFrame === 1 ? 16 : attFrame === 2 ? 20 : -14
  }

  // 1. Six Prismatic Crystal Wings with Chromatic Rainbow Gradients
  ;[-1, 1].forEach((dir) => {
    // Upper Pair (Prismatic Magenta / Cyan Gradient)
    const uGrad = ctx.createLinearGradient(centerX, h / 2, centerX + dir * 38, h / 2 - 24 - wingSpan)
    uGrad.addColorStop(0, '#ec4899')
    uGrad.addColorStop(0.5, '#06b6d4')
    uGrad.addColorStop(1, '#fde047')
    ctx.fillStyle = uGrad
    ctx.beginPath()
    ctx.moveTo(centerX + dir * 6, h / 2 - 4)
    ctx.lineTo(centerX + dir * (34 + wingSpan * 0.6), h / 2 - 24 - wingSpan)
    ctx.lineTo(centerX + dir * 18, h / 2 + 2)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1.2
    ctx.stroke()

    // Middle Pair (Cosmic Purple / Electric Cyan)
    const mGrad = ctx.createLinearGradient(centerX, h / 2, centerX + dir * 42, h / 2)
    mGrad.addColorStop(0, '#8b5cf6')
    mGrad.addColorStop(0.6, '#38bdf8')
    mGrad.addColorStop(1, '#ffffff')
    ctx.fillStyle = mGrad
    ctx.beginPath()
    ctx.moveTo(centerX + dir * 6, h / 2)
    ctx.lineTo(centerX + dir * (38 + wingSpan * 0.4), h / 2 + 2 + wingSpan * 0.3)
    ctx.lineTo(centerX + dir * 16, h / 2 + 16)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1
    ctx.stroke()

    // Lower Pair (Prismatic Gold / Magenta)
    const lGrad = ctx.createLinearGradient(centerX, h / 2, centerX + dir * 28, h / 2 + 28)
    lGrad.addColorStop(0, '#facc15')
    lGrad.addColorStop(0.7, '#ec4899')
    lGrad.addColorStop(1, '#3b0764')
    ctx.fillStyle = lGrad
    ctx.beginPath()
    ctx.moveTo(centerX + dir * 4, h / 2 + 6)
    ctx.lineTo(centerX + dir * (26 - wingSpan * 0.4), h / 2 + 26 + wingSpan * 0.5)
    ctx.lineTo(centerX + dir * 10, h / 2 + 18)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1
    ctx.stroke()
  })

  // 2. Levitating Golden Corona Halo Ring with Crown Spikes
  const isCoronaOvercharged = isAttack && (attFrame === 0 || attFrame === 1)
  const haloR = isCoronaOvercharged ? 14 : 10

  ctx.strokeStyle = isCoronaOvercharged ? '#ffffff' : '#fbbf24'
  ctx.lineWidth = isCoronaOvercharged ? 3.5 : 2.2
  ctx.beginPath()
  ctx.ellipse(centerX, 4, haloR, 4, 0, 0, Math.PI * 2)
  ctx.stroke()

  // Crown Spikes
  ctx.fillStyle = '#fde047'
  ;[-6, 0, 6].forEach((sx) => {
    ctx.beginPath()
    ctx.moveTo(centerX + sx - 2, 4)
    ctx.lineTo(centerX + sx, isCoronaOvercharged ? -6 : -2)
    ctx.lineTo(centerX + sx + 2, 4)
    ctx.closePath()
    ctx.fill()
  })

  // 3. Central Obsidian Singularity Core
  ctx.fillStyle = '#020617'
  ctx.beginPath()
  ctx.arc(centerX, h / 2, 8.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 1.4
  ctx.stroke()

  // Inner Swirling Black Hole Core Eye
  const cGrad = ctx.createRadialGradient(centerX, h / 2, 1, centerX, h / 2, 7.5)
  cGrad.addColorStop(0, '#ffffff')
  cGrad.addColorStop(0.3, '#38bdf8')
  cGrad.addColorStop(0.7, '#ec4899')
  cGrad.addColorStop(1, '#020617')
  ctx.fillStyle = cGrad
  ctx.beginPath()
  ctx.arc(centerX, h / 2, 6.5, 0, Math.PI * 2)
  ctx.fill()

  // 4. ATTACK: 6-Way Prismatic Starburst, Golden Lightning & Dual Void Vortexes
  if (isAttack) {
    if (attFrame === 1) {
      // Vertical Golden Lightning Smite Pillars
      ctx.save()
      ctx.strokeStyle = '#fde047'
      ctx.lineWidth = 2.5
      ;[-16, 16].forEach((lx) => {
        ctx.beginPath()
        ctx.moveTo(centerX + lx, -20)
        ctx.lineTo(centerX + lx + 3, h / 2 - 10)
        ctx.lineTo(centerX + lx - 2, h / 2 + 10)
        ctx.lineTo(centerX + lx + 4, h + 20)
        ctx.stroke()
      })
      ctx.restore()
    } else if (attFrame === 2) {
      // Full Cosmic Explosion: 6-Way Prismatic Starburst + Dual Swirling Black Holes
      ctx.save()
      const starColors = ['#fde047', '#00f0ff', '#ec4899', '#ffffff', '#a855f7', '#22c55e']

      // 6-Way Starburst Rays
      for (let r = 0; r < 6; r++) {
        const sAng = (r * Math.PI) / 3
        ctx.strokeStyle = starColors[r % starColors.length]
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(centerX, h / 2)
        ctx.lineTo(centerX + Math.cos(sAng) * 65, h / 2 + Math.sin(sAng) * 65)
        ctx.stroke()
      }

      // Dual Swirling Void Vortexes
      ;[-22, 22].forEach((vx) => {
        ctx.fillStyle = '#020617'
        ctx.beginPath()
        ctx.arc(centerX + vx, h / 2, 9, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#ec4899'
        ctx.lineWidth = 1.8
        ctx.beginPath()
        ctx.arc(centerX + vx, h / 2, 11, 0, Math.PI * 2)
        ctx.stroke()
      })
      ctx.restore()
    } else if (attFrame === 3) {
      // Falling Residual Rainbow Pixel Sparks
      const sparkColors = ['#fde047', '#00f0ff', '#ec4899', '#ffffff']
      ;[-18, -8, 0, 8, 18].forEach((sx, idx) => {
        ctx.fillStyle = sparkColors[idx % sparkColors.length]
        ctx.fillRect(centerX + sx, h / 2 + 22 + (idx % 3) * 6, 2, 3)
      })
    }
  }
}

// Unified Boss Sprite Dispatcher with Action Badges & Telegraphs
function renderBoss(ctx, boss) {
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

  // Dispatch to high-fidelity 16-bit arcade pixel art procedural renderers
  if (boss.type === 'phishing_hydra') {
    renderPhishingHydra(ctx, boss)
  } else if (boss.type === 'ddos_titan') {
    renderDDoSTitan(ctx, boss)
  } else if (boss.type === 'dns_saucer') {
    renderDNSSaucer(ctx, boss)
  } else if (boss.type === 'ransom_dreadnought') {
    renderRansomDreadnought(ctx, boss)
  } else if (boss.type === 'zero_day_overlord') {
    renderZeroDayOverlord(ctx, boss)
  } else {
    renderBossMech(ctx, boss)
  }

  // Floating Action State Badge (e.g. [CHARGING LASER], [MISSILE BARRAGE])
  if (boss.actionState && boss.phase === 'battle') {
    ctx.save()
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'
    roundRect(ctx, -14, -15, boss.w + 28, 13, 3)
    ctx.fill()
    ctx.strokeStyle = boss.color || '#ef4444'
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.fillStyle = '#fde047'
    ctx.font = 'bold 7px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(boss.actionState, boss.w / 2, -8.5)
    ctx.restore()
  }

  ctx.restore()

  // Render Telegraph Warning Lines (laser aim, sky pillar, mortar reticle, thunder strike)
  if (boss.telegraph && boss.telegraph.timer > 0) {
    ctx.save()
    const tg = boss.telegraph
    const alpha = (tg.timer % 6 < 3) ? 0.9 : 0.45
    if (tg.type === 'laser') {
      // Horizontal charging laser guide
      ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`
      ctx.lineWidth = 2
      ctx.setLineDash([6, 4])
      ctx.beginPath()
      ctx.moveTo(0, tg.y)
      ctx.lineTo(boss.x, tg.y)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = '#ef4444'
      ctx.font = 'bold 7.5px "JetBrains Mono", monospace'
      ctx.fillText('⚠️ DANGER: LASER SWEEP', 15, tg.y - 4)
    } else if (tg.type === 'pillar') {
      // Vertical sky judgement pillar
      ctx.fillStyle = `rgba(251, 191, 36, ${alpha * 0.35})`
      ctx.fillRect(tg.x - 14, 0, 28, 330)
      ctx.strokeStyle = '#fbbf24'
      ctx.lineWidth = 1.5
      ctx.strokeRect(tg.x - 14, 0, 28, 330)
      ctx.fillStyle = '#fbbf24'
      ctx.font = 'bold 7.5px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.fillText('⚡ JUDGEMENT ZONE', tg.x, 38)
    } else if (tg.type === 'thunder') {
      // Dynamic Crackling Sky Lightning Strike & Danger Warning
      ctx.fillStyle = `rgba(6, 182, 212, ${alpha * 0.3})`
      ctx.fillRect(tg.x - 16, 0, 32, 330)
      ctx.strokeStyle = '#00f0ff'
      ctx.lineWidth = 1.6
      ctx.strokeRect(tg.x - 16, 0, 32, 330)

      // Crackling Jagged Electric Bolt
      ctx.strokeStyle = alpha > 0.6 ? '#ffffff' : '#facc15'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(tg.x, 0)
      ctx.lineTo(tg.x - 6, 60)
      ctx.lineTo(tg.x + 8, 120)
      ctx.lineTo(tg.x - 5, 180)
      ctx.lineTo(tg.x + 4, 240)
      ctx.lineTo(tg.x, 290)
      ctx.stroke()

      // Target Shockwave Ring on Ground
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.ellipse(tg.x, 240, 18, 6, 0, 0, Math.PI * 2)
      ctx.stroke()

      ctx.fillStyle = '#38bdf8'
      ctx.font = 'bold 7.5px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.fillText('⚡ QUANTUM THUNDER', tg.x, 34)
    } else if (tg.type === 'mortar') {
      // Ground landing target reticle
      ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(tg.x, tg.y, 10, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(tg.x - 12, tg.y)
      ctx.lineTo(tg.x + 12, tg.y)
      ctx.moveTo(tg.x, tg.y - 12)
      ctx.lineTo(tg.x, tg.y + 12)
      ctx.stroke()
    }
    ctx.restore()
  }

  // Render Rich Boss Projectiles with Particle Trails
  if (boss.bullets && boss.bullets.length > 0) {
    ctx.save()
    for (let i = 0; i < boss.bullets.length; i++) {
      const b = boss.bullets[i]
      ctx.save()
      ctx.translate(Math.round(b.x), Math.round(b.y))

      if (b.type === 'sawblade' || b.type === 'grinder') {
        // Rotating Diamond Sawblade / Grinder with Spark Trails
        b.rot = (b.rot || 0) + 0.35
        ctx.rotate(b.rot)
        ctx.fillStyle = '#94a3b8'
        ctx.beginPath()
        ctx.arc(0, 0, b.size + 1, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#ea580c'
        for (let t = 0; t < 6; t++) {
          const a = (t * Math.PI) / 3
          ctx.fillRect(Math.cos(a) * (b.size - 1) - 1.5, Math.sin(a) * (b.size - 1) - 1.5, 3, 3)
        }
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(-2, -2, 4, 4)
      } else if (b.type === 'laser_sweep') {
        // High-Speed Red Laser Core
        ctx.fillStyle = 'rgba(239, 68, 68, 0.4)'
        roundRect(ctx, -14, -4, 28, 8, 3)
        ctx.fill()
        ctx.fillStyle = '#ef4444'
        roundRect(ctx, -10, -2, 20, 4, 2)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(-7, -1, 14, 2)
      } else if (b.type === 'fireball') {
        // Burning Pixel Fireball with Pulsing Flame Core
        b.rot = (b.rot || 0) + 0.3
        ctx.fillStyle = 'rgba(249, 115, 22, 0.45)'
        ctx.beginPath()
        ctx.arc(0, 0, (b.size || 5) + 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#f97316'
        ctx.beginPath()
        ctx.arc(0, 0, b.size || 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#fde047'
        ctx.beginPath()
        ctx.arc(-1, 0, (b.size || 5) * 0.6, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(-1.5, -1.5, 3, 3)
      } else if (b.type === 'energy_bullet') {
        // High-Velocity Piercing Cyan / White Energy Round
        ctx.fillStyle = '#00f0ff'
        roundRect(ctx, -8, -3, 16, 6, 2)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        roundRect(ctx, -5, -1.5, 10, 3, 1)
        ctx.fill()
      } else if (b.type === 'venom_cross' || b.type === 'venom') {
        // Criss-Crossing Bioluminescent Venom Sparks
        b.rot = (b.rot || 0) + 0.25
        ctx.rotate(b.rot)
        ctx.fillStyle = '#10b981'
        roundRect(ctx, -b.size, -b.size, b.size * 2, b.size * 2, 2)
        ctx.fill()
        ctx.fillStyle = '#a7f3d0'
        roundRect(ctx, -b.size * 0.5, -b.size * 0.5, b.size, b.size, 1)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(-1, -1, 2, 2)
      } else if (b.type === 'slime_wave' || b.type === 'venom_wave') {
        // Weaving Bioluminescent Slime Wave
        ctx.fillStyle = '#10b981'
        ctx.beginPath()
        ctx.arc(0, 0, b.size + 1, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#a7f3d0'
        ctx.fillRect(-2, -2, 4, 4)
        ctx.fillStyle = '#34d399'
        ctx.fillRect(2, -1, 3, 2)
      } else if (b.type === 'mortar' || b.type === 'acid_mortar') {
        // Arcing Toxic Slime Mortar Canister
        ctx.fillStyle = '#065f46'
        roundRect(ctx, -b.size, -b.size, b.size * 2, b.size * 2, 3)
        ctx.fill()
        ctx.fillStyle = '#10b981'
        ctx.fillRect(-b.size + 2, -b.size + 2, (b.size - 2) * 2, (b.size - 2) * 2)
        ctx.fillStyle = '#a7f3d0'
        ctx.fillRect(-1.5, -1.5, 3, 3)
      } else if (b.type === 'rocket') {
        // Swarm Micro-Rocket with Thruster Flame
        ctx.fillStyle = '#8b5cf6'
        roundRect(ctx, -b.size, -2.5, b.size * 2, 5, 2)
        ctx.fill()
        ctx.fillStyle = '#fbbf24'
        ctx.fillRect(-b.size + 2, -1.5, 3, 3)
        ctx.fillStyle = '#f97316'
        ctx.fillRect(b.size - 1, -1, 4, 2) // flame
      } else if (b.type === 'shockwave') {
        // Expanding Hexagonal Shield Nova
        ctx.strokeStyle = '#c084fc'
        ctx.lineWidth = 2.5
        ctx.beginPath()
        ctx.arc(0, 0, b.size + 2, 0, Math.PI * 2)
        ctx.stroke()
        ctx.fillStyle = 'rgba(192, 132, 252, 0.25)'
        ctx.fill()
      } else if (b.type === 'warp_beam' || b.type === 'beam') {
        // Cyan Ion Rail Beam
        ctx.fillStyle = '#06b6d4'
        roundRect(ctx, -12, -3, 24, 6, 2)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(-8, -1.5, 16, 3)
      } else if (b.type === 'gravity_orb') {
        // Quantum Gravity Singularity with Orbiting Trap Particles
        b.rot = (b.rot || 0) + 0.15
        ctx.fillStyle = 'rgba(168, 85, 247, 0.4)'
        ctx.beginPath()
        ctx.arc(0, 0, b.size + 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#7c3aed'
        ctx.beginPath()
        ctx.arc(0, 0, b.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#c084fc'
        for (let o = 0; o < 3; o++) {
          const oa = b.rot + (o * Math.PI * 2) / 3
          ctx.fillRect(Math.cos(oa) * (b.size + 2) - 1, Math.sin(oa) * (b.size + 2) - 1, 2.5, 2.5)
        }
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(-2, -2, 4, 4)
      } else if (b.type === 'firewall_spikes' || b.type === 'spike') {
        // Fiery Ransomware Firewall Jet / Spikes
        ctx.fillStyle = '#f97316'
        roundRect(ctx, -6, -5, 12, 10, 2)
        ctx.fill()
        ctx.fillStyle = '#fef08a'
        ctx.fillRect(-3, -2, 6, 4)
        ctx.fillStyle = '#dc2626'
        ctx.fillRect(-8, -3, 3, 6)
      } else if (b.type === 'skull_mines' || b.type === 'mine') {
        // Floating Ransom Pixel Skull Mine with Glowing Red Eyes
        ctx.fillStyle = '#e2e8f0'
        roundRect(ctx, -b.size, -b.size, b.size * 2, b.size * 1.6, 3)
        ctx.fill()
        ctx.fillRect(-b.size * 0.5, b.size * 0.6 - 2, b.size, 4)
        ctx.strokeStyle = '#334155'
        ctx.lineWidth = 1
        ctx.stroke()
        // Glowing Red Eyes
        ctx.fillStyle = '#ef4444'
        ctx.fillRect(-3.5, -2, 2.5, 2.5)
        ctx.fillRect(1, -2, 2.5, 2.5)
        // Teeth
        ctx.fillStyle = '#0f172a'
        ctx.fillRect(-2, b.size * 0.6 - 1, 1.5, 2)
        ctx.fillRect(0.5, b.size * 0.6 - 1, 1.5, 2)
      } else if (b.type === 'prismatic_star' || b.type === 'star') {
        // 5-Way Archangel Cosmic Star with Comet Rainbow Glow
        const starColors = ['#ef4444', '#f97316', '#22c55e', '#06b6d4', '#a855f7']
        ctx.fillStyle = b.starColor || starColors[(i + (b.starIdx || 0)) % 5]
        ctx.beginPath()
        ctx.arc(0, 0, b.size + 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(-2, -2, 4, 4)
        ctx.fillStyle = '#fde047'
        ctx.fillRect(-1, -1, 2, 2)
      } else if (b.type === 'void_vortex' || b.type === 'vortex') {
        // Black Hole Dual Core Vortex with Accretion Horizon
        b.rot = (b.rot || 0) + 0.2
        ctx.rotate(b.rot)
        ctx.fillStyle = '#030712'
        ctx.beginPath()
        ctx.arc(0, 0, b.size + 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#a855f7'
        ctx.lineWidth = 1.8
        ctx.stroke()
        ctx.fillStyle = '#ec4899'
        for (let v = 0; v < 4; v++) {
          const va = (v * Math.PI) / 2
          ctx.fillRect(Math.cos(va) * (b.size + 1) - 1.5, Math.sin(va) * (b.size + 1) - 1.5, 3, 3)
        }
      } else {
        // Standard 404 Glitch Saw Orb
        ctx.fillStyle = 'rgba(239, 68, 68, 0.4)'
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
      }
      ctx.restore()
    }
    ctx.restore()
  }
}

// Boss Health Bar Overlay HUD (with Danger Alert Pulse when Low HP)
function renderBossHud(ctx, boss, w) {
  if (!boss || boss.hp <= 0) return
  const barW = 220
  const barH = 15
  const barX = (w - barW) / 2
  const barY = 28

  const pct = Math.max(0, Math.min(1, boss.hp / boss.maxHp))
  const isDanger = pct <= 0.30
  const dangerGlow = isDanger ? (Date.now() % 400 < 200 ? '#ef4444' : '#fbbf24') : (boss.color || '#ef4444')

  ctx.save()
  ctx.fillStyle = '#090d16'
  roundRect(ctx, barX - 2, barY - 1, barW + 4, barH + 2, 4)
  ctx.fill()
  ctx.strokeStyle = dangerGlow
  ctx.lineWidth = isDanger ? 2 : 1.4
  ctx.stroke()

  const fillW = Math.max(0, Math.round((barW - 2) * pct))
  const grad = ctx.createLinearGradient(barX, 0, barX + barW, 0)
  grad.addColorStop(0, '#ef4444')
  grad.addColorStop(0.5, '#f59e0b')
  grad.addColorStop(1, '#22c55e')
  ctx.fillStyle = grad
  roundRect(ctx, barX + 1, barY + 1, fillW, barH - 2, 2)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 8.5px "JetBrains Mono", monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`☠️ ${boss.name}: ${Math.round(pct * 100)}% [${boss.hp}/${boss.maxHp} HP]`, w / 2, barY + barH / 2)
  ctx.restore()
}

// Final 6 Progressive Boss Milestones with Calibrated Pure Mob-Defeat Pacing
const BOSS_MILESTONES = [
  { score: 250, name: 'MEGABYTE SQUATTER', type: 'squatter_mech', hp: 55, reward: 0, color: '#ef4444' },
  { score: 650, name: 'PHISHING HYDRA', type: 'phishing_hydra', hp: 85, reward: 0, color: '#10b981' },
  { score: 1150, name: 'DDoS SWARM TITAN', type: 'ddos_titan', hp: 120, reward: 0, color: '#8b5cf6' },
  { score: 1750, name: 'DNS HIJACKER PRIME', type: 'dns_saucer', hp: 165, reward: 0, color: '#06b6d4' },
  { score: 2450, name: 'RANSOMWARE DREADNOUGHT', type: 'ransom_dreadnought', hp: 220, reward: 0, color: '#f59e0b' },
  { score: 3250, name: 'ZERO-DAY OVERLORD', type: 'zero_day_overlord', hp: 300, reward: 0, color: '#ec4899', isFinal: true },
]

const DomainGameEngine = forwardRef(function DomainGameEngine(
  {
    isAutoMode = true,
    gameMode = 'campaign',
    difficulty = 'easy',
    godMode = false,
    onToggleAutoMode,
    onToggleGameMode,
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

  useEffect(() => {
    if (stateRef.current) {
      stateRef.current.godMode = !!godMode
    }
  }, [godMode])

  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('ng_tamagotchi_highscore') || '420', 10)
    } catch (_) {
      return 420
    }
  })
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [revives, setRevives] = useState(0)
  const [bubbleText, setBubbleText] = useState('')

  const lastScoreMilestoneRef = useRef(0)
  const lastHighMilestoneRef = useRef(0)

  // Curated list of 160+ high-quality brandable domain platforms
  const BASE_SPEED = 1.35
  const BIOME_DURATION_MS = 30000 // 30.0s per Biome
  const TRANSITION_DURATION_MS = 2500 // 2.5s crossfade transition
  const PAN_DURATION_MS = 27500 // 27.5s pure pan

  const stateRef = useRef({
    gameState: isAutoMode ? 'PLAYING' : 'COUNTDOWN',
    gameMode: gameMode || 'campaign',
    difficulty: difficulty || 'easy',
    godMode: !!godMode,
    bossHpMultiplier: difficulty === 'hard' ? 2 : 1,
    bossIndex: 0,
    bossesDefeated: 0,
    countdown: 3,
    countdownTimer: 60,
    score: 0,
    highScore: 420,
    lives: 5,
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
      jumpsLeft: 2,
      lastJumpTime: 0,
      frameCounter: 0,
      accessory: 'goggles',
      canAirCannon: true,
      coyoteFrames: 8,
      hitFlash: 0,
    },
    moveLeft: false,
    moveRight: false,
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
      s.cat.jumpsLeft = 2
      s.cat.lastJumpTime = 0
      s.cat.canAirCannon = true
      s.cat.coyoteFrames = 8
      s.cat.hitFlash = 0
    }

    if (soundEnabledRef.current) playCountdownBeep()
  }

  // Start campaign run with chosen difficulty
  const startCampaign = (diff = 'easy') => {
    const s = stateRef.current
    s.difficulty = diff
    s.bossHpMultiplier = diff === 'hard' ? 2 : 1
    s.isAuto = false
    s.gameMode = 'campaign'
    if (onToggleAutoMode) onToggleAutoMode(false)
    if (onToggleGameMode) onToggleGameMode('campaign')
    s.bubbleText = `⚔️ CAMPAIGN [${diff.toUpperCase()} - ${s.bossHpMultiplier}x HP]!`
    s.bubbleTimer = 90
    setBubbleText(s.bubbleText)
    resetGame(true)
  }

  // Switch to casual autopilot mode
  const startAutoMode = () => {
    const s = stateRef.current
    s.isAuto = true
    s.gameMode = 'casual'
    s.gameState = 'PLAYING'
    s.gameOver = false
    s.lives = 5
    setGameOver(false)
    setLives(5)
    if (onToggleAutoMode) onToggleAutoMode(true)
    if (onToggleGameMode) onToggleGameMode('casual')
    resetGame(false)
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

    const now = performance.now()
    if (s.cat.lastJumpTime && now - s.cat.lastJumpTime < 80) {
      return
    }

    // 1. Primary Ground / Platform Jump (with Coyote Time support)
    if (s.cat.isGrounded || (s.cat.coyoteFrames && s.cat.coyoteFrames > 0)) {
      s.cat.lastJumpTime = now
      s.cat.vy = -5.25
      s.cat.isGrounded = false
      s.cat.coyoteFrames = 0
      s.cat.jumpsLeft = 1
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

    // 2. Mid-Air Double Jump
    if (s.cat.jumpsLeft > 0 && !s.cat.isGrounded) {
      s.cat.lastJumpTime = now
      s.cat.vy = -5.25
      s.cat.jumpsLeft = 0
      s.jumpBuffer = 0

      if (soundEnabledRef.current) playPixelJump()

      // Ethereal cyan & gold sparkle paw ring on mid-air double jump
      for (let k = 0; k < 10; k++) {
        const angle = (k / 10) * Math.PI * 2
        s.particles.push({
          x: s.cat.x + s.cat.w / 2,
          y: s.cat.y + s.cat.h - 4,
          vx: Math.cos(angle) * (1.8 + Math.random() * 1.2),
          vy: Math.sin(angle) * (1.2 + Math.random() * 0.8) + 0.5,
          color: k % 2 === 0 ? '#38bdf8' : '#fbbf24',
          life: 18,
          size: 2.5,
        })
      }
      return
    }

    s.jumpBuffer = 8
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
    s.shootCooldown = s.godMode ? 2 : s.weapon === 'railgun' ? 14 : s.weapon === 'missile' ? 16 : 8

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
          damage: 1.5,
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
        damage: 3.5,
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
        damage: 5.0,
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
        damage: 2.0,
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
    s.lives = 5
    s.weapon = 'plasma'
    s.shootCooldown = 0
    s.moveLeft = false
    s.moveRight = false
    s.projectiles = []
    s.enemies = []
    s.boss = null
    s.bossIndex = 0
    s.bossesDefeated = 0
    s.bossCooldown = 0
    s.actionUnlockTime = 0
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
    s.cat.jumpsLeft = 2
    s.cat.canAirCannon = true
    s.cat.coyoteFrames = 8
    s.cat.hitFlash = 0
    s.powerups = []
    s.particles = []
    s.enemyBullets = []
    s.enemies = []
    s.floatingTexts = []
    s.bubbleTimer = 0
    s.bubbleText = ''
    s.recentDomains = ['genesis', 'zenith', 'lumina', 'hyper', 'kroma']

    s.platforms = [
      { x: 15, y: 236, baseY: 236, w: 130, h: 42, text: 'genesis.com', tld: '.com', color: '#ea580c', cracks: [] },
      { x: 200, y: 220, baseY: 220, w: 125, h: 42, text: 'zenith.ai', tld: '.ai', color: '#0284c7', cracks: generateCracks(125, 42) },
      { x: 382, y: 244, baseY: 244, w: 125, h: 42, text: 'lumina.io', tld: '.io', color: '#7c3aed', cracks: [] },
      { x: 565, y: 216, baseY: 216, w: 125, h: 42, text: 'hyper.co', tld: '.co', color: '#059669', cracks: generateCracks(125, 42), isFloating: true, floatAngle: 0, floatAmp: 14, floatSpeed: 0.04 },
      { x: 748, y: 236, baseY: 236, w: 125, h: 42, text: 'kroma.app', tld: '.app', color: '#d97706', cracks: [] },
    ]

    setGameOver(false)
    setScore(0)
    setRevives(0)
    setLives(5)

    if (triggerCountdown || !s.isAuto) {
      startManualCountdown()
    } else {
      s.gameState = 'PLAYING'
    }
  }

  const nextBiome = () => {
    const curDur = BIOME_DURATION_MS
    stateRef.current.bgTimeMs = (Math.floor(stateRef.current.bgTimeMs / curDur) + 1) * curDur
    stateRef.current.currentBiome = Math.floor(stateRef.current.bgTimeMs / curDur) % BIOMES.length
  }

  const updateGame = () => {
    const s = stateRef.current
    if (s.gameState === 'GAMEOVER') return

    const cat = s.cat
    const gravity = 0.19
    const maxFallSpeed = 5.4

    // Unified Cat Damage & Lives System with I-Frames & Game Over
    const damageCat = (reason = 'HIT') => {
      if (s.godMode) {
        return
      }
      if (cat.hitFlash > 0 || cat.inRescueFlight || s.gameState !== 'PLAYING') return
      cat.hitFlash = 32 // ~0.5s invulnerability frames
      s.screenshake = 6
      if (soundEnabledRef.current) playEnemyExplode()

      if (s.isAuto) {
        return
      }

      s.lives = Math.max(0, (s.lives ?? 5) - 0.5)
      setLives(s.lives)

      if (s.floatingTexts) {
        s.floatingTexts.push({
          x: cat.x + cat.w / 2,
          y: cat.y - 8,
          text: '-0.5 ❤️',
          color: '#ef4444',
          vy: -1.1,
          life: 28,
          font: 'bold 10.5px "JetBrains Mono", monospace',
        })
      }

      for (let k = 0; k < 14; k++) {
        s.particles.push({
          x: cat.x + cat.w / 2,
          y: cat.y + cat.h / 2,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          color: '#ef4444',
          life: 20,
          size: 3,
        })
      }

      if (s.lives <= 0) {
        s.gameState = 'GAMEOVER'
        s.gameOver = true
        s.actionUnlockTime = Date.now() + 1000
        setGameOver(true)
        if (soundEnabledRef.current) playGameOver()
      }
    }

    s.speed = s.isAuto
      ? BASE_SPEED
      : Math.min(1.75, BASE_SPEED + Math.min(s.score, 100) * 0.0035)

    const curDur = BIOME_DURATION_MS
    const activeBiome = BIOMES[Math.floor(s.bgTimeMs / curDur) % BIOMES.length] || BIOMES[0]

    // Weather animations
    if (s.celesteWind) {
      for (let i = 0; i < s.celesteWind.length; i++) {
        const w = s.celesteWind[i]
        w.x -= w.speed * 1.3
        w.wobblePhase += 0.04
        if (w.x + w.len < -20) {
          w.x = 380 + Math.random() * 40
          w.y = 15 + Math.random() * 220
          w.len = 6 + Math.random() * 14
          w.speed = 2.2 + Math.random() * 1.8
        }
      }
    }

    if (s.celesteMotes) {
      for (let i = 0; i < s.celesteMotes.length; i++) {
        const m = s.celesteMotes[i]
        m.x -= m.speedX * 1.3
        m.phase += m.phaseSpeed
        if (m.x < -10) {
          m.x = 390
          m.baseY = 25 + Math.random() * 240
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
        if (p.y > 330 || p.x < -20 || p.x > 400) {
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
        cat.y = 196
      }
      cat.frameCounter++
      return
    }

    // Active Rescue Cannon State Machine (shoots from bottom only)
    if (s.cannon && s.cannon.active) {
      s.cannon.timer++
      if (s.cannon.phase === 'aim') {
        s.cannon.y = 286
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
          const destY = targetPlat ? targetPlat.y - cat.h : 210

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
        if (s.cannon.y > 350) {
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

    for (let i = s.powerups.length - 1; i >= 0; i--) {
      const pwr = s.powerups[i]
      if (pwr.platform && s.platforms.includes(pwr.platform)) {
        pwr.x = pwr.platform.x + (pwr.offsetX !== undefined ? pwr.offsetX : (pwr.platform.w / 2 - pwr.w / 2))
        pwr.y = pwr.platform.y - (pwr.itemType === 'gun' ? 38 : 40)
      } else {
        pwr.x -= s.speed
      }
      pwr.bobAngle = (pwr.bobAngle || 0) + 0.04
      // Clean up off-screen powerups so new drops always spawn freely in later stages
      if (pwr.x < -60) {
        s.powerups.splice(i, 1)
      }
    }

    if (s.platforms.length > 0 && s.platforms[0].x + s.platforms[0].w < -40) {
      s.platforms.shift()
    }

    if (s.platforms.length === 0) {
      s.platforms.push({
        x: 20,
        y: 236,
        baseY: 236,
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
      const gap = 52 + Math.random() * 22
      const spawnX = prevP.x + prevP.w + gap

      // Keep platform vertically within safe jump reach (190px - 250px)
      const heightOffset = (Math.random() - 0.5) * 44
      const targetBaseY = Math.max(190, Math.min(252, (prevP.baseY || prevP.y) + heightOffset))

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

      const newPlat = {
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
      }
      s.platforms.push(newPlat)

      // Generous Gun Drops & Domain Extension Life +1UP Drops (enhanced in later boss defeat stages)
      const bossesDef = s.bossesDefeated || 0
      const isLateStage = bossesDef >= 1
      const maxPwr = isLateStage ? 4 : 3
      const dropRoll = Math.random()
      const gunChance = isLateStage ? 0.16 : 0.20
      // In later boss defeat stages, guarantee frequent +1 Life drops (up to 75% chance when low on health)
      const lifeChance = isLateStage ? (s.lives <= 2.5 ? 0.75 : 0.60) : 0.45

      if (dropRoll < gunChance && s.powerups.length < maxPwr) {
        // Gun Drop Crate
        const gun = GUN_TYPES[Math.floor(Math.random() * GUN_TYPES.length)]
        s.powerups.push({
          itemType: 'gun',
          platform: newPlat,
          offsetX: width / 2 - 16,
          x: spawnX + width / 2 - 16,
          y: targetBaseY - 38,
          w: 32,
          h: 22,
          label: gun.label,
          color: gun.color,
          score: gun.score,
          weapon: gun.weapon,
          weaponName: gun.weaponName,
          icon: gun.icon,
          bobAngle: Math.random() * Math.PI,
        })
      } else if (dropRoll < (gunChance + lifeChance) && s.powerups.length < maxPwr) {
        // Domain Extension +1 Life Drop
        const dLife = DOMAIN_LIFE_TYPES[Math.floor(Math.random() * DOMAIN_LIFE_TYPES.length)]
        s.powerups.push({
          itemType: 'domain_life',
          platform: newPlat,
          offsetX: width / 2 - 18,
          x: spawnX + width / 2 - 18,
          y: targetBaseY - 40,
          w: 36,
          h: 22,
          label: dLife.label,
          color: dLife.color,
          score: dLife.score,
          accessory: dLife.accessory,
          bobAngle: Math.random() * Math.PI,
        })
      }

      // In Campaign mode: spawn enemies progressively based on bosses defeated (when no boss)
      if (s.gameMode === 'campaign' && !s.boss && s.enemies.length < 3) {
        const bossesDefeated = s.bossesDefeated || 0
        let pool = []

        if (bossesDefeated === 0) {
          // Pre-Boss 1: 100% Classic Common Mobs
          pool = [
            { type: 'glitch_bug', weight: 35 },
            { type: 'squatter_drone', weight: 25 },
            { type: 'packet_bat', weight: 20 },
            { type: 'malware_golem', weight: 20 },
          ]
        } else if (bossesDefeated === 1) {
          // Post-Boss 1: Unlocks Beetle Infantry
          pool = [
            { type: 'glitch_bug', weight: 25 },
            { type: 'squatter_drone', weight: 20 },
            { type: 'packet_bat', weight: 15 },
            { type: 'malware_golem', weight: 15 },
            { type: 'beetle_infantry', weight: 25 },
          ]
        } else if (bossesDefeated === 2) {
          // Post-Boss 2: Unlocks Mantis Sniper
          pool = [
            { type: 'glitch_bug', weight: 15 },
            { type: 'squatter_drone', weight: 15 },
            { type: 'packet_bat', weight: 15 },
            { type: 'malware_golem', weight: 15 },
            { type: 'beetle_infantry', weight: 20 },
            { type: 'mantis_sniper', weight: 20 },
          ]
        } else if (bossesDefeated === 3) {
          // Post-Boss 3: Unlocks Volt-Hornet Drone
          pool = [
            { type: 'glitch_bug', weight: 10 },
            { type: 'squatter_drone', weight: 10 },
            { type: 'packet_bat', weight: 10 },
            { type: 'malware_golem', weight: 10 },
            { type: 'beetle_infantry', weight: 20 },
            { type: 'mantis_sniper', weight: 20 },
            { type: 'volt_hornet', weight: 20 },
          ]
        } else if (bossesDefeated === 4) {
          // Post-Boss 4: Unlocks Centipede Artillery
          pool = [
            { type: 'glitch_bug', weight: 8 },
            { type: 'squatter_drone', weight: 8 },
            { type: 'packet_bat', weight: 8 },
            { type: 'malware_golem', weight: 8 },
            { type: 'beetle_infantry', weight: 17 },
            { type: 'mantis_sniper', weight: 17 },
            { type: 'volt_hornet', weight: 17 },
            { type: 'centipede_artillery', weight: 17 },
          ]
        } else if (bossesDefeated === 5) {
          // Post-Boss 5: Unlocks Crab Juggernaut
          pool = [
            { type: 'glitch_bug', weight: 5 },
            { type: 'squatter_drone', weight: 5 },
            { type: 'packet_bat', weight: 5 },
            { type: 'malware_golem', weight: 5 },
            { type: 'beetle_infantry', weight: 16 },
            { type: 'mantis_sniper', weight: 16 },
            { type: 'volt_hornet', weight: 16 },
            { type: 'centipede_artillery', weight: 16 },
            { type: 'crab_juggernaut', weight: 16 },
          ]
        } else {
          // Post-Boss 6 / Endless: All 10 enemies with rich varied combinations!
          pool = [
            { type: 'glitch_bug', weight: 5 },
            { type: 'squatter_drone', weight: 5 },
            { type: 'packet_bat', weight: 5 },
            { type: 'malware_golem', weight: 5 },
            { type: 'beetle_infantry', weight: 13 },
            { type: 'mantis_sniper', weight: 13 },
            { type: 'volt_hornet', weight: 14 },
            { type: 'centipede_artillery', weight: 13 },
            { type: 'crab_juggernaut', weight: 13 },
            { type: 'moth_phantom', weight: 14 },
          ]
        }

        const totalWeight = pool.reduce((acc, item) => acc + item.weight, 0)
        let roll = Math.random() * totalWeight
        let enemyType = pool[0].type
        for (const item of pool) {
          if (roll < item.weight) {
            enemyType = item.type
            break
          }
          roll -= item.weight
        }

        if (enemyType === 'glitch_bug') {
          s.enemies.push({
            type: 'glitch_bug',
            platform: newPlat,
            offsetX: Math.max(4, Math.min(width - 30, width * 0.4)),
            x: spawnX + width * 0.4,
            y: targetBaseY - 24,
            w: 26,
            h: 24,
            vx: -0.6,
            hp: 1,
            maxHp: 1,
            scoreVal: 10,
            frame: Math.random() * 20,
            hitFlash: 0,
            actionState: 'idle',
            laserTimer: 0,
            laserPhase: 0,
            shootCooldown: 110 + Math.floor(Math.random() * 50),
          })
        } else if (enemyType === 'squatter_drone') {
          s.enemies.push({
            type: 'squatter_drone',
            x: spawnX + width * 0.5,
            y: 90 + Math.random() * 40,
            w: 26,
            h: 26,
            vx: -0.7,
            baseY: 90 + Math.random() * 40,
            hp: 2,
            maxHp: 2,
            scoreVal: 20,
            frame: Math.random() * 20,
            hitFlash: 0,
            actionState: 'idle',
            laserTimer: 0,
            laserPhase: 0,
            shootCooldown: 120 + Math.floor(Math.random() * 50),
          })
        } else if (enemyType === 'packet_bat') {
          s.enemies.push({
            type: 'packet_bat',
            x: spawnX + width * 0.5,
            y: 75 + Math.random() * 35,
            w: 28,
            h: 20,
            vx: -0.85,
            baseY: 75 + Math.random() * 35,
            hp: 2,
            maxHp: 2,
            scoreVal: 25,
            frame: Math.random() * 20,
            hitFlash: 0,
            actionState: 'idle',
            laserTimer: 0,
            laserPhase: 0,
            shootCooldown: 110 + Math.floor(Math.random() * 50),
          })
        } else if (enemyType === 'malware_golem') {
          s.enemies.push({
            type: 'malware_golem',
            platform: newPlat,
            offsetX: Math.max(6, Math.min(width - 38, width * 0.35)),
            x: spawnX + width * 0.35,
            y: targetBaseY - 30,
            w: 32,
            h: 30,
            vx: -0.35,
            hp: 3,
            maxHp: 3,
            scoreVal: 35,
            frame: Math.random() * 20,
            hitFlash: 0,
            actionState: 'idle',
            laserTimer: 0,
            laserPhase: 0,
            shootCooldown: 130 + Math.floor(Math.random() * 60),
          })
        } else if (enemyType === 'beetle_infantry') {
          s.enemies.push({
            type: 'beetle_infantry',
            platform: newPlat,
            offsetX: Math.max(4, Math.min(width - 38, width * 0.4)),
            x: spawnX + width * 0.4,
            y: targetBaseY - 24,
            w: 34,
            h: 24,
            vx: -0.55,
            hp: 2,
            maxHp: 2,
            scoreVal: 25,
            frame: Math.random() * 20,
            hitFlash: 0,
            actionState: 'idle',
            laserTimer: 0,
            laserPhase: 0,
            shootCooldown: 110 + Math.floor(Math.random() * 60),
          })
        } else if (enemyType === 'mantis_sniper') {
          s.enemies.push({
            type: 'mantis_sniper',
            platform: newPlat,
            offsetX: Math.max(6, Math.min(width - 40, width * 0.5)),
            x: spawnX + width * 0.5,
            y: targetBaseY - 32,
            w: 36,
            h: 32,
            vx: -0.65,
            hp: 3,
            maxHp: 3,
            scoreVal: 40,
            frame: Math.random() * 20,
            hitFlash: 0,
            actionState: 'idle',
            laserTimer: 0,
            laserPhase: 0,
            shootCooldown: 120 + Math.floor(Math.random() * 50),
          })
        } else if (enemyType === 'volt_hornet') {
          s.enemies.push({
            type: 'volt_hornet',
            x: spawnX + width * 0.5,
            y: 80 + Math.random() * 40,
            w: 30,
            h: 26,
            vx: -0.85,
            baseY: 80 + Math.random() * 40,
            hp: 2,
            maxHp: 2,
            scoreVal: 35,
            frame: Math.random() * 20,
            hitFlash: 0,
            actionState: 'idle',
            laserTimer: 0,
            laserPhase: 0,
            shootCooldown: 120 + Math.floor(Math.random() * 50),
          })
        } else if (enemyType === 'centipede_artillery') {
          s.enemies.push({
            type: 'centipede_artillery',
            platform: newPlat,
            offsetX: Math.max(4, Math.min(width - 48, width * 0.45)),
            x: spawnX + width * 0.45,
            y: targetBaseY - 22,
            w: 44,
            h: 22,
            vx: -0.4,
            hp: 4,
            maxHp: 4,
            scoreVal: 55,
            frame: Math.random() * 20,
            hitFlash: 0,
            actionState: 'idle',
            laserTimer: 0,
            laserPhase: 0,
            shootCooldown: 160 + Math.floor(Math.random() * 60),
          })
        } else if (enemyType === 'crab_juggernaut') {
          s.enemies.push({
            type: 'crab_juggernaut',
            platform: newPlat,
            offsetX: Math.max(6, Math.min(width - 46, width * 0.35)),
            x: spawnX + width * 0.35,
            y: targetBaseY - 30,
            w: 42,
            h: 32,
            vx: -0.3,
            hp: 5,
            maxHp: 5,
            scoreVal: 75,
            frame: Math.random() * 20,
            hitFlash: 0,
            actionState: 'idle',
            laserTimer: 0,
            laserPhase: 0,
            shootCooldown: 130 + Math.floor(Math.random() * 50),
          })
        } else if (enemyType === 'moth_phantom') {
          s.enemies.push({
            type: 'moth_phantom',
            x: spawnX + width * 0.5,
            y: 70 + Math.random() * 35,
            w: 38,
            h: 32,
            vx: -0.6,
            baseY: 70 + Math.random() * 35,
            hp: 4,
            maxHp: 4,
            scoreVal: 90,
            frame: Math.random() * 20,
            hitFlash: 0,
            actionState: 'idle',
            laserTimer: 0,
            laserPhase: 0,
            shootCooldown: 140 + Math.floor(Math.random() * 60),
          })
        }
      }
    }

    // Weapon cooldown decrement
    if (s.shootCooldown > 0) s.shootCooldown--
    if (s.bossCooldown > 0) s.bossCooldown--

    // Boss Encounter trigger from progressive milestones (Paced with mob defeats and post-boss cooldown)
    if (
      s.gameMode === 'campaign' &&
      !s.boss &&
      (s.bossCooldown || 0) <= 0 &&
      (s.bossIndex ?? 0) < BOSS_MILESTONES.length
    ) {
      const targetBoss = BOSS_MILESTONES[s.bossIndex ?? 0]
      if (s.score >= targetBoss.score) {
        const hpMult = s.difficulty === 'hard' ? 2 : 1
        const bossHp = targetBoss.hp * hpMult
        s.boss = {
          active: true,
          name: targetBoss.name,
          type: targetBoss.type,
          x: 395,
          targetX: 265,
          y: 95,
          baseY: 95,
          w: 56,
          h: 50,
          hp: bossHp,
          maxHp: bossHp,
          floatAngle: 0,
          attackTimer: 0,
          attackPattern: 0,
          actionState: '',
          telegraph: null,
          phase: 'enter',
          hitFlash: 0,
          bullets: [],
          deathTimer: 0,
          reward: targetBoss.reward * hpMult,
          isFinal: Boolean(targetBoss.isFinal),
          color: targetBoss.color,
          teleportTimer: 0,
        }
        s.bossIndex = (s.bossIndex ?? 0) + 1
        if (soundEnabledRef.current) playBossWarning()
        s.bubbleText = `⚠️ BOSS ALERT: ${targetBoss.name} [${s.difficulty === 'hard' ? '2x HP' : '1x HP'}]!`
        s.bubbleTimer = 90
        setBubbleText(s.bubbleText)
      }
    }

    // Boss State Machine
    if (s.boss && s.boss.active) {
      const boss = s.boss
      if (boss.hitFlash > 0) boss.hitFlash--

      // Process telegraph timers
      if (boss.telegraph && boss.telegraph.timer > 0) {
        boss.telegraph.timer--
        if (boss.telegraph.timer === 0) {
          const tg = boss.telegraph
          if (tg.type === 'laser') {
            boss.bullets.push({
              x: boss.x - 4,
              y: tg.y,
              vx: -7.5,
              vy: 0,
              type: 'beam',
              size: 6,
              life: 80,
            })
            if (soundEnabledRef.current) playLaserShoot('railgun')
          } else if (tg.type === 'pillar') {
            if (
              !s.cat.inRescueFlight &&
              s.gameState === 'PLAYING' &&
              Math.abs(s.cat.x + s.cat.w / 2 - tg.x) < 22
            ) {
              damageCat('PILLAR')
            }
            for (let k = 0; k < 12; k++) {
              s.particles.push({
                x: tg.x + (Math.random() - 0.5) * 20,
                y: Math.random() * 260,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                color: '#fbbf24',
                life: 20,
                size: 3,
              })
            }
          } else if (tg.type === 'thunder') {
            // Quantum Thunder Strike Blast
            if (
              !s.cat.inRescueFlight &&
              s.gameState === 'PLAYING' &&
              Math.abs(s.cat.x + s.cat.w / 2 - tg.x) < 22
            ) {
              damageCat('THUNDER')
            }
            if (soundEnabledRef.current) playLaserShoot('railgun')
            for (let k = 0; k < 18; k++) {
              s.particles.push({
                x: tg.x + (Math.random() - 0.5) * 28,
                y: Math.random() * 280,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                color: k % 3 === 0 ? '#00f0ff' : k % 3 === 1 ? '#facc15' : '#ffffff',
                life: 22,
                size: 3.2,
              })
            }
          } else if (tg.type === 'mortar') {
            boss.bullets.push({
              x: tg.x,
              y: 0,
              vx: 0,
              vy: 2.8,
              type: 'mortar',
              size: 6,
              life: 80,
            })
            if (soundEnabledRef.current) playLaserShoot('plasma')
          }
          boss.telegraph = null
        }
      }

      if (boss.phase === 'enter') {
        boss.x += (boss.targetX - boss.x) * 0.08
        if (Math.abs(boss.x - boss.targetX) < 4) {
          boss.phase = 'battle'
          boss.attackTimer = 0
          boss.attackPattern = 0
        }
      } else if (boss.phase === 'battle') {
        boss.floatAngle += 0.04
        boss.y = boss.baseY + Math.sin(boss.floatAngle) * 18

        boss.attackTimer++

        // Cycle through 3 multi-attack patterns per boss type (Calibrated for fair dodge windows & double jumps)
        if (boss.type === 'phishing_hydra') {
          if (boss.attackTimer >= 78) {
            boss.attackTimer = 0
            boss.attackPattern = ((boss.attackPattern || 0) + 1) % 3
            if (boss.attackPattern === 0) {
              boss.actionState = '🐍 TRIPLE HYDRA SPIT'
              ;[-0.55, 0, 0.55].forEach((vy) => {
                boss.bullets.push({
                  x: boss.x + 4,
                  y: boss.y + 18,
                  vx: -1.8,
                  vy: vy,
                  type: 'venom_cross',
                  size: 5.5,
                  life: 140,
                  hp: 1,
                  shootable: true,
                })
              })
              if (soundEnabledRef.current) playLaserShoot('plasma')
            } else if (boss.attackPattern === 1) {
              boss.actionState = '🧪 TOXIC SLIME GEYSER'
              boss.bullets.push(
                { x: boss.x + 4, y: boss.y + 10, vx: -1.6, vy: -1.2, type: 'slime_wave', size: 6.5, life: 130, hp: 1, shootable: true },
                { x: boss.x + 4, y: boss.y + 24, vx: -1.3, vy: -0.6, type: 'slime_wave', size: 6.5, life: 140, hp: 1, shootable: true }
              )
              if (soundEnabledRef.current) playLaserShoot('plasma')
            } else {
              boss.actionState = '🌧️ ACID SHOWER BARRAGE'
              boss.telegraph = { type: 'mortar', x: Math.max(40, Math.min(220, s.cat.x + 18)), y: 195, timer: 38 }
            }
          }
        } else if (boss.type === 'ddos_titan') {
          if (boss.attackTimer >= 85) {
            boss.attackTimer = 0
            boss.attackPattern = ((boss.attackPattern || 0) + 1) % 3
            if (boss.attackPattern === 0) {
              boss.actionState = '🚀 5-ROCKET SALVO'
              for (let r = -2; r <= 2; r++) {
                boss.bullets.push({
                  x: boss.x + 2,
                  y: boss.y + 20,
                  vx: -2.1,
                  vy: r * 0.35,
                  type: 'rocket',
                  size: 5,
                  life: 120,
                  hp: 1,
                  shootable: true,
                })
              }
              if (soundEnabledRef.current) playLaserShoot('missile')
            } else if (boss.attackPattern === 1) {
              boss.actionState = '🛸 SWARM DRONES'
              boss.bullets.push(
                { x: boss.x, y: boss.y + 12, vx: -1.4, vy: -0.2, type: 'sawblade', size: 6, life: 140, hp: 2, shootable: true },
                { x: boss.x, y: boss.y + 28, vx: -1.4, vy: 0.2, type: 'sawblade', size: 6, life: 140, hp: 2, shootable: true }
              )
              if (soundEnabledRef.current) playLaserShoot('spread')
            } else {
              boss.actionState = '⚡ WARP BEAMS'
              boss.telegraph = { type: 'pillar', x: Math.max(30, s.cat.x), timer: 36 }
            }
          }
        } else if (boss.type === 'dns_saucer') {
          if (boss.attackTimer >= 72) {
            boss.attackTimer = 0
            boss.attackPattern = ((boss.attackPattern || 0) + 1) % 3
            if (boss.attackPattern === 0) {
              boss.actionState = '⚡ THUNDER & FIREBALLS'
              boss.telegraph = { type: 'thunder', x: Math.max(35, Math.min(230, s.cat.x + 12)), timer: 36 }
              boss.bullets.push(
                { x: boss.x - 2, y: boss.y + 10, vx: -1.7, vy: -0.25, type: 'fireball', size: 5.5, life: 130, hp: 1, shootable: true },
                { x: boss.x - 2, y: boss.y + 26, vx: -1.7, vy: 0.25, type: 'fireball', size: 5.5, life: 130, hp: 1, shootable: true }
              )
              if (soundEnabledRef.current) playLaserShoot('plasma')
            } else if (boss.attackPattern === 1) {
              boss.actionState = '🌌 GRAVITY ORBS & BULLETS'
              boss.bullets.push(
                { x: boss.x, y: boss.y + 10, vx: -1.3, vy: -0.2, type: 'gravity_orb', size: 7, life: 140, hp: 2, shootable: true },
                { x: boss.x, y: boss.y + 26, vx: -1.3, vy: 0.2, type: 'gravity_orb', size: 7, life: 140, hp: 2, shootable: true },
                { x: boss.x - 4, y: boss.y + 18, vx: -2.3, vy: 0, type: 'energy_bullet', size: 5, life: 110, hp: 1, shootable: true }
              )
              if (soundEnabledRef.current) playLaserShoot('plasma')
            } else {
              boss.actionState = '⚡ WARP BEAMS & FIRE'
              boss.bullets.push(
                { x: boss.x - 2, y: boss.y + boss.h / 2, vx: -2.6, vy: 0, type: 'warp_beam', size: 5, life: 120 },
                { x: boss.x - 2, y: boss.y + 8, vx: -1.8, vy: -0.35, type: 'fireball', size: 5, life: 120, hp: 1, shootable: true },
                { x: boss.x - 2, y: boss.y + 30, vx: -1.8, vy: 0.35, type: 'fireball', size: 5, life: 120, hp: 1, shootable: true }
              )
              boss.baseY = 60 + Math.random() * 80
              if (soundEnabledRef.current) playLaserShoot('railgun')
            }
          }
        } else if (boss.type === 'ransom_dreadnought') {
          if (boss.attackTimer >= 80) {
            boss.attackTimer = 0
            boss.attackPattern = ((boss.attackPattern || 0) + 1) % 3
            if (boss.attackPattern === 0) {
              boss.actionState = '🛡️ FIREWALL THRUST'
              boss.bullets.push(
                { x: boss.x - 4, y: boss.y + 10, vx: -2.0, vy: -0.25, type: 'firewall_spikes', size: 7, life: 120, hp: 1, shootable: true },
                { x: boss.x - 4, y: boss.y + 28, vx: -2.0, vy: 0.25, type: 'firewall_spikes', size: 7, life: 120, hp: 1, shootable: true }
              )
              if (soundEnabledRef.current) playLaserShoot('plasma')
            } else if (boss.attackPattern === 1) {
              boss.actionState = '💀 SKULL MINES'
              boss.bullets.push(
                { x: boss.x - 6, y: boss.y + 10, vx: -1.1, vy: 0.1, type: 'skull_mines', size: 7, life: 160, hp: 2, shootable: true },
                { x: boss.x - 6, y: boss.y + 22, vx: -0.85, vy: -0.05, type: 'skull_mines', size: 7, life: 160, hp: 2, shootable: true },
                { x: boss.x - 6, y: boss.y + 34, vx: -1.1, vy: -0.1, type: 'skull_mines', size: 7, life: 160, hp: 2, shootable: true }
              )
              if (soundEnabledRef.current) playLaserShoot('plasma')
            } else {
              boss.actionState = '⚙️ 4-WAY GRINDER SPREAD'
              for (let q = -1.5; q <= 1.5; q += 1) {
                boss.bullets.push({
                  x: boss.x - 4,
                  y: boss.y + 20,
                  vx: -1.8,
                  vy: q * 0.4,
                  type: 'grinder',
                  size: 6,
                  life: 120,
                  hp: 1,
                  shootable: true,
                })
              }
              if (soundEnabledRef.current) playLaserShoot('spread')
            }
          }
        } else if (boss.type === 'zero_day_overlord') {
          if (boss.attackTimer >= 68) {
            boss.attackTimer = 0
            boss.attackPattern = ((boss.attackPattern || 0) + 1) % 3
            if (boss.attackPattern === 0) {
              boss.actionState = '🌈 PRISMATIC STARBURST'
              const starColors = ['#ef4444', '#f97316', '#22c55e', '#06b6d4', '#a855f7']
              for (let a = -2; a <= 2; a++) {
                boss.bullets.push({
                  x: boss.x,
                  y: boss.y + boss.h / 2,
                  vx: -2.2,
                  vy: a * 0.45,
                  type: 'prismatic_star',
                  starColor: starColors[a + 2],
                  starIdx: a + 2,
                  size: 6,
                  life: 130,
                  hp: 1,
                  shootable: true,
                })
              }
              if (soundEnabledRef.current) playLaserShoot('spread')
            } else if (boss.attackPattern === 1) {
              boss.actionState = '🌀 VOID SINGULARITY'
              boss.bullets.push(
                { x: boss.x, y: boss.y + 12, vx: -1.5, vy: -0.2, type: 'void_vortex', size: 8, life: 140, hp: 3, shootable: true },
                { x: boss.x, y: boss.y + 28, vx: -1.5, vy: 0.2, type: 'void_vortex', size: 8, life: 140, hp: 3, shootable: true }
              )
              if (soundEnabledRef.current) playLaserShoot('missile')
            } else {
              boss.actionState = '⚡ ARCHANGEL SMITE'
              boss.telegraph = { type: 'pillar', x: Math.max(30, s.cat.x + 10), timer: 38 }
            }
          }
        } else {
          // Megabyte Squatter Mecha (1000 pts)
          if (boss.attackTimer >= 80) {
            boss.attackTimer = 0
            boss.attackPattern = ((boss.attackPattern || 0) + 1) % 3
            if (boss.attackPattern === 0) {
              boss.actionState = '💎 DIAMOND DASH'
              boss.bullets.push({
                x: boss.x - 2,
                y: boss.y + 20,
                vx: -1.8,
                vy: 0,
                type: 'sawblade',
                size: 8,
                life: 140,
                hp: 2,
                shootable: true,
              })
              if (soundEnabledRef.current) playLaserShoot('plasma')
            } else if (boss.attackPattern === 1) {
              boss.actionState = '🚀 5-ROCKET SALVO'
              for (let r = -2; r <= 2; r++) {
                boss.bullets.push({
                  x: boss.x + 4,
                  y: boss.y + 20,
                  vx: -2.2,
                  vy: r * 0.35,
                  type: 'rocket',
                  size: 5,
                  life: 120,
                  hp: 1,
                  shootable: true,
                })
              }
              if (soundEnabledRef.current) playLaserShoot('missile')
            } else {
              boss.actionState = '🎯 MORTAR STRIKES'
              boss.telegraph = { type: 'mortar', x: Math.max(30, s.cat.x + 20), y: 195, timer: 38 }
            }
          }
        }
      } else if (boss.phase === 'death') {
        boss.deathTimer++
        s.screenshake = 4
        if (boss.deathTimer % 3 === 0) {
          for (let k = 0; k < 7; k++) {
            s.particles.push({
              x: boss.x + Math.random() * boss.w,
              y: boss.y + Math.random() * boss.h,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6 - 1.5,
              color: ['#fbbf24', '#f97316', '#ef4444', '#06b6d4', '#ec4899'][k % 5],
              life: 28,
              size: 3.5,
            })
          }
        }
        if (boss.deathTimer >= 35) {
          if (boss.isFinal) {
            // Final Boss Overlord Defeated -> VICTORY!
            if (soundEnabledRef.current) playVictoryFanfare()
            s.gameState = 'VICTORY'
            s.actionUnlockTime = Date.now() + 1000
            s.boss = null
            s.screenshake = 0
            s.bossesDefeated = 6
            // Boss defeat restores full health bar to 100% (3 hearts)
            s.lives = 3
            setLives(3)
            s.bubbleText = `🏆 ZERO-DAY OVERLORD DEFEATED! ALL DOMAINS RESTORED!`
            s.bubbleTimer = 120
            setBubbleText(s.bubbleText)
            if (onMilestone) onMilestone(s.score)
          } else {
            // Progressive Boss Defeated: Full health restoration & calm pacing breather
            if (soundEnabledRef.current) playBossDefeated()
            s.bossesDefeated = (s.bossesDefeated || 0) + 1
            s.bossCooldown = 320 // ~5.3s cooldown before next boss can trigger
            // Refill full health bar!
            s.lives = 3
            setLives(3)
            if (s.floatingTexts) {
              s.floatingTexts.push({
                x: s.cat.x + s.cat.w / 2,
                y: s.cat.y - 12,
                text: '+FULL HEALTH ❤️❤️❤️',
                color: '#22c55e',
                vy: -1.2,
                life: 45,
                font: 'bold 11px "JetBrains Mono", monospace',
              })
            }
            s.bubbleText = `🏆 ${boss.name} DEFEATED! ❤️ HEALTH RESTORED TO FULL!`
            s.bubbleTimer = 90
            setBubbleText(s.bubbleText)
            s.boss = null
            s.screenshake = 0

            // Guarantee a bonus +1 Life drop on the upcoming platform
            if (s.platforms && s.platforms.length > 1) {
              const forwardPlat = s.platforms[1]
              const dLife = DOMAIN_LIFE_TYPES[Math.floor(Math.random() * DOMAIN_LIFE_TYPES.length)]
              s.powerups.push({
                itemType: 'domain_life',
                platform: forwardPlat,
                offsetX: forwardPlat.w / 2 - 18,
                x: forwardPlat.x + forwardPlat.w / 2 - 18,
                y: forwardPlat.y - 40,
                w: 36,
                h: 22,
                label: dLife.label,
                color: dLife.color,
                score: dLife.score,
                accessory: dLife.accessory,
                bobAngle: 0,
              })
            }
          }
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
            damageCat('BULLET')
          }
        }
      }
    }

    // Update Enemies
    for (let i = s.enemies.length - 1; i >= 0; i--) {
      const en = s.enemies[i]
      if (en.hitFlash > 0) en.hitFlash--
      en.frame = (en.frame || 0) + 1

      const isLandEnemy =
        en.type === 'glitch_bug' ||
        en.type === 'malware_golem' ||
        en.type === 'beetle_infantry' ||
        en.type === 'mantis_sniper' ||
        en.type === 'centipede_artillery' ||
        en.type === 'crab_juggernaut'

      if (isLandEnemy) {
        if (!en.platform || !s.platforms.includes(en.platform)) {
          const centerEnemyX = en.x + en.w * 0.5
          const foundPlat = s.platforms.find((p) => centerEnemyX >= p.x - 14 && centerEnemyX <= p.x + p.w + 14)
          if (foundPlat) {
            en.platform = foundPlat
            en.offsetX = Math.max(4, Math.min(foundPlat.w - en.w - 4, en.x - foundPlat.x))
          }
        }

        if (en.platform && s.platforms.includes(en.platform)) {
          en.offsetX = (en.offsetX !== undefined ? en.offsetX : (en.x - en.platform.x)) + (en.vx || -0.5)
          const minOffset = 4
          const maxOffset = Math.max(minOffset, en.platform.w - en.w - 4)
          if (en.offsetX <= minOffset) {
            en.offsetX = minOffset
            en.vx = Math.abs(en.vx || 0.5)
          } else if (en.offsetX >= maxOffset) {
            en.offsetX = maxOffset
            en.vx = -Math.abs(en.vx || 0.5)
          }
          en.x = en.platform.x + en.offsetX
          en.y = en.platform.y - en.h
        } else {
          en.x += (en.vx || -0.5) - s.speed
        }
      }

      if (en.type === 'glitch_bug') {
        en.shootCooldown = (en.shootCooldown || 120) - 1
        if (en.shootCooldown <= 0 && en.x > cat.x && en.x < 380) {
          en.actionState = 'attack'
          en.laserTimer = 22
          en.shootCooldown = 130 + Math.floor(Math.random() * 50)
        }
        if (en.laserTimer > 0) {
          en.laserTimer--
          en.laserPhase = en.laserTimer > 16 ? 0 : en.laserTimer > 10 ? 1 : en.laserTimer > 4 ? 2 : 3
          if (en.laserTimer === 10 && s.enemyBullets) {
            s.enemyBullets.push({
              x: en.x - 2,
              y: en.y + 11.5,
              vx: -2.8,
              vy: 0,
              size: 4,
              type: 'glitch_pulse',
              color: '#00f0ff',
              life: 120,
              hp: 1,
            })
            if (soundEnabledRef.current) playLaserShoot('plasma')
          }
          if (en.laserTimer <= 0) en.actionState = 'idle'
        }
      } else if (en.type === 'squatter_drone') {
        en.x -= s.speed
        en.bobAngle = (en.bobAngle || 0) + 0.05
        en.y = en.baseY + Math.sin(en.bobAngle) * 10

        en.shootCooldown = (en.shootCooldown || 130) - 1
        if (en.shootCooldown <= 0 && en.x > cat.x && en.x < 370) {
          en.actionState = 'attack'
          en.laserTimer = 24
          en.shootCooldown = 140 + Math.floor(Math.random() * 50)
        }
        if (en.laserTimer > 0) {
          en.laserTimer--
          en.laserPhase = en.laserTimer > 18 ? 0 : en.laserTimer > 12 ? 1 : en.laserTimer > 6 ? 2 : 3
          if (en.laserTimer === 12 && s.enemyBullets) {
            s.enemyBullets.push({
              x: en.x - 2,
              y: en.y + 13,
              vx: -2.4,
              vy: (Math.random() - 0.5) * 0.4,
              size: 5,
              type: 'emp_spark',
              color: '#facc15',
              life: 120,
              hp: 1,
            })
            if (soundEnabledRef.current) playLaserShoot('plasma')
          }
          if (en.laserTimer <= 0) en.actionState = 'idle'
        }
      } else if (en.type === 'packet_bat') {
        en.x += en.vx - s.speed * 0.7
        en.y = en.baseY + Math.sin(en.frame * 0.14) * 12

        en.shootCooldown = (en.shootCooldown || 120) - 1
        if (en.shootCooldown <= 0 && en.x > cat.x && en.x < 375) {
          en.actionState = 'attack'
          en.laserTimer = 24
          en.shootCooldown = 135 + Math.floor(Math.random() * 50)
        }
        if (en.laserTimer > 0) {
          en.laserTimer--
          en.laserPhase = en.laserTimer > 18 ? 0 : en.laserTimer > 12 ? 1 : en.laserTimer > 6 ? 2 : 3
          if (en.laserTimer === 12 && s.enemyBullets) {
            s.enemyBullets.push(
              { x: en.x - 2, y: en.y + 10, vx: -2.6, vy: -0.35, size: 6, type: 'sonar_wave', color: '#c084fc', life: 120, hp: 1 },
              { x: en.x - 2, y: en.y + 10, vx: -2.6, vy: 0.35, size: 6, type: 'sonar_wave', color: '#c084fc', life: 120, hp: 1 }
            )
            if (soundEnabledRef.current) playLaserShoot('spread')
          }
          if (en.laserTimer <= 0) en.actionState = 'idle'
        }
      } else if (en.type === 'malware_golem') {
        en.shootCooldown = (en.shootCooldown || 140) - 1
        if (en.shootCooldown <= 0 && en.x > cat.x - 20 && en.x < 370) {
          en.actionState = 'attack'
          en.laserTimer = 26
          en.shootCooldown = 150 + Math.floor(Math.random() * 60)
        }
        if (en.laserTimer > 0) {
          en.laserTimer--
          en.laserPhase = en.laserTimer > 19 ? 0 : en.laserTimer > 13 ? 1 : en.laserTimer > 6 ? 2 : 3
          if (en.laserTimer === 13 && s.enemyBullets) {
            s.enemyBullets.push({
              x: en.x - 4,
              y: en.y + 10,
              vx: -2.3,
              vy: -2.2,
              gravity: 0.13,
              size: 7,
              type: 'magma_boulder',
              color: '#ea580c',
              life: 130,
              hp: 2,
            })
            if (soundEnabledRef.current) playLaserShoot('missile')
          }
          if (en.laserTimer <= 0) en.actionState = 'idle'
        }
      } else if (en.type === 'beetle_infantry') {
        en.shootCooldown = (en.shootCooldown || 120) - 1
        if (en.shootCooldown <= 0 && en.x > cat.x - 30 && en.x < 380) {
          en.actionState = 'attack'
          en.laserTimer = 26
          en.shootCooldown = 140 + Math.floor(Math.random() * 60)
        }
        if (en.laserTimer > 0) {
          en.laserTimer--
          en.laserPhase = en.laserTimer > 19 ? 0 : en.laserTimer > 13 ? 1 : en.laserTimer > 6 ? 2 : 3
          if (en.laserTimer === 13 && s.enemyBullets) {
            s.enemyBullets.push({
              x: en.x - 4,
              y: en.y + 12,
              vx: -3.6,
              vy: 0,
              size: 6,
              type: 'plasmic_slug',
              color: '#ea580c',
              life: 130,
              hp: 1,
            })
            if (soundEnabledRef.current) playLaserShoot('plasma')
          }
          if (en.laserTimer <= 0) en.actionState = 'idle'
        }
      } else if (en.type === 'mantis_sniper') {
        en.shootCooldown = (en.shootCooldown || 140) - 1
        if (en.shootCooldown <= 0 && en.x > cat.x - 40 && en.x < 385) {
          en.actionState = 'attack'
          en.laserTimer = 28
          en.shootCooldown = 160 + Math.floor(Math.random() * 60)
        }
        if (en.laserTimer > 0) {
          en.laserTimer--
          en.laserPhase = en.laserTimer > 21 ? 0 : en.laserTimer > 14 ? 1 : en.laserTimer > 7 ? 2 : 3
          if (en.laserTimer === 14 && s.enemyBullets) {
            s.enemyBullets.push({
              x: en.x - 6,
              y: en.y + 14,
              vx: -5.4,
              vy: 0,
              size: 5,
              type: 'railgun_slug',
              color: '#00f0ff',
              life: 110,
              hp: 1,
            })
            if (soundEnabledRef.current) playLaserShoot('railgun')
          }
          if (en.laserTimer <= 0) en.actionState = 'idle'
        }
      } else if (en.type === 'volt_hornet') {
        en.x -= s.speed
        en.bobAngle = (en.bobAngle || 0) + 0.06
        en.y = en.baseY + Math.sin(en.bobAngle) * 12

        en.shootCooldown = (en.shootCooldown || 115) - 1
        if (en.shootCooldown <= 0 && en.x > cat.x && en.x < 375) {
          en.actionState = 'attack'
          en.laserTimer = 24
          en.shootCooldown = 130 + Math.floor(Math.random() * 50)
        }
        if (en.laserTimer > 0) {
          en.laserTimer--
          en.laserPhase = en.laserTimer > 18 ? 0 : en.laserTimer > 12 ? 1 : en.laserTimer > 6 ? 2 : 3
          if (en.laserTimer === 12 && s.enemyBullets) {
            s.enemyBullets.push(
              { x: en.x - 4, y: en.y + 13, vx: -3.3, vy: -0.55, size: 4, type: 'volt_needle', color: '#facc15', life: 120, hp: 1 },
              { x: en.x - 4, y: en.y + 13, vx: -3.5, vy: 0, size: 4, type: 'volt_needle', color: '#facc15', life: 120, hp: 1 },
              { x: en.x - 4, y: en.y + 13, vx: -3.3, vy: 0.55, size: 4, type: 'volt_needle', color: '#facc15', life: 120, hp: 1 }
            )
            if (soundEnabledRef.current) playLaserShoot('spread')
          }
          if (en.laserTimer <= 0) en.actionState = 'idle'
        }
      } else if (en.type === 'centipede_artillery') {
        en.shootCooldown = (en.shootCooldown || 150) - 1
        if (en.shootCooldown <= 0 && en.x > cat.x && en.x < 380) {
          en.actionState = 'attack'
          en.laserTimer = 28
          en.shootCooldown = 160 + Math.floor(Math.random() * 60)
        }
        if (en.laserTimer > 0) {
          en.laserTimer--
          en.laserPhase = en.laserTimer > 21 ? 0 : en.laserTimer > 14 ? 1 : en.laserTimer > 7 ? 2 : 3
          if (en.laserTimer === 14 && s.enemyBullets) {
            s.enemyBullets.push({
              x: en.x - 4,
              y: en.y + 4,
              vx: -2.3,
              vy: -3.8,
              gravity: 0.16,
              size: 7,
              type: 'bio_mortar',
              color: '#22c55e',
              life: 130,
              hp: 2,
            })
            if (soundEnabledRef.current) playLaserShoot('missile')
          }
          if (en.laserTimer <= 0) en.actionState = 'idle'
        }
      } else if (en.type === 'crab_juggernaut') {
        en.shootCooldown = (en.shootCooldown || 140) - 1
        if (en.shootCooldown <= 0 && en.x > cat.x - 20 && en.x < 370) {
          en.actionState = 'attack'
          en.laserTimer = 26
          en.shootCooldown = 155 + Math.floor(Math.random() * 60)
        }
        if (en.laserTimer > 0) {
          en.laserTimer--
          en.laserPhase = en.laserTimer > 19 ? 0 : en.laserTimer > 13 ? 1 : en.laserTimer > 6 ? 2 : 3
          if (en.laserTimer === 13 && s.enemyBullets) {
            s.enemyBullets.push({
              x: en.x - 4,
              y: en.y + en.h - 4,
              vx: -3.0,
              vy: 0,
              size: 8,
              type: 'seismic_shockwave',
              color: '#fde047',
              life: 130,
              hp: 2,
            })
            if (soundEnabledRef.current) playLaserShoot('missile')
          }
          if (en.laserTimer <= 0) en.actionState = 'idle'
        }
      } else if (en.type === 'moth_phantom') {
        en.x += en.vx - s.speed * 0.6
        en.y = en.baseY + Math.sin(en.frame * 0.12) * 12

        en.shootCooldown = (en.shootCooldown || 130) - 1
        if (en.shootCooldown <= 0 && en.x > cat.x && en.x < 380) {
          en.actionState = 'attack'
          en.laserTimer = 26
          en.shootCooldown = 145 + Math.floor(Math.random() * 60)
        }
        if (en.laserTimer > 0) {
          en.laserTimer--
          en.laserPhase = en.laserTimer > 19 ? 0 : en.laserTimer > 13 ? 1 : en.laserTimer > 6 ? 2 : 3
          if (en.laserTimer === 13 && s.enemyBullets) {
            s.enemyBullets.push({
              x: en.x - 4,
              y: en.y + 14,
              vx: -2.5,
              vy: 0,
              size: 7,
              type: 'diamond_pulse',
              color: '#ec4899',
              life: 140,
              hp: 1,
            })
            if (soundEnabledRef.current) playLaserShoot('plasma')
          }
          if (en.laserTimer <= 0) en.actionState = 'idle'
        }
      }

      if (en.x < -40) {
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
        if (cat.vy > 0 && cat.y + cat.h - cat.vy <= en.y + 7) {
          cat.vy = -5.25
          cat.jumpsLeft = 1
          if (soundEnabledRef.current) playEnemyExplode()
          const scoreAdd = en.scoreVal || (en.type === 'malware_golem' ? 35 : en.type === 'packet_bat' ? 25 : en.type === 'squatter_drone' ? 20 : 10)
          s.score += scoreAdd
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
          damageCat('ENEMY')
        }
      }
    }

    // Update Enemy Projectiles & Bullets
    if (s.enemyBullets && s.enemyBullets.length > 0) {
      for (let i = s.enemyBullets.length - 1; i >= 0; i--) {
        const b = s.enemyBullets[i]
        b.x += b.vx
        b.y += (b.vy || 0)
        if (b.gravity) {
          b.vy = (b.vy || 0) + b.gravity
        }
        b.life--

        // Particle trail
        if (b.life % 2 === 0) {
          s.particles.push({
            x: b.x,
            y: b.y,
            vx: -b.vx * 0.15 + (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            color: b.color || '#38bdf8',
            life: 8,
            size: 1.8,
          })
        }

        // Bio-mortar landing explosion
        if (b.type === 'bio_mortar' && b.y >= 245) {
          for (let k = 0; k < 12; k++) {
            s.particles.push({
              x: b.x,
              y: b.y,
              vx: (Math.random() - 0.5) * 3.5,
              vy: -Math.random() * 2.5,
              color: '#22c55e',
              life: 18,
              size: 2.5,
            })
          }
          s.enemyBullets.splice(i, 1)
          continue
        }

        if (b.x < -30 || b.y > 310 || b.life <= 0) {
          s.enemyBullets.splice(i, 1)
          continue
        }

        // Collision with Cat
        if (
          !cat.inRescueFlight &&
          s.gameState === 'PLAYING' &&
          cat.x < b.x + (b.size || 5) + 3 &&
          cat.x + cat.w > b.x - (b.size || 5) - 3 &&
          cat.y < b.y + (b.size || 5) + 3 &&
          cat.y + cat.h > b.y - (b.size || 5) - 3
        ) {
          s.enemyBullets.splice(i, 1)
          damageCat(b.type ? b.type.toUpperCase() : 'PROJECTILE')
          continue
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
        if (p.hitTargets && p.hitTargets.includes(en)) continue
        if (
          p.x < en.x + en.w &&
          p.x + p.w > en.x &&
          p.y < en.y + en.h &&
          p.y + p.h > en.y
        ) {
          if (!p.hitTargets) p.hitTargets = []
          p.hitTargets.push(en)
          en.hp -= p.damage
          en.hitFlash = 5
          if (s.floatingTexts) {
            s.floatingTexts.push({
              x: en.x + en.w / 2,
              y: en.y - 6,
              text: `-${p.damage}`,
              color: '#38bdf8',
              vy: -0.8,
              life: 20,
              font: 'bold 8.5px "JetBrains Mono", monospace',
            })
          }
          if (en.hp <= 0) {
            if (soundEnabledRef.current) playEnemyExplode()
            const scoreVal = en.scoreVal || (en.type === 'malware_golem' ? 35 : en.type === 'packet_bat' ? 25 : en.type === 'squatter_drone' ? 20 : 10)
            s.score += scoreVal
            setScore(s.score)
            for (let k = 0; k < 14; k++) {
              s.particles.push({
                x: en.x + en.w / 2,
                y: en.y + en.h / 2,
                vx: (Math.random() - 0.5) * 4.5,
                vy: (Math.random() - 0.5) * 4.5,
                color: en.type === 'malware_golem' ? '#ef4444' : en.type === 'packet_bat' ? '#a855f7' : en.type === 'squatter_drone' ? '#38bdf8' : '#34d399',
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

      // Hit Enemy Bullets
      if (s.enemyBullets && s.enemyBullets.length > 0) {
        for (let k = s.enemyBullets.length - 1; k >= 0; k--) {
          const eb = s.enemyBullets[k]
          const ebSize = eb.size || 5
          if (
            p.x < eb.x + ebSize &&
            p.x + p.w > eb.x - ebSize &&
            p.y < eb.y + ebSize &&
            p.y + p.h > eb.y - ebSize
          ) {
            eb.hp = (eb.hp || 1) - p.damage
            if (soundEnabledRef.current) playBossHit()
            for (let m = 0; m < 5; m++) {
              s.particles.push({
                x: eb.x,
                y: eb.y,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                color: eb.color || '#38bdf8',
                life: 10,
                size: 2,
              })
            }
            if (eb.hp <= 0) {
              s.enemyBullets.splice(k, 1)
              s.score += 15
              setScore(s.score)
              if (s.floatingTexts) {
                s.floatingTexts.push({
                  x: eb.x,
                  y: eb.y - 8,
                  text: '+15 DEFENSE',
                  color: '#38bdf8',
                  vy: -1.0,
                  life: 25,
                  font: 'bold 8.5px "JetBrains Mono", monospace',
                })
              }
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
            if (bb.hp && bb.hp > 1) {
              bb.hp -= p.damage
            } else {
              s.boss.bullets.splice(k, 1)
            }
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
          (!p.hitTargets || !p.hitTargets.includes('boss')) &&
          p.x < boss.x + boss.w &&
          p.x + p.w > boss.x &&
          p.y < boss.y + boss.h &&
          p.y + p.h > boss.y
        ) {
          if (!p.hitTargets) p.hitTargets = []
          p.hitTargets.push('boss')
          boss.hp -= p.damage
          boss.hitFlash = 5
          if (soundEnabledRef.current) playBossHit()
          if (s.floatingTexts) {
            const isCrit = p.damage > 1
            s.floatingTexts.push({
              x: p.x + (Math.random() - 0.5) * 14,
              y: p.y - 8,
              text: isCrit ? `CRIT! -${p.damage}` : `-${p.damage}`,
              color: isCrit ? '#f43f5e' : '#fbbf24',
              vy: -0.9,
              life: 24,
              font: isCrit ? 'bold 10px "JetBrains Mono", monospace' : 'bold 8.5px "JetBrains Mono", monospace',
            })
          }
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
          // Single instance damage on boss hit: consume projectile
          s.projectiles.splice(i, 1)
          continue
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

    // Cat hitFlash invulnerability countdown
    if (cat.hitFlash > 0) cat.hitFlash--

    // Cat Physics & Horizontal movement (Forward / Backward exploration)
    if (s.moveLeft) {
      cat.vx = Math.max(-3.5, (cat.vx || 0) - 0.55)
    } else if (s.moveRight) {
      cat.vx = Math.min(3.5, (cat.vx || 0) + 0.55)
    } else if (cat.isGrounded && !cat.inRescueFlight) {
      cat.vx = (cat.vx || 0) * 0.82
      if (Math.abs(cat.vx) < 0.05) cat.vx = 0
    }

    if (cat.vx) {
      cat.x += cat.vx
      if (!cat.inRescueFlight && !s.moveLeft && !s.moveRight) {
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
        if (catFeet >= p.y - 4 && catPrevFeet <= p.y + 28 && cat.vy >= 0) {
          cat.y = p.y - cat.h
          cat.vy = 0
          if (!s.moveLeft && !s.moveRight) {
            cat.vx = 0
          }
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
      cat.jumpsLeft = 2
      // In Auto mode only, smoothly settle cat into runway zone (x ~ 35-55)
      if (s.isAuto) {
        if (cat.x > 55) {
          cat.x -= 0.35
        } else if (cat.x < 30) {
          cat.x += 0.2
        }
      }
      const activePlat = s.platforms.find((p) => cat.x + cat.w > p.x && cat.x < p.x + p.w)
      if (activePlat && activePlat.isFloating) {
        cat.y = activePlat.y - cat.h
      }
    } else {
      if (cat.coyoteFrames > 0) cat.coyoteFrames--
    }

    // Horizontal bounds clamp across generous screen runway
    cat.x = Math.max(15, Math.min(270, cat.x))

    if (s.jumpBuffer > 0) {
      if (cat.isGrounded || (cat.coyoteFrames && cat.coyoteFrames > 0)) {
        cat.vy = -5.25
        cat.isGrounded = false
        cat.coyoteFrames = 0
        cat.jumpsLeft = 1
        s.jumpBuffer = 0
        if (soundEnabledRef.current) playPixelJump()
        for (let k = 0; k < 6; k++) {
          s.particles.push({
            x: cat.x + 8 + Math.random() * 16,
            y: cat.y + cat.h,
            vx: (Math.random() - 0.5) * 3,
            vy: Math.random() * 1.5 + 0.5,
            color: '#e2e8f0',
            life: 14,
            size: 2.5,
          })
        }
      } else if (cat.jumpsLeft > 0) {
        cat.vy = -5.25
        cat.jumpsLeft = 0
        s.jumpBuffer = 0
        if (soundEnabledRef.current) playPixelJump()
        for (let k = 0; k < 10; k++) {
          const angle = (k / 10) * Math.PI * 2
          s.particles.push({
            x: cat.x + cat.w / 2,
            y: cat.y + cat.h - 4,
            vx: Math.cos(angle) * (1.8 + Math.random() * 1.2),
            vy: Math.sin(angle) * (1.2 + Math.random() * 0.8) + 0.5,
            color: k % 2 === 0 ? '#38bdf8' : '#fbbf24',
            life: 18,
            size: 2.5,
          })
        }
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

      // Auto-hop second jump if clearing wide gaps or picking up high powerup
      if (!cat.isGrounded && cat.jumpsLeft === 1 && cat.vy > 0.4) {
        const upcomingPlat = s.platforms.find((p) => p.x > cat.x && p.x - cat.x < 90)
        const highPwr = s.powerups.find((pwr) => pwr.x > cat.x && pwr.x - cat.x < 65 && pwr.y < cat.y)
        if (highPwr || (upcomingPlat && upcomingPlat.x - (cat.x + cat.w) > 30)) {
          executeJump(false)
        }
      }
    }

    // Power-Up / Weapon Crate vs Domain Extension Life (+1 UP) Handling
    for (let i = s.powerups.length - 1; i >= 0; i--) {
      const pwr = s.powerups[i]
      const currentY = pwr.y + Math.sin(pwr.bobAngle) * 4
      if (
        cat.x < pwr.x + pwr.w &&
        cat.x + cat.w > pwr.x &&
        cat.y < currentY + pwr.h &&
        cat.y + cat.h > currentY
      ) {
        s.score += (pwr.score || 0)
        
        if (pwr.itemType === 'gun' && pwr.weapon) {
          // Equips specific weapon with concise annotation
          s.weapon = pwr.weapon
          s.bubbleText = `${pwr.icon || '⚡'} ${pwr.weaponName || pwr.label || 'WEAPON'}`
          s.bubbleTimer = 45
          setBubbleText(s.bubbleText)
          if (soundEnabledRef.current) playLaserShoot(pwr.weapon)

          if (s.floatingTexts) {
            s.floatingTexts.push({
              x: pwr.x + pwr.w / 2,
              y: currentY - 8,
              text: `${pwr.icon || '⚡'} ${pwr.weaponName || pwr.label}`,
              color: pwr.color || '#38bdf8',
              vy: -1.0,
              life: 28,
              font: 'bold 11px "JetBrains Mono", monospace',
            })
          }
        } else {
          // Domain Extension: +1 UP Life & Changes Accessory (no text bubble annotation!)
          s.lives = Math.min(5, (s.lives || 0) + 1)
          setLives(s.lives)

          const newAcc = pwr.accessory || ACCESSORIES_LIST[Math.floor(Math.random() * ACCESSORIES_LIST.length)]
          cat.accessory = newAcc
          s.cat.accessory = newAcc

          if (soundEnabledRef.current) playPowerupChime()

          if (s.floatingTexts) {
            s.floatingTexts.push({
              x: pwr.x + pwr.w / 2,
              y: currentY - 8,
              text: '❤️ +1',
              color: '#f43f5e',
              vy: -1.2,
              life: 35,
              font: 'bold 12px "JetBrains Mono", monospace',
            })
          }
        }

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
    if (cat.y > 275) {
      if (cat.inRescueFlight) {
        cat.inRescueFlight = false
      }

      if (s.gameState !== 'CANNON_RESCUE' && (s.godMode || (s.lives && s.lives > 0) || s.isAuto)) {
        s.gameState = 'CANNON_RESCUE'
        if (s.isAuto || s.godMode) {
          s.lives = Math.max(1, s.lives || 3)
        } else {
          s.lives = Math.max(0, (s.lives || 3) - 0.5)
        }
        setLives(s.lives)

        // Find safe platform closest to the comfortable front-left runway zone
        const safePlat =
          s.platforms.find((p) => p.x + p.w > 40 && p.x < 130) ||
          s.platforms.find((p) => p.x >= 0 && p.x < 180) ||
          s.platforms[0] ||
          { x: 20, y: 236, w: 120 }
        const cannonX = 20
        const targetX = Math.max(38, Math.min(68, safePlat ? safePlat.x + 20 : 48))
        const targetY = safePlat ? safePlat.y - cat.h : 210
        const dx = targetX - (cannonX + 20)
        const dy = targetY - 305
        const angleDeg = Math.max(-75, Math.min(-35, Math.atan2(dy, dx) * (180 / Math.PI)))

        s.cannon = {
          active: true,
          phase: 'aim',
          x: cannonX,
          y: 286,
          targetY: 286,
          timer: 0,
          barrelAngle: angleDeg,
          recoil: 0,
          catInside: true,
          targetPlatform: safePlat,
          targetX,
          targetY,
        }
        cat.x = cannonX + 6
        cat.y = 286
        cat.vy = 0
        cat.vx = 0
        cat.inRescueFlight = false
      } else if (!s.isAuto && !s.godMode && (!s.lives || s.lives <= 0) && cat.y > 310 && s.gameState !== 'CANNON_RESCUE' && (!s.cannon || !s.cannon.active)) {
        s.gameState = 'GAMEOVER'
        s.gameOver = true
        setGameOver(true)
        if (soundEnabledRef.current) playGameOver()
      }
    }

    // Absolute pit fail-safe: if cat ever slips below screen during active play, safely catch on platform
    if (cat.y > 315 && s.gameState !== 'GAMEOVER') {
      cat.inRescueFlight = false
      if (s.isAuto || s.godMode || (s.lives && s.lives > 0)) {
        const safePlat = s.platforms.find((p) => p.x + p.w > 30 && p.x < 160) || s.platforms[0] || { x: 20, y: 236, w: 120 }
        cat.x = Math.max(30, Math.min(70, safePlat.x + 20))
        cat.y = safePlat.y - cat.h
        cat.vy = 0
        cat.vx = 0
        cat.isGrounded = true
        if (!s.isAuto && !s.godMode) {
          s.lives = Math.max(0, (s.lives || 3) - 0.5)
          setLives(s.lives)
        }
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

    // Floating Damage Numbers
    if (s.floatingTexts) {
      for (let i = s.floatingTexts.length - 1; i >= 0; i--) {
        const ft = s.floatingTexts[i]
        ft.y += ft.vy
        ft.life--
        if (ft.life <= 0) s.floatingTexts.splice(i, 1)
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
    const h = 330

    // Dynamic duration: 30.0s per Biome with 2.5s crossfade transition
    const curBiomeDur = BIOME_DURATION_MS
    const transitionDuration = TRANSITION_DURATION_MS
    const panDuration = curBiomeDur - transitionDuration

    const currentBiomeIdx = Math.floor(s.bgTimeMs / curBiomeDur) % BIOMES.length
    const nextBiomeIdx = (currentBiomeIdx + 1) % BIOMES.length
    const elapsedInBiome = s.bgTimeMs % curBiomeDur

    ctx.imageSmoothingEnabled = false

    const b = BIOMES[currentBiomeIdx] || BIOMES[0]
    const nextB = BIOMES[nextBiomeIdx] || BIOMES[0]

    let [r, g, bl] = b.skyTop || [96, 165, 250]
    let blendAlpha = 0
    if (elapsedInBiome > panDuration) {
      const rawRatio = (elapsedInBiome - panDuration) / transitionDuration
      const clampedRatio = Math.max(0, Math.min(1, rawRatio))
      blendAlpha = clampedRatio * clampedRatio * (3 - 2 * clampedRatio)
      if (nextB && nextB.skyTop) {
        const [nr, ng, nbl] = nextB.skyTop
        r = Math.round(r + (nr - r) * blendAlpha)
        g = Math.round(g + (ng - g) * blendAlpha)
        bl = Math.round(bl + (nbl - bl) * blendAlpha)
      }
    }

    ctx.fillStyle = `rgb(${r},${g},${bl})`
    ctx.fillRect(0, 0, w, h)

    const currentImg = BIOME_IMAGES[currentBiomeIdx]
    const nextImg = BIOME_IMAGES[nextBiomeIdx]

    // Continuous double-mirrored atmospheric panorama pan across full width (zero edge line artifacts)
    const panProgress = elapsedInBiome / curBiomeDur

    const drawBiome = (img, alpha = 1.0) => {
      if (!img || !img.complete || !img.naturalWidth || !img.naturalHeight) return
      ctx.save()
      if (alpha < 1.0) ctx.globalAlpha = Math.max(0, Math.min(1, alpha))

      const nw = img.naturalWidth
      const nh = img.naturalHeight
      // Crop 2px inward on source to eliminate edge pixel / compression line artifacts
      const cropX = nw > 10 ? 2 : 0
      const cropW = nw > 10 ? nw - 4 : nw

      const scale = h / nh
      const scaledW = Math.ceil(cropW * scale)
      // Biome background pan to the left (1.3x speed)
      const scrollOffset = -(panProgress * scaledW * 1.3)
      const overlap = 2

      // Calculate tile indices needed to span screen width [0, w]
      const firstTile = Math.floor(-scrollOffset / scaledW) - 1
      const lastTile = Math.floor((w - scrollOffset) / scaledW) + 1

      for (let t = firstTile; t <= lastTile; t++) {
        const x1 = Math.floor(t * scaledW + scrollOffset)
        const isFlipped = ((t % 2 + 2) % 2) === 1
        const drawW = scaledW + overlap

        if (isFlipped) {
          ctx.save()
          ctx.translate(x1 + drawW, 0)
          ctx.scale(-1, 1)
          ctx.drawImage(img, cropX, 0, cropW, nh, 0, 0, drawW, h)
          ctx.restore()
        } else {
          ctx.drawImage(img, cropX, 0, cropW, nh, x1, 0, drawW, h)
        }
      }
      ctx.restore()
    }

    if (currentImg && currentImg.complete && currentImg.naturalWidth) {
      drawBiome(currentImg, 1.0)
      if (elapsedInBiome > panDuration && nextImg && nextImg.complete && nextImg.naturalWidth) {
        drawBiome(nextImg, blendAlpha)
      }
    } else if (nextImg && nextImg.complete && nextImg.naturalWidth) {
      drawBiome(nextImg, 1.0)
    }

    // Sky Animations: Birds
    if (b.hasBirds !== false) {
      const birdPhase = s.cat.frameCounter * 0.07
      const birds = [
        { x: ((w + 100) - ((s.cat.frameCounter * 0.91 + 40) % (w + 140))), y: 36, size: 2.2, phase: birdPhase },
        { x: ((w + 160) - ((s.cat.frameCounter * 0.78 + 180) % (w + 180))), y: 24, size: 1.8, phase: birdPhase + 1.4 },
        { x: ((w + 140) - ((s.cat.frameCounter * 1.04 + 300) % (w + 200))), y: 46, size: 1.5, phase: birdPhase + 2.6 },
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

    // Enemies (4 Classic Common Mobs + 6 Post-Boss Cybernetic Enemies)
    if (s.enemies && s.enemies.length > 0) {
      for (let i = 0; i < s.enemies.length; i++) {
        const en = s.enemies[i]
        if (en.type === 'glitch_bug') {
          renderGlitchBug(ctx, en)
        } else if (en.type === 'squatter_drone') {
          renderSquatterDrone(ctx, en)
        } else if (en.type === 'packet_bat') {
          renderPacketBat(ctx, en)
        } else if (en.type === 'malware_golem') {
          renderMalwareGolem(ctx, en)
        } else if (en.type === 'beetle_infantry') {
          renderBeetleInfantry(ctx, en)
        } else if (en.type === 'mantis_sniper') {
          renderMantisSniper(ctx, en)
        } else if (en.type === 'volt_hornet') {
          renderVoltHornet(ctx, en)
        } else if (en.type === 'centipede_artillery') {
          renderCentipedeArtillery(ctx, en)
        } else if (en.type === 'crab_juggernaut') {
          renderCrabJuggernaut(ctx, en)
        } else if (en.type === 'moth_phantom') {
          renderMothPhantom(ctx, en)
        } else {
          renderGlitchBug(ctx, en)
        }
      }
    }

    // Enemy Projectiles & Bullets
    if (s.enemyBullets && s.enemyBullets.length > 0) {
      renderEnemyBullets(ctx, s.enemyBullets)
    }

    // Epic Progressive Boss
    if (s.boss && s.boss.active) {
      renderBoss(ctx, s.boss)
    }

    // Floating Weapon Supply Crates & Domain Extension Life Badges
    for (let i = 0; i < s.powerups.length; i++) {
      const pwr = s.powerups[i]
      const curY = pwr.y + Math.sin(pwr.bobAngle) * 4

      if (pwr.itemType === 'gun') {
        // --- 1. SCI-FI WEAPON CRATE ---
        ctx.save()
        // Drop shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'
        roundRect(ctx, pwr.x - 1, curY + 2, 34, 20, 3)
        ctx.fill()

        // Tactical Chassis
        ctx.fillStyle = '#0f172a'
        roundRect(ctx, pwr.x - 2, curY, 34, 20, 3)
        ctx.fill()
        ctx.strokeStyle = pwr.color || '#38bdf8'
        ctx.lineWidth = 1.3
        ctx.stroke()

        // Reinforced Armor Edges & Rivets
        ctx.fillStyle = '#334155'
        ctx.fillRect(pwr.x - 1, curY + 1, 3, 3)
        ctx.fillRect(pwr.x + 30, curY + 1, 3, 3)
        ctx.fillRect(pwr.x - 1, curY + 16, 3, 3)
        ctx.fillRect(pwr.x + 30, curY + 16, 3, 3)

        // Center Weapon Icon & Label
        ctx.fillStyle = pwr.color || '#fbbf24'
        ctx.font = 'bold 8px "JetBrains Mono", monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(`${pwr.icon || '⚡'} ${pwr.label}`, pwr.x + 15, curY + 10)
        ctx.restore()
      } else {
        // --- 2. DOMAIN EXTENSION LIFE BADGE (+1 UP) ---
        ctx.save()
        // Pulsing Life Aura
        const pulse = 0.3 + Math.sin(pwr.bobAngle * 2) * 0.15
        ctx.strokeStyle = pwr.color || '#f43f5e'
        ctx.lineWidth = 2.5
        ctx.globalAlpha = pulse
        roundRect(ctx, pwr.x - 4, curY - 2, 38, 22, 5)
        ctx.stroke()
        ctx.globalAlpha = 1.0

        // Badge Body
        ctx.fillStyle = pwr.color || '#ea580c'
        roundRect(ctx, pwr.x - 2, curY, 34, 18, 4)
        ctx.fill()
        ctx.strokeStyle = '#090d16'
        ctx.lineWidth = 1.2
        ctx.stroke()

        // Glint highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
        roundRect(ctx, pwr.x - 1, curY + 1, 32, 6, 2)
        ctx.fill()

        // Heart Icon + TLD Label
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 8.5px "JetBrains Mono", monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(`❤️${pwr.label}`, pwr.x + 15, curY + 9.5)
        ctx.restore()
      }
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

    // Floating Damage Numbers & Combat Texts
    if (s.floatingTexts && s.floatingTexts.length > 0) {
      for (let i = 0; i < s.floatingTexts.length; i++) {
        const ft = s.floatingTexts[i]
        const alpha = Math.min(1, ft.life / 10)
        ctx.save()
        ctx.fillStyle = ft.color || '#fbbf24'
        ctx.font = ft.font || 'bold 8.5px "JetBrains Mono", monospace'
        ctx.textAlign = 'center'
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
        ctx.shadowBlur = 3
        ctx.globalAlpha = alpha
        ctx.fillText(ft.text, ft.x, ft.y)
        ctx.restore()
      }
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
        s.cat.accessory,
        s.cat.hitFlash
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

    if (s.isAuto) {
      // IN AUTO MODE: No score or hazard metrics! Just hopping & accessories!
      ctx.fillStyle = '#10b981'
      roundRect(ctx, 6, 4.5, 84, 17, 4)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 8.5px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('🐾 AUTO TOUR', 48, 13)

      const accLabel = ACCESSORY_NAMES[s.cat.accessory] || 'DEFAULT'
      ctx.fillStyle = '#0284c7'
      roundRect(ctx, 96, 4.5, 140, 17, 4)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 8px "JetBrains Mono", monospace'
      ctx.fillText(`GEAR: ${accLabel}`, 166, 13)

      // Biome Badge
      ctx.fillStyle = '#a78bfa'
      ctx.font = 'bold 9px "JetBrains Mono", monospace'
      ctx.textAlign = 'end'
      ctx.textBaseline = 'alphabetic'
      ctx.fillText(`${b.badgeText || 'BIOME'}`, w - 6, 17)
      ctx.textAlign = 'start'
    } else {
      // IN MANUAL / COMBAT MODE:
      // 1. High Score
      ctx.fillStyle = '#38bdf8'
      ctx.font = 'bold 9.5px "JetBrains Mono", monospace'
      ctx.textAlign = 'start'
      ctx.textBaseline = 'alphabetic'
      ctx.fillText(`★HI:${s.highScore}`, 6, 17)

      // 2. Current Score
      ctx.fillStyle = '#facc15'
      ctx.font = 'bold 10px "JetBrains Mono", monospace'
      ctx.fillText(`PTS:${s.score}`, 72, 17)

      // 3. Lives Counter (3 hearts initial, -0.5 hearts per hit)
      if (s.godMode) {
        ctx.fillStyle = '#10b981'
        ctx.font = 'bold 9.5px "JetBrains Mono", monospace'
        ctx.fillText(`🛡️GOD`, 134, 17)
      } else {
        const curLives = Math.max(0, s.lives ?? 5)
        const fullHearts = Math.floor(curLives)
        const hasHalf = (curLives % 1) >= 0.5
        let heartsStr = ''
        for (let h = 0; h < fullHearts; h++) heartsStr += '❤️'
        if (hasHalf) heartsStr += '💔'
        if (!heartsStr) heartsStr = '💀'

        ctx.fillStyle = curLives >= 3 ? '#f43f5e' : curLives >= 1.5 ? '#fb923c' : '#ef4444'
        ctx.font = 'bold 8.5px "JetBrains Mono", monospace'
        ctx.fillText(`${heartsStr}`, 124, 17)
      }

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
        s.godMode
          ? '#34d399'
          : s.weapon === 'railgun'
          ? '#06b6d4'
          : s.weapon === 'spread'
          ? '#c084fc'
          : s.weapon === 'missile'
          ? '#f97316'
          : '#94a3b8'
      ctx.fillStyle = weaponCol
      ctx.font = 'bold 9px "JetBrains Mono", monospace'
      ctx.fillText(s.godMode ? `${weaponBadge} ∞` : `${weaponBadge}`, 196, 17)

      // 5. Mode Badge (Campaign / Casual)
      const isCampMode = s.gameMode === 'campaign'
      ctx.fillStyle = isCampMode ? '#10b981' : '#a855f7'
      ctx.font = 'bold 8.5px "JetBrains Mono", monospace'
      ctx.fillText(isCampMode ? 'QUEST' : 'CASUAL', 242, 17)

      // 6. Biome Badge
      ctx.fillStyle = '#a78bfa'
      ctx.font = 'bold 9px "JetBrains Mono", monospace'
      ctx.textAlign = 'end'
      ctx.fillText(`${b.badgeText || 'BIOME'}`, w - 6, 17)
      ctx.textAlign = 'start'
    }

    // Boss Health Bar HUD
    if (s.boss && s.boss.active && s.boss.hp > 0) {
      renderBossHud(ctx, s.boss, w)
    }

    // Dynamic Floating Affirmation / Speech Bubble (Responsive Width - Zero Clipping)
    if (s.bubbleText && s.bubbleTimer > 0) {
      ctx.save()
      ctx.font = 'bold 9px "JetBrains Mono", monospace'
      const textW = ctx.measureText(s.bubbleText).width
      const padX = 10
      const bubbleW = Math.min(w - 24, Math.max(110, textW + padX * 2))
      const bubbleH = 22
      const bx = Math.min(w - bubbleW - 10, Math.max(10, s.cat.x + 16))
      const by = Math.max(30, Math.min(h - bubbleH - 12, s.cat.y - 24))

      // Drop shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'
      roundRect(ctx, bx + 1.5, by + 2, bubbleW, bubbleH, 6)
      ctx.fill()

      // Main pill
      ctx.fillStyle = '#ffffff'
      roundRect(ctx, bx, by, bubbleW, bubbleH, 6)
      ctx.fill()
      ctx.strokeStyle = '#0f172a'
      ctx.lineWidth = 1.4
      ctx.stroke()

      // Pointer Tail pointing down-left toward Arabella
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.moveTo(bx + 6, by + bubbleH)
      ctx.lineTo(bx + 14, by + bubbleH)
      ctx.lineTo(bx + 2, by + bubbleH + 4)
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = '#0f172a'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(s.bubbleText, bx + bubbleW / 2, by + bubbleH / 2)
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

      const boxW = 270
      const boxX = (w - boxW) / 2
      const boxY = 36
      const boxH = 210

      ctx.fillStyle = '#0f172a'
      roundRect(ctx, boxX, boxY, boxW, boxH, 14)
      ctx.fill()
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 2.2
      ctx.stroke()

      // Top-Right [✕ CLOSE] Button
      ctx.fillStyle = '#ef4444'
      roundRect(ctx, boxX + boxW - 28, boxY + 8, 20, 20, 4)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 11px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('✕', boxX + boxW - 18, boxY + 18)

      ctx.fillStyle = '#ef4444'
      ctx.font = '800 15px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('● GAME OVER ●', w / 2, boxY + 22)

      // Clean neatly aligned stats rows
      ctx.font = '700 10.5px "JetBrains Mono", monospace'

      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'start'
      ctx.fillText('DOMAINS HOPPED:', boxX + 16, boxY + 56)
      ctx.textAlign = 'end'
      ctx.fillText(`${s.score}`, boxX + boxW - 16, boxY + 56)

      ctx.fillStyle = '#38bdf8'
      ctx.textAlign = 'start'
      ctx.fillText('ALL-TIME BEST:', boxX + 16, boxY + 78)
      ctx.textAlign = 'end'
      ctx.fillText(`${s.highScore}`, boxX + boxW - 16, boxY + 78)

      ctx.fillStyle = '#facc15'
      ctx.textAlign = 'start'
      ctx.fillText('BOSSES SLAIN:', boxX + 16, boxY + 100)
      ctx.textAlign = 'end'
      ctx.fillText(`${s.bossesDefeated || 0} / 6`, boxX + boxW - 16, boxY + 100)

      const biomeObj = BIOMES[s.currentBiome % BIOMES.length] || BIOMES[0]
      ctx.fillStyle = '#a78bfa'
      ctx.textAlign = 'start'
      ctx.fillText('BIOME REACHED:', boxX + 16, boxY + 122)
      ctx.textAlign = 'end'
      ctx.fillText(`${biomeObj.badgeText || biomeObj.name}`, boxX + boxW - 16, boxY + 122)

      // Dual Action Buttons: [↻ RETRY RUN] and [✕ CLOSE]
      const btnY = boxY + 146
      const btnH = 28
      const btnW = 110

      // 1. Retry Button
      ctx.fillStyle = '#0284c7'
      roundRect(ctx, w / 2 - btnW - 6, btnY, btnW, btnH, 6)
      ctx.fill()
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 1.2
      ctx.stroke()
      ctx.fillStyle = '#ffffff'
      ctx.font = '700 11px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('↻ RETRY', w / 2 - btnW / 2 - 6, btnY + btnH / 2)

      // 2. Close Button
      ctx.fillStyle = '#334155'
      roundRect(ctx, w / 2 + 6, btnY, btnW, btnH, 6)
      ctx.fill()
      ctx.strokeStyle = '#64748b'
      ctx.lineWidth = 1.2
      ctx.stroke()
      ctx.fillStyle = '#ffffff'
      ctx.font = '700 11px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('✕ CLOSE', w / 2 + btnW / 2 + 6, btnY + btnH / 2)

      ctx.fillStyle = '#94a3b8'
      ctx.font = '500 8.5px "JetBrains Mono", monospace'
      ctx.fillText('HIT [✕ CLOSE] OR CLICK RETRY', w / 2, boxY + 192)
      ctx.textAlign = 'start'
      ctx.textBaseline = 'alphabetic'
    }

    // Final Grand Victory Ending Overlay (All 6 Overlords Defeated)
    if (s.gameState === 'VICTORY') {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.94)'
      ctx.fillRect(0, 0, w, h)

      const boxW = 320
      const boxH = 240
      const boxX = (w - boxW) / 2
      const boxY = (h - boxH) / 2

      // Golden Trophy Plaque
      ctx.save()
      const goldGrad = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxH)
      goldGrad.addColorStop(0, '#1e1b4b')
      goldGrad.addColorStop(0.5, '#0f172a')
      goldGrad.addColorStop(1, '#020617')
      ctx.fillStyle = goldGrad
      roundRect(ctx, boxX, boxY, boxW, boxH, 14)
      ctx.fill()
      ctx.strokeStyle = '#fbbf24'
      ctx.lineWidth = 2.5
      ctx.stroke()

      // 4 Brass Rivets
      ctx.fillStyle = '#f59e0b'
      ctx.fillRect(boxX + 6, boxY + 6, 3, 3)
      ctx.fillRect(boxX + boxW - 9, boxY + 6, 3, 3)
      ctx.fillRect(boxX + 6, boxY + boxH - 9, 3, 3)
      ctx.fillRect(boxX + boxW - 9, boxY + boxH - 9, 3, 3)

      // Gold Trophy Icon with Shimmer Aura
      const tX = w / 2
      const tY = boxY + 30
      // Shimmer rays
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)'
      ctx.lineWidth = 1
      for (let r = 0; r < 8; r++) {
        const ang = (r / 8) * Math.PI * 2 + (Date.now() * 0.002)
        ctx.beginPath()
        ctx.moveTo(tX, tY)
        ctx.lineTo(tX + Math.cos(ang) * 26, tY + Math.sin(ang) * 26)
        ctx.stroke()
      }

      // Trophy Cup Drawing
      ctx.fillStyle = '#f59e0b'
      roundRect(ctx, tX - 12, tY - 12, 24, 16, 3)
      ctx.fill()
      ctx.fillStyle = '#fbbf24'
      ctx.fillRect(tX - 5, tY + 4, 10, 6)
      ctx.fillRect(tX - 11, tY + 10, 22, 5)
      ctx.strokeStyle = '#fbbf24'
      ctx.lineWidth = 2
      ctx.strokeRect(tX - 17, tY - 9, 5, 10)
      ctx.strokeRect(tX + 12, tY - 9, 5, 10)

      // Headline
      ctx.fillStyle = '#fbbf24'
      ctx.font = '800 13px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.fillText('🏆 ★ VICTORY ACHIEVED! ★ 🏆', w / 2, boxY + 62)

      ctx.fillStyle = '#38bdf8'
      ctx.font = '700 9.5px "JetBrains Mono", monospace'
      ctx.fillText('THE DOMAIN REALM IS LIBERATED!', w / 2, boxY + 76)

      // Thank You Note in styled typography
      ctx.fillStyle = '#f1f5f9'
      ctx.font = '600 8.5px "JetBrains Mono", monospace'
      ctx.fillText(`All 6 Cyber Overlords Defeated in ${s.difficulty === 'hard' ? 'HARD [2x HP]' : 'EASY [1x HP]'} Mode!`, w / 2, boxY + 93)
      ctx.fillStyle = '#a78bfa'
      ctx.font = 'italic 8px "JetBrains Mono", monospace'
      ctx.fillText('Congratulations, Grand Domain Master!', w / 2, boxY + 106)

      // Run Stats Box
      ctx.fillStyle = '#090d16'
      roundRect(ctx, boxX + 14, boxY + 116, boxW - 28, 44, 6)
      ctx.fill()
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.font = 'bold 8.5px "JetBrains Mono", monospace'
      ctx.textAlign = 'start'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText('FINAL SCORE:', boxX + 22, boxY + 132)
      ctx.textAlign = 'end'
      ctx.fillStyle = '#fbbf24'
      ctx.fillText(`${s.score} PTS`, boxX + boxW - 22, boxY + 132)

      ctx.textAlign = 'start'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText('DIFFICULTY:', boxX + 22, boxY + 148)
      ctx.textAlign = 'end'
      ctx.fillStyle = s.difficulty === 'hard' ? '#f43f5e' : '#10b981'
      ctx.fillText(`${(s.difficulty || 'easy').toUpperCase()} [${s.difficulty === 'hard' ? '2x HP' : '1x HP'}]`, boxX + boxW - 22, boxY + 148)

      // 2 Action Buttons Side-by-Side
      const btnW = 136
      const btnH = 26
      const btnY = boxY + 172
      const btn1X = boxX + 16
      const btn2X = boxX + boxW - 16 - btnW

      // Button 1: [ ↻ RETRY (MANUAL) ]
      ctx.fillStyle = '#047857'
      roundRect(ctx, btn1X, btnY, btnW, btnH, 6)
      ctx.fill()
      ctx.strokeStyle = '#34d399'
      ctx.lineWidth = 1.2
      ctx.stroke()
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 9.5px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('↻ RETRY RUN', btn1X + btnW / 2, btnY + btnH / 2)

      // Button 2: [ 🤖 CASUAL AUTO ]
      ctx.fillStyle = '#4338ca'
      roundRect(ctx, btn2X, btnY, btnW, btnH, 6)
      ctx.fill()
      ctx.strokeStyle = '#818cf8'
      ctx.lineWidth = 1.2
      ctx.stroke()
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 9.5px "JetBrains Mono", monospace'
      ctx.fillText('🤖 CASUAL AUTO', btn2X + btnW / 2, btnY + btnH / 2)

      ctx.textAlign = 'start'
      ctx.textBaseline = 'alphabetic'
      ctx.restore()
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

      // Dynamic millisecond timing for biomes (35s with 2s crossfade)
      const activeDuration = BIOME_DURATION_MS
      stateRef.current.bgTimeMs += delta
      stateRef.current.currentBiome = Math.floor(stateRef.current.bgTimeMs / activeDuration) % BIOMES.length

      // Fixed 60Hz physics accumulator
      physicsAccumulator += delta
      let steps = 0
      while (physicsAccumulator >= FIXED_STEP_MS && steps < 5) {
        try {
          updateGame()
        } catch (err) {
          console.error('Game update error:', err)
        }
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
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return
      if (e.repeat) return

      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        stateRef.current.moveLeft = true
        if (stateRef.current.isAuto && onToggleAutoMode) {
          onToggleAutoMode(false)
          stateRef.current.isAuto = false
        }
      } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        stateRef.current.moveRight = true
        if (stateRef.current.isAuto && onToggleAutoMode) {
          onToggleAutoMode(false)
          stateRef.current.isAuto = false
        }
      } else if (
        e.code === 'Space' ||
        e.code === 'ArrowUp' ||
        e.code === 'KeyW'
      ) {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
          e.preventDefault()
        }
        if (stateRef.current.gameState === 'GAMEOVER' || stateRef.current.gameState === 'VICTORY') {
          if (Date.now() < (stateRef.current.actionUnlockTime || 0)) return
          resetGame(true)
        } else {
          executeJump(true)
        }
      } else if (
        e.code === 'KeyF' ||
        e.code === 'KeyX' ||
        e.code === 'KeyJ' ||
        e.code === 'KeyZ' ||
        e.code === 'Enter' ||
        e.code === 'ShiftLeft' ||
        e.code === 'ShiftRight'
      ) {
        if (stateRef.current.gameState === 'GAMEOVER' || stateRef.current.gameState === 'VICTORY') {
          if (Date.now() < (stateRef.current.actionUnlockTime || 0)) return
          resetGame(true)
        } else {
          executeShoot(true)
        }
      }
    }

    const handleKeyUp = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return

      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        stateRef.current.moveLeft = false
      } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        stateRef.current.moveRight = false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    animationId = requestAnimationFrame(loop)
    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const handlePointerDown = (e) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = 380 / rect.width
    const scaleY = 330 / rect.height
    const clickX = (e.clientX - rect.left) * scaleX
    const clickY = (e.clientY - rect.top) * scaleY

    const s = stateRef.current
    if (Date.now() < (s.actionUnlockTime || 0)) return

    if (s.gameState === 'GAMEOVER') {
      const boxW = 270
      const boxX = (380 - boxW) / 2
      const boxY = 36
      const btnY = boxY + 146
      const btnH = 28
      const btnW = 110

      // 1. Top-right [✕] Close button
      if (
        clickX >= boxX + boxW - 32 &&
        clickX <= boxX + boxW - 4 &&
        clickY >= boxY + 4 &&
        clickY <= boxY + 32
      ) {
        startAutoMode()
        return
      }

      // 2. Bottom [✕ CLOSE] button
      if (
        clickX >= 380 / 2 + 6 &&
        clickX <= 380 / 2 + 6 + btnW &&
        clickY >= btnY &&
        clickY <= btnY + btnH
      ) {
        startAutoMode()
        return
      }

      // 3. Bottom [↻ RETRY] button
      if (
        clickX >= 380 / 2 - btnW - 6 &&
        clickX <= 380 / 2 - 6 &&
        clickY >= btnY &&
        clickY <= btnY + btnH
      ) {
        startCampaign(s.difficulty || 'easy')
        return
      }

      return
    }

    if (s.gameState === 'VICTORY') {
      const boxW = 320
      const boxH = 240
      const boxX = (380 - boxW) / 2
      const boxY = (330 - boxH) / 2
      const btnW = 136
      const btnH = 26
      const btnY = boxY + 172
      const btn1X = boxX + 16
      const btn2X = boxX + boxW - 16 - btnW

      // Button 1: [ ↻ RETRY RUN ]
      if (clickX >= btn1X && clickX <= btn1X + btnW && clickY >= btnY && clickY <= btnY + btnH) {
        startCampaign(s.difficulty || 'easy')
        return
      }

      // Button 2: [ 🤖 CASUAL AUTO ]
      if (clickX >= btn2X && clickX <= btn2X + btnW && clickY >= btnY && clickY <= btnY + btnH) {
        startAutoMode()
        return
      }

      return
    }

    executeJump(true)
  }

  // Testing Ground Direct Boss & Enemy Spawning Methods
  const spawnBossDirect = (identifier) => {
    const s = stateRef.current
    let targetBoss = null
    if (typeof identifier === 'number') {
      targetBoss = BOSS_MILESTONES[identifier % BOSS_MILESTONES.length]
    } else {
      targetBoss =
        BOSS_MILESTONES.find(
          (b) =>
            b.type === identifier ||
            b.name.toLowerCase().includes(String(identifier).toLowerCase())
        ) || BOSS_MILESTONES[0]
    }
    if (!targetBoss) return

    s.gameState = 'PLAYING'
    s.gameOver = false
    s.countdown = 0
    s.countdownTimer = 0
    s.speed = BASE_SPEED
    s.enemies = []
    s.projectiles = []
    s.lives = Math.max(s.lives, 5)
    setLives(s.lives)
    setGameOver(false)

    // Ensure cat is in a valid state on platform
    if (s.cat.isDead || s.cat.y > 230) {
      s.cat.y = 170
      s.cat.vy = 0
      s.cat.isDead = false
      s.cat.deathTimer = 0
      s.cat.isGrounded = true
      s.cat.hitFlash = 0
    }

    const hpMult = s.difficulty === 'hard' ? 2 : 1
    const bossHp = targetBoss.hp * hpMult

    s.boss = {
      active: true,
      name: targetBoss.name,
      type: targetBoss.type,
      x: 395,
      targetX: 265,
      y: 95,
      baseY: 95,
      w: 56,
      h: 50,
      hp: bossHp,
      maxHp: bossHp,
      floatAngle: 0,
      attackTimer: 0,
      attackPattern: 0,
      actionState: '',
      telegraph: null,
      phase: 'enter',
      hitFlash: 0,
      bullets: [],
      deathTimer: 0,
      reward: targetBoss.reward * hpMult,
      isFinal: Boolean(targetBoss.isFinal),
      color: targetBoss.color,
      teleportTimer: 0,
    }

    if (soundEnabledRef.current) playBossWarning()
    s.bubbleText = `🧪 TEST SPAWN: ${targetBoss.name} [${s.difficulty === 'hard' ? '2x HP' : '1x HP'}]!`
    s.bubbleTimer = 120
    setBubbleText(s.bubbleText)
  }

  const spawnEnemyDirect = (enemyType) => {
    const s = stateRef.current
    s.gameState = 'PLAYING'
    s.gameOver = false
    setGameOver(false)

    const spawnX = 360
    const spawnY = 220

    if (enemyType === 'glitch_bug') {
      s.enemies.push({
        type: 'glitch_bug',
        x: spawnX,
        y: spawnY - 4,
        w: 26,
        h: 24,
        vx: -0.6,
        patrolLeft: spawnX - 25,
        patrolRight: spawnX + 25,
        hp: 1,
        maxHp: 1,
        scoreVal: 10,
        frame: 0,
        hitFlash: 0,
        actionState: 'idle',
        laserTimer: 0,
        laserPhase: 0,
        shootCooldown: 90,
      })
    } else if (enemyType === 'squatter_drone') {
      s.enemies.push({
        type: 'squatter_drone',
        x: spawnX,
        y: 110,
        baseY: 110,
        w: 26,
        h: 26,
        bobAngle: 0,
        hp: 2,
        maxHp: 2,
        scoreVal: 20,
        frame: 0,
        hitFlash: 0,
        actionState: 'idle',
        laserTimer: 0,
        laserPhase: 0,
        shootCooldown: 100,
      })
    } else if (enemyType === 'packet_bat') {
      s.enemies.push({
        type: 'packet_bat',
        x: spawnX,
        y: 95,
        baseY: 95,
        w: 28,
        h: 20,
        vx: -0.85,
        hp: 2,
        maxHp: 2,
        scoreVal: 25,
        frame: 0,
        hitFlash: 0,
        actionState: 'idle',
        laserTimer: 0,
        laserPhase: 0,
        shootCooldown: 95,
      })
    } else if (enemyType === 'malware_golem') {
      s.enemies.push({
        type: 'malware_golem',
        x: spawnX,
        y: spawnY - 10,
        w: 32,
        h: 30,
        vx: -0.35,
        patrolLeft: spawnX - 20,
        patrolRight: spawnX + 20,
        hp: 3,
        maxHp: 3,
        scoreVal: 35,
        frame: 0,
        hitFlash: 0,
        actionState: 'idle',
        laserTimer: 0,
        laserPhase: 0,
        shootCooldown: 110,
      })
    } else if (enemyType === 'beetle_infantry') {
      s.enemies.push({
        type: 'beetle_infantry',
        x: spawnX,
        y: spawnY - 4,
        w: 34,
        h: 24,
        vx: -0.55,
        patrolLeft: spawnX - 25,
        patrolRight: spawnX + 25,
        hp: 2,
        maxHp: 2,
        scoreVal: 25,
        frame: 0,
        hitFlash: 0,
        actionState: 'idle',
        laserTimer: 0,
        laserPhase: 0,
        shootCooldown: 100,
      })
    } else if (enemyType === 'mantis_sniper') {
      s.enemies.push({
        type: 'mantis_sniper',
        x: spawnX,
        y: spawnY - 12,
        w: 36,
        h: 32,
        vx: -0.65,
        patrolLeft: spawnX - 25,
        patrolRight: spawnX + 25,
        hp: 3,
        maxHp: 3,
        scoreVal: 40,
        frame: 0,
        hitFlash: 0,
        actionState: 'idle',
        laserTimer: 0,
        laserPhase: 0,
        shootCooldown: 120,
      })
    } else if (enemyType === 'volt_hornet') {
      s.enemies.push({
        type: 'volt_hornet',
        x: spawnX,
        y: 110,
        baseY: 110,
        w: 30,
        h: 26,
        bobAngle: 0,
        hp: 2,
        maxHp: 2,
        scoreVal: 35,
        frame: 0,
        hitFlash: 0,
        actionState: 'idle',
        laserTimer: 0,
        laserPhase: 0,
        shootCooldown: 110,
      })
    } else if (enemyType === 'centipede_artillery') {
      s.enemies.push({
        type: 'centipede_artillery',
        x: spawnX,
        y: spawnY - 2,
        w: 44,
        h: 22,
        vx: -0.4,
        patrolLeft: spawnX - 25,
        patrolRight: spawnX + 25,
        hp: 4,
        maxHp: 4,
        scoreVal: 55,
        frame: 0,
        hitFlash: 0,
        actionState: 'idle',
        laserTimer: 0,
        laserPhase: 0,
        shootCooldown: 130,
      })
    } else if (enemyType === 'crab_juggernaut') {
      s.enemies.push({
        type: 'crab_juggernaut',
        x: spawnX,
        y: spawnY - 10,
        w: 42,
        h: 32,
        vx: -0.3,
        patrolLeft: spawnX - 20,
        patrolRight: spawnX + 20,
        hp: 5,
        maxHp: 5,
        scoreVal: 75,
        frame: 0,
        hitFlash: 0,
        actionState: 'idle',
        laserTimer: 0,
        laserPhase: 0,
        shootCooldown: 120,
      })
    } else if (enemyType === 'moth_phantom') {
      s.enemies.push({
        type: 'moth_phantom',
        x: spawnX,
        y: 95,
        baseY: 95,
        w: 38,
        h: 32,
        vx: -0.6,
        hp: 4,
        maxHp: 4,
        scoreVal: 90,
        frame: 0,
        hitFlash: 0,
        actionState: 'idle',
        laserTimer: 0,
        laserPhase: 0,
        shootCooldown: 110,
      })
    }

    s.bubbleText = `👾 TEST ENEMY: ${enemyType.toUpperCase()}!`
    s.bubbleTimer = 90
    setBubbleText(s.bubbleText)
  }

  useImperativeHandle(ref, () => ({
    jump: (fromUser = true) => executeJump(fromUser),
    shoot: (fromUser = true) => executeShoot(fromUser),
    moveLeft: (active) => {
      stateRef.current.moveLeft = Boolean(active)
      if (active && stateRef.current.isAuto && onToggleAutoMode) {
        onToggleAutoMode(false)
        stateRef.current.isAuto = false
      }
    },
    moveRight: (active) => {
      stateRef.current.moveRight = Boolean(active)
      if (active && stateRef.current.isAuto && onToggleAutoMode) {
        onToggleAutoMode(false)
        stateRef.current.isAuto = false
      }
    },
    closeDeathScreen: () => {
      startAutoMode()
    },
    restart: (fromUser = true) => resetGame(fromUser),
    startCampaign: (diff = 'easy') => startCampaign(diff),
    startAutoMode: () => startAutoMode(),
    setDifficulty: (diff) => {
      stateRef.current.difficulty = diff
      stateRef.current.bossHpMultiplier = diff === 'hard' ? 2 : 1
    },
    setGameMode: (mode) => {
      stateRef.current.gameMode = mode
    },
    nextBiome: () => nextBiome(),
    spawnBoss: spawnBossDirect,
    spawnEnemy: spawnEnemyDirect,
    setWeapon: (weaponType) => {
      stateRef.current.weapon = weaponType
      stateRef.current.bubbleText = `🔫 WEAPON: ${weaponType.toUpperCase()}`
      stateRef.current.bubbleTimer = 80
      setBubbleText(stateRef.current.bubbleText)
    },
    addLives: (amt = 3) => {
      stateRef.current.lives += amt
      setLives(stateRef.current.lives)
    },
    setGodMode: (val) => {
      stateRef.current.godMode = Boolean(val)
    },
    clearArena: () => {
      stateRef.current.boss = null
      stateRef.current.enemies = []
      stateRef.current.projectiles = []
    },
  }))

  return (
    <div
      onPointerDown={handlePointerDown}
      className="relative w-full overflow-hidden rounded-xl border border-slate-700 shadow-inner cursor-pointer select-none group"
      title="Click anywhere to jump, shoot, or restart! (1-click mouse control)"
    >
      <canvas
        ref={canvasRef}
        width={380}
        height={330}
        className="w-full h-auto block object-contain"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-black/[0.03] to-transparent bg-[length:100%_4px]" />
    </div>
  )
})

export default DomainGameEngine
