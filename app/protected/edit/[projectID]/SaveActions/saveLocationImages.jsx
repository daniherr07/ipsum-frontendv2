"use server";

export async function saveLocationImages(files, projectId, projectSlug) {
  // Solo se loguea la cantidad de archivos, nunca su contenido.
  console.log(`[saveLocationImages] subiendo ${files.length} imagen(es) de ubicación para el proyecto ${projectId}`);
  try {
    const data = new FormData();
    const endpoint = process.env.BACKEND_URL + "/addLocationImage";

    files.forEach((file) => {
      data.append("files", file);
    });

    data.append("path", projectSlug);
    data.append("proyecto_id", projectId);

    const res = await fetch(endpoint, {
      method: "POST",
      body: data,
    });

    if (!res.ok) {
      console.warn(`[saveLocationImages] el backend no pudo subir las imágenes del proyecto ${projectId} (status ${res.status})`);
      return { ok: false, message: "No se pudieron subir las imágenes" };
    }

    console.log(`[saveLocationImages] imágenes del proyecto ${projectId} subidas correctamente`);
    return { ok: true, message: "Imágenes subidas correctamente" };
  } catch (error) {
    console.error(`[saveLocationImages] excepción subiendo imágenes del proyecto ${projectId}`, error);
    return { ok: false, message: "No se pudieron subir las imágenes" };
  }
}
