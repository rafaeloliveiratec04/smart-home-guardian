# setup-backend.ps1
# Smart Home Guardian — Backend Setup Script (Windows/PowerShell)

Write-Host "🚀 Criando estrutura do backend..." -ForegroundColor Cyan

# Criar pastas
New-Item -ItemType Directory -Force -Path "src\routes" | Out-Null
New-Item -ItemType Directory -Force -Path "src\services" | Out-Null

# ============================================
# package.json
# ============================================
@'
{
  "name": "smart-home-guardian-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js"
  },
  "dependencies": {
    "better-sqlite3": "^11.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.0",
    "nodemailer": "^6.9.15"
  }
}
'@ | Set-Content "package.json" -Encoding UTF8

# ============================================
# .env
# ============================================
@'
PORT=3001

# SMTP (preencha com seu Gmail para enviar emails reais)
# Deixe vazio para usar email de teste (Ethereal)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
FROM_EMAIL=seu-email@gmail.com
'@ | Set-Content ".env" -Encoding UTF8

# ============================================
# .gitignore
# ============================================
@'
node_modules/
database.sqlite
.env
'@ | Set-Content ".gitignore" -Encoding UTF8

# ============================================
# src/db.js
# ============================================
@'
import Database from "better-sqlite3"

export const db = new Database("database.sqlite")

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    period TEXT DEFAULT "/mês",
    description TEXT,
    features TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    plan_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    status TEXT DEFAULT "paid",
    payment_method TEXT DEFAULT "credit_card",
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (plan_id) REFERENCES plans (id)
  );
`)

const count = db.prepare("SELECT COUNT(*) as total FROM plans").get()
if (count.total === 0) {
  const insert = db.prepare(
    "INSERT INTO plans (name, price, period, description, features) VALUES (?, ?, ?, ?, ?)"
  )
  insert.run("Essencial", 29.90, "/mês", "Monitoramento básico para sua casa", "8 sensores de porta,Notificações em tempo real,Painel de controle")
  insert.run("Profissional", 59.90, "/mês", "Proteção completa com câmeras e alertas", "Tudo do Essencial,Câmeras de segurança,Detecção de movimento,Histórico de eventos")
  insert.run("Premium", 99.90, "/mês", "Monitoramento 24/7 com suporte prioritário", "Tudo do Profissional,Monitoramento 24/7,Suporte prioritário,Instalação inclusa")
  console.log("✅ Planos iniciais criados")
}
'@ | Set-Content "src\db.js" -Encoding UTF8

# ============================================
# src/services/mailService.js
# ============================================
@'
import nodemailer from "nodemailer"

let transporter = null

async function getTransporter() {
  if (transporter) return transporter

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  } else {
    const testAccount = await nodemailer.createTestAccount()
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })
    console.log("📧 Modo teste: Ethereal Email")
  }

  return transporter
}

export async function sendPurchaseConfirmation({ to, name, planName, amount, purchaseId }) {
  const transport = await getTransporter()
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

  if (!process.env.SMTP_HOST) {
    console.log("📧 Preview do email: %s", nodemailer.getTestMessageUrl(info))
  }

  return info
}
'@ | Set-Content "src\services\mailService.js" -Encoding UTF8

# ============================================
# src/routes/users.js
# ============================================
@'
import { Router } from "express"
import { db } from "../db.js"

const router = Router()

router.get("/", (req, res) => {
  const users = db.prepare("SELECT * FROM users ORDER BY created_at DESC").all()
  res.json(users)
})

router.get("/:id", (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id)
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" })
  res.json(user)
})

router.post("/", (req, res) => {
  const { name, email } = req.body
  if (!name || !email) return res.status(400).json({ error: "Nome e email são obrigatórios" })

  try {
    const result = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)").run(name, email)
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid)
    res.status(201).json(user)
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      return res.status(409).json({ error: "Email já cadastrado" })
    }
    res.status(500).json({ error: "Erro ao criar usuário" })
  }
})

router.put("/:id", (req, res) => {
  const { name, email } = req.body
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id)
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" })

  db.prepare("UPDATE users SET name = ?, email = ? WHERE id = ?")
    .run(name ?? user.name, email ?? user.email, req.params.id)

  res.json(db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id))
})

router.delete("/:id", (req, res) => {
  const result = db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id)
  if (result.changes === 0) return res.status(404).json({ error: "Usuário não encontrado" })
  res.json({ message: "Usuário deletado com sucesso" })
})

export default router
'@ | Set-Content "src\routes\users.js" -Encoding UTF8

# ============================================
# src/routes/plans.js
# ============================================
@'
import { Router } from "express"
import { db } from "../db.js"

const router = Router()

router.get("/", (req, res) => {
  const plans = db.prepare("SELECT * FROM plans ORDER BY price ASC").all()
  const formatted = plans.map(p => ({
    ...p,
    features: p.features ? p.features.split(",") : []
  }))
  res.json(formatted)
})

router.get("/:id", (req, res) => {
  const plan = db.prepare("SELECT * FROM plans WHERE id = ?").get(req.params.id)
  if (!plan) return res.status(404).json({ error: "Plano não encontrado" })
  res.json({ ...plan, features: plan.features ? plan.features.split(",") : [] })
})

router.post("/", (req, res) => {
  const { name, price, period, description, features } = req.body
  if (!name || price == null) return res.status(400).json({ error: "Nome e preço são obrigatórios" })

  const featuresStr = Array.isArray(features) ? features.join(",") : (features || "")
  const result = db.prepare(
    "INSERT INTO plans (name, price, period, description, features) VALUES (?, ?, ?, ?, ?)"
  ).run(name, price, period || "/mês", description || "", featuresStr)

  res.status(201).json({ id: result.lastInsertRowid, message: "Plano criado" })
})

router.put("/:id", (req, res) => {
  const { name, price, period, description, features } = req.body
  const plan = db.prepare("SELECT * FROM plans WHERE id = ?").get(req.params.id)
  if (!plan) return res.status(404).json({ error: "Plano não encontrado" })

  const featuresStr = Array.isArray(features) ? features.join(",") : (features ?? plan.features)
  db.prepare("UPDATE plans SET name = ?, price = ?, period = ?, description = ?, features = ? WHERE id = ?")
    .run(name ?? plan.name, price ?? plan.price, period ?? plan.period, description ?? plan.description, featuresStr, req.params.id)

  res.json({ message: "Plano atualizado" })
})

router.delete("/:id", (req, res) => {
  const result = db.prepare("DELETE FROM plans WHERE id = ?").run(req.params.id)
  if (result.changes === 0) return res.status(404).json({ error: "Plano não encontrado" })
  res.json({ message: "Plano deletado" })
})

export default router
'@ | Set-Content "src\routes\plans.js" -Encoding UTF8

# ============================================
# src/routes/purchases.js
# ============================================
@'
import { Router } from "express"
import { db } from "../db.js"
import { sendPurchaseConfirmation } from "../services/mailService.js"

const router = Router()

router.get("/", (req, res) => {
  const purchases = db.prepare(`
    SELECT p.*, u.name as user_name, u.email as user_email, pl.name as plan_name
    FROM purchases p
    JOIN users u ON p.user_id = u.id
    JOIN plans pl ON p.plan_id = pl.id
    ORDER BY p.created_at DESC
  `).all()
  res.json(purchases)
})

router.post("/", async (req, res) => {
  const { name, email, planId, paymentMethod } = req.body

  if (!name || !email || !planId) {
    return res.status(400).json({ error: "Nome, email e planId são obrigatórios" })
  }

  let user = db.prepare("SELECT * FROM users WHERE email = ?").get(email)
  if (!user) {
    const result = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)").run(name, email)
    user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid)
  }

  const plan = db.prepare("SELECT * FROM plans WHERE id = ?").get(planId)
  if (!plan) return res.status(404).json({ error: "Plano não encontrado" })

  const purchase = db.prepare(`
    INSERT INTO purchases (user_id, plan_id, amount, status, payment_method)
    VALUES (?, ?, ?, "paid", ?)
  `).run(user.id, plan.id, plan.price, paymentMethod || "credit_card")

  const purchaseId = purchase.lastInsertRowid

  try {
    await sendPurchaseConfirmation({
      to: email,
      name,
      planName: plan.name,
      amount: plan.price,
      purchaseId,
    })
  } catch (err) {
    console.error("⚠️ Erro ao enviar email:", err.message)
  }

  res.status(201).json({
    id: purchaseId,
    status: "paid",
    message: "Compra realizada com sucesso! Email de confirmação enviado.",
    user: { id: user.id, name: user.name, email: user.email },
    plan: { id: plan.id, name: plan.name, price: plan.price },
  })
})

router.get("/:id", (req, res) => {
  const purchase = db.prepare(`
    SELECT p.*, u.name as user_name, u.email as user_email, pl.name as plan_name
    FROM purchases p
    JOIN users u ON p.user_id = u.id
    JOIN plans pl ON p.plan_id = pl.id
    WHERE p.id = ?
  `).get(req.params.id)

  if (!purchase) return res.status(404).json({ error: "Compra não encontrada" })
  res.json(purchase)
})

router.delete("/:id", (req, res) => {
  const result = db.prepare("DELETE FROM purchases WHERE id = ?").run(req.params.id)
  if (result.changes === 0) return res.status(404).json({ error: "Compra não encontrada" })
  res.json({ message: "Compra deletada" })
})

export default router
'@ | Set-Content "src\routes\purchases.js" -Encoding UTF8

# ============================================
# src/server.js
# ============================================
@'
import express from "express"
import cors from "cors"
import "dotenv/config"
import { db } from "./db.js"
import userRoutes from "./routes/users.js"
import planRoutes from "./routes/plans.js"
import purchaseRoutes from "./routes/purchases.js"

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get("/api/health", (req, res) => res.json({ status: "ok" }))
app.use("/api/users", userRoutes)
app.use("/api/plans", planRoutes)
app.use("/api/purchases", purchaseRoutes)

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`)
})
'@ | Set-Content "src\server.js" -Encoding UTF8

# ============================================
# Instalar dependências
# ============================================
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "✅ Backend criado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "Para rodar:" -ForegroundColor Cyan
Write-Host "  npm run dev"
Write-Host ""
Write-Host "O servidor vai iniciar em http://localhost:3001" -ForegroundColor Cyan