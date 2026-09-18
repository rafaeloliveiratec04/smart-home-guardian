import nodemailer from "nodemailer"

let transporter = null

function createTransporter() {
  if (transporter) return transporter

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 30000,
      greetingTimeout: 15000,
      socketTimeout: 30000,
    })
    console.log("📧 SMTP configurado:", process.env.SMTP_HOST, process.env.SMTP_USER)
  } else {
    console.log("📧 SMTP não configurado — modo teste (Ethereal)")
  }

  return transporter
}
export async function sendPurchaseConfirmation({ to, name, planName, amount, purchaseId }) {
  const transport = createTransporter()
  const fromEmail = process.env.FROM_EMAIL || "no-reply@smarthomeguardian.com"

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0f172a; padding: 30px; border-radius: 10px 10px 0 0;">
        <h1 style="color: #fff; margin: 0;">Smart Home Guardian</h1>
        <p style="color: #94a3b8; margin: 5px 0 0;">Confirmação de Compra</p>
      </div>
      <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2>Olá, ${name}! 👋</h2>
        <p>Sua compra foi aprovada com sucesso! Aqui estão os detalhes:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Plano:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${planName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Valor:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">R$ ${amount.toFixed(2).replace(".", ",")}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Pedido:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">#${purchaseId}</td>
          </tr>
          <tr>
            <td style="padding: 10px;"><strong>Status:</strong></td>
            <td style="padding: 10px; color: #16a34a;">✓ Pagamento confirmado</td>
          </tr>
        </table>
        <p>Sua casa agora está protegida com o Smart Home Guardian! 🏠</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="color: #64748b; font-size: 12px;">Este é um email automático, não responda.</p>
      </div>
    </div>
  `

  const info = await transport.sendMail({
    from: `"Smart Home Guardian" <${fromEmail}>`,
    to,
    subject: "✅ Compra Confirmada — Smart Home Guardian",
    html,
  })

  console.log("✅ Email enviado para:", to, "| ID:", info.messageId)

  return info
}