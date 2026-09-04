import { useState } from 'react'
import { FaCheckCircle, FaTimes, FaCreditCard, FaUser, FaEnvelope, FaLock } from 'react-icons/fa'

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
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', card: '', expiry: '', cvv: '' })
  const [step, setStep] = useState('form')
  const [loading, setLoading] = useState(false)

  const handleOpen = (plan) => {
    setSelectedPlan(plan)
    setStep('form')
    setForm({ name: '', email: '', card: '', expiry: '', cvv: '' })
  }

  const handleClose = () => {
    setSelectedPlan(null)
  }

  const handleChange = (e) => {
    let { name, value } = e.target
    if (name === 'card') {
      value = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19)
    }
    if (name === 'expiry') {
      value = value.replace(/\D/g, '').replace(/(.{2})(.)/, '$1/$2').slice(0, 5)
    }
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4)
    }
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('success')
    }, 2000)
  }

  const isValid = form.name.trim() && form.email.trim() && form.card.length >= 16 && form.expiry.length === 5 && form.cvv.length >= 3

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
            <button className="btn-primary" onClick={() => handleOpen(p)}>{p.btn}</button>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {step === 'form' && (
              <>
                <button className="modal-close" onClick={handleClose}>
                  <FaTimes />
                </button>
                <div className="modal-header">
                  <h3>Finalizar Assinatura</h3>
                  <div className="modal-plan">
                    <span className="modal-plan-name">{selectedPlan.name}</span>
                    <span className="modal-plan-price">R$ {selectedPlan.price}{selectedPlan.period}</span>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="checkout-form">
                  <div className="form-group">
                    <label><FaUser /> Nome Completo</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Seu nome completo"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label><FaEnvelope /> E-mail</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="seu@email.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label><FaCreditCard /> Número do Cartão</label>
                    <input
                      type="text"
                      name="card"
                      placeholder="0000 0000 0000 0000"
                      value={form.card}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label><FaCreditCard /> Validade</label>
                      <input
                        type="text"
                        name="expiry"
                        placeholder="MM/AA"
                        value={form.expiry}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label><FaLock /> CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        placeholder="123"
                        value={form.cvv}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className={`btn-primary checkout-btn ${loading || !isValid ? 'disabled' : ''}`}
                    disabled={loading || !isValid}
                  >
                    {loading ? (
                      <span className="spinner"></span>
                    ) : (
                      `Confirmar Pagamento - R$ ${selectedPlan.price}${selectedPlan.period}`
                    )}
                  </button>
                  <p className="checkout-secure">
                    <FaLock /> Pagamento simulado — nenhum dado real é processado
                  </p>
                </form>
              </>
            )}

            {step === 'success' && (
              <div className="success-screen">
                <button className="modal-close" onClick={handleClose}>
                  <FaTimes />
                </button>
                <div className="success-icon">
                  <FaCheckCircle />
                </div>
                <h3>Assinatura Confirmada!</h3>
                <p>Parabéns, <strong>{form.name.split(' ')[0]}</strong>!</p>
                <p>Seu plano <strong>{selectedPlan.name}</strong> está ativo.</p>
                <p className="success-detail">Um e-mail de confirmação foi enviado para <strong>{form.email}</strong></p>
                <button className="btn-primary" onClick={handleClose}>
                  Voltar ao Site
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}