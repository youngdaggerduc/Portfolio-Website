import { useRef } from 'react'
import SwingFigure from './SwingFigure'
import LetterReveal from './LetterReveal'
import { stats } from '../data'

const HOW_I_WORK = [
  { n: '01', t: 'LISTEN', d: 'Talk to department heads and the people doing the work: where are the delays, handoffs and pain points?' },
  { n: '02', t: 'OBSERVE', d: 'Watch how the work really happens and review the forms, spreadsheets and reports behind it.' },
  { n: '03', t: 'MAP', d: 'Document the current process and design a better future-state workflow.' },
  { n: '04', t: 'PRIORITISE', d: 'Rank by urgency and impact, and work through competing department needs.' },
  { n: '05', t: 'BUILD', d: 'Configure or build it, often with AI-assisted development, and demo early.' },
  { n: '06', t: 'TEST & TRAIN', d: 'Validate against requirements, train staff, then keep improving after rollout.' },
]

const STAT_COLORS = {
  red: 'var(--red)',
  cyan: 'var(--cyan)',
  mag: 'var(--magenta)',
}

export default function AboutSection() {
  const sectionRef = useRef(null)

  const currently = [
    { dot: 'var(--cyan)', text: 'Business Process Analyst @ Radian H.A. Limited' },
    { dot: 'var(--red)', text: 'Security Management System: awaiting deployment approval' },
    { dot: 'var(--magenta)', text: 'Studying for AWS Cloud & AI Practitioner' },
    { dot: 'var(--cyan)', text: 'Open to freelance & dev opportunities' },
  ]

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-section halftone-mag"
      aria-labelledby="about-title"
    >
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
                strategic projects, including leading the move off a failing legacy
                quoting system onto Odoo ERP, which took comparable quotes from 45–60
                minutes down to 2–8. Before that I coordinated offshore crane operations
                at Pyramid Engineering, so I know how field work and back-office systems
                actually meet.
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

      <div className="how-i-work reveal reveal-up">
        <div className="how-i-work-head">
          <span className="how-i-work-kicker">THE METHOD</span>
          <h3 className="how-i-work-title">HOW I WORK</h3>
        </div>
        <ol className="how-i-work-steps">
          {HOW_I_WORK.map((s, i) => (
            <li
              key={s.n}
              className="how-step reveal reveal-zoom"
              style={{ '--reveal-delay': `${i * 80}ms` }}
            >
              <span className="how-step-n">{s.n}</span>
              <span className="how-step-t">{s.t}</span>
              <span className="how-step-d">{s.d}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
