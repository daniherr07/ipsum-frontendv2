"use server";

import { revalidatePath } from "next/cache";

// Crea un nuevo miembro de familia y, si viene con foto de cédula, la sube
// después (el archivo necesita que la fila ya exista en la BD para poder
// ligarla mediante id + proyecto_id).
export async function saveFamily(member, projectSlug) {
  member.adulto = member.adulto ? 1 : 0;
  member.discapacidad = member.discapacidad ? 1 : 0;

  const endpoint = process.env.BACKEND_URL + "/insertMember";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(member),
  }).catch(() => null);

  if (!res || !res.ok) {
    return { ok: false, message: "No se pudo agregar el familiar" };
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
          message: "El familiar se guardó, pero no se pudo subir la imagen de cédula",
        };
      }
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        message: "El familiar se guardó, pero no se pudo subir la imagen de cédula",
      };
    }
  }

  revalidatePath(`/protected/edit/${member.proyecto_id}`);

  return { ok: true, message: "Familiar agregado correctamente" };
}
