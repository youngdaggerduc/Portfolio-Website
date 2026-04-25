import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Spider-style swinging character. Renders via a portal to <body> so
 * ancestor clip-paths (section reveal animation) never hide it.
 *
 * Trajectory:
 *  - Starts off-screen top-left when the About section enters the viewport
 *  - Swings across, bobbing on a pendulum arc, to off-screen top-right
 *  - Opacity is 1 for the main middle of the traversal, fades in/out at edges
 *
 * Web line:
 *  - Anchored to the red comic-divider immediately above the section
 *  - Endpoint measured from the actual top-right corner of the <img>
 *    via getBoundingClientRect, so it lands precisely where the gif's
 *    web strand originates regardless of rotation
 */
export default function SwingingSpood({ sectionRef }) {
  const imgRef = useRef(null)
  const [state, setState] = useState({
    visible: false,
    charLeftPct: -25,
    charTop: 110,
    rot: -10,
    anchorY: 0,
    webEndX: 0,
    webEndY: 0,
    opacity: 1,
  })
  const [reduced] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    if (reduced) return
    const section = sectionRef?.current
    if (!section) return

    let raf = 0
    const update = () => {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      const vw = window.innerWidth || document.documentElement.clientWidth
      const total = rect.height + vh
      const scrolled = vh - rect.top
      const p = Math.max(0, Math.min(1, scrolled / total))

      // Compress the swing into the first 80% of section progress
      const t = Math.min(1, p / 0.8)

      // L → R traversal. Start off-screen left at t=0, end off-screen right at t=1.
      const charLeftPct = -22 + t * 140

      // Pendulum bob — a few complete arcs across the traversal
      const bob = Math.sin(t * Math.PI * 2.4) * 22
      const charTop = 100 + bob

      // Rotate body along the arc, tilted forward as he picks up speed
      const rot = Math.cos(t * Math.PI * 2.4) * 26 - 4

      // Visible whenever the section is in play and the swing isn't done
      let opacity = 1
      if (p > 0 && t < 0.98) {
        // Quick fade in (first 4% of section), hold, fade out at end
        const fadeIn = Math.min(1, p / 0.04)
        const fadeOut = t > 0.9 ? Math.max(0, (0.98 - t) / 0.08) : 1
        opacity = fadeIn * fadeOut
      }

      // Web endpoint: actual top-right pixel of the gif (transform-origin is top-right)
      const img = imgRef.current
      let webEndX = (charLeftPct / 100) * vw + 180 // pre-measure fallback
      let webEndY = charTop + 4
      if (img) {
        const r = img.getBoundingClientRect()
        webEndX = r.right
        webEndY = r.top + 4
      }

      // Web anchor: vertical center of the red divider above the section
      let anchorY = 0
      const divider = section.previousElementSibling
      if (divider) {
        const d = divider.getBoundingClientRect()
        anchorY = d.top + d.height / 2
      }

      setState({
        visible: opacity > 1,
        charLeftPct,
        charTop,
        rot,
        anchorY,
        webEndX,
        webEndY,
        opacity,
      })
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
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
    }
  }, [reduced, sectionRef])

  if (reduced || typeof document === 'undefined') return null

  const node = (
    <div
      className="swing-zone"
      aria-hidden="true"
      style={{
        opacity: state.opacity,
        visibility: state.visible ? 'visible' : 'hidden',
      }}
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
          x1="42%"
          y1={state.anchorY}
          x2={state.webEndX}
          y2={state.webEndY}
          stroke="rgba(240,238,255,0.95)"
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#webGlow)"
        />
      </svg>
      <img
        ref={imgRef}
        className="swing-char"
        src="/spoodswing.gif"
        alt=""
        decoding="async"
        style={{
          left: `${state.charLeftPct}%`,
          top: `${state.charTop}px`,
          transform: `rotate(${state.rot}deg)`,
        }}
      />
    </div>
  )

  return createPortal(node, document.body)
}
