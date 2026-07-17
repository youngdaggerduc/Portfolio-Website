import { useEffect, useRef, useState } from 'react'

const GLYPHS = '!<>-_\\/[]{}=+*^?#01'

/**
 * Typewriter effect. Starts when the element enters the viewport, reveals the
 * string character-by-character, then a blinking caret stays.
 *
 * With `scramble`, unrevealed head characters flicker through random glyphs
 * and "lock in" left-to-right — the Spider-Comm "signal decoding" look. Falls
 * back to a plain typewriter when the user prefers reduced motion.
 */
export default function TypedText({
  text,
  speed = 55,
  startDelay = 350,
  showCaret = true,
  scramble = false,
  className = '',
  style,
}) {
  const ref = useRef(null)
  const [revealed, setRevealed] = useState(0)
  const [, forceTick] = useState(0)
  const [started, setStarted] = useState(
    () => typeof window !== 'undefined' && !('IntersectionObserver' in window)
  )

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const useScramble = scramble && !reduced

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const id = setTimeout(() => setStarted(true), startDelay)
          io.unobserve(el)
          return () => clearTimeout(id)
        }
      },
      { threshold: 0.5 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [startDelay])

  // Reveal one settled character every `speed` ms.
  useEffect(() => {
    if (!started) return
    if (revealed >= text.length) return
    const id = setTimeout(() => setRevealed((r) => r + 1), speed)
    return () => clearTimeout(id)
  }, [started, revealed, text.length, speed])

  // While decoding, re-randomize the scrambling head quickly.
  useEffect(() => {
    if (!useScramble || !started || revealed >= text.length) return
    const id = setInterval(() => forceTick((t) => t + 1), 32)
    return () => clearInterval(id)
  }, [useScramble, started, revealed, text.length])

  const done = revealed >= text.length
  let display = text.slice(0, revealed)
  if (useScramble && !done) {
    // three flickering glyphs after the settled prefix
    const head = Math.min(3, text.length - revealed)
    for (let i = 0; i < head; i++) {
      const src = text[revealed + i]
      display += src === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
    }
  }

  return (
    // Screen readers get the full sentence immediately via aria-label;
    // the character-by-character rendering is presentation only.
    <span ref={ref} className={className} style={style} aria-label={text}>
      <span aria-hidden="true">{display || ' '}</span>
      {showCaret && (
        <span className={`type-caret${done ? ' type-caret--done' : ''}`}>|</span>
      )}
    </span>
  )
}
