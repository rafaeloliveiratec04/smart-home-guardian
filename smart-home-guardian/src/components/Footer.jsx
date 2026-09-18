export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-brand">
          <div className="logo-row">
            <img src="/logo.png" alt="Smart Home Guardian" />
            <span>Smart Home Guardian</span>
          </div>
          <p>Sistema de monitoramento residencial inteligente. Segurança, tecnologia e tranquilidade para sua casa, 24 horas por dia, 7 dias por semana.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Produto</h4>
            <a href="#features">Funcionalidades</a>
            <a href="#how">Como Funciona</a>
            <a href="#dashboard">Dashboard</a>
            <a href="#pricing">Planos</a>
          </div>
          <div className="footer-col">
            <h4>Empresa</h4>
            <a href="#">Sobre Nós</a>
            <a href="#">Blog</a>
            <a href="#">Carreiras</a>
            <a href="#">Contato</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <a href="#">Termos de Uso</a>
            <a href="#">Privacidade</a>
            <a href="#">LGPD</a>
            <a href="#">Suporte</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; 2026 Smart Home Guardian. Projeto acadêmico — Desenvolvido por Rafael. Todos os direitos reservados.
      </div>
    </footer>
  )
}