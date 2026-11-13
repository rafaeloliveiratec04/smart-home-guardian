export default function Footer({ onOpenSystemPreview }) {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-brand">
          <div className="logo-row">
            <img src="/logo.png" alt="Smart Home Guardian" />
            <span>Smart Home Guardian</span>
          </div>
          <p>Sistema de monitoramento residencial inteligente. Projeto acadêmico de demonstração.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Produto</h4>
            <a href="#features">Funcionalidades</a>
            <a href="#how">Como funciona</a>
            <button className="footer-link-button" onClick={onOpenSystemPreview}>Visão do sistema</button>
            <a href="#kits">Kit Guardian Start</a>
            <a href="#pricing">Planos</a>
            <a href="#cta">Comece agora</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Smart Home Guardian. Projeto acadêmico — Desenvolvido por Rafael.
      </div>
    </footer>
  )
}
