"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logOffAction() {
  const cookieStore = await cookies();

  cookieStore.delete("userData");

  return redirect("/login");
}
