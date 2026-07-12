'use client'

import styles from './page.module.css'
import Footer from './Footer'
import NavBar from './NavBar'
import WhatsAppButton from './WhatsAppButton'

export default function IpsumConstruction() {
    const caracteristicas = [
      {
        titulo: "Flexibilidad",
        descripcion: "Adaptamos nuestros servicios a las necesidades y presupuesto de cada proyecto.",
        icono: <img src="/landing/money.svg" alt="Light blue building with wooden door" className={styles.icon} loading="lazy" decoding="async"/>
      },
      {
        titulo: "Compromiso",
        descripcion: "Estamos comprometidos con el éxito de tu proyecto y con la satisfacción de tus necesidades.",
        icono:  <img src="/landing/handshake.svg" alt="Handshake" className={styles.icon} loading="lazy" decoding="async"/>
      },
      {
        titulo: "Calidad",
        descripcion:
          "Utilizamos materiales de primera calidad y las mejores prácticas constructivas para garantizar resultados óptimos",
        icono:  <img src="/landing/like.svg" alt="Like" className={styles.icon} loading="lazy" decoding="async"/>
      },
    ]
    const serviciosResidenciales = [
    {
      titulo: "Adaptación a tu presupuesto",
      descripcion:
        "Ofrecemos diferentes opciones para que puedas construir la casa de tus sueños sin exceder tu presupuesto",
    },
    {
      titulo: "Construcción de calidad",
      descripcion: "Utilizamos materiales de primera calidad y técnicas con las mejores prácticas constructivas",
    },
    {
      titulo: "Diseños Personalizados",
      descripcion: "Creamos planos personalizados que reflejan tu estilo único y se adaptan a tus necesidades específicas",
    },
  ]

  const serviciosPublicos = [
    {
      titulo: "Mantenimiento y rehabilitación",
      descripcion: "Extendemos la vida útil de las infraestructuras con técnicas innovadoras y mantenimiento preventivo",
    },
    {
      titulo: "Gestión de proyectos",
      descripcion: "Coordinamos todos los aspectos del proyecto, garantizando la eficiencia y la calidad",
    },
    {
      titulo: "Diseño y construcción",
      descripcion: "Desarrollamos proyectos desde cero, desde la concepción hasta la entrega final",
    },
  ]
    return(
        <>
        <NavBar></NavBar>

            <header className={styles.headerBonos}>
                <h1 className={styles.titleBonos}>Otros Proyectos</h1>
            </header>
            <main className={styles.container}>
              <div className={styles.header}>
                <h1>En Constructora IPSUM, Transformamos ideas en realidad.</h1>
                <p>
                  Nuestra empresa, con una visión de crecimiento continuo, ofrece soluciones integrales de ingeniería civil
                  adaptadas a las necesidades de cada cliente.
                </p>

              </div>

              <section className={styles.descripcion}>
                <p>
                  Contamos con un equipo de ingenieros y arquitectos capacitados y con experiencia en el sector. Nos
                  caracterizamos por:
                </p>
              </section>

              <section className={styles.caracteristicas}>
                {caracteristicas.map((item, index) => (
                  <article key={index} className={styles.caracteristica}>
                    <figure className={styles.iconContainer}>{item.icono}</figure>
                    <h2>{item.titulo}</h2>
                    <p>{item.descripcion}</p>
                  </article>
                ))}
              </section>

              <section className={styles.serviciosContainer}>
                <div className={styles.servicios}>
                  <article className={styles.servicioSeccion}>
                    <div className={styles.servicioHeader}>
                      <img src="/landing/home-bold.svg" alt="" className={styles.servicioIcon} />
                      <h2>Obras residenciales</h2>
                    </div>
                    <p>
                      Desde el diseño hasta la construcción, te acompañamos en la creación de espacios únicos y funcionales.
                      Nuestros servicios residenciales incluyen:
                    </p>
                    <ul className={styles.servicioLista}>
                      {serviciosResidenciales.map((servicio, index) => (
                        <li key={index} className={styles.servicioItem}>
                          <h3>{servicio.titulo}</h3>
                          <p>{servicio.descripcion}</p>
                        </li>
                      ))}
                    </ul>
                  </article>

                  <article className={styles.servicioSeccion}>
                    <div className={styles.servicioHeader}>
                    <img src="/landing/institution.svg" alt="" className={styles.servicioIcon} />
                      <h2>Soluciones para instituciones públicas</h2>
                    </div>
                    <p>
                    Somos tu aliado en la ejecución de proyectos de infraestructura, brindando soluciones integrales y personalizadas. Nuestros servicios incluyen:
                    </p>
                    <ul className={styles.servicioLista}>
                      {serviciosPublicos.map((servicio, index) => (
                        <li key={index} className={styles.servicioItem}>
                          <h3>{servicio.titulo}</h3>
                          <p>{servicio.descripcion}</p>
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>
              </section>
            </main>
        <Footer></Footer>
        <WhatsAppButton></WhatsAppButton>
        </>    
    )
}