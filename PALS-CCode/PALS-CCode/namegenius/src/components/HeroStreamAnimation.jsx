import React, { useEffect, useRef } from 'react'
import { animate } from 'animejs'

const DOMAIN_STREAMS = [
  { name: 'northwind', tld: '.com', status: 'available', speed: 6000, y: 14, delay: 0 },
  { name: 'cadence', tld: '.ai', status: 'available', speed: 6000, y: 38, delay: 1500 },
  { name: 'linear', tld: '.app', status: 'taken', speed: 6000, y: 62, delay: 3000 },
  { name: 'lumen', tld: '.io', status: 'available', speed: 6000, y: 84, delay: 4500 },
]

export default function HeroStreamAnimation() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const cardElements = containerRef.current.querySelectorAll('.flying-domain-card')
    const activeAnimations = []

    const containerWidth = containerRef.current.offsetWidth || 1150
    // Center launch origin
    const centerSpawnX = Math.round(containerWidth * 0.44)
    // End position inside the container so cards fade to 0 opacity before clipping
    const endX = Math.round(containerWidth * 0.94)

    cardElements.forEach((el, i) => {
      const config = DOMAIN_STREAMS[i]
      if (!config) return

      try {
        // Horizontal flight: Launches from center, stays visible across hero, then drops opacity very fast right at the end
        const mainAnim = animate(el, {
          translateX: [centerSpawnX, endX],
          opacity: [
            { to: 0, duration: 0 },
            { to: 1, duration: config.speed * 0.15, ease: 'outQuad' },
            { to: 1, duration: config.speed * 0.72 },
            { to: 0, duration: config.speed * 0.13, ease: 'inQuad' },
          ],
          scale: [
            { to: 0.85, duration: 0 },
            { to: 1, duration: config.speed * 0.15, ease: 'outQuad' },
            { to: 1, duration: config.speed * 0.72 },
            { to: 0.94, duration: config.speed * 0.13, ease: 'inQuad' },
          ],
          duration: config.speed,
          delay: config.delay,
          loop: true,
          ease: 'linear',
        })

        activeAnimations.push(mainAnim)

        // Subtle gentle vertical float
        const bobAnim = animate(el, {
          translateY: ['-5px', '5px'],
          duration: 2000 + i * 400,
          alternate: true,
          loop: true,
          ease: 'inOutSine',
        })
        activeAnimations.push(bobAnim)
      } catch (err) {
        console.warn('HeroStream animation error:', err)
      }
    })

    return () => {
      activeAnimations.forEach((anim) => {
        try {
          if (anim && typeof anim.pause === 'function') anim.pause()
        } catch (_) {}
      })
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* Floating Animated Domain Capsules (3 to 4 staggered in flight) */}
      <div className="relative h-full w-full">
        {DOMAIN_STREAMS.map((item) => (
          <div
            key={item.name}
            className="flying-domain-card absolute left-0 flex items-center will-change-transform opacity-0"
            style={{ top: `${item.y}%` }}
          >
            {/* Smooth Multi-Streak Jet Stream: Main trail + extra disappearing mini trails */}
            <div className="flex flex-col items-end -mr-1.5 pointer-events-none select-none">
              {/* Upper offset mini trail */}
              <div className="h-[1.5px] w-14 sm:w-24 bg-gradient-to-r from-transparent via-sky-300/30 to-blue-400/50 rounded-full mb-1 opacity-75" />
              {/* Main central high-speed trail */}
              <div className="h-1 sm:h-1.5 w-28 sm:w-44 bg-gradient-to-r from-transparent via-sky-400/35 via-blue-500/65 to-blue-600 rounded-l-full" />
              {/* Lower offset mini trail */}
              <div className="h-[1.5px] w-10 sm:w-18 bg-gradient-to-r from-transparent via-blue-300/20 to-blue-500/40 rounded-full mt-1 opacity-60" />
            </div>

            {/* Tactile Skeuomorphic Domain Pill Card with Specular Gloss Sheen */}
            <div className="relative flex items-center gap-2 rounded-2xl border border-slate-300/90 bg-white/95 backdrop-blur-md px-3.5 py-1.5 shadow-[0_6px_18px_rgba(15,23,42,0.12)] overflow-hidden">
              {/* Diagonal Gloss Sheen reflection */}
              <div className="gloss-sheen" />

              <span
                className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                  item.status === 'available'
                    ? 'bg-emerald-500 led-glow-emerald'
                    : 'bg-amber-500 led-glow-amber'
                }`}
              />
              <span className="font-sans text-sm font-black tracking-tight text-slate-900 deboss-light">
                {item.name}
              </span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-bold text-blue-600 border border-slate-200">
                {item.tld}
              </span>
              <span
                className={`hidden sm:inline-block font-mono text-[9px] uppercase font-bold ${
                  item.status === 'available' ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {item.status === 'available' ? 'Available' : 'Taken'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
