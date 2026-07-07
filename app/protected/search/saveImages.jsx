"use server";

export async function saveImages(files, projectId, projectSlug) {
  try {
    const data = new FormData();
    const endpointFile = process.env.BACKEND_URL + "/addProjectPhoto";

    // 🔥 append uno por uno
    files.forEach((file) => {
      data.append("files", file);
    });

    data.append("path", projectSlug);
    data.append("proyecto_id", projectId);

    const res = await fetch(endpointFile, {
      method: "POST",
      body: data,
    });

    if (!res.ok) {
      throw new Error("Error al guardar las fotos");
    }
  } catch (error) {
    console.error(error);
  }
}
