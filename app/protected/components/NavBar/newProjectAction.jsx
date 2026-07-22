"use server";

import { redirect } from "next/navigation";

export async function newProjectAction(formData, creatorUserId) {
  const projectName = formData.get("projectName");

  console.log(`[newProjectAction] creando proyecto "${projectName}", creador usuario ${creatorUserId}`);

  const endpoint = process.env.BACKEND_URL + "/new";

  const projectData = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectName: projectName, creatorUserId }),
  }).catch((error) => {
    console.error(`[newProjectAction] fetch falló a nivel de red creando "${projectName}"`, error);
    return null;
  });

  if (!projectData || !projectData.ok) {
    console.warn(`[newProjectAction] el backend no pudo crear el proyecto "${projectName}" (status ${projectData?.status})`);
    return { ok: false, message: "No se pudo crear el proyecto" };
  }

  const { projectId } = await projectData.json();
  console.log(`[newProjectAction] proyecto creado correctamente, id ${projectId}`);
  redirect(`/protected/edit/${projectId}`);
}
