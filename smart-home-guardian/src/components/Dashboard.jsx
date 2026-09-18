import { useState, useEffect, useRef } from 'react'

const initialLogs = [
  { time: '14:32', icon: '🚪', text: '<strong>Porta da Cozinha</strong> foi aberta' },
  { time: '14:28', icon: '📡', text: '<strong>Sala de Estar</strong> — Movimento detectado' },
  { time: '14:15', icon: '🚪', text: '<strong>Porta da Frente</strong> foi fechada' },
  { time: '13:50', icon: '💨', text: '<strong>Cozinha</strong> — Nível de fumaça normalizado' },
  { time: '13:42', icon: '📡', text: '<strong>Quarto 1</strong> — Movimento detectado' },
  { time: '13:30', icon: '🚪', text: '<strong>Porta dos Fundos</strong> foi fechada' },
]

const newEvents = [
  { time: '14:35', icon: '📡', text: '<strong>Garagem</strong> — Movimento detectado' },
  { time: '14:33', icon: '🚪', text: '<strong>Janela do Quarto</strong> foi aberta' },
  { time: '14:30', icon: '💨', text: '<strong>Cozinha</strong> — Nível de fumaça estável' },
  { time: '14:25', icon: '🔥', text: '<strong>Sala</strong> — Temperatura normal (23°C)' },
  { time: '14:20', icon: '🚪', text: '<strong>Porta da Frente</strong> foi fechada' },
]

const sensors = [
  { icon: '', value: '8', label: 'Portas Monitoradas', status: 'ok', statusText: '✓ Todas fechadas' },
  { icon: '', value: '5', label: 'Sensores de Movimento', status: 'ok', statusText: '✓ Sem atividade' },
  { icon: '', value: '3', label: 'Detectores de Fumaça', status: 'ok', statusText: '✓ Níveis normais' },
  { icon: '', value: '24°C', label: 'Temp. Ambiente', status: 'ok', statusText: '✓ Dentro do limite' },
]

const sidebarItems = [
  '📊 Visão Geral', '🚪 Portas e Janelas', '📡 Movimento', '💨 Fumaça',
  '🔥 Temperatura', '🔔 Alertas', '📈 Relatórios', '⚙️ Configurações',
]

export default function Dashboard() {
  const [logs, setLogs] = useState(initialLogs)
  const eventIndex = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = newEvents[eventIndex.current % newEvents.length]
      eventIndex.current++
      setLogs(prev => [newLog, ...prev].slice(0, 8))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="dashboard-section" id="dashboard">
      <div className="section-header fade-up visible">
        <div className="section-tag">Dashboard</div>
        <h2>Controle total na palma da mão</h2>
        <p>Acompanhe todos os sensores e eventos em tempo real por um painel intuitivo e moderno.</p>
      </div>
      <div className="dashboard-mockup fade-up visible">
        <div className="dashboard-header">
          <div className="title">
            <img src="/logo.png" alt="Logo" />
            Smart Home Guardian
          </div>
          <div className="dashboard-status">
            <span className="dot"></span>
            Sistema Ativo
          </div>
        </div>
        <div className="dashboard-body">
          <div className="dashboard-sidebar">
            {sidebarItems.map((item, i) => (
              <div className={`nav-item ${i === 0 ? 'active' : ''}`} key={i}>{item}</div>
            ))}
          </div>
          <div className="dashboard-main">
            <div className="dashboard-cards">
              {sensors.map((s, i) => (
                <div className="dash-card" key={i}>
                  <div className="icon">{s.icon}</div>
                  <div className="value">{s.value}</div>
                  <div className="label">{s.label}</div>
                  <div className={`status ${s.status}`}>{s.statusText}</div>
                </div>
              ))}
            </div>
            <div className="dashboard-log">
              <h4>📋 Log de Eventos Recentes</h4>
              {logs.map((log, i) => (
                <div className="log-entry" key={i}>
                  <span className="log-time">{log.time}</span>
                  <span className="log-icon">{log.icon}</span>
                  <span className="log-text" dangerouslySetInnerHTML={{ __html: log.text }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}