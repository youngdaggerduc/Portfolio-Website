import { useEffect, useRef, useState } from 'react'

const TTL = 15 * 60 * 1000 // 15 min, so a refresh doesn't spend the 60/hr anon quota
const key = (user) => `gh-cache-v1:${user}`

function readCache(user) {
  try {
    const raw = sessionStorage.getItem(key(user))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Date.now() - parsed.at < TTL ? parsed : null
  } catch {
    return null
  }
}

function writeCache(user, data) {
  try {
    sessionStorage.setItem(key(user), JSON.stringify({ at: Date.now(), data }))
  } catch {
    /* storage full / private mode: just refetch next time */
  }
}

/** Streaks, peak day and active-day count from the daily calendar. */
export function summarize(days) {
  let longest = 0
  let run = 0
  let peak = days[0]
  let active = 0
  for (const d of days) {
    if (d.count > 0) {
      run += 1
      active += 1
      longest = Math.max(longest, run)
    } else run = 0
    if (!peak || d.count > peak.count) peak = d
  }
  // Current streak counts back from today; an empty *today* doesn't break it
  // (the day isn't over yet), an empty yesterday does.
  let current = 0
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) current += 1
    else if (i === days.length - 1) continue
    else break
  }
  return { longest, current, peak, active }
}

/**
 * Live GitHub data for the portfolio: the past year's contribution calendar
 * (via the public github-contributions API, which scrapes the profile
 * graph) plus profile + recently pushed repos from the GitHub REST API.
 * Fetches only once `enabled` flips true (section near the viewport).
 */
export function useGitHub(user, enabled) {
  const [state, setState] = useState(() => {
    const cached = typeof window !== 'undefined' ? readCache(user) : null
    return cached
      ? { status: 'ready', data: cached.data, fetchedAt: cached.at }
      : { status: 'idle', data: null, fetchedAt: null }
  })

  // Kick off at most once. A ref (not state) gates it so flipping status to
  // 'loading' doesn't re-run the effect and abort the in-flight requests.
  const started = useRef(state.status !== 'idle')

  useEffect(() => {
    if (!enabled || started.current) return undefined
    started.current = true
    const ctrl = new AbortController()
    const get = (url) =>
      fetch(url, { signal: ctrl.signal }).then((r) => {
        if (!r.ok) throw new Error(`${r.status} ${url}`)
        return r.json()
      })

    setState((s) => ({ ...s, status: 'loading' }))
    Promise.allSettled([
      get(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`),
      get(`https://api.github.com/users/${user}`),
      get(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=12&type=owner`),
    ]).then(([cal, profile, repos]) => {
      if (ctrl.signal.aborted) return
      if (cal.status !== 'fulfilled' && profile.status !== 'fulfilled') {
        started.current = false
        setState({ status: 'error', data: null, fetchedAt: null })
        return
      }
      const data = {
        total: cal.value?.total?.lastYear ?? null,
        days: cal.value?.contributions ?? [],
        profile: profile.value
          ? {
              avatar: profile.value.avatar_url,
              name: profile.value.name,
              repos: profile.value.public_repos,
              followers: profile.value.followers,
              since: profile.value.created_at,
            }
          : null,
        repos: (repos.value ?? [])
          .filter((r) => !r.fork && r.name.toLowerCase() !== user.toLowerCase())
          .slice(0, 4)
          .map((r) => ({
            name: r.name,
            url: r.html_url,
            language: r.language,
            pushed: r.pushed_at,
            description: r.description,
          })),
      }
      writeCache(user, data)
      setState({ status: 'ready', data, fetchedAt: Date.now() })
    })
    return () => {
      ctrl.abort()
      started.current = false
    }
  }, [enabled, user])

  return state
}
