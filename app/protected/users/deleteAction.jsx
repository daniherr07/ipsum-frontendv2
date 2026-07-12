"use server";

import { getSessionUser } from "../getSessionUser";
import isAdmin from "../isAdmin";

export async function deleteAction(id) {
  const user = await getSessionUser();
  if (!user || !isAdmin(user.rol_id)) {
    return { ok: false, message: "No tiene permisos para esta acción" };
  }

  const endpoint = process.env.BACKEND_URL + "/deleteUser";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  }).catch(() => null);

  if (!res || !res.ok) {
    return { ok: false, message: "No se pudo eliminar el usuario" };
  }

  return { ok: true, message: "Usuario eliminado correctamente" };
}
