import { useEffect, useMemo, useRef, useState } from 'react'
import LetterReveal from './LetterReveal'
import { GitHubIcon, ExternalIcon } from './Icons'
import { useGitHub, summarize } from '../hooks/useGitHub'
import { GITHUB_USER, LINKS } from '../data'
import { prefersReducedMotion } from '../lib/motion'

const CELL = 14 // px per day in the SVG grid
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  PHP: '#4F5D95',
  Java: '#b07219',
}

const fmtDate = (iso) =>
  new Date(iso + (iso.length === 10 ? 'T12:00:00' : '')).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

function timeAgo(iso) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  const units = [
    [31536000, 'y'],
    [2592000, 'mo'],
    [86400, 'd'],
    [3600, 'h'],
    [60, 'm'],
  ]
  for (const [secs, label] of units) if (s >= secs) return `${Math.floor(s / secs)}${label} ago`
  return 'just now'
}

/** Counts up to `value` once `run` is true. */
function CountUp({ value, run }) {
  const [shown, setShown] = useState(0)
  const instant = prefersReducedMotion()
  useEffect(() => {
    if (!run || value == null || instant) return undefined
    let raf = 0
    const start = performance.now()
    const dur = 1300
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur)
      setShown(Math.round(value * (1 - Math.pow(1 - t, 3))))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, run, instant])
  return <>{value == null ? '—' : (instant ? value : shown).toLocaleString()}</>
}

/**
 * Halftone contribution map: each day is a Ben-Day dot whose size and ink
 * follow GitHub's contribution level. A spider hangs on a web thread over
 * the busiest day of the year.
 */
function HalftoneCalendar({ days, peak, revealed }) {
  const scrollRef = useRef(null)

  // Weeks run Sunday→Saturday like GitHub's graph; pad the first week.
  const { cells, weeks, months } = useMemo(() => {
    const first = new Date(days[0].date + 'T12:00:00').getDay()
    const out = []
    const monthMarks = []
    let lastMonth = -1
    days.forEach((d, i) => {
      const idx = i + first
      const week = Math.floor(idx / 7)
      const dow = idx % 7
      out.push({ ...d, week, dow })
      const m = new Date(d.date + 'T12:00:00').getMonth()
      if (dow === 0 && m !== lastMonth) {
        monthMarks.push({ week, label: MONTHS[m] })
        lastMonth = m
      }
    })
    return { cells: out, weeks: Math.floor((days.length - 1 + first) / 7) + 1, months: monthMarks }
  }, [days])

  // Phones: start scrolled to the most recent weeks.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [cells])

  const W = weeks * CELL + 4
  const H = 7 * CELL + 22
  const peakCell = cells.find((c) => c.date === peak?.date)

  return (
    <div className="gh-cal-scroll" ref={scrollRef} data-lenis-prevent>
      <svg
        className={`gh-cal${revealed ? ' is-revealed' : ''}`}
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        role="img"
        aria-label={`Contribution calendar: ${days.length} days, busiest day ${peak?.count} contributions on ${peak && fmtDate(peak.date)}`}
      >
        {months.map((m) => (
          <text key={`${m.week}-${m.label}`} x={m.week * CELL + 2} y="10" className="gh-cal-month">
            {m.label}
          </text>
        ))}
        <g transform="translate(2 18)">
          {cells.map((c) => (
            <circle
              key={c.date}
              cx={c.week * CELL + CELL / 2}
              cy={c.dow * CELL + CELL / 2}
              r={[1.6, 3.2, 4.4, 5.4, 6.3][c.level]}
              className={`gh-dot gh-dot--l${c.level}`}
              style={{ '--d': `${c.week * 14}ms` }}
            >
              <title>
                {c.count} contribution{c.count === 1 ? '' : 's'} on {fmtDate(c.date)}
              </title>
            </circle>
          ))}
          {peakCell && (
            <g
              className="gh-peak"
              transform={`translate(${peakCell.week * CELL + CELL / 2} ${peakCell.dow * CELL + CELL / 2})`}
            >
              <line
                x1="0"
                y1={-(peakCell.dow * CELL + CELL / 2 + 18)}
                x2="0"
                y2="-12"
                className="gh-peak-thread"
              />
              <circle r="9.5" className="gh-peak-ring" />
              <g className="gh-spider" transform="translate(0 -14)">
                <path d="M-2 -1 L-6 -4 L-7 -7 M2 -1 L6 -4 L7 -7 M-2 1 L-7 1 L-8 3 M2 1 L7 1 L8 3 M-2 2 L-5 5 L-5 8 M2 2 L5 5 L5 8" />
                <ellipse rx="2.6" ry="3.4" cy="1" />
                <circle r="1.8" cy="-2.6" />
              </g>
            </g>
          )}
        </g>
      </svg>
    </div>
  )
}

export default function GitHubSection() {
  const sectionRef = useRef(null)
  const [near, setNear] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el || !('IntersectionObserver' in window)) {
      setNear(true)
      setRevealed(true)
      return undefined
    }
    // Fetch well before it scrolls in; animate when it's actually visible.
    const pre = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), {
      rootMargin: '900px 0px',
    })
    const vis = new IntersectionObserver(([e]) => e.isIntersecting && setRevealed(true), {
      threshold: 0.2,
    })
    pre.observe(el)
    vis.observe(el)
    return () => {
      pre.disconnect()
      vis.disconnect()
    }
  }, [])

  const { status, data, fetchedAt } = useGitHub(GITHUB_USER, near)
  const summary = useMemo(() => (data?.days?.length ? summarize(data.days) : null), [data])
  const run = revealed && status === 'ready'

  const stats = [
    { n: data?.total, l: 'Contributions (12 mo)', c: 'cyan' },
    { n: summary?.active, l: 'Active Days', c: 'mag' },
    { n: summary?.longest, l: 'Longest Streak (days)', c: 'red' },
    { n: summary?.peak?.count, l: 'Busiest Day', c: 'cyan' },
  ]

  return (
    <section id="github" ref={sectionRef} className="github-section" aria-labelledby="github-title">
      <div className="github-halftone" aria-hidden="true" />
      <div className="github-head">
        <div>
          <div className="section-label reveal reveal-left">// ISSUE #05 — WEB LOGS</div>
          <h2 id="github-title" className="section-title" style={{ margin: 0 }}>
            <LetterReveal text="SPIDER-SENSE" variant="letter-pop" stagger={40} />
          </h2>
          <p className="section-intro" style={{ marginBottom: 0 }}>
            Live from GitHub: every dot is a day of commits, PRs and reviews. Most of my
            client and company work lives in private repos, but it still lights up the web.
          </p>
        </div>
        <a
          className="gh-profile"
          href={LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`GitHub profile @${GITHUB_USER} (opens in a new tab)`}
        >
          {data?.profile?.avatar ? (
            <img src={data.profile.avatar} alt="" width="56" height="56" loading="lazy" />
          ) : (
            <span className="gh-profile-fallback" aria-hidden="true">
              <GitHubIcon />
            </span>
          )}
          <span className="gh-profile-text">
            <strong>@{GITHUB_USER}</strong>
            <span>
              {data?.profile
                ? `${data.profile.repos} public repos · ${data.profile.followers} followers`
                : 'github.com'}
            </span>
          </span>
          <span className="gh-profile-cta">
            FOLLOW <ExternalIcon />
          </span>
        </a>
      </div>

      <div className="gh-panel">
        <div className="gh-panel-header">
          <span>CONTRIBUTION WEB · LAST 12 MONTHS</span>
          <span className={`gh-live gh-live--${status}`}>
            <span className="gh-live-dot" aria-hidden="true" />
            {status === 'ready'
              ? `LIVE · SYNCED ${timeAgo(new Date(fetchedAt).toISOString()).toUpperCase()}`
              : status === 'error'
                ? 'SIGNAL LOST'
                : 'TUNING IN…'}
          </span>
        </div>

        <div className="gh-stats">
          {stats.map((s) => (
            <div key={s.l} className="gh-stat">
              <span className={`gh-stat-n gh-stat-n--${s.c}`}>
                {status === 'ready' ? <CountUp value={s.n} run={run} /> : '···'}
              </span>
              <span className="gh-stat-l">{s.l}</span>
            </div>
          ))}
        </div>

        {status === 'error' ? (
          <div className="gh-error">
            The live feed is swinging back soon.{' '}
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer">
              See my GitHub directly →
            </a>
          </div>
        ) : data?.days?.length ? (
          <>
            <HalftoneCalendar days={data.days} peak={summary?.peak} revealed={revealed} />
            <div className="gh-legend">
              <span>
                Peak: <strong>{summary.peak.count}</strong> on {fmtDate(summary.peak.date)}
                {summary.current > 0 && (
                  <>
                    {' '}· Current streak: <strong>{summary.current}d</strong>
                  </>
                )}
              </span>
              <span className="gh-legend-scale" aria-hidden="true">
                Less
                {[0, 1, 2, 3, 4].map((l) => (
                  <svg key={l} width="14" height="14" viewBox="0 0 14 14">
                    <circle cx="7" cy="7" r={[1.6, 3.2, 4.4, 5.4, 6.3][l]} className={`gh-dot gh-dot--l${l} is-static`} />
                  </svg>
                ))}
                More
              </span>
            </div>
          </>
        ) : (
          <div className="gh-skeleton" aria-hidden="true" />
        )}
      </div>

      {data?.repos?.length > 0 && (
        <div className="gh-repos">
          <div className="gh-repos-title">RECENTLY SWUNG BY</div>
          <div className="gh-repos-grid">
            {data.repos.map((r) => (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="gh-repo"
              >
                <span className="gh-repo-name">{r.name.replace(/[-_]/g, ' ')}</span>
                <span className="gh-repo-meta">
                  {r.language && (
                    <span className="gh-repo-lang">
                      <span
                        className="gh-repo-lang-dot"
                        style={{ background: LANG_COLORS[r.language] ?? 'var(--cyan)' }}
                      />
                      {r.language}
                    </span>
                  )}
                  <span>pushed {timeAgo(r.pushed)}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
