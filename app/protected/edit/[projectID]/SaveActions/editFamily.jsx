"use server";

import { revalidatePath } from "next/cache";

// Actualiza un miembro de familia existente (identificado por member.db_id)
// y, si se subió una nueva foto de cédula, la reemplaza en Dropbox.
export async function updateFamily(member, projectSlug) {
  member.adulto = member.adulto ? 1 : 0;
  member.discapacidad = member.discapacidad ? 1 : 0;

  const endpoint = process.env.BACKEND_URL + "/updateMember";

  console.log(`[updateFamily] actualizando miembro db_id ${member.db_id} (cédula ${member.id}) del proyecto ${member.proyecto_id}`);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(member),
  }).catch((error) => {
    console.error(`[updateFamily] fetch falló a nivel de red (miembro db_id ${member.db_id}, proyecto ${member.proyecto_id})`, error);
    return null;
  });

  if (!res || !res.ok) {
    console.warn(`[updateFamily] el backend no pudo actualizar el familiar db_id ${member.db_id} (status ${res?.status})`);
    return { ok: false, message: "No se pudo actualizar el familiar" };
  }

  if (member.img_file) {
    // Solo se loguea nombre/tamaño del archivo, nunca su contenido.
    console.log(`[updateFamily] subiendo nueva foto de cédula para miembro ${member.id}: ${member.img_file.name} (${member.img_file.size} bytes)`);
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
        console.warn(`[updateFamily] el backend no pudo subir la foto de cédula del miembro ${member.id} (status ${fileRes.status})`);
        return {
          ok: false,
          message: "El familiar se actualizó, pero no se pudo subir la imagen de cédula",
        };
      }
    } catch (error) {
      console.error(`[updateFamily] excepción subiendo foto de cédula del miembro ${member.id}`, error);
      return {
        ok: false,
        message: "El familiar se actualizó, pero no se pudo subir la imagen de cédula",
      };
    }
  }

  revalidatePath(`/protected/edit/${member.proyecto_id}`);

  console.log(`[updateFamily] miembro db_id ${member.db_id} del proyecto ${member.proyecto_id} actualizado correctamente`);
  return { ok: true, message: "Familiar actualizado correctamente" };
}
