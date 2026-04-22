/**
 * Splits text into per-letter spans. Each letter is a `.reveal` element
 * picked up by the global IntersectionObserver, with a staggered delay.
 */
export default function LetterReveal({
  text,
  variant = 'letter-pop',
  baseDelay = 0,
  stagger = 35,
  className = '',
  ariaLabel,
}) {
  return (
    <span
      className={`letter-wrap ${className}`}
      aria-label={ariaLabel ?? text}
    >
      {Array.from(text).map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className={`letter reveal reveal-${variant}`}
          style={{ '--reveal-delay': `${baseDelay + i * stagger}ms` }}
          aria-hidden="true"
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  )
}
