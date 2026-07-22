"use server";

export async function saveImages(files, projectId, projectSlug) {
  const data = new FormData();
  const endpointFile = process.env.BACKEND_URL + "/addProjectPhoto";

  // Solo se loguea la cantidad de archivos, nunca su contenido.
  console.log(`[saveImages] subiendo ${files.length} foto(s) del proyecto ${projectId}`);

  files.forEach((file) => {
    data.append("files", file);
  });

  data.append("path", projectSlug);
  data.append("proyecto_id", projectId);

  const res = await fetch(endpointFile, {
    method: "POST",
    body: data,
  }).catch((error) => {
    console.error(`[saveImages] fetch falló a nivel de red (proyecto ${projectId})`, error);
    return null;
  });

  if (!res || !res.ok) {
    console.warn(`[saveImages] el backend no pudo subir las fotos del proyecto ${projectId} (status ${res?.status})`);
    return { ok: false, message: "No se pudieron subir las fotos" };
  }

  const result = await res.json();
  console.log(`[saveImages] fotos del proyecto ${projectId} subidas correctamente`);
  return { ok: true, message: result.message || "Fotos subidas correctamente" };
}
