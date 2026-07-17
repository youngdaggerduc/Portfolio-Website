/**
 * Fixed left-edge "web strand" that doubles as a scroll-progress bar. The
 * path draws itself (strokeDashoffset scrubbed by useMotionStage → webSpine)
 * and a small spider glyph rides the leading end down the page.
 *
 * Rendered on every page but hidden by CSS below 900px / on reduced motion;
 * the JS scrub only runs under the desktop-FX gate, so on mobile this is an
 * inert, invisible SVG.
 */
export default function WebSpine() {
  return (
    <svg
      className="web-spine"
      viewBox="0 0 40 1000"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* Faint full strand so the channel reads even before it's drawn */}
      <path
        className="web-spine-track"
        d="M20 0 C 8 120, 32 240, 20 360 C 8 480, 32 600, 20 720 C 8 840, 30 940, 20 1000"
        fill="none"
      />
      {/* The drawn-in strand (pathLength=1 → dashoffset math is normalized) */}
      <path
        id="web-spine-path"
        className="web-spine-line"
        d="M20 0 C 8 120, 32 240, 20 360 C 8 480, 32 600, 20 720 C 8 840, 30 940, 20 1000"
        fill="none"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset="1"
      />
      {/* Little radial-web rider that travels with the leading edge */}
      <g id="web-spine-rider" className="web-spine-rider">
        <circle cx="20" cy="6" r="5.5" />
        <path
          d="M20 6 L20 -2 M20 6 L27 1 M20 6 L28 6 M20 6 L27 11 M20 6 L20 14 M20 6 L13 11 M20 6 L12 6 M20 6 L13 1"
          fill="none"
        />
      </g>
    </svg>
  )
}
