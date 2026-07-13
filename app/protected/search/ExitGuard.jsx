"use client";

import { useCallback, useEffect, useState } from "react";
import Form from "next/form";
import { logOffAction } from "../components/NavBar/logOffAction";

// El buscador es la primera pantalla protegida tras el login. Si el usuario
// le da "atrás" aquí, el historial apunta al login: como esa página ahora
// redirige de vuelta al buscador cuando la sesión sigue activa (ver
// app/login/page.jsx), un "atrás" normal no lo sacaría del sistema, solo lo
// rebotaría de forma confusa. Por eso se intercepta ese "atrás" con una
// confirmación explícita; si el usuario de verdad quiere salir, se cierra la
// sesión de una vez (mismo logOffAction que usa el menú de usuario).
export default function ExitGuard() {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    // Entrada "colchón": el primer "atrás" del usuario cae aquí (dispara
    // popstate) en vez de salir directo hacia el login.
    window.history.pushState({ exitGuard: true }, "", window.location.href);

    const handlePopState = () => {
      setConfirming(true);
      // Repone el colchón: mientras se decide, un "atrás" repetido (usuarios
      // que "spamean" el botón) no debe lograr colarse.
      window.history.pushState({ exitGuard: true }, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleCancel = useCallback(() => setConfirming(false), []);

  if (!confirming) return null;

  return (
    <div className="modal modal-open" role="dialog">
      <div className="modal-box">
        <h3 className="text-lg font-bold">¿Salir del sistema?</h3>
        <p className="py-4">
          Vas a salir del sistema y tendrás que iniciar sesión de nuevo para
          continuar.
        </p>
        <div className="modal-action flex justify-between">
          <button type="button" className="btn" onClick={handleCancel}>
            Cancelar
          </button>
          <Form action={logOffAction}>
            <button type="submit" className="btn btn-error">
              Salir del sistema
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
