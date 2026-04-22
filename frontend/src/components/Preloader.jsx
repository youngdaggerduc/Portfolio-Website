import { useEffect, useState } from 'react'

/**
 * Shown until the window `load` event fires (with a small minimum hold
 * so the web-spin animation is visible). A web is drawn radially:
 * spokes first, then concentric strands, with the progress count
 * integrated beside the glyph.
 */
export default function Preloader() {
  const [progress, setProgress] = useState(0)
  const [gone, setGone] = useState(false)
  const [hiding, setHiding] = useState(false)

  useEffect(() => {
    const start = performance.now()
    const minMs = 1100
    let raf = 0

    const tick = () => {
      const elapsed = performance.now() - start
      const p = Math.min(1, elapsed / minMs)
      setProgress(p)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      const elapsed = performance.now() - start
      const wait = Math.max(0, minMs - elapsed)
      setTimeout(() => {
        setHiding(true)
        setTimeout(() => setGone(true), 650)
      }, wait)
    }
    // Prefer DOMContentLoaded so the hero video doesn't block dismissal.
    // Hard cap of 3s guarantees we never stall behind a slow resource.
    if (document.readyState !== 'loading') finish()
    else document.addEventListener('DOMContentLoaded', finish, { once: true })
    const hardCap = setTimeout(finish, 3000)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(hardCap)
      document.removeEventListener('DOMContentLoaded', finish)
    }
  }, [])

  if (gone) return null

  const spokes = 8
  const rings = 4
  const cx = 100
  const cy = 100
  const maxR = 90
  const spokeProgress = Math.min(1, progress * 2) // first half: spokes
  const ringProgress = Math.max(0, Math.min(1, progress * 2 - 1)) // second half: rings
  const activeSpokes = Math.floor(spokeProgress * spokes)
  const activeRings = ringProgress * rings

  const points = (r) =>
    Array.from({ length: spokes }, (_, i) => {
      const a = (i / spokes) * Math.PI * 2 - Math.PI / 2
      return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`
    }).join(' ')

  return (
    <div className={`preloader${hiding ? ' is-hiding' : ''}`} role="status" aria-live="polite">
      <svg className="preloader-web" viewBox="0 0 200 200">
        {Array.from({ length: spokes }).map((_, i) => {
          const a = (i / spokes) * Math.PI * 2 - Math.PI / 2
          const lit = i < activeSpokes
          return (
            <line
              key={`sp-${i}`}
              x1={cx}
              y1={cy}
              x2={cx + Math.cos(a) * maxR}
              y2={cy + Math.sin(a) * maxR}
              stroke={lit ? 'rgba(240,238,255,0.85)' : 'rgba(240,238,255,0.12)'}
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          )
        })}
        {Array.from({ length: rings }).map((_, i) => {
          const r = ((i + 1) / (rings + 1)) * maxR
          const shown = activeRings > i
          const partial = Math.max(0, Math.min(1, activeRings - i))
          return (
            <polygon
              key={`ri-${i}`}
              points={points(r)}
              fill="none"
              stroke={shown ? 'var(--cyan)' : 'rgba(0,212,255,0.08)'}
              strokeWidth="1.2"
              strokeDasharray="600"
              strokeDashoffset={shown ? 600 * (1 - partial) : 600}
              style={{ transition: 'stroke-dashoffset 0.25s ease' }}
            />
          )
        })}
        <circle cx={cx} cy={cy} r="3" fill="var(--red)" />
      </svg>
      <div className="preloader-label">
        <span className="preloader-title">PIERCE.EXE_</span>
        <span className="preloader-count">{String(Math.round(progress * 100)).padStart(3, '0')}%</span>
      </div>
    </div>
  )
}
