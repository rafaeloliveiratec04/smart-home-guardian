import nodemailer from "nodemailer"

let transporter

function getTransporter() {
  if (transporter) return transporter

  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP não configurado. Defina SMTP_HOST, SMTP_USER e SMTP_PASS no backend/.env.")
  }

  const port = Number(process.env.SMTP_PORT || 587)
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 30000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
  })

  console.log("SMTP configurado para", SMTP_HOST)
  return transporter
}

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}[char]))

const formatAmount = (amount) => Number(amount).toFixed(2).replace(".", ",")
const fromAddress = () => process.env.FROM_EMAIL || process.env.SMTP_USER

export async function sendPurchaseConfirmation({ to, name, planName, amount, purchaseId }) {
  const safeName = escapeHtml(name)
  const safePlanName = escapeHtml(planName)
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #172536;">
      <div style="background: #0f172a; padding: 30px; border-radius: 10px 10px 0 0;">
        <h1 style="color: #fff; margin: 0;">Smart Home Guardian</h1>
        <p style="color: #94a3b8; margin: 5px 0 0;">Confirmação da solicitação</p>
      </div>
      <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2>Olá, ${safeName}!</h2>
        <p>Registramos sua solicitação para o plano ${safePlanName}.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Plano:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${safePlanName}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Valor informado:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">R$ ${formatAmount(amount)}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Solicitação:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">#${purchaseId}</td></tr>
          <tr><td style="padding: 10px;"><strong>Status:</strong></td><td style="padding: 10px; color: #b45309;">Demonstração — nenhum pagamento foi processado</td></tr>
        </table>
        <p style="color: #64748b; font-size: 12px;">Este é um e-mail automático. Não responda.</p>
      </div>
    </div>
  `

  return getTransporter().sendMail({
    from: `"Smart Home Guardian" <${fromAddress()}>`,
    to,
    subject: "Confirmação da solicitação — Smart Home Guardian",
    html,
  })
}

export async function sendKitConfirmation({ to, name, amount, purchaseId, shippingAddress }) {
  const safeName = escapeHtml(name)
  const safeAddress = escapeHtml(shippingAddress)
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #172536;">
      <div style="background: #0f172a; padding: 30px; border-radius: 10px 10px 0 0;">
        <h1 style="color: #fff; margin: 0;">Smart Home Guardian</h1>
        <p style="color: #94a3b8; margin: 5px 0 0;">Confirmação da reserva</p>
      </div>
      <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2>Olá, ${safeName}!</h2>
        <p>Recebemos sua reserva demonstrativa do Kit Guardian Start. Confira os dados:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Pedido:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">#${purchaseId}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Kit:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Kit Guardian Start</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Valor informado, com frete:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">R$ ${formatAmount(amount)}</td></tr>
          <tr><td style="padding: 10px; vertical-align: top;"><strong>Endereço informado:</strong></td><td style="padding: 10px;">${safeAddress}</td></tr>
        </table>
        <p>Demonstração — nenhum pagamento ou envio foi processado.</p>
        <p style="color: #64748b; font-size: 12px;">Este é um e-mail automático. Não responda.</p>
      </div>
    </div>
  `

  return getTransporter().sendMail({
    from: `"Smart Home Guardian" <${fromAddress()}>`,
    to,
    subject: "Confirmação da reserva — Smart Home Guardian",
    html,
  })
}
