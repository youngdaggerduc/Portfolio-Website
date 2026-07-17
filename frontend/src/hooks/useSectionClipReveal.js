import { useEffect } from 'react'
import { isDesktopFX } from '../lib/motion'

/**
 * Progressively uncovers each <section> by animating a clip-path from a
 * small centered circle out to cover the element. Runs once per section.
 *
 * The hero is skipped — it's in view on first paint, so clipping it
 * causes a visible flash before the observer fires on the next frame.
 */
export function useSectionClipReveal() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const all = Array.from(document.querySelectorAll('main > section'))
    const sections = all.filter((s) => s.id !== 'hero')
    if (reduced || !('IntersectionObserver' in window)) {
      sections.forEach((s) => s.classList.add('clip-reveal', 'clip-revealed'))
      return
    }
    sections.forEach((s) => s.classList.add('clip-reveal'))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('clip-revealed')
            io.unobserve(entry.target)
          }
        })
      },
      // See useRevealObserver: under desktop smooth scroll, uncover on screen
      // instead of pre-triggering below the fold.
      { threshold: 0.04, rootMargin: isDesktopFX() ? '0px 0px -4% 0px' : '0px 0px 150px 0px' }
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])
}
