"use client";

import { useEffect } from "react";
import { CircleCheck, CircleX } from "lucide-react";
import { playSuccessSound, playErrorSound } from "../lib/playSound";

// Modal genérico para confirmar el resultado de una acción del sistema
// (guardar, crear, editar, etc.). `status` es null cuando no hay nada que
// mostrar, o { ok: boolean, message: string } una vez que la acción terminó.
// Se usa en varias partes de /protected en vez de repetir el mismo marcado.
export default function StatusModal({ status, onClose }) {
  // Suena una sola vez por cada resultado nuevo (no en el cierre, que deja
  // status en null y no vuelve a entrar al if).
  useEffect(() => {
    if (!status) return;
    if (status.ok) {
      playSuccessSound();
    } else {
      playErrorSound();
    }
  }, [status]);

  if (!status) return null;

  const isError = !status.ok;

  return (
    <div className="modal modal-open" role="dialog">
      <div
        className={`modal-box border flex flex-col items-center justify-center gap-2 text-center shadow-md ${
          isError
            ? "border-error shadow-error/30"
            : "border-success shadow-success/30"
        }`}
      >
        {isError ? (
          <CircleX size={60} className="text-error" />
        ) : (
          <CircleCheck size={60} className="text-success" />
        )}
        <p className="text-lg font-bold">{status.message}</p>
        <div className="modal-action m-0">
          <button
            type="button"
            className={`btn ${isError ? "btn-error" : "btn-success"}`}
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
