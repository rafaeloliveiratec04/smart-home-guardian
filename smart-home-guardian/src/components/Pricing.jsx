const plans = [
  {
    name: 'Starter', desc: 'Ideal para apartamentos e casas pequenas',
    price: '0', period: '/mês', featured: false,
    features: ['Até 4 sensores', '1 ambiente monitorado', 'Notificações por e-mail', 'Histórico de 7 dias', 'Suporte por chat'],
    btn: 'Começar Grátis',
  },
  {
    name: 'Guardian Pro', desc: 'Para casas de médio e grande porte',
    price: '49', period: '/mês', featured: true,
    features: ['Sensores ilimitados', 'Ambientes ilimitados', 'Notificações em tempo real', 'Histórico de 90 dias', 'Relatórios personalizados', 'Suporte prioritário 24/7'],
    btn: 'Assinar Agora',
  },
  {
    name: 'Enterprise', desc: 'Para condomínios e empresas',
    price: '199', period: '/mês', featured: false,
    features: ['Tudo do plano Pro', 'Múltiplas residências', 'API de integração', 'Histórico ilimitado', 'Gestor de conta dedicado', 'SLA garantido'],
    btn: 'Falar com Vendas',
  },
]

export default function Pricing() {
  return (
    <section className="pricing" id="pricing">
      <div className="section-header fade-up visible">
        <div className="section-tag">Planos</div>
        <h2>Escolha o plano ideal para você</h2>
        <p>Flexibilidade para qualquer tamanho de residência. Comece grátis e faça upgrade quando precisar.</p>
      </div>
      <div className="pricing-grid">
        {plans.map((p, i) => (
          <div className={`price-card ${p.featured ? 'featured' : ''} fade-up visible`} key={i}>
            <h3>{p.name}</h3>
            <p className="desc">{p.desc}</p>
            <div className="price">
              <span className="currency">R$</span>{p.price}<span className="period">{p.period}</span>
            </div>
            <ul>
              {p.features.map((f, j) => <li key={j}>{f}</li>)}
            </ul>
            <button className="btn-primary">{p.btn}</button>
          </div>
        ))}
      </div>
    </section>
  )
}