import LetterReveal from './LetterReveal'

const TEASERS = [
  {
    emoji: '🕸️',
    number: '01',
    title: 'SPOT THE BUG',
    sub: 'Spider-Sense Edition',
    blurb: 'AI drops a buggy snippet. Find the bug before your web fluid runs out.',
    accent: 'cyan',
  },
  {
    emoji: '🦸',
    number: '02',
    title: 'HIRE SPIDER-MAN',
    sub: 'Pitch Battle',
    blurb: 'Play a skeptical recruiter. Spider-Man defends Pierce in 3 rounds.',
    accent: 'mag',
  },
]

export default function GamesCalloutSection() {
  return (
    <section id="games-callout" className="games-callout-section">
      <div className="games-callout-halftone" aria-hidden="true" />

      <div className="games-callout-inner">
        <div className="games-callout-head reveal">
          <div className="section-label">// Bonus Stage</div>
          <h2 className="section-title games-callout-title">
            <LetterReveal text={'CHECK OUT THE GAMES'} variant="letter-pop" stagger={45} />
          </h2>
          <p className="games-callout-tagline">
            Two AI-powered mini-games baked right into the site —{' '}
            <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>built with the same stack</span>{' '}
            you just scrolled through.
          </p>
        </div>

        <div className="games-callout-grid">
          {TEASERS.map((t) => (
            <div
              key={t.number}
              className={`games-callout-card games-callout-card--${t.accent} reveal`}
            >
              <div className="games-callout-card-banner">
                <span className="games-callout-card-num">GAME {t.number}</span>
                <span className="games-callout-card-tag">AI POWERED</span>
              </div>
              <div className="games-callout-card-icon" aria-hidden="true">
                <span>{t.emoji}</span>
              </div>
              <div className="games-callout-card-body">
                <div className="games-callout-card-title">{t.title}</div>
                <div className="games-callout-card-sub">{t.sub}</div>
                <p className="games-callout-card-blurb">{t.blurb}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="games-callout-cta-wrap reveal">
          <a href="#/games" className="games-callout-cta">
            <span className="games-callout-cta-spider" aria-hidden="true">
              🕷️
            </span>
            <span className="games-callout-cta-text">PLAY THE GAMES</span>
            <span className="games-callout-cta-arrow" aria-hidden="true">
              →
            </span>
          </a>
          <div className="games-callout-cta-hint">
            POWERED BY OPENAI · NO SIGN-UP · TAKES 60 SECONDS
          </div>
        </div>
      </div>
    </section>
  )
}
