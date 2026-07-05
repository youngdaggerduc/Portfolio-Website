import LetterReveal from './LetterReveal'

export default function BehindTheMaskSection() {
  return (
    <section id="behind" className="behind-section">
      <div className="behind-halftone" aria-hidden="true" />

      <div className="behind-grid">
        <div className="behind-photo-wrap reveal reveal-left">
          <div className="behind-photo-panel">
            <div className="behind-photo-header">
              <span className="behind-photo-title">THE MAN BEHIND THE MASK</span>
            </div>
            <div className="behind-photo-area">
              <div className="behind-photo-frame" aria-hidden="true" />
              <img
                src="/me.jpeg"
                alt="Pierce Doman"
                className="behind-photo-img"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              <div className="behind-photo-fallback" aria-hidden="true">
                <div className="behind-photo-initials">PD</div>
                <div className="behind-photo-hint">IDENTITY CLASSIFIED</div>
              </div>
              <div className="behind-photo-sense" aria-hidden="true">
                {[0, 0.5, 1].map((d) => (
                  <span
                    key={d}
                    className="behind-photo-sense-ring"
                    style={{ animationDelay: `${d}s` }}
                  />
                ))}
              </div>
            </div>
            <div className="behind-photo-caption">
              <span className="behind-photo-name">PIERCE DOMAN</span>
              <span className="behind-photo-where">Trinidad &amp; Tobago</span>
            </div>
          </div>
        </div>

        <div className="behind-text reveal reveal-right">
          <div className="section-label">// ISSUE #08 — SECRET IDENTITY</div>
          <h2 className="behind-headline">
            <LetterReveal text={'BEHIND\nTHE\nMASK'} variant="letter-pop" stagger={55} />
          </h2>

          <div className="behind-story">
            <div className="behind-story-header">THE REAL STORY</div>
            <div className="behind-story-body">
              <p>
                Every Spider-Man needs a face behind the mask. The animated Spider-Man you
                see across this site?{' '}
                <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>That's me</span>{' '}
                — Pierce Doman — reimagined through AI.
              </p>
              <p style={{ marginTop: 12 }}>
                I used photos of myself as reference to generate the Spider-Verse style
                animated character you see swinging, posing, and showing up throughout
                this portfolio. It felt right — this site is about who I am and what I
                build, so the hero should literally be me.
              </p>
              <p style={{ marginTop: 12 }}>
                Full stack dev by day.{' '}
                <span style={{ color: 'var(--red)', fontWeight: 700 }}>
                  Friendly neighbourhood engineer
                </span>{' '}
                by night. 🕷️
              </p>
            </div>
          </div>

          <div className="behind-process">
            <div className="behind-process-label">HOW IT WAS MADE</div>
            <div className="behind-process-body">
              Real photo → AI image generation → Spider-Verse comic style. The animated
              character is a stylised version of me placed into the aesthetic of this
              portfolio.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
