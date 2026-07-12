"use server";

export async function saveLocationImages(files, projectId, projectSlug) {
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
      return { ok: false, message: "No se pudieron subir las imágenes" };
    }

    return { ok: true, message: "Imágenes subidas correctamente" };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "No se pudieron subir las imágenes" };
  }
}
