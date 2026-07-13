"use client";

import { useState } from "react";
import Form from "next/form";
import { logOffAction } from "./logOffAction";

// Antes cerrar sesión era un botón siempre visible junto al usuario; ahora
// hay que darle clic al bloque de usuario, que abre un modal de
// confirmación primero (evita cierres de sesión accidentales).
export default function UserMenu({ userName, className, children }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => setConfirming(true)}
      >
        {children}
      </button>

      {confirming && (
        <div className="modal modal-open" role="dialog">
          <div className="modal-box">
            <h3 className="text-lg font-bold">¿Cerrar sesión?</h3>
            <p className="py-4">
              {userName}, vas a salir del sistema y tendrás que iniciar sesión
              de nuevo para continuar.
            </p>
            <div className="modal-action flex justify-between">
              <button
                type="button"
                className="btn"
                onClick={() => setConfirming(false)}
              >
                Cancelar
              </button>
              <Form action={logOffAction}>
                <button type="submit" className="btn btn-error">
                  Cerrar sesión
                </button>
              </Form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
