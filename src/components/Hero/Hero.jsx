import { useEffect, useRef, useState } from 'react'
import './Hero.css'
import HeroScene from './HeroScene'

const mapRange = (val, inMin, inMax, outMin, outMax) => {
  if (val <= inMin) return outMin
  if (val >= inMax) return outMax
  return outMin + ((val - inMin) / (inMax - inMin)) * (outMax - outMin)
}

function Hero() {
  const wrapperRef = useRef(null)
  const textContentRef = useRef(null)
  const indicatorRef = useRef(null)
  const welcomeContainerRef = useRef(null)
  const cardsRef = useRef([])
  
  // Theme State
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('itzfizz-theme') || 'light'
    }
    return 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('itzfizz-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light')
  }

  const scrollProgressRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current) return

      const rect = wrapperRef.current.getBoundingClientRect()
      const scrollDistance = rect.height - window.innerHeight
      
      let progress = 0
      if (scrollDistance > 0) {
        progress = Math.max(0, Math.min(1, -rect.top / scrollDistance))
      }

      scrollProgressRef.current = progress
      const p = progress

      // Phase A -> B: Initial Hero Text Fade Out (0.00 to 0.25)
      if (textContentRef.current) {
        const textOpacity = mapRange(p, 0.00, 0.25, 1, 0)
        const textY = mapRange(p, 0.00, 0.25, 0, -60)
        textContentRef.current.style.opacity = textOpacity
        textContentRef.current.style.transform = `translateY(${textY}px)`
        textContentRef.current.style.pointerEvents = textOpacity <= 0.1 ? 'none' : 'auto'
      }

      if (indicatorRef.current) {
        const indOpacity = mapRange(p, 0.0, 0.15, 1, 0)
        indicatorRef.current.style.opacity = indOpacity
      }

      // Phase D: Welcome Title Reveal (0.65 to 0.80)
      // Note: 3D Object completely settles at 0.65 before this starts.
      if (welcomeContainerRef.current) {
        const welcomeOpacity = mapRange(p, 0.65, 0.80, 0, 1)
        const welcomeY = mapRange(p, 0.65, 0.80, 40, 0)
        welcomeContainerRef.current.style.opacity = welcomeOpacity
        welcomeContainerRef.current.style.transform = `translateY(${welcomeY}px)`
        
        // BUG FIX: we do NOT set pointerEvents to 'auto' on the entire container,
        // otherwise it overlays and breaks the nav theme toggle.
        // We leave pointerEvents: none on the container, and rely on CSS to make
        // the interactive children (if any) clickable.
      }

      // Phase E: Statistical Cards Stagger Reveal (0.80 to 0.95)
      cardsRef.current.forEach((card, index) => {
        if (!card) return
        const start = 0.80 + (index * 0.03) // Faster, tighter stagger
        const end = start + 0.10
        const cardOpacity = mapRange(p, start, end, 0, 1)
        const cardY = mapRange(p, start, end, 30, 0)
        
        card.style.opacity = cardOpacity
        card.style.transform = `translateY(${cardY}px)`
      })
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <div className="hero-scroll-wrapper" ref={wrapperRef}>
      <section className="hero">
        {/* Full-viewport 3D Scene Layer */}
        <div className="hero__scene" aria-hidden="true">
          <HeroScene scrollProgress={scrollProgressRef} theme={theme} />
        </div>

        {/* Foreground Content Layers */}
        <div className="hero__foreground">
          <nav className="hero__nav">
            <div className="hero__logo">ITZFIZZ</div>

            <div className="hero__nav-actions">
              <button 
                className="hero__theme-toggle" 
                type="button" 
                aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
                onClick={toggleTheme}
              >
                {theme === 'light' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                  </svg>
                )}
              </button>
              <button className="hero__menu-btn" type="button">MENU</button>
            </div>
          </nav>

          <div className="hero__body">
            <div className="hero__content" ref={textContentRef}>
              <p className="hero__label">ITZFIZZ DIGITAL</p>
              <h1 className="hero__title">
                DIGITAL
                <br />
                EXPERIENCES
              </h1>
              <p className="hero__description">
                Designing digital experiences that combine
                technology, clarity, and motion.
              </p>
            </div>
          </div>

          <div className="hero__reveal" ref={welcomeContainerRef}>
            <h2 className="hero__welcome-title">
              WELCOME
              <br />
              ITZFIZZ
            </h2>
            
            <div className="hero__stats-grid">
              <div className="hero__stat-card" ref={(el) => (cardsRef.current[0] = el)}>
                <div className="hero__stat-label">01 / CAPABILITY</div>
                <div className="hero__stat-value">Digital Strategy</div>
              </div>
              <div className="hero__stat-card" ref={(el) => (cardsRef.current[1] = el)}>
                <div className="hero__stat-label">02 / CAPABILITY</div>
                <div className="hero__stat-value">Creative Direction</div>
              </div>
              <div className="hero__stat-card" ref={(el) => (cardsRef.current[2] = el)}>
                <div className="hero__stat-label">03 / CAPABILITY</div>
                <div className="hero__stat-value">WebGL Motion</div>
              </div>
              <div className="hero__stat-card" ref={(el) => (cardsRef.current[3] = el)}>
                <div className="hero__stat-label">04 / CAPABILITY</div>
                <div className="hero__stat-value">Brand Identity</div>
              </div>
            </div>
          </div>

          <div className="hero__scroll-indicator" ref={indicatorRef}>
            <span>SCROLL TO EXPLORE</span>
            <span className="hero__scroll-arrow" aria-hidden="true">↓</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero
