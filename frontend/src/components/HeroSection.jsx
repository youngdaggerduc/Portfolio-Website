import { useEffect, useRef } from 'react'
import TypedText from './TypedText'
import RotatingWords from './RotatingWords'
import { DownloadIcon, GitHubIcon, LinkedInIcon } from './Icons'
import { LINKS } from '../data'

const BUILDS = [
  'AI PIPELINES',
  'ERP PLATFORMS',
  'SECURITY SYSTEMS',
  'FULL-STACK APPS',
  'TRAINING PLATFORMS',
]

export default function HeroSection() {
  const videoRef = useRef(null)

  // iOS Safari sometimes refuses autoplay even with the right attributes —
  // most often because React hasn't set `muted` on the DOM property by the
  // time the browser evaluates the autoplay policy, or because the user is
  // in Low Power Mode. We set the props directly on the element after mount
  // and call .play() explicitly. If autoplay is hard-blocked (Low Power
  // Mode), we listen for the first touch/click anywhere on the page and
  // start playback then — works around the "play button overlay" symptom.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return undefined
    v.muted = true
    v.defaultMuted = true
    v.playsInline = true
    v.setAttribute('webkit-playsinline', '')
    const tryPlay = () => v.play().catch(() => {})
    tryPlay()
    const onFirstTouch = () => {
      tryPlay()
      window.removeEventListener('touchstart', onFirstTouch)
      window.removeEventListener('click', onFirstTouch)
    }
    window.addEventListener('touchstart', onFirstTouch, { passive: true })
    window.addEventListener('click', onFirstTouch)
    return () => {
      window.removeEventListener('touchstart', onFirstTouch)
      window.removeEventListener('click', onFirstTouch)
    }
  }, [])

  return (
    <section id="hero" className="hero" aria-labelledby="hero-name">
      <video
        ref={videoRef}
        className="hero-video"
        src="/piercespood.mp4"
        poster="/hero-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        controls={false}
        aria-hidden="true"
      />
      <div className="hero-video-vignette" />
      <div className="hero-halftone" />
      <div className="hero-spotlight" />

      <div className="hero-left">
        <div className="hero-eyebrow">
          <TypedText
            text="// BSc Computer Science · UWI"
            speed={35}
            startDelay={250}
            scramble
          />
        </div>
        <h1 className="hero-name" id="hero-name" aria-label="Pierce Doman">
          <span aria-hidden="true">PIERCE</span>
          <span className="glitch-layer-1" aria-hidden="true">
            PIERCE
          </span>
          <span className="glitch-layer-2" aria-hidden="true">
            PIERCE
          </span>
          <br />
          <span aria-hidden="true">DOMAN</span>
          <span className="glitch-layer-1" aria-hidden="true">
            DOMAN
          </span>
          <span className="glitch-layer-2" aria-hidden="true">
            DOMAN
          </span>
        </h1>

        <div className="hero-role-row">
          {/* Two roles, one slot: a comic wipe swaps them on a loop (CSS-only). */}
          <div
            className="hero-role-pill role-swipe"
            role="text"
            aria-label="Full Stack Developer and Business Process Analyst"
          >
            <span className="role-swipe-label role-swipe-a" aria-hidden="true">
              FULL STACK DEVELOPER
            </span>
            <span className="role-swipe-label role-swipe-b" aria-hidden="true">
              BUSINESS PROCESS ANALYST
            </span>
            <span className="role-swipe-bar" aria-hidden="true" />
          </div>
          <div className="hero-role-pill cyan">AI ENGINEER</div>
        </div>

        <p className="hero-builds">
          <span className="hero-builds-lead">I BUILD</span>{' '}
          <RotatingWords words={BUILDS} className="hero-builds-word" />
        </p>

        <p className="hero-tagline">
          End-to-end products, from AI pipelines and ERP platforms to full-stack web
          apps. Based in Trinidad &amp; Tobago, shipping globally.
        </p>
      </div>

      <div className="hero-center" aria-hidden="true">
        <div className="hero-center-spot" />
        <div className="hero-center-glow" />
      </div>

      <div className="hero-right">
        <div className="hero-status">
          <span className="hero-status-dot" aria-hidden="true" />
          <span>
            <strong>OPEN TO ROLES</strong>
            <span className="hero-status-sub">Full-time · Freelance · Remote</span>
          </span>
        </div>

        <div className="hero-ctas">
          <a href="#projects" className="btn-primary" data-magnetic="0.4">
            SEE MY WORK
          </a>
          <a href="#contact" className="btn-secondary" data-magnetic="0.4">
            GET IN TOUCH
          </a>
        </div>

        <div className="hero-quicklinks">
          <a href={LINKS.resume} download="Pierce Doman Resume.pdf">
            <DownloadIcon /> CV
          </a>
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer">
            <GitHubIcon /> GitHub
          </a>
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">
            <LinkedInIcon /> LinkedIn
          </a>
        </div>

        <div className="hero-responsibility">
          <span>
            With Great Code Comes
            <br />
            Great Responsibility
          </span>
        </div>
      </div>

      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-line" />
        <span className="scroll-text">Scroll Down</span>
      </div>
    </section>
  )
}
