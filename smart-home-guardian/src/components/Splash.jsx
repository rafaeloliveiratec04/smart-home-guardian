import { useState, useEffect, useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

gsap.registerPlugin(useGSAP)

export default function Splash() {
  const container = useRef(null)
  const [removido, setRemovido] = useState(false)

  useGSAP(() => {
    const tl = gsap.timeline({ onComplete: () => setRemovido(true) })
    tl.fromTo(".splash-logo", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.7)" })
      .fromTo(".splash-eyebrow", { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, "-=0.25")
      .fromTo(".splash-titulo", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.2")
      .fromTo(".splash-subtitulo", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.35")
      .fromTo(".splash-barra span", { width: "0%" }, { width: "100%", duration: 1.2, ease: "power1.inOut" }, "-=0.3")
      .to(".splash", { autoAlpha: 0, scale: 1.02, duration: 0.55, ease: "power2.in" }, "+=0.1")
  }, { scope: container })

  useEffect(() => {
    if (removido) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const fallback = window.setTimeout(() => setRemovido(true), 6000)
    return () => {
      window.clearTimeout(fallback)
      document.body.style.overflow = previousOverflow
    }
  }, [removido])

  if (removido) return null

  return (
    <div ref={container}>
      <div className="splash" aria-label="Carregando Smart Home Guardian">
        <div className="splash-grid" />
        <div className="splash-orbit splash-orbit-outer" />
        <div className="splash-orbit splash-orbit-inner" />
        <div className="splash-content">
          <div className="splash-mark">
            <img src="/logo.png" alt="" className="splash-logo" />
            <span className="splash-pulse" />
          </div>
          <p className="splash-eyebrow">PROTEÇÃO INTELIGENTE</p>
          <h1 className="splash-titulo">Smart Home Guardian</h1>
          <p className="splash-subtitulo">Segurança inteligente para o seu lar</p>
          <div className="splash-barra"><span /></div>
          <span className="splash-status">PREPARANDO SEU AMBIENTE</span>
        </div>
      </div>
    </div>
  )
}
