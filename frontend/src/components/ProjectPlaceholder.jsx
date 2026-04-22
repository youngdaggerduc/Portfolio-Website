const COLORS = {
  cyan: { bg: 'rgba(0,212,255,0.06)', border: 'rgba(0,212,255,0.2)', dot: '#00d4ff' },
  red: { bg: 'rgba(232,25,44,0.06)', border: 'rgba(232,25,44,0.2)', dot: '#e8192c' },
  mag: { bg: 'rgba(255,0,170,0.06)', border: 'rgba(255,0,170,0.2)', dot: '#ff00aa' },
}

export default function ProjectPlaceholder({ color, icon }) {
  const c = COLORS[color]
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(circle at 30% 40%, ${c.bg} 0%, rgba(7,7,26,0.8) 70%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle, ${c.dot}22 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      />
      <div
        style={{ position: 'absolute', inset: 8, border: `2px solid ${c.border}` }}
      />
      <div
        style={{
          fontSize: 56,
          position: 'relative',
          zIndex: 1,
          filter: `drop-shadow(0 0 20px ${c.dot})`,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          width: 8,
          height: 8,
          background: c.dot,
          borderRadius: '50%',
          boxShadow: `0 0 8px ${c.dot}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          width: 8,
          height: 8,
          background: c.dot,
          borderRadius: '50%',
          boxShadow: `0 0 8px ${c.dot}`,
        }}
      />
    </div>
  )
}
