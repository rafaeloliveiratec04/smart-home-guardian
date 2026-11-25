import 'dotenv/config'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,               // true na 465; false na 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,   // senha de app, 16 caracteres, sem espaços
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
})

try {
  console.log('Tentando conectar com:', process.env.SMTP_USER)
  await transporter.verify()
  console.log('✅ Conexão e autenticação OK')

  const info = await transporter.sendMail({
    from: `"Smart Home Guardian" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER,
    subject: 'Teste SMTP',
    text: 'Se você recebeu isso, o SMTP está funcionando.',
  })
  console.log('✅ E-mail enviado:', info.messageId)
} catch (err) {
  console.error('❌ Falhou:', err.code, '|', err.message)
}