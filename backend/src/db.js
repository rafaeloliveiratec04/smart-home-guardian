import { readFileSync, writeFileSync, existsSync } from "fs"

const DB_FILE = "database.json"

let data = {
  users: [],
  plans: [],
  purchases: [],
  nextUserId: 1,
  nextPlanId: 1,
  nextPurchaseId: 1,
}

if (existsSync(DB_FILE)) {
  data = JSON.parse(readFileSync(DB_FILE, "utf-8"))
}

// Seed de planos
if (data.plans.length === 0) {
  data.plans = [
    { id: 1, name: "Guardian Basic", price: 0, period: "", description: "Proteção essencial para começar", features: "Monitoramento em tempo real,Alertas push,Histórico de 24h", created_at: new Date().toISOString() },
    { id: 2, name: "Guardian Plus", price: 59.90, period: "/mês", description: "Mais inteligência e autonomia para sua casa", features: "Histórico de 30 dias,Relatórios em PDF,Integração com Alexa/Google Home,Automação que espanta invasores", created_at: new Date().toISOString() },
    { id: 3, name: "Guardian Max", price: 99.90, period: "/mês", description: "Proteção avançada", features: "Ligações e SMS de emergência (até 3 contatos mesmo no modo Não Perturbe),Vizinho Protetor: alerta um vizinho de confiança sem resposta em 3 min,Histórico vitalício", created_at: new Date().toISOString() },
  ]
  data.nextPlanId = 4
  save()
  console.log("✅ Planos iniciais criados")
}

function save() {
  writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}

export const db = {
  // Users
  getUsers: () => data.users,
  getUserById: (id) => data.users.find(u => u.id === Number(id)),
  getUserByEmail: (email) => data.users.find(u => u.email === email),
  createUser: (name, email) => {
    const user = { id: data.nextUserId++, name, email, created_at: new Date().toISOString() }
    data.users.push(user)
    save()
    return user
  },
  updateUser: (id, name, email) => {
    const user = data.users.find(u => u.id === Number(id))
    if (user) {
      if (name) user.name = name
      if (email) user.email = email
      save()
    }
    return user
  },
  deleteUser: (id) => {
    const idx = data.users.findIndex(u => u.id === Number(id))
    if (idx === -1) return false
    data.users.splice(idx, 1)
    save()
    return true
  },

  // Plans
  getPlans: () => data.plans,
  getPlanById: (id) => data.plans.find(p => p.id === Number(id)),
  createPlan: (name, price, period, description, features) => {
    const plan = { id: data.nextPlanId++, name, price, period, description, features, created_at: new Date().toISOString() }
    data.plans.push(plan)
    save()
    return plan
  },
  updatePlan: (id, fields) => {
    const plan = data.plans.find(p => p.id === Number(id))
    if (plan) {
      Object.assign(plan, fields)
      save()
    }
    return plan
  },
  deletePlan: (id) => {
    const idx = data.plans.findIndex(p => p.id === Number(id))
    if (idx === -1) return false
    data.plans.splice(idx, 1)
    save()
    return true
  },

  // Purchases
  getPurchases: () => data.purchases.map(p => {
    const user = data.users.find(u => u.id === p.user_id)
    const plan = data.plans.find(pl => pl.id === p.plan_id)
    return { ...p, user_name: user?.name, user_email: user?.email, plan_name: plan?.name }
  }),
  getPurchaseById: (id) => {
    const p = data.purchases.find(p => p.id === Number(id))
    if (!p) return null
    const user = data.users.find(u => u.id === p.user_id)
    const plan = data.plans.find(pl => pl.id === p.plan_id)
    return { ...p, user_name: user?.name, user_email: user?.email, plan_name: plan?.name }
  },
  createPurchase: (userId, planId, amount, paymentMethod) => {
    const purchase = {
      id: data.nextPurchaseId++,
      user_id: userId,
      plan_id: planId,
      amount,
      status: "paid",
      payment_method: paymentMethod || "credit_card",
      created_at: new Date().toISOString(),
    }
    data.purchases.push(purchase)
    save()
    return purchase
  },
  deletePurchase: (id) => {
    const idx = data.purchases.findIndex(p => p.id === Number(id))
    if (idx === -1) return false
    data.purchases.splice(idx, 1)
    save()
    return true
  },
}