import { useCallback, useEffect, useRef, useState } from 'react'
import './GamesPage.css'
import { apiUrl } from '../lib/api'

/* ============================================================
   AI Games — picker + Spot the Bug + Hire Spider-Man.
   Wires to /api/games/* on the FastAPI backend.
   ============================================================ */

function GlitchTitle({ text, size = 'clamp(52px,7vw,90px)', style = {} }) {
  const baseStyle = {
    position: 'relative',
    fontFamily: 'Bangers',
    fontSize: size,
    letterSpacing: '4px',
    lineHeight: 1,
    ...style,
  }
  const layerStyle = {
    position: 'absolute',
    inset: 0,
    fontFamily: 'Bangers',
    fontSize: size,
    letterSpacing: '4px',
  }
  return (
    <div style={baseStyle}>
      <span>{text}</span>
      <span
        aria-hidden="true"
        style={{
          ...layerStyle,
          color: 'var(--cyan)',
          animation: 'glitch1 3.5s infinite, glitch-idle 3.5s infinite',
        }}
      >
        {text}
      </span>
      <span
        aria-hidden="true"
        style={{
          ...layerStyle,
          color: 'var(--magenta)',
          animation: 'glitch2 3.5s infinite, glitch-idle 3.5s 0.5s infinite',
        }}
      >
        {text}
      </span>
    </div>
  )
}

function WebCornerSVG({ style = {}, flip = false }) {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      style={{ position: 'absolute', pointerEvents: 'none', zIndex: 1, opacity: 0.18, ...style }}
    >
      <g transform={flip ? 'scale(-1,1) translate(-120,0)' : ''}>
        {[0, 18, 36, 54, 72, 90].map((a) => {
          const r = (a * Math.PI) / 180
          return (
            <line
              key={a}
              x1="0"
              y1="0"
              x2={120 * Math.cos(r)}
              y2={120 * Math.sin(r)}
              stroke="var(--cyan)"
              strokeWidth="1.2"
            />
          )
        })}
        {[20, 42, 64, 86, 108].map((r) => (
          <path
            key={r}
            d={`M ${r} 0 A ${r} ${r} 0 0 1 0 ${r}`}
            stroke="var(--cyan)"
            strokeWidth="1.2"
            fill="none"
          />
        ))}
      </g>
    </svg>
  )
}

/* ────────────────────────── PICKER ────────────────────────── */
const GAMES = [
  {
    id: 'bug',
    emoji: '🕸️',
    number: '01',
    title: 'SPOT THE BUG',
    subtitle: 'Spider-Sense Edition',
    desc: 'AI drops a buggy code snippet. Find the bug before your web fluid runs out. Get roasted by J. Jonah Jameson if you fail — praised by Aunt May if you win.',
    tags: ['MULTIPLE CHOICE', 'TIMED', 'AI-GENERATED'],
    color: 'var(--cyan)',
    tokenCost: '⚡ TINY TOKEN COST',
  },
  {
    id: 'hire',
    emoji: '🦸',
    number: '02',
    title: 'HIRE SPIDER-MAN',
    subtitle: 'Pitch Battle',
    desc: "You're a skeptical recruiter trying NOT to hire Pierce. Spider-Man defends his skills for 3 rounds. Run out of objections? You lose. He's on the team.",
    tags: ['3 ROUNDS', 'CHAT BATTLE', 'AI ROLEPLAY'],
    color: 'var(--magenta)',
    tokenCost: '⚡ LOW TOKEN COST',
  },
]

function GamePicker({ onSelect }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 40px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="halftone"
        style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }}
      />
      <WebCornerSVG style={{ top: 0, left: 0 }} />
      <WebCornerSVG style={{ top: 0, right: 0 }} flip />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          marginBottom: '56px',
          animation: 'gamesSlideUp 0.6s both',
        }}
      >
        <div
          style={{
            fontFamily: 'Bangers',
            fontSize: '13px',
            letterSpacing: '6px',
            color: 'var(--red)',
            marginBottom: '12px',
            animation: 'neonFlicker 6s infinite',
          }}
        >
          // AI-POWERED MINI-GAMES
        </div>
        <GlitchTitle
          text="PICK YOUR GAME"
          style={{
            color: 'var(--white)',
            textShadow: '4px 0 0 var(--cyan), -4px 0 0 var(--magenta)',
            marginBottom: '16px',
          }}
        />
        <div
          style={{
            fontSize: '13px',
            color: 'rgba(240,238,255,0.5)',
            letterSpacing: '1px',
          }}
        >
          Powered by AI · Spider-Man approved
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 380px))',
          gap: 0,
          background: '#000',
          border: '4px solid #000',
          maxWidth: '800px',
          width: '100%',
          animation: 'gamesSlideUp 0.6s 0.15s both',
        }}
      >
        {GAMES.map((g) => (
          <GameCard key={g.id} game={g} onSelect={() => onSelect(g.id)} />
        ))}
      </div>

      <div
        style={{
          marginTop: '32px',
          fontSize: '11px',
          letterSpacing: '2px',
          color: 'rgba(240,238,255,0.3)',
          animation: 'gamesSlideUp 0.6s 0.4s both',
        }}
      >
        MORE GAMES COMING SOON · STAY TUNED
      </div>
    </div>
  )
}

function GameCard({ game, onSelect }) {
  const [hov, setHov] = useState(false)
  const isCyan = game.color === 'var(--cyan)'
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onSelect}
      style={{
        background: hov ? 'var(--bg2)' : 'var(--bg)',
        borderRight: '3px solid #000',
        cursor: 'pointer',
        transition: 'background 0.2s',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: hov ? 1 : 0,
          transition: 'opacity 0.3s',
          backgroundImage: `radial-gradient(circle, ${game.color}18 1px, transparent 1px)`,
          backgroundSize: '14px 14px',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          background: game.color,
          borderBottom: '3px solid #000',
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontFamily: 'Bangers',
            fontSize: '13px',
            letterSpacing: '4px',
            color: isCyan ? '#000' : '#fff',
          }}
        >
          GAME {game.number}
        </span>
        <span
          style={{
            fontFamily: 'Bangers',
            fontSize: '11px',
            letterSpacing: '2px',
            color: isCyan ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)',
          }}
        >
          {game.tokenCost}
        </span>
      </div>
      <div
        style={{
          height: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '3px solid #000',
          background: 'rgba(0,0,0,0.4)',
          position: 'relative',
        }}
      >
        <span
          style={{
            fontSize: '64px',
            filter: `drop-shadow(0 0 20px ${game.color})`,
            transition: 'transform 0.2s',
            transform: hov ? 'scale(1.15) rotate(-5deg)' : 'scale(1)',
          }}
        >
          {game.emoji}
        </span>
        {hov && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse at center, ${game.color}15 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
      <div style={{ padding: '20px', flex: 1, position: 'relative' }}>
        <div
          style={{
            fontFamily: 'Bangers',
            fontSize: '28px',
            letterSpacing: '2px',
            color: 'var(--white)',
            textShadow: `2px 0 0 ${game.color}`,
            lineHeight: 1.1,
            marginBottom: '4px',
          }}
        >
          {game.title}
        </div>
        <div
          style={{
            fontFamily: 'Bangers',
            fontSize: '13px',
            letterSpacing: '3px',
            color: game.color,
            marginBottom: '14px',
          }}
        >
          {game.subtitle}
        </div>
        <p
          style={{
            fontSize: '12px',
            lineHeight: 1.8,
            color: 'rgba(240,238,255,0.7)',
            marginBottom: '16px',
          }}
        >
          {game.desc}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
          {game.tags.map((t) => (
            <span
              key={t}
              style={{
                fontSize: '9px',
                letterSpacing: '1.5px',
                padding: '3px 8px',
                border: `1.5px solid ${game.color}`,
                color: game.color,
                textTransform: 'uppercase',
              }}
            >
              {t}
            </span>
          ))}
        </div>
        <button
          type="button"
          className={`btn ${isCyan ? 'btn-cyan' : 'btn-mag'}`}
          style={{ fontSize: '16px', padding: '10px 24px', width: '100%' }}
        >
          PLAY NOW →
        </button>
      </div>
    </div>
  )
}

/* ────────────────────────── SPOT THE BUG ────────────────────────── */

const FALLBACK_PUZZLE = {
  language: 'javascript',
  code: `function sumArray(arr) {
  let total = 0;
  for (let i = 0; i <= arr.length; i++) {
    total += arr[i];
  }
  return total;
}

console.log(sumArray([1, 2, 3]));`,
  choices: [
    'A) Loop condition uses <= instead of <, causing an off-by-one error',
    'B) The variable "total" should be named "sum"',
    'C) arr[i] should use .at(i) instead',
    'D) The function should use .reduce() instead of a loop',
  ],
  correct: 'A',
  bugLine: 'for (let i = 0; i <= arr.length; i++) {',
  explanation: 'The loop runs one extra time — arr[arr.length] is undefined, making total NaN.',
}

function SpotTheBug({ onHome }) {
  const [phase, setPhase] = useState('loading') // loading | playing | result
  const [puzzle, setPuzzle] = useState(null)
  const [selected, setSelected] = useState(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [outcome, setOutcome] = useState(null) // win | lose | timeout
  const [reaction, setReaction] = useState('')
  const [loadingReaction, setLoadingReaction] = useState(false)
  const timerRef = useRef(null)

  const fetchPuzzle = useCallback(async () => {
    try {
      const res = await fetch(apiUrl('/api/games/spot-bug/puzzle'), { method: 'POST' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } catch {
      return FALLBACK_PUZZLE
    }
  }, [])

  const loadPuzzle = useCallback(async () => {
    setPhase('loading')
    setPuzzle(null)
    setSelected(null)
    setTimeLeft(30)
    setOutcome(null)
    setReaction('')
    const data = await fetchPuzzle()
    setPuzzle(data)
    setPhase('playing')
  }, [fetchPuzzle])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const data = await fetchPuzzle()
      if (cancelled) return
      setPuzzle(data)
      setPhase('playing')
    })()
    return () => {
      cancelled = true
    }
  }, [fetchPuzzle])

  const fetchReaction = useCallback(async (result) => {
    setLoadingReaction(true)
    try {
      const res = await fetch(apiUrl('/api/games/spot-bug/reaction'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outcome: result }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setReaction(data.text)
    } catch {
      setReaction(
        result === 'win'
          ? '"Oh dear, you found that nasty little bug! I knew you would — I always said you had a sharp eye, just like Peter."'
          : '"WRONG! WRONG WRONG WRONG! This is exactly the kind of incompetence I expect from someone working with that masked menace!"',
      )
    }
    setLoadingReaction(false)
  }, [])

  const handleTimeout = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setOutcome('timeout')
    setPhase('result')
    fetchReaction('timeout')
  }, [fetchReaction])

  useEffect(() => {
    if (phase !== 'playing') return undefined
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleTimeout()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase, handleTimeout])

  const handleChoice = (letter) => {
    if (phase !== 'playing' || !puzzle) return
    if (timerRef.current) clearInterval(timerRef.current)
    setSelected(letter)
    const won = letter === puzzle.correct
    const result = won ? 'win' : 'lose'
    setOutcome(result)
    setPhase('result')
    fetchReaction(result)
  }

  const timerPct = (timeLeft / 30) * 100
  const timerColor =
    timerPct > 60 ? 'var(--cyan)' : timerPct > 30 ? '#ffcc00' : 'var(--red)'

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '90px 24px 60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: '720px' }}>
        <div style={{ marginBottom: '32px', animation: 'gamesSlideUp 0.5s both' }}>
          <div
            style={{
              fontFamily: 'Bangers',
              fontSize: '12px',
              letterSpacing: '5px',
              color: 'var(--cyan)',
              marginBottom: '6px',
            }}
          >
            🕸️ GAME 01
          </div>
          <GlitchTitle
            text="SPOT THE BUG"
            size="clamp(44px,6vw,72px)"
            style={{ color: 'var(--white)', marginBottom: '4px' }}
          />
          <div
            style={{
              fontFamily: 'Bangers',
              fontSize: '14px',
              letterSpacing: '3px',
              color: 'rgba(240,238,255,0.4)',
            }}
          >
            SPIDER-SENSE EDITION
          </div>
        </div>

        {phase === 'loading' && (
          <div style={{ textAlign: 'center', padding: '80px 0', animation: 'gamesSlideUp 0.4s both' }}>
            <div
              style={{
                fontSize: '48px',
                marginBottom: '20px',
                animation: 'gamesSpin 1s linear infinite',
                display: 'inline-block',
              }}
            >
              🕷️
            </div>
            <div
              style={{
                fontFamily: 'Bangers',
                fontSize: '20px',
                letterSpacing: '4px',
                color: 'var(--cyan)',
              }}
            >
              GENERATING BUG...
            </div>
            <div
              style={{
                fontSize: '11px',
                color: 'rgba(240,238,255,0.4)',
                letterSpacing: '2px',
                marginTop: '8px',
              }}
            >
              Spider-Sense is tingling
            </div>
          </div>
        )}

        {phase === 'playing' && puzzle && (
          <div style={{ animation: 'gamesSlideUp 0.4s both' }}>
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Bangers',
                    fontSize: '13px',
                    letterSpacing: '3px',
                    color: 'rgba(240,238,255,0.5)',
                  }}
                >
                  WEB FLUID
                </span>
                <span
                  style={{
                    fontFamily: 'Bangers',
                    fontSize: '22px',
                    color: timerColor,
                    textShadow: `0 0 10px ${timerColor}`,
                  }}
                >
                  {timeLeft}s
                </span>
              </div>
              <div
                style={{
                  height: '10px',
                  background: 'rgba(0,0,0,0.5)',
                  border: '2px solid #000',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${timerPct}%`,
                    background: timerColor,
                    boxShadow: `0 0 8px ${timerColor}`,
                    transition: 'width 1s linear, background 0.5s',
                  }}
                />
              </div>
            </div>

            <div
              style={{
                border: '3px solid #000',
                background: 'var(--bg2)',
                marginBottom: '20px',
                boxShadow: '4px 4px 0 var(--cyan)',
              }}
            >
              <div
                style={{
                  background: '#000',
                  borderBottom: '3px solid #000',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Bangers',
                    fontSize: '13px',
                    letterSpacing: '3px',
                    color: 'var(--cyan)',
                  }}
                >
                  {(puzzle.language || 'javascript').toUpperCase()} · FIND THE BUG
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['var(--red)', '#ffcc00', 'var(--cyan)'].map((c, i) => (
                    <div
                      key={i}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: c,
                        border: '1.5px solid #000',
                      }}
                    />
                  ))}
                </div>
              </div>
              <pre
                style={{
                  padding: '20px',
                  fontSize: '13px',
                  lineHeight: '1.8',
                  color: 'rgba(240,238,255,0.9)',
                  overflowX: 'auto',
                  tabSize: 2,
                  margin: 0,
                  whiteSpace: 'pre',
                }}
              >
                <code>{puzzle.code}</code>
              </pre>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {puzzle.choices.map((c) => {
                const letter = c[0]
                return (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => handleChoice(letter)}
                    style={{
                      background: 'var(--bg2)',
                      border: '3px solid rgba(0,212,255,0.25)',
                      color: 'var(--white)',
                      fontFamily: 'Space Mono',
                      fontSize: '12px',
                      lineHeight: '1.6',
                      padding: '14px 18px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--cyan)'
                      e.currentTarget.style.background = 'rgba(0,212,255,0.07)'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0,212,255,0.25)'
                      e.currentTarget.style.background = 'var(--bg2)'
                      e.currentTarget.style.transform = ''
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Bangers',
                        fontSize: '18px',
                        color: 'var(--cyan)',
                        minWidth: '24px',
                        lineHeight: 1,
                      }}
                    >
                      {letter}
                    </span>
                    <span>{c.slice(3)}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {phase === 'result' && puzzle && (
          <BugResult
            outcome={outcome}
            puzzle={puzzle}
            selected={selected}
            reaction={reaction}
            loadingReaction={loadingReaction}
            onRetry={loadPuzzle}
            onHome={onHome}
          />
        )}
      </div>
    </div>
  )
}

function BugResult({ outcome, puzzle, reaction, loadingReaction, onRetry, onHome }) {
  const won = outcome === 'win'
  const timedOut = outcome === 'timeout'
  const accentColor = won ? 'var(--cyan)' : 'var(--red)'

  return (
    <div style={{ animation: 'gamesSlideUp 0.5s both' }}>
      <div
        style={{
          border: '3px solid #000',
          background: won ? 'var(--cyan)' : 'var(--red)',
          padding: '16px 24px',
          marginBottom: '20px',
          boxShadow: '6px 6px 0 #000',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: 'Bangers',
            fontSize: '48px',
            letterSpacing: '4px',
            color: won ? '#000' : '#fff',
            textShadow: won ? 'none' : '3px 0 0 #000',
          }}
        >
          {won ? '🎉 NICE ONE!' : timedOut ? "⏰ TIME'S UP!" : '💥 WRONG!'}
        </div>
        <div
          style={{
            fontFamily: 'Bangers',
            fontSize: '14px',
            letterSpacing: '3px',
            color: won ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)',
            marginTop: '4px',
          }}
        >
          {won ? 'SPIDER-SENSE IS ON POINT' : 'YOUR WEB FLUID HAS RUN DRY'}
        </div>
      </div>

      <div
        style={{
          border: '3px solid #000',
          background: 'var(--bg2)',
          marginBottom: '20px',
          boxShadow: `4px 4px 0 ${accentColor}`,
        }}
      >
        <div
          style={{
            background: '#000',
            borderBottom: '3px solid #000',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '20px' }}>{won ? '👵' : '📰'}</span>
          <span
            style={{
              fontFamily: 'Bangers',
              fontSize: '14px',
              letterSpacing: '3px',
              color: won ? 'var(--cyan)' : 'var(--red)',
            }}
          >
            {won ? 'AUNT MAY SAYS...' : 'J. JONAH JAMESON SAYS...'}
          </span>
        </div>
        <div style={{ padding: '20px' }}>
          {loadingReaction ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: 'rgba(240,238,255,0.4)',
              }}
            >
              <div style={{ animation: 'gamesSpin 1s linear infinite', fontSize: '18px' }}>🕷️</div>
              <span style={{ fontSize: '12px', letterSpacing: '1px' }}>Composing reaction...</span>
            </div>
          ) : (
            <p
              style={{
                fontSize: '14px',
                lineHeight: '1.8',
                color: 'rgba(240,238,255,0.9)',
                fontStyle: 'italic',
              }}
            >
              {reaction}
            </p>
          )}
        </div>
      </div>

      <div style={{ border: '3px solid #000', background: 'var(--bg2)', marginBottom: '24px' }}>
        <div
          style={{
            background: 'rgba(0,212,255,0.1)',
            borderBottom: '3px solid #000',
            padding: '8px 16px',
          }}
        >
          <span
            style={{
              fontFamily: 'Bangers',
              fontSize: '13px',
              letterSpacing: '3px',
              color: 'var(--cyan)',
            }}
          >
            THE BUG WAS...
          </span>
        </div>
        <div style={{ padding: '16px 20px' }}>
          <div
            style={{
              fontFamily: 'Space Mono',
              fontSize: '12px',
              background: 'rgba(0,0,0,0.4)',
              padding: '10px 14px',
              border: '2px solid rgba(232,25,44,0.4)',
              marginBottom: '12px',
              color: 'var(--red)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {puzzle.bugLine}
          </div>
          <p style={{ fontSize: '13px', lineHeight: '1.7', color: 'rgba(240,238,255,0.8)' }}>
            {puzzle.explanation}
          </p>
          <div
            style={{
              marginTop: '12px',
              padding: '10px 14px',
              background: 'rgba(0,212,255,0.06)',
              border: '2px solid rgba(0,212,255,0.2)',
              fontSize: '12px',
              color: 'var(--cyan)',
            }}
          >
            ✓ Correct answer:{' '}
            <strong>{puzzle.choices.find((c) => c[0] === puzzle.correct)}</strong>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={onRetry}
          className="btn btn-cyan"
          style={{ fontSize: '17px', padding: '12px 28px', flex: 1, minWidth: '180px' }}
        >
          🕸️ NEW BUG
        </button>
        <button
          type="button"
          onClick={onHome}
          className="btn btn-outline"
          style={{ fontSize: '17px', padding: '12px 28px' }}
        >
          PICK GAME
        </button>
      </div>
    </div>
  )
}

/* ────────────────────────── HIRE SPIDER-MAN ────────────────────────── */

function HireSpiderMan({ onHome }) {
  const [phase, setPhase] = useState('intro') // intro | playing | result
  const [messages, setMessages] = useState([])
  const [round, setRound] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [outcome, setOutcome] = useState(null) // win | lose
  const [verdict, setVerdict] = useState('')
  const maxRounds = 3
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages, loading])

  const startGame = () => {
    setPhase('playing')
    setMessages([
      {
        role: 'spider',
        text:
          'Look, I know what you\'re thinking — "Who is this guy in the Spider-Man suit applying ' +
          'for a dev role?" But hear me out. I\'ve shipped real products: a full booking system ' +
          'with Stripe payments, an AI image pipeline in WordPress, and a Final Year Project that ' +
          'earned Second Class Honours. I write React, Node.js, Python, and I\'ve integrated ' +
          'LangChain into production. Your move, recruiter.',
      },
    ])
    setRound(0)
  }

  const reset = () => {
    setPhase('intro')
    setMessages([])
    setRound(0)
    setOutcome(null)
    setVerdict('')
    setUserInput('')
  }

  const sendMessage = async () => {
    if (!userInput.trim() || loading) return
    const userText = userInput.trim()
    setUserInput('')
    const newRound = round + 1
    setRound(newRound)

    const conversation = [...messages, { role: 'user', text: userText }]
    setMessages(conversation)
    setLoading(true)

    try {
      const replyRes = await fetch(apiUrl('/api/games/hire/reply'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversation,
          round: newRound,
          max_rounds: maxRounds,
        }),
      })
      if (!replyRes.ok) throw new Error(`HTTP ${replyRes.status}`)
      const { text: spiderReply } = await replyRes.json()

      const finalMsgs = [...conversation, { role: 'spider', text: spiderReply }]
      setMessages(finalMsgs)

      if (newRound >= maxRounds) {
        const verdictRes = await fetch(apiUrl('/api/games/hire/verdict'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: finalMsgs }),
        })
        if (!verdictRes.ok) throw new Error(`HTTP ${verdictRes.status}`)
        const v = await verdictRes.json()
        setOutcome(v.outcome === 'spider' ? 'lose' : 'win')
        setVerdict(v.summary)
        setPhase('result')
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'spider',
          text:
            'Okay my web-shooter jammed for a sec — server hiccup. Try another objection in a moment.',
        },
      ])
    }
    setLoading(false)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '90px 24px 60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: '680px' }}>
        <div style={{ marginBottom: '28px', animation: 'gamesSlideUp 0.5s both' }}>
          <div
            style={{
              fontFamily: 'Bangers',
              fontSize: '12px',
              letterSpacing: '5px',
              color: 'var(--magenta)',
              marginBottom: '6px',
            }}
          >
            🦸 GAME 02
          </div>
          <GlitchTitle
            text="HIRE SPIDER-MAN"
            size="clamp(36px,5vw,64px)"
            style={{ color: 'var(--white)', marginBottom: '4px' }}
          />
          <div
            style={{
              fontFamily: 'Bangers',
              fontSize: '13px',
              letterSpacing: '3px',
              color: 'rgba(240,238,255,0.4)',
            }}
          >
            PITCH BATTLE
          </div>
        </div>

        {phase === 'intro' && (
          <div style={{ animation: 'gamesSlideUp 0.4s 0.1s both' }}>
            <div
              style={{
                border: '3px solid #000',
                background: 'var(--bg2)',
                marginBottom: '24px',
                boxShadow: '4px 4px 0 var(--magenta)',
              }}
            >
              <div
                style={{
                  background: 'var(--magenta)',
                  borderBottom: '3px solid #000',
                  padding: '10px 20px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Bangers',
                    fontSize: '14px',
                    letterSpacing: '3px',
                    color: '#fff',
                  }}
                >
                  📋 HOW TO PLAY
                </span>
              </div>
              <div
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                {[
                  ['YOU ARE', 'A skeptical recruiter. Your job is to NOT hire Spider-Man over 3 rounds.'],
                  ['YOUR OPPONENT', "Spider-Man (Pierce Doman). He's defending his dev skills to get on your team."],
                  ['3 ROUNDS', 'Fire your best objections — experience, skills, professionalism, anything goes.'],
                  ['TO WIN', "Make objections Spider-Man can't answer. If he wins the crowd, you lose."],
                ].map(([label, text]) => (
                  <div
                    key={label}
                    style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}
                  >
                    <span
                      style={{
                        fontFamily: 'Bangers',
                        fontSize: '12px',
                        letterSpacing: '2px',
                        color: 'var(--magenta)',
                        minWidth: '110px',
                        paddingTop: '2px',
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        lineHeight: '1.7',
                        color: 'rgba(240,238,255,0.75)',
                      }}
                    >
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={startGame}
              className="btn btn-mag"
              style={{
                fontSize: '20px',
                padding: '14px 40px',
                width: '100%',
                animation: 'gamesPulse 2s infinite',
              }}
            >
              START INTERVIEW →
            </button>
          </div>
        )}

        {phase === 'playing' && (
          <div style={{ animation: 'gamesSlideUp 0.4s both' }}>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '20px',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'Bangers',
                  fontSize: '12px',
                  letterSpacing: '3px',
                  color: 'rgba(240,238,255,0.4)',
                  marginRight: '4px',
                }}
              >
                ROUND
              </span>
              {[1, 2, 3].map((r) => (
                <div
                  key={r}
                  style={{
                    width: r <= round ? 32 : 24,
                    height: 10,
                    background: r <= round ? 'var(--magenta)' : 'rgba(255,0,170,0.15)',
                    border: '2px solid #000',
                    transition: 'all 0.3s',
                    boxShadow: r <= round ? '0 0 8px var(--magenta)' : 'none',
                  }}
                />
              ))}
              <span
                style={{
                  fontFamily: 'Bangers',
                  fontSize: '13px',
                  color: 'var(--magenta)',
                  marginLeft: '4px',
                }}
              >
                {round}/{maxRounds}
              </span>
            </div>

            <div
              style={{
                border: '3px solid #000',
                background: 'var(--bg2)',
                marginBottom: '16px',
                maxHeight: '380px',
                overflowY: 'auto',
              }}
            >
              <div
                style={{
                  background: '#000',
                  borderBottom: '3px solid #000',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}
              >
                <span style={{ fontSize: '16px' }}>🦸</span>
                <span
                  style={{
                    fontFamily: 'Bangers',
                    fontSize: '13px',
                    letterSpacing: '3px',
                    color: 'var(--magenta)',
                  }}
                >
                  INTERVIEW ROOM
                </span>
              </div>
              <div
                style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                {messages.map((m, i) => (
                  <ChatBubble key={i} msg={m} />
                ))}
                {loading && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 16px',
                      background: 'rgba(255,0,170,0.06)',
                      border: '2px solid rgba(255,0,170,0.2)',
                    }}
                  >
                    <span
                      style={{
                        animation: 'gamesSpin 0.8s linear infinite',
                        fontSize: '16px',
                        display: 'inline-block',
                      }}
                    >
                      🕷️
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'rgba(240,238,255,0.4)',
                        letterSpacing: '1px',
                      }}
                    >
                      Spider-Man is thinking...
                    </span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder={
                  round < maxRounds
                    ? `Objection ${round + 1} of ${maxRounds} — make it count...`
                    : ''
                }
                disabled={loading || round >= maxRounds}
                style={{
                  flex: 1,
                  background: 'rgba(0,0,0,0.5)',
                  border: '3px solid rgba(255,0,170,0.3)',
                  color: 'var(--white)',
                  fontFamily: 'Space Mono',
                  fontSize: '13px',
                  padding: '12px 16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--magenta)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,0,170,0.3)'
                }}
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={loading || !userInput.trim() || round >= maxRounds}
                className="btn btn-mag"
                style={{
                  fontSize: '15px',
                  padding: '12px 20px',
                  opacity: loading || !userInput.trim() ? 0.5 : 1,
                }}
              >
                SEND
              </button>
            </div>
            <div
              style={{
                fontSize: '10px',
                color: 'rgba(240,238,255,0.3)',
                letterSpacing: '1.5px',
                marginTop: '8px',
                textAlign: 'right',
              }}
            >
              ENTER TO SEND · {maxRounds - round} OBJECTION
              {maxRounds - round !== 1 ? 'S' : ''} REMAINING
            </div>
          </div>
        )}

        {phase === 'result' && (
          <HireResult
            outcome={outcome}
            verdict={verdict}
            messages={messages}
            onHome={onHome}
            onRetry={reset}
          />
        )}
      </div>
    </div>
  )
}

function ChatBubble({ msg }) {
  const isSpider = msg.role === 'spider'
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isSpider ? 'flex-start' : 'flex-end',
        gap: '4px',
      }}
    >
      <span
        style={{
          fontFamily: 'Bangers',
          fontSize: '10px',
          letterSpacing: '2px',
          color: isSpider ? 'var(--magenta)' : 'rgba(240,238,255,0.4)',
          paddingLeft: isSpider ? '4px' : 0,
          paddingRight: isSpider ? 0 : '4px',
        }}
      >
        {isSpider ? '🦸 SPIDER-MAN' : '👔 YOU (RECRUITER)'}
      </span>
      <div
        style={{
          maxWidth: '88%',
          padding: '12px 16px',
          fontSize: '13px',
          lineHeight: '1.7',
          background: isSpider ? 'rgba(255,0,170,0.08)' : 'rgba(0,212,255,0.06)',
          border: `2px solid ${isSpider ? 'rgba(255,0,170,0.3)' : 'rgba(0,212,255,0.25)'}`,
          color: 'rgba(240,238,255,0.9)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {msg.text}
      </div>
    </div>
  )
}

function HireResult({ outcome, verdict, messages, onHome, onRetry }) {
  const recruiterWon = outcome === 'win'
  return (
    <div style={{ animation: 'gamesSlideUp 0.5s both' }}>
      <div
        style={{
          border: '3px solid #000',
          background: recruiterWon ? 'var(--cyan)' : 'var(--magenta)',
          padding: '20px 24px',
          marginBottom: '20px',
          boxShadow: '6px 6px 0 #000',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: 'Bangers',
            fontSize: '52px',
            letterSpacing: '3px',
            color: recruiterWon ? '#000' : '#fff',
          }}
        >
          {recruiterWon ? '🏆 YOU WIN!' : '🦸 SPIDER-MAN WINS!'}
        </div>
        <div
          style={{
            fontFamily: 'Bangers',
            fontSize: '14px',
            letterSpacing: '3px',
            color: recruiterWon ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.75)',
            marginTop: '4px',
          }}
        >
          {recruiterWon ? 'SPIDER-MAN STAYS UNEMPLOYED' : "HE'S ON THE TEAM NOW"}
        </div>
      </div>

      <div
        style={{
          border: '3px solid #000',
          background: 'var(--bg2)',
          marginBottom: '20px',
          boxShadow: `4px 4px 0 ${recruiterWon ? 'var(--cyan)' : 'var(--magenta)'}`,
        }}
      >
        <div
          style={{
            background: '#000',
            borderBottom: '3px solid #000',
            padding: '8px 16px',
          }}
        >
          <span
            style={{
              fontFamily: 'Bangers',
              fontSize: '13px',
              letterSpacing: '3px',
              color: 'rgba(240,238,255,0.5)',
            }}
          >
            🎙️ JUDGE'S VERDICT
          </span>
        </div>
        <div style={{ padding: '20px' }}>
          <p
            style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: 'rgba(240,238,255,0.9)',
              fontStyle: 'italic',
            }}
          >
            {verdict}
          </p>
        </div>
      </div>

      <div
        style={{
          border: '3px solid rgba(255,255,255,0.08)',
          background: 'var(--bg2)',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            background: 'rgba(0,0,0,0.3)',
            borderBottom: '2px solid rgba(255,255,255,0.08)',
            padding: '8px 16px',
          }}
        >
          <span
            style={{
              fontFamily: 'Bangers',
              fontSize: '12px',
              letterSpacing: '3px',
              color: 'rgba(240,238,255,0.3)',
            }}
          >
            BATTLE TRANSCRIPT
          </span>
        </div>
        <div
          style={{
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxHeight: '260px',
            overflowY: 'auto',
          }}
        >
          {messages.map((m, i) => (
            <ChatBubble key={i} msg={m} />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={onRetry}
          className="btn btn-mag"
          style={{ fontSize: '17px', padding: '12px 28px', flex: 1, minWidth: '180px' }}
        >
          🦸 REMATCH
        </button>
        <button
          type="button"
          onClick={onHome}
          className="btn btn-outline"
          style={{ fontSize: '17px', padding: '12px 28px' }}
        >
          PICK GAME
        </button>
      </div>
    </div>
  )
}

/* ────────────────────────── ROOT ────────────────────────── */

export default function GamesPage() {
  const [screen, setScreen] = useState('pick') // pick | bug | hire

  useEffect(() => {
    document.body.classList.add('games-active')
    return () => document.body.classList.remove('games-active')
  }, [])

  const goPick = () => setScreen('pick')

  return (
    <div className="games-shell">
      <nav className="games-nav">
        <a href="#/" className="games-nav-logo" aria-label="Back to portfolio">
          PD
        </a>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {screen !== 'pick' && (
            <button type="button" className="games-nav-pick" onClick={goPick}>
              ← PICK GAME
            </button>
          )}
          <a href="#/" className="games-nav-back">
            EXIT →
          </a>
        </div>
      </nav>

      {screen === 'pick' && <GamePicker onSelect={setScreen} />}
      {screen === 'bug' && <SpotTheBug onHome={goPick} />}
      {screen === 'hire' && <HireSpiderMan onHome={goPick} />}
    </div>
  )
}
