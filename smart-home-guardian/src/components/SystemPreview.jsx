import loginScreen from "../assets/preview-login.png"
import profileScreen from "../assets/preview-profile.png"
import homeScreen from "../assets/preview-home.png"

const appScreens = [
  { label: "Visão geral", src: homeScreen, alt: "Tela inicial do Smart Home Guardian" },
  { label: "Perfil", src: profileScreen, alt: "Tela de perfil e configurações do Smart Home Guardian" },
  { label: "Acesso", src: loginScreen, alt: "Tela de acesso ao Smart Home Guardian" },
]

export default function SystemPreview() {
  return (
    <main className="system-preview-section" id="system-preview">
      <header className="system-preview-heading">
        <span className="section-tag">Conheça o aplicativo</span>
        <h1>Segurança da sua casa, na palma da mão</h1>
        <p>Veja as telas reais do Smart Home Guardian no celular.</p>
      </header>

      <div className="preview-phones">
        {appScreens.map((screen) => (
          <article className="preview-phone-wrap" key={screen.label}>
            <h2 className="preview-phone-label">{screen.label}</h2>
            <div className="iphone-frame">
              <div className="iphone-screen">
                <img className="preview-screenshot" src={screen.src} alt={screen.alt} />
                <span className="iphone-notch" aria-hidden="true" />
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="preview-disclaimer">Capturas reais do aplicativo Smart Home Guardian.</p>
    </main>
  )
}
