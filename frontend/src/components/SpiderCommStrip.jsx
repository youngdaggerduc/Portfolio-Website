const COPY = {
  default: [
    '🕷️ ASK PIERCE ANYTHING',
    'SPIDER-COMM AI CHATBOT →',
    'CLICK TO LAUNCH 🕷️',
  ],
  reprise: [
    '🕷️ STILL SCROLLING?',
    'ASK THE BOT ABOUT ME →',
    'SPIDER-COMM STANDING BY 🕷️',
  ],
}

export default function SpiderCommStrip({ variant = 'default' }) {
  const [a, b, c] = COPY[variant] ?? COPY.default
  return (
    <a href="#/chatbot" className="spider-comm-strip" aria-label="Spider-Comm AI chatbot">
      <div className="spider-comm-track">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="spider-comm-group">
            <span className="spider-comm-pill spider-comm-pill--red">{a}</span>
            <span className="spider-comm-pill spider-comm-pill--dark">{b}</span>
            <span className="spider-comm-pill spider-comm-pill--ghost">{c}</span>
          </div>
        ))}
      </div>
    </a>
  )
}
