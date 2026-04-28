import { useEffect } from 'react'

/**
 * Observes every `.reveal` element and adds `.is-visible` when it enters
 * the viewport. A MutationObserver picks up `.reveal` elements added to
 * the DOM *after* mount (e.g. lazy-rendered components) so they still
 * animate. A safety timer also reveals any still-hidden elements that
 * should already be in view, so nothing is ever permanently invisible.
 */
export function useRevealObserver() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px 120px 0px' }
    )

    const observeAll = () => {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => io.observe(el))
    }
    observeAll()

    // Pick up reveals added after mount (lazy children, portals, etc.)
    const mo = new MutationObserver(observeAll)
    mo.observe(document.body, { childList: true, subtree: true })

    // Safety net: anything in view after 400ms that still isn't marked visible
    // gets revealed anyway. Lower than the original 1500ms because we no longer
    // pay the content-visibility:auto layout cost on scroll-in.
    const safety = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top < window.innerHeight * 1.2 && r.bottom > 0) {
          el.classList.add('is-visible')
        }
      })
    }, 400)

    return () => {
      io.disconnect()
      mo.disconnect()
      clearTimeout(safety)
    }
  }, [])
}
