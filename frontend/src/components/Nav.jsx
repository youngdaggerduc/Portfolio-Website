import { useEffect, useState } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{ background: scrolled ? 'rgba(7,7,26,0.97)' : undefined }}>
      <div className="nav-logo">Pierce.exe_</div>
      <ul className="nav-links">
        {['About', 'Projects', 'Skills', 'Contact'].map((s) => (
          <li key={s}>
            <a href={`#${s.toLowerCase()}`}>{s}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
