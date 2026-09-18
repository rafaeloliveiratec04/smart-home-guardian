import { FaDoorOpen, FaWalking, FaSmog, FaFire, FaBell, FaChartBar } from 'react-icons/fa'

const features = [
  { icon: <FaDoorOpen />, title: 'Portas e Janelas', desc: 'Sensores que detectam aberturas e fechamentos em tempo real. Saiba imediatamente se algo foi aberto quando não deveria.' },
  { icon: <FaWalking />, title: 'Detecção de Movimento', desc: 'Sensores de presença com tecnologia infravermelha que identificam movimento em qualquer ambiente da casa.' },
  { icon: <FaSmog />, title: 'Detector de Fumaça', desc: 'Monitoramento contínuo de níveis de fumaça no ar, com alertas imediatos ao detectar níveis perigosos.' },
  { icon: <FaFire />, title: 'Alerta de Incêndio', desc: 'Sensor de temperatura que identifica aumentos anormais, ativando protocolo de emergência automaticamente.' },
  { icon: <FaBell />, title: 'Notificações Instantâneas', desc: 'Receba alertas em tempo real no seu celular, tablet ou computador. Nunca mais seja pego de surpresa.' },
  { icon: <FaChartBar />, title: 'Relatórios e Histórico', desc: 'Acompanhe todo o histórico de eventos, gere relatórios detalhados e analise padrões de segurança.' },
]

export default function Features() {
  return (
    <section className="features" id="features">
      <div className="section-header fade-up visible">
        <div className="section-tag">Funcionalidades</div>
        <h2>Tudo o que você precisa para uma casa segura</h2>
        <p>Cobertura completa de monitoramento com notificações instantâneas e controle total pelo aplicativo.</p>
      </div>
      <div className="features-grid">
        {features.map((f, i) => (
          <div className="feature-card fade-up visible" key={i}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}