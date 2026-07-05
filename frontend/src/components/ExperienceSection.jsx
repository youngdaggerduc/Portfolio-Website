import LetterReveal from './LetterReveal'

const JOBS = [
  {
    company: 'Radian H.A. Limited',
    role: 'Business Process Analyst',
    period: 'Apr 2025 – Present',
    color: 'cyan',
    tag: 'Current',
    bullets: [
      'Led and delivered 5 previously stalled strategic projects incl. corporate website redevelopment and full-scale Odoo ERP implementation',
      'Implemented and customized Odoo ERP — Accounting, Sales, CRM, Rental Operations, and Reporting modules',
      'Managed internal dev work and coordinated a small team to redesign and maintain the company website',
      'Translated complex operational requirements into structured system workflows, improving efficiency across departments',
      'Introduced AI and automation tools across the organization and trained employees on their adoption',
      'Authored and published two books; contributed to a third through content, design, and publication support',
    ],
  },
  {
    company: 'Pyramid Engineering',
    role: 'Operations Coordinator',
    period: 'Sep 2024 – Apr 2025',
    color: 'red',
    tag: 'Previous',
    bullets: [
      'Managed offshore crane operator performance tracking in compliance with client KPI and contract requirements',
      'Developed and maintained an internal inventory tracking system to improve stock visibility and management',
      'Oversaw daily operational reporting — checklists, incident reports, and action logs',
      'Managed purchase orders, offshore payroll processing, and invoice preparation',
      'Coordinated inspection schedules, maintenance follow-ups, and operational reporting',
    ],
  },
]

export default function ExperienceSection() {
  return (
    <section id="experience" className="experience-section">
      <div className="experience-halftone" aria-hidden="true" />
      <div
        className="corner-decor corner-tl"
        style={{ borderColor: 'var(--cyan)' }}
      />
      <div className="section-label reveal reveal-left">// ISSUE #02 — FIELD WORK</div>
      <h2
        id="experience-title"
        className="section-title"
        style={{ margin: 0, marginBottom: 48 }}
      >
        <LetterReveal text="EXPERIENCE" variant="letter-pop" stagger={45} />
      </h2>
      <div className="experience-stack">
        {JOBS.map((job, ji) => (
          <div
            key={job.company}
            className={`job-row job-row--${job.color} reveal reveal-${ji % 2 === 0 ? 'left' : 'right'}`}
            style={{ '--reveal-delay': `${ji * 120}ms` }}
          >
            <div className="job-meta">
              <div className="job-tag">{job.tag}</div>
              <div className="job-company">{job.company}</div>
              <div className="job-role">{job.role}</div>
              <div className="job-period">{job.period}</div>
            </div>
            <div className="job-bullets">
              <ul>
                {job.bullets.map((b, i) => (
                  <li key={i}>
                    <span className="job-bullet-tick">▸</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
