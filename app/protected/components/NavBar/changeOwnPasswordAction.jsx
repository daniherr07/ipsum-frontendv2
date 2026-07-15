"use server";

// Misma ruta backend que usa el cambio de contraseña forzado del primer
// login (app/login/changePassword), pero para un usuario que ya tiene sesión
// iniciada: no hay redirect ni se toca la cookie, solo se devuelve el
// resultado para mostrarlo dentro del mismo modal del menú de usuario.
export async function changeOwnPasswordAction(id, currentPassword, newPassword) {
  const endpoint = process.env.BACKEND_URL + "/changePassword";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, currentPassword, newPassword }),
  }).catch(() => null);

  if (!res || !res.ok) {
    const errorBody = res ? await res.json().catch(() => null) : null;
    return {
      ok: false,
      message: errorBody?.msg || "No se pudo cambiar la contraseña",
    };
  }

  return { ok: true, message: "Contraseña actualizada correctamente" };
}
