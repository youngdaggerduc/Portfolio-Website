/**
 * Live "product preview" for the in-development Security Management System:
 * a site map with zones, a patrol route that draws itself, a guard riding the
 * route, and NFC checkpoints that flip to verified as the guard passes them.
 * Pure SVG + CSS (plus one SMIL animateMotion), so there is no JS loop. Under reduced
 * motion the CSS freezes it into a static, fully-verified map.
 */
const ZONES = [
  { x: 40, y: 40, w: 220, h: 140, label: 'WAREHOUSE A' },
  { x: 300, y: 40, w: 300, h: 120, label: 'ADMIN BLOCK' },
  { x: 40, y: 220, w: 180, h: 140, label: 'YARD' },
  { x: 260, y: 200, w: 140, h: 160, label: 'LOADING BAY' },
  { x: 440, y: 200, w: 160, h: 160, label: 'NORTH GATE', alert: true },
]

// Patrol route through the corridors (closed loop).
const ROUTE = [
  [20, 190], [280, 190], [280, 20], [620, 20], [620, 190],
  [420, 190], [420, 380], [240, 380], [240, 190], [20, 190],
]
// Route vertices that carry an NFC checkpoint.
const CHECKPOINTS = [2, 3, 4, 6, 7, 9]
const DUR = 9 // seconds per patrol loop

const segLen = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1])
const cumulative = ROUTE.reduce((acc, p, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + segLen(ROUTE[i - 1], p))
  return acc
}, [])
const TOTAL = cumulative[cumulative.length - 1]
const PATH = 'M' + ROUTE.map((p) => p.join(' ')).join(' L')

export default function SecurityMapVisual() {
  return (
    <div className="secmap" aria-hidden="true">
      <svg viewBox="0 0 640 400" className="secmap-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="secmap-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="rgba(0,212,255,0.08)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="640" height="400" fill="url(#secmap-grid)" />

        {ZONES.map((z) => (
          <g key={z.label} className={`secmap-zone${z.alert ? ' secmap-zone--alert' : ''}`}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h} />
            <text x={z.x + 10} y={z.y + 20}>{z.label}</text>
          </g>
        ))}

        <path d={PATH} className="secmap-route-ghost" />
        <path
          d={PATH}
          className="secmap-route"
          style={{ strokeDasharray: TOTAL, strokeDashoffset: TOTAL, '--len': TOTAL, '--dur': `${DUR}s` }}
        />

        {CHECKPOINTS.map((vi, n) => {
          const [x, y] = ROUTE[vi]
          const delay = (cumulative[vi] / TOTAL) * DUR
          return (
            <g key={vi} className="secmap-cp" style={{ '--delay': `${delay}s`, '--dur': `${DUR}s` }}>
              <circle cx={x} cy={y} r="13" className="secmap-cp-ring" />
              <circle cx={x} cy={y} r="6" className="secmap-cp-dot" />
              <text
                x={x > 560 ? x - 12 : x + 12}
                y={y - 10}
                textAnchor={x > 560 ? 'end' : 'start'}
                className="secmap-cp-label"
              >
                NFC-{String(n + 1).padStart(2, '0')}
              </text>
            </g>
          )
        })}

        <g className="secmap-guard">
          <circle r="7" />
          <circle r="16" className="secmap-guard-halo" />
          <animateMotion dur={`${DUR}s`} repeatCount="indefinite" path={PATH} />
        </g>
      </svg>

      <div className="secmap-hud secmap-hud--tl">
        <span className="secmap-live" /> PATROL RUN · LIVE
      </div>
      <div className="secmap-hud secmap-hud--br">
        <strong>SHIFT SUMMARY</strong>
        <span>6/6 checkpoints verified · 1 incident logged at North Gate</span>
      </div>
    </div>
  )
}
