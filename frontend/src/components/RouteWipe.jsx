import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/motion'

/**
 * Spider-Verse-style halftone wipe between hash routes. When `routeKey`
 * changes it plays a cover → hold → uncover sweep of a dot-masked panel on
 * top of everything. The route content itself swaps instantly underneath
 * (React re-render), so the wipe just hides the seam.
 *
 * No-ops on the very first render and under reduced motion.
 */
export default function RouteWipe({ routeKey }) {
  const [phase, setPhase] = useState('idle') // idle | cover | uncover
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return undefined
    }
    if (prefersReducedMotion()) return undefined

    setPhase('cover')
    const toUncover = window.setTimeout(() => setPhase('uncover'), 320)
    const toIdle = window.setTimeout(() => setPhase('idle'), 720)
    return () => {
      window.clearTimeout(toUncover)
      window.clearTimeout(toIdle)
    }
  }, [routeKey])

  if (phase === 'idle') return null
  return <div className={`route-wipe route-wipe--${phase}`} aria-hidden="true" />
}
