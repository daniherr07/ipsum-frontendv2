"use server";

import { getSessionUser } from "../getSessionUser";
import isAdmin from "../isAdmin";

// Server action para el formulario "Añadir Usuario": envía los datos tal cual
// al backend, que se encarga de asignarle la contraseña por defecto.
export async function insertAction(formData) {
  const user = await getSessionUser();
  if (!user || !isAdmin(user.rol_id)) {
    return { ok: false, message: "No tiene permisos para esta acción" };
  }

  const endpoint = process.env.BACKEND_URL + "/insertUser";

  const data = Object.fromEntries(formData.entries());

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).catch(() => null);

  if (!res || !res.ok) {
    // Refleja el mensaje real del backend (ej. correo ya registrado) en vez
    // de uno genérico, para que el usuario sepa exactamente qué corregir.
    const errorBody = res ? await res.json().catch(() => null) : null;
    return {
      ok: false,
      message: errorBody?.msg || "No se pudo crear el usuario",
    };
  }

  return { ok: true, message: "Usuario creado correctamente" };
}
