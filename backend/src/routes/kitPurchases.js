import { Router } from "express"
import { db } from "../db.js"
import { sendKitConfirmation } from "../services/mailService.js"

const router = Router()
const KIT_TOTAL = 349.90 + 7.99

router.post("/", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim()
    const email = String(req.body.email || "").trim().toLowerCase()
    const shippingAddress = String(req.body.shippingAddress || "").trim()

    if (!name || !email || !shippingAddress) {
      return res.status(400).json({ error: "Nome, e-mail e endereço de entrega são obrigatórios." })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Informe um e-mail válido." })
    }

    let user = db.getUserByEmail(email)
    if (!user) user = db.createUser(name, email)

    const purchase = db.createKitPurchase(user.id, KIT_TOTAL, "simulation", shippingAddress)
    let emailSent = false

    try {
      await sendKitConfirmation({
        to: email,
        name,
        amount: KIT_TOTAL,
        purchaseId: purchase.id,
        shippingAddress,
      })
      emailSent = true
    } catch (error) {
      console.error("Falha ao enviar a confirmação da reserva do kit:", error.message)
    }

    return res.status(201).json({ id: purchase.id, status: purchase.status, emailSent })
  } catch (error) {
    console.error("Falha ao registrar a reserva do kit:", error.message)
    return res.status(500).json({ error: "Não foi possível registrar a solicitação." })
  }
})

export default router
