import express from "express"
import "dotenv/config"
import planRoutes from "./routes/plans.js"
import purchaseRoutes from "./routes/purchases.js"
import kitPurchaseRoutes from "./routes/kitPurchases.js"

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

app.get("/api/health", (req, res) => res.json({ status: "ok" }))
app.use("/api/plans", planRoutes)
app.use("/api/purchases", purchaseRoutes)
app.use("/api/kit-purchases", kitPurchaseRoutes)

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`)
})
