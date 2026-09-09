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