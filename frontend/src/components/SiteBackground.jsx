import { lazy, Suspense, useEffect, useState } from 'react'
import WebBackground from './WebBackground'
import { isDesktopFX } from '../lib/motion'

const WebGLBackground = lazy(() => import('./WebGLBackground'))

/**
 * Chooses the background layer:
 *   - desktop + fine pointer + motion OK → lazy three.js web (WebGLBackground)
 *   - everything else                    → the CSS parallax WebBackground
 *     (which itself no-ops on touch / reduced motion).
 *
 * The three.js chunk is never requested on phones, and the decision is made
 * after mount so SSR/first paint stay cheap. While the WebGL chunk streams
 * in, the CSS web shows as the Suspense fallback so there's never a gap.
 */
export default function SiteBackground() {
  const [webgl, setWebgl] = useState(false)

  useEffect(() => {
    if (isDesktopFX()) setWebgl(true)
  }, [])

  if (!webgl) return <WebBackground />

  return (
    <Suspense fallback={<WebBackground />}>
      <WebGLBackground />
    </Suspense>
  )
}
