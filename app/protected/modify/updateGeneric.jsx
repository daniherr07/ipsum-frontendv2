"use server";

import { getSessionUser } from "../getSessionUser";
import isAdmin from "../isAdmin";

// A diferencia de insertGenerics (usado también por QuickAddModal en el
// editor de proyecto, disponible para cualquier usuario autenticado), esta
// acción edita filas existentes y solo la usa la pantalla admin "Modificar".
export async function updateGenerics(formData) {
  const user = await getSessionUser();
  if (!user || !isAdmin(user.rol_id)) {
    console.warn(`[updateGenerics] usuario ${user?.id ?? "anónimo"} sin permisos intentó actualizar un registro genérico`);
    return { ok: false, message: "No tiene permisos para esta acción" };
  }

  const endpoint = process.env.BACKEND_URL + "/updateGenerics";

  const data = Object.fromEntries(formData.entries());

  console.log(`[updateGenerics] admin ${user.id} actualizando registro en tabla "${data.table}"`);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).catch((error) => {
    console.error(`[updateGenerics] fetch falló a nivel de red (tabla "${data.table}")`, error);
    return null;
  });

  if (!res || !res.ok) {
    console.warn(`[updateGenerics] el backend no pudo actualizar el registro en tabla "${data.table}" (status ${res?.status})`);
    return { ok: false, message: "No se pudo actualizar el registro" };
  }

  console.log(`[updateGenerics] registro en tabla "${data.table}" actualizado correctamente`);
  return { ok: true, message: "Registro actualizado correctamente" };
}
