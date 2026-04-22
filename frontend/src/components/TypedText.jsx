import { useEffect, useRef, useState } from 'react'

/**
 * Typewriter effect. Starts when the element enters the viewport, types
 * the provided string character-by-character, then a blinking caret stays.
 */
export default function TypedText({
  text,
  speed = 55,
  startDelay = 350,
  showCaret = true,
  className = '',
  style,
}) {
  const ref = useRef(null)
  const [shown, setShown] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setStarted(true)
      return
    }
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

  useEffect(() => {
    if (!started) return
    if (shown.length >= text.length) return
    const id = setTimeout(
      () => setShown(text.slice(0, shown.length + 1)),
      speed
    )
    return () => clearTimeout(id)
  }, [started, shown, text, speed])

  const done = shown.length >= text.length

  return (
    <span ref={ref} className={className} style={style}>
      <span>{shown || ' '}</span>
      {showCaret && (
        <span className={`type-caret${done ? ' type-caret--done' : ''}`}>
          |
        </span>
      )}
    </span>
  )
}
