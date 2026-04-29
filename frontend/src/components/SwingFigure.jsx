import { useEffect, useState } from 'react'

const VW = 1200
const ANCHOR_X = VW - 30
const ANCHOR_Y = 3

export default function SwingFigure({ sectionRef }) {
  const [progress, setProgress] = useState(0)
  const [reduced] = useState(() => {
    if (typeof window === 'undefined') return true
    return (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.innerWidth <= 900
    )
  })

  useEffect(() => {
    if (reduced) return
    const onScroll = () => {
      const el = sectionRef?.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const p = Math.max(
        0,
        Math.min(1, 1 - rect.top / (window.innerHeight * 0.8))
      )
      setProgress(p)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [reduced, sectionRef])

  if (reduced) return null

  const eased =
    progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2

  const figX = 60 + eased * (VW * 0.72)
  const arcY = Math.sin(eased * Math.PI) * 35
  const figY = 90 - arcY
  const bodyRot = -35 + eased * 60
  const midX = (ANCHOR_X + figX) / 2
  const midY = (ANCHOR_Y + figY) / 2 + 18
  const trailLen = progress * 40 + 10

  return (
    <div className="swing-overlay" aria-hidden="true">
      <svg
        width="100%"
        height="200"
        viewBox={`0 0 ${VW} 200`}
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d={`M${ANCHOR_X},${ANCHOR_Y} Q${midX},${midY} ${figX},${figY - 28}`}
          stroke="rgba(0,212,255,0.25)"
          strokeWidth="3.5"
          fill="none"
        />
        <path
          d={`M${ANCHOR_X},${ANCHOR_Y} Q${midX},${midY} ${figX},${figY - 28}`}
          stroke="rgba(240,238,255,0.75)"
          strokeWidth="1.8"
          fill="none"
          style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.6))' }}
        />

        {progress > 0.05 &&
          [0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1={figX - 15 - i * (trailLen * 0.4)}
              y1={figY + 5 + i * 7}
              x2={figX - 40 - i * (trailLen * 0.4)}
              y2={figY + 2 + i * 7}
              stroke={['#00d4ff', '#ff00aa', '#e8192c', '#00d4ff'][i]}
              strokeWidth={2 - i * 0.35}
              opacity={0.65 - i * 0.12}
            />
          ))}

        <g transform={`translate(${figX}, ${figY}) rotate(${bodyRot})`}>
          <g opacity="0.35">
            <circle cx="-2" cy="-18" r="13" fill="none" stroke="#00d4ff" strokeWidth="2" />
            <circle cx="2" cy="-18" r="13" fill="none" stroke="#ff00aa" strokeWidth="2" />
          </g>

          <path d="M-5 24 Q-18 46 -22 60" stroke="#1a1a2e" strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M-5 24 Q-18 46 -22 60" stroke="#000" strokeWidth="12" strokeLinecap="round" fill="none" />
          <path d="M-5 24 Q-18 46 -22 60" stroke="#1a1a2e" strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M5 24 Q10 44 8 58" stroke="#1a1a2e" strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M5 24 Q10 44 8 58" stroke="#000" strokeWidth="12" strokeLinecap="round" fill="none" />
          <path d="M5 24 Q10 44 8 58" stroke="#1a1a2e" strokeWidth="9" strokeLinecap="round" fill="none" />

          <ellipse cx="0" cy="8" rx="12" ry="18" fill="#e8192c" stroke="#000" strokeWidth="3" />
          <path
            d="M-8 4 Q0 0 8 4 M-10 10 Q0 6 10 10 M-9 16 Q0 12 9 16"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth="1"
            fill="none"
          />
          <rect x="-12" y="13" width="24" height="5" rx="2" fill="#1a1a2e" stroke="#000" strokeWidth="1.5" />

          <circle cx="0" cy="-18" r="13" fill="#e8192c" stroke="#000" strokeWidth="3" />
          <path
            d="M-11 -20 Q0 -25 11 -20 M-13 -15 Q0 -18 13 -15"
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="1"
            fill="none"
          />
          <ellipse cx="-5" cy="-19" rx="4.5" ry="5.5" fill="white" stroke="#000" strokeWidth="1.5" />
          <ellipse cx="5" cy="-19" rx="4.5" ry="5.5" fill="white" stroke="#000" strokeWidth="1.5" />
          <ellipse cx="-6" cy="-21" rx="1.5" ry="2" fill="rgba(200,240,255,0.6)" />
          <ellipse cx="4" cy="-21" rx="1.5" ry="2" fill="rgba(200,240,255,0.6)" />

          <path d="M-10 2 Q-28 -14 -34 -24" stroke="#e8192c" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M-10 2 Q-28 -14 -34 -24" stroke="#000" strokeWidth="11" strokeLinecap="round" fill="none" />
          <path d="M-10 2 Q-28 -14 -34 -24" stroke="#e8192c" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="-34" cy="-24" r="6" fill="#e8192c" stroke="#000" strokeWidth="2.5" />
          <line x1="-34" y1="-30" x2="-36" y2="-34" stroke="#000" strokeWidth="2" />
          <line x1="-30" y1="-28" x2="-28" y2="-32" stroke="#000" strokeWidth="2" />

          <path d="M10 2 Q24 10 30 20" stroke="#e8192c" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M10 2 Q24 10 30 20" stroke="#000" strokeWidth="11" strokeLinecap="round" fill="none" />
          <path d="M10 2 Q24 10 30 20" stroke="#e8192c" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="30" cy="20" r="5" fill="#e8192c" stroke="#000" strokeWidth="2" />
        </g>

        <circle
          cx={ANCHOR_X}
          cy={ANCHOR_Y}
          r="5"
          fill="#e8192c"
          stroke="#000"
          strokeWidth="2"
          style={{ filter: 'drop-shadow(0 0 6px #e8192c)' }}
        />
        <circle
          cx={ANCHOR_X}
          cy={ANCHOR_Y}
          r="9"
          fill="none"
          stroke="rgba(232,25,44,0.3)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  )
}
