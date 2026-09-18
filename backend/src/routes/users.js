import { Router } from "express"
import { db } from "../db.js"

const router = Router()

router.get("/", (req, res) => {
  res.json(db.getUsers())
})

router.get("/:id", (req, res) => {
  const user = db.getUserById(req.params.id)
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" })
  res.json(user)
})

router.post("/", (req, res) => {
  const { name, email } = req.body
  if (!name || !email) return res.status(400).json({ error: "Nome e email são obrigatórios" })

  if (db.getUserByEmail(email)) {
    return res.status(409).json({ error: "Email já cadastrado" })
  }

  const user = db.createUser(name, email)
  res.status(201).json(user)
})

router.put("/:id", (req, res) => {
  const { name, email } = req.body
  const user = db.updateUser(req.params.id, name, email)
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" })
  res.json(user)
})

router.delete("/:id", (req, res) => {
  if (!db.deleteUser(req.params.id)) return res.status(404).json({ error: "Usuário não encontrado" })
  res.json({ message: "Usuário deletado com sucesso" })
})

export default router