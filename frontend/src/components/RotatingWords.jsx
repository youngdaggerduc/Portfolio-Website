import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/motion'

/**
 * Cycles through `words`, slamming each one in letter-by-letter like a
 * comic sound effect. Pauses while off-screen or when the tab is hidden so
 * it never burns frames nobody can see. Screen readers get the full list
 * once instead of a live-updating word.
 */
export default function RotatingWords({ words, interval = 2300, className = '' }) {
  const ref = useRef(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion() || words.length < 2) return undefined
    let visible = true
    let timer = 0
    const tick = () => {
      if (visible && !document.hidden) setIndex((i) => (i + 1) % words.length)
    }
    timer = window.setInterval(tick, interval)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
    })
    if (ref.current) io.observe(ref.current)
    return () => {
      window.clearInterval(timer)
      io.disconnect()
    }
  }, [words.length, interval])

  const word = words[index]
  return (
    <span ref={ref} className={`rotating ${className}`}>
      <span className="sr-only">{words.join(', ')}</span>
      <span key={index} className="rotating-word" aria-hidden="true">
        {Array.from(word).map((ch, i) => (
          <span key={i} className="rotating-char" style={{ '--i': i }}>
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
      </span>
    </span>
  )
}
