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

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased bg-base-100`}>
        {children}
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
