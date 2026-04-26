import { useEffect, useRef, useState } from 'react'
import './ChatbotPage.css'

const SUGGESTIONS = [
  "What's Pierce's current job?",
  'Tell me about the Odoo ERP project',
  'What AI skills does Pierce have?',
  'What was his final year project?',
  'Where did Pierce study?',
  'What projects has he shipped?',
  'Is Pierce available for freelance work?',
  'What programming languages does he know?',
]

function WebCornerSVG({ size = 140, color = 'rgba(240,238,255,0.15)', flip = false, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      style={{ position: 'absolute', pointerEvents: 'none', ...style }}
    >
      <g transform={flip ? 'scale(-1,1) translate(-120,0)' : ''}>
        {[0, 18, 36, 54, 72, 90].map((a) => {
          const rad = (a * Math.PI) / 180
          return (
            <line
              key={a}
              x1="0"
              y1="0"
              x2={120 * Math.cos(rad)}
              y2={120 * Math.sin(rad)}
              stroke={color}
              strokeWidth="1.2"
            />
          )
        })}
        {[20, 42, 64, 86, 108].map((r) => (
          <path
            key={r}
            d={`M${r} 0 A${r} ${r} 0 0 1 0 ${r}`}
            stroke={color}
            strokeWidth="1.2"
            fill="none"
          />
        ))}
      </g>
    </svg>
  )
}

function SpiderSymbolSVG({ size = 48, color = 'var(--red)', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      <ellipse cx="24" cy="26" rx="7" ry="11" fill={color} opacity="0.9" />
      <ellipse cx="24" cy="18" rx="5" ry="7" fill={color} />
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([sx, sy], i) => (
        <path
          key={i}
          d={`M${24 + sx * 6} ${24 + sy * 2} Q${24 + sx * 18} ${24 + sy * 8} ${24 + sx * 22} ${24 + sy * 18}`}
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      ))}
      {[[-1, 0], [1, 0]].map(([sx], i) => (
        <path
          key={i + 4}
          d={`M${24 + sx * 7} 27 Q${24 + sx * 20} 29 ${24 + sx * 24} 24`}
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      ))}
    </svg>
  )
}

function SpiderAvatar() {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        background: 'var(--red)',
        border: '2px solid #000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '2px 2px 0 #000',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
        <ellipse cx="24" cy="26" rx="7" ry="11" fill="white" opacity="0.9" />
        <ellipse cx="24" cy="18" rx="5" ry="7" fill="white" />
        {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([sx, sy], i) => (
          <path
            key={i}
            d={`M${24 + sx * 6} ${24 + sy * 2} Q${24 + sx * 18} ${24 + sy * 8} ${24 + sx * 22} ${24 + sy * 18}`}
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        ))}
        {[[-1, 0], [1, 0]].map(([sx], i) => (
          <path
            key={i + 4}
            d={`M${24 + sx * 7} 27 Q${24 + sx * 20} 29 ${24 + sx * 24} 24`}
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        ))}
      </svg>
    </div>
  )
}

function UserAvatar() {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        background: '#000',
        border: '2px solid var(--cyan)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '2px 2px 0 var(--cyan)',
      }}
    >
      <span
        style={{
          fontFamily: 'Bangers',
          fontSize: '16px',
          letterSpacing: '1px',
          color: 'var(--cyan)',
        }}
      >
        PD
      </span>
    </div>
  )
}

function SidebarPortrait() {
  return (
    <div className="spider-portrait">
      <div className="portrait-halftone" />
      <SpiderSymbolSVG
        size={130}
        color="rgba(232,25,44,0.3)"
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <div
          style={{
            fontFamily: 'Bangers',
            fontSize: '48px',
            letterSpacing: '4px',
            color: 'var(--red)',
            textShadow: '2px 0 0 var(--cyan), -2px 0 0 var(--magenta)',
            lineHeight: 1,
            animation: 'neonFlicker 5s infinite',
          }}
        >
          PD
        </div>
        <div
          style={{
            fontFamily: 'Bangers',
            fontSize: '13px',
            letterSpacing: '3px',
            color: 'var(--white)',
            opacity: 0.8,
          }}
        >
          SPIDER-COMM
        </div>
        <div style={{ position: 'absolute', bottom: 16, right: 16, width: 28, height: 28 }}>
          {[0, 0.5, 1].map((d) => (
            <div
              key={d}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '2px solid var(--red)',
                animation: `chatSpiderSense 1.8s ${d}s ease-out infinite`,
              }}
            />
          ))}
        </div>
      </div>
      <WebCornerSVG size={70} color="rgba(232,25,44,0.35)" style={{ top: 0, left: 0 }} />
      <WebCornerSVG size={70} color="rgba(0,212,255,0.3)" flip style={{ top: 0, right: 0 }} />
    </div>
  )
}

function MessageBubble({ msg }) {
  const isAI = msg.role === 'assistant'
  return (
    <div className={`msg-row ${isAI ? 'ai' : 'user'}`}>
      {isAI ? <SpiderAvatar /> : <UserAvatar />}
      <div className="msg-bubble-wrap">
        <span className="msg-sender">{isAI ? 'SPIDER-PD' : 'YOU'}</span>
        <div className={`msg-bubble ${isAI ? 'ai' : 'user'}`}>{msg.content}</div>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="msg-row ai">
      <SpiderAvatar />
      <div className="msg-bubble-wrap">
        <span className="msg-sender">SPIDER-PD</span>
        <div className="typing-bubble">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  )
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    document.body.classList.add('chatbot-active')
    return () => document.body.classList.remove('chatbot-active')
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text) => {
    const userText = (text ?? input).trim()
    if (!userText || loading) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userText }])
    setLoading(true)

    const appendDelta = (delta) => {
      setMessages((prev) => {
        const last = prev[prev.length - 1]
        if (!last || last.role !== 'assistant') {
          return [...prev, { role: 'assistant', content: delta }]
        }
        const next = [...prev]
        next[next.length - 1] = { ...last, content: last.content + delta }
        return next
      })
    }

    try {
      const sid = localStorage.getItem('spiderpd_session_id') || undefined
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, session_id: sid }),
      })
      if (!res.ok) {
        let detail = ''
        try {
          const j = await res.json()
          detail = j.detail || ''
        } catch {
          /* non-JSON error body */
        }
        throw new Error(detail || `HTTP ${res.status}`)
      }
      if (!res.body) throw new Error('No response stream')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        let sep
        while ((sep = buffer.indexOf('\n\n')) !== -1) {
          const raw = buffer.slice(0, sep)
          buffer = buffer.slice(sep + 2)
          let evt = 'message'
          let data = ''
          for (const line of raw.split('\n')) {
            if (line.startsWith('event: ')) evt = line.slice(7).trim()
            else if (line.startsWith('data: ')) data += line.slice(6)
          }
          if (!data) continue
          let payload
          try {
            payload = JSON.parse(data)
          } catch {
            continue
          }
          if (evt === 'session' && payload.session_id) {
            localStorage.setItem('spiderpd_session_id', payload.session_id)
          } else if (evt === 'token' && payload.text) {
            if (loading) setLoading(false)
            appendDelta(payload.text)
          } else if (evt === 'error') {
            throw new Error(payload.message || 'Stream error')
          }
        }
      }
    } catch (err) {
      const msg = `Spider-sense malfunction — ${err.message}. Try again in a sec.`
      setMessages((prev) => {
        const last = prev[prev.length - 1]
        if (last && last.role === 'assistant') {
          const next = [...prev]
          next[next.length - 1] = { ...last, content: `${last.content}\n\n${msg}` }
          return next
        }
        return [...prev, { role: 'assistant', content: msg }]
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="chatbot-shell">
      <div className="top-nav">
        <a href="#/" className="nav-back">
          ← BACK
        </a>
        <div className="nav-title">SPIDER-COMM</div>
        <div className="nav-status">
          <div className="status-dot" />
          <span>ONLINE</span>
        </div>
      </div>

      <div className="main-area">
        <div className="sidebar">
          <div className="sidebar-header">// SUBJECT FILE</div>
          <SidebarPortrait />
          <div className="sidebar-bio">
            <div>
              <span className="bio-label">Identity</span>
              <div
                className="bio-val"
                style={{
                  fontFamily: 'Bangers',
                  fontSize: '20px',
                  letterSpacing: '2px',
                  color: 'var(--white)',
                  textShadow: '1px 0 0 var(--cyan)',
                }}
              >
                Pierce Doman
              </div>
            </div>
            <div className="bio-section">
              <span className="bio-label">Current Role</span>
              <div className="bio-val">
                Business Process Analyst
                <br />
                <span style={{ color: 'var(--cyan)' }}>Radian H.A. Limited</span>
              </div>
            </div>
            <div className="bio-section">
              <span className="bio-label">Specialities</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                {['Full Stack', 'AI Eng.', 'ERP/Odoo', 'Freelance'].map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: '9px',
                      letterSpacing: '1.5px',
                      padding: '3px 8px',
                      border: '1.5px solid rgba(0,212,255,0.35)',
                      color: 'var(--cyan)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="bio-section">
              <span className="bio-label">Base of Operations</span>
              <div className="bio-val">Trinidad &amp; Tobago 🌍</div>
            </div>
            <div className="bio-section">
              <span className="bio-label">Education</span>
              <div className="bio-val">
                BSc Computer Science
                <br />
                <span style={{ color: 'var(--red)' }}>UWI · 2:1 Honours</span>
              </div>
            </div>
          </div>

          <div className="suggested-header">// QUICK QUESTIONS</div>
          <div className="suggestions">
            {SUGGESTIONS.slice(0, 4).map((s) => (
              <button
                key={s}
                type="button"
                className="suggestion-btn"
                onClick={() => send(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="chat-area">
          <WebCornerSVG size={120} color="rgba(232,25,44,0.12)" style={{ top: 0, right: 0 }} flip />
          <WebCornerSVG size={90} color="rgba(0,212,255,0.08)" style={{ bottom: 80, left: 0 }} />
          <SpiderSymbolSVG
            size={200}
            color="rgba(232,25,44,0.03)"
            style={{
              position: 'absolute',
              bottom: 80,
              right: 40,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          <div className="chat-header" style={{ position: 'relative', zIndex: 1 }}>
            <div>
              <div className="chat-title-main">
                <span>ASK PIERCE</span>
                <span className="g1" aria-hidden="true">
                  ASK PIERCE
                </span>
                <span className="g2" aria-hidden="true">
                  ASK PIERCE
                </span>
              </div>
              <div className="chat-subtitle">Powered by AI · Answers about Pierce Doman</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {SUGGESTIONS.slice(4).map((s) => (
                <button
                  key={s}
                  type="button"
                  className="suggestion-btn"
                  style={{ fontSize: '9px', padding: '5px 10px' }}
                  onClick={() => send(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="messages-area" style={{ position: 'relative', zIndex: 1 }}>
            {messages.length === 0 && (
              <div className="welcome-bubble">
                <SpiderSymbolSVG
                  size={64}
                  color="var(--red)"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(232,25,44,0.5))',
                    animation: 'chatPulse 2s infinite',
                  }}
                />
                <div
                  style={{
                    fontFamily: 'Bangers',
                    fontSize: '36px',
                    letterSpacing: '4px',
                    textShadow: '3px 0 0 var(--cyan), -3px 0 0 var(--magenta)',
                    animation: 'neonFlicker 4s infinite',
                  }}
                >
                  SPIDER-COMM ONLINE
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: 'rgba(240,238,255,0.6)',
                    lineHeight: '1.8',
                    maxWidth: '480px',
                  }}
                >
                  Hey there! I'm{' '}
                  <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>Spider-PD</span> — your
                  friendly neighbourhood AI assistant. Ask me anything about Pierce: his work,
                  skills, projects, or background.
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    justifyContent: 'center',
                    maxWidth: '500px',
                  }}
                >
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="suggestion-btn"
                      onClick={() => send(s)}
                      style={{ fontSize: '10px' }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    letterSpacing: '2px',
                    color: 'rgba(240,238,255,0.25)',
                    textTransform: 'uppercase',
                  }}
                >
                  With great code comes great responsibility 🕷️
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}

            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-bar" style={{ position: 'relative', zIndex: 1 }}>
            <div className="input-wrap">
              <textarea
                ref={textareaRef}
                className="chat-input"
                placeholder="Ask Spider-PD anything about Pierce..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
                disabled={loading}
              />
              <div className="input-hint">ENTER to send · SHIFT+ENTER for new line</div>
            </div>
            <button
              type="button"
              className="send-btn"
              onClick={() => send()}
              disabled={loading || !input.trim()}
            >
              {loading ? 'SENDING...' : 'SHOOT →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
