"use server";

export async function saveImages(files, projectId, projectSlug) {
  const data = new FormData();
  const endpointFile = process.env.BACKEND_URL + "/addProjectPhoto";

  files.forEach((file) => {
    data.append("files", file);
  });

  data.append("path", projectSlug);
  data.append("proyecto_id", projectId);

  const res = await fetch(endpointFile, {
    method: "POST",
    body: data,
  }).catch(() => null);

  if (!res || !res.ok) {
    return { ok: false, message: "No se pudieron subir las fotos" };
  }

  const result = await res.json();
  return { ok: true, message: result.message || "Fotos subidas correctamente" };
}
