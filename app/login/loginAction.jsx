"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData) {
  const cookieStore = await cookies();
  const email = formData.get("email");
  const password = formData.get("password");
  const remember = formData.get("remember") === "on";

  const endpoint = process.env.BACKEND_URL + "/login";

  // DEBUG temporal: confirma qué URL exacta se está llamando (¿BACKEND_URL
  // llegó bien al runtime de Vercel?) y si el fetch truena a nivel de red
  // (DNS/CORS/timeout) antes de siquiera llegar al backend.
  console.log("[loginAction] BACKEND_URL =", process.env.BACKEND_URL);
  console.log("[loginAction] endpoint =", endpoint);

  const userData = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).catch((error) => {
    console.error("[loginAction] fetch falló a nivel de red:", error);
    return null;
  });

  console.log(
    "[loginAction] respuesta recibida:",
    userData ? `status ${userData.status}` : "null (fetch nunca respondió)",
  );

  if (!userData || !userData.ok) {
    const errorBody = userData ? await userData.json().catch(() => null) : null;
    console.log("[loginAction] cuerpo del error:", errorBody);
    redirect(
      "/login?error=true&msg=" +
        encodeURIComponent(errorBody?.msg || "Usuario o contraseña incorrectos"),
    );
  }

  const data = await userData.json();
  console.log("[loginAction] login exitoso para id:", data.id);

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
      // "Recordar esta computadora": si se marca, la sesión dura 60 días;
      // si no, es una cookie de sesión (sin maxAge) que se borra al cerrar
      // el navegador — pensado para computadoras compartidas.
      ...(remember ? { maxAge: 60 * 60 * 24 * 60 } : {}),
    },
  );
  return redirect("/protected/search");
}
