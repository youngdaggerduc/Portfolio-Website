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
      'Designed and built the Radian Training Management System, live in Trinidad and fully built for Guyana and Suriname: lead CRM, payment plans, invoicing with per-branch VAT, certificate issuance & recertification, and a student/company portal',
      'Built the Radian Security Management System, now mostly complete and awaiting deployment approval: admin command center and mobile guard app with a patrol-map editor, NFC checkpoints, live GPS tracking, incidents and real-time alerts',
      'Built and launched training.rhatt.com with a public certificate database and checker',
      'Led the internal Odoo ERP rollout off a failing Microsoft Access system and spreadsheets, covering Sales & Quotations, Rental, Inventory, Purchasing, Accounting, CRM, Reporting, Contacts, Fleet, delivery notes and picking tickets; comparable quotes went from ~45–60 to ~2–8 minutes',
      'Ran requirements, legacy data cleanup, vendor coordination, testing and staff training for a single-date go-live, then refined vendor-built Odoo modules to fit in-house workflows',
      'Reconciled a large industrial scaffolding rental job: cross-checked thousands of spreadsheet lines against delivery notes and picking tickets so both parties agreed the final bill and the job closed and was paid',
      'Led the rhatt.com redevelopment and built its bespoke WordPress theme: a ~1,700-product WooCommerce quote catalogue and an AI product advisor grounded on catalogue + Odoo sales data',
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
      'Coordinated offshore crane operations for Perenco: daily communication with crane operators and client representatives',
      'Monitored crane time tickets and operator performance against client KPIs and contract requirements; prepared structured reports for management and client review',
      'Sourced and followed up on replacement crane parts; helped coordinate equipment and personnel logistics with maintenance and technical teams',
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
