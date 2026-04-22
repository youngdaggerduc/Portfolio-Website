import { useRef } from 'react'
import SwingingSpood from './SwingingSpood'

export default function AboutSection() {
  const sectionRef = useRef(null)

  const currently = [
    { dot: 'var(--cyan)', text: 'Building AI-powered web apps' },
    { dot: 'var(--red)', text: 'Exploring LangChain & RAG pipelines' },
    { dot: 'var(--magenta)', text: 'Open to new opportunities' },
  ]

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-section halftone-mag"
      aria-labelledby="about-title"
    >
      <SwingingSpood sectionRef={sectionRef} />
      <div className="corner-decor corner-tl" />
      <div
        className="corner-decor corner-br"
        style={{ borderColor: 'var(--cyan)' }}
      />
      <div className="section-label reveal reveal-left">// Chapter 01</div>
      <h2
        id="about-title"
        className="section-title reveal reveal-pow"
        style={{ margin: 0, marginBottom: 48 }}
      >
        ABOUT ME
      </h2>
      <div className="about-grid">
        <div className="comic-panel reveal reveal-left">
          <div className="comic-panel-header">ORIGIN STORY</div>
          <div className="comic-panel-body">
            <div className="about-text">
              <p>
                Hey, I'm <span className="highlight">Pierce Doman</span> — a full stack
                developer with a deep interest in{' '}
                <span className="highlight-red">AI Engineering</span>. I build end-to-end
                digital products that are fast, functional, and intelligent.
              </p>
              <p>
                From crafting slick React UIs to designing robust backend architectures, I
                love the full picture. Lately I've been deep in{' '}
                <span className="highlight">
                  LLMs, RAG pipelines, and AI-powered features
                </span>{' '}
                that actually make people's lives easier.
              </p>
              <p>
                When I'm not coding, I'm exploring how AI will reshape every industry — and
                making sure I'm the person building the tools that do it.
              </p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div className="stats-grid reveal reveal-right">
            <div
              className="stat-item reveal reveal-zoom"
              style={{ '--reveal-delay': '100ms' }}
            >
              <span className="stat-number">3+</span>
              <span className="stat-label">Projects Shipped</span>
            </div>
            <div
              className="stat-item reveal reveal-zoom"
              style={{ '--reveal-delay': '200ms' }}
            >
              <span className="stat-number" style={{ color: 'var(--cyan)' }}>
                10+
              </span>
              <span className="stat-label">Technologies</span>
            </div>
            <div
              className="stat-item reveal reveal-zoom"
              style={{ '--reveal-delay': '300ms' }}
            >
              <span className="stat-number" style={{ color: 'var(--magenta)' }}>
                AI
              </span>
              <span className="stat-label">Focus Area</span>
            </div>
            <div
              className="stat-item reveal reveal-zoom"
              style={{ '--reveal-delay': '400ms' }}
            >
              <span
                className="stat-number"
                style={{ color: 'var(--cyan)', fontSize: 36 }}
              >
                FS
              </span>
              <span className="stat-label">Full Stack</span>
            </div>
          </div>
          <div
            className="comic-panel reveal reveal-right"
            style={{ marginTop: 0, borderTop: 'none', '--reveal-delay': '150ms' }}
          >
            <div
              className="comic-panel-header"
              style={{ background: 'var(--cyan)', color: '#000' }}
            >
              CURRENTLY
            </div>
            <div className="comic-panel-body" style={{ padding: '16px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {currently.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      fontSize: 13,
                      color: 'rgba(240,238,255,0.8)',
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: item.dot,
                        flexShrink: 0,
                        boxShadow: `0 0 8px ${item.dot}`,
                      }}
                    />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
