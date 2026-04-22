import { useState } from 'react'
import { projects } from '../data'
import Modal from './Modal'
import ProjectPlaceholder from './ProjectPlaceholder'

export default function ProjectsSection() {
  const [modal, setModal] = useState(null)

  return (
    <section
      id="projects"
      className="projects-section"
      aria-labelledby="projects-title"
    >
      <div className="section-label reveal reveal-left">// Chapter 02</div>
      <h2
        id="projects-title"
        className="section-title reveal reveal-pow"
        style={{ margin: 0, marginBottom: 48 }}
      >
        MY WORK
      </h2>
      <div className="projects-grid">
        {projects.map((p, i) => (
          <div
            key={p.id}
            className="project-card reveal reveal-bounce"
            style={{ '--reveal-delay': `${i * 140}ms` }}
            onClick={() => setModal(p)}
          >
            <div className="project-card-img">
              <div className="project-tag">{p.tag}</div>
              <ProjectPlaceholder color={p.color} icon={p.icon} />
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
                  setModal(p)
                }}
              >
                VIEW PROJECT →
              </button>
            </div>
          </div>
        ))}
      </div>
      {modal && <Modal project={modal} onClose={() => setModal(null)} />}
    </section>
  )
}
