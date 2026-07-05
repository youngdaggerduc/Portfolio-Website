import LetterReveal from './LetterReveal'

const SCHOOLS = [
  {
    name: 'University of the West Indies',
    sub: 'St. Augustine, Trinidad',
    qual: 'BSc Computer Science (Special)',
    grade: 'Second Class Honours',
    period: 'Sep 2021 – Sep 2024',
    color: 'cyan',
  },
  {
    name: 'Marabella North Secondary',
    sub: '6th Form',
    qual: 'CAPE Units 1 & 2',
    grade: 'Pure Maths · Physics · IT · Caribbean Studies · Comm. Studies',
    period: 'Sep 2018 – 2020',
    color: 'red',
  },
  {
    name: 'Marabella South Secondary',
    sub: '',
    qual: 'CXC / CSEC',
    grade: 'Maths · English · Physics · Biology · Chemistry · IT',
    period: 'Sep 2013 – 2018',
    color: 'mag',
  },
]

const ACCENT = {
  cyan: 'var(--cyan)',
  red: 'var(--red)',
  mag: 'var(--magenta)',
}

export default function EducationSection() {
  return (
    <section id="education" className="education-section">
      <div className="education-halftone" aria-hidden="true" />
      <div className="section-label reveal reveal-left">// ISSUE #03 — TRAINING ARC</div>
      <h2
        id="education-title"
        className="section-title"
        style={{ margin: 0, marginBottom: 48 }}
      >
        <LetterReveal text="EDUCATION" variant="letter-pop" stagger={45} />
      </h2>
      <div className="education-grid">
        {SCHOOLS.map((s, i) => {
          const accent = ACCENT[s.color]
          const headerColor = s.color === 'cyan' ? '#000' : '#fff'
          return (
            <div
              key={s.name}
              className="education-card reveal reveal-up"
              style={{ '--reveal-delay': `${i * 120}ms` }}
            >
              <div
                className="education-period"
                style={{ background: accent, color: headerColor }}
              >
                {s.period}
              </div>
              <div className="education-body">
                <div
                  className="education-name"
                  style={{ textShadow: `2px 0 0 ${accent}` }}
                >
                  {s.name}
                </div>
                {s.sub && <div className="education-sub">{s.sub}</div>}
                <div className="education-qual" style={{ color: accent }}>
                  {s.qual}
                </div>
                <div className="education-grade">{s.grade}</div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
