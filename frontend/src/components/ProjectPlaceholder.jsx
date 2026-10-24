const DOT = { cyan: '#00d4ff', red: '#e8192c', mag: '#ff00aa' }

/**
 * Project media. Screenshots render full-bleed (`cover`) with responsive
 * srcset; logo-style art (`contain`) and icon-only projects sit centred on
 * the halftone panel. Explicit width/height reserve the box so nothing
 * shifts while the image streams in.
 */
export default function ProjectPlaceholder({
  color,
  image,
  icon,
  title,
  contain = false,
  sizes = '(max-width: 900px) 100vw, 33vw',
  eager = false,
}) {
  const dot = DOT[color] ?? DOT.cyan
  return (
    <div className={`project-media project-media--${color}${contain || !image ? ' is-contain' : ''}`}>
      <div className="project-media-dots" style={{ '--dot': `${dot}22` }} />
      {image ? (
        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes={image.srcSet ? sizes : undefined}
          width={image.w}
          height={image.h}
          alt={title ? `${title} screenshot` : ''}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="project-media-img"
        />
      ) : icon ? (
        <img src={icon} alt="" loading="lazy" decoding="async" className="project-media-icon" />
      ) : (
        <span className="project-media-mono" aria-hidden="true">
          {title?.split(' ').map((w) => w[0]).slice(0, 3).join('')}
        </span>
      )}
    </div>
  )
}
