import { useState, useEffect } from 'react'

export default function Navbar({ onOpenSystemPreview, onCloseSystemPreview, isSystemPreview }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-logo">
        <img src="/logo.png" alt="Smart Home Guardian" />
        <span>Smart Home Guardian</span>
      </div>
      <ul id="primary-navigation" className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {isSystemPreview ? (
          <li><button className="nav-text-button" onClick={() => {
            setMenuOpen(false)
            onCloseSystemPreview()
          }}>Voltar ao site</button></li>
        ) : (
          <>
            <li><a href="#features" onClick={() => setMenuOpen(false)}>Funcionalidades</a></li>
            <li><a href="#how" onClick={() => setMenuOpen(false)}>Como Funciona</a></li>
            <li><button className="btn-nav btn-nav-outline" onClick={() => {
              setMenuOpen(false)
              onOpenSystemPreview()
            }}>Visão do sistema</button></li>
            <li><a href="#pricing" onClick={() => setMenuOpen(false)}>Planos</a></li>
            <li><button className="btn-nav" onClick={() => {
              setMenuOpen(false)
              document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })
            }}>Começar</button></li>
          </>
        )}
      </ul>
      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-controls="primary-navigation"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span><span></span><span></span>
      </button>
    </nav>
  )
}
