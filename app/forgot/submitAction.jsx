"use server";

import { redirect } from "next/navigation";

export async function submitAction(formData) {
  const email = formData.get("email");

  const endpoint = process.env.BACKEND_URL + "/forgotPassword";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  }).catch(() => null);

  if (!res || !res.ok) {
    redirect(
      "/forgot?error=true&msg=" +
        encodeURIComponent("No se pudo enviar el correo. Intente de nuevo."),
    );
  }

  const data = await res.json();

  if (data.noUser) {
    redirect(
      "/forgot?error=true&msg=" +
        encodeURIComponent("No existe un usuario con ese correo o nombre de usuario."),
    );
  }

  redirect("/forgot?success=true");
}
