"use server";

import { getSessionUser } from "../getSessionUser";
import isAdmin from "../isAdmin";

export async function deleteAction(id) {
  const user = await getSessionUser();
  if (!user || !isAdmin(user.rol_id)) {
    console.warn(`[deleteAction/users] usuario ${user?.id ?? "anónimo"} sin permisos intentó eliminar el usuario ${id}`);
    return { ok: false, message: "No tiene permisos para esta acción" };
  }

  console.log(`[deleteAction/users] admin ${user.id} desactivando usuario id ${id}`);

  const endpoint = process.env.BACKEND_URL + "/deleteUser";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  }).catch((error) => {
    console.error(`[deleteAction/users] fetch falló a nivel de red (usuario ${id})`, error);
    return null;
  });

  if (!res || !res.ok) {
    console.warn(`[deleteAction/users] no se pudo eliminar el usuario ${id}`);
    return { ok: false, message: "No se pudo eliminar el usuario" };
  }

  console.log(`[deleteAction/users] usuario ${id} desactivado correctamente`);

  return { ok: true, message: "Usuario eliminado correctamente" };
}
