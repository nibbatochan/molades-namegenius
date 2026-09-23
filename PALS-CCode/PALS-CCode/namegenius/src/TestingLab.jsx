import React, { useState, useRef, useEffect } from 'react'
import AppNavbar from './components/AppNavbar'
import {
  playLaserShoot,
  playBossHit,
  playBossDefeated,
  playMechanicalClick,
  isSoundMuted,
  setSoundMuted,
  setMusicEnabled,
  getMasterVolume,
  setMasterVolume,
} from './utils/audio'
import DomainGameEngine from './components/DomainGameEngine'
import { SkeuoTactileSwitch, SkeuoVolumeKnob } from './components/HeroHardwareGadget'
import {
  ArrowLeft,
  Sparkle,
  Sword,
  Crosshair,
  PawPrint,
  ArrowClockwise,
  ShieldCheck,
  Heart,
  Skull,
  Bug,
  Alien,
  Robot,
  Fire,
  Lightning,
  Cube,
  MagnifyingGlassPlus,
  Play,
  Pause,
} from '@phosphor-icons/react'

// All 6 Progression Bosses with complete attributes and telegraphs
const BOSS_DATA = [
  {
    id: 'squatter_mech',
    type: 'squatter_mech',
    name: 'MEGABYTE SQUATTER MECHA',
    shortName: 'SQUATTER MECH',
    milestone: '1000 PTS',
    hp: 55,
    color: '#ef4444',
    bgBadge: 'bg-red-500/10 text-red-400 border-red-500/30',
    icon: '🤖',
    category: 'Bipedal Diesel Combat Walker',
    description:
      'Heavily armored crimson & gunmetal combat walker with glowing cyan 404 digital matrix visor, hydraulic piston legs, cylindrical rear jet turbine, and a high-speed diamond spiral drill arm.',
    attacks: [
      { id: 'dash', name: '💎 ROCKET DRILL DASH', desc: '4-frame supersonic rocket thrust dash with massive drill impact spark burst' },
      { id: 'salvo', name: '🚀 5-ROCKET SALVO', desc: 'Fires 5 trailing micro-rockets in an evasive spread fan' },
      { id: 'mortar', name: '💣 GROUND MORTAR STRIKES', desc: 'Lobbed artillery shells with danger landing target reticles' },
    ],
  },
  {
    id: 'phishing_hydra',
    type: 'phishing_hydra',
    name: 'TOXIC PHISHING HYDRA',
    shortName: 'PHISHING HYDRA',
    milestone: '1800 PTS',
    hp: 85,
    color: '#10b981',
    bgBadge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    icon: '🐉',
    category: 'Vat Bio-Chimera',
    description:
      'Reinforced chemical containment vat with bubbling toxic slime, sprouting 3 undulating cybernetic serpent heads with bioluminescent venom fangs.',
    attacks: [
      { id: 'spit', name: '🐍 TRIPLE HYDRA SPIT', desc: 'Bioluminescent 3-way venom bubble spread with trailing slime droplets' },
      { id: 'geyser', name: '🧪 TOXIC SLIME GEYSER', desc: 'Dual arcing toxic globule volleys hopping across the arena floor' },
      { id: 'barrage', name: '🌧️ ACID SHOWER BARRAGE', desc: 'Targeted sky canisters bursting with high-contrast floor danger beacons' },
    ],
  },
  {
    id: 'ddos_titan',
    type: 'ddos_titan',
    name: 'DDoS SWARM TITAN',
    shortName: 'SWARM TITAN',
    milestone: '2500 PTS',
    hp: 120,
    color: '#8b5cf6',
    bgBadge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    icon: '👾',
    category: 'Heavy Carrier Obelisk',
    description:
      'Massive obsidian floating dreadnought with a pulsating violet plasma reactor, deployable sawblade swarm drones, and heavy tesla arc dischargers.',
    attacks: [
      { id: 'salvo5', name: '🚀 5-ROCKET SALVO', desc: 'Heavy 5-way wide fan of armor-piercing swarm rockets' },
      { id: 'drones', name: '🛸 SWARM DRONES', desc: 'Deploys rotating sawblade escort drones with spark trails' },
      { id: 'beam', name: '⚡ WARP BEAMS', desc: 'Vertical sky judgement pillars targeting player positions' },
    ],
  },
  {
    id: 'dns_saucer',
    type: 'dns_saucer',
    name: 'DNS HIJACKER PRIME',
    shortName: 'DNS SAUCER',
    milestone: '3200 PTS',
    hp: 165,
    color: '#06b6d4',
    bgBadge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    icon: '🛸',
    category: 'Quantum Saucer',
    description:
      'Iridescent metallic cyan flying saucer with levitating 3D concentric orbital rings, glowing scanner cockpit dome, and ventral quantum warp emitters.',
    attacks: [
      { id: 'thunder', name: '⚡ QUANTUM THUNDER & FIREBALLS', desc: 'Telegraphed crackling sky lightning strike paired with twin arcing fireballs' },
      { id: 'gravity', name: '🌌 GRAVITY ORBS & BULLETS', desc: 'Dense dark-matter gravity spheres alongside high-speed energy bullets' },
      { id: 'warp', name: '⚡ WARP BEAMS & FIRE', desc: 'Instant-fire cyan ion rail beam with trailing flame bursts' },
    ],
  },
  {
    id: 'ransom_dreadnought',
    type: 'ransom_dreadnought',
    name: 'RANSOMWARE DREADNOUGHT',
    shortName: 'RANSOM DREADNOUGHT',
    milestone: '4200 PTS',
    hp: 220,
    color: '#f59e0b',
    bgBadge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    icon: '🏰',
    category: 'Gothic Castle Tank',
    description:
      'Massive black obsidian gothic fortress on tank treads with smoking industrial chimney stacks, armored battlements, and a glowing golden padlock core.',
    attacks: [
      { id: 'firewall', name: '🛡️ FIREWALL THRUST', desc: 'Dual incendiary firewall spikes shot from forward armored cannons' },
      { id: 'skulls', name: '💀 SKULL MINES', desc: 'Triple floating proximity cyber-skull mines drifting across ground' },
      { id: 'grinders', name: '⚙️ 4-WAY GRINDER SPREAD', desc: 'High-speed diamond grinder sawblade projectiles' },
    ],
  },
  {
    id: 'zero_day_overlord',
    type: 'zero_day_overlord',
    name: 'ZERO-DAY OVERLORD',
    shortName: 'ZERO-DAY OVERLORD',
    milestone: '5000 PTS (FINAL)',
    hp: 300,
    color: '#ec4899',
    bgBadge: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    icon: '👁️',
    category: 'Cyber Archangel Deity',
    description:
      'Supreme celestial sovereign entity with 6 transcendent prismatic crystal wings, glowing golden corona halo, and a swirling singularity void core.',
    attacks: [
      { id: 'starburst', name: '🌈 PRISMATIC STARBURST', desc: '5-way rainbow starburst fan with chromatic particle trails' },
      { id: 'void', name: '🌀 VOID SINGULARITY', desc: 'Dual gravitational black hole vortexes that pull and damage' },
      { id: 'smite', name: '⚡ ARCHANGEL SMITE', desc: 'Blinding golden lightning smite pillars from the upper sky' },
    ],
  },
]

// 4 Classic Foundational Common Enemies
const CLASSIC_ENEMY_DATA = [
  {
    id: 'glitch_bug',
    type: 'glitch_bug',
    name: '404 GLITCH BUG',
    shortName: 'GLITCH BUG',
    hp: 1,
    score: '10 PTS',
    color: '#38bdf8',
    bgBadge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    icon: '🐛',
    category: 'Foundational Crawler',
    desc: 'Industrial slate cyber-bug with gold rotor propeller, "404" side stencil, and a glowing cyclops optic core that fires cyan glitch plasma bullets.',
    attacks: [
      { id: 'glitch_pulse', name: '⚡ GLITCH PULSE', desc: 'Fires high-speed cyan glitch pulse projectile with particle trail' },
      { id: 'eye_charge', name: '🔴 EYE CHARGE', desc: 'Cyclops eye blazes red before discharging plasma pulse' },
      { id: 'rotor_spin', name: '🚁 4-FRAME ROTOR HOVER', desc: '4-frame hover locomotion with spinning golden rotor ring' },
    ],
  },
  {
    id: 'squatter_drone',
    type: 'squatter_drone',
    name: 'SQUATTER RECON DRONE',
    shortName: 'SQUATTER DRONE',
    hp: 2,
    score: '20 PTS',
    color: '#eab308',
    bgBadge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    icon: '🛸',
    category: 'Surveillance Aerial Mech',
    desc: 'Spherical gunmetal drone with padlock insignia, cyan equator seam, ventral pulsing searchlight, and rotating radar scanner eye that fires EMP shock rings.',
    attacks: [
      { id: 'emp_spark', name: '⚡ EMP SHOCK RING', desc: 'Discharges crackling yellow EMP spark projectile' },
      { id: 'radar_sweep', name: '📡 RADAR SCAN OVERCHARGE', desc: 'Radar needle spins into intense yellow-amber target lock' },
      { id: 'spotlight_bob', name: '🔦 VENTRAL SPOTLIGHT BOB', desc: '4-frame floating oscillation with pulsing cyan ground spotlight' },
    ],
  },
  {
    id: 'packet_bat',
    type: 'packet_bat',
    name: 'CYBER PACKET BAT',
    shortName: 'PACKET BAT',
    hp: 2,
    score: '25 PTS',
    color: '#a855f7',
    bgBadge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    icon: '🦇',
    category: 'Aerodynamic Stalker',
    desc: 'Indigo/purple aerial drone bat with cyan visor, white vampire fangs, and articulated wings that unleash supersonic sonar screech wave projectiles.',
    attacks: [
      { id: 'sonar_wave', name: '🔊 DUAL SONAR WAVES', desc: 'Emits 2 angled violet acoustic waveform arcs across the screen' },
      { id: 'fang_screech', name: '🦷 FANG SONAR CHARGE', desc: 'Visor pulses as mouth opens to discharge sound rings' },
      { id: 'wing_stroke', name: '🦇 4-FRAME WING STROKE', desc: 'Articulated 4-frame cybernetic flapping wing stroke flight' },
    ],
  },
  {
    id: 'malware_golem',
    type: 'malware_golem',
    name: 'MALWARE TITAN GOLEM',
    shortName: 'MALWARE GOLEM',
    hp: 3,
    score: '35 PTS',
    color: '#ef4444',
    bgBadge: 'bg-red-500/10 text-red-400 border-red-500/30',
    icon: '🗿',
    category: 'Heavy Armored Brute',
    desc: 'Obsidian stone walking golem with steaming smokestacks, spiked pauldrons, glowing molten magma core, and crushing fists that lob burning magma boulders.',
    attacks: [
      { id: 'magma_boulder', name: '🌋 MAGMA BOULDER LOB', desc: 'Lobs heavy molten rock in a high parabolic trajectory with smoke trail' },
      { id: 'spiked_slam', name: '💥 SPIKED HAMMER SMASH', desc: 'Raises dual spiked fists and slams platform with explosive sparks' },
      { id: 'hydraulic_stomp', name: '🦵 4-FRAME PISTON STOMP', desc: 'Heavy 4-frame hydraulic walking stride with foot dust puffs' },
    ],
  },
]

// All 6 Progressive Cybernetic Enemies (Unlocked post-bosses)
const CYBER_ENEMY_DATA = [
  {
    id: 'beetle_infantry',
    type: 'beetle_infantry',
    name: 'CYBERNETIC BEETLE INFANTRY',
    shortName: 'BEETLE INFANTRY',
    hp: 2,
    score: '25 PTS',
    color: '#ea580c',
    bgBadge: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    icon: '🪲',
    category: 'Heavy Armored Crawler',
    desc: 'Terracotta-armored cybernetic beetle infantry with hydraulic piston legs, glowing golden circular eye lens, and a devastating 4-frame plasmic overload laser beam.',
    attacks: [
      { id: 'plasmic_beam', name: '⚡ PLASMIC OVERLOAD BEAM', desc: 'Charges golden eye flare and fires a solid horizontal plasma laser with radial sparks' },
      { id: 'smoke_vent', name: '💨 EXHAUST COOLDOWN', desc: 'Dips head into cooldown stance while venting dual gray smoke clouds upward' },
      { id: 'walk_cycle', name: '🚶 4-FRAME STRIDE', desc: '4-frame mechanical locomotion walk cycle with articulated hydraulic piston legs' },
    ],
  },
  {
    id: 'mantis_sniper',
    type: 'mantis_sniper',
    name: 'CYBER-MANTIS SNIPER',
    shortName: 'MANTIS SNIPER',
    hp: 3,
    score: '40 PTS',
    color: '#10b981',
    bgBadge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    icon: '🦗',
    category: 'Precision Railgun Stalker',
    desc: 'Aerodynamic metallic emerald green mantis with articulated titanium spine, red targeting optic flare, and dual folding scythe blades that fire hyper-velocity cyan railgun beams.',
    attacks: [
      { id: 'optic_lock', name: '🎯 RED OPTIC SNIPER FLARE', desc: 'Folds scythe blades to form rifle barrel while eye ignites in a piercing red lens flare' },
      { id: 'railgun_blast', name: '⚡ HYPER RAILGUN BEAM', desc: 'Discharges a continuous thick cyan laser beam with explosive yellow muzzle flash' },
      { id: 'recoil_slide', name: '💨 HEAVY RECOIL SLIDE', desc: 'Braced recoil posture with billowing white exhaust smoke blasting from rear vents' },
    ],
  },
  {
    id: 'volt_hornet',
    type: 'volt_hornet',
    name: 'VOLT-HORNET DRONE',
    shortName: 'VOLT HORNET',
    hp: 2,
    score: '35 PTS',
    color: '#eab308',
    bgBadge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    icon: '🐝',
    category: 'Aerial EMP Stinger Drone',
    desc: 'Black-and-yellow hazard striped attack drone with glowing cyan ion ports, rapid motion-blurred translucent wings, and a curling electrical stinger barrage.',
    attacks: [
      { id: 'arc_charge', name: '⚡ ARC CHARGE CURL', desc: 'Abdomen curls aggressively forward beneath head crackling with jagged cyan electrical lightning arcs' },
      { id: 'needle_burst', name: '💥 3-NEEDLE VOLT BURST', desc: 'Releases a rapid triple-needle electric projectile barrage with yellow muzzle star' },
      { id: 'hover_flutter', name: '🛸 4-FRAME HOVER FLUTTER', desc: 'High-speed 4-frame hovering cycle with blurred motion-line translucent wings' },
    ],
  },
  {
    id: 'centipede_artillery',
    type: 'centipede_artillery',
    name: 'CENTIPEDE ARTILLERY',
    shortName: 'CENTIPEDE ARTILLERY',
    hp: 4,
    score: '55 PTS',
    color: '#a855f7',
    bgBadge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    icon: '🐛',
    category: 'Platform Bio-Mortar Bombardier',
    desc: 'Segmented royal purple armored centipede with 10 synchronized robotic micro-legs that arches 45° to split its dorsal shell and lob glowing green bio-mortar canisters.',
    attacks: [
      { id: 'petal_split', name: '🧪 DORSAL PETAL SPLIT', desc: 'Body arches 45° upward as purple dorsal plates split open to reveal glowing green chemical mortar' },
      { id: 'mortar_lob', name: '💣 BIO-MORTAR LAUNCH', desc: 'Launches glowing green acid canister in a high parabolic trajectory with green energy arc' },
      { id: 'gas_vent', name: '💨 TOXIC VAPOR VENT', desc: 'Settles back onto platform with toxic green vapor clouds billowing from cooling vents' },
    ],
  },
  {
    id: 'crab_juggernaut',
    type: 'crab_juggernaut',
    name: 'HYDRAULIC CRAB JUGGERNAUT',
    shortName: 'CRAB JUGGERNAUT',
    hp: 5,
    score: '75 PTS',
    color: '#2563eb',
    bgBadge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    icon: '🦀',
    category: 'Heavy Seismic Barrier Mech',
    desc: 'Industrial cobalt blue tank mech with hazard warning stripes, 4 heavy walking piston legs, and dual massive hydraulic crusher claws with glowing orange pistons that execute seismic ground slams.',
    attacks: [
      { id: 'piston_lift', name: '🔥 PISTON OVERCHARGE LIFT', desc: 'Rears high on back legs with dual hydraulic claws raised straight up revealing glowing orange pistons' },
      { id: 'ground_slam', name: '🌋 SEISMIC GROUND SLAM', desc: 'Down-strike impact with explosive orange flash, kinetic yellow sparks, and ground crack shockwave' },
      { id: 'steam_recovery', name: '💨 STEAM VENT RECOVERY', desc: 'Claws rest on ground as white steam plumes puff from top chimney exhaust ports' },
    ],
  },
  {
    id: 'moth_phantom',
    type: 'moth_phantom',
    name: 'QUANTUM MOTH PHANTOM',
    shortName: 'MOTH PHANTOM',
    hp: 4,
    score: '90 PTS',
    color: '#ec4899',
    bgBadge: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    icon: '🦋',
    category: 'Celestial Phase-Shift Spectre',
    desc: 'Ethereal cyber moth with holographic circuit-traced violet wings, hot magenta optics, digital binary matrix glitch states, and expanding concentric diamond energy ring pulses.',
    attacks: [
      { id: 'glitch_matrix', name: '👾 110 MATRIX GLITCH', desc: 'Body glitches with chromatic scanlines and binary code artifacts (110, 010) with radiant eye flare' },
      { id: 'diamond_ring', name: '💠 CONCENTRIC DIAMOND RING', desc: 'Projects an expanding concentric geometric diamond energy ring pulse wave forward' },
      { id: 'phase_fade', name: '👻 4-FRAME SPECTRAL GLIDE', desc: 'Fades to a 35% translucent spectral silhouette while floating in gentle circuit-traced wing glide' },
    ],
  },
]

const ENEMY_DATA = [...CLASSIC_ENEMY_DATA, ...CYBER_ENEMY_DATA]

const WEAPONS = [
  { id: 'plasma', name: 'PLASMA BLASTER', tag: 'DEFAULT', icon: '⚡', color: '#38bdf8' },
  { id: 'spread', name: 'TRIPLE SPREAD', tag: '.IO', icon: '💥', color: '#c084fc' },
  { id: 'railgun', name: 'CYBER RAILGUN', tag: '.AI', icon: '⚡', color: '#06b6d4' },
  { id: 'missile', name: 'MICRO-MISSILE', tag: '.GG', icon: '🚀', color: '#f97316' },
]

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

// ============================================================================
// AUTHENTIC 16-BIT RETRO ARCADE PIXEL ART BOSS RENDERERS
// ============================================================================

// 1. Boss 1: Megabyte Squatter Mecha (Bipedal Crimson/Gunmetal Mech, 404 Blue Visor, Diamond Drill & Thruster Dash)
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

// 2. Boss 2: Toxic Phishing Hydra (Bio-Vat Tank & 3 Undulating Toxic Serpent Heads)
function renderPhishingHydra(ctx, boss, customAction = null, customFrame = null) {
  const frame = customFrame !== null ? customFrame : Date.now() * 0.006
  const isAttack =
    customAction === 'attack' ||
    (customAction && customAction.startsWith('attack')) ||
    boss.actionState === 'attack' ||
    (boss.actionState && boss.actionState.includes('VENOM')) ||
    (boss.actionState && boss.actionState.includes('SLIME')) ||
    (boss.actionState && boss.actionState.includes('ACID'))
  const cycleFrame = Math.floor(frame / 6) % 4
  const attFrame = isAttack ? (customFrame !== null ? cycleFrame : (boss.attackPhase || 0)) : 0

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
    let headYOffset = 0
    let neckSway = 0

    if (!isAttack) {
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
      if (attFrame === 0) {
        headYOffset = -4
      } else if (attFrame === 1 || attFrame === 2) {
        headYOffset = pos === 0 ? -8 : -4
        neckSway = pos * 3
      } else {
        headYOffset = 6
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

    // ATTACK: Venom Lasers & Acid Sprays
    if (isAttack) {
      if (attFrame === 1) {
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
        ctx.save()
        ctx.fillStyle = 'rgba(34, 197, 94, 0.45)'
        ctx.beginPath()
        ctx.arc(hx - 14, hy + 4, 6, 0, Math.PI * 2)
        ctx.arc(hx - 22, hy - 2, 7.5, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#86efac'
        ;[-10, -18, -26].forEach((dx, dIdx) => {
          ctx.fillRect(hx + dx, hy + 4 + (dIdx % 2) * 5, 2.5, 2.5)
        })
        ctx.restore()
      }
    }
  })
}

// 3. Boss 3: DDoS Swarm Titan (Monolithic Obsidian Obelisk, Violet Plasma Core & Sawblade Drones)
function renderDDoSTitan(ctx, boss, customAction = null, customFrame = null) {
  const frame = customFrame !== null ? customFrame : Date.now() * 0.005
  const isAttack =
    customAction === 'attack' ||
    (customAction && customAction.startsWith('attack')) ||
    boss.actionState === 'attack' ||
    (boss.actionState && boss.actionState.includes('SWARM')) ||
    (boss.actionState && boss.actionState.includes('DRONE')) ||
    (boss.actionState && boss.actionState.includes('BEAM'))
  const cycleFrame = Math.floor(frame / 6) % 4
  const attFrame = isAttack ? (customFrame !== null ? cycleFrame : (boss.attackPhase || 0)) : 0

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

    ctx.fillStyle = '#64748b'
    for (let t = 0; t < 6; t++) {
      const a = (t * Math.PI) / 3
      ctx.fillRect(Math.cos(a) * 6 - 1.5, Math.sin(a) * 6 - 1.5, 3.5, 3.5)
    }

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

  // 3. Side Missile Bay Hatches
  const isBayOpen = isAttack && (attFrame === 0 || attFrame === 1 || attFrame === 2)
  if (isBayOpen) {
    ctx.fillStyle = '#020617'
    roundRect(ctx, centerX - 24, 14, 8, 22, 2)
    ctx.fill()
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.fillStyle = '#ef4444'
    ctx.fillRect(centerX - 22, 17, 4, 3)
    ctx.fillRect(centerX - 22, 23, 4, 3)
    ctx.fillRect(centerX - 22, 29, 4, 3)

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

  ctx.fillStyle = '#020617'
  ctx.beginPath()
  ctx.arc(coreX, coreY, coreR + 2, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#a855f7'
  ctx.lineWidth = 1.4
  ctx.stroke()

  ctx.strokeStyle = '#c084fc'
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(coreX, 6)
  ctx.lineTo(coreX + Math.sin(frame * 0.5) * 3, coreY - coreR)
  ctx.moveTo(coreX, h - 8)
  ctx.lineTo(coreX - Math.cos(frame * 0.5) * 3, coreY + coreR)
  ctx.stroke()

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
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(coreX, coreY, 12, 0, Math.PI * 2)
      ctx.fill()
    } else if (attFrame === 1 || attFrame === 2) {
      const angles = [-0.55, -0.28, 0, 0.28, 0.55]
      const dist = attFrame === 1 ? 26 : 48

      angles.forEach((ang) => {
        const rx = coreX - Math.cos(ang) * dist
        const ry = coreY + Math.sin(ang) * dist

        ctx.save()
        ctx.translate(rx, ry)
        ctx.rotate(ang + Math.PI)

        ctx.strokeStyle = 'rgba(168, 85, 247, 0.7)'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(14, 0)
        ctx.lineTo(-4, 0)
        ctx.stroke()

        ctx.fillStyle = '#8b5cf6'
        roundRect(ctx, -5, -2.5, 10, 5, 2)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(-2, -1, 3, 2)

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

// 4. Boss 4: DNS Hijacker Prime (Quantum Saucer, Concentric 3D Gyro Rings & Ion Rail Beam)
function renderDNSSaucer(ctx, boss, customAction = null, customFrame = null) {
  const frame = customFrame !== null ? customFrame : Date.now() * 0.006
  const isAttack =
    customAction === 'attack' ||
    (customAction && customAction.startsWith('attack')) ||
    boss.actionState === 'attack' ||
    (boss.actionState && boss.actionState.includes('RAIL')) ||
    (boss.actionState && boss.actionState.includes('WARP')) ||
    (boss.actionState && boss.actionState.includes('GRAVITY')) ||
    (boss.actionState && boss.actionState.includes('LASER'))
  const cycleFrame = Math.floor(frame / 6) % 4
  const attFrame = isAttack ? (customFrame !== null ? cycleFrame : (boss.attackPhase || 0)) : 0

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
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(centerX - 18, h / 2, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#00f0ff'
      ctx.lineWidth = 2
      ctx.stroke()
    } else if (attFrame === 1 || attFrame === 2) {
      ctx.save()
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)'
      ctx.lineWidth = 1.6
      ;[centerX - 24, centerX - 34].forEach((rx, idx) => {
        ctx.beginPath()
        ctx.ellipse(rx, h / 2, 5 + idx * 3, 11 + idx * 5, 0, 0, Math.PI * 2)
        ctx.stroke()
      })

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
      ctx.fillStyle = 'rgba(165, 243, 252, 0.65)'
      ctx.beginPath()
      ctx.arc(centerX - 20, h / 2 - 8, 4, 0, Math.PI * 2)
      ctx.arc(centerX + 20, h / 2 - 8, 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

// 5. Boss 5: Ransomware Dreadnought (Gothic Castle Fortress Tank, 4 Smokestacks & Padlock Core)
function renderRansomDreadnought(ctx, boss, customAction = null, customFrame = null) {
  const frame = customFrame !== null ? customFrame : Date.now() * 0.007
  const isAttack =
    customAction === 'attack' ||
    (customAction && customAction.startsWith('attack')) ||
    boss.actionState === 'attack' ||
    (boss.actionState && boss.actionState.includes('FIREWALL')) ||
    (boss.actionState && boss.actionState.includes('SKULL')) ||
    (boss.actionState && boss.actionState.includes('GRINDER'))
  const cycleFrame = Math.floor(frame / 6) % 4
  const attFrame = isAttack ? (customFrame !== null ? cycleFrame : (boss.attackPhase || 0)) : 0

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

  // 3. Black Iron Gothic Castle Fortress
  ctx.fillStyle = '#1e293b'
  roundRect(ctx, 4, 8, w - 8, h - 22, 4)
  ctx.fill()
  ctx.strokeStyle = '#020617'
  ctx.lineWidth = 1.6
  ctx.stroke()

  ctx.fillStyle = '#0f172a'
  for (let bx = 6; bx < w - 8; bx += 8) {
    ctx.fillRect(bx, 5, 5, 4)
  }

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
      ;[14, w - 14].forEach((cx, idx) => {
        ctx.save()
        ctx.translate(cx, 26)
        ctx.rotate(idx === 0 ? -Math.PI * 0.25 : -Math.PI * 0.75)

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
      ctx.fillStyle = 'rgba(239, 68, 68, 0.75)'
      ctx.fillRect(4, 20, 4, 4)
      ctx.fillRect(w - 8, 20, 4, 4)
    }
  }
}

// 6. Boss 6: Zero-Day Overlord (6-Winged Celestial Prismatic Seraph & Singularity Core)
function renderZeroDayOverlord(ctx, boss, customAction = null, customFrame = null) {
  const frame = customFrame !== null ? customFrame : Date.now() * 0.006
  const isAttack =
    customAction === 'attack' ||
    (customAction && customAction.startsWith('attack')) ||
    boss.actionState === 'attack' ||
    (boss.actionState && boss.actionState.includes('STARBURST')) ||
    (boss.actionState && boss.actionState.includes('SMITE')) ||
    (boss.actionState && boss.actionState.includes('VOID'))
  const cycleFrame = Math.floor(frame / 6) % 4
  const attFrame = isAttack ? (customFrame !== null ? cycleFrame : (boss.attackPhase || 0)) : 0

  const w = boss.w || 74
  const h = boss.h || 64
  const centerX = w / 2

  let wingSpan = 0
  if (!isAttack) {
    wingSpan = cycleFrame === 0 ? 0 : cycleFrame === 1 ? 8 : cycleFrame === 2 ? 14 : -12
  } else {
    wingSpan = attFrame === 0 ? 6 : attFrame === 1 ? 16 : attFrame === 2 ? 20 : -14
  }

  // 1. Six Prismatic Crystal Wings with Chromatic Rainbow Gradients
  ;[-1, 1].forEach((dir) => {
    // Upper Pair
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

    // Middle Pair
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

    // Lower Pair
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
      ctx.save()
      const starColors = ['#fde047', '#00f0ff', '#ec4899', '#ffffff', '#a855f7', '#22c55e']

      for (let r = 0; r < 6; r++) {
        const sAng = (r * Math.PI) / 3
        ctx.strokeStyle = starColors[r % starColors.length]
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(centerX, h / 2)
        ctx.lineTo(centerX + Math.cos(sAng) * 65, h / 2 + Math.sin(sAng) * 65)
        ctx.stroke()
      }

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
      const sparkColors = ['#fde047', '#00f0ff', '#ec4899', '#ffffff']
      ;[-18, -8, 0, 8, 18].forEach((sx, idx) => {
        ctx.fillStyle = sparkColors[idx % sparkColors.length]
        ctx.fillRect(centerX + sx, h / 2 + 22 + (idx % 3) * 6, 2, 3)
      })
    }
  }
}

// ============================================================================
// AUTHENTIC 16-BIT RETRO PIXEL ART CLASSIC COMMON MOBS
// ============================================================================

// 1. 404 Glitch Bug Sprite
function renderGlitchBug(ctx, drone, customAction = null, customFrame = null) {
  ctx.save()
  const frame = customFrame !== null ? customFrame : (drone.frame || 0)
  const isAttack =
    customAction === 'attack' ||
    (customAction && customAction.startsWith('attack')) ||
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

  // 1. Top Propeller Halo
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

  // 3. Landing Skids
  ctx.fillStyle = '#334155'
  ctx.fillRect(4, h - 3, 4, 3)
  ctx.fillRect(w - 7, h - 3, 4, 3)

  // 4. Chassis
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

  // 5. Side "404"
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 6.5px "JetBrains Mono", monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('404', 11.5, 11.5)

  // 6. Eye
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
    ctx.fillStyle = '#00f0ff'
    ctx.beginPath()
    ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(eyeX - 1.5, eyeY - 1.5, 3, 3)
  } else {
    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(eyeX - 1.5, eyeY - 1.5, 2, 2)
  }

  ctx.restore()
}

// 2. Squatter Recon Drone Sprite
function renderSquatterDrone(ctx, drone, customAction = null, customFrame = null) {
  ctx.save()
  const frame = customFrame !== null ? customFrame : (drone.frame || 0)
  const isAttack =
    customAction === 'attack' ||
    (customAction && customAction.startsWith('attack')) ||
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

  // Propeller Halo
  ctx.strokeStyle = '#38bdf8'
  ctx.lineWidth = 1.8
  ctx.beginPath()
  ctx.ellipse(centerX, -4.5, 14, 3, 0, 0, Math.PI * 2)
  ctx.stroke()

  // Spotlight
  if (!isAttack) {
    const spotGrad = ctx.createLinearGradient(centerX, h - 2, centerX, h + 18)
    spotGrad.addColorStop(0, 'rgba(6, 182, 212, 0.55)')
    spotGrad.addColorStop(1, 'rgba(6, 182, 212, 0.0)')
    ctx.fillStyle = spotGrad
    ctx.beginPath()
    ctx.moveTo(centerX - 2, h - 2)
    ctx.lineTo(centerX - 10, h + 18)
    ctx.lineTo(centerX + 10, h + 18)
    ctx.lineTo(centerX + 2, h - 2)
    ctx.closePath()
    ctx.fill()
  }

  // Chassis
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

  // Padlock Emblem
  ctx.fillStyle = '#f59e0b'
  roundRect(ctx, 3, h / 2 - 2, 5.5, 5.5, 1.5)
  ctx.fill()

  // Scanner Eye
  const eyeX = centerX + 3.5
  const eyeY = h / 2
  ctx.fillStyle = isAttack ? '#00f0ff' : '#0f172a'
  ctx.beginPath()
  ctx.arc(eyeX, eyeY, 5.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#38bdf8'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.restore()
}

// 3. Cyber Packet Bat Sprite
function renderPacketBat(ctx, bat, customAction = null, customFrame = null) {
  ctx.save()
  const frame = customFrame !== null ? customFrame : (bat.frame || 0)
  const isAttack =
    customAction === 'attack' ||
    (customAction && customAction.startsWith('attack')) ||
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

  // Wings
  const wingStrokeY = cycleFrame === 0 ? -4 : cycleFrame === 1 ? 0 : cycleFrame === 2 ? 4 : 1
  ctx.fillStyle = '#581c87'
  ctx.beginPath()
  ctx.moveTo(centerX - 4, 8)
  ctx.lineTo(0, 3 + wingStrokeY)
  ctx.lineTo(2, 16 + wingStrokeY * 0.5)
  ctx.lineTo(centerX - 3, 13)
  ctx.closePath()
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(centerX + 4, 8)
  ctx.lineTo(w, 3 + wingStrokeY)
  ctx.lineTo(w - 2, 16 + wingStrokeY * 0.5)
  ctx.lineTo(centerX + 3, 13)
  ctx.closePath()
  ctx.fill()

  // Torso
  ctx.fillStyle = '#1e1b4b'
  roundRect(ctx, centerX - 6, 5, 12, 13, 4)
  ctx.fill()

  // Visor
  ctx.fillStyle = '#06b6d4'
  roundRect(ctx, centerX - 4.5, 7, 9, 4, 1.5)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(centerX - 3, 13, 1.5, 2.5)
  ctx.fillRect(centerX + 1.5, 13, 1.5, 2.5)

  ctx.restore()
}

// 4. Malware Titan Golem Sprite
function renderMalwareGolem(ctx, golem, customAction = null, customFrame = null) {
  ctx.save()
  const frame = customFrame !== null ? customFrame : (golem.frame || 0)
  const isAttack =
    customAction === 'attack' ||
    (customAction && customAction.startsWith('attack')) ||
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

  // Torso
  ctx.fillStyle = '#1e293b'
  roundRect(ctx, centerX - 10, 3, 20, 18, 5)
  ctx.fill()

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

  // Head
  ctx.fillStyle = '#0f172a'
  roundRect(ctx, centerX - 6, -1, 12, 7, 3)
  ctx.fill()
  ctx.fillStyle = '#ea580c'
  ctx.fillRect(centerX - 4, 1, 2.5, 2)
  ctx.fillRect(centerX + 1.5, 1, 2.5, 2)

  ctx.restore()
}

// ============================================================================
// AUTHENTIC 16-BIT RETRO PIXEL ART CYBERNETIC ENEMIES (FROM SPRITE SHEETS)
// ============================================================================

// 1. Cybernetic Beetle Infantry
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

  // Hydraulic Piston Legs
  const legStride = !isAttack
    ? cycleFrame === 0 ? -2 : cycleFrame === 1 ? 0 : cycleFrame === 2 ? 2 : 0
    : attFrame === 3 ? 1 : 0

  ctx.fillStyle = '#1e293b'
  ctx.fillRect(4 + legStride, h - 8, 3, 8)
  ctx.fillRect(w - 7 - legStride, h - 8, 3, 8)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(3 + legStride, h - 2, 5, 2)
  ctx.fillRect(w - 8 - legStride, h - 2, 5, 2)

  ctx.fillStyle = '#94a3b8'
  ctx.fillRect(8 - legStride, h - 7, 2.5, 7)
  ctx.fillRect(w - 11 + legStride, h - 7, 2.5, 7)
  ctx.fillStyle = '#ea580c'
  roundRect(ctx, 6 - legStride, h - 3, 5, 3, 1)
  ctx.fill()
  roundRect(ctx, w - 13 + legStride, h - 3, 5, 3, 1)
  ctx.fill()

  // Terracotta Armored Shell Body
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

  ctx.fillStyle = '#fdba74'
  ctx.fillRect(8, 4.5, w - 16, 1.5)

  // Dark Slate Head Segment with Antenna Sensors
  ctx.fillStyle = '#1e293b'
  roundRect(ctx, 0, 7, 7, 10, 2)
  ctx.fill()
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 0.9
  ctx.stroke()

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

  // Golden Optical Eye Lens
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

  // ATTACK Dynamics
  if (isAttack) {
    if (attFrame === 0) {
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(eyeX, eyeY, eyeR + 3, 0, Math.PI * 2)
      ctx.stroke()
    } else if (attFrame === 1) {
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
      const bLen = 140
      ctx.save()
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)'
      ctx.lineWidth = 8
      ctx.beginPath()
      ctx.moveTo(eyeX, eyeY)
      ctx.lineTo(eyeX - bLen, eyeY)
      ctx.stroke()

      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 4.5
      ctx.beginPath()
      ctx.moveTo(eyeX, eyeY)
      ctx.lineTo(eyeX - bLen, eyeY)
      ctx.stroke()

      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(eyeX, eyeY)
      ctx.lineTo(eyeX - bLen, eyeY)
      ctx.stroke()

      ;[0, 45, 90, 135, 180, 225, 270, 315].forEach((deg) => {
        const rad = (deg * Math.PI) / 180
        ctx.fillStyle = '#fde047'
        ctx.fillRect(eyeX + Math.cos(rad) * 6 - 1, eyeY + Math.sin(rad) * 6 - 1, 2, 2)
      })
      ctx.restore()
    } else if (attFrame === 3) {
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

// 2. Cyber-Mantis Sniper
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

  const legOffset = !isAttack
    ? cycleFrame === 0 ? -2 : cycleFrame === 1 ? 2 : cycleFrame === 2 ? 0 : -1
    : attFrame === 3 ? 3 : 0

  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 1.6
  ctx.beginPath()
  ctx.moveTo(w - 12 + legOffset, h - 14)
  ctx.lineTo(w - 6 + legOffset, h - 6)
  ctx.lineTo(w - 8 + legOffset, h)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(w - 20 - legOffset, h - 14)
  ctx.lineTo(w - 26 - legOffset, h - 6)
  ctx.lineTo(w - 24 - legOffset, h)
  ctx.stroke()

  ctx.fillStyle = '#059669'
  ctx.fillRect(w - 10 + legOffset, h - 2, 4, 2)
  ctx.fillRect(w - 26 - legOffset, h - 2, 4, 2)

  const spineGrad = ctx.createLinearGradient(0, 0, 0, h)
  spineGrad.addColorStop(0, '#34d399')
  spineGrad.addColorStop(0.3, '#10b981')
  spineGrad.addColorStop(0.8, '#059669')
  spineGrad.addColorStop(1, '#064e3b')
  ctx.fillStyle = spineGrad

  roundRect(ctx, w - 24, 10, 16, 12, 4)
  ctx.fill()
  ctx.strokeStyle = '#022c22'
  ctx.lineWidth = 1
  ctx.stroke()

  roundRect(ctx, w - 16, 16, 12, 12, 5)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = '#0f172a'
  ctx.fillRect(w - 14, 12, 6, 1.5)
  ctx.fillRect(w - 14, 15, 6, 1.5)

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

  ctx.fillStyle = '#ef4444'
  ctx.beginPath()
  ctx.arc(headX + 2, headY + 6, 2.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(headX + 1.5, headY + 5, 1, 1)

  let scythePitch = 0
  if (!isAttack) {
    scythePitch = cycleFrame === 0 ? 0.1 : cycleFrame === 1 ? -0.15 : cycleFrame === 2 ? 0.2 : 0
  } else {
    scythePitch = attFrame === 0 ? -0.1 : attFrame === 1 ? 0 : attFrame === 2 ? 0 : 0.25
  }

  ctx.save()
  ctx.translate(headX + 4, headY + 8)
  ctx.rotate(scythePitch)

  if (!isAttack || attFrame === 0) {
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
    ctx.fillStyle = '#1e293b'
    roundRect(ctx, -20, -3, 20, 5, 1.5)
    ctx.fill()
    ctx.fillStyle = '#10b981'
    ctx.fillRect(-18, -2, 16, 1.5)
    ctx.fillStyle = '#00f0ff'
    ctx.fillRect(-22, -1.5, 3, 2)
  }
  ctx.restore()

  if (isAttack) {
    if (attFrame === 0) {
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
      ctx.fillStyle = '#00f0ff'
      ctx.beginPath()
      ctx.arc(headX - 16, headY + 8, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1
      ctx.stroke()
    } else if (attFrame === 2) {
      const bLen = 160
      ctx.save()
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)'
      ctx.lineWidth = 7
      ctx.beginPath()
      ctx.moveTo(headX - 16, headY + 8)
      ctx.lineTo(headX - 16 - bLen, headY + 8)
      ctx.stroke()

      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 3.5
      ctx.beginPath()
      ctx.moveTo(headX - 16, headY + 8)
      ctx.lineTo(headX - 16 - bLen, headY + 8)
      ctx.stroke()

      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1.6
      ctx.beginPath()
      ctx.moveTo(headX - 16, headY + 8)
      ctx.lineTo(headX - 16 - bLen, headY + 8)
      ctx.stroke()

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

// 3. Volt-Hornet Drone
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

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
  ctx.lineWidth = 0.8
  ctx.beginPath()
  ctx.moveTo(-10, -10)
  ctx.lineTo(10, -10)
  ctx.stroke()
  ctx.restore()

  ctx.fillStyle = '#0f172a'
  roundRect(ctx, 4, 10, 8, 9, 3)
  ctx.fill()
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 0.9
  ctx.stroke()

  ctx.fillStyle = '#06b6d4'
  ctx.fillRect(4, 12, 3, 4.5)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(4.5, 12.5, 1.2, 1.2)

  let abdCurl = 0
  if (isAttack && (attFrame === 0 || attFrame === 1)) {
    abdCurl = -0.5
  }

  ctx.save()
  ctx.translate(12, 14)
  ctx.rotate(abdCurl)

  ctx.fillStyle = '#eab308'
  roundRect(ctx, 0, -4, 16, 12, 4)
  ctx.fill()
  ctx.strokeStyle = '#020617'
  ctx.lineWidth = 1.1
  ctx.stroke()

  ctx.fillStyle = '#0f172a'
  ctx.fillRect(4, -4, 3.5, 12)
  ctx.fillRect(10, -4, 3.5, 12)

  ctx.fillStyle = '#06b6d4'
  ctx.fillRect(15, 0, 2, 4)
  ctx.fillStyle = 'rgba(6, 182, 212, 0.6)'
  ctx.fillRect(17, 0.5, 3, 3)

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

  if (isAttack) {
    if (attFrame === 1) {
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

      ctx.fillStyle = '#facc15'
      ctx.fillRect(0, 12, 4, 4)
      ctx.restore()
    } else if (attFrame === 3) {
      ctx.fillStyle = '#67e8f9'
      ctx.fillRect(-4, 12, 2, 2)
      ctx.fillRect(-8, 16, 1.5, 1.5)
      ctx.fillRect(0, 8, 1.5, 1.5)
    }
  }

  ctx.restore()
}

// 4. Centipede Artillery
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

  ctx.fillStyle = '#334155'
  for (let l = 0; l < 5; l++) {
    const lx = 6 + l * 8
    const legBob = !isAttack
      ? ((cycleFrame + l) % 2 === 0 ? 0 : -2)
      : (attFrame > 0 && l < 2 ? -5 : 0)

    ctx.fillRect(lx, h - 6 + legBob, 2.5, 6 - legBob)
    ctx.fillStyle = '#1e1b4b'
    ctx.fillRect(lx - 1, h - 2, 4, 2)
    ctx.fillStyle = '#334155'
  }

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

    ctx.fillStyle = '#d8b4fe'
    ctx.fillRect(sx + 1.5, 5, 7, 1.5)
  }

  ctx.fillStyle = '#581c87'
  roundRect(ctx, 0, 6, 8, 9, 2)
  ctx.fill()
  ctx.strokeStyle = '#1e1b4b'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.fillStyle = '#22c55e'
  ctx.fillRect(0, 8.5, 3.5, 3.5)
  ctx.fillStyle = '#86efac'
  ctx.fillRect(0.5, 9, 1.5, 1.5)

  if (isAttack) {
    if (attFrame === 1 || attFrame === 2) {
      ctx.fillStyle = '#14532d'
      roundRect(ctx, 16, 0, 12, 8, 2)
      ctx.fill()
      ctx.fillStyle = '#22c55e'
      ctx.fillRect(18, 1, 8, 4)
      ctx.fillStyle = '#86efac'
      ctx.fillRect(20, 2, 4, 2)

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
      const mortX = -10
      const mortY = -18
      ctx.fillStyle = '#15803d'
      roundRect(ctx, mortX, mortY, 8, 8, 2)
      ctx.fill()
      ctx.fillStyle = '#4ade80'
      ctx.fillRect(mortX + 1.5, mortY + 1.5, 5, 5)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(mortX + 2.5, mortY + 2.5, 2, 2)

      ctx.strokeStyle = 'rgba(34, 197, 94, 0.7)'
      ctx.lineWidth = 1.5
      ctx.setLineDash([3, 2])
      ctx.beginPath()
      ctx.moveTo(20, -2)
      ctx.quadraticCurveTo(5, -22, mortX, mortY)
      ctx.stroke()
      ctx.setLineDash([])
    } else if (attFrame === 3) {
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

// 5. Hydraulic Crab Juggernaut
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

  const lStep = !isAttack
    ? cycleFrame === 0 ? -2 : cycleFrame === 1 ? 0 : cycleFrame === 2 ? 2 : 0
    : 0

  ctx.fillStyle = '#1e293b'
  ctx.fillRect(4 + lStep, h - 8, 6, 8)
  ctx.fillRect(w - 10 - lStep, h - 8, 6, 8)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(2 + lStep, h - 2, 8, 3)
  ctx.fillRect(w - 12 - lStep, h - 2, 8, 3)

  ctx.fillStyle = '#1e293b'
  ctx.fillRect(centerX - 8, 0, 4, 8)
  ctx.fillRect(centerX + 4, 0, 4, 8)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(centerX - 9, 0, 6, 2)
  ctx.fillRect(centerX + 3, 0, 6, 2)

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

  ctx.fillStyle = '#eab308'
  roundRect(ctx, 10, 8, w - 20, 4, 1)
  ctx.fill()
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(14, 8, 3, 4)
  ctx.fillRect(21, 8, 3, 4)
  ctx.fillRect(28, 8, 3, 4)

  ctx.fillStyle = '#ea580c'
  ctx.fillRect(centerX - 6, 14, 12, 3.5)
  ctx.fillStyle = '#fde047'
  ctx.fillRect(centerX - 4, 14.5, 8, 1.5)

  let clawRaise = 0
  if (!isAttack) {
    clawRaise = cycleFrame === 1 ? -2 : cycleFrame === 3 ? 2 : 0
  } else {
    clawRaise = attFrame === 0 ? -12 : attFrame === 1 ? 4 : attFrame === 2 ? 6 : 0
  }

  ctx.fillStyle = '#2563eb'
  roundRect(ctx, 0, 10 + clawRaise, 8, 12, 3)
  ctx.fill()
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.fillStyle = isAttack && attFrame === 0 ? '#fb923c' : '#ea580c'
  ctx.fillRect(2, 12 + clawRaise, 4, 4)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(3, 13 + clawRaise, 1.5, 1.5)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(-2, 16 + clawRaise, 4, 3)
  ctx.fillRect(1, 19 + clawRaise, 3, 3)

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

  if (isAttack) {
    if (attFrame === 2) {
      ctx.save()
      ctx.fillStyle = 'rgba(251, 146, 60, 0.45)'
      ctx.beginPath()
      ctx.ellipse(centerX, h, 28, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = '#fde047'
      ctx.lineWidth = 1.8
      ;[-24, -14, -4, 6, 16, 26].forEach((cx) => {
        ctx.beginPath()
        ctx.moveTo(centerX + cx, h)
        ctx.lineTo(centerX + cx - 4, h + 3)
        ctx.lineTo(centerX + cx + 2, h + 6)
        ctx.stroke()
      })

      ctx.fillStyle = '#ffffff'
      ;[-18, -8, 8, 18].forEach((sx) => {
        ctx.fillRect(centerX + sx, h - 4 - Math.random() * 6, 2.5, 2.5)
      })
      ctx.restore()
    } else if (attFrame === 3) {
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

// 6. Quantum Moth Phantom
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

  // Obsidian Body & Hot Magenta Optics
  ctx.fillStyle = '#0f172a'
  roundRect(ctx, centerX - 4, 6, 8, 16, 4)
  ctx.fill()
  ctx.strokeStyle = '#38bdf8'
  ctx.lineWidth = 0.8
  ctx.stroke()

  ctx.strokeStyle = '#a855f7'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(centerX - 2, 6)
  ctx.lineTo(centerX - 6, -2)
  ctx.moveTo(centerX + 2, 6)
  ctx.lineTo(centerX + 6, -2)
  ctx.stroke()

  ctx.fillStyle = '#f43f5e'
  ctx.fillRect(centerX - 3, 9, 2, 2.5)
  ctx.fillRect(centerX + 1, 9, 2, 2.5)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(centerX - 2.5, 9.5, 1, 1)
  ctx.fillRect(centerX + 1.5, 9.5, 1, 1)

  if (isAttack) {
    if (attFrame === 0) {
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

export default function TestingLab({ onNavigate, savedCount = 0, compareCount = 0 }) {
  // Main View Switch: 'arena' (Live Console Combat Duel) vs 'sprites' (Sprite Frame Inspector)
  const [viewMode, setViewMode] = useState('arena')

  // Combat Arena State
  const [activeTarget, setActiveTarget] = useState(BOSS_DATA[0])
  const [targetCategory, setTargetCategory] = useState('bosses') // 'bosses' | 'enemies'
  const [activeWeapon, setActiveWeapon] = useState('plasma')
  const [godMode, setGodMode] = useState(false)
  const [isAutoMode, setIsAutoMode] = useState(false) // Default manual in test lab so player controls directly
  const [gameMode, setGameMode] = useState('campaign')
  const [soundEnabled, setSoundEnabled] = useState(() => !isSoundMuted())
  const [musicActive, setMusicActive] = useState(false)
  const [volume, setVolume] = useState(() => getMasterVolume() || 0.75)
  const [duelCount, setDuelCount] = useState(1)
  const [pressedKeys, setPressedKeys] = useState({
    left: false,
    right: false,
    jump: false,
    fire: false,
  })

  // Sprite Inspector State
  const [animState, setAnimState] = useState('idle')
  const [zoomScale, setZoomScale] = useState(2.5)
  const [animSpeed, setAnimSpeed] = useState(1.0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [projectiles, setProjectiles] = useState([])

  const engineRef = useRef(null)
  const previewCanvasRef = useRef(null)
  const frameRef = useRef(0)

  useEffect(() => {
    setSoundMuted(!soundEnabled)
  }, [soundEnabled])

  useEffect(() => {
    setMusicEnabled(musicActive)
  }, [musicActive])

  const handleVolumeChange = (newVol) => {
    setVolume(newVol)
    setMasterVolume(newVol)
  }

  // Engage 1-on-1 Fight with Selected Boss or Enemy
  const handleFightTarget = (target, category = 'bosses') => {
    if (soundEnabled) playMechanicalClick('heavy')
    setActiveTarget(target)
    setTargetCategory(category)
    setDuelCount((c) => c + 1)

    if (engineRef.current) {
      if (engineRef.current.clearArena) {
        engineRef.current.clearArena()
      }
      if (engineRef.current.setWeapon) {
        engineRef.current.setWeapon(activeWeapon)
      }
      if (godMode && engineRef.current.setGodMode) {
        engineRef.current.setGodMode(true)
      }
      if (category === 'bosses' && engineRef.current.spawnBoss) {
        engineRef.current.spawnBoss(target.id)
      } else if (engineRef.current.spawnEnemy) {
        engineRef.current.spawnEnemy(target.id)
      }
    }
  }

  // Weapon Switcher
  const handleSelectWeapon = (weaponId) => {
    if (soundEnabled) playMechanicalClick('switch')
    setActiveWeapon(weaponId)
    if (engineRef.current?.setWeapon) {
      engineRef.current.setWeapon(weaponId)
    }
  }

  // Toggle God Mode / Extra HP
  const handleToggleGodMode = () => {
    if (soundEnabled) playMechanicalClick('switch')
    setGodMode((prev) => {
      const next = !prev
      if (engineRef.current?.setGodMode) {
        engineRef.current.setGodMode(next)
      }
      return next
    })
  }

  const handleAddLives = (amt = 5) => {
    if (soundEnabled) playMechanicalClick('click')
    if (engineRef.current?.addLives) {
      engineRef.current.addLives(amt)
    }
  }

  const handleRestartDuel = () => {
    if (soundEnabled) playMechanicalClick('heavy')
    if (engineRef.current?.restart) {
      engineRef.current.restart()
      setTimeout(() => {
        if (targetCategory === 'bosses') {
          engineRef.current?.spawnBoss(activeTarget.id)
        } else {
          engineRef.current?.spawnEnemy(activeTarget.id)
        }
      }, 100)
    }
  }

  const handleClearArena = () => {
    if (soundEnabled) playMechanicalClick('switch')
    if (engineRef.current?.clearArena) {
      engineRef.current.clearArena()
    }
  }

  // Physical Controls Handlers
  const handleMoveLeft = (active) => {
    if (active && soundEnabled) playMechanicalClick('click')
    setPressedKeys((p) => ({ ...p, left: active }))
    if (engineRef.current?.moveLeft) {
      engineRef.current.moveLeft(active)
    }
  }

  const handleMoveRight = (active) => {
    if (active && soundEnabled) playMechanicalClick('click')
    setPressedKeys((p) => ({ ...p, right: active }))
    if (engineRef.current?.moveRight) {
      engineRef.current.moveRight(active)
    }
  }

  const handleJumpClick = () => {
    if (soundEnabled) playMechanicalClick('click')
    if (engineRef.current?.jump) {
      engineRef.current.jump()
    }
  }

  const handleShootClick = () => {
    if (soundEnabled) playMechanicalClick('click')
    if (engineRef.current?.shoot) {
      engineRef.current.shoot()
    }
  }

  // Keyboard controls listener for visual UI feedback only (DomainGameEngine handles game actions)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return

      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        setPressedKeys((p) => ({ ...p, left: true }))
      } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        setPressedKeys((p) => ({ ...p, right: true }))
      } else if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') {
        setPressedKeys((p) => ({ ...p, jump: true }))
      } else if (e.code === 'KeyJ' || e.code === 'KeyF' || e.code === 'KeyX' || e.code === 'Enter') {
        setPressedKeys((p) => ({ ...p, fire: true }))
      }
    }

    const handleKeyUp = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return

      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        setPressedKeys((p) => ({ ...p, left: false }))
      } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        setPressedKeys((p) => ({ ...p, right: false }))
      } else if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') {
        setPressedKeys((p) => ({ ...p, jump: false }))
      } else if (e.code === 'KeyJ' || e.code === 'KeyF' || e.code === 'KeyX' || e.code === 'Enter') {
        setPressedKeys((p) => ({ ...p, fire: false }))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [soundEnabled])

  // Sprite Inspector Render Loop
  useEffect(() => {
    if (viewMode !== 'sprites') return
    const canvas = previewCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId = null

    const render = () => {
      if (isPlaying) {
        frameRef.current += animSpeed
      }
      const f = frameRef.current
      const w = canvas.width
      const h = canvas.height

      ctx.fillStyle = '#060a12'
      ctx.fillRect(0, 0, w, h)

      // Matrix Grid
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)'
      ctx.lineWidth = 1
      const gridSize = 20
      for (let gx = 0; gx < w; gx += gridSize) {
        ctx.beginPath()
        ctx.moveTo(gx, 0)
        ctx.lineTo(gx, h)
        ctx.stroke()
      }
      for (let gy = 0; gy < h; gy += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, gy)
        ctx.lineTo(w, gy)
        ctx.stroke()
      }

      const groundY = 220
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(0, groundY, w, h - groundY)
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(0, groundY)
      ctx.lineTo(w, groundY)
      ctx.stroke()

      ctx.save()
      const centerX = w / 2 - 20
      const centerY = groundY - 70

      ctx.translate(centerX, centerY)
      ctx.scale(zoomScale * 0.85, zoomScale * 0.85)

      const entityId = activeTarget.id
      const isBoss = targetCategory === 'bosses'

      if (isBoss) {
        const dummyBoss = {
          w: 56,
          h: 50,
          hp: activeTarget.hp,
          maxHp: activeTarget.hp,
          actionState: animState.toUpperCase(),
          isDashing: animState === 'attack_a',
          hitFlash: animState === 'hit' ? 10 : 0,
          color: activeTarget.color,
          attackPhase: Math.floor(f / 6) % 4,
        }

        const isAtt = animState.startsWith('attack')
        const actionType = isAtt ? 'attack' : 'idle'

        if (entityId === 'squatter_mech') {
          renderBossMech(ctx, dummyBoss, actionType, f)
        } else if (entityId === 'phishing_hydra') {
          renderPhishingHydra(ctx, dummyBoss, actionType, f)
        } else if (entityId === 'ddos_titan') {
          renderDDoSTitan(ctx, dummyBoss, actionType, f)
        } else if (entityId === 'dns_saucer') {
          renderDNSSaucer(ctx, dummyBoss, actionType, f)
        } else if (entityId === 'ransom_dreadnought') {
          renderRansomDreadnought(ctx, dummyBoss, actionType, f)
        } else if (entityId === 'zero_day_overlord') {
          renderZeroDayOverlord(ctx, dummyBoss, actionType, f)
        } else {
          renderBossMech(ctx, dummyBoss, actionType, f)
        }
      } else {
        const dummyMob = {
          w: activeTarget.w || (entityId === 'centipede_artillery' ? 44 : entityId === 'crab_juggernaut' ? 42 : entityId === 'moth_phantom' ? 38 : entityId === 'mantis_sniper' ? 36 : 34),
          h: activeTarget.h || (entityId === 'mantis_sniper' || entityId === 'crab_juggernaut' || entityId === 'moth_phantom' ? 32 : entityId === 'centipede_artillery' ? 22 : 24),
          hp: activeTarget.hp,
          maxHp: activeTarget.hp,
          actionState: animState.toUpperCase(),
          hitFlash: animState === 'hit' || animState === 'hurt' ? 10 : 0,
          color: activeTarget.color,
          attackPhase: Math.floor(f / 6) % 4,
          laserPhase: Math.floor(f / 6) % 4,
          laserTimer: animState.startsWith('attack') ? 12 : 0,
        }

        const isAtt = animState.startsWith('attack')
        const actionType = isAtt ? 'attack' : 'idle'

        if (entityId === 'glitch_bug') {
          renderGlitchBug(ctx, dummyMob, actionType, f)
        } else if (entityId === 'squatter_drone') {
          renderSquatterDrone(ctx, dummyMob, actionType, f)
        } else if (entityId === 'packet_bat') {
          renderPacketBat(ctx, dummyMob, actionType, f)
        } else if (entityId === 'malware_golem') {
          renderMalwareGolem(ctx, dummyMob, actionType, f)
        } else if (entityId === 'beetle_infantry') {
          renderBeetleInfantry(ctx, dummyMob, actionType, f)
        } else if (entityId === 'mantis_sniper') {
          renderMantisSniper(ctx, dummyMob, actionType, f)
        } else if (entityId === 'volt_hornet') {
          renderVoltHornet(ctx, dummyMob, actionType, f)
        } else if (entityId === 'centipede_artillery') {
          renderCentipedeArtillery(ctx, dummyMob, actionType, f)
        } else if (entityId === 'crab_juggernaut') {
          renderCrabJuggernaut(ctx, dummyMob, actionType, f)
        } else if (entityId === 'moth_phantom') {
          renderMothPhantom(ctx, dummyMob, actionType, f)
        } else {
          renderGlitchBug(ctx, dummyMob, actionType, f)
        }
      }

      ctx.restore()


      projectiles.forEach((p) => {
        ctx.save()
        ctx.translate(p.x, p.y)
        if (p.type === 'sawblade') {
          ctx.fillStyle = '#94a3b8'
          ctx.beginPath()
          ctx.arc(0, 0, p.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.type === 'rocket') {
          ctx.fillStyle = '#8b5cf6'
          roundRect(ctx, -p.size, -2.5, p.size * 2, 5, 2)
          ctx.fill()
        } else if (p.type === 'warp_beam') {
          ctx.fillStyle = '#06b6d4'
          roundRect(ctx, -14, -3, 28, 6, 2)
          ctx.fill()
        } else if (p.type === 'venom_cross' || p.type === 'slime_wave') {
          ctx.fillStyle = '#10b981'
          ctx.beginPath()
          ctx.arc(0, 0, p.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.type === 'prismatic_star') {
          ctx.fillStyle = p.starColor || '#ec4899'
          ctx.beginPath()
          ctx.arc(0, 0, p.size, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      })

      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [viewMode, activeTarget, targetCategory, animState, zoomScale, animSpeed, isPlaying, projectiles])

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans relative overflow-x-hidden pb-16">
      {/* Background Matrix / Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      {/* Top Sticky Navigation Bar with Unified AppNavbar */}
      <div className="sticky top-0 z-30 pt-2 px-4 sm:px-8 lg:px-12 bg-slate-950/80 backdrop-blur-md pb-2 border-b border-slate-800">
        <AppNavbar
          activeView="lab"
          onNavigate={onNavigate}
          savedCount={savedCount}
          compareCount={compareCount}
        />

        {/* Lab Sub-Bar: Simulator Status & View Mode Switcher */}
        <div className="max-w-7xl mx-auto mt-2 flex items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 led-glow-emerald shrink-0" />
            <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
              TESTING LAB // DUEL SIMULATOR v2.4
            </span>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              type="button"
              onClick={() => {
                playMechanicalClick('switch')
                setViewMode('arena')
              }}
              className={`px-3 py-1 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'arena'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sword weight="bold" />
              <span>CONSOLE DUEL</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playMechanicalClick('switch')
                setViewMode('sprites')
              }}
              className={`px-3 py-1 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'sprites'
                  ? 'bg-cyan-400 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MagnifyingGlassPlus weight="bold" />
              <span>SPRITE INSPECTOR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Viewport */}
      <main className="max-w-7xl mx-auto px-4 pt-6 relative z-10">
        {viewMode === 'arena' ? (
          /* ============================================================== */
          /* VIEW 1: AUTHENTIC CONSOLE 1-ON-1 COMBAT ARENA                   */
          /* ============================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Side: The Interactive Retro Handheld Console Docket */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[490px] relative">
                {/* Visual Chassis Title Bar */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 led-glow-emerald" />
                    <span className="font-bold text-slate-300">CONSOLE ACTIVE // RUN #{duelCount}</span>
                  </div>
                  <div className="text-[11px] font-bold text-amber-400">
                    TARGET: <span className="underline">{activeTarget.shortName || activeTarget.name}</span>
                  </div>
                </div>

                {/* Handheld Docket Chassis */}
                <div className="skeuo-chassis-purple p-3.5 sm:p-4 rounded-3xl relative shadow-2xl border border-purple-400/40">
                  {/* Top Header: Acoustic Speaker Mesh + Volume + SFX + Music */}
                  <div className="flex items-center justify-between px-1 pb-2 border-b border-purple-400/30 gap-1.5">
                    {/* Left: Expanded 7x3 Speaker Mesh */}
                    <div className="flex items-center gap-2">
                      <div
                        className="grid grid-cols-7 gap-[2.5px] p-1.5 rounded-lg bg-purple-950/60 border border-purple-300/40 shadow-inner shrink-0"
                        title="Acoustic 8-Bit Speaker Chamber"
                      >
                        {Array.from({ length: 21 }).map((_, i) => (
                          <div key={i} className="speaker-grille-dot !w-[3px] !h-[3px] !bg-purple-950" />
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="flex h-5 w-5 sm:h-5.5 sm:w-5.5 items-center justify-center rounded bg-slate-950 text-[8.5px] font-black text-white shadow-inner border border-slate-700">
                          <span>NG</span>
                        </div>
                        <div className="leading-none">
                          <div className="font-mono text-[9.5px] sm:text-[10px] font-black tracking-wider text-slate-950 uppercase">
                            NG-01 POCKET
                          </div>
                          <div className="font-mono text-[7px] sm:text-[7.5px] font-bold text-purple-950/75 uppercase tracking-wide mt-0.5">
                            ARENA ENGINE
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Audio Knobs and Switches */}
                    <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                      <SkeuoVolumeKnob volume={volume} onChange={handleVolumeChange} />
                      <SkeuoTactileSwitch
                        checked={soundEnabled}
                        onChange={() => setSoundEnabled((p) => !p)}
                        label="SFX"
                        title={`SFX Switch: ${soundEnabled ? 'ON' : 'OFF'}`}
                      />
                      <SkeuoTactileSwitch
                        checked={musicActive}
                        onChange={() => setMusicActive((p) => !p)}
                        label="MUSIC"
                        title={`Music: ${musicActive ? 'PLAYING' : 'OFF'}`}
                      />
                    </div>
                  </div>

                  {/* Recessed Screen Housing with Game Engine */}
                  <div className="screen-recess mt-2 p-1 sm:p-1.5 rounded-2xl bg-slate-950 text-white relative shadow-inner">
                    <div className="gloss-sheen" />
                    <DomainGameEngine
                      ref={engineRef}
                      isAutoMode={isAutoMode}
                      gameMode={gameMode}
                      godMode={godMode}
                      onToggleAutoMode={setIsAutoMode}
                      onToggleGameMode={setGameMode}
                      soundEnabled={soundEnabled}
                    />
                  </div>

                  {/* Top Control Sub-Deck: Mode / Campaign / Reset */}
                  <div className="mt-2 grid grid-cols-3 gap-1.5 sm:gap-2">
                    {/* Auto / Manual Mode */}
                    <div className="key-socket-dark !p-[2px] !rounded-[10px] flex">
                      <button
                        type="button"
                        onClick={() => {
                          if (soundEnabled) playMechanicalClick('switch')
                          setIsAutoMode((prev) => !prev)
                        }}
                        className="key-cap w-full py-1.5 sm:py-2 !rounded-[7px] font-mono text-center transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer select-none"
                        title="Toggle Auto-Pilot vs Player Control"
                      >
                        <span
                          className={`inline-block w-1.5 h-1.5 rounded-full transition-colors ${
                            isAutoMode
                              ? 'bg-amber-400 shadow-sm border border-amber-500/60'
                              : 'bg-emerald-500 led-glow-emerald border border-emerald-600/60'
                          }`}
                        />
                        <span className="font-black text-[8px] sm:text-[8.5px] tracking-tight text-slate-800">
                          {isAutoMode ? 'AUTO' : 'MANUAL'}
                        </span>
                      </button>
                    </div>

                    {/* Quest / Casual Mode */}
                    <div className="key-socket-dark !p-[2px] !rounded-[10px] flex">
                      <button
                        type="button"
                        onClick={() => {
                          if (soundEnabled) playMechanicalClick('switch')
                          setGameMode((prev) => (prev === 'campaign' ? 'casual' : 'campaign'))
                        }}
                        className="key-cap w-full py-1.5 sm:py-2 !rounded-[7px] font-mono text-center transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer select-none"
                        title="Toggle Game Mode"
                      >
                        <Sword
                          weight="bold"
                          className={`text-xs shrink-0 ${
                            gameMode === 'campaign' ? 'text-emerald-600' : 'text-purple-600'
                          }`}
                        />
                        <span className="font-black text-[8px] sm:text-[8.5px] tracking-tight text-slate-800">
                          {gameMode === 'campaign' ? 'QUEST' : 'CASUAL'}
                        </span>
                      </button>
                    </div>

                    {/* Reset Button */}
                    <div className="key-socket-dark !p-[2px] !rounded-[10px] flex">
                      <button
                        type="button"
                        onClick={handleRestartDuel}
                        className="key-cap w-full py-1.5 sm:py-2 !rounded-[7px] font-mono text-center transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer select-none"
                        title="Restart Current Duel"
                      >
                        <ArrowClockwise weight="bold" className="text-xs text-sky-600 shrink-0" />
                        <span className="font-black text-[8px] sm:text-[8.5px] tracking-tight text-slate-800">
                          RESET
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Zone 2: 4-Bay Primary Hardware Action Controls (LEFT, RIGHT, JUMP, BLAST) */}
                  <div className="mt-2.5">
                    <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                      {/* MOVE LEFT */}
                      <div className="key-socket-dark !p-[3px] !rounded-[14px] flex">
                        <button
                          type="button"
                          onPointerDown={(e) => {
                            e.preventDefault()
                            handleMoveLeft(true)
                          }}
                          onPointerUp={() => handleMoveLeft(false)}
                          onPointerLeave={() => handleMoveLeft(false)}
                          className={`w-full py-2.5 sm:py-3 !rounded-[10px] font-mono text-center transition-all flex flex-col items-center justify-center gap-0.5 shadow-md cursor-pointer select-none ${
                            pressedKeys.left
                              ? 'key-cap-active translate-y-0.5 shadow-inner bg-slate-200'
                              : 'key-cap active:scale-95'
                          }`}
                          title="Move Left (A / Left Arrow)"
                        >
                          <div className="flex items-center gap-1 font-black text-[10.5px] sm:text-[11.5px] tracking-tight text-slate-900">
                            <span className="text-xs">◀</span>
                            <span>LEFT</span>
                          </div>
                          <span className="text-[7.5px] sm:text-[8px] font-bold text-slate-500 tracking-tight font-mono">
                            [A / ←]
                          </span>
                        </button>
                      </div>

                      {/* MOVE RIGHT */}
                      <div className="key-socket-dark !p-[3px] !rounded-[14px] flex">
                        <button
                          type="button"
                          onPointerDown={(e) => {
                            e.preventDefault()
                            handleMoveRight(true)
                          }}
                          onPointerUp={() => handleMoveRight(false)}
                          onPointerLeave={() => handleMoveRight(false)}
                          className={`w-full py-2.5 sm:py-3 !rounded-[10px] font-mono text-center transition-all flex flex-col items-center justify-center gap-0.5 shadow-md cursor-pointer select-none ${
                            pressedKeys.right
                              ? 'key-cap-active translate-y-0.5 shadow-inner bg-slate-200'
                              : 'key-cap active:scale-95'
                          }`}
                          title="Move Right (D / Right Arrow)"
                        >
                          <div className="flex items-center gap-1 font-black text-[10.5px] sm:text-[11.5px] tracking-tight text-slate-900">
                            <span>RIGHT</span>
                            <span className="text-xs">▶</span>
                          </div>
                          <span className="text-[7.5px] sm:text-[8px] font-bold text-slate-500 tracking-tight font-mono">
                            [D / →]
                          </span>
                        </button>
                      </div>

                      {/* HOP (JUMP) */}
                      <div className="key-socket-dark !p-[3px] !rounded-[14px] flex">
                        <button
                          type="button"
                          onPointerDown={(e) => {
                            e.preventDefault()
                            setPressedKeys((p) => ({ ...p, jump: true }))
                            handleJumpClick()
                          }}
                          onPointerUp={() => setPressedKeys((p) => ({ ...p, jump: false }))}
                          onPointerLeave={() => setPressedKeys((p) => ({ ...p, jump: false }))}
                          className={`key-cap-terracotta w-full py-2.5 sm:py-3 !rounded-[10px] font-mono text-center transition-all flex flex-col items-center justify-center gap-0.5 shadow-lg cursor-pointer select-none ${
                            pressedKeys.jump
                              ? 'translate-y-0.5 shadow-inner brightness-90'
                              : 'active:scale-95'
                          }`}
                          title="Jump (Space / W / Up Arrow)"
                        >
                          <div className="flex items-center gap-1 font-black text-[10.5px] sm:text-[11.5px] tracking-wide text-white">
                            <PawPrint weight="fill" className="text-amber-200 text-xs sm:text-sm shrink-0" />
                            <span>HOP</span>
                          </div>
                          <span className="text-[7.5px] sm:text-[8px] font-bold text-amber-100/90 tracking-tight font-mono">
                            [space]
                          </span>
                        </button>
                      </div>

                      {/* BLAST (SHOOT) */}
                      <div className="key-socket-dark !p-[3px] !rounded-[14px] flex">
                        <button
                          type="button"
                          onPointerDown={(e) => {
                            e.preventDefault()
                            setPressedKeys((p) => ({ ...p, fire: true }))
                            handleShootClick()
                          }}
                          onPointerUp={() => setPressedKeys((p) => ({ ...p, fire: false }))}
                          onPointerLeave={() => setPressedKeys((p) => ({ ...p, fire: false }))}
                          className={`key-cap-cobalt w-full py-2.5 sm:py-3 !rounded-[10px] font-mono text-center transition-all flex flex-col items-center justify-center gap-0.5 shadow-lg cursor-pointer select-none ${
                            pressedKeys.fire
                              ? 'translate-y-0.5 shadow-inner brightness-90'
                              : 'active:scale-95'
                          }`}
                          title="Shoot (Click / J / F / Enter)"
                        >
                          <div className="flex items-center gap-1 font-black text-[10.5px] sm:text-[11.5px] tracking-wide text-white">
                            <Crosshair weight="bold" className="text-cyan-200 text-xs sm:text-sm shrink-0" />
                            <span>BLAST</span>
                          </div>
                          <span className="text-[7.5px] sm:text-[8px] font-bold text-cyan-100/90 tracking-tight font-mono">
                            [click / J]
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Keyboard Quick Guide */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>⌨️ KEYBOARD: [A / D] Move • [Space] Hop • [J / Click] Blast</span>
                  <button
                    type="button"
                    onClick={handleClearArena}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors cursor-pointer"
                  >
                    🧹 CLEAR
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side: Combat Simulator Control Deck & Enemy/Boss Selector */}
            <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-4">
              {/* Battle Arsenal & Cheat Utilities */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Lightning weight="bold" className="text-amber-400" />
                    <span className="font-mono text-xs font-black uppercase text-white tracking-wider">
                      COMBAT UTILITIES & BLASTER ARSENAL
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleToggleGodMode}
                      className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        godMode
                          ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                      title="Toggle infinite lives/god mode for stress testing"
                    >
                      <ShieldCheck weight="bold" />
                      <span>{godMode ? '🛡️ GOD MODE: ON' : 'GOD MODE: OFF'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddLives(5)}
                      className="px-2.5 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-700/60 font-mono text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Heart weight="fill" className="text-red-400" />
                      <span>+5 HP</span>
                    </button>
                  </div>
                </div>

                {/* Blaster Weapon Quick Armory */}
                <div>
                  <div className="font-mono text-[11px] font-bold text-slate-400 uppercase mb-2">
                    🔫 SELECT CAT BLASTER:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {WEAPONS.map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => handleSelectWeapon(w.id)}
                        className={`p-2 rounded-xl font-mono text-xs font-bold text-left transition-all border cursor-pointer active:scale-95 ${
                          activeWeapon === w.id
                            ? 'bg-cyan-950/90 text-cyan-200 border-cyan-400 shadow-md ring-1 ring-cyan-400'
                            : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-base">{w.icon}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 font-mono text-slate-400">
                            {w.tag}
                          </span>
                        </div>
                        <div className="font-black leading-tight">{w.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Enemy Category Selector (6 Bosses vs 4 Enemies) */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex-1">
                {/* Category Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        playMechanicalClick('click')
                        setTargetCategory('bosses')
                      }}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        targetCategory === 'bosses'
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Skull weight="bold" />
                      <span>👑 6 BOSSES</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playMechanicalClick('click')
                        setTargetCategory('classic')
                      }}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        targetCategory === 'classic'
                          ? 'bg-cyan-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Bug weight="bold" />
                      <span>👾 4 CLASSIC MOBS</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playMechanicalClick('click')
                        setTargetCategory('cyber')
                      }}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        targetCategory === 'cyber'
                          ? 'bg-amber-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Lightning weight="bold" />
                      <span>⚡ 6 CYBERNETIC (POST-BOSS)</span>
                    </button>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    CLICK TO SPAWN & SIMULATE FIGHT
                  </div>
                </div>

                {/* Target Cards Matrix */}
                {targetCategory === 'bosses' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {BOSS_DATA.map((boss) => {
                      const isSelected = activeTarget.id === boss.id && targetCategory === 'bosses'
                      return (
                        <div
                          key={boss.id}
                          onClick={() => handleFightTarget(boss, 'bosses')}
                          className={`p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                            isSelected
                              ? 'bg-purple-950/40 border-purple-400 shadow-lg shadow-purple-500/10 ring-1 ring-purple-400'
                              : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{boss.icon}</span>
                              <div>
                                <h3 className="font-mono text-xs font-black text-white leading-tight">
                                  {boss.name}
                                </h3>
                                <div className="text-[10px] font-mono text-slate-400">{boss.category}</div>
                              </div>
                            </div>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-amber-300">
                              {boss.hp} HP
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-300 line-clamp-2 mb-2 leading-relaxed">
                            {boss.description}
                          </p>

                          {/* Attacks Pill list */}
                          <div className="flex flex-wrap gap-1 mb-2.5">
                            {boss.attacks.map((att) => (
                              <span
                                key={att.id}
                                className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9.5px] font-mono text-slate-300"
                              >
                                {att.name.split(' ')[0]} {att.name.split(' ')[1]}
                              </span>
                            ))}
                          </div>

                          {/* Action Button */}
                          <button
                            type="button"
                            className={`w-full py-1.5 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? 'bg-purple-500 text-white font-black shadow-md'
                                : 'bg-slate-800 hover:bg-purple-900/60 text-slate-300 hover:text-purple-200'
                            }`}
                          >
                            <Sword weight="bold" />
                            <span>{isSelected ? '⚔️ DUELING IN CONSOLE' : 'SPAWN & FIGHT'}</span>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(targetCategory === 'classic' ? CLASSIC_ENEMY_DATA : CYBER_ENEMY_DATA).map((enemy) => {
                      const isSelected = activeTarget.id === enemy.id && targetCategory === (targetCategory === 'classic' ? 'classic' : 'cyber')
                      return (
                        <div
                          key={enemy.id}
                          onClick={() => handleFightTarget(enemy, targetCategory)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                            isSelected
                              ? 'bg-amber-950/40 border-amber-400 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400'
                              : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{enemy.icon}</span>
                              <div>
                                <h3 className="font-mono text-xs font-black text-white leading-tight">
                                  {enemy.name}
                                </h3>
                                <div className="text-[10px] font-mono text-slate-400">{enemy.category}</div>
                              </div>
                            </div>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-amber-300">
                              {enemy.hp} HP
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-300 line-clamp-2 mb-2.5 leading-relaxed">
                            {enemy.desc}
                          </p>

                          {/* Attacks Pill list */}
                          <div className="flex flex-wrap gap-1 mb-2.5">
                            {enemy.attacks?.map((att) => (
                              <span
                                key={att.id}
                                className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9.5px] font-mono text-slate-300"
                              >
                                {att.name.split(' ')[0]} {att.name.split(' ')[1] || ''}
                              </span>
                            ))}
                          </div>

                          {/* Action Button */}
                          <button
                            type="button"
                            className={`w-full py-1.5 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                                : 'bg-slate-800 hover:bg-amber-900/60 text-slate-300 hover:text-amber-200'
                            }`}
                          >
                            <Sword weight="bold" />
                            <span>{isSelected ? '⚔️ DUELING IN CONSOLE' : 'SPAWN & FIGHT'}</span>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Active Target Intelligence Dossier */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    <span className="font-mono text-xs font-black text-white uppercase tracking-wider">
                      OPPONENT INTELLIGENCE DOSSIER
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${activeTarget.bgBadge || 'bg-slate-800 text-slate-300'}`}>
                    {activeTarget.category || 'Target'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-300">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">TOTAL HEALTH</div>
                    <div className="text-base font-black text-emerald-400 mt-0.5">{activeTarget.hp} HP</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">DEFEAT SCORE</div>
                    <div className="text-base font-black text-amber-400 mt-0.5">{activeTarget.score || activeTarget.milestone}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">ATTACK PROFILE</div>
                    <div className="text-xs font-bold text-purple-400 mt-1">
                      {targetCategory === 'bosses' ? '3 Telegraphed Phases' : 'Contact Collision'}
                    </div>
                  </div>
                </div>

                {activeTarget.attacks && (
                  <div className="mt-3 space-y-1.5">
                    <div className="font-mono text-[10px] font-bold text-slate-400 uppercase">
                      TELEGRAPHED ATTACK PATTERNS:
                    </div>
                    {activeTarget.attacks.map((att) => (
                      <div
                        key={att.id}
                        className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-start justify-between gap-2 text-xs font-mono"
                      >
                        <span className="font-bold text-amber-300 shrink-0">{att.name}</span>
                        <span className="text-[11px] text-slate-400 text-right">{att.desc}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* VIEW 2: SPRITE FRAME INSPECTOR & HITBOX CHAMBER                */
          /* ============================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Pixel Art Canvas Visualizer */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
                <canvas
                  ref={previewCanvasRef}
                  width={640}
                  height={320}
                  className="w-full h-auto block object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />

                {/* Overlay Controls */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    className="p-2 rounded-lg bg-slate-900/90 text-white border border-slate-700 hover:bg-slate-800 font-mono text-xs cursor-pointer shadow-md"
                    title={isPlaying ? 'Pause Animation' : 'Play Animation'}
                  >
                    {isPlaying ? <Pause weight="bold" /> : <Play weight="bold" />}
                  </button>
                  <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-700 text-xs font-mono">
                    <span className="px-1 text-slate-400">ZOOM:</span>
                    {[1.5, 2.5, 3.5].map((scale) => (
                      <button
                        key={scale}
                        type="button"
                        onClick={() => setZoomScale(scale)}
                        className={`px-1.5 py-0.5 rounded ${
                          zoomScale === scale ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300'
                        }`}
                      >
                        {scale}x
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-700 text-xs font-mono">
                    <span className="px-1 text-slate-400">SPEED:</span>
                    {[0.5, 1.0, 2.0].map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => setAnimSpeed(spd)}
                        className={`px-1.5 py-0.5 rounded ${
                          animSpeed === spd ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-300'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bottom Canvas State Info */}
                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>INSPECTING: {activeTarget.name}</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-amber-300 font-bold uppercase">{animState}</span>
                </div>
              </div>

              {/* Animation Triggers */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="font-mono text-xs font-bold text-slate-400 uppercase mb-2">
                  TRIGGER SPRITE ANIMATION STATES:
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { id: 'idle', label: 'IDLE LOOP' },
                    { id: 'attack_a', label: 'ATTACK A' },
                    { id: 'attack_b', label: 'ATTACK B' },
                    { id: 'attack_c', label: 'ATTACK C' },
                    { id: 'hit', label: '💥 HIT FLASH' },
                    { id: 'defeat', label: '☠️ DEFEAT' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        if (soundEnabled) playMechanicalClick('click')
                        setAnimState(st.id)
                      }}
                      className={`py-2 px-1 rounded-xl font-mono text-xs font-bold text-center transition-all cursor-pointer ${
                        animState === st.id
                          ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                          : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Entity Selection List */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                  <span className="font-mono text-xs font-bold text-white uppercase">SELECT SPRITE</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setTargetCategory('bosses')}
                      className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                        targetCategory === 'bosses' ? 'bg-purple-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      BOSSES
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetCategory('enemies')}
                      className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                        targetCategory === 'enemies' ? 'bg-amber-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      ENEMIES
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {(targetCategory === 'bosses' ? BOSS_DATA : ENEMY_DATA).map((ent) => {
                    const isSelected = activeTarget.id === ent.id
                    return (
                      <button
                        key={ent.id}
                        type="button"
                        onClick={() => {
                          if (soundEnabled) playMechanicalClick('click')
                          setActiveTarget(ent)
                        }}
                        className={`w-full p-2.5 rounded-xl border text-left font-mono transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-md'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{ent.icon}</span>
                          <div>
                            <div className="text-xs font-bold text-white">{ent.name}</div>
                            <div className="text-[10px] text-slate-400">{ent.category}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-amber-300">{ent.hp} HP</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
