import './App.css'
import Nav from './components/Nav'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import ProjectsSection from './components/ProjectsSection'
import SkillsSection from './components/SkillsSection'
import ContactSection from './components/ContactSection'
import WebCursor from './components/WebCursor'
import WebBackground from './components/WebBackground'
import Preloader from './components/Preloader'
import { useRevealObserver } from './hooks/useRevealObserver'
import { useSectionClipReveal } from './hooks/useSectionClipReveal'

function App() {
  useRevealObserver()
  useSectionClipReveal()

  return (
    <>
      <Preloader />
      <WebBackground />
      <WebCursor />
      <Nav />
      <main>
        <HeroSection />
        <div className="comic-divider" />
        <AboutSection />
        <div className="comic-divider cyan" />
        <ProjectsSection />
        <div className="comic-divider mag" />
        <SkillsSection />
        <div className="comic-divider" />
        <ContactSection />
      </main>
      <footer>
        <div className="footer-logo">PIERCE DOMAN</div>
        <div className="footer-copy">© 2026 — BUILT WITH FULL STACK ENERGY & AI VIBES</div>
      </footer>
    </>
  )
}

export default App
