'use client'

import styles from './page.module.css'
import Footer from './Footer'
import NavBar from './NavBar'
import WhatsAppButton from './WhatsAppButton'

export default function IpsumConstruction() {
    const servicios = [
        {
          titulo: 'Bono Artículo 59',
          imagen: '/landing/servicios/art59.png',
          descripcion: 'El Bono Artículo 59 responde a la directriz 27 del Banhvi y es una modalidad de subsidio que se otorga a las familias con necesidades especiales, facilitando el acceso a una vivienda adecuada bajo condiciones específicas y flexibles. El subsidio no incluye Gastos Administrativos',
          pdfUrl: "/landing/Art59.pdf",
          pdfName: "Bono artículo 59.pdf",
        },
        {
          titulo: 'Construcción en lote propio',
          imagen: '/landing/servicios/construccion.png',
          descripcion: 'Para poder construir una casa, es necesario que la familia tenga un lote propio inscrito en el registro nacional a nombre de la persona que realiza el trámite, con plano de catastro visado por la municipalidad, acceso a servicios públicos (agua y luz) y estar al día en la municipalidad.',
          pdfUrl: "/landing/ConstruccionLotePropio.pdf",
          pdfName: "Construcción en lote propio.pdf",
        },
        {
          titulo: 'Remodelación, Ampliación, Mejoras y Terminación',
          imagen: '/landing/servicios/admayor.jpeg',
          descripcion: 'Permite a las familias realizar mejoras significativas en sus hogares mediante un bono de vivienda, facilitando el financiamiento para proyectos de remodelación, ampliación, mejora o terminación de su vivienda. Este programa está diseñado para apoyar a aquellas familias que ya poseen una vivienda',
          pdfUrl: "/landing/Mejoras.pdf",
          pdfName: "Remodelación, Ampliación, Mejoras y Terminación.pdf",
        },
        {
          titulo: 'Bono crédito',
          imagen: '/landing/servicios/credito.png',
          descripcion: 'Modalidad de financiamiento diseñada para que las familias puedan acceder a una vivienda mediante la combinación de un bono y un crédito complementario para cubrir una parte del costo de la vivienda con el bono, que la familia puede pagar de manera gradual',
          pdfUrl: "/landing/BonoCredito.pdf",
          pdfName: "Bono crédito.pdf",
        },
      ]
      const handleDownload = (pdfUrl, pdfName) => {
        const link = document.createElement("a")
        link.href = pdfUrl
        link.download = pdfName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    return(
        <>
        <NavBar></NavBar>

            <header className={styles.headerBonos}>
                <h1 className={styles.titleBonos}>Bonos de vivienda</h1>
            </header>

            <section className={styles.sectionBonos}>
            <div className={styles.contentBonos}>
                <div className={styles.textContentBonos}>
                <p>
                    Nuestra constructora <span className={styles.highlightBonos}>ofrece un servicio llave en mano</span>, donde nos 
                    encargamos de todo el proceso de construcción, incluyendo la gestión de la 
                    cuadrilla, compra de materiales, y trámites de permisos. Nos especializamos 
                    en <span className={styles.highlightBonos}>viviendas de interés social</span> mediante un sistema constructivo en 
                    mampostería integral.
                </p>
                
                <p>
                    También ofrecemos consultoría y dirección técnica en la tramitología para 
                    obtener bonos de vivienda, un subsidio estatal destinado a familias de 
                    bajos recursos, clase media, adultos mayores y personas con discapacidad 
                    que <span className={styles.highlightBonos}>cumplan con estos requisitos</span>:
                </p>
                
                <ul className={styles.requirementsBonos}>
                    <li>Constituir una familia, salvo en el caso de adultos mayores.</li>
                    <li>No haber recibido un bono de vivienda anteriormente.</li>
                    <li>Poseer un lote o no tener ninguna propiedad a su nombre.</li>
                </ul>
                
                <p>
                    Contamos con <span className={styles.highlightBonos}>autorización de Grupo Mutual</span> para realizar estos trámites, y 
                    realizamos un análisis detallado de cada familia para brindar un servicio 
                    personalizado.
                </p>
                
                <p>
                    Nuestra misión es promover <span className={styles.highlightBonos}>edificaciones sostenibles y de alta calidad</span>, 
                    enfocándonos en viviendas unifamiliares que ofrezcan espacios seguros y 
                    dignos para las familias costarricenses, contribuyendo al desarrollo de las 
                    comunidades.
                </p>
                </div>
                
                <div className={styles.imageContainerBonos}>
                <img
                    src="/landing/casa1.webp"
                    alt="Casa modelo de interés social"
                    width={500}
                    height={400}
                    className={styles.imageBonos}
                />
                </div>
            </div>
            </section>

            <section className={styles.serviciosContenedor}>
        <div className={styles.serviciosRejilla}>
            {servicios.map((servicio, index) => (
            <article key={index} className={styles.serviciosTarjeta}>
                <div className={styles.serviciosEnvolturImagen}>
                <img
                    src={servicio.imagen}
                    alt=""
                    width={400}
                    height={300}
                    className={styles.serviciosImagen}
                />
                </div>
                <div className={styles.serviciosContenido}>
              <h2 className={styles.serviciosTitulo}>{servicio.titulo}</h2>
              <p className={styles.serviciosDescripcion}>{servicio.descripcion}</p>
              <button className={styles.serviciosBoton} onClick={() => handleDownload(servicio.pdfUrl, servicio.pdfName)}>
                Más información
                
              </button>
            </div>
            </article>
            ))}
        </div>
        </section>

        <Footer></Footer>
        <WhatsAppButton></WhatsAppButton>
        </>    
    )
}