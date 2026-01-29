"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function updateAction(formData) {
  const endpoint = process.env.BACKEND_URL + "/updateUsers";

  const userUpdate = await fetch(endpoint, {
    method: "POST",
    body: formData,
  }).catch((err) => {
    throw new Error("no se pudo actualizar el usuario" + err);
  });
}
