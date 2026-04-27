// Resolve API URLs.
// In dev: VITE_API_BASE_URL is unset, so fetch hits "/api/..." and Vite's
// proxy (vite.config.js) forwards to the local FastAPI at :8001.
// In prod: set VITE_API_BASE_URL to the backend origin (e.g. https://api.example.com)
// and the same fetch calls become absolute.
const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

export function apiUrl(path) {
  return `${BASE}${path}`
}
