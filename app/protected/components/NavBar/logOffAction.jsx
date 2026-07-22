"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logOffAction() {
  const cookieStore = await cookies();

  // Log de ciclo de vida: útil para confirmar en los logs de Vercel que un
  // logout efectivamente ocurrió (ej. al investigar sesiones que "se caen"
  // solas vs. logout manual del usuario).
  console.log("[logOffAction] cerrando sesión (borrando cookie userData)");

  cookieStore.delete("userData");

  return redirect("/login");
}
