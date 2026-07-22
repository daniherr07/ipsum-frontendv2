"use server";

import { revalidatePath } from "next/cache";

// Crea un nuevo miembro de familia y, si viene con foto de cédula, la sube
// después (el archivo necesita que la fila ya exista en la BD para poder
// ligarla mediante id + proyecto_id).
export async function saveFamily(member, projectSlug) {
  member.adulto = member.adulto ? 1 : 0;
  member.discapacidad = member.discapacidad ? 1 : 0;

  const endpoint = process.env.BACKEND_URL + "/insertMember";

  console.log(`[saveFamily] agregando familiar (cédula ${member.id}) al proyecto ${member.proyecto_id}`);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(member),
  }).catch((error) => {
    console.error(`[saveFamily] fetch falló a nivel de red (cédula ${member.id}, proyecto ${member.proyecto_id})`, error);
    return null;
  });

  if (!res || !res.ok) {
    console.warn(`[saveFamily] el backend no pudo agregar el familiar (cédula ${member.id}, proyecto ${member.proyecto_id}, status ${res?.status})`);
    return { ok: false, message: "No se pudo agregar el familiar" };
  }

  if (member.img_file) {
    // Solo se loguea nombre/tamaño del archivo, nunca su contenido.
    console.log(`[saveFamily] subiendo foto de cédula para miembro ${member.id}: ${member.img_file.name} (${member.img_file.size} bytes)`);
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
        console.warn(`[saveFamily] el backend no pudo subir la foto de cédula del miembro ${member.id} (status ${fileRes.status})`);
        return {
          ok: false,
          message: "El familiar se guardó, pero no se pudo subir la imagen de cédula",
        };
      }
    } catch (error) {
      console.error(`[saveFamily] excepción subiendo foto de cédula del miembro ${member.id}`, error);
      return {
        ok: false,
        message: "El familiar se guardó, pero no se pudo subir la imagen de cédula",
      };
    }
  }

  revalidatePath(`/protected/edit/${member.proyecto_id}`);

  console.log(`[saveFamily] familiar (cédula ${member.id}) agregado correctamente al proyecto ${member.proyecto_id}`);
  return { ok: true, message: "Familiar agregado correctamente" };
}
