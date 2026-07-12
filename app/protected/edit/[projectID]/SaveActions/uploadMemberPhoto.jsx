"use server";

// A diferencia de saveFamily/editFamily (que guardan TODOS los datos del
// familiar), esta acción solo sube/reemplaza la foto de cédula, para poder
// hacerlo directo desde la tarjeta sin abrir el formulario completo.
export async function uploadMemberPhoto(file, cedula, projectId, projectSlug) {
  try {
    const data = new FormData();
    data.append("file", file);
    data.append("id", cedula);
    data.append("path", projectSlug);
    data.append("proyecto_id", projectId);

    const res = await fetch(process.env.BACKEND_URL + "/insertMemberFile", {
      method: "POST",
      body: data,
    });

    if (!res.ok) {
      return { ok: false, message: "No se pudo subir la foto de la cédula" };
    }

    return { ok: true, message: "Foto de cédula actualizada correctamente" };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "No se pudo subir la foto de la cédula" };
  }
}
