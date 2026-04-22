import { useEffect } from 'react'

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
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])
}
