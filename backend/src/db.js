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
    { id: 1, name: "Essencial", price: 29.90, period: "/mês", description: "Monitoramento básico para sua casa", features: "8 sensores de porta,Notificações em tempo real,Painel de controle", created_at: new Date().toISOString() },
    { id: 2, name: "Profissional", price: 59.90, period: "/mês", description: "Proteção completa com câmeras e alertas", features: "Tudo do Essencial,Câmeras de segurança,Detecção de movimento,Histórico de eventos", created_at: new Date().toISOString() },
    { id: 3, name: "Premium", price: 99.90, period: "/mês", description: "Monitoramento 24/7 com suporte prioritário", features: "Tudo do Profissional,Monitoramento 24/7,Suporte prioritário,Instalação inclusa", created_at: new Date().toISOString() },
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