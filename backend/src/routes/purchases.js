import { Router } from "express"
import { db } from "../db.js"
import { sendPurchaseConfirmation } from "../services/mailService.js"

const router = Router()

router.post("/", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim()
    const email = String(req.body.email || "").trim().toLowerCase()
    const planId = Number(req.body.planId)

    if (!name || !email || !Number.isInteger(planId)) {
      return res.status(400).json({ error: "Nome, e-mail e plano são obrigatórios." })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Informe um e-mail válido." })
    }

    const plan = db.getPlanById(planId)
    if (!plan) return res.status(404).json({ error: "Plano não encontrado." })

    let user = db.getUserByEmail(email)
    if (!user) user = db.createUser(name, email)

    const purchase = db.createPurchase(user.id, plan.id, plan.price, "simulation")
    let emailSent = false

    try {
      await sendPurchaseConfirmation({
        to: email,
        name,
        planName: plan.name,
        amount: plan.price,
        purchaseId: purchase.id,
      })
      emailSent = true
    } catch (error) {
      console.error("Falha ao enviar a confirmação do plano:", error.message)
    }

    return res.status(201).json({
      id: purchase.id,
      status: purchase.status,
      emailSent,
      user: { id: user.id, name: user.name, email: user.email },
      plan: { id: plan.id, name: plan.name, price: plan.price },
    })
  } catch (error) {
    console.error("Falha ao registrar a solicitação do plano:", error.message)
    return res.status(500).json({ error: "Não foi possível registrar a solicitação." })
  }
})

export default router
