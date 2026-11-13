import { useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import Splash from "./components/Splash"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Features from "./components/Features"
import HowItWorks from "./components/HowItWorks"
import SystemPreview from "./components/SystemPreview"
import Kits from "./components/Kits"
import Pricing from "./components/Pricing"
import CTA from "./components/CTA"
import Footer from "./components/Footer"

gsap.registerPlugin(useGSAP, ScrollTrigger)

function App() {
  const [showSystemPreview, setShowSystemPreview] = useState(false)

  const openSystemPreview = () => {
    setShowSystemPreview(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const closeSystemPreview = () => {
    setShowSystemPreview(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Revelação por scroll: todo .fade-up anima ao entrar na tela
  // (os classes continuam na marcação — nenhum componente precisa ser tocado)
  useGSAP(() => {
    gsap.utils.toArray(".fade-up").forEach((el) => {
      if (el.classList.contains("visible")) return

      gsap.fromTo(el, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      })
    })
  })

  return (
    <>
      <Splash />
      <Navbar
        onOpenSystemPreview={openSystemPreview}
        onCloseSystemPreview={closeSystemPreview}
        isSystemPreview={showSystemPreview}
      />
      {showSystemPreview ? (
        <SystemPreview />
      ) : (
        <>
          <Hero />
          <Features />
          <HowItWorks />
          <Kits />
          <Pricing />
          <CTA />
        </>
      )}
      <Footer onOpenSystemPreview={openSystemPreview} />
    </>
  )
}

export default App
