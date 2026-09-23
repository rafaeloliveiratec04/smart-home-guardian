import { useState } from 'react'

export default function Kits() {
  const [modalOpen, setModalOpen] = useState(false)
  const [step, setStep] = useState('form') // form | processing | success
  const [metodo, setMetodo] = useState('cartao')
  const [pixLink, setPixLink] = useState('')

  const KIT_PRECO = 349.90
  const FRETE = 7.99
  const TOTAL = (KIT_PRECO + FRETE).toFixed(2).replace('.', ',')

  const abrirModal = () => {
    setStep('form')
    setPixLink('')
    setModalOpen(true)
  }

  const gerarPix = async () => {
    // TODO: chamar o backend aqui, ex.:
    // const res = await fetch('/api/pagamentos/pix', { method: 'POST', body: ... })
    // const data = await res.json(); setPixLink(data.link)
    setPixLink('https://pix.exemplo.com/pagamento/kit-guardian-start') // placeholder
  }

  const finalizar = (e) => {
    e.preventDefault()
    setStep('processing')
    // TODO: chamar o backend aqui para processar o pagamento,
    // enviar e-mail de confirmação e registrar a reserva
    setTimeout(() => setStep('success'), 2500)
  }

  return (
    <section className="kits" id="kits">
      <div className="section-header fade-up">
        <span className="section-tag">Kit DIY</span>
        <h2>Monte seu sistema sem complicação</h2>
        <p>O Kit Guardian Start chega na sua casa já pré-configurado. Você só instala, conecta no aplicativo e pronto — segurança de verdade no modelo faça você mesmo.</p>
      </div>

      <div className="kit-card fade-up visible">
        <div className="kit-info">
          <span className="kit-badge">📦 Entrega em até 10 dias úteis</span>
          <h3>Kit Guardian Start</h3>
          <p className="kit-desc">Tudo o que você precisa para começar a proteger sua casa hoje mesmo.</p>
          <ul>
            <li>1 Hub Central Guardian (pré-configurado)</li>
            <li>2 Sensores de porta/janela</li>
            <li>1 Sensor de movimento</li>
            <li>1 Sirene interna</li>
            <li>Guia de instalação passo a passo</li>
          </ul>
        </div>
        <div className="kit-purchase">
          <div className="kit-price">
            <span className="currency">R$</span> 349<span className="cents">,90</span>
          </div>
          <p className="kit-frete">+ frete fixo de R$ 7,99 para todo o Brasil</p>
          <button className="btn-primary kit-btn" onClick={abrirModal}>Reservar Kit</button>
          <p className="kit-note">Sem fidelidade • Suporte incluso</p>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>

            {step === 'form' && (
              <>
                <div className="modal-header">
                  <h3>Reservar Kit Guardian Start</h3>
                  <div className="modal-plan">
                    <span className="modal-plan-name">Kit Guardian Start</span>
                    <span className="modal-plan-price">R$ {TOTAL}</span>
                  </div>
                </div>

                <form className="checkout-form" onSubmit={finalizar}>
                  <div className="form-group">
                    <label>👤 Nome completo</label>
                    <input type="text" required placeholder="Seu nome completo" />
                  </div>
                  <div className="form-group">
                    <label>📧 E-mail</label>
                    <input type="email" required placeholder="seu@email.com" />
                  </div>
                  <div className="form-group">
                    <label>🏠 Endereço de entrega</label>
                    <input type="text" required placeholder="Rua, número, bairro, cidade - UF, CEP" />
                  </div>

                  <div className="metodo-pagamento">
                    <button
                      type="button"
                      className={`metodo-btn ${metodo === 'cartao' ? 'active' : ''}`}
                      onClick={() => setMetodo('cartao')}
                    >💳 Cartão</button>
                    <button
                      type="button"
                      className={`metodo-btn ${metodo === 'pix' ? 'active' : ''}`}
                      onClick={() => setMetodo('pix')}
                    >⚡ PIX</button>
                  </div>

                  {metodo === 'cartao' ? (
                    <>
                      <div className="form-group">
                        <label>💳 Número do cartão</label>
                        <input type="text" required placeholder="0000 0000 0000 0000" maxLength={19} />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Validade</label>
                          <input type="text" required placeholder="MM/AA" maxLength={5} />
                        </div>
                        <div className="form-group">
                          <label>CVV</label>
                          <input type="text" required placeholder="123" maxLength={4} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="pix-box">
                      {pixLink ? (
                        <>
                          <p>Link de pagamento gerado! Pague para confirmar sua reserva:</p>
                          <a href={pixLink} target="_blank" rel="noreferrer" className="btn-primary pix-link-btn">Abrir pagamento PIX ⚡</a>
                          <p className="pix-note">Assim que o pagamento for confirmado, você recebe um e-mail e sua reserva aparece aqui no site.</p>
                        </>
                      ) : (
                        <>
                          <p>Gere um link seguro de pagamento via PIX:</p>
                          <button type="button" className="btn-secondary pix-gen-btn" onClick={gerarPix}>Gerar link de pagamento</button>
                        </>
                      )}
                    </div>
                  )}

                  <button type="submit" className="btn-primary checkout-btn">
                    Confirmar reserva • R$ {TOTAL}
                  </button>
                  <p className="checkout-secure">🔒 Pagamento seguro • Entrega em até 10 dias úteis</p>
                </form>
              </>
            )}

            {step === 'processing' && (
              <div className="success-screen">
                <div className="spinner" style={{ width: 48, height: 48, borderWidth: 4 }}></div>
                <h3>Processando sua reserva...</h3>
                <p>Aguarde um instante, estamos confirmando tudo.</p>
              </div>
            )}

            {step === 'success' && (
              <div className="success-screen">
                <div className="success-icon">✅</div>
                <h3>Reserva efetuada com sucesso!</h3>
                <p>Enviamos a confirmação para o seu e-mail.</p>
                <p className="success-detail">📦 Seu Kit Guardian Start chega em até 10 dias úteis.</p>
                <button className="btn-primary" onClick={() => setModalOpen(false)}>Beleza, fechar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}