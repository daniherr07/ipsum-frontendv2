"use server";

import { getSessionUser } from "../getSessionUser";
import isAdmin from "../isAdmin";

// Server action para el formulario "Añadir Usuario": envía los datos tal cual
// al backend, que se encarga de asignarle la contraseña por defecto.
export async function insertAction(formData) {
  const user = await getSessionUser();
  if (!user || !isAdmin(user.rol_id)) {
    console.warn(`[insertAction/users] usuario ${user?.id ?? "anónimo"} sin permisos intentó crear un usuario`);
    return { ok: false, message: "No tiene permisos para esta acción" };
  }

  const endpoint = process.env.BACKEND_URL + "/insertUser";

  const data = Object.fromEntries(formData.entries());
  // Este formulario no incluye contraseña (el backend asigna la genérica),
  // así que loguear el correo acá es seguro.
  console.log(`[insertAction/users] admin ${user.id} creando usuario: ${data.correo_electronico}`);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).catch((error) => {
    console.error(`[insertAction/users] fetch falló a nivel de red`, error);
    return null;
  });

  if (!res || !res.ok) {
    // Refleja el mensaje real del backend (ej. correo ya registrado) en vez
    // de uno genérico, para que el usuario sepa exactamente qué corregir.
    const errorBody = res ? await res.json().catch(() => null) : null;
    console.warn(`[insertAction/users] no se pudo crear el usuario: ${errorBody?.msg}`);
    return {
      ok: false,
      message: errorBody?.msg || "No se pudo crear el usuario",
    };
  }

  console.log(`[insertAction/users] usuario creado correctamente: ${data.correo_electronico}`);

  return { ok: true, message: "Usuario creado correctamente" };
}
