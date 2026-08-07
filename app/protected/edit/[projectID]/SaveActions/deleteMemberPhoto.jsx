"use server";

import * as Sentry from "@sentry/nextjs";

export async function deleteMemberPhoto(db_id, img_route) {
  const endpoint = process.env.BACKEND_URL + "/deleteMemberPhoto";

  console.log(`[deleteMemberPhoto] borrando foto de cédula (miembro db_id ${db_id})`);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ db_id, img_route }),
  }).catch((error) => {
    console.error(`[deleteMemberPhoto] fetch falló a nivel de red (miembro db_id ${db_id})`, error);
    Sentry.captureException(error);
    return null;
  });

  if (!res || !res.ok) {
    console.warn(`[deleteMemberPhoto] el backend no pudo borrar la foto (miembro db_id ${db_id}, status ${res?.status})`);
    return { ok: false, message: "No se pudo borrar la imagen" };
  }

  console.log(`[deleteMemberPhoto] foto borrada correctamente (miembro db_id ${db_id})`);
  return { ok: true, message: "Imagen borrada correctamente" };
}
