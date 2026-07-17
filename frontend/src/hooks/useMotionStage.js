import { useEffect } from 'react'
import { loadGsap, prefersReducedMotion } from '../lib/motion'

/**
 * The scroll + pointer "motion stage" that sits on top of the base CSS
 * reveal system. Everything here is additive: the site is fully functional
 * (and animated, via the CSS `.reveal` / clip-reveal system) with none of
 * this running. GSAP, ScrollTrigger and Lenis load in a separate chunk so
 * the hero video (LCP) is never delayed.
 *
 * All work is grouped into two `gsap.matchMedia()` contexts so it reverts
 * itself cleanly when the media query stops matching (resize, DevTools
 * device toggle) and on unmount:
 *
 *   - universal  : motion-OK on any device — cheap one-shots (stat count-up,
 *                  divider onomatopoeia punches, footer stamp).
 *   - desktop FX : fine pointer + real width — the expensive set pieces
 *                  (Lenis smooth scroll, hero pin/scrub, web-strand scroll
 *                  spine, section-title parallax, horizontal projects scrub,
 *                  magnetic buttons, card tilt, click bursts).
 *
 * Mount once, near the root of the portfolio page only.
 */
export function useMotionStage() {
  useEffect(() => {
    let alive = true
    let cleanup = () => {}

    if (prefersReducedMotion()) return undefined

    ;(async () => {
      const lib = await loadGsap()
      if (!alive) return
      cleanup = await initStage(lib)
      if (!alive) cleanup()
    })()

    return () => {
      alive = false
      cleanup()
    }
  }, [])
}

const DESKTOP_FX =
  '(prefers-reduced-motion: no-preference) and (pointer: fine) and (min-width: 901px)'
const MOTION_OK = '(prefers-reduced-motion: no-preference)'

async function initStage({ gsap, ScrollTrigger, SplitText }) {
  // Lenis is loaded here (not inside the matchMedia callback, which must stay
  // sync so it can return its cleanup) and only constructed in the desktop ctx.
  const { default: Lenis } = await import('@studio-freight/lenis')

  const mm = gsap.matchMedia()

  // ---- Universal: cheap one-shot scenes, safe on phones too ----------------
  mm.add(MOTION_OK, () => {
    const scenes = [
      countUpStats(gsap, ScrollTrigger),
      dividerPunches(gsap, ScrollTrigger),
      footerStamp(gsap, ScrollTrigger, SplitText),
    ]
    return () => scenes.forEach((c) => c && c())
  })

  // ---- Desktop FX: smooth scroll + the expensive set pieces ----------------
  mm.add(DESKTOP_FX, () => {
    // Snappy smoothing: high lerp keeps the comic "flick" while still letting
    // the scrubbed set pieces glide. 0.1 felt floaty and drained the energy.
    const lenis = new Lenis({ lerp: 0.16, smoothWheel: true, wheelMultiplier: 1.1 })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    document.documentElement.classList.add('lenis')

    const scenes = [
      heroScrub(gsap, ScrollTrigger),
      webSpine(gsap, ScrollTrigger),
      titleParallax(gsap, ScrollTrigger),
      projectsScrub(gsap, ScrollTrigger),
      magneticTargets(gsap),
      tiltCards(gsap),
      clickBursts(gsap),
      anchorScroll(lenis),
    ]

    // Recompute pins/spine once fonts + hero poster have settled.
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const settle = window.setTimeout(refresh, 600)

    return () => {
      window.clearTimeout(settle)
      window.removeEventListener('load', refresh)
      scenes.forEach((c) => c && c())
      gsap.ticker.remove(raf)
      lenis.destroy()
      document.documentElement.classList.remove('lenis')
    }
  })

  return () => mm.revert()
}

/* ==========================================================================
   SCENES
   Each returns its own cleanup fn (or null). They only touch elements that
   exist; a missing element just means the scene no-ops.
   ========================================================================== */

/** Count numeric stats up from zero when their row scrolls in. */
function countUpStats(gsap, ScrollTrigger) {
  const els = gsap.utils.toArray('.hero-stat-n, .stat-number')
  const triggers = []
  els.forEach((el) => {
    const raw = el.textContent.trim()
    const m = raw.match(/^(\D*)(\d[\d,]*)(.*)$/)
    if (!m) return // non-numeric stat (e.g. "AI", "ERP") — leave as-is
    const [, prefix, digits, suffix] = m
    const target = parseInt(digits.replace(/,/g, ''), 10)
    const obj = { v: 0 }
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: target,
          duration: 1.1,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${prefix}${Math.round(obj.v)}${suffix}`
          },
        }),
    })
    triggers.push(st)
  })
  return () => triggers.forEach((t) => t.kill())
}

/** Scale-punch the THWIP!/WHAM! onomatopoeia words as their divider crosses. */
function dividerPunches(gsap, ScrollTrigger) {
  const words = gsap.utils.toArray('.divider-burst-word')
  const triggers = []
  words.forEach((w) => {
    gsap.set(w, { scale: 0.4, opacity: 0, rotate: -18 })
    const st = ScrollTrigger.create({
      trigger: w,
      start: 'top 80%',
      once: true,
      onEnter: () =>
        gsap.to(w, {
          scale: 1,
          opacity: 1,
          rotate: -7,
          duration: 0.7,
          ease: 'elastic.out(1, 0.5)',
        }),
    })
    triggers.push(st)
  })
  return () => triggers.forEach((t) => t.kill())
}

/** Stamp the footer "TO BE CONTINUED…" in letter by letter, then flicker. */
function footerStamp(gsap, ScrollTrigger, SplitText) {
  const el = document.querySelector('.footer-continued')
  if (!el) return null
  const split = new SplitText(el, { type: 'chars' })
  gsap.set(split.chars, { opacity: 0, scale: 1.8, rotate: 6 })
  const st = ScrollTrigger.create({
    trigger: el,
    start: 'top 92%',
    once: true,
    onEnter: () => {
      gsap.to(split.chars, {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 0.5,
        ease: 'back.out(2)',
        stagger: 0.045,
        onComplete: () => {
          el.classList.add('footer-flicker')
          window.setTimeout(() => el.classList.remove('footer-flicker'), 700)
        },
      })
    },
  })
  return () => {
    st.kill()
    split.revert()
  }
}

/** Pin the hero and dissolve the "cover" apart as the reader scrolls in. */
function heroScrub(gsap, ScrollTrigger) {
  const hero = document.querySelector('#hero')
  if (!hero) return null

  // The columns enter with `animation: slideUp … both` — a *filled* CSS
  // animation outranks GSAP's inline styles for opacity/transform, which
  // silently freezes this scrub. Drop the fill (the one-shot entrance still
  // plays; it just stops pinning the final keyframe afterwards).
  const cols = hero.querySelectorAll('.hero-left, .hero-right')
  cols.forEach((el) => {
    el.style.animationFillMode = 'none'
  })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=55%', // short hold — scrolling must always visibly move something
      scrub: 0.8,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
    },
  })
  tl.to('.hero-video', { scale: 1.14, filter: 'saturate(0.35) brightness(0.7)', ease: 'none' }, 0)
    .to('.hero-video-vignette', { opacity: 1.15, ease: 'none' }, 0)
    .to('.hero-halftone', { backgroundSize: '11px 11px', opacity: 0.5, y: 40, ease: 'none' }, 0)
    // The two columns fly apart like a comic panel splitting.
    .to('.hero-left', { yPercent: -20, xPercent: -7, opacity: 0, ease: 'power1.in' }, 0)
    .to('.hero-right', { yPercent: -20, xPercent: 7, opacity: 0, ease: 'power1.in' }, 0)
    .to('.hero-name', { scale: 1.08, ease: 'none' }, 0)
    // scrollPulse (infinite) owns the indicator's opacity/transform, so fade
    // it through `filter`, which nothing else animates.
    .to('.scroll-indicator', { filter: 'opacity(0)', ease: 'none' }, 0)
  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    cols.forEach((el) => {
      el.style.animationFillMode = ''
    })
    gsap.set(
      '.hero-video, .hero-video-vignette, .hero-halftone, .hero-left, .hero-right, .hero-name, .scroll-indicator',
      { clearProps: 'all' }
    )
  }
}

/** Draw the left-edge web strand as a scroll-progress spine with a rider. */
function webSpine(gsap, ScrollTrigger) {
  const path = document.querySelector('#web-spine-path')
  const rider = document.querySelector('#web-spine-rider')
  if (!path) return null
  gsap.set(path, { strokeDashoffset: 1 })
  const tween = gsap.to(path, {
    strokeDashoffset: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
    },
  })
  let riderTween
  if (rider) {
    riderTween = gsap.to(rider, {
      // ride from the top of the spine to the bottom (viewBox units)
      y: 960,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
      },
    })
  }
  return () => {
    tween.scrollTrigger?.kill()
    tween.kill()
    riderTween?.scrollTrigger?.kill()
    riderTween?.kill()
  }
}

/** Section titles drift slightly slower than the body for depth. */
function titleParallax(gsap, ScrollTrigger) {
  const titles = gsap.utils.toArray('.section-title')
  const tweens = titles.map((t) =>
    gsap.fromTo(
      t,
      { yPercent: 8 },
      {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: t.closest('section') || t,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    )
  )
  return () => tweens.forEach((tw) => {
    tw.scrollTrigger?.kill()
    tw.kill()
  })
}

/** "Flip through the case files" — pin projects and pan the row sideways. */
function projectsScrub(gsap, ScrollTrigger) {
  const section = document.querySelector('#projects')
  const grid = section?.querySelector('.projects-grid')
  if (!section || !grid) return null

  section.classList.add('is-horizontal')
  const distance = () => Math.max(0, grid.scrollWidth - section.clientWidth)
  if (distance() <= 0) {
    section.classList.remove('is-horizontal')
    return null
  }

  const anim = gsap.to(grid, { x: () => -distance(), ease: 'none' })
  const st = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: () => '+=' + distance(),
    pin: true,
    scrub: 1,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    animation: anim,
  })
  return () => {
    st.kill()
    anim.kill()
    section.classList.remove('is-horizontal')
    gsap.set(grid, { clearProps: 'transform' })
  }
}

/** Elements with [data-magnetic] lean toward the cursor within their bounds. */
function magneticTargets(gsap) {
  const els = gsap.utils.toArray('[data-magnetic]')
  const cleanups = []
  els.forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic) || 0.35
    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' })
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const onLeave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    cleanups.push(() => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      gsap.set(el, { clearProps: 'transform' })
    })
  })
  return () => cleanups.forEach((c) => c())
}

/** Elements with [data-tilt] get a cursor-following 3D tilt (parent holds
 *  the perspective via CSS so no inline transform lingers pre-hover). */
function tiltCards(gsap) {
  const cards = gsap.utils.toArray('[data-tilt]')
  const cleanups = []
  cards.forEach((card) => {
    const max = parseFloat(card.dataset.tilt) || 9
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3' })
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3' })
    const onMove = (e) => {
      const r = card.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      ry(px * max)
      rx(-py * max)
    }
    const onLeave = () => {
      rx(0)
      ry(0)
      gsap.to(card, { z: 0, duration: 0.5, ease: 'power3', onComplete: () => gsap.set(card, { clearProps: 'transform' }) })
    }
    const onEnter = () => gsap.to(card, { z: 40, duration: 0.4, ease: 'power2.out' })
    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseenter', onEnter)
    card.addEventListener('mouseleave', onLeave)
    cleanups.push(() => {
      card.removeEventListener('mousemove', onMove)
      card.removeEventListener('mouseenter', onEnter)
      card.removeEventListener('mouseleave', onLeave)
      gsap.set(card, { clearProps: 'transform' })
    })
  })
  return () => cleanups.forEach((c) => c())
}

/** Comic starburst on any primary comic control click. */
function clickBursts(gsap) {
  const SELECTOR =
    '.btn-primary, .btn-secondary, .send-btn, .project-link, .games-callout-cta, .cert-nav-btn'
  const COLORS = ['var(--cyan)', 'var(--red)', 'var(--magenta)', '#ffd42a']
  const onClick = (e) => {
    if (!e.target.closest(SELECTOR)) return
    const n = 7
    for (let i = 0; i < n; i++) {
      const spark = document.createElement('span')
      spark.className = 'comic-spark'
      spark.style.left = e.clientX + 'px'
      spark.style.top = e.clientY + 'px'
      spark.style.background = COLORS[i % COLORS.length]
      document.body.appendChild(spark)
      const angle = (Math.PI * 2 * i) / n + Math.random() * 0.5
      const dist = 26 + Math.random() * 30
      gsap.fromTo(
        spark,
        { scale: 0, opacity: 1 },
        {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          scale: gsap.utils.random(0.6, 1.3),
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => spark.remove(),
        }
      )
    }
  }
  document.addEventListener('click', onClick)
  return () => document.removeEventListener('click', onClick)
}

/** In-page anchor links get Lenis smooth scroll (skips #/route hashes). */
function anchorScroll(lenis) {
  const onClick = (e) => {
    const a = e.target.closest('a[href^="#"]')
    if (!a) return
    const href = a.getAttribute('href')
    if (!href || href.startsWith('#/') || href === '#') return
    const target = document.querySelector(href)
    if (!target) return
    e.preventDefault()
    lenis.scrollTo(target, { offset: -60 })
  }
  document.addEventListener('click', onClick)
  return () => document.removeEventListener('click', onClick)
}
