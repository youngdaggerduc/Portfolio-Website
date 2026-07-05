import { useEffect, useRef } from 'react'

export default function Modal({ project, onClose }) {
  const boxRef = useRef(null)

  // Focus management: remember the trigger, move focus into the dialog on
  // open, trap Tab inside it, and restore focus on close. Body scroll is
  // locked while open (same pattern as the mobile nav drawer).
  useEffect(() => {
    const previouslyFocused = document.activeElement
    document.body.style.overflow = 'hidden'
    boxRef.current?.querySelector('.modal-close')?.focus()

    const handler = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const focusables = boxRef.current?.querySelectorAll(
        'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusables?.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={boxRef}
        className="modal-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <span className="modal-title" id="modal-title">
            {project.title}
          </span>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>
        <div className="modal-body">
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.8,
              color: 'rgba(240,238,255,0.85)',
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
          {(project.github || project.live) && (
            <div style={{ display: 'flex', gap: 12 }}>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ fontSize: 16, padding: '10px 24px' }}
                >
                  VIEW CODE
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ fontSize: 16, padding: '10px 24px' }}
                >
                  LIVE DEMO
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
