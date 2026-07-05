import { useEffect, useRef, useState } from 'react'
import LetterReveal from './LetterReveal'

const CERTS = [
  { title: 'Foundational C# with Microsoft', issuer: 'Free Code Camp', date: '2025', color: 'cyan', image: '/c.png' },
  { title: 'AI Engineer Core Track: LLM Engineering, RAG, QLoRA, Agents', issuer: 'Udemy', date: '2026', color: 'red', image: '/AI-Engineer.jpg' },
  { title: 'FastAPI - The Complete Course', issuer: 'Udemy', date: '2026', color: 'mag', image: '/FastAPI.jpg' },
  { title: 'Six Sigma White Belt', issuer: 'Educate 360', date: '2025', color: 'cyan', image: '/SixSigma.jpeg' },
]

const ACCENT = {
  cyan: 'var(--cyan)',
  red: 'var(--red)',
  mag: 'var(--magenta)',
}

function CertCard({ cert }) {
  const accent = ACCENT[cert.color]
  const headerColor = cert.color === 'cyan' ? '#000' : '#fff'
  return (
    <div
      className="cert-card"
      style={{ boxShadow: `4px 4px 0 ${accent}`, '--cert-accent': accent }}
    >
      <div
        className="cert-halftone"
        style={{
          backgroundImage: `radial-gradient(circle, ${accent}28 1px, transparent 1px)`,
        }}
      />
      <div
        className="cert-header"
        style={{ background: accent, color: headerColor }}
      >
        {cert.issuer.toUpperCase()}
      </div>
      <div className="cert-icon">
        {cert.image && (
          <img
            src={cert.image}
            alt={cert.title}
            loading="lazy"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              filter: `drop-shadow(0 0 14px ${accent})`,
            }}
          />
        )}
      </div>
      <div className="cert-body">
        <div className="cert-title" style={{ textShadow: `1px 0 0 ${accent}` }}>
          {cert.title}
        </div>
        <div className="cert-issuer" style={{ color: accent }}>
          {cert.issuer}
        </div>
        <div className="cert-date">{cert.date}</div>
      </div>
    </div>
  )
}

export default function CertsSection() {
  const total = CERTS.length
  // `pos` is unbounded; the track renders three copies and translates from
  // the middle one, so there is always a card on both sides. After a
  // transition lands outside the middle copy we snap back by `total` with
  // the transition disabled — same frame visually, so the wrap is seamless
  // instead of the track lurching backwards.
  const [pos, setPos] = useState(0)
  const [animate, setAnimate] = useState(true)
  const [paused, setPaused] = useState(false)
  const autoRef = useRef(true) // auto-advance stops for good once the user takes over
  const trackRef = useRef(null)
  const [step, setStep] = useState(256)

  // Measure the real slide step (card width + flex gap) so the track stays
  // aligned at every breakpoint instead of trusting a hard-coded width.
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current
      if (track && track.children.length > 1) {
        setStep(track.children[1].offsetLeft - track.children[0].offsetLeft)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const goto = (updater) => {
    autoRef.current = false
    setAnimate(true)
    setPos(updater)
  }
  const prev = () => goto((p) => p - 1)
  const next = () => goto((p) => p + 1)

  useEffect(() => {
    const t = setInterval(() => {
      if (!autoRef.current || paused) return
      setAnimate(true)
      setPos((p) => p + 1)
    }, 3200)
    return () => clearInterval(t)
  }, [paused])

  useEffect(() => {
    if (pos >= total || pos < 0) {
      const t = setTimeout(() => {
        setAnimate(false)
        setPos((p) => ((p % total) + total) % total)
      }, 520) // just after the 0.5s track transition
      return () => clearTimeout(t)
    }
  }, [pos, total])

  const visibleCerts = [...CERTS, ...CERTS, ...CERTS]
  const active = ((pos % total) + total) % total

  return (
    <section id="certs" className="certs-section">
      <div className="certs-halftone" aria-hidden="true" />
      <div className="certs-header">
        <div>
          <div className="section-label reveal reveal-left">// ISSUE #05 — CREDENTIALS</div>
          <h2
            id="certs-title"
            className="section-title"
            style={{ margin: 0 }}
          >
            <LetterReveal text="CERTIFICATES" variant="letter-pop" stagger={40} />
          </h2>
        </div>
        <div className="certs-nav">
          <button
            type="button"
            onClick={prev}
            className="cert-nav-btn cert-nav-btn--ghost"
            aria-label="Previous certificate"
          >
            ←
          </button>
          <button
            type="button"
            onClick={next}
            className="cert-nav-btn cert-nav-btn--solid"
            aria-label="Next certificate"
          >
            →
          </button>
        </div>
      </div>

      <div
        className="certs-track-wrap"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div
          ref={trackRef}
          className="certs-track"
          style={{
            transform: `translateX(${-(pos + total) * step}px)`,
            transition: animate ? undefined : 'none',
          }}
        >
          {visibleCerts.map((cert, i) => (
            <CertCard key={i} cert={cert} />
          ))}
        </div>
      </div>

      <div className="certs-dots">
        {CERTS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goto((p) => p + (i - active))}
            className={`cert-dot${i === active ? ' is-active' : ''}`}
            aria-label={`Go to certificate ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
