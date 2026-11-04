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
      'Designed and built the Radian Training Management System: scheduling, enrollment, instructor rosters, certificate issuance & expiry tracking, and an email/OTP student portal',
      'Building the Radian Security Management System: visual patrol-map editor, NFC checkpoint verification, incident reporting and AI-summarised daily reports',
      'Built and launched training.rhatt.com with a public certificate database and checker',
      'Spearheaded an organization-wide Odoo ERP rollout across Sales, Rental, Inventory, Purchasing, Accounting, CRM and Reporting, implementing and customizing modules and coordinating data migration and process redesign',
      'Managed internal dev work and coordinated a small team to redesign and maintain the company website',
      'Translated finance, logistics, warehouse, training and management requirements into software specifications and structured workflows; coordinated vendors and integration partners',
      'Analyzed business strategies, operational performance and existing workflows to identify process gaps, implementation risks and opportunities to improve productivity and service delivery',
      'Evaluated alternative approaches and presented practical recommendations to management to support strategic planning, system investment and operational decisions',
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
      'Monitored offshore crane operator performance against client KPIs and contract requirements; prepared structured reports for management and client review',
      'Developed and maintained an internal inventory tracking system to improve stock visibility and management',
      'Oversaw daily operational reporting — checklists, incident reports, and action logs',
      'Processed purchase orders, offshore payroll and invoices; facilitated operator performance meetings and follow-up actions',
      'Coordinated inspection schedules, maintenance follow-ups and resolution of operational issues among operators, supervisors and client representatives',
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
