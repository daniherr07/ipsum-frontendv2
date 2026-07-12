"use server";

export async function deleteImage(id, img_route) {
  const endpoint = process.env.BACKEND_URL + "/deleteProjectPhoto";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, img_route }),
  }).catch(() => null);

  if (!res || !res.ok) {
    return { ok: false, message: "No se pudo borrar la imagen" };
  }

  return { ok: true, message: "Imagen borrada correctamente" };
}
