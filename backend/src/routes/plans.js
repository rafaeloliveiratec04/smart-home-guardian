import { Router } from "express"
import { db } from "../db.js"

const router = Router()

router.get("/", (req, res) => {
  const plans = db.getPlans().map((plan) => ({
    ...plan,
    features: plan.features ? plan.features.split(",") : [],
  }))
  res.json(plans)
})

export default router
