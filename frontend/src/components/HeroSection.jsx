export default function HeroSection() {
  return (
    <section id="hero" className="hero">
      <video
        className="hero-video"
        src="/piercespood.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="hero-video-overlay" />
      <div className="hero-halftone" />
      <div className="hero-content">
        <div className="hero-eyebrow">// Full Stack Dev & AI Engineer</div>
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
        <p className="hero-tagline">
          I'm a full stack developer with a keen interest in AI Engineering. I build
          products that ship — from smart booking systems to intelligent pipelines.
        </p>
        <div className="hero-ctas">
          <a href="#projects" className="btn-primary">
            SEE MY WORK
          </a>
          <a href="#contact" className="btn-secondary">
            GET IN TOUCH
          </a>
        </div>
      </div>
      <div className="scroll-indicator">
        <div className="scroll-line" />
        <span className="scroll-text">Scroll Down</span>
      </div>
    </section>
  )
}
