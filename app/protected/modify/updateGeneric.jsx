"use server";

import { getSessionUser } from "../getSessionUser";
import isAdmin from "../isAdmin";

// A diferencia de insertGenerics (usado también por QuickAddModal en el
// editor de proyecto, disponible para cualquier usuario autenticado), esta
// acción edita filas existentes y solo la usa la pantalla admin "Modificar".
export async function updateGenerics(formData) {
  const user = await getSessionUser();
  if (!user || !isAdmin(user.rol_id)) {
    return { ok: false, message: "No tiene permisos para esta acción" };
  }

  const endpoint = process.env.BACKEND_URL + "/updateGenerics";

  const data = Object.fromEntries(formData.entries());

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).catch(() => null);

  if (!res || !res.ok) {
    return { ok: false, message: "No se pudo actualizar el registro" };
  }

  return { ok: true, message: "Registro actualizado correctamente" };
}
