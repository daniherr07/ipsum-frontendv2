"use server";

import { redirect } from "next/navigation";

export async function loginAction() {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  redirect("/login?error=true&msg=Credenciales%20incorrectas");
}
