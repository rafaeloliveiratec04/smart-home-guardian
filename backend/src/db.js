import { readFileSync, writeFileSync, existsSync } from "fs"
import { fileURLToPath } from "node:url"

const DB_FILE = fileURLToPath(new URL("../database.json", import.meta.url))

let data = {
  users: [],
  plans: [],
  purchases: [],
  kitPurchases: [],
  nextUserId: 1,
  nextPlanId: 1,
  nextPurchaseId: 1,
  nextKitPurchaseId: 1,
}

if (existsSync(DB_FILE)) {
  data = JSON.parse(readFileSync(DB_FILE, "utf-8"))
}

data.kitPurchases ||= []
data.nextKitPurchaseId ||= 1

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
  getUserByEmail: (email) => data.users.find(u => u.email === email),
  createUser: (name, email) => {
    const user = { id: data.nextUserId++, name, email, created_at: new Date().toISOString() }
    data.users.push(user)
    save()
    return user
  },
  // Plans
  getPlans: () => data.plans,
  getPlanById: (id) => data.plans.find(p => p.id === Number(id)),

  // Purchases
  createPurchase: (userId, planId, amount, paymentMethod) => {
    const purchase = {
      id: data.nextPurchaseId++,
      user_id: userId,
      plan_id: planId,
      amount,
      status: "simulated",
      payment_method: paymentMethod || "credit_card",
      created_at: new Date().toISOString(),
    }
    data.purchases.push(purchase)
    save()
    return purchase
  },
  createKitPurchase: (userId, amount, paymentMethod, shippingAddress) => {
    const purchase = {
      id: data.nextKitPurchaseId++,
      user_id: userId,
      kit_name: "Kit Guardian Start",
      amount,
      status: "reserved",
      payment_method: paymentMethod,
      shipping_address: shippingAddress,
      created_at: new Date().toISOString(),
    }
    data.kitPurchases.push(purchase)
    save()
    return purchase
  },
}
