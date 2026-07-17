import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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

function CertCard({ cert, onOpen }) {
  const accent = ACCENT[cert.color]
  const headerColor = cert.color === 'cyan' ? '#000' : '#fff'
  return (
    <div
      className="cert-card cert-card--clickable"
      style={{ boxShadow: `4px 4px 0 ${accent}`, '--cert-accent': accent }}
      role="button"
      tabIndex={0}
      aria-label={`View certificate: ${cert.title}`}
      onClick={() => onOpen(cert)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(cert)
        }
      }}
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
      <div className="cert-expand-hint" aria-hidden="true" style={{ color: accent }}>
        ⤢
      </div>
    </div>
  )
}

/**
 * Full-screen certificate viewer. Same focus/scroll-lock pattern as the
 * project Modal: Escape closes, backdrop click closes, focus is moved in on
 * open and restored on close. SHARE uses the native share sheet when the
 * browser has one and falls back to copying the certificate link.
 */
function CertLightbox({ cert, onClose }) {
  const boxRef = useRef(null)
  const [copied, setCopied] = useState(false)
  const accent = ACCENT[cert.color]

  useEffect(() => {
    const previouslyFocused = document.activeElement
    document.body.style.overflow = 'hidden'
    boxRef.current?.querySelector('.cert-lightbox-close')?.focus()
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  const share = async () => {
    const url = window.location.origin + cert.image
    const payload = {
      title: cert.title,
      text: `${cert.title} — ${cert.issuer} (${cert.date}) · Pierce Doman`,
      url,
    }
    if (navigator.share) {
      try {
        await navigator.share(payload)
        return
      } catch {
        /* user dismissed the sheet — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(`${payload.text} ${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable — nothing sensible left to do */
    }
  }

  return createPortal(
    <div
      className="cert-lightbox-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={boxRef}
        className="cert-lightbox"
        role="dialog"
        aria-modal="true"
        aria-label={cert.title}
        style={{ boxShadow: `8px 8px 0 ${accent}` }}
      >
        <div
          className="cert-lightbox-header"
          style={{ background: accent, color: cert.color === 'cyan' ? '#000' : '#fff' }}
        >
          <span className="cert-lightbox-title">{cert.issuer.toUpperCase()}</span>
          <button
            className="cert-lightbox-close"
            onClick={onClose}
            aria-label="Close certificate viewer"
          >
            ✕
          </button>
        </div>
        <div className="cert-lightbox-img-wrap">
          <img src={cert.image} alt={cert.title} className="cert-lightbox-img" />
        </div>
        <div className="cert-lightbox-footer">
          <div>
            <div className="cert-lightbox-name">{cert.title}</div>
            <div className="cert-lightbox-meta" style={{ color: accent }}>
              {cert.issuer} · {cert.date}
            </div>
          </div>
          <div className="cert-lightbox-actions">
            <button type="button" className="project-link" onClick={share}>
              {copied ? 'LINK COPIED ✓' : 'SHARE ↗'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
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
  const [viewing, setViewing] = useState(null)
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
      if (!autoRef.current || paused || viewing) return
      setAnimate(true)
      setPos((p) => p + 1)
    }, 3200)
    return () => clearInterval(t)
  }, [paused, viewing])

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
            <CertCard key={i} cert={cert} onOpen={setViewing} />
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

      {viewing && <CertLightbox cert={viewing} onClose={() => setViewing(null)} />}
    </section>
  )
}
