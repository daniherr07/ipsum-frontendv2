"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { CircleX, RotateCw, House } from "lucide-react";

// Boundary de errores para todo lo que cuelga de este segmento (todo /app
// excepto el layout raíz, que ya cae bajo global-error.tsx). Sin este
// archivo, un error de render en cualquier página (ej. /protected/*)
// mostraba el overlay genérico de Next.js sin avisar a Sentry — la única
// captura automática era la de instrumentation-client.ts, que solo agarra
// errores no atrapados a nivel de window, no los que React ya interceptó
// como error de render de un Server/Client Component.
export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-100">
      <div className="card bg-base-200 shadow-lg max-w-md w-full">
        <div className="card-body items-center text-center gap-2">
          <CircleX size={60} className="text-error" />
          <h1 className="text-lg font-bold">Algo salió mal</h1>
          <p className="text-sm opacity-70">
            Ocurrió un error inesperado. Ya quedó registrado; puedes intentar
            de nuevo o volver al inicio.
          </p>
          <div className="card-actions mt-2">
            <button type="button" className="btn btn-primary" onClick={() => reset()}>
              <RotateCw size={16} />
              Reintentar
            </button>
            <a href="/protected/search" className="btn btn-ghost">
              <House size={16} />
              Ir al inicio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
