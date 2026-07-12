"use server";

export async function deleteLocationImage(proyecto_id, img_route) {
  const endpoint = process.env.BACKEND_URL + "/deleteLocationImage";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ proyecto_id, img_route }),
  }).catch(() => null);

  if (!res || !res.ok) {
    return { ok: false, message: "No se pudo borrar la imagen" };
  }

  return { ok: true, message: "Imagen borrada correctamente" };
}
