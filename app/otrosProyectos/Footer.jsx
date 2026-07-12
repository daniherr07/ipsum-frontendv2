'use client'
import styles from './page.module.css'
import {Phone, Mail, MapPin } from 'lucide-react'

export default function Footer(){
    return(
        <section className={styles.contactSection} id='contactos'>
        <div className={styles.containerFooter}>
          <h2 className={styles.contactTitle} >Contáctanos</h2>
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <h3 className={styles.contactInfoTitle}>Información de contacto</h3>
              <div className={styles.contacts}>
                <div className={styles.contactInfoItem}>
                  <Phone />
                  <span>+506 4035-7370</span>
                </div>
                <div className={styles.contactInfoItem}>
                  <Mail />
                  <span>info@ipsumcr.com</span>
                </div>
                <div className={styles.contactInfoItem}>
                  <MapPin />
                  <span>Moravia, San José</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
}