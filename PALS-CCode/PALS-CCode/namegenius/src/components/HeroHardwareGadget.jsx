import React, { useState, useRef, useEffect } from 'react'
import {
  playMechanicalClick,
  setSoundMuted,
  setMusicEnabled,
  isMusicEnabled,
  setMasterVolume,
  getMasterVolume,
} from '../utils/audio'
import DomainGameEngine from './DomainGameEngine'
import {
  ArrowClockwise,
  PawPrint,
  SpeakerHigh,
  SpeakerSlash,
  MusicNotes,
  Crosshair,
  Lightning,
  Sword,
  Sparkle,
} from '@phosphor-icons/react'

// Skeuomorphic Console Recessed Hardware Switch (Chassis-integrated socket + knurled tactile slider)
export function SkeuoTactileSwitch({ checked, onChange, label, title }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        title={title}
        className="relative w-[42px] sm:w-[46px] h-[22px] sm:h-[23px] rounded-full p-[1.5px] cursor-pointer select-none transition-transform active:scale-95 focus:outline-none flex items-center shadow-xs group"
        style={{
          background: 'linear-gradient(180deg, #13091f 0%, #1e122e 100%)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.85), inset 0 0 1px rgba(255,255,255,0.15), 0 1px 0 rgba(255,255,255,0.3)',
          border: '1px solid rgba(49, 16, 75, 0.6)',
        }}
      >
        {/* Recessed slider track */}
        <div
          className="w-full h-full rounded-full relative flex items-center overflow-hidden transition-colors"
          style={{
            background: checked ? '#064e3b' : '#0a0512',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.9)',
          }}
        >
          {/* Subtle micro LED pinprick when ON */}
          {checked && (
            <div className="absolute left-1.5 w-1.2 h-1.2 rounded-full bg-emerald-400 led-glow-emerald pointer-events-none" />
          )}

          {/* Machined Hardware Slider Knob */}
          <div
            className="absolute top-[0.5px] bottom-[0.5px] w-[18px] sm:w-[19px] rounded-full transition-all duration-150 flex items-center justify-center shadow-md"
            style={{
              left: checked ? 'calc(100% - 18.5px)' : '0.5px',
              background: checked
                ? 'linear-gradient(180deg, #ffffff 0%, #e2e8f0 55%, #cbd5e1 100%)'
                : 'linear-gradient(180deg, #64748b 0%, #475569 60%, #334155 100%)',
              border: checked ? '1px solid #ffffff' : '1px solid #64748b',
              boxShadow: '0 1px 2px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.9)',
            }}
          >
            {/* Center knurled grip lines */}
            <div className="flex gap-[1.5px] items-center pointer-events-none">
              <div className={`w-[1px] h-2.5 rounded-full ${checked ? 'bg-slate-400' : 'bg-slate-700'}`} />
              <div className={`w-[1px] h-2.5 rounded-full ${checked ? 'bg-slate-400' : 'bg-slate-700'}`} />
            </div>
          </div>
        </div>
      </button>

      {/* Clean minimal console text label */}
      <span className="font-mono text-[7.5px] sm:text-[8px] font-black uppercase tracking-wider text-purple-950/90 leading-none mt-0.5">
        {label}
      </span>
    </div>
  )
}

// Skeuomorphic Hardware Rotary Volume Knob (Chassis-integrated Dark Socket + Knurled Metal Cap)
export function SkeuoVolumeKnob({ volume = 0.75, onChange }) {
  const isDragging = useRef(false)
  const startY = useRef(0)
  const startVol = useRef(volume)

  const handlePointerDown = (e) => {
    isDragging.current = true
    startY.current = e.clientY
    startVol.current = volume
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  const handlePointerMove = (e) => {
    if (!isDragging.current) return
    const deltaY = startY.current - e.clientY
    const newVol = Math.max(0, Math.min(1, startVol.current + deltaY * 0.008))
    if (onChange) onChange(newVol)
  }

  const handlePointerUp = () => {
    isDragging.current = false
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
  }

  const handleClickStep = () => {
    const nextVol = volume >= 0.9 ? 0 : Math.min(1, Math.round((volume + 0.25) * 100) / 100)
    if (onChange) onChange(nextVol)
  }

  // -140° to +140° rotation range
  const deg = -140 + volume * 280

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        role="slider"
        aria-valuenow={Math.round(volume * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onClick={handleClickStep}
        onPointerDown={handlePointerDown}
        title={`Volume Knob: ${Math.round(volume * 100)}%`}
        className="w-[25px] sm:w-[27px] h-[25px] sm:h-[27px] rounded-full p-[1.5px] cursor-ns-resize select-none relative shadow-xs transition-transform active:scale-95"
        style={{
          background: 'linear-gradient(180deg, #13091f 0%, #1e122e 100%)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.85), inset 0 0 1px rgba(255,255,255,0.15), 0 1px 0 rgba(255,255,255,0.3)',
          border: '1px solid rgba(49, 16, 75, 0.6)',
        }}
      >
        {/* Rotating Knurled Cap with Pointer Notch */}
        <div
          className="w-full h-full rounded-full flex items-center justify-center relative transition-transform duration-75"
          style={{
            transform: `rotate(${deg}deg)`,
            background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 50%, #64748b 100%)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.95)',
            border: '0.8px solid #64748b',
          }}
        >
          {/* Pointer Notch */}
          <div className="absolute top-[0.5px] w-[2px] h-[3px] rounded-full bg-slate-950 shadow-xs" />
          {/* Center Rivet */}
          <div className="w-1.2 h-1.2 rounded-full bg-slate-800/80 border border-slate-600/60 shadow-inner" />
        </div>
      </div>
      {/* Clean minimal console text label */}
      <span className="font-mono text-[7.5px] sm:text-[8px] font-black uppercase tracking-wider text-purple-950/90 leading-none mt-0.5">
        VOL
      </span>
    </div>
  )
}

export default function HeroHardwareGadget({ onInteractWithConsole }) {
  const [isAutoMode, setIsAutoMode] = useState(true)
  const [gameMode, setGameMode] = useState('casual')
  const [difficulty, setDifficulty] = useState('easy')
  const [showDifficultyModal, setShowDifficultyModal] = useState(false)
  const [showRestartModal, setShowRestartModal] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy')
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [musicEnabled, setMusicActive] = useState(false)
  const [volume, setVolume] = useState(() => getMasterVolume() || 0.75)
  const [confettiBursts, setConfettiBursts] = useState([])
  const [pressedKeys, setPressedKeys] = useState({
    left: false,
    right: false,
    jump: false,
    fire: false,
  })
  const engineRef = useRef(null)

  useEffect(() => {
    setSoundMuted(!soundEnabled)
  }, [soundEnabled])

  useEffect(() => {
    setMusicEnabled(musicEnabled)
  }, [musicEnabled])

  const handleVolumeChange = (newVol) => {
    setVolume(newVol)
    setMasterVolume(newVol)
  }

  const handleJumpClick = () => {
    if (soundEnabled) playMechanicalClick('click')
    if (engineRef.current) {
      engineRef.current.jump(true)
    }
  }

  const handleShootClick = () => {
    if (soundEnabled) playMechanicalClick('click')
    if (engineRef.current && engineRef.current.shoot) {
      engineRef.current.shoot(true)
    }
  }

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

  const handleToggleMode = () => {
    if (soundEnabled) playMechanicalClick('switch')
    setIsAutoMode((prev) => !prev)
  }

  const handleToggleGameMode = () => {
    if (soundEnabled) playMechanicalClick('switch')
    setGameMode((prev) => {
      const next = prev === 'campaign' ? 'casual' : 'campaign'
      if (engineRef.current && engineRef.current.setGameMode) {
        engineRef.current.setGameMode(next)
      }
      return next
    })
  }

  const handleResetClick = () => {
    if (soundEnabled) playMechanicalClick('switch')
    setShowRestartModal(true)
  }

  const handleConfirmRestart = () => {
    if (soundEnabled) playMechanicalClick('heavy')
    setShowRestartModal(false)
    if (engineRef.current) {
      engineRef.current.restart(true)
    }
  }

  const handleSelectDifficultyAndStart = (diff) => {
    setSoundEnabled(true)
    setSoundMuted(false)
    setMusicActive(true)
    setMusicEnabled(true)
    try { playMechanicalClick('switch') } catch {}
    setShowDifficultyModal(false)
    setIsAutoMode(false)
    setGameMode('campaign')
    setDifficulty(diff)
    if (engineRef.current?.startCampaign) {
      engineRef.current.startCampaign(diff)
    }
  }

  const handleToggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev
      setSoundMuted(!next)
      if (next) playMechanicalClick('switch')
      return next
    })
  }

  const handleToggleMusic = () => {
    setMusicActive((prev) => {
      const next = !prev
      setMusicEnabled(next)
      if (soundEnabled) playMechanicalClick('switch')
      return next
    })
  }

  // Keyboard controls listener for visual UI feedback only (DomainGameEngine handles game actions with zero duplicate triggers)
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

  // Milestone confetti burst
  const handleMilestone = (milestoneScore) => {
    const colors = [
      '#f43f5e',
      '#fb923c',
      '#facc15',
      '#4ade80',
      '#38bdf8',
      '#a855f7',
      '#ec4899',
      '#6366f1',
    ]
    const pieces = Array.from({ length: 65 }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      color: colors[i % colors.length],
      width: 6 + Math.random() * 8,
      height: 6 + Math.random() * 12,
      isRound: Math.random() > 0.65,
      x: (Math.random() - 0.5) * 440,
      y: -80 - Math.random() * 260,
      rot: (Math.random() - 0.5) * 720,
      delay: Math.random() * 0.4,
      duration: 2.2 + Math.random() * 1.2,
    }))
    const burstId = Date.now()
    setConfettiBursts((prev) => [...prev, { id: burstId, pieces }])
    setTimeout(() => {
      setConfettiBursts((prev) => prev.filter((b) => b.id !== burstId))
    }, 3800)
  }

  return (
    <div className="relative mx-auto w-full max-w-[490px] select-none">
      {/* Celebratory Behind-the-Dock Confetti Layer */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-visible flex items-center justify-center">
        {confettiBursts.map((burst) => (
          <React.Fragment key={burst.id}>
            {burst.pieces.map((p) => (
              <div
                key={p.id}
                className="absolute animate-confetti-piece"
                style={{
                  left: '50%',
                  top: '15%',
                  width: `${p.width}px`,
                  height: `${p.height}px`,
                  backgroundColor: p.color,
                  borderRadius: p.isRound ? '50%' : '2px',
                  '--confetti-x': `${p.x}px`,
                  '--confetti-y': `${p.y}px`,
                  '--confetti-rot': `${p.rot}deg`,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                }}
              />
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Ambient Floor Shadow */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-7 w-4/5 rounded-full bg-black/40 blur-lg pointer-events-none" />

      {/* Main Molded Plastic Chassis with Tactile Grain (No Screws) */}
      <div className="skeuo-chassis-purple relative px-3 sm:px-5 pt-2 sm:pt-3 pb-3.5 sm:pb-5 shadow-2xl">
        {/* Left Side: Industrial Woven Flight Ribbon Tag (Responsive positioning on small screens) */}
        <div className="hidden xs:flex absolute -left-3 sm:-left-5 top-1/3 -translate-y-1/2 items-center z-20 pointer-events-auto">
          <div className="lanyard-bracket">
            <div className="lanyard-bracket-slot" />
          </div>
          {/* Heavy-Duty Industrial Woven Tactical Flight Tag */}
          <div className="absolute left-[-24px] top-1 pointer-events-none flex flex-col items-center animate-ribbon-sway">
            <svg width="44" height="125" viewBox="0 0 44 125" fill="none" className="drop-shadow-xl">
              <defs>
                <linearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#c2410c" />
                  <stop offset="25%" stopColor="#ea580c" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="75%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#9a3412" />
                </linearGradient>
                <linearGradient id="metalRingGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#cbd5e1" />
                  <stop offset="50%" stopColor="#64748b" />
                  <stop offset="100%" stopColor="#334155" />
                </linearGradient>
                <linearGradient id="brassGrommet" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fde047" />
                  <stop offset="50%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
                <pattern id="wovenTexture" width="4" height="4" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="4" y2="4" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
                  <line x1="0" y1="4" x2="4" y2="0" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                </pattern>
              </defs>

              <circle cx="28" cy="11" r="7.5" stroke="url(#metalRingGrad)" strokeWidth="3" fill="none" />
              <circle cx="28" cy="11" r="4" fill="rgba(15,23,42,0.6)" />

              <g transform="translate(8, 18)">
                <rect x="6" y="0" width="28" height="96" rx="4" fill="url(#ribbonGrad)" />
                <rect x="6" y="0" width="28" height="96" rx="4" fill="url(#wovenTexture)" />

                <line x1="8.5" y1="2" x2="8.5" y2="94" stroke="#fed7aa" strokeWidth="1" strokeDasharray="2.5 1.5" />
                <line x1="31.5" y1="2" x2="31.5" y2="94" stroke="#fed7aa" strokeWidth="1" strokeDasharray="2.5 1.5" />

                <circle cx="20" cy="8" r="4.5" fill="url(#brassGrommet)" stroke="#78350f" strokeWidth="0.8" />
                <circle cx="20" cy="8" r="2.2" fill="#1e1b4b" />

                <text
                  transform="rotate(90 20 54)"
                  x="20"
                  y="57.5"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontFamily="'JetBrains Mono', monospace"
                  fontSize="7.5"
                  fontWeight="800"
                  letterSpacing="1.2"
                >
                  NG-01 // TACTILE
                </text>

                <rect x="5.5" y="90" width="29" height="7" rx="1.5" fill="url(#brassGrommet)" stroke="#78350f" strokeWidth="0.8" />
                <circle cx="12" cy="93.5" r="1.2" fill="#451a03" />
                <circle cx="28" cy="93.5" r="1.2" fill="#451a03" />
              </g>
            </svg>
          </div>
        </div>

        {/* Top Header: Left Speaker Mesh + Title, Right: Volume Knob + SFX Switch + Music Switch (No dividing line, enhanced side padding) */}
        <div className="flex items-center justify-between px-1.5 sm:px-2 pt-0.5 pb-1 gap-1.5 sm:gap-2">
          {/* Left: Compact 9x4 Perforated Acoustic Speaker Mesh pushing NG badge right */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div
              className="grid grid-cols-9 gap-[1.5px] p-1.5 rounded-lg bg-purple-950/60 border border-purple-300/40 shadow-inner shrink-0"
              title="Acoustic 8-Bit Speaker Chamber"
            >
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="speaker-grille-dot !w-[3.5px] !h-[3.5px] !bg-purple-950" />
              ))}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <div className="flex h-5.5 w-5.5 sm:h-6 sm:w-6 items-center justify-center rounded-lg bg-slate-950 text-[9px] font-black text-white shadow-inner border border-slate-700">
                <span>NG</span>
              </div>
              <div className="leading-none">
                <div className="font-mono text-[9px] sm:text-[10px] font-black tracking-wider text-slate-950 uppercase">
                  NG-01 POCKET
                </div>
                <div className="font-mono text-[6.5px] sm:text-[7px] font-bold text-purple-950/75 uppercase tracking-wide mt-0.5">
                  DOMAIN ENGINE
                </div>
              </div>
            </div>
          </div>

          {/* Right: 3 Scaled UI Controls: Volume Rotary Knob + SFX Switch + MUSIC Switch */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* 1. Volume Rotary Knob */}
            <SkeuoVolumeKnob volume={volume} onChange={handleVolumeChange} />

            {/* 2. SFX Knurled Toggle Switch */}
            <SkeuoTactileSwitch
              checked={soundEnabled}
              onChange={handleToggleSound}
              label="SFX"
              title={`SFX Switch: ${soundEnabled ? 'ON' : 'OFF'}`}
            />

            {/* 3. MUSIC Knurled Toggle Switch */}
            <SkeuoTactileSwitch
              checked={musicEnabled}
              onChange={handleToggleMusic}
              label="MUSIC"
              title={`In-Game Music: ${musicEnabled ? 'PLAYING' : 'OFF'}`}
            />
          </div>
        </div>

        {/* Zone 1: Recessed Screen Housing with Expanded Tamagotchi Mini Game Engine (Pushed Up) */}
        <div className="screen-recess mt-1 p-1 sm:p-1.5 rounded-2xl bg-slate-950 text-white relative shadow-inner">
          <div className="gloss-sheen" />
          <DomainGameEngine
            ref={engineRef}
            isAutoMode={isAutoMode}
            gameMode={gameMode}
            difficulty={difficulty}
            onToggleAutoMode={setIsAutoMode}
            onToggleGameMode={setGameMode}
            soundEnabled={soundEnabled}
            onMilestone={handleMilestone}
          />

          {/* Static Bottom PLAY Button in Casual Autopilot Mode */}
          {isAutoMode && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
              <button
                type="button"
                onClick={() => {
                  if (soundEnabled) playMechanicalClick('switch')
                  setShowDifficultyModal(true)
                }}
                className="px-5 py-1.5 bg-[#f59e0b] hover:bg-[#fbbf24] text-slate-950 font-mono font-black text-xs uppercase tracking-widest border-2 border-black shadow-[inset_2px_2px_0_#fef08a,inset_-2px_-2px_0_#b45309,0_3px_0_#000000] active:translate-y-0.5 active:shadow-[inset_2px_2px_0_#fef08a,inset_-2px_-2px_0_#b45309,0_1px_0_#000000] transition-transform cursor-pointer select-none"
                title="Play Game — Select Difficulty"
              >
                ▶ PLAY
              </button>
            </div>
          )}

          {/* Authentic 16-Bit Pixel-Art Difficulty Selection Modal */}
          {showDifficultyModal && (
            <div className="absolute inset-0 z-30 bg-black/80 flex items-center justify-center p-3 animate-in fade-in duration-75">
              <div className="w-[240px] bg-[#0f172a] border-4 border-black p-3 shadow-[inset_2px_2px_0_#38bdf8,inset_-2px_-2px_0_#0284c7,0_6px_0_#000000] flex flex-col gap-2.5 font-mono text-white relative select-none">
                {/* Pixel Close Button [✕] */}
                <button
                  type="button"
                  onClick={() => setShowDifficultyModal(false)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-[#ef4444] hover:bg-[#f87171] text-black font-black text-xs border-2 border-black shadow-[inset_1px_1px_0_#fca5a5,inset_-1px_-1px_0_#991b1b,0_2px_0_#000] flex items-center justify-center cursor-pointer active:translate-y-0.5 active:shadow-none"
                  title="Close"
                >
                  ✕
                </button>

                {/* Pixel Title Header */}
                <div className="bg-black/60 border-2 border-black p-1 text-center shadow-[inset_1px_1px_0_#334155]">
                  <h3 className="font-black text-[10.5px] text-[#fbbf24] tracking-widest drop-shadow-[1px_1px_0_#000]">
                    ★ DIFFICULTY ★
                  </h3>
                </div>

                {/* Sound & Music Unified Audio Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !(soundEnabled && musicEnabled)
                    setSoundEnabled(next)
                    setSoundMuted(!next)
                    setMusicActive(next)
                    setMusicEnabled(next)
                    if (next) {
                      try { playMechanicalClick('switch') } catch {}
                    }
                  }}
                  className={`w-full py-1.5 px-2 border-2 border-black flex items-center justify-between gap-1 cursor-pointer transition-transform active:translate-y-0.5 text-[9.5px] font-black tracking-wider ${
                    soundEnabled && musicEnabled
                      ? 'bg-[#1e40af] text-white shadow-[inset_2px_2px_0_#60a5fa,inset_-2px_-2px_0_#172554,0_2px_0_#000]'
                      : 'bg-[#334155] text-slate-300 shadow-[inset_2px_2px_0_#64748b,inset_-2px_-2px_0_#0f172a,0_2px_0_#000]'
                  }`}
                  title="Toggle all game audio (SFX + Music)"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{soundEnabled && musicEnabled ? '🔊' : '🔈'}</span>
                    <span>SOUND & MUSIC</span>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 text-[8px] font-black border border-black ${
                      soundEnabled && musicEnabled
                        ? 'bg-[#22c55e] text-black shadow-[inset_1px_1px_0_#86efac]'
                        : 'bg-[#64748b] text-slate-200 shadow-[inset_1px_1px_0_#94a3b8]'
                    }`}
                  >
                    {soundEnabled && musicEnabled ? 'ON' : 'OFF'}
                  </span>
                </button>

                {/* Direct 1-Click Action Buttons: EASY & HARD */}
                <div className="grid grid-cols-2 gap-2">
                  {/* EASY BUTTON */}
                  <button
                    type="button"
                    onClick={() => handleSelectDifficultyAndStart('easy')}
                    className="py-2.5 px-2 bg-[#059669] hover:bg-[#10b981] border-2 border-black shadow-[inset_2px_2px_0_#6ee7b7,inset_-2px_-2px_0_#064e3b,0_3px_0_#000000] active:translate-y-0.5 active:shadow-[inset_2px_2px_0_#6ee7b7,inset_-2px_-2px_0_#064e3b,0_1px_0_#000000] transition-transform flex flex-col items-center justify-center gap-0.5 cursor-pointer text-white"
                  >
                    <span className="font-black text-xs tracking-wider drop-shadow-[1px_1px_0_#000]">EASY</span>
                    <span className="text-[8.5px] font-bold text-[#a7f3d0] drop-shadow-[1px_1px_0_#064e3b]">1x HP</span>
                  </button>

                  {/* HARD BUTTON */}
                  <button
                    type="button"
                    onClick={() => handleSelectDifficultyAndStart('hard')}
                    className="py-2.5 px-2 bg-[#dc2626] hover:bg-[#ef4444] border-2 border-black shadow-[inset_2px_2px_0_#fca5a5,inset_-2px_-2px_0_#991b1b,0_3px_0_#000000] active:translate-y-0.5 active:shadow-[inset_2px_2px_0_#fca5a5,inset_-2px_-2px_0_#991b1b,0_1px_0_#000000] transition-transform flex flex-col items-center justify-center gap-0.5 cursor-pointer text-white"
                  >
                    <span className="font-black text-xs tracking-wider drop-shadow-[1px_1px_0_#000]">HARD</span>
                    <span className="text-[8.5px] font-bold text-[#fecdd3] drop-shadow-[1px_1px_0_#991b1b]">2x HP & ATK</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Authentic 16-Bit Pixel-Art Restart Confirmation Modal */}
          {showRestartModal && (
            <div className="absolute inset-0 z-30 bg-black/80 flex items-center justify-center p-3 animate-in fade-in duration-75">
              <div className="w-[230px] bg-[#0f172a] border-4 border-black p-3 shadow-[inset_2px_2px_0_#38bdf8,inset_-2px_-2px_0_#0284c7,0_6px_0_#000000] flex flex-col gap-2.5 font-mono text-white relative select-none">
                {/* Pixel Header */}
                <div className="bg-black/60 border-2 border-black p-1 text-center shadow-[inset_1px_1px_0_#334155]">
                  <h3 className="font-black text-[10.5px] text-[#fbbf24] tracking-widest drop-shadow-[1px_1px_0_#000]">
                    ★ RESTART RUN? ★
                  </h3>
                </div>

                <p className="text-[9px] sm:text-[9.5px] text-slate-300 text-center font-bold leading-tight">
                  Current score & campaign progress will be reset!
                </p>

                {/* YES & NO Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={handleConfirmRestart}
                    className="py-2 px-2 bg-[#dc2626] hover:bg-[#ef4444] border-2 border-black shadow-[inset_2px_2px_0_#fca5a5,inset_-2px_-2px_0_#991b1b,0_3px_0_#000000] active:translate-y-0.5 active:shadow-[inset_2px_2px_0_#fca5a5,inset_-2px_-2px_0_#991b1b,0_1px_0_#000000] transition-transform flex items-center justify-center cursor-pointer text-white font-black text-xs tracking-wider drop-shadow-[1px_1px_0_#000]"
                  >
                    ✔ YES
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRestartModal(false)}
                    className="py-2 px-2 bg-[#475569] hover:bg-[#64748b] border-2 border-black shadow-[inset_2px_2px_0_#94a3b8,inset_-2px_-2px_0_#334155,0_3px_0_#000000] active:translate-y-0.5 active:shadow-[inset_2px_2px_0_#94a3b8,inset_-2px_-2px_0_#334155,0_1px_0_#000000] transition-transform flex items-center justify-center cursor-pointer text-white font-black text-xs tracking-wider drop-shadow-[1px_1px_0_#000]"
                  >
                    ✖ NO
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Top Control Sub-Deck: Mode / Campaign / Restart */}
        <div className="mt-1 grid grid-cols-3 gap-1 sm:gap-1.5">
          {/* Mode Switch (AUTO / MANUAL) */}
          <div className="key-socket-dark !p-[2px] !rounded-[9px] flex">
            <button
              type="button"
              onClick={handleToggleMode}
              className="key-cap w-full py-1 sm:py-1.5 !rounded-[6px] font-mono text-center transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer select-none"
              title="Toggle between Auto-Pilot and Manual Control"
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

          {/* Game Mode (QUEST / CASUAL) */}
          <div className="key-socket-dark !p-[2px] !rounded-[9px] flex">
            <button
              type="button"
              onClick={handleToggleGameMode}
              className="key-cap w-full py-1 sm:py-1.5 !rounded-[6px] font-mono text-center transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer select-none"
              title="Toggle Game Mode (Campaign Quest vs Casual Mode)"
            >
              <Sword weight="bold" className={`text-xs shrink-0 ${gameMode === 'campaign' ? 'text-emerald-600' : 'text-purple-600'}`} />
              <span className="font-black text-[8px] sm:text-[8.5px] tracking-tight text-slate-800">
                {gameMode === 'campaign' ? 'QUEST' : 'CASUAL'}
              </span>
            </button>
          </div>

          {/* Restart Button */}
          <div className="key-socket-dark !p-[2px] !rounded-[9px] flex">
            <button
              type="button"
              onClick={handleResetClick}
              className="key-cap w-full py-1 sm:py-1.5 !rounded-[6px] font-mono text-center transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer select-none"
              title="Restart Run or Reset Game"
            >
              <ArrowClockwise weight="bold" className="text-xs text-sky-600 shrink-0" />
              <span className="font-black text-[8px] sm:text-[8.5px] tracking-tight text-slate-800">
                RESTART
              </span>
            </button>
          </div>
        </div>

        {/* Zone 2: 4-Bay Primary Hardware Action Controls (LEFT, RIGHT, JUMP, BLAST) */}
        <div className="mt-1">
          {/* 4 Precision Mechanical Action Sockets */}
          <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
            {/* Button 1: MOVE LEFT */}
            <div className="key-socket-dark !p-[2px] sm:!p-[2.5px] !rounded-[10px] sm:!rounded-[12px] flex">
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault()
                  handleMoveLeft(true)
                }}
                onPointerUp={() => handleMoveLeft(false)}
                onPointerLeave={() => handleMoveLeft(false)}
                className={`w-full py-1.5 sm:py-2 !rounded-[7px] sm:!rounded-[8px] font-mono text-center transition-all flex flex-col items-center justify-center gap-0.5 shadow-md cursor-pointer select-none ${
                  pressedKeys.left
                    ? 'key-cap-active translate-y-0.5 shadow-inner bg-slate-200'
                    : 'key-cap active:scale-95'
                }`}
                title="Move Left / Backward (A key or Left Arrow)"
              >
                <div className="flex items-center gap-0.5 sm:gap-1 font-black text-[9px] sm:text-[11px] tracking-tight text-slate-900">
                  <span className="text-[10px] sm:text-xs">◀</span>
                  <span>LEFT</span>
                </div>
                <span className="text-[6.5px] sm:text-[7.5px] font-bold text-slate-500 tracking-tight font-mono">
                  [A/←]
                </span>
              </button>
            </div>

            {/* Button 2: MOVE RIGHT */}
            <div className="key-socket-dark !p-[2px] sm:!p-[2.5px] !rounded-[10px] sm:!rounded-[12px] flex">
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault()
                  handleMoveRight(true)
                }}
                onPointerUp={() => handleMoveRight(false)}
                onPointerLeave={() => handleMoveRight(false)}
                className={`w-full py-1.5 sm:py-2 !rounded-[7px] sm:!rounded-[8px] font-mono text-center transition-all flex flex-col items-center justify-center gap-0.5 shadow-md cursor-pointer select-none ${
                  pressedKeys.right
                    ? 'key-cap-active translate-y-0.5 shadow-inner bg-slate-200'
                    : 'key-cap active:scale-95'
                }`}
                title="Move Right / Forward (D key or Right Arrow)"
              >
                <div className="flex items-center gap-0.5 sm:gap-1 font-black text-[9px] sm:text-[11px] tracking-tight text-slate-900">
                  <span>RIGHT</span>
                  <span className="text-[10px] sm:text-xs">▶</span>
                </div>
                <span className="text-[6.5px] sm:text-[7.5px] font-bold text-slate-500 tracking-tight font-mono">
                  [D/→]
                </span>
              </button>
            </div>

            {/* Button 3: Primary JUMP Keycap */}
            <div className="key-socket-dark !p-[2px] sm:!p-[2.5px] !rounded-[10px] sm:!rounded-[12px] flex">
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault()
                  setPressedKeys((p) => ({ ...p, jump: true }))
                  handleJumpClick()
                }}
                onPointerUp={() => setPressedKeys((p) => ({ ...p, jump: false }))}
                onPointerLeave={() => setPressedKeys((p) => ({ ...p, jump: false }))}
                className={`key-cap-terracotta w-full py-1.5 sm:py-2 !rounded-[7px] sm:!rounded-[8px] font-mono text-center transition-all flex flex-col items-center justify-center gap-0.5 shadow-lg cursor-pointer select-none ${
                  pressedKeys.jump ? 'translate-y-0.5 shadow-inner brightness-90' : 'active:scale-95'
                }`}
                title="Click to jump! (Spacebar / W / Up Arrow)"
              >
                <div className="flex items-center gap-0.5 sm:gap-1 font-black text-[9px] sm:text-[11px] tracking-wide text-white">
                  <PawPrint weight="fill" className="text-amber-200 text-[10px] sm:text-xs shrink-0" />
                  <span>HOP</span>
                </div>
                <span className="text-[6.5px] sm:text-[7.5px] font-bold text-amber-100/90 tracking-tight font-mono">
                  [space]
                </span>
              </button>
            </div>

            {/* Button 4: Primary FIRE Keycap */}
            <div className="key-socket-dark !p-[2px] sm:!p-[2.5px] !rounded-[10px] sm:!rounded-[12px] flex">
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault()
                  setPressedKeys((p) => ({ ...p, fire: true }))
                  handleShootClick()
                }}
                onPointerUp={() => setPressedKeys((p) => ({ ...p, fire: false }))}
                onPointerLeave={() => setPressedKeys((p) => ({ ...p, fire: false }))}
                className={`key-cap-cobalt w-full py-1.5 sm:py-2 !rounded-[7px] sm:!rounded-[8px] font-mono text-center transition-all flex flex-col items-center justify-center gap-0.5 shadow-lg cursor-pointer select-none ${
                  pressedKeys.fire ? 'translate-y-0.5 shadow-inner brightness-90' : 'active:scale-95'
                }`}
                title="Fire blaster at enemies & bosses! (Left Click / J / F / Enter)"
              >
                <div className="flex items-center gap-0.5 sm:gap-1 font-black text-[9px] sm:text-[11px] tracking-wide text-white">
                  <Crosshair weight="bold" className="text-cyan-200 text-[10px] sm:text-xs shrink-0" />
                  <span>BLAST</span>
                </div>
                <span className="text-[6.5px] sm:text-[7.5px] font-bold text-cyan-100/90 tracking-tight font-mono">
                  [click/J]
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
