import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import LetterReveal from './LetterReveal'
import { certs } from '../data'
import { DownloadIcon, ExternalIcon } from './Icons'

const ACCENT = {
  cyan: 'var(--cyan)',
  red: 'var(--red)',
  mag: 'var(--magenta)',
}

const earned = certs.filter((c) => !c.learning)
const learning = certs.filter((c) => c.learning)

// Deep links: ?cert=<id> opens that certificate straight away, so a shared
// link lands on the certificate itself, not just the page.
const certUrl = (id) => {
  const u = new URL(window.location.href)
  u.searchParams.set('cert', id)
  u.hash = 'certs'
  return u.toString()
}
const setCertParam = (id) => {
  const u = new URL(window.location.href)
  if (id) u.searchParams.set('cert', id)
  else u.searchParams.delete('cert')
  window.history.replaceState(window.history.state, '', u)
}

function CertCard({ cert, index, onOpen }) {
  const accent = ACCENT[cert.color]
  return (
    <div className="cert-cell reveal reveal-up" style={{ '--reveal-delay': `${index * 90}ms` }}>
    <button
      type="button"
      className={`cert-tile cert-tile--${cert.color}`}
      style={{ '--cert-accent': accent }}
      onClick={() => onOpen(cert.id)}
      aria-label={`View certificate: ${cert.title}, ${cert.issuer}, ${cert.date}`}
    >
      <span className="cert-tile-header">
        <span>{cert.issuer}</span>
        <span>{cert.date}</span>
      </span>
      <span className="cert-tile-img">
        <img src={cert.thumb} alt="" loading="lazy" decoding="async" width="600" height="420" />
        <span className="cert-tile-zoom" aria-hidden="true">
          ⤢ EXPAND
        </span>
      </span>
      <span className="cert-tile-body">
        <span className="cert-tile-title">{cert.title}</span>
        <span className="cert-tile-skills">
          {cert.skills.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </span>
      </span>
    </button>
    </div>
  )
}

function LearningCard({ cert, index }) {
  return (
    <div
      className="cert-cell reveal reveal-up"
      style={{ '--reveal-delay': `${(index + earned.length) * 90}ms` }}
    >
    <div className="cert-tile cert-tile--learning" style={{ '--cert-accent': ACCENT[cert.color] }}>
      <span className="cert-tile-header">
        <span>{cert.issuer}</span>
        <span className="cert-tile-progress">IN PROGRESS</span>
      </span>
      <span className="cert-tile-img cert-tile-img--learning" aria-hidden="true">
        <span className="cert-learning-glyph">AWS</span>
        <span className="cert-learning-bar">
          <span />
        </span>
        <span className="cert-learning-note">TRAINING ARC · LOADING…</span>
      </span>
      <span className="cert-tile-body">
        <span className="cert-tile-title">{cert.title}</span>
        <span className="cert-tile-skills">
          {cert.skills.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </span>
      </span>
    </div>
    </div>
  )
}

/**
 * Full-screen certificate viewer. Escape/backdrop close, ←/→ step through
 * the earned certificates, focus is trapped-in on open and restored on
 * close. SHARE uses the native share sheet when there is one and otherwise
 * copies a deep link that re-opens this exact certificate.
 */
function CertLightbox({ index, onClose, onStep }) {
  const cert = earned[index]
  const boxRef = useRef(null)
  const [copiedId, setCopiedId] = useState(null)
  const copied = copiedId === cert.id
  const accent = ACCENT[cert.color]

  useEffect(() => {
    const previouslyFocused = document.activeElement
    document.body.style.overflow = 'hidden'
    boxRef.current?.querySelector('.cert-lightbox-close')?.focus()
    return () => {
      document.body.style.overflow = ''
      previouslyFocused?.focus?.()
    }
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onStep(1)
      else if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onStep])

  const share = async () => {
    const url = certUrl(cert.id)
    const text = `${cert.title} (${cert.issuer}, ${cert.date}) · Pierce Doman`
    if (navigator.share) {
      try {
        await navigator.share({ title: cert.title, text, url })
        return
      } catch {
        /* dismissed: fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(cert.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  const linkedInShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    typeof window !== 'undefined' ? certUrl(cert.id) : ''
  )}`

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
          <span className="cert-lightbox-title">
            {cert.issuer.toUpperCase()} · {index + 1}/{earned.length}
          </span>
          <button className="cert-lightbox-close" onClick={onClose} aria-label="Close certificate viewer">
            ✕
          </button>
        </div>
        <div className="cert-lightbox-img-wrap">
          <button
            type="button"
            className="cert-lightbox-step cert-lightbox-step--prev"
            onClick={() => onStep(-1)}
            aria-label="Previous certificate"
          >
            ←
          </button>
          <img key={cert.id} src={cert.image} alt={cert.title} className="cert-lightbox-img" />
          <button
            type="button"
            className="cert-lightbox-step cert-lightbox-step--next"
            onClick={() => onStep(1)}
            aria-label="Next certificate"
          >
            →
          </button>
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
            <a
              className="project-link project-link--live"
              href={linkedInShare}
              target="_blank"
              rel="noopener noreferrer"
            >
              LINKEDIN <ExternalIcon />
            </a>
            <a
              className="project-link project-link--ghost"
              href={cert.image}
              download={`Pierce Doman - ${cert.title}.webp`}
              aria-label={`Download ${cert.title}`}
            >
              <DownloadIcon />
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

function deepLinkedIndex() {
  if (typeof window === 'undefined') return null
  const id = new URLSearchParams(window.location.search).get('cert')
  const i = earned.findIndex((c) => c.id === id)
  return i < 0 ? null : i
}

export default function CertsSection() {
  // index into `earned`; a ?cert= deep link opens straight onto that one
  const [viewing, setViewing] = useState(deepLinkedIndex)
  const sectionRef = useRef(null)

  const open = useCallback((id) => {
    const i = earned.findIndex((c) => c.id === id)
    if (i < 0) return
    setViewing(i)
    setCertParam(id)
  }, [])
  const close = useCallback(() => {
    setViewing(null)
    setCertParam(null)
  }, [])
  const step = useCallback((dir) => {
    setViewing((i) => {
      const next = (i + dir + earned.length) % earned.length
      setCertParam(earned[next].id)
      return next
    })
  }, [])

  // A deep-linked certificate also brings its section into view behind it.
  useEffect(() => {
    if (deepLinkedIndex() != null) sectionRef.current?.scrollIntoView({ block: 'start' })
  }, [])

  return (
    <section id="certs" ref={sectionRef} className="certs-section" aria-labelledby="certs-title">
      <div className="certs-halftone" aria-hidden="true" />
      <div className="certs-header">
        <div>
          <div className="section-label reveal reveal-left">// ISSUE #06 — CREDENTIALS</div>
          <h2 id="certs-title" className="section-title" style={{ margin: 0 }}>
            <LetterReveal text="CERTIFICATES" variant="letter-pop" stagger={40} />
          </h2>
        </div>
        <div className="certs-tally" aria-label={`${earned.length} earned, ${learning.length} in progress`}>
          <span>
            <strong>{earned.length}</strong> EARNED
          </span>
          <span>
            <strong>{learning.length}</strong> IN PROGRESS
          </span>
        </div>
      </div>
      <p className="section-intro certs-intro">
        Tap any certificate to expand it, flip through with ← →, and share a direct link.
      </p>

      <div className="certs-grid">
        {earned.map((c, i) => (
          <CertCard key={c.id} cert={c} index={i} onOpen={open} />
        ))}
        {learning.map((c, i) => (
          <LearningCard key={c.id} cert={c} index={i} />
        ))}
      </div>

      {viewing != null && <CertLightbox index={viewing} onClose={close} onStep={step} />}
    </section>
  )
}
