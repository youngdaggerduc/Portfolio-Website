import { useEffect, useState } from 'react'

const LINKS = ['About', 'Experience', 'Projects', 'Skills', 'Contact']

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onResize = () => {
      if (window.innerWidth > 900) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('resize', onResize)
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <nav style={{ background: scrolled ? 'rgba(7,7,26,0.97)' : undefined }}>
      <div className="nav-logo">Pierce.exe_</div>

      <button
        type="button"
        className={`nav-burger${open ? ' is-open' : ''}`}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="primary-nav"
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      <ul
        id="primary-nav"
        className={`nav-links${open ? ' is-open' : ''}`}
      >
        {LINKS.map((s) => (
          <li key={s}>
            <a href={`#${s.toLowerCase()}`} onClick={close}>
              {s}
            </a>
          </li>
        ))}
        <li>
          <a href="#/games" className="nav-games" onClick={close}>
            🎮 AI GAMES
          </a>
        </li>
        <li>
          <a href="#/chatbot" className="nav-ask-ai" onClick={close}>
            🕷️ ASK AI
          </a>
        </li>
      </ul>
    </nav>
  )
}
