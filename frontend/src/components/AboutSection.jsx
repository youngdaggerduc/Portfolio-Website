import { useRef } from 'react'
import SwingingSpood from './SwingingSpood'
import SwingFigure from './SwingFigure'
import LetterReveal from './LetterReveal'
import { stats } from '../data'

const STAT_COLORS = {
  red: 'var(--red)',
  cyan: 'var(--cyan)',
  mag: 'var(--magenta)',
}

export default function AboutSection() {
  const sectionRef = useRef(null)

  const currently = [
    { dot: 'var(--cyan)', text: 'Business Process Analyst @ Radian H.A. Limited' },
    { dot: 'var(--red)', text: 'Building AI automation workflows & tools' },
    { dot: 'var(--magenta)', text: 'Advancing into full-time AI Engineering' },
    { dot: 'var(--cyan)', text: 'Open to freelance & dev opportunities' },
  ]

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-section halftone-mag"
      aria-labelledby="about-title"
    >
      <SwingingSpood sectionRef={sectionRef} />
      <SwingFigure sectionRef={sectionRef} />
      <div className="corner-decor corner-tl" />
      <div
        className="corner-decor corner-br"
        style={{ borderColor: 'var(--cyan)' }}
      />
      <div className="section-label reveal reveal-left">// ISSUE #01 — ORIGIN STORY</div>
      <h2
        id="about-title"
        className="section-title"
        style={{ margin: 0, marginBottom: 48 }}
      >
        <LetterReveal text="ABOUT ME" variant="letter-pop" stagger={45} />
      </h2>
      <div className="about-grid">
        <div className="comic-panel reveal reveal-left">
          <div className="comic-panel-header">ORIGIN STORY</div>
          <div className="comic-panel-body">
            <div className="about-text">
              <p>
                I'm <span className="highlight">Pierce Doman</span> — a{' '}
                <span className="highlight-red">
                  Business Process Analyst &amp; Full Stack Developer
                </span>{' '}
                based in Trinidad &amp; Tobago. I hold a BSc in Computer Science (Special)
                with Second Class Honours from the University of the West Indies, St.
                Augustine.
              </p>
              <p>
                I specialize in{' '}
                <span className="highlight">
                  digital transformation, ERP implementation, and workflow automation
                </span>{' '}
                — translating complex operational requirements into scalable technical
                systems. At Radian H.A. Limited I led and delivered 5 previously stalled
                strategic projects, including a full Odoo ERP rollout across Accounting,
                Sales, CRM, Rental, and Reporting.
              </p>
              <p>
                On the engineering side I work across the full stack — React frontends,
                Node/Python backends, SQL databases — and I'm actively advancing into{' '}
                <span className="highlight">AI Engineering</span> with hands-on experience
                in LangChain, OpenAI APIs, and automation pipelines. I also train teams on
                AI adoption in real business contexts.
              </p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div className="stats-grid reveal reveal-right">
            {stats.map((s, i) => (
              <div
                key={s.l}
                className="stat-item reveal reveal-zoom"
                style={{ '--reveal-delay': `${(i + 1) * 100}ms` }}
              >
                <span
                  className="stat-number"
                  style={{
                    color: STAT_COLORS[s.c],
                    ...(s.n.length > 2 ? { fontSize: 36 } : {}),
                  }}
                >
                  {s.n}
                </span>
                <span className="stat-label">{s.l}</span>
              </div>
            ))}
          </div>
          <div
            className="comic-panel reveal reveal-right"
            style={{ marginTop: 0, borderTop: 'none', '--reveal-delay': '150ms' }}
          >
            <div
              className="comic-panel-header"
              style={{ background: 'var(--cyan)', color: '#000' }}
            >
              CURRENTLY
            </div>
            <div className="comic-panel-body" style={{ padding: '16px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {currently.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      fontSize: 13,
                      color: 'rgba(240,238,255,0.8)',
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: item.dot,
                        flexShrink: 0,
                        boxShadow: `0 0 8px ${item.dot}`,
                      }}
                    />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
