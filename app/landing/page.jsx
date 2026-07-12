'use client'

import Image from 'next/image'
import Footer from './Footer'
import NavBar from './NavBar'
import WhatsAppButton from './WhatsAppButton'
import styles from './page.module.css'



export default function IpsumConstruction() {
  const servicios = [
    {
      titulo: 'Bonos de vivienda',
      icono: <img src="/landing/Home.svg" alt="Light blue building with wooden door" className={styles.icono} loading="lazy" decoding="async"/>,
      alineacion: 'izquierda',
      href: "/bonosVivienda"
    },
    {
      titulo: 'Otros proyectos',
      icono: <img src="/landing/Grua.svg" alt="Light blue building with wooden door" className={styles.icono} loading="lazy" decoding="async"/>,
      alineacion: 'derecha',
      href: "/otrosProyectos"
    }
  ]
  const scrollToServices = (e) => {
    e.preventDefault()
    const servicesSection = document.getElementById('servicios')
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
  
  

  return (
    <>
      <NavBar></NavBar>

      <header className={styles.container} id='inicio'>
      <div className={styles.videoBack}>
        <video autoPlay muted preload="auto" loop className={styles.bgVideo}>
          <source src="/landing/bgVideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className={styles.heroContent}>
          <Image
            src="/landing/logo.svg"
            alt="IPSUM Logo"
            width={800}
            height={300}
            className={styles.heroLogo}
          />

          <p className={styles.heroText}>
            Somos una empresa constructora con amplia experiencia y compromiso en el desarrollo de soluciones habitacionales y de infraestructura. Nos especializamos en diseñar y construir proyectos que van desde viviendas personalizadas hasta obras funcionales y comerciales, adaptándonos a las necesidades específicas de cada cliente.
          </p>

          <a className={styles.heroButton} 
          onClick={scrollToServices}>
            ¡Comienza hoy mismo!
          </a>
        </div>
      </div>
    </header>

      <section className={styles.section}>
      <div className={styles.content}>
        <h2 className={styles.title}>
          Transformando la vida<br />
          de los costarricenses
        </h2>
        <p className={styles.description}>
          En IPSUM, entendemos que cada proyecto es único. Nos
          enorgullece ofrecer un servicio integral que responde a
          las necesidades y expectativas de nuestros clientes, ya
          sea en proyectos pequeños, medianos o de mayor
          alcance. Con nuestra experiencia y compromiso,
          hacemos realidad cualquier visión constructiva, siempre
          con la calidad y responsabilidad que nos caracteriza.
        </p>
      </div>
      <div className={styles.imageWrapper}>
        <Image
          src="/landing/ingenieros.png"
          alt="Constructores profesionales"
          className={styles.image}
          fill
          sizes="(max-width: 640px) 300px, (max-width: 1024px) 400px, 613px"
          priority
        />
      </div>
    </section>

    <section className={styles.seccionProyectos} id='proyectos'>
  <h1 className={styles.tituloProyectos}>Nuestros proyectos</h1>
  <div className={styles.galeriaProyectos}>
    <div className={styles.columnaIzquierdaProyectos}>
      <div className={styles.filaArribaProyectos}>
        <div className={styles.imagenPequenaProyectos}>
          <div className={styles.imageContainer}>
            <img 
              src="/landing/tambor2.jpg" 
              alt="Casa 1"
              className={styles.imagenProyectos}
              loading="lazy"
              decoding="async"
            />
            <div className={styles.overlay}>
              
            </div>
          </div>
        </div>
        <div className={styles.imagenPequenaProyectos}>
          <div className={styles.imageContainer}>
            <img 
              src="/landing/casa2.webp" 
              alt="Casa 2"
              className={styles.imagenProyectos}
              loading="lazy"
              decoding="async"
            />
            <div className={styles.overlay}>
              
            </div>
          </div>
        </div>
      </div>
      <div className={styles.imagenMedianaProyectos}>
        <div className={styles.imageContainer}>
          <img 
            src="/landing/tambor.jpg" 
            alt="Casa 3"
            className={styles.imagenProyectos}
            loading="lazy"
            decoding="async"
          />
          <div className={styles.overlay}>
            
          </div>
        </div>
      </div>
    </div>
    <div className={styles.columnaDerechaProyectos}>
      <div className={styles.imagenGrandeProyectos}>
        <div className={styles.imageContainer}>
          <img 
            src="/landing/casa4.webp" 
            alt="Casa 4"
            className={styles.imagenProyectos}
            loading="lazy"
            decoding="async"
          />
          <div className={styles.overlay}>
    
          </div>
        </div>
      </div>
    </div>
  </div>
</section>



    <section className={styles.seccionServicios} id='servicios'>
      <h2 className={styles.tituloServicios} >Servicios</h2>
      <div className={styles.listaServicios}>
        {servicios.map((servicio, index) => (
          <div 
            key={index} 
            className={`${styles.itemServicio} ${servicio.alineacion === 'derecha' ? styles.itemServicioDerecha : ''} ${styles.parahover}`}
          >
            
            <div className={`${styles.contenedorIcono} `} >
              {servicio.icono}
            </div>
            <div className={`${styles.textoServicio}`} onClick={() => window.location.href = servicio.href} style={{ cursor: 'pointer' }}>
              
              {servicio.titulo}
              
            </div>
            
          </div>
        ))}
      </div>
    </section>

    <section className={styles.seccionFilosofia} id='filosofia'>
      <div className={styles.contenedorMision}>
      <img 
          src="/landing/Flag.svg" 
          alt="Bandera" 
          loading="lazy"
          decoding="async"
          className={styles.iconoMision}
      />
        <h2 className={styles.tituloMision}>Misión</h2>
        <p className={styles.textoMision}>
          Somos una empresa dedicada a la construcción, gestión y diseño obras civiles integrales, promoviendo edificaciones sostenibles y de alta calidad. Con un enfoque que va dirigido hacia la vivienda unifamiliar de bien social, brindando a las familias costarricenses espacios dignos y seguros. A través de nuestra experiencia y compromiso contribuimos al desarrollo de las comunidades y al crecimiento del sector de la construcción.
        </p>
      </div>
      <div className={styles.contenedorVision}>
      <img 
          src="/landing/Eye.svg" 
          alt="Bandera" 
          loading="lazy"
          decoding="async"
          className={styles.iconoMision}
      />
        <h2 className={styles.tituloVision}>Visión</h2>
        <p className={styles.textoVision}>
        Ser una de las empresas lideres en construcción integral en Costa Rica, enfocada por ofrecer soluciones innovadoras, accesibles y de alta calidad en obras civiles, con un enfoque especial en la construcción de viviendas unifamiliares de bien social, mejorando así la calidad de las comunidades y transformando positivamente la vida de las familias costarricenses.   
        </p>
      </div>
      <div className={styles.objetivoContainer}>
        <p className={styles.objetivoText}>
          Nuestro objetivo es ser tu aliado en la construcción, brindándote una solución global y acompañándote en cada paso del proceso, desde la idea inicial hasta la entrega final.
        </p>
      </div>
    </section>

      <Footer></Footer>
      <WhatsAppButton />
    </>
  )
}