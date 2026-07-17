import { useEffect, useRef } from 'react'
import { loadGsap, prefersReducedMotion } from '../lib/motion'

export default function Modal({ project, originRect, onClose }) {
  const boxRef = useRef(null)

  // FLIP entrance: expand the panel out of the card the user clicked. The
  // card stays in the DOM behind the overlay, so we just tween the box from
  // that rect to its natural position. Skipped under reduced motion.
  useEffect(() => {
    if (prefersReducedMotion() || !originRect) return undefined
    let killed = false
    loadGsap().then(({ gsap }) => {
      const box = boxRef.current
      if (killed || !box) return
      const r = box.getBoundingClientRect()
      const dx = originRect.left + originRect.width / 2 - (r.left + r.width / 2)
      const dy = originRect.top + originRect.height / 2 - (r.top + r.height / 2)
      gsap.fromTo(
        box,
        {
          x: dx,
          y: dy,
          scaleX: originRect.width / r.width,
          scaleY: originRect.height / r.height,
          opacity: 0.5,
        },
        { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1, duration: 0.45, ease: 'power3.out' }
      )
      gsap.fromTo('.modal-overlay', { opacity: 0 }, { opacity: 1, duration: 0.25 })
    })
    return () => {
      killed = true
    }
  }, [originRect])

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
