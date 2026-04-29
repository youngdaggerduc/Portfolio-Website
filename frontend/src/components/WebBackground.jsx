import { useEffect, useRef, useState } from 'react'

/**
 * Three stacked layers of web patterns that drift with the mouse at
 * different speeds, creating depth. Fixed to the viewport, sits behind
 * all content. Uses a single rAF loop and transforms-only for perf.
 *
 * Skipped entirely on touch devices and small viewports — the parallax
 * is mouse-driven so it adds nothing on mobile, and three full-viewport
 * layers cost real paint on phone GPUs.
 */
export default function WebBackground() {
  const l1 = useRef(null)
  const l2 = useRef(null)
  const l3 = useRef(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const [enabled] = useState(() => {
    if (typeof window === 'undefined') return false
    return (
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      window.innerWidth > 900
    )
  })

  useEffect(() => {
    if (!enabled) return

    const onMove = (e) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    let raf = 0
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.06
      current.current.y += (target.current.y - current.current.y) * 0.06
      const { x, y } = current.current
      if (l1.current) l1.current.style.transform = `translate3d(${x * 6}px, ${y * 6}px, 0)`
      if (l2.current) l2.current.style.transform = `translate3d(${x * 14}px, ${y * 14}px, 0)`
      if (l3.current) l3.current.style.transform = `translate3d(${x * 26}px, ${y * 26}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="web-bg" aria-hidden="true">
      <div ref={l1} className="web-bg-layer web-bg-l1" />
      <div ref={l2} className="web-bg-layer web-bg-l2" />
      <div ref={l3} className="web-bg-layer web-bg-l3" />
    </div>
  )
}
