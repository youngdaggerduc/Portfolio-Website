import { lazy, Suspense, useState } from 'react'
import { projects } from '../data'
import ProjectPlaceholder from './ProjectPlaceholder'
import LetterReveal from './LetterReveal'

const Modal = lazy(() => import('./Modal'))

export default function ProjectsSection() {
  const [modal, setModal] = useState(null)

  return (
    <section
      id="projects"
      className="projects-section"
      aria-labelledby="projects-title"
    >
      <div className="section-label reveal reveal-left">// ISSUE #04 — CASE FILES</div>
      <h2
        id="projects-title"
        className="section-title"
        style={{ margin: 0, marginBottom: 48 }}
      >
        <LetterReveal text="MY WORK" variant="letter-slam" stagger={50} />
      </h2>
      <div className="projects-grid">
        {projects.map((p, i) => (
          <div
            key={p.id}
            className="project-card reveal reveal-bounce"
            style={{ '--reveal-delay': `${i * 140}ms` }}
            data-tilt="8"
            onClick={(e) =>
              setModal({ project: p, rect: e.currentTarget.getBoundingClientRect() })
            }
          >
            <div className="project-card-img">
              <div className="project-tag">{p.tag}</div>
              <ProjectPlaceholder color={p.color} image={p.image} title={p.title} />
            </div>
            <div className="project-card-content">
              <div className="project-title">{p.title}</div>
              <div className="project-desc">{p.desc}</div>
              <div className="project-stack">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className={`stack-tag ${p.color === 'red' ? 'stack-tag-red' : ''}`}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <button
                className="project-link"
                onClick={(e) => {
                  e.stopPropagation()
                  setModal({
                    project: p,
                    rect: e.currentTarget.closest('.project-card').getBoundingClientRect(),
                  })
                }}
              >
                VIEW PROJECT →
              </button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Suspense fallback={null}>
          <Modal
            project={modal.project}
            originRect={modal.rect}
            onClose={() => setModal(null)}
          />
        </Suspense>
      )}
    </section>
  )
}
