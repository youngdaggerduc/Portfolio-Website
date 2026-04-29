import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const LINKS = ['About', 'Experience', 'Projects', 'Skills', 'Contact']

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 900
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    const onResize = () => setIsMobile(window.innerWidth <= 900)
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
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

  const linksList = (
    <ul id="primary-nav" className={`nav-links${open ? ' is-open' : ''}`}>
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
  )

  return (
    <>
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

        {/* Desktop: drawer lives inside the nav (horizontal list).
            Mobile: it's portaled to <body> below so it escapes nav's
            stacking context and isn't clipped by the fixed nav bar. */}
        {!isMobile && linksList}
      </nav>
      {isMobile && typeof document !== 'undefined' &&
        createPortal(linksList, document.body)}
    </>
  )
}
