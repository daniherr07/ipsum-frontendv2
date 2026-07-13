import "./globals.css";
import { Inter } from "next/font/google";
import RegisterServiceWorker from "./RegisterServiceWorker";

const inter = Inter({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Ipsum - Sistema",
  description: "Sistema de gestión de proyectos de bono de vivienda",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ipsum",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport = {
  themeColor: "#035496",
};

// Aplica el tema guardado ANTES de que se pinte la página: si esto se
// hiciera en un useEffect de React (después del primer render), se vería un
// parpadeo del tema por defecto antes de cambiar al guardado. Va como
// primer hijo de <body> (no en <head>, que Next.js arma solo a partir de
// "metadata") y usa try/catch porque localStorage puede estar bloqueado.
const themeInitScript = `
  try {
    var theme = localStorage.getItem("theme");
    if (theme) document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
`;

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased bg-base-100`}>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
