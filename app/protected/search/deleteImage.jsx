"use server";

export async function deleteImage(id, img_route) {
  const endpoint = process.env.BACKEND_URL + "/deleteProjectPhoto";

  console.log(`[deleteImage] borrando foto de proyecto ${id}: ${img_route}`);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, img_route }),
  }).catch((error) => {
    console.error(`[deleteImage] fetch falló a nivel de red (proyecto ${id}, ${img_route})`, error);
    return null;
  });

  if (!res || !res.ok) {
    console.warn(`[deleteImage] el backend no pudo borrar la imagen (proyecto ${id}, ${img_route}, status ${res?.status})`);
    return { ok: false, message: "No se pudo borrar la imagen" };
  }

  console.log(`[deleteImage] imagen borrada correctamente (proyecto ${id}, ${img_route})`);
  return { ok: true, message: "Imagen borrada correctamente" };
}
