'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const scrollToContactos = (e) => {
    e.preventDefault()
    const servicesSection = document.getElementById('contactos')
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }
  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <div className={styles.navLogo}>
          {/* Antes hacía POST a /api/toLogin (ruta del sistema viejo, ya no
              existe); ahora entra directo al login real del sistema actual. */}
          <Link href="/login" className={styles.logoButton}>
            <Image
              src="/landing/ipsumBlanco.svg"
              alt="Logo"
              width={36}
              height={36}
              className={styles.logoImage}
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>Inicio</Link>
          <Link href="#contactos" className={styles.navLink} onClick={scrollToContactos}>Contactos</Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={styles.mobileMenuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? 'X' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/" className={styles.mobileNavLink}>Inicio</Link>
          <Link href="#contactos" className={styles.mobileNavLink} onClick={scrollToContactos}>Contactos</Link>
        </div>
      )}
    </nav>
  )
}

