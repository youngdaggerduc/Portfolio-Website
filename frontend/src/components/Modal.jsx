import { useEffect } from 'react'

export default function Modal({ project, onClose }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-box">
        <div className="modal-header">
          <span className="modal-title">{project.title}</span>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>
        <div className="modal-body">
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.8,
              color: 'rgba(240,238,255,0.8)',
              marginBottom: 20,
            }}
          >
            {project.details}
          </p>
          <div className="project-stack" style={{ marginBottom: 20 }}>
            {project.stack.map((s) => (
              <span
                key={s}
                className={`stack-tag ${project.color === 'red' ? 'stack-tag-red' : ''}`}
              >
                {s}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <a
              href="#"
              className="btn-primary"
              style={{ fontSize: 16, padding: '10px 24px' }}
            >
              VIEW CODE
            </a>
            <a
              href="#"
              className="btn-secondary"
              style={{ fontSize: 16, padding: '10px 24px' }}
            >
              LIVE DEMO
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
