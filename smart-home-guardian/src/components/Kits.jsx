import { useState } from "react"

const KIT_PRICE = 349.90
const SHIPPING = 7.99
const TOTAL = (KIT_PRICE + SHIPPING).toLocaleString("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export default function Kits() {
  const [modalOpen, setModalOpen] = useState(false)
  const [step, setStep] = useState("form")
  const [error, setError] = useState("")
  const [emailSent, setEmailSent] = useState(false)

  const abrirModal = () => {
    setStep("form")
    setError("")
    setEmailSent(false)
    setModalOpen(true)
  }

  const finalizar = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setStep("processing")
    setError("")

    try {
      const response = await fetch("/api/kit-purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          shippingAddress: formData.get("shippingAddress"),
        }),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Não foi possível registrar a solicitação.")
      setEmailSent(data.emailSent === true)
      setStep("success")
    } catch (requestError) {
      setError(requestError.message)
      setStep("form")
    }
  }

  return (
    <section className="kits" id="kits">
      <div className="section-header fade-up">
        <span className="section-tag">Kit DIY</span>
        <h2>Monte seu sistema sem complicação</h2>
        <p>O Kit Guardian Start chega pré-configurado. Instale, conecte ao aplicativo e comece a monitorar sua casa.</p>
      </div>

      <div className="kit-card fade-up visible">
        <div className="kit-info">
          <span className="kit-badge">📦 Entrega estimada em até 10 dias úteis</span>
          <h3>Kit Guardian Start</h3>
          <p className="kit-desc">Tudo o que você precisa para começar a proteger sua casa.</p>
          <ul>
            <li>1 Hub Central Guardian pré-configurado</li>
            <li>2 Sensores de porta e janela</li>
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
          <p className="kit-note">Suporte incluso</p>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" aria-label="Fechar" onClick={() => setModalOpen(false)}>×</button>

            {step === "form" && (
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
                    <label htmlFor="kit-name">Nome completo</label>
                    <input id="kit-name" type="text" name="name" autoComplete="name" required placeholder="Seu nome completo" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="kit-email">E-mail</label>
                    <input id="kit-email" type="email" name="email" autoComplete="email" required placeholder="seu@email.com" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="kit-address">Endereço de entrega</label>
                    <input id="kit-address" type="text" name="shippingAddress" autoComplete="street-address" required placeholder="Rua, número, bairro, cidade - UF, CEP" />
                  </div>

                  <p className="payment-simulation">Demonstração acadêmica: nenhum pagamento ou envio é processado.</p>
                  {error && <p className="form-error" role="alert">{error}</p>}
                  <button type="submit" className="btn-primary checkout-btn">Registrar reserva demonstrativa</button>
                </form>
              </>
            )}

            {step === "processing" && (
              <div className="success-screen" role="status">
                <div className="spinner" style={{ width: 48, height: 48, borderWidth: 4 }} />
                <h3>Registrando a solicitação...</h3>
                <p>Estamos enviando a confirmação por e-mail.</p>
              </div>
            )}

            {step === "success" && (
              <div className="success-screen">
                <div className="success-icon">✓</div>
                <h3>Solicitação registrada</h3>
                <p>{emailSent ? "Enviamos a confirmação para o seu e-mail." : "A solicitação foi registrada, mas não conseguimos enviar o e-mail. Verifique a configuração SMTP."}</p>
                <p className="success-detail">Esta é uma demonstração: nenhum pagamento ou envio foi processado.</p>
                <button className="btn-primary" onClick={() => setModalOpen(false)}>Fechar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
