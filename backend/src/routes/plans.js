import { Router } from "express"
import { db } from "../db.js"

const router = Router()

router.get("/", (req, res) => {
  const plans = db.getPlans().map(p => ({
    ...p,
    features: p.features ? p.features.split(",") : []
  }))
  res.json(plans)
})

router.get("/:id", (req, res) => {
  const plan = db.getPlanById(req.params.id)
  if (!plan) return res.status(404).json({ error: "Plano não encontrado" })
  res.json({ ...plan, features: plan.features ? plan.features.split(",") : [] })
})

router.post("/", (req, res) => {
  const { name, price, period, description, features } = req.body
  if (!name || price == null) return res.status(400).json({ error: "Nome e preço são obrigatórios" })

  const featuresStr = Array.isArray(features) ? features.join(",") : (features || "")
  const plan = db.createPlan(name, price, period || "/mês", description || "", featuresStr)
  res.status(201).json({ id: plan.id, message: "Plano criado" })
})

router.put("/:id", (req, res) => {
  const { name, price, period, description, features } = req.body
  const plan = db.getPlanById(req.params.id)
  if (!plan) return res.status(404).json({ error: "Plano não encontrado" })

  const featuresStr = Array.isArray(features) ? features.join(",") : (features ?? plan.features)
  db.updatePlan(req.params.id, {
    name: name ?? plan.name,
    price: price ?? plan.price,
    period: period ?? plan.period,
    description: description ?? plan.description,
    features: featuresStr,
  })
  res.json({ message: "Plano atualizado" })
})

router.delete("/:id", (req, res) => {
  if (!db.deletePlan(req.params.id)) return res.status(404).json({ error: "Plano não encontrado" })
  res.json({ message: "Plano deletado" })
})

export default router