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

// Skeuomorphic Knurled Stadium Toggle Switch (White ON active state + scaled up)
function SkeuoTactileSwitch({ checked, onChange, label, title }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        title={title}
        className="relative w-[44px] sm:w-[48px] h-[24px] sm:h-[26px] rounded-full p-[2px] cursor-pointer select-none transition-all active:scale-95 focus:outline-none flex items-center shadow-md"
        style={{
          background: checked
            ? 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 45%, #cbd5e1 100%)'
            : 'linear-gradient(180deg, #1e293b 0%, #0f172a 60%, #020617 100%)',
          boxShadow: checked
            ? 'inset 0 1.5px 3px rgba(0,0,0,0.35), inset 0 -1.5px 2px rgba(255,255,255,0.9), 0 0 10px rgba(255,255,255,0.7), 0 1px 3px rgba(0,0,0,0.3)'
            : 'inset 0 2px 4px rgba(0,0,0,0.85), inset 0 -1px 1px rgba(255,255,255,0.08), 0 1px 3px rgba(0,0,0,0.3)',
          border: checked ? '1.5px solid #ffffff' : '1.5px solid #334155',
        }}
      >
        {/* Recessed slider track */}
        <div
          className="w-full h-full rounded-full relative flex items-center"
          style={{
            background: checked ? '#f8fafc' : '#090d16',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          {/* High-Gloss Anodized Chrome Stadium Slider Knob */}
          <div
            className="absolute top-[2px] bottom-[2px] w-[18px] sm:w-[20px] rounded-full transition-all duration-200 flex items-center justify-center shadow-lg"
            style={{
              left: checked ? 'calc(100% - 20px)' : '2px',
              background: checked
                ? 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%)'
                : 'linear-gradient(180deg, #64748b 0%, #334155 60%, #1e293b 100%)',
              border: '1px solid rgba(255,255,255,0.6)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.9)',
            }}
          >
            {/* Knurled Grip Ridges */}
            <div className="flex gap-[2px]">
              <div className={`w-[1px] h-2.5 rounded-full ${checked ? 'bg-slate-400' : 'bg-slate-700'}`} />
              <div className={`w-[1px] h-2.5 rounded-full ${checked ? 'bg-slate-400' : 'bg-slate-700'}`} />
            </div>
          </div>
        </div>
      </button>

      {/* Label under Switch */}
      <span className="font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-950">
        {label}
      </span>
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
      <span className="font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-950">
        VOL
      </span>
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
              5-KEY HARDWARE CONTROLS
            </span>
          </div>

          {/* 5 Precision Mechanical Hardware Keycaps */}
          <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
            {/* Button 1: Mode Switch (AUTO / MANUAL) */}
            <div className="key-socket-dark !p-0.5 !rounded-xl">
              <button
                type="button"
                onClick={handleToggleMode}
                className="key-cap w-full py-2 sm:py-2.5 rounded-lg font-mono text-center transition-all flex flex-col items-center justify-center gap-0.5 active:scale-95 cursor-pointer select-none"
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
            <div className="key-socket-dark !p-0.5 !rounded-xl">
              <button
                type="button"
                onClick={handleJumpClick}
                onPointerDown={(e) => {
                  e.preventDefault()
                  handleJumpClick()
                }}
                className="key-cap-terracotta w-full py-2 sm:py-2.5 rounded-lg font-mono text-center transition-all flex flex-col items-center justify-center gap-0.5 shadow-lg active:scale-95 cursor-pointer select-none"
                title="Click to jump! (Spacebar / Up Arrow)"
              >
                <div className="flex items-center gap-1 font-black text-[10px] sm:text-[11px] tracking-wide text-white">
                  <PawPrint weight="fill" className="text-amber-200 text-xs shrink-0" />
                  <span>JUMP</span>
                </div>
                <span className="text-[7px] sm:text-[7.5px] font-bold text-amber-200/80 tracking-widest uppercase">
                  HOP
                </span>
              </button>
            </div>

            {/* Button 3: Primary FIRE Keycap */}
            <div className="key-socket-dark !p-0.5 !rounded-xl">
              <button
                type="button"
                onClick={handleShootClick}
                onPointerDown={(e) => {
                  e.preventDefault()
                  handleShootClick()
                }}
                className="key-cap-cobalt w-full py-2 sm:py-2.5 rounded-lg font-mono text-center transition-all flex flex-col items-center justify-center gap-0.5 shadow-lg active:scale-95 cursor-pointer select-none"
                title="Fire blaster at enemies & bosses! (F / X / Enter key)"
              >
                <div className="flex items-center gap-1 font-black text-[10px] sm:text-[11px] tracking-wide text-white">
                  <Crosshair weight="bold" className="text-cyan-200 text-xs shrink-0" />
                  <span>FIRE</span>
                </div>
                <span className="text-[7px] sm:text-[7.5px] font-bold text-cyan-200/80 tracking-widest uppercase">
                  BLAST
                </span>
              </button>
            </div>

            {/* Button 4: Game Mode Toggle (CAMPAIGN QUEST / CASUAL) */}
            <div className="key-socket-dark !p-0.5 !rounded-xl">
              <button
                type="button"
                onClick={handleToggleGameMode}
                className="key-cap text-slate-800 font-bold w-full py-2 sm:py-2.5 rounded-lg font-mono text-center transition-all flex flex-col items-center justify-center gap-0.5 active:scale-95 cursor-pointer select-none"
                title="Toggle between Campaign (Combat & Bosses) and Casual Mode"
              >
                <div className="flex items-center gap-0.5 font-black text-[9.5px] sm:text-[10px] tracking-tight text-slate-800">
                  <Sword weight="bold" className={`text-xs shrink-0 ${gameMode === 'campaign' ? 'text-emerald-600' : 'text-purple-600'}`} />
                  <span>{gameMode === 'campaign' ? 'QUEST' : 'CASUAL'}</span>
                </div>
                <span className="text-[7px] sm:text-[7.5px] font-bold text-slate-500 tracking-widest uppercase">
                  {gameMode === 'campaign' ? 'STORY' : 'RELAX'}
                </span>
              </button>
            </div>

            {/* Button 5: Dedicated RESET / RETRY Keycap */}
            <div className="key-socket-dark !p-0.5 !rounded-xl">
              <button
                type="button"
                onClick={handleResetClick}
                className="key-cap text-slate-800 font-bold w-full py-2 sm:py-2.5 rounded-lg font-mono text-center transition-all flex flex-col items-center justify-center gap-0.5 active:scale-95 cursor-pointer select-none"
                title="Restart Run or Reset Game"
              >
                <div className="flex items-center gap-1 font-black text-[9.5px] sm:text-[10.5px] tracking-tight text-slate-800">
                  <ArrowClockwise weight="bold" className="text-xs text-sky-600 shrink-0" />
                  <span>RESET</span>
                </div>
                <span className="text-[7px] sm:text-[7.5px] font-bold text-slate-500 tracking-widest uppercase">
                  RETRY
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
