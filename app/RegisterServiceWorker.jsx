"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

// Componente sin UI: solo registra el service worker (public/sw.js) para
// que el navegador ofrezca "instalar" la app (PWA) en el teléfono/escritorio.
export default function RegisterServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("No se pudo registrar el service worker", error);
        Sentry.captureException(error);
      });
    }
  }, []);

  return null;
}
