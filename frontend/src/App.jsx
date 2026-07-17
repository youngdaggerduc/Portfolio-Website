import { useEffect, useState } from 'react'
import './App.css'
import './motion.css'
import Nav from './components/Nav'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import ExperienceSection from './components/ExperienceSection'
import EducationSection from './components/EducationSection'
import ProjectsSection from './components/ProjectsSection'
import CertsSection from './components/CertsSection'
import SkillsSection from './components/SkillsSection'
import ContactSection from './components/ContactSection'
import BehindTheMaskSection from './components/BehindTheMaskSection'
import GamesCalloutSection from './components/GamesCalloutSection'
import SpiderCommStrip from './components/SpiderCommStrip'
import WebCursor from './components/WebCursor'
import SiteBackground from './components/SiteBackground'
import WebSpine from './components/WebSpine'
import RouteWipe from './components/RouteWipe'
import Preloader from './components/Preloader'
import ChatbotPage from './components/ChatbotPage'
import GamesPage from './components/GamesPage'
import { useRevealObserver } from './hooks/useRevealObserver'
import { useSectionClipReveal } from './hooks/useSectionClipReveal'
import { useMotionStage } from './hooks/useMotionStage'

function useHashRoute() {
  const [hash, setHash] = useState(() =>
    typeof window !== 'undefined' ? window.location.hash : ''
  )
  useEffect(() => {
    const onHash = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return hash
}

function Portfolio() {
  useRevealObserver()
  useSectionClipReveal()
  useMotionStage()

  return (
    <>
      <Preloader />
      <SiteBackground />
      <WebSpine />
      <WebCursor />
      <Nav />
      <main>
        <HeroSection />
        <SpiderCommStrip />
        <div className="comic-divider" />
        <AboutSection />
        <div className="comic-divider cyan" />
        <ExperienceSection />
        <div className="comic-divider" />
        <EducationSection />
        <div className="comic-divider mag divider-burst">
          <span className="divider-burst-word" aria-hidden="true">THWIP!</span>
        </div>
        <ProjectsSection />
        <div className="comic-divider cyan" />
        <CertsSection />
        <div className="comic-divider mag" />
        <SkillsSection />
        <div className="comic-divider" />
        <SpiderCommStrip variant="reprise" />
        <ContactSection />
        <div className="comic-divider cyan" />
        <BehindTheMaskSection />
        <div className="comic-divider mag divider-burst">
          <span className="divider-burst-word" aria-hidden="true">WHAM!</span>
        </div>
        <GamesCalloutSection />
      </main>
      <footer>
        <div className="footer-continued" aria-hidden="true">TO BE CONTINUED…</div>
        <div className="footer-logo">PIERCE DOMAN</div>
        <div className="footer-copy">
          © {new Date().getFullYear()} — BUILT WITH FULL STACK ENERGY & AI VIBES
        </div>
      </footer>
    </>
  )
}

const TITLES = {
  '#/chatbot': 'Spider-Comm AI Chatbot — Pierce Doman',
  '#/games': 'AI Games — Pierce Doman',
}
const DEFAULT_TITLE = 'Pierce Doman — Full Stack Developer & AI Engineer'

function App() {
  const hash = useHashRoute()

  useEffect(() => {
    document.title = TITLES[hash] ?? DEFAULT_TITLE
  }, [hash])

  const route =
    hash === '#/chatbot' ? 'chatbot' : hash === '#/games' ? 'games' : 'portfolio'

  return (
    <>
      {route === 'chatbot' && <ChatbotPage />}
      {route === 'games' && <GamesPage />}
      {route === 'portfolio' && <Portfolio />}
      <RouteWipe routeKey={route} />
    </>
  )
}

export default App
