import { useEffect, useState } from 'react'
import LetterReveal from './LetterReveal'

const CERTS = [
  { title: 'Foundational C# with Microsoft', issuer: 'Free Code Camp', date: '2025', color: 'cyan', image: '' },
  { title: 'AI Engineer Core Track: LLM Engineering, RAG, QLoRA, Agents', issuer: 'Udemy', date: '2026', color: 'red', image: '' },
  { title: 'Add Your Cert', issuer: 'Issuing Organisation', date: '2024', color: 'mag', image: '' },
  { title: 'Add Your Cert', issuer: 'Issuing Organisation', date: '2024', color: 'cyan', image: '' },
  { title: 'Add Your Cert', issuer: 'Issuing Organisation', date: '2025', color: 'red', image: '' },
  { title: 'Add Your Cert', issuer: 'Issuing Organisation', date: '2025', color: 'mag', image: '' },
]

const ACCENT = {
  cyan: 'var(--cyan)',
  red: 'var(--red)',
  mag: 'var(--magenta)',
}

const CARD_W = 256

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
        CERTIFIED
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
  const [pos, setPos] = useState(0)
  const total = CERTS.length

  const prev = () => setPos((p) => (p - 1 + total) % total)
  const next = () => setPos((p) => (p + 1) % total)

  useEffect(() => {
    const t = setInterval(() => setPos((p) => (p + 1) % total), 3200)
    return () => clearInterval(t)
  }, [total])

  const visibleCerts = [...CERTS, ...CERTS]

  return (
    <section id="certs" className="certs-section">
      <div className="certs-halftone" aria-hidden="true" />
      <div className="certs-header">
        <div>
          <div className="section-label reveal reveal-left">// Credentials</div>
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

      <div className="certs-track-wrap">
        <div
          className="certs-track"
          style={{ transform: `translateX(calc(-${pos * CARD_W}px))` }}
        >
          {visibleCerts.map((cert, i) => (
            <CertCard key={i} cert={cert} />
          ))}
        </div>
      </div>

      <div className="certs-dots">
        {CERTS.map((_, i) => {
          const active = i === pos % total
          return (
            <button
              key={i}
              type="button"
              onClick={() => setPos(i)}
              className={`cert-dot${active ? ' is-active' : ''}`}
              aria-label={`Go to certificate ${i + 1}`}
            />
          )
        })}
      </div>
    </section>
  )
}
