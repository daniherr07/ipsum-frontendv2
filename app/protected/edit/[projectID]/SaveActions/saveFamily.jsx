"use server";

import { revalidatePath } from "next/cache";


export async function saveFamily(member, projectSlug) {
  member.adulto = member.adulto ? 1 : 0;
  member.discapacidad = member.discapacidad ? 1 : 0;
  const endpoint = process.env.BACKEND_URL + "/insertMember";

  await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(member),
  });

  if (member.img_file != "") {
      try {
        const data = new FormData();
        const endpointFile = process.env.BACKEND_URL + "/insertMemberFile";
        data.append("file", member.img_file);
        data.append("id", member.id);
        data.append("path", projectSlug);
        data.append("proyecto_id", member.proyecto_id)

        const res = await fetch(endpointFile, {
          method: "POST",
          body: data, // Aquí enviamos todo, incluyendo el archivo
        });

        if (!res.ok) throw new Error("Error al guardar la familia");
      } catch (error) {
        console.error(error);
      }

  }



  return revalidatePath(`/protected/edit/${member.proyecto_id}`)


}
