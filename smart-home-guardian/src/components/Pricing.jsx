import { useState, useEffect } from 'react'
import { FaCheckCircle, FaTimes, FaCreditCard, FaUser, FaEnvelope, FaLock } from 'react-icons/fa'

export default function Pricing() {
  const [plans, setPlans] = useState([])
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', card: '', expiry: '', cvv: '' })
  const [step, setStep] = useState('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:3001/api/plans')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(p => ({
          ...p,
          features: p.features || [],
          featured: p.name === 'Profissional',
          btn: p.price === 0 ? 'Começar Grátis' : 'Assinar Agora',
        }))
        setPlans(formatted)
      })
      .catch(err => {
        console.error('Erro ao buscar planos:', err)
        setPlans([
          { id: 1, name: 'Essencial', desc: 'Monitoramento básico', price: 29.90, period: '/mês', featured: false, features: ['8 sensores de porta', 'Notificações em tempo real', 'Painel de controle'], btn: 'Assinar Agora' },
          { id: 2, name: 'Profissional', desc: 'Proteção completa', price: 59.90, period: '/mês', featured: true, features: ['Tudo do Essencial', 'Câmeras de segurança', 'Detecção de movimento', 'Histórico de eventos'], btn: 'Assinar Agora' },
          { id: 3, name: 'Premium', desc: 'Monitoramento 24/7', price: 99.90, period: '/mês', featured: false, features: ['Tudo do Profissional', 'Monitoramento 24/7', 'Suporte prioritário', 'Instalação inclusa'], btn: 'Assinar Agora' },
        ])
      })
  }, [])

  const handleOpen = (plan) => {
    setSelectedPlan(plan)
    setStep('form')
    setError('')
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:3001/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          planId: selectedPlan.id,
          paymentMethod: 'credit_card',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar compra')
      }

      setLoading(false)
      setStep('success')
    } catch (err) {
      setLoading(false)
      setError(err.message)
    }
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
                  {error && <p className="form-error">{error}</p>}
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