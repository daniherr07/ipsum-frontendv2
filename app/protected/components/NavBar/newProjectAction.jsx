"use server";

import { redirect } from "next/navigation";

export async function newProjectAction(formData, creatorUserId) {
  const projectName = formData.get("projectName");

  const endpoint = process.env.BACKEND_URL + "/new";

  const projectData = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectName: projectName, creatorUserId }),
  }).catch(() => null);

  if (!projectData || !projectData.ok) {
    return { ok: false, message: "No se pudo crear el proyecto" };
  }

  const { projectId } = await projectData.json();
  redirect(`/protected/edit/${projectId}`);
}
