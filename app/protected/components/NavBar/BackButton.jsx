"use client";

import { useRouter } from "next/navigation";

// Antes este mismo botón cerraba sesión; ahora solo regresa a la página
// anterior. Cerrar sesión pasó al menú de usuario (ver UserMenu.jsx), con
// un modal de confirmación de por medio.
export default function BackButton({ className, children }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={className}
      aria-label="Regresar"
      title="Regresar"
    >
      {children}
    </button>
  );
}
