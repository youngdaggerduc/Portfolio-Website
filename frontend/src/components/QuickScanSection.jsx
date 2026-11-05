import { DownloadIcon, LinkedInIcon } from './Icons'
import { LINKS } from '../data'

// The 10-second read for recruiters: everything needed to decide to keep
// scrolling, in one comic "dossier" strip.
const FACTS = [
  { k: 'Target Role', v: 'Full Stack Developer · Business Process Analyst · AI Engineer' },
  { k: 'Based In', v: 'Trinidad & Tobago (UTC−4) · Remote-ready' },
  { k: 'Available For', v: 'Full-time roles & freelance builds' },
  { k: 'Core Stack', v: 'React · Python · FastAPI · LangChain · Odoo · PostgreSQL' },
  {
    k: 'Proof',
    v: '4 live client sites · Training Management System in production · Odoo quotes cut from 45–60 to 2–8 min',
  },
]

export default function QuickScanSection() {
  return (
    <section id="quick-scan" className="quickscan" aria-labelledby="quickscan-title">
      <div className="quickscan-inner reveal reveal-up">
        <div className="quickscan-badge">
          <span className="quickscan-badge-top">RECRUITER</span>
          <span className="quickscan-badge-main" id="quickscan-title">
            QUICK SCAN
          </span>
          <span className="quickscan-badge-sub">10-second read</span>
        </div>
        <dl className="quickscan-facts">
          {FACTS.map((f) => (
            <div key={f.k} className="quickscan-fact">
              <dt>{f.k}</dt>
              <dd>{f.v}</dd>
            </div>
          ))}
        </dl>
        <div className="quickscan-actions">
          <a className="btn-primary quickscan-btn" href={LINKS.resume} download="Pierce Doman Resume.pdf">
            <DownloadIcon /> RESUME
          </a>
          <a className="btn-secondary quickscan-btn" href={LINKS.email}>
            EMAIL ME
          </a>
          <a
            className="quickscan-link"
            href={LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon /> LinkedIn
          </a>
        </div>
      </div>
    </section>
  )
}
