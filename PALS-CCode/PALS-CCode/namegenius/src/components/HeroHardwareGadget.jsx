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

// Skeuomorphic Knurled Stadium Toggle Switch (Vibrant Emerald LED ON state + High-contrast status badge)
function SkeuoTactileSwitch({ checked, onChange, label, title, icon: Icon, mutedIcon: MutedIcon }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        title={title}
        className="relative w-[46px] sm:w-[50px] h-[24px] sm:h-[26px] rounded-full p-[2px] cursor-pointer select-none transition-all active:scale-95 focus:outline-none flex items-center shadow-md group"
        style={{
          background: checked
            ? 'linear-gradient(180deg, #10b981 0%, #059669 45%, #047857 100%)'
            : 'linear-gradient(180deg, #1e293b 0%, #0f172a 60%, #020617 100%)',
          boxShadow: checked
            ? 'inset 0 1.5px 3px rgba(0,0,0,0.35), inset 0 -1px 2px rgba(255,255,255,0.6), 0 0 10px rgba(16,185,129,0.55), 0 1px 3px rgba(0,0,0,0.3)'
            : 'inset 0 2px 4px rgba(0,0,0,0.85), inset 0 -1px 1px rgba(255,255,255,0.08), 0 1px 3px rgba(0,0,0,0.3)',
          border: checked ? '1.5px solid #34d399' : '1.5px solid #334155',
        }}
      >
        {/* Recessed slider track */}
        <div
          className="w-full h-full rounded-full relative flex items-center overflow-hidden"
          style={{
            background: checked ? '#064e3b' : '#090d16',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)',
          }}
        >
          {/* Active LED power glow streak */}
          {checked && (
            <div className="absolute left-1.5 flex items-center gap-0.5 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 led-glow-emerald" />
              <span className="font-mono text-[7px] font-black text-emerald-300 tracking-tighter">ON</span>
            </div>
          )}
          {!checked && (
            <div className="absolute right-1.5 flex items-center pointer-events-none">
              <span className="font-mono text-[6.5px] font-black text-slate-500 tracking-tighter">OFF</span>
            </div>
          )}

          {/* High-Gloss Anodized Chrome Stadium Slider Knob */}
          <div
            className="absolute top-[2px] bottom-[2px] w-[18px] sm:w-[20px] rounded-full transition-all duration-200 flex items-center justify-center shadow-lg"
            style={{
              left: checked ? 'calc(100% - 20px)' : '2px',
              background: checked
                ? 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%)'
                : 'linear-gradient(180deg, #64748b 0%, #334155 60%, #1e293b 100%)',
              border: checked ? '1px solid rgba(255,255,255,0.9)' : '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.9)',
            }}
          >
            {/* Center LED Dot on knob */}
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                checked
                  ? 'bg-emerald-500 led-glow-emerald border border-emerald-300'
                  : 'bg-slate-700 border border-slate-600'
              }`}
            />
          </div>
        </div>
      </button>

      {/* Label and Status Pill under Switch */}
      <div className="flex items-center gap-1">
        <span className="font-mono text-[9px] sm:text-[9.5px] font-black uppercase tracking-wider text-slate-950">
          {label}
        </span>
        <span
          className={`font-mono text-[7px] sm:text-[7.5px] font-black px-1 py-[0.5px] rounded tracking-tight ${
            checked
              ? 'bg-emerald-500/20 text-emerald-950 border border-emerald-600/40'
              : 'bg-slate-900/10 text-slate-600 border border-slate-700/30'
          }`}
        >
          {checked ? 'ON' : 'OFF'}
        </span>
      </div>
    </div>
  )
}

// Skeuomorphic Hardware Rotary Volume Knob (White/Silver + 300° Continuous Rotation)
function SkeuoVolumeKnob({ volume = 0.75, onChange }) {
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
    <div className="flex flex-col items-center gap-1">
      <div
        role="slider"
        aria-valuenow={Math.round(volume * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onClick={handleClickStep}
        onPointerDown={handlePointerDown}
        title={`Hardware Volume: ${Math.round(volume * 100)}% (Click to step or drag up/down)`}
        className="w-[30px] sm:w-[32px] h-[30px] sm:h-[32px] rounded-full p-[2px] cursor-ns-resize select-none relative shadow-md transition-transform active:scale-95"
        style={{
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 60%, #020617 100%)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.3)',
          border: '1.5px solid #334155',
        }}
      >
        {/* Rotating Knurled Cap with Pointer Notch */}
        <div
          className="w-full h-full rounded-full flex items-center justify-center relative transition-transform duration-75"
          style={{
            transform: `rotate(${deg}deg)`,
            background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #64748b 100%)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.45), inset 0 1px 1.5px rgba(255,255,255,0.95)',
            border: '1px solid #64748b',
          }}
        >
          {/* Pointer Notch */}
          <div className="absolute top-[2px] w-[2px] h-[5px] rounded-full bg-slate-950 shadow-xs" />
          {/* Center Rivet */}
          <div className="w-2 h-2 rounded-full bg-slate-800/80 border border-slate-600/60 shadow-inner" />
        </div>
      </div>
      <div className="flex items-center gap-0.5">
        <span className="font-mono text-[9px] sm:text-[9.5px] font-black uppercase tracking-wider text-slate-950">
          VOL
        </span>
        <span className="font-mono text-[7px] sm:text-[7.5px] font-black px-1 py-[0.5px] rounded bg-slate-900/10 text-slate-800 border border-slate-700/30">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  )
}

export default function HeroHardwareGadget({ onInteractWithConsole }) {
  const [isAutoMode, setIsAutoMode] = useState(true)
  const [gameMode, setGameMode] = useState('campaign')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [musicEnabled, setMusicActive] = useState(false)
  const [volume, setVolume] = useState(() => getMasterVolume() || 0.75)
  const [confettiBursts, setConfettiBursts] = useState([])
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
      engineRef.current.jump()
    }
  }

  const handleShootClick = () => {
    if (soundEnabled) playMechanicalClick('click')
    if (engineRef.current && engineRef.current.shoot) {
      engineRef.current.shoot()
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
    if (soundEnabled) playMechanicalClick('heavy')
    if (engineRef.current) {
      engineRef.current.restart()
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
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 h-10 w-4/5 rounded-full bg-black/35 blur-xl pointer-events-none" />

      {/* Main Molded Plastic Chassis (Candy Purple) */}
      <div className="skeuo-chassis-purple relative p-3.5 sm:p-5 shadow-2xl animate-float-subtle">
        {/* Left Side: Industrial Woven Flight Ribbon Tag */}
        <div className="absolute -left-4 sm:-left-5 top-1/3 -translate-y-1/2 flex items-center z-20 pointer-events-auto">
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

        {/* 4 Corner Screws for Hardware Authenticity */}
        <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 rounded-full bg-purple-950/80 border border-purple-400/40 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-[0.5px] bg-purple-300/80" />
        </div>
        <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-purple-950/80 border border-purple-400/40 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-[0.5px] bg-purple-300/80 rotate-90" />
        </div>
        <div className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 rounded-full bg-purple-950/80 border border-purple-400/40 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-[0.5px] bg-purple-300/80 rotate-45" />
        </div>
        <div className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-purple-950/80 border border-purple-400/40 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-[0.5px] bg-purple-300/80 -rotate-45" />
        </div>

        {/* Top Header: Left Speaker Mesh + Title, Right: Volume Knob + SFX Switch + Music Switch */}
        <div className="flex items-center justify-between px-1 pb-2.5 border-b border-purple-400/30 gap-2">
          {/* Left: Expanded 7x3 Perforated Acoustic Speaker Mesh pushing NG badge right */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div
              className="grid grid-cols-7 gap-[3px] p-1.5 sm:p-2 rounded-lg bg-purple-950/60 border border-purple-300/40 shadow-inner shrink-0"
              title="Acoustic 8-Bit Speaker Chamber"
            >
              {Array.from({ length: 21 }).map((_, i) => (
                <div key={i} className="speaker-grille-dot !w-[3.5px] !h-[3.5px] !bg-purple-950" />
              ))}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-950 text-[9.5px] font-black text-white shadow-inner border border-slate-700">
                <span>NG</span>
              </div>
              <div className="leading-tight">
                <div className="font-mono text-[10px] sm:text-[10.5px] font-black tracking-wider text-slate-950 uppercase">
                  NG-01 POCKET
                </div>
                <div className="font-mono text-[7.5px] sm:text-[8px] font-bold text-purple-950/75 uppercase tracking-wide">
                  DOMAIN ENGINE
                </div>
              </div>
            </div>
          </div>

          {/* Right: 3 UI Controls: Volume Rotary Knob + SFX Switch + MUSIC Switch */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
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

        {/* Zone 1: Recessed Screen Housing with Expanded Tamagotchi Mini Game Engine */}
        <div className="screen-recess mt-3 p-1.5 sm:p-2 rounded-2xl bg-slate-950 text-white relative shadow-inner">
          <div className="gloss-sheen" />
          <DomainGameEngine
            ref={engineRef}
            isAutoMode={isAutoMode}
            gameMode={gameMode}
            onToggleAutoMode={setIsAutoMode}
            onToggleGameMode={setGameMode}
            soundEnabled={soundEnabled}
            onMilestone={handleMilestone}
          />
        </div>

        {/* Zone 2: 5-Button Physical Hardware Controls Deck */}
        <div className="mt-3.5 pt-0.5">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="font-mono text-[8px] sm:text-[8.5px] font-bold text-purple-950/70 uppercase tracking-wider">
              NG-01 TACTILE DECK
            </span>
            <span className="font-mono text-[8px] sm:text-[8.5px] font-bold text-purple-950/80 uppercase tracking-wider">
              4-BAY HARDWARE CONTROLS
            </span>
          </div>

          {/* 4 Precision Mechanical Hardware Sockets */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {/* Button 1: Mode Switch (AUTO / MANUAL) */}
            <div className="key-socket-dark !p-[3px] !rounded-[14px] flex">
              <button
                type="button"
                onClick={handleToggleMode}
                className="key-cap w-full py-2 sm:py-2.5 !rounded-[10px] font-mono text-center transition-all flex flex-col items-center justify-center gap-0.5 active:scale-95 cursor-pointer select-none"
                title="Toggle between Auto-Pilot and Manual Control"
              >
                <div className="flex items-center gap-1 font-black text-[9.5px] sm:text-[10.5px] tracking-tight text-slate-800">
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full transition-colors ${
                      isAutoMode
                        ? 'bg-amber-400 shadow-sm border border-amber-500/60'
                        : 'bg-emerald-500 led-glow-emerald border border-emerald-600/60'
                    }`}
                  />
                  <span>{isAutoMode ? 'AUTO' : 'MAN'}</span>
                </div>
                <span className="text-[7px] sm:text-[7.5px] font-bold text-slate-500 tracking-widest uppercase">
                  MODE
                </span>
              </button>
            </div>

            {/* Button 2: Primary JUMP Keycap */}
            <div className="key-socket-dark !p-[3px] !rounded-[14px] flex">
              <button
                type="button"
                onClick={handleJumpClick}
                onPointerDown={(e) => {
                  e.preventDefault()
                  handleJumpClick()
                }}
                className="key-cap-terracotta w-full py-2 sm:py-2.5 !rounded-[10px] font-mono text-center transition-all flex flex-col items-center justify-center gap-0.5 shadow-lg active:scale-95 cursor-pointer select-none"
                title="Click to jump! (Spacebar / Up Arrow)"
              >
                <div className="flex items-center gap-1 font-black text-[10px] sm:text-[11px] tracking-wide text-white">
                  <PawPrint weight="fill" className="text-amber-200 text-xs shrink-0" />
                  <span>JUMP</span>
                </div>
                <span className="text-[6.5px] sm:text-[7.5px] font-bold text-amber-200/90 tracking-tight font-mono">
                  [space]
                </span>
              </button>
            </div>

            {/* Button 3: Primary FIRE Keycap */}
            <div className="key-socket-dark !p-[3px] !rounded-[14px] flex">
              <button
                type="button"
                onClick={handleShootClick}
                onPointerDown={(e) => {
                  e.preventDefault()
                  handleShootClick()
                }}
                className="key-cap-cobalt w-full py-2 sm:py-2.5 !rounded-[10px] font-mono text-center transition-all flex flex-col items-center justify-center gap-0.5 shadow-lg active:scale-95 cursor-pointer select-none"
                title="Fire blaster at enemies & bosses! (Left Click / F / X / Enter key)"
              >
                <div className="flex items-center gap-1 font-black text-[10px] sm:text-[11px] tracking-wide text-white">
                  <Crosshair weight="bold" className="text-cyan-200 text-xs shrink-0" />
                  <span>FIRE</span>
                </div>
                <span className="text-[6.5px] sm:text-[7px] font-bold text-cyan-200/90 tracking-tight font-mono">
                  [left click]
                </span>
              </button>
            </div>

            {/* Socket 4: Split Dual Keycap (Top: Mode/Quest, Bottom: Reset) */}
            <div className="key-socket-dark !p-[3px] !rounded-[14px] flex flex-col justify-between gap-[3px] h-full">
              {/* Top Half: Game Mode Toggle (QUEST / CASUAL) */}
              <button
                type="button"
                onClick={handleToggleGameMode}
                className="key-cap text-slate-800 font-bold w-full py-1 sm:py-1.5 !rounded-t-[10px] !rounded-b-[4px] font-mono text-center transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer select-none shadow-sm flex-1"
                title="Toggle Game Mode (Campaign Quest vs Casual Mode)"
              >
                <Sword weight="bold" className={`text-[10px] sm:text-xs shrink-0 ${gameMode === 'campaign' ? 'text-emerald-600' : 'text-purple-600'}`} />
                <span className="font-black text-[8px] sm:text-[9.5px] tracking-tight text-slate-800">
                  {gameMode === 'campaign' ? 'QUEST' : 'CASUAL'}
                </span>
              </button>

              {/* Bottom Half: Dedicated Reset Button */}
              <button
                type="button"
                onClick={handleResetClick}
                className="key-cap text-slate-800 font-bold w-full py-1 sm:py-1.5 !rounded-b-[10px] !rounded-t-[4px] font-mono text-center transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer select-none shadow-sm flex-1"
                title="Restart Run or Reset Game"
              >
                <ArrowClockwise weight="bold" className="text-[10px] sm:text-xs text-sky-600 shrink-0" />
                <span className="font-black text-[8px] sm:text-[9.5px] tracking-tight text-slate-800">
                  RESET
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
