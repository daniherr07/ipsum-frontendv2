"use client";

import { useEffect } from "react";
import { CircleAlert, X } from "lucide-react";
import { playErrorSound } from "../lib/playSound";

// Aviso de error para el autoguardado: a diferencia de StatusModal (un modal
// centrado que tapa la pantalla y exige "Cerrar" para seguir), este vive en
// una esquina y no bloquea nada — el autoguardado es silencioso de fondo, así
// que su error tampoco debería interrumpir al usuario a media edición.
export default function ErrorToast({ status, onClose }) {
  useEffect(() => {
    if (!status) return;
    playErrorSound();
  }, [status]);

  if (!status) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 max-w-sm" role="alert">
      <div className="alert alert-error shadow-lg items-start">
        <CircleAlert size={20} className="shrink-0 mt-0.5" />
        <div className="flex-1 text-sm">
          <p className="font-semibold">No se pudo autoguardar</p>
          <p>{status.message}</p>
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-xs btn-circle shrink-0"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
