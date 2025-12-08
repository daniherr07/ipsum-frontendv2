"use server";

import { redirect } from "next/navigation";

export async function submitAction() {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  redirect("/forgot?success=true");
}
