"use server";

import { getSessionUser } from "../getSessionUser";
import isAdmin from "../isAdmin";

export async function updateAction(formData) {
  const user = await getSessionUser();
  if (!user || !isAdmin(user.rol_id)) {
    console.warn(`[updateAction/users] usuario ${user?.id ?? "anónimo"} sin permisos intentó actualizar un usuario`);
    return { ok: false, message: "No tiene permisos para esta acción" };
  }

  const endpoint = process.env.BACKEND_URL + "/updateUsers";

  const data = Object.fromEntries(formData.entries());
  // Este formulario no incluye contraseña, así que loguear el id es seguro.
  console.log(`[updateAction/users] admin ${user.id} actualizando usuario id ${data.id}`);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).catch((error) => {
    console.error(`[updateAction/users] fetch falló a nivel de red (usuario ${data.id})`, error);
    return null;
  });

  if (!res || !res.ok) {
    console.warn(`[updateAction/users] no se pudo actualizar el usuario ${data.id}`);
    return { ok: false, message: "No se pudo actualizar el usuario" };
  }

  console.log(`[updateAction/users] usuario ${data.id} actualizado correctamente`);

  return { ok: true, message: "Usuario actualizado correctamente" };
}
