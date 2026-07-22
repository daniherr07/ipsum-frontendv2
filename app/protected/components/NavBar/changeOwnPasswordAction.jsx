"use server";

// Misma ruta backend que usa el cambio de contraseña forzado del primer
// login (app/login/changePassword), pero para un usuario que ya tiene sesión
// iniciada: no hay redirect ni se toca la cookie, solo se devuelve el
// resultado para mostrarlo dentro del mismo modal del menú de usuario.
export async function changeOwnPasswordAction(id, currentPassword, newPassword) {
  const endpoint = process.env.BACKEND_URL + "/changePassword";
  // Nunca loguear currentPassword/newPassword, solo el id del usuario.
  console.log(`[changeOwnPasswordAction] cambiando contraseña (usuario ${id})`);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, currentPassword, newPassword }),
  }).catch((error) => {
    console.error(`[changeOwnPasswordAction] fetch falló a nivel de red (usuario ${id})`, error);
    return null;
  });

  if (!res || !res.ok) {
    const errorBody = res ? await res.json().catch(() => null) : null;
    console.warn(`[changeOwnPasswordAction] no se pudo cambiar la contraseña (usuario ${id}):`, errorBody?.msg);
    return {
      ok: false,
      message: errorBody?.msg || "No se pudo cambiar la contraseña",
    };
  }

  console.log(`[changeOwnPasswordAction] contraseña cambiada con éxito (usuario ${id})`);

  return { ok: true, message: "Contraseña actualizada correctamente" };
}
