"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData) {
  const cookieStore = await cookies();
  const username = formData.get("username");
  const password = formData.get("password");

  const endpoint = process.env.BACKEND_URL + "/login";

  const userData = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username, password: password }),
  });

  if (userData.ok) {
    const data = await userData.json();
    cookieStore.set(
      "userData",
      JSON.stringify({
        nombre: data.nombre,
        rol_id: data.rol_id,
      }),
      {
        httpOnly: false, // Recommended for security
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      },
    );
    return redirect("/protected/search");
  }
}
