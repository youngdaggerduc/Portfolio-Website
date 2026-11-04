import LetterReveal from './LetterReveal'
import { badges } from '../data'

const ACCENT = {
  cyan: 'var(--cyan)',
  red: 'var(--red)',
  mag: 'var(--magenta)',
}

// Tilts for the "stuck on by hand" sticker look, cycled by index.
const TILTS = [-4, 3, -2, 5, -5, 2]

// Always leave a couple of empty slots so the wall reads as a collection in progress.
const EMPTY_SLOTS = Math.max(2, 4 - (badges.length % 4 || 4))

function Badge({ badge, index }) {
  const src = `${badge.img}-200.webp`
  const content = (
    <>
      <span className="badge-sticker" style={{ '--badge-mask': `url(${src})` }}>
        <img
          src={src}
          srcSet={`${badge.img}-200.webp 1x, ${badge.img}-400.webp 2x`}
          alt=""
          width="200"
          height="216"
          loading="lazy"
          decoding="async"
        />
        <span className="badge-holo" aria-hidden="true" />
      </span>
      <span className="badge-caption">
        <span className="badge-title">{badge.title}</span>
        <span className="badge-meta">{badge.issuer}</span>
        <span className="badge-date">{badge.date}</span>
      </span>
    </>
  )

  const props = {
    className: 'badge-slot reveal reveal-up',
    style: {
      '--badge-accent': ACCENT[badge.color],
      '--badge-tilt': `${TILTS[index % TILTS.length]}deg`,
      '--reveal-delay': `${index * 110}ms`,
    },
  }

  return (
    <li>
      {badge.url ? (
        <a
          {...props}
          href={badge.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${badge.title}, ${badge.issuer}, ${badge.date} (opens verification)`}
        >
          {content}
        </a>
      ) : (
        <div {...props} aria-label={`${badge.title}, ${badge.issuer}, ${badge.date}`} role="img">
          {content}
        </div>
      )}
    </li>
  )
}

export default function BadgesSection() {
  const count = String(badges.length).padStart(2, '0')

  return (
    <section id="badges" className="badges-section" aria-labelledby="badges-title">
      <div className="badges-halftone" aria-hidden="true" />
      <div className="badges-header">
        <div>
          <div className="section-label reveal reveal-left">// ISSUE #10 — COLLECTOR&apos;S EDITION</div>
          <h2 id="badges-title" className="section-title" style={{ margin: 0 }}>
            <LetterReveal text="BADGES" variant="letter-pop" stagger={45} />
          </h2>
        </div>
        <div className="badges-tally" aria-label={`${badges.length} badges collected`}>
          <strong>{count}</strong> COLLECTED
          <span className="badges-tally-sub">AND COUNTING…</span>
        </div>
      </div>
      <p className="section-intro badges-intro">
        Every hero collects trophies. These are mine — earned one challenge at a time, with plenty of
        empty slots left to fill.
      </p>

      <ul className="badges-wall">
        {badges.map((b, i) => (
          <Badge key={b.id} badge={b} index={i} />
        ))}
        {Array.from({ length: EMPTY_SLOTS }, (_, i) => (
          <li key={`empty-${i}`} aria-hidden="true">
            <div
              className="badge-slot badge-slot--empty reveal reveal-up"
              style={{ '--reveal-delay': `${(badges.length + i) * 110}ms` }}
            >
              <span className="badge-empty-shape">?</span>
              <span className="badge-caption">
                <span className="badge-title">NEXT DROP</span>
                <span className="badge-meta">COMING SOON</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
