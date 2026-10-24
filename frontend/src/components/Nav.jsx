import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { GamepadIcon, SpiderIcon } from './Icons'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'GitHub', href: '#github' },
  { label: 'Certs', href: '#certs' },
  { label: 'Contact', href: '#contact' },
]

// Must match the burger breakpoint in App.css.
const DRAWER_BP = 1100

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= DRAWER_BP
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    const onResize = () => setIsMobile(window.innerWidth <= DRAWER_BP)
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
      if (window.innerWidth > DRAWER_BP) setOpen(false)
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
      {LINKS.map((l) => (
        <li key={l.href}>
          <a href={l.href} onClick={close}>
            {l.label}
          </a>
        </li>
      ))}
      <li>
        <a href="#/games" className="nav-games" onClick={close}>
          <GamepadIcon /> AI GAMES
        </a>
      </li>
      <li>
        <a href="#/chatbot" className="nav-ask-ai" onClick={close}>
          <SpiderIcon /> ASK AI
        </a>
      </li>
    </ul>
  )

  return (
    <>
      <nav style={{ background: scrolled ? 'rgba(7,7,26,0.97)' : undefined }}>
        <a href="#hero" className="nav-logo" aria-label="Pierce Doman, back to top">
          Pierce.exe_
        </a>

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
