import { lazy, Suspense, useState } from 'react'
import { projects, PROJECT_FILTERS } from '../data'
import ProjectPlaceholder from './ProjectPlaceholder'
import SecurityMapVisual from './SecurityMapVisual'
import LetterReveal from './LetterReveal'
import { ExternalIcon } from './Icons'

const Modal = lazy(() => import('./Modal'))

const flagships = projects.filter((p) => p.featured)
const archive = projects.filter((p) => !p.featured)

function StatusBadge({ project }) {
  return (
    <span className={`status-badge status-badge--${project.status}`}>
      <span className="status-badge-dot" aria-hidden="true" />
      {project.statusLabel}
    </span>
  )
}

function StackTags({ project }) {
  return (
    <div className="project-stack">
      {project.stack.map((s) => (
        <span
          key={s}
          className={`stack-tag ${project.color === 'red' ? 'stack-tag-red' : ''}${project.color === 'mag' ? ' stack-tag-mag' : ''}`}
        >
          {s}
        </span>
      ))}
    </div>
  )
}

function LiveLink({ project, className = 'project-link project-link--live' }) {
  if (!project.live) return null
  return (
    <a
      className={className}
      href={project.live}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${project.title} live site (opens in a new tab)`}
    >
      LIVE SITE <ExternalIcon />
    </a>
  )
}

/** Large alternating case-file panel for the three flagship builds. */
function Flagship({ project, index, onOpen }) {
  return (
    <article
      className={`flagship flagship--${project.color} reveal reveal-up${index % 2 ? ' flagship--flip' : ''}`}
      aria-labelledby={`flagship-${project.id}`}
    >
      <div className="flagship-media">
        <span className="flagship-file" aria-hidden="true">
          CASE FILE #{String(index + 1).padStart(2, '0')}
        </span>
        {project.image ? (
          <div className="flagship-browser">
            <div className="flagship-browser-bar" aria-hidden="true">
              <span className="flagship-browser-dots">
                <i />
                <i />
                <i />
              </span>
              <span className="flagship-browser-url">{project.url}</span>
            </div>
            <img
              className="flagship-browser-img"
              src={project.image.src}
              srcSet={project.image.srcSet}
              sizes="(max-width: 1100px) 100vw, 55vw"
              width={project.image.w}
              height={project.image.h}
              alt={`${project.title} screenshot`}
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : (
          <SecurityMapVisual />
        )}
        {project.status === 'building' && (
          <span className="flagship-stamp" aria-hidden="true">
            IN DEVELOPMENT
          </span>
        )}
      </div>

      <div className="flagship-body">
        <div className="flagship-meta">
          <span className="flagship-kicker">
            {project.tag} · {project.year}
          </span>
          <StatusBadge project={project} />
        </div>
        <h3 className="flagship-title" id={`flagship-${project.id}`}>
          {project.title}
        </h3>
        <div className="flagship-role">
          <span>MY ROLE</span> {project.role}
        </div>
        <p className="flagship-desc">{project.desc}</p>
        <ul className="flagship-features">
          {project.features.slice(0, 4).map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <StackTags project={project} />
        <div className="flagship-actions">
          <button
            type="button"
            className="project-link"
            onClick={(e) =>
              onOpen(project, e.currentTarget.closest('.flagship').getBoundingClientRect())
            }
          >
            OPEN CASE FILE →
          </button>
          <LiveLink project={project} />
        </div>
      </div>
    </article>
  )
}

/** Compact archive card. The title button is stretched over the whole card
 *  so the card is clickable *and* keyboard-reachable, while the live link
 *  stays a separate, real link above it. */
function ArchiveCard({ project, index, onOpen }) {
  return (
    <article
      className={`project-card project-card--${project.color} reveal reveal-bounce`}
      style={{ '--reveal-delay': `${(index % 3) * 110}ms` }}
      data-tilt="6"
    >
      <div className="project-card-img">
        <div className="project-tag">
          {project.tag}
          {project.year ? ` · ${project.year}` : ''}
        </div>
        <ProjectPlaceholder
          color={project.color}
          image={project.image}
          icon={project.icon}
          title={project.title}
          contain={project.contain}
        />
      </div>
      <div className="project-card-content">
        <h4 className="project-title">
          <button
            type="button"
            className="project-card-open"
            onClick={(e) =>
              onOpen(project, e.currentTarget.closest('.project-card').getBoundingClientRect())
            }
          >
            {project.title}
          </button>
        </h4>
        <div className="project-role">{project.role}</div>
        <div className="project-desc">{project.desc}</div>
        <StackTags project={project} />
        <div className="project-card-actions">
          <span className="project-link project-link--ghost" aria-hidden="true">
            DETAILS →
          </span>
          <LiveLink project={project} />
        </div>
      </div>
    </article>
  )
}

export default function ProjectsSection() {
  const [modal, setModal] = useState(null)
  const [filter, setFilter] = useState('all')
  const open = (project, rect) => setModal({ project, rect })

  const shown = filter === 'all' ? archive : archive.filter((p) => p.category === filter)
  const counts = Object.fromEntries(
    PROJECT_FILTERS.map((f) => [
      f.id,
      f.id === 'all' ? archive.length : archive.filter((p) => p.category === f.id).length,
    ])
  )

  return (
    <section id="projects" className="projects-section" aria-labelledby="projects-title">
      <div className="section-label reveal reveal-left">// ISSUE #04 — CASE FILES</div>
      <h2 id="projects-title" className="section-title" style={{ margin: 0, marginBottom: 16 }}>
        <LetterReveal text="MY WORK" variant="letter-slam" stagger={50} />
      </h2>
      <p className="section-intro reveal reveal-up">
        Three flagship builds I&apos;m proudest of: real systems running real
        operations. Then the full archive of client sites, ERP work and experiments.
      </p>

      <div className="flagship-list">
        {flagships.map((p, i) => (
          <Flagship key={p.id} project={p} index={i} onOpen={open} />
        ))}
      </div>

      <div className="archive-head">
        <h3 className="archive-title">THE ARCHIVE</h3>
        <div className="archive-filters" role="group" aria-label="Filter projects">
          {PROJECT_FILTERS.filter((f) => counts[f.id] > 0).map((f) => (
            <button
              key={f.id}
              type="button"
              className={`filter-chip${filter === f.id ? ' is-active' : ''}`}
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
            >
              {f.label} <span className="filter-chip-count">{counts[f.id]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="projects-grid" key={filter}>
        {shown.map((p, i) => (
          <ArchiveCard key={p.id} project={p} index={i} onOpen={open} />
        ))}
      </div>

      {modal && (
        <Suspense fallback={null}>
          <Modal project={modal.project} originRect={modal.rect} onClose={() => setModal(null)} />
        </Suspense>
      )}
    </section>
  )
}
