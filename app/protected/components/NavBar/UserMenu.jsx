"use client";

import { useState } from "react";
import Form from "next/form";
import { KeyRound, LogOut } from "lucide-react";
import { logOffAction } from "./logOffAction";
import { changeOwnPasswordAction } from "./changeOwnPasswordAction";

// Antes cerrar sesión era un botón siempre visible junto al usuario; ahora
// hay que darle clic al bloque de usuario, que abre un menú con las
// acciones disponibles (cambiar contraseña, cerrar sesión) en vez de ir
// directo a la confirmación de logout.
export default function UserMenu({ userId, userName, className, children }) {
  // null | "menu" | "logout" | "password"
  const [mode, setMode] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const closeAll = () => {
    setMode(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError(null);
    setPasswordSuccess(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas nuevas no coinciden");
      return;
    }

    setSubmitting(true);
    const result = await changeOwnPasswordAction(
      userId,
      currentPassword,
      newPassword,
    );
    setSubmitting(false);

    if (result.ok) {
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPasswordError(result.message);
    }
  };

  return (
    <>
      {/* hover:bg-base-300 + transition-colors: antes no había ninguna señal
          visual de que este bloque fuera clickeable (mismo fondo siempre). */}
      <button
        type="button"
        className={`${className} cursor-pointer rounded-lg transition-colors hover:bg-base-300`}
        onClick={() => setMode("menu")}
      >
        {children}
      </button>

      {mode === "menu" && (
        <div className="modal modal-open" role="dialog">
          <div className="modal-box">
            <h3 className="text-lg font-bold mb-3">{userName}</h3>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="btn btn-outline justify-start"
                onClick={() => setMode("password")}
              >
                <KeyRound size={18} />
                Cambiar contraseña
              </button>
              <button
                type="button"
                className="btn btn-outline btn-error justify-start"
                onClick={() => setMode("logout")}
              >
                <LogOut size={18} />
                Cerrar sesión
              </button>
            </div>
            <div className="modal-action">
              <button type="button" className="btn w-full" onClick={closeAll}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === "logout" && (
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
                onClick={() => setMode("menu")}
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

      {mode === "password" && (
        <div className="modal modal-open" role="dialog">
          <div className="modal-box">
            <h3 className="text-lg font-bold mb-3">Cambiar contraseña</h3>

            {passwordSuccess ? (
              <>
                <p className="py-4 text-success">
                  Contraseña actualizada correctamente.
                </p>
                <div className="modal-action">
                  <button
                    type="button"
                    className="btn btn-primary w-full"
                    onClick={closeAll}
                  >
                    Cerrar
                  </button>
                </div>
              </>
            ) : (
              <form
                onSubmit={handleChangePassword}
                className="flex flex-col gap-3"
              >
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Contraseña actual
                  </legend>
                  <input
                    type="password"
                    className="input w-full"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Contraseña nueva
                  </legend>
                  <input
                    type="password"
                    className="input w-full"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={8}
                    required
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Confirmar contraseña nueva
                  </legend>
                  <input
                    type="password"
                    className="input w-full"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={8}
                    required
                  />
                </fieldset>

                {passwordError && (
                  <p className="text-error text-sm">{passwordError}</p>
                )}

                <div className="modal-action flex justify-between">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setMode("menu")}
                    disabled={submitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? "Guardando..." : "Cambiar contraseña"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
