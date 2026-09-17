// Web Audio API micro-haptics for tactile mechanical switches and knobs
let audioCtx = null
let soundMuted = false

export function setSoundMuted(muted) {
  soundMuted = Boolean(muted)
}

export function isSoundMuted() {
  return soundMuted
}

export function playMechanicalClick(type = 'click') {
  if (typeof window === 'undefined' || soundMuted) return
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return
      audioCtx = new AudioContext()
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }

    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    const now = audioCtx.currentTime

    if (type === 'heavy') {
      // Big mechanical push button or stomp switch
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(140, now)
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.06)
      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start(now)
      osc.stop(now + 0.07)
    } else if (type === 'dial') {
      // Knurled rotary dial notch tick
      osc.type = 'sine'
      osc.frequency.setValueAtTime(750, now)
      osc.frequency.exponentialRampToValueAtTime(250, now + 0.025)
      gain.gain.setValueAtTime(0.1, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025)
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start(now)
      osc.stop(now + 0.03)
    } else {
      // Snappy mechanical keycap click
      osc.type = 'sine'
      osc.frequency.setValueAtTime(360, now)
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.035)
      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035)
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start(now)
      osc.stop(now + 0.04)
    }
  } catch (_e) {
    // Graceful fallback
  }
}

export function playPixelJump() {
  if (typeof window === 'undefined' || soundMuted) return
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return
      audioCtx = new AudioContext()
    }
    if (audioCtx.state === 'suspended') audioCtx.resume()

    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    const now = audioCtx.currentTime

    osc.type = 'square'
    osc.frequency.setValueAtTime(220, now)
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.09)
    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)

    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start(now)
    osc.stop(now + 0.1)
  } catch (_) {}
}

export function playPowerupChime() {
  if (typeof window === 'undefined' || soundMuted) return
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return
      audioCtx = new AudioContext()
    }
    if (audioCtx.state === 'suspended') audioCtx.resume()

    const now = audioCtx.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      const start = now + idx * 0.05

      osc.type = 'square'
      osc.frequency.setValueAtTime(freq, start)
      gain.gain.setValueAtTime(0.07, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.07)

      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start(start)
      osc.stop(start + 0.08)
    })
  } catch (_) {}
}

export function playGameOver() {
  if (typeof window === 'undefined' || soundMuted) return
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return
      audioCtx = new AudioContext()
    }
    if (audioCtx.state === 'suspended') audioCtx.resume()

    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    const now = audioCtx.currentTime

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(320, now)
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.28)
    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start(now)
    osc.stop(now + 0.3)
  } catch (_) {}
}

export function playCountdownBeep(isGo = false) {
  if (typeof window === 'undefined' || soundMuted) return
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return
      audioCtx = new AudioContext()
    }
    if (audioCtx.state === 'suspended') audioCtx.resume()

    const now = audioCtx.currentTime
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()

    osc.type = isGo ? 'square' : 'triangle'
    const freq = isGo ? 880 : 440 // A5 for GO!, A4 for 3, 2, 1
    const dur = isGo ? 0.35 : 0.15

    osc.frequency.setValueAtTime(freq, now)
    if (isGo) {
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + dur) // D6 upward fanfare
    }
    gain.gain.setValueAtTime(isGo ? 0.14 : 0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur)

    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start(now)
    osc.stop(now + dur)
  } catch (_) {}
}

export function playCannonBlast() {
  if (typeof window === 'undefined' || soundMuted) return
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return
      audioCtx = new AudioContext()
    }
    if (audioCtx.state === 'suspended') audioCtx.resume()

    const now = audioCtx.currentTime

    // Heavy bass thud
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(160, now)
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.35)
    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)

    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start(now)
    osc.stop(now + 0.4)

    // Upward launch whistle / hiss
    const launchOsc = audioCtx.createOscillator()
    const launchGain = audioCtx.createGain()
    launchOsc.type = 'triangle'
    launchOsc.frequency.setValueAtTime(220, now + 0.05)
    launchOsc.frequency.exponentialRampToValueAtTime(880, now + 0.3)
    launchGain.gain.setValueAtTime(0.1, now + 0.05)
    launchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32)

    launchOsc.connect(launchGain)
    launchGain.connect(audioCtx.destination)
    launchOsc.start(now + 0.05)
    launchOsc.stop(now + 0.32)
  } catch (_) {}
}

export function playPhaseChime() {
  if (typeof window === 'undefined' || soundMuted) return
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return
      audioCtx = new AudioContext()
    }
    if (audioCtx.state === 'suspended') audioCtx.resume()

    const now = audioCtx.currentTime
    // Ascending major arpeggio: C5 (523), E5 (659), G5 (784), C6 (1046)
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      const start = now + i * 0.08
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, start)
      gain.gain.setValueAtTime(0.09 * masterVolume, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22)
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start(start)
      osc.stop(start + 0.25)
    })
  } catch (_) {}
}

// Background In-Game 8-Bit Music Controller
const MUSIC_TRACKS = [
  '/game/ingame-music/8-bit Funk.mp3',
  '/game/ingame-music/8-bit Funk 2.mp3',
]

let bgMusicAudio = null
let currentTrackIdx = 0
let musicActive = false
let masterVolume = 0.75

export function setMasterVolume(vol) {
  masterVolume = Math.max(0, Math.min(1, Number(vol) || 0))
  if (bgMusicAudio) {
    bgMusicAudio.volume = masterVolume * 0.55 // comfortable bg level
  }
}

export function getMasterVolume() {
  return masterVolume
}

export function setMusicEnabled(enabled) {
  musicActive = Boolean(enabled)
  if (typeof window === 'undefined') return

  if (musicActive) {
    if (!bgMusicAudio) {
      bgMusicAudio = new Audio(MUSIC_TRACKS[currentTrackIdx])
      bgMusicAudio.loop = false
      bgMusicAudio.volume = masterVolume * 0.55
      bgMusicAudio.addEventListener('ended', () => {
        currentTrackIdx = (currentTrackIdx + 1) % MUSIC_TRACKS.length
        bgMusicAudio.src = MUSIC_TRACKS[currentTrackIdx]
        bgMusicAudio.play().catch(() => {})
      })
    }
    bgMusicAudio.volume = masterVolume * 0.55
    bgMusicAudio.play().catch(() => {
      // Browser autoplay policy might require user click
    })
  } else {
    if (bgMusicAudio) {
      bgMusicAudio.pause()
    }
  }
}

export function isMusicEnabled() {
  return musicActive
}

export function nextMusicTrack() {
  if (typeof window === 'undefined' || !bgMusicAudio) return
  currentTrackIdx = (currentTrackIdx + 1) % MUSIC_TRACKS.length
  bgMusicAudio.src = MUSIC_TRACKS[currentTrackIdx]
  if (musicActive) {
    bgMusicAudio.play().catch(() => {})
  }
}

// 8-Bit Laser Blaster Sound
export function playLaserShoot(weapon = 'plasma') {
  if (typeof window === 'undefined' || soundMuted) return
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return
      audioCtx = new AudioContext()
    }
    if (audioCtx.state === 'suspended') audioCtx.resume()

    const now = audioCtx.currentTime
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()

    if (weapon === 'railgun') {
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(1400, now)
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.12)
      gain.gain.setValueAtTime(0.12 * masterVolume, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
    } else if (weapon === 'missile') {
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(320, now)
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.15)
      gain.gain.setValueAtTime(0.14 * masterVolume, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16)
    } else {
      // Crisp snappy pixel pew
      osc.type = 'square'
      osc.frequency.setValueAtTime(880, now)
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.07)
      gain.gain.setValueAtTime(0.09 * masterVolume, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
    }

    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start(now)
    osc.stop(now + 0.16)
  } catch (_) {}
}

// 8-Bit Enemy Explosion / Shatter Sound
export function playEnemyExplode() {
  if (typeof window === 'undefined' || soundMuted) return
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return
      audioCtx = new AudioContext()
    }
    if (audioCtx.state === 'suspended') audioCtx.resume()

    const now = audioCtx.currentTime
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(340, now)
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.14)
    gain.gain.setValueAtTime(0.15 * masterVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)

    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start(now)
    osc.stop(now + 0.16)
  } catch (_) {}
}

// Boss Incoming Siren Warning
export function playBossWarning() {
  if (typeof window === 'undefined' || soundMuted) return
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return
      audioCtx = new AudioContext()
    }
    if (audioCtx.state === 'suspended') audioCtx.resume()

    const now = audioCtx.currentTime
    const freqs = [660, 440, 660, 440]
    freqs.forEach((f, i) => {
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      const start = now + i * 0.12
      osc.type = 'square'
      osc.frequency.setValueAtTime(f, start)
      gain.gain.setValueAtTime(0.12 * masterVolume, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.1)
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start(start)
      osc.stop(start + 0.11)
    })
  } catch (_) {}
}

// Boss Metal Armor Hit Sound
export function playBossHit() {
  if (typeof window === 'undefined' || soundMuted) return
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return
      audioCtx = new AudioContext()
    }
    if (audioCtx.state === 'suspended') audioCtx.resume()

    const now = audioCtx.currentTime
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(240, now)
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.05)
    gain.gain.setValueAtTime(0.12 * masterVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)

    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start(now)
    osc.stop(now + 0.06)
  } catch (_) {}
}

// Boss Defeated Victory Blast
export function playBossDefeated() {
  if (typeof window === 'undefined' || soundMuted) return
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return
      audioCtx = new AudioContext()
    }
    if (audioCtx.state === 'suspended') audioCtx.resume()

    const now = audioCtx.currentTime
    // Big booming explosion
    const boomOsc = audioCtx.createOscillator()
    const boomGain = audioCtx.createGain()
    boomOsc.type = 'sawtooth'
    boomOsc.frequency.setValueAtTime(220, now)
    boomOsc.frequency.exponentialRampToValueAtTime(30, now + 0.45)
    boomGain.gain.setValueAtTime(0.28 * masterVolume, now)
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
    boomOsc.connect(boomGain)
    boomGain.connect(audioCtx.destination)
    boomOsc.start(now)
    boomOsc.stop(now + 0.5)

    // Victory fanfare arpeggio
    const fanfareNotes = [523.25, 659.25, 783.99, 1046.5, 1318.5]
    fanfareNotes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      const start = now + 0.2 + i * 0.08
      osc.type = 'square'
      osc.frequency.setValueAtTime(freq, start)
      gain.gain.setValueAtTime(0.12 * masterVolume, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18)
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start(start)
      osc.stop(start + 0.2)
    })
  } catch (_) {}
}


