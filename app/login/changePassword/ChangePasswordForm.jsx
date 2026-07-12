"use client";

import { useState } from "react";
import { changePasswordAction } from "./changePasswordAction";

export default function ChangePasswordForm({ userId }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas nuevas no coinciden");
      return;
    }

    setSubmitting(true);
    // Si tiene éxito, changePasswordAction hace redirect() y esta línea
    // nunca se alcanza (redirect corta la ejecución). Solo se llega acá
    // cuando devuelve {ok:false, message}.
    const result = await changePasswordAction(
      userId,
      currentPassword,
      newPassword,
    );
    setSubmitting(false);
    setError(result.message);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4 text-start">
        <legend className="fieldset-legend">Cambiar contraseña</legend>

        <label className="label">Contraseña actual</label>
        <input
          type="password"
          className="input w-full"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />

        <label className="label mt-2">Contraseña nueva</label>
        <input
          type="password"
          className="input w-full"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={8}
          required
        />

        <label className="label mt-2">Confirmar contraseña nueva</label>
        <input
          type="password"
          className="input w-full"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          minLength={8}
          required
        />
      </fieldset>

      {error && <p className="text-error text-sm">{error}</p>}

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? "Guardando..." : "Cambiar contraseña y entrar"}
      </button>
    </form>
  );
}
