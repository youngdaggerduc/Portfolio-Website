export default function SpiderCommStrip() {
  return (
    <a href="#/chatbot" className="spider-comm-strip" aria-label="Spider-Comm AI chatbot">
      <div className="spider-comm-track">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="spider-comm-group">
            <span className="spider-comm-pill spider-comm-pill--red">
              🕷️ ASK PIERCE ANYTHING
            </span>
            <span className="spider-comm-pill spider-comm-pill--dark">
              SPIDER-COMM AI CHATBOT →
            </span>
            <span className="spider-comm-pill spider-comm-pill--ghost">
              CLICK TO LAUNCH 🕷️
            </span>
          </div>
        ))}
      </div>
    </a>
  )
}
