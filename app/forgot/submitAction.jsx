"use server";

import { redirect } from "next/navigation";

export async function submitAction(formData) {
  const email = formData.get("email");
  console.log(`[submitAction/forgot] solicitud de "olvidé mi contraseña" para: ${email}`);

  const endpoint = process.env.BACKEND_URL + "/forgotPassword";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  }).catch((error) => {
    console.error(`[submitAction/forgot] fetch falló a nivel de red para "${email}"`, error);
    return null;
  });

  if (!res || !res.ok) {
    console.warn(`[submitAction/forgot] el backend respondió con error para "${email}"`);
    redirect(
      "/forgot?error=true&msg=" +
        encodeURIComponent("No se pudo enviar el correo. Intente de nuevo."),
    );
  }

  const data = await res.json();

  if (data.noUser) {
    console.warn(`[submitAction/forgot] no existe usuario para "${email}"`);
    redirect(
      "/forgot?error=true&msg=" +
        encodeURIComponent("No existe un usuario con ese correo o nombre de usuario."),
    );
  }

  console.log(`[submitAction/forgot] correo de recuperación enviado a "${email}"`);
  redirect("/forgot?success=true");
}
