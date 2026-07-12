"use server";

import { revalidatePath } from "next/cache";

// Actualiza un miembro de familia existente (identificado por member.db_id)
// y, si se subió una nueva foto de cédula, la reemplaza en Dropbox.
export async function updateFamily(member, projectSlug) {
  member.adulto = member.adulto ? 1 : 0;
  member.discapacidad = member.discapacidad ? 1 : 0;

  const endpoint = process.env.BACKEND_URL + "/updateMember";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(member),
  }).catch(() => null);

  if (!res || !res.ok) {
    return { ok: false, message: "No se pudo actualizar el familiar" };
  }

  if (member.img_file) {
    try {
      const data = new FormData();
      const endpointFile = process.env.BACKEND_URL + "/insertMemberFile";
      data.append("file", member.img_file);
      data.append("id", member.id);
      data.append("path", projectSlug);
      data.append("proyecto_id", member.proyecto_id);

      const fileRes = await fetch(endpointFile, {
        method: "POST",
        body: data,
      });

      if (!fileRes.ok) {
        return {
          ok: false,
          message: "El familiar se actualizó, pero no se pudo subir la imagen de cédula",
        };
      }
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        message: "El familiar se actualizó, pero no se pudo subir la imagen de cédula",
      };
    }
  }

  revalidatePath(`/protected/edit/${member.proyecto_id}`);

  return { ok: true, message: "Familiar actualizado correctamente" };
}
