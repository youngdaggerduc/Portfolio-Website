import { useEffect, useState } from 'react'

/**
 * Spood swings across the viewport, pinned (position: fixed) while the
 * About section is in view. The web attaches to a point that tracks the
 * red comic-divider above — when the divider has scrolled off the top
 * of the viewport, the web line extends beyond the top edge, giving the
 * illusion he's still hanging from it.
 */
export default function SwingingSpood({ sectionRef }) {
  const [progress, setProgress] = useState(0)
  const [anchorY, setAnchorY] = useState(0)
  const [active, setActive] = useState(false)
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const section = sectionRef?.current
    if (!section) return

    // Track whether the About section is in view at all
    const io = new IntersectionObserver(
      (entries) => setActive(entries[0].isIntersecting),
      { threshold: 0, rootMargin: '120px 0px 0px 0px' }
    )
    io.observe(section)

    let raf = 0
    const update = () => {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      const total = rect.height + vh
      const scrolled = vh - rect.top
      const p = Math.max(0, Math.min(1, scrolled / total))
      setProgress(p)

      // Track the red divider above the section so the web connects to it
      const divider = section.previousElementSibling
      if (divider) {
        const d = divider.getBoundingClientRect()
        setAnchorY(d.top + d.height / 2)
      }
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
    }
  }, [sectionRef])

  if (reduced) return null

  // Swing happens quickly — compress into the first 85% of the section scroll
  const t = Math.min(1, progress / 0.85)
  const charXPct = -18 + t * 130              // viewport X: -18% → 112%
  const bobY = Math.sin(t * Math.PI * 3) * 14
  const charY = 110 + bobY                    // px from top of viewport (below nav)
  const rot = Math.cos(t * Math.PI * 3) * 22 - 6

  // Web anchor: the red divider's current Y in the viewport (may be negative when scrolled off)
  const anchorXPct = 42
  // Web endpoint: top-right area of the gif
  const webEndXPct = charXPct + 9
  const webEndY = charY + 6

  return (
    <div
      className={`swing-zone${active ? ' is-active' : ''}`}
      aria-hidden="true"
    >
      <svg className="swing-web-svg" preserveAspectRatio="none">
        <defs>
          <filter id="webGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <line
          x1={`${anchorXPct}%`}
          y1={anchorY}
          x2={`${webEndXPct}%`}
          y2={webEndY}
          stroke="rgba(240,238,255,0.9)"
          strokeWidth="1.8"
          strokeLinecap="round"
          filter="url(#webGlow)"
        />
      </svg>
      <img
        className="swing-char"
        src="/spoodhand.gif"
        alt=""
        decoding="async"
        style={{
          left: `${charXPct}%`,
          top: `${charY}px`,
          transform: `rotate(${rot}deg)`,
        }}
      />
    </div>
  )
}
