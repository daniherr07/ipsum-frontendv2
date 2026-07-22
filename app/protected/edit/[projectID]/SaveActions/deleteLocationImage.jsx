"use server";

export async function deleteLocationImage(proyecto_id, img_route) {
  const endpoint = process.env.BACKEND_URL + "/deleteLocationImage";

  console.log(`[deleteLocationImage] borrando imagen de ubicación del proyecto ${proyecto_id}: ${img_route}`);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ proyecto_id, img_route }),
  }).catch((error) => {
    console.error(`[deleteLocationImage] fetch falló a nivel de red (proyecto ${proyecto_id}, ${img_route})`, error);
    return null;
  });

  if (!res || !res.ok) {
    console.warn(`[deleteLocationImage] el backend no pudo borrar la imagen (proyecto ${proyecto_id}, ${img_route}, status ${res?.status})`);
    return { ok: false, message: "No se pudo borrar la imagen" };
  }

  console.log(`[deleteLocationImage] imagen borrada correctamente (proyecto ${proyecto_id}, ${img_route})`);
  return { ok: true, message: "Imagen borrada correctamente" };
}
