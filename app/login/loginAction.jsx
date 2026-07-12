"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData) {
  const cookieStore = await cookies();
  const email = formData.get("email");
  const password = formData.get("password");

  const endpoint = process.env.BACKEND_URL + "/login";

  const userData = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).catch(() => null);

  if (!userData || !userData.ok) {
    const errorBody = userData ? await userData.json().catch(() => null) : null;
    redirect(
      "/login?error=true&msg=" +
        encodeURIComponent(errorBody?.msg || "Usuario o contraseña incorrectos"),
    );
  }

  const data = await userData.json();

  // estado = 0 (usuario nuevo o que acaba de resetear su contraseña): no se
  // le deja entrar todavía, primero tiene que ponerse una contraseña propia.
  if (data.requiresPasswordChange) {
    redirect(`/login/changePassword?id=${data.id}`);
  }

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
  return redirect("/protected/search");
}
