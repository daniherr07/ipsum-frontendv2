'use client'

import Image from 'next/image'
import Footer from '../Footer'
import NavBar from '../NavBar'

import styles from './page.module.css'



export default function Articulo59() {

  const informacion = [
    {
      nombre: "Articulo 59: Nucleo Tipico",
      img1: "/landing/art59/tipico/img1.jpg",
      img2: "/landing/art59/tipico/img2.jpg",
      img3: "/landing/art59/tipico/img3.jpg",
      croquis: "/landing/art59/tipico/croquis.jpg",
    },
    {
      nombre: "Articulo 59: Nucleo Numeroso",
      img1: "/landing/art59/numeroso/img1.jpg",
      img2: "/landing/art59/numeroso/img2.jpg",
      img3: "/landing/art59/numeroso/img3.jpg",
      croquis: "/landing/art59/numeroso/croquis.jpg",
    },
    {
      nombre: "Articulo 59: Discapacidad",
      img1: "/landing/art59/discapacidad/img1.jpg",
      img2: "/landing/art59/discapacidad/img2.jpg",
      img3: "/landing/art59/discapacidad/img3.jpg",
      croquis: "/landing/art59/discapacidad/croquis.jpg",
    },
    {
      nombre: "Articulo 59: Adulto Mayor",
      img1: "/landing/art59/adulto/img1.jpg",
      img2: "/landing/art59/adulto/img2.jpg",
      img3: "/landing/art59/adulto/img3.jpg",
      croquis: "/landing/art59/adulto/croquis.jpg",
    },
  ]

  return(
    <>
    <NavBar></NavBar>

    <main className={styles.main}>
      <section className={styles.seccion}>
        <h1 className={styles.nombre}>Vivienda de 42 m<sup>2</sup> Totalmente habitable</h1>

        <div className={styles.columnas}>
          <div className={styles.imagenes}>
            <Image src={informacion[0].croquis} width={300} height={300} alt="imagen" className={styles.imagen}></Image>
            <Image src={informacion[0].img1} width={300} height={300} alt="imagen" className={styles.imagen}></Image>
            <Image src={informacion[0].img2} width={300} height={300} alt="imagen" className={styles.imagen}></Image>
            <Image src={informacion[0].img3} width={300} height={300} alt="imagen" className={styles.imagen}></Image>
          </div>

          <article className={styles.descripcion}>
            <h2 className={styles.title}>
              Vivienda de 42 m<sup>2</sup>. <br /> Totalmente habitable con todos los sistemas básicos en funcionamiento para familias de 4 miembros o menos
            </h2>

            <h3 className={styles.subtitle}>Acabados de Vivienda</h3>
            <ul>
              <li>Construcción en bloques de concreto.</li>
              <li>Repello y pintura exterior (pintura existente en muestrario).</li>
              <li>Cielo raso tablilla plástica blanca económica en toda la casa.</li>
              <li>Ventanas en marco de aluminio natural, vidrio fijo transparente y celosías.</li>
              <li>Fregadero en acero inoxidable de un tanque y una batea con mueble chorreado en concreto.</li>
              <li>Pila de lavar roja de un tanque y una batea.</li>
              <li>Sanitario y lavamanos tipo económico.</li>
              <li>Puertas principales en pino y liviana en baño.</li>
              <li>Sistema eléctrico completo en el interior de la vivienda.</li>
              <li>Canoas y bajantes en PVC.</li>
              <li>Tanque séptico y drenaje.</li>
              <li>Grifería y accesorios en general tipo económicos.</li>
              <li>Acabado de piso lijado gris.</li>
              <li>Acera de acceso a la vivienda.</li>
            </ul>

            <h3 className={styles.subtitle}>No incluye:</h3>
            <ul>
              <li>Enchapes (cerámica y azulejos).</li>
              <li>Acometida eléctrica del límite de la propiedad a casa (poste con caja de medidor y accesorios).</li>
              <li>Repello y pintura internas.</li>
              <li>Puertas y marcos en dormitorios.</li>
            </ul>

            <p className={styles.warning}>
              <em>
                El art.59 responde a la directriz 27 del Banhvi, por lo tanto, no permite cambios en área, especificaciones y acabados.{" "}
                <span>El subsidio no incluye Gastos Administrativos y permisos de construcción.</span>
              </em>
            </p>
          </article>
        </div>
      </section>


      <br />
      <hr />
      <br />











      <section className={styles.seccion}>
        <h1 className={styles.nombre}>{informacion[1].nombre}</h1>

        <div className={styles.columnas}>

          <article className={styles.descripcion}>
            <h2 className={styles.title}>Vivienda de 50 m<sup>2</sup>. <br />Totalmente habitable con todos los sistemas básicos en funcionamiento para familias de 5 miembros o mas.</h2>
      
            <h3 className={styles.subtitle}>Acabados de Vivienda</h3>
            <ul>
                <li>Construcción en bloques de concreto.</li>
                <li>Repello y pintura exterior (pintura existente en muestrario).</li>
                <li>Cielo raso tablilla plástica blanca económica en toda la casa.</li>
                <li>Ventanas en marco de aluminio natural, vidrio fijo transparente y celosías.</li>
                <li>Fregadero en acero inoxidable de un tanque y una batea con mueble chorreado en concreto.</li>
                <li>Pila de lavar roja de un tanque y una batea.</li>
                <li>Sanitario y lavamanos tipo económico.</li>
                <li>Puertas principales en pino y liviana en baño.</li>
                <li>Sistema eléctrico completo en el interior de la vivienda.</li>
                <li>Canoas y bajantes en PVC.</li>
                <li>Tanque séptico y drenaje.</li>
                <li>Grifería y accesorios en general tipo económicos.</li>
                <li>Acabado de piso lijado gris.</li>
                <li>Aceras de acceso a la vivienda.</li>
            </ul>
            
            <h3 className={styles.subtitle}>No incluye:</h3>
            <ul>
                <li>Enchapes (cerámica y azulejos).</li>
                <li>Acometida eléctrica del límite de la propiedad a casa (poste con caja de medidor y accesorios).</li>
                <li>Repello y pintura internas.</li>
                <li>Puertas y marcos en dormitorios.</li>
            </ul>
            
            <p className={styles.warning}>
                <em>El art.59 responde a la directriz 27 del Banhvi, por lo tanto, no permite cambios en área, especificaciones y acabados. <span>El subsidio no incluye Gastos Administrativos y permisos de construcción.</span></em>
            </p>
          </article>


          <div className={styles.imagenes}>
            <Image src={informacion[1].croquis} width={300} height={300} alt='imagen' className={styles.imagen}></Image>
            <Image src={informacion[1].img1} width={300} height={300} alt='imagen' className={styles.imagen}></Image>
            <Image src={informacion[1].img2} width={300} height={300} alt='imagen' className={styles.imagen}></Image>
            <Image src={informacion[1].img3} width={300} height={300} alt='imagen' className={styles.imagen}></Image>
          </div>

          
        </div>
      </section>
      <br />
      <hr />
      <br />












      <section className={styles.seccion}>
        <h1 className={styles.nombre}>{informacion[2].nombre}</h1>

        <div className={styles.columnas}>
          <div className={styles.imagenes}>
            <Image src={informacion[2].croquis} width={300} height={300} alt='imagen' className={styles.imagen}></Image>
            <Image src={informacion[2].img1} width={300} height={300} alt='imagen' className={styles.imagen}></Image>
            <Image src={informacion[2].img2} width={300} height={300} alt='imagen' className={styles.imagen}></Image>
            <Image src={informacion[2].img3} width={300} height={300} alt='imagen' className={styles.imagen}></Image>
          </div>

          <article className={styles.descripcion}>
              <h2 className={styles.title}>Vivienda de 47m<sup>2</sup>. <br />Totalmente habitable con todos los sistemas básicos en funcionamiento y adecuaciones para personas con discapacidad</h2>

              <h3 className={styles.subtitle}>Acabados de Vivienda</h3>
              <ul>
                  <li>Construcción en bloques de concreto.</li>
                  <li>Repello y pintura exterior (pintura existente en muestrario).</li>
                  <li>Cielo raso tablilla plástica blanca económica en toda la casa.</li>
                  <li>Ventanas en marco de aluminio natural, vidrio fijo transparente y celosías.</li>
                  <li>Fregadero en acero inoxidable de un tanque y una batea con mueble chorreado en concreto.</li>
                  <li>Pila de lavar roja de un tanque y una batea.</li>
                  <li>Sanitario y lavamanos tipo económico.</li>
                  <li>Puertas principales en pino y liviana en baño.</li>
                  <li>Sistema eléctrico completo en el interior de la vivienda.</li>
                  <li>Canoas y bajantes en PVC.</li>
                  <li>Tanque séptico y drenaje.</li>
                  <li>Cerámica antideslizante en toda la casa (a escoger del muestrario).</li>
                  <li>Azulejo en el área de pilas (a escoger del muestrario).</li>
                  <li>Grifería y accesorios en general tipo económicos.</li>
                  <li>Agrarraderas en ducha y sanitario.</li>
                  <li>Rampa con baranda en la parte frontal y trasera de la casa.</li>
              </ul>

              <h3 className={styles.subtitle}>No incluye:</h3>
              <ul>
                  <li>Acometida eléctrica del límite de la propiedad a casa (poste con caja de medidor y accesorios).</li>
                  <li>Puertas de Dormitorios.</li>
              </ul>

              <p className={styles.warning}>
                  <em>El art.59 responde a la directriz 27 del Banhvi, por lo tanto, no permite cambios en área, especificaciones y acabados. <span>El subsidio no incluye Gastos Administrativos y permisos de construcción.</span></em>
              </p>
          </article>

        </div>
      </section>

      <br />
      <hr />
      <br />








      <section className={styles.seccion}>
        <h1 className={styles.nombre}>{informacion[3].nombre}</h1>

        <div className={styles.columnas}>

        <article className={styles.descripcion}>
            <h2 className={styles.title}>Vivienda de 50 m<sup>2</sup>. <br />Totalmente habitable con todos los sistemas básicos en funcionamiento y adecuaciones para adulto mayor.</h2>

            <h3 className={styles.subtitle}>Acabados de Vivienda</h3>
            <ul>
                <li>Construcción en bloques de concreto.</li>
                <li>Repello exterior e interior y pintura exterior (pintura existente en muestrario).</li>
                <li>Cielo raso tablilla plástica blanca económica en toda la casa.</li>
                <li>Ventanas en marco de aluminio natural, vidrio fijo transparente y celosías.</li>
                <li>Fregadero en acero inoxidable con mueble chorreado en concreto.</li>
                <li>Pila de lavar roja de un tanque y una batea.</li>
                <li>Sanitario y lavamanos tipo económico.</li>
                <li>Puertas principales en pino y liviana en baño y dormitorio principal.</li>
                <li>Sistema eléctrico completo en el interior de la vivienda.</li>
                <li>Canoas y bajantes en PVC.</li>
                <li>Tanque séptico y drenaje.</li>
                <li>Tuberías aguas negras y potable.</li>
                <li>Cerámica antiderrapante en toda la casa (a escoger del muestrario).</li>
                <li>Azulejo en el área de pilas (a escoger del muestrario).</li>
                <li>Grifería y accesorios en general tipo económicos.</li>
                <li>Agarraderas en ducha y sanitario.</li>
                <li>Rampa con baranda en la parte frontal y trasera de la casa.</li>
            </ul>

            <h3 className={styles.subtitle}>No incluye:</h3>
            <ul>
                <li>Acometida eléctrica del límite de la propiedad a casa (poste con caja de medidor y accesorios).</li>
                <li>Puertas y marcos en segundo cuarto.</li>
            </ul>

            <p className={styles.warning}>
                <em>El art.59 responde a la directriz 27 del Banhvi, por lo tanto, no permite cambios en área, especificaciones y acabados. <span>El subsidio no incluye Gastos Administrativos y permisos de construcción.</span></em>
            </p>
        </article>


          <div className={styles.imagenes}>
            <Image src={informacion[3].croquis} width={300} height={300} alt='imagen' className={styles.imagen} style={{objectFit: "fill"}}></Image>
            <Image src={informacion[3].img1} width={300} height={300} alt='imagen' className={styles.imagen}></Image>
            <Image src={informacion[3].img2} width={300} height={300} alt='imagen' className={styles.imagen}></Image>
            <Image src={informacion[3].img3} width={300} height={300} alt='imagen' className={styles.imagen}></Image>
          </div>

          

        </div>
      </section>


      <br />
      <hr />
      <br />
    </main>

    


    <Footer></Footer>
    </>
  )
  
}