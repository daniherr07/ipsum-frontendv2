"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Se llama directo (no como action de un <form>) desde ChangePasswordForm,
// que ya validó del lado del cliente que newPassword === confirmPassword.
// El backend vuelve a pedir currentPassword: sin eso, cualquiera que supiera
// un id de usuario podría tomar la cuenta con solo visitar esta pantalla.
export async function changePasswordAction(id, currentPassword, newPassword) {
  const cookieStore = await cookies();
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

  const data = await res.json();
  cookieStore.set(
    "userData",
    JSON.stringify({
      id: data.id,
      nombre: data.nombre,
      rol_id: data.rol_id,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    },
  );
  redirect("/protected/search");
}
