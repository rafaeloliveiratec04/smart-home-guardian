import { useState, useEffect } from 'react'
import heroFamily from '../assets/hero-family.png'
import doorPopular from '../assets/door-popular.png'
import coupleApp from '../assets/couple-app.png'

const slides = [
  {
    src: heroFamily,
    alt: 'Família protegida em casa pelo Smart Home Guardian',
    tag: ' Proteção de verdade',
    text: 'Para qualquer lar — do apartamento compacto à casa de família.'
  },
  {
    src: doorPopular,
    alt: 'Morador conferindo a câmera e campainha inteligente no portão',
    tag: ' Entrada monitorada',
    text: 'Câmera e campainha inteligente cuidando de quem chega.'
  },
  {
    src: coupleApp,
    alt: 'Casal idoso conferindo o aplicativo de segurança em casa',
    tag: ' Controle na palma da mão',
    text: 'Todo o monitoramento do seu lar direto no aplicativo, fácil de usar.'
  }
]

export default function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
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

      <section className="hero-showcase">
        <div className="showcase-frame fade-up visible">
          {slides.map((slide, index) => (
            <div key={index} className={`showcase-slide ${index === current ? 'active' : ''}`}>
              <img src={slide.src} alt={slide.alt} className="showcase-img" />
              <div className="showcase-caption">
                <span className="showcase-tag">{slide.tag}</span>
                <p>{slide.text}</p>
              </div>
            </div>
          ))}
          <div className="showcase-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`showcase-dot ${index === current ? 'active' : ''}`}
                onClick={() => setCurrent(index)}
                aria-label={`Ir para imagem ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}