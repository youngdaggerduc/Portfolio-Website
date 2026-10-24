/**
 * Central motion gating + lazy GSAP loader.
 *
 * Every animated feature added on top of the base CSS reveal system routes
 * through these gates so the rules live in exactly one place:
 *
 *   - prefersReducedMotion() — user asked for calm; show the static site.
 *   - isDesktopFX()          — fine pointer + real width + motion OK; the
 *                              bar for expensive extras (hero pin, three.js,
 *                              magnetic cursors, tilt).
 *
 * GSAP + ScrollTrigger are pulled in through loadGsap() so they land in a
 * separate chunk and never delay the hero video (the LCP element).
 */

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function motionOK() {
  return !prefersReducedMotion()
}

export function isDesktopFX() {
  if (typeof window === 'undefined') return false
  return (
    motionOK() &&
    window.matchMedia('(pointer: fine)').matches &&
    window.innerWidth > 900
  )
}

let gsapPromise = null

/**
 * Loads GSAP core + the plugins we use and registers them once. Returns the
 * same promise on repeat calls. Resolves to { gsap, ScrollTrigger, SplitText };
 * ScrambleText is registered as a tween property.
 */
export function loadGsap() {
  if (!gsapPromise) {
    gsapPromise = Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('gsap/SplitText'),
      import('gsap/ScrambleTextPlugin'),
    ]).then(([g, st, split, scramble]) => {
      const gsap = g.gsap ?? g.default
      const ScrollTrigger = st.ScrollTrigger ?? st.default
      const SplitText = split.SplitText ?? split.default
      const ScrambleTextPlugin = scramble.ScrambleTextPlugin ?? scramble.default
      gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin)
      return { gsap, ScrollTrigger, SplitText }
    })
  }
  return gsapPromise
}
