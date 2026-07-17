import { useEffect, useRef } from 'react'
import TypedText from './TypedText'
import { stats } from '../data'

const STAT_COLORS = {
  red: 'var(--red)',
  cyan: 'var(--cyan)',
  mag: 'var(--magenta)',
}

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
    <section id="hero" className="hero">
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
            text="// BSc Computer Science · UWI St. Augustine"
            speed={35}
            startDelay={250}
            scramble
          />
        </div>
        <h1 className="hero-name">
          <span>PIERCE</span>
          <span className="glitch-layer-1" aria-hidden="true">
            PIERCE
          </span>
          <span className="glitch-layer-2" aria-hidden="true">
            PIERCE
          </span>
          <br />
          <span>DOMAN</span>
          <span className="glitch-layer-1" aria-hidden="true">
            DOMAN
          </span>
          <span className="glitch-layer-2" aria-hidden="true">
            DOMAN
          </span>
        </h1>

        <div className="hero-role-row">
          <div className="hero-role-pill red">FULL STACK</div>
          <div className="hero-role-pill dark">✦</div>
          <div className="hero-role-pill cyan">AI ENGINEER</div>
        </div>
        <div className="hero-role-row" style={{ marginTop: 4 }}>
          <div className="hero-role-pill red">FREELANCER</div>
          <div className="hero-role-pill dark">✦</div>
          <div className="hero-role-pill cyan">PROCESS ANALYST</div>
        </div>

        <p className="hero-tagline">
          Building end-to-end digital products — from AI-powered pipelines to full-stack
          web apps. Based in Trinidad &amp; Tobago, shipping globally.
        </p>
      </div>

      <div className="hero-center" aria-hidden="true">
        <div className="hero-center-spot" />
        <div className="hero-center-glow" />
      </div>

      <div className="hero-right">
        <div className="hero-stats-row">
          {stats.map((s) => (
            <div key={s.l} className="hero-stat">
              <span className="hero-stat-n" style={{ color: STAT_COLORS[s.c] }}>
                {s.n}
              </span>
              <span className="hero-stat-l">{s.l}</span>
            </div>
          ))}
        </div>

        <div className="hero-ctas">
          <a
            href="#projects"
            className="btn-primary"
            style={{ textAlign: 'center' }}
            data-magnetic="0.4"
          >
            SEE MY WORK
          </a>
          <a
            href="#contact"
            className="btn-secondary"
            style={{ textAlign: 'center' }}
            data-magnetic="0.4"
          >
            GET IN TOUCH
          </a>
          <a
            href="/pierce-doman-resume.pdf"
            download="Pierce Doman Resume.pdf"
            className="btn-secondary"
            style={{
              borderColor: 'var(--magenta)',
              color: 'var(--magenta)',
              boxShadow: '4px 4px 0 var(--magenta)',
              textAlign: 'center',
            }}
          >
            DOWNLOAD CV
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

      <div className="scroll-indicator">
        <div className="scroll-line" />
        <span className="scroll-text">Scroll Down</span>
      </div>
    </section>
  )
}
