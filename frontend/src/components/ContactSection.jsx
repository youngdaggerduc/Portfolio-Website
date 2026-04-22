import { useState } from 'react'

const SOCIALS = [
  { icon: 'GH', label: 'GitHub', href: '#', sub: '@piercedoman' },
  { icon: 'LI', label: 'LinkedIn', href: '#', sub: 'Pierce Doman' },
  { icon: 'EM', label: 'Email', href: 'mailto:pierce@example.com', sub: 'pierce@example.com' },
]

export default function ContactSection() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
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
      <div className="section-label reveal reveal-left">// Chapter 04</div>
      <h2
        id="contact-title"
        className="section-title reveal reveal-pow"
        style={{ margin: 0, marginBottom: 48 }}
      >
        LET'S TALK
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
              <button type="submit" className="send-btn">
                TRANSMIT MESSAGE →
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
            I'm all ears. Let's make something great.
          </p>
          <div className="social-links">
            {SOCIALS.map((s, i) => (
              <a
                key={s.label}
                href={s.href}
                className="social-link reveal reveal-right"
                style={{ '--reveal-delay': `${350 + i * 120}ms` }}
              >
                <div className="social-icon">{s.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.6 }}>{s.sub}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
