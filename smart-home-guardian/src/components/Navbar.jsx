import { useState, useEffect } from 'react'

export default function Navbar() {
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
      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li><a href="#features" onClick={() => setMenuOpen(false)}>Funcionalidades</a></li>
        <li><a href="#how" onClick={() => setMenuOpen(false)}>Como Funciona</a></li>
        <li><a href="#dashboard" onClick={() => setMenuOpen(false)}>Dashboard</a></li>
        <li><a href="#pricing" onClick={() => setMenuOpen(false)}>Planos</a></li>
        <li><button className="btn-nav" onClick={() => {
          setMenuOpen(false)
          document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })
        }}>Começar</button></li>
      </ul>
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span><span></span><span></span>
      </div>
    </nav>
  )
}