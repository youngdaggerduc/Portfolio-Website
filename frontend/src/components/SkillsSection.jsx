import { skills } from '../data'
import LetterReveal from './LetterReveal'

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="skills-section"
      aria-labelledby="skills-title"
    >
      {/* Phones get a 12 KB still frame instead of the 3.9 MB animation. */}
      <picture>
        <source media="(max-width: 900px)" srcSet="/spoodhand-still.webp" />
        <img
          src="/spoodhand.webp"
          alt=""
          aria-hidden="true"
          decoding="async"
          loading="lazy"
          className="tech-stack-spood"
        />
      </picture>
      <div className="section-label reveal reveal-left">// ISSUE #07 — THE ARSENAL</div>
      <h2
        id="skills-title"
        className="section-title"
        style={{ margin: 0, marginBottom: 48 }}
      >
        <LetterReveal text="TECH STACK" variant="letter-fan" stagger={40} />
      </h2>
      <div className="skills-grid">
        {skills.map((cat, i) => (
          <div
            key={cat.cat}
            className="skill-category reveal reveal-flip"
            style={{ '--reveal-delay': `${i * 90}ms` }}
          >
            <div className="skill-cat-header">
              <div className={`skill-cat-dot ${cat.dot}`} />
              {cat.cat}
            </div>
            <div className="skill-pills">
              {cat.pills.map((p) => (
                <span
                  key={p.l}
                  className={`skill-pill ${p.c}${p.core ? ' skill-pill--core' : ''}`}
                >
                  {p.l}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
