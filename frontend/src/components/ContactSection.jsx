import { useState } from 'react'
import LetterReveal from './LetterReveal'
import { apiUrl } from '../lib/api'

const SOCIALS = [
  { icon: 'GH', label: 'GitHub', href: 'https://github.com/youngdaggerduc', sub: 'github.com/youngdaggerduc', external: true },
  { icon: 'LI', label: 'LinkedIn', href: 'https://tt.linkedin.com/in/pierce-doman-707002331', sub: 'linkedin.com/in/pierce-doman', external: true },
  { icon: 'EM', label: 'Email', href: 'mailto:piercedoman25@gmail.com', sub: 'piercedoman25@gmail.com' },
  { icon: 'PH', label: 'Phone', href: 'tel:+18682665568', sub: '+1 (868) 266-5568' },
]

export default function ContactSection() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (sending) return
    setError('')
    setSending(true)
    try {
      const res = await fetch(apiUrl('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        let detail = ''
        try {
          const j = await res.json()
          detail = j.detail || ''
        } catch {
          /* non-JSON body */
        }
        throw new Error(detail || `HTTP ${res.status}`)
      }
      setSent(true)
      setForm({ name: '', email: '', message: '', website: '' })
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setSending(false)
    }
  }

  return (
    <section
      id="contact"
      className="contact-section halftone"
      aria-labelledby="contact-title"
    >
      <div
        className="corner-decor corner-tl"
        style={{ borderColor: 'var(--magenta)' }}
      />
      <div className="section-label reveal reveal-left">// ISSUE #07 — TEAM-UP</div>
      <h2
        id="contact-title"
        className="section-title"
        style={{ margin: 0, marginBottom: 48 }}
      >
        <LetterReveal text="LET'S TALK" variant="letter-pop" stagger={55} />
      </h2>
      <div className="contact-wrap">
        <div className="contact-form-panel reveal reveal-slam">
          <div className="form-header">SEND A MESSAGE</div>
          {sent ? (
            <div
              className="form-body"
              style={{ alignItems: 'center', padding: 48, textAlign: 'center' }}
            >
              <div
                style={{
                  fontFamily: 'Bangers',
                  fontSize: 48,
                  color: 'var(--cyan)',
                  textShadow: '3px 0 0 var(--magenta)',
                }}
              >
                TRANSMITTED!
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: 'rgba(240,238,255,0.7)',
                  marginTop: 12,
                }}
              >
                Message received. I'll get back to you soon.
              </p>
              <button
                className="btn-secondary"
                style={{ marginTop: 20, fontFamily: 'Bangers', fontSize: 18 }}
                onClick={() => setSent(false)}
              >
                SEND ANOTHER
              </button>
            </div>
          ) : (
            <form className="form-body" onSubmit={handleSubmit}>
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
              />
              <div className="form-field">
                <label className="form-label" htmlFor="contact-name">
                  Your Name
                </label>
                <input
                  id="contact-name"
                  className="form-input"
                  type="text"
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="contact-email">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  className="form-input"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  className="form-input"
                  placeholder="Tell me about your project..."
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              {error && (
                <div
                  role="alert"
                  style={{
                    border: '2px solid var(--red)',
                    boxShadow: '3px 3px 0 var(--red)',
                    padding: '10px 12px',
                    background: 'rgba(232,25,44,0.08)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Bangers',
                      fontSize: 20,
                      letterSpacing: 1,
                      color: 'var(--red)',
                    }}
                  >
                    WEB FLUID JAMMED!
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(240,238,255,0.85)', marginTop: 4 }}>
                    {error} — try again or email me directly.
                  </div>
                </div>
              )}
              <button type="submit" className="send-btn" disabled={sending}>
                {sending ? 'TRANSMITTING…' : 'TRANSMIT MESSAGE →'}
              </button>
            </form>
          )}
        </div>
        <div className="contact-info">
          <div
            className="contact-info-title reveal reveal-right"
            style={{ '--reveal-delay': '100ms' }}
          >
            READY TO
            <br />
            BUILD
            <br />
            SOMETHING?
          </div>
          <p
            className="contact-info-sub reveal reveal-right"
            style={{ '--reveal-delay': '220ms' }}
          >
            Whether you've got a project in mind, a role to fill, or just want to connect —
            I'm all ears. Based in Trinidad &amp; Tobago, available globally.
          </p>
          <div className="social-links">
            {SOCIALS.map((s, i) => (
              <a
                key={s.label}
                href={s.href}
                className="social-link reveal reveal-right"
                style={{ '--reveal-delay': `${350 + i * 120}ms` }}
                {...(s.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                <div className="social-icon">{s.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.78 }}>{s.sub}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
