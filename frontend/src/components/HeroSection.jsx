import TypedText from './TypedText'

const HERO_STATS = [
  { n: '5', l: 'Projects Led', c: 'var(--red)' },
  { n: '2:1', l: 'Honours Degree', c: 'var(--cyan)' },
  { n: 'AI', l: 'Engineering', c: 'var(--magenta)' },
  { n: 'ERP', l: 'Odoo Expert', c: 'var(--cyan)' },
]

export default function HeroSection() {
  return (
    <section id="hero" className="hero">
      <video
        className="hero-video"
        src="/piercespood.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="hero-video-vignette" />
      <div className="hero-halftone" />
      <div className="hero-spotlight" />

      <div className="hero-left">
        <div className="hero-eyebrow">
          <TypedText
            text="// BSc Computer Science · UWI St. Augustine"
            speed={35}
            startDelay={250}
          />
        </div>
        <h1 className="hero-name">
          <span>PIERCE</span>
          <span className="glitch-layer-1" aria-hidden="true">
            PIERCE
          </span>
          <span className="glitch-layer-2" aria-hidden="true">
            PIERCE
          </span>
          <br />
          <span>DOMAN</span>
          <span className="glitch-layer-1" aria-hidden="true">
            DOMAN
          </span>
          <span className="glitch-layer-2" aria-hidden="true">
            DOMAN
          </span>
        </h1>

        <div className="hero-role-row">
          <div className="hero-role-pill red">FULL STACK</div>
          <div className="hero-role-pill dark">✦</div>
          <div className="hero-role-pill cyan">AI ENGINEER</div>
        </div>
        <div className="hero-role-row" style={{ marginTop: 4 }}>
          <div className="hero-role-pill red">FREELANCER</div>
          <div className="hero-role-pill dark">✦</div>
          <div className="hero-role-pill cyan">Business Process Analyst</div>
        </div>

        <p className="hero-tagline">
          Building end-to-end digital products — from AI-powered pipelines to full-stack
          web apps. Based in Trinidad &amp; Tobago, shipping globally.
        </p>
      </div>

      <div className="hero-center" aria-hidden="true">
        <div className="hero-center-spot" />
        <div className="hero-center-glow" />
      </div>

      <div className="hero-right">
        <div className="hero-stats-row">
          {HERO_STATS.map((s) => (
            <div key={s.l} className="hero-stat">
              <span className="hero-stat-n" style={{ color: s.c }}>
                {s.n}
              </span>
              <span className="hero-stat-l">{s.l}</span>
            </div>
          ))}
        </div>

        <div className="hero-ctas">
          <a href="#projects" className="btn-primary" style={{ textAlign: 'center' }}>
            SEE MY WORK
          </a>
          <a href="#contact" className="btn-secondary" style={{ textAlign: 'center' }}>
            GET IN TOUCH
          </a>
          <a
            href="#"
            className="btn-secondary"
            style={{
              borderColor: 'var(--magenta)',
              color: 'var(--magenta)',
              boxShadow: '4px 4px 0 var(--magenta)',
              textAlign: 'center',
            }}
          >
            DOWNLOAD CV
          </a>
        </div>

        <div className="hero-responsibility">
          <span>
            With Great Code Comes
            <br />
            Great Responsibility
          </span>
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-line" />
        <span className="scroll-text">Scroll Down</span>
      </div>
    </section>
  )
}
