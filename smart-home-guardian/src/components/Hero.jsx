export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="hero-content">
        <div className="hero-text fade-up visible">
          <div className="hero-badge">
            <span className="dot"></span>
            Sistema de Monitoramento Inteligente
          </div>
          <h1>Proteja sua casa com <span className="gradient-text">inteligência</span> que nunca dorme</h1>
          <p>Receba alertas em tempo real sobre portas abertas, movimento detectado, fumaça e risco de incêndio. Tudo em um só lugar, com tecnologia de ponta.</p>
          <div className="hero-buttons">
            <a href="#pricing" className="btn-primary"> Começar Agora</a>
            <a href="#how" className="btn-secondary">▶ Ver Como Funciona</a>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="num">24/7</div>
              <div className="label">Monitoramento</div>
            </div>
            <div className="stat-item">
              <div className="num">100%</div>
              <div className="label">Automação</div>
            </div>
            <div className="stat-item">
              <div className="num">5s</div>
              <div className="label">Resposta</div>
            </div>
          </div>
        </div>
        <div className="hero-visual fade-up visible">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="orbit-ring r1"></div>
            <div className="orbit-ring r2"></div>
            <img src="/logo.png" alt="Smart Home Guardian Logo" className="hero-logo" />
          </div>
        </div>
      </div>
    </section>
  )
}