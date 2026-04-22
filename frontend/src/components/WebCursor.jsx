import { useEffect, useRef, useState } from 'react'

/**
 * Spider-style cursor: a small dot follows the pointer, a short trailing
 * web line connects recent positions. On click, a thin "web shot" extends
 * outward briefly. Scales up when hovering interactive elements.
 */
export default function WebCursor() {
  const dotRef = useRef(null)
  const trailRef = useRef(null)
  const shotRef = useRef(null)
  const posRef = useRef({ x: 0, y: 0 })
  const trailRef2 = useRef([])
  const rafRef = useRef(0)
  const [enabled] = useState(() => {
    if (typeof window === 'undefined') return false
    return (
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  })

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-web-cursor')
    return () => document.documentElement.classList.remove('has-web-cursor')
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY }
      const t = trailRef2.current
      t.push({ x: e.clientX, y: e.clientY })
      if (t.length > 10) t.shift()

      const dot = dotRef.current
      if (dot && !dot.classList.contains('is-ready')) {
        dot.classList.add('is-ready')
      }

      const target = e.target
      const interactive = target.closest?.(
        'a, button, [role="button"], input, textarea, .project-card, .skill-pill, .social-link'
      )
      dot?.classList.toggle('is-hot', !!interactive)
    }

    const onDown = (e) => {
      const el = shotRef.current
      if (!el) return
      const len = 120
      el.style.left = `${e.clientX}px`
      el.style.top = `${e.clientY}px`
      el.style.setProperty('--shot-len', `${len}px`)
      el.classList.remove('is-firing')
      // force reflow so the animation restarts
      void el.offsetWidth
      el.classList.add('is-firing')
    }

    const tick = () => {
      const { x, y } = posRef.current
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      }
      const t = trailRef2.current
      if (trailRef.current && t.length > 1) {
        const pts = t.map((p) => `${p.x},${p.y}`).join(' ')
        trailRef.current.setAttribute('points', pts)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <svg className="web-cursor-trail" aria-hidden="true">
        <polyline
          ref={trailRef}
          fill="none"
          stroke="rgba(240,238,255,0.55)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div ref={dotRef} className="web-cursor-dot" aria-hidden="true" />
      <div ref={shotRef} className="web-cursor-shot" aria-hidden="true" />
    </>
  )
}
