const steps = [
  { num: '1', title: 'Cadastre-se', desc: 'Crie sua conta no Smart Home Guardian e configure seu perfil de segurança em poucos minutos.' },
  { num: '2', title: 'Configure os Sensores', desc: 'Adicione e posicione os sensores virtuais nos ambientes da casa que deseja monitorar.' },
  { num: '3', title: 'Receba Alertas', desc: 'Pronto! Agora você recebe notificações em tempo real sobre qualquer evento detectado.' },
]

export default function HowItWorks() {
  return (
    <section className="how-it-works" id="how">
      <div className="section-header fade-up visible">
        <div className="section-tag">Como Funciona</div>
        <h2>Três passos para uma casa protegida</h2>
        <p>Configuração simples e intuitiva. Em minutos sua casa estará monitorada.</p>
      </div>
      <div className="steps">
        {steps.map((s, i) => (
          <div className="step fade-up visible" key={i}>
            <div className="step-number">{s.num}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}