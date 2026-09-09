import { Router } from "express"
import { db } from "../db.js"
import { sendPurchaseConfirmation } from "../services/mailService.js"

const router = Router()

router.get("/", (req, res) => {
  res.json(db.getPurchases())
})

router.post("/", async (req, res) => {
  const { name, email, planId, paymentMethod } = req.body

  if (!name || !email || !planId) {
    return res.status(400).json({ error: "Nome, email e planId são obrigatórios" })
  }

  let user = db.getUserByEmail(email)
  if (!user) {
    user = db.createUser(name, email)
  }

  const plan = db.getPlanById(planId)
  if (!plan) return res.status(404).json({ error: "Plano não encontrado" })

  const purchase = db.createPurchase(user.id, plan.id, plan.price, paymentMethod)

  try {
    await sendPurchaseConfirmation({
      to: email,
      name,
      planName: plan.name,
      amount: plan.price,
      purchaseId: purchase.id,
    })
  } catch (err) {
    console.error("⚠️ Erro ao enviar email:", err.message)
  }

  res.status(201).json({
    id: purchase.id,
    status: "paid",
    message: "Compra realizada com sucesso! Email de confirmação enviado.",
    user: { id: user.id, name: user.name, email: user.email },
    plan: { id: plan.id, name: plan.name, price: plan.price },
  })
})

router.get("/:id", (req, res) => {
  const purchase = db.getPurchaseById(req.params.id)
  if (!purchase) return res.status(404).json({ error: "Compra não encontrada" })
  res.json(purchase)
})

router.delete("/:id", (req, res) => {
  if (!db.deletePurchase(req.params.id)) return res.status(404).json({ error: "Compra não encontrada" })
  res.json({ message: "Compra deletada" })
})

export default router