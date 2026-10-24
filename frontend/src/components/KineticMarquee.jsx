import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/motion'

/**
 * Two rows of giant comic type sliding in opposite directions. Scrolling
 * kicks them faster (in your scroll direction) and skews the letters, like
 * the page is whipping past on a web-swing. Runs a rAF loop only while the
 * band is on screen; static under reduced motion.
 */
export default function KineticMarquee({ rows }) {
  const bandRef = useRef(null)
  const trackRefs = useRef([])

  useEffect(() => {
    const band = bandRef.current
    if (!band || prefersReducedMotion()) return undefined

    const tracks = trackRefs.current.filter(Boolean)
    const offsets = tracks.map(() => 0)
    let visible = false
    let raf = 0
    let lastY = window.scrollY
    let velocity = 0
    let skew = 0
    let last = performance.now()

    const frame = (now) => {
      const dt = Math.min(64, now - last) / 16.67
      last = now
      const y = window.scrollY
      const dy = y - lastY
      lastY = y
      // Ease velocity toward the latest scroll delta, then let it decay.
      velocity += (dy - velocity) * 0.2
      skew += (Math.max(-12, Math.min(12, velocity * 0.4)) - skew) * 0.15

      tracks.forEach((t, i) => {
        const dir = i % 2 ? 1 : -1
        const speed = (0.6 + Math.min(14, Math.abs(velocity)) * 0.55) * dt
        const scrollDir = velocity < -0.5 ? -1 : 1
        offsets[i] += dir * speed * scrollDir
        const half = t.scrollWidth / 2
        if (half > 0) offsets[i] = ((offsets[i] % half) - half) % half
        t.style.transform = `translate3d(${offsets[i]}px,0,0) skewX(${-skew * dir}deg)`
      })
      if (visible) raf = requestAnimationFrame(frame)
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      cancelAnimationFrame(raf)
      if (visible) {
        last = performance.now()
        lastY = window.scrollY
        raf = requestAnimationFrame(frame)
      }
    })
    io.observe(band)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="kinetic" ref={bandRef} aria-hidden="true">
      {rows.map((words, i) => (
        <div key={i} className={`kinetic-row kinetic-row--${i % 2 ? 'b' : 'a'}`}>
          <div className="kinetic-track" ref={(el) => (trackRefs.current[i] = el)}>
            {[0, 1].map((copy) =>
              words.map((w, j) => (
                <span key={`${copy}-${j}`} className={`kinetic-word${j % 2 ? ' is-outline' : ''}`}>
                  {w}
                  <span className="kinetic-star">✦</span>
                </span>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
