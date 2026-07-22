"use server";

export async function stageAction(projectID, etapa_id, remitente_usuario_id) {
  const endpoint = process.env.BACKEND_URL + "/changeStage";

  console.log(`[stageAction] cambiando proyecto ${projectID} a etapa ${etapa_id} (remitente ${remitente_usuario_id})`);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectID, etapa_id, remitente_usuario_id }),
  }).catch((error) => {
    console.error(`[stageAction] fetch falló a nivel de red (proyecto ${projectID}, etapa ${etapa_id})`, error);
    return null;
  });

  if (!res || !res.ok) {
    console.warn(`[stageAction] el backend no pudo cambiar la etapa (proyecto ${projectID}, etapa ${etapa_id}, status ${res?.status})`);
    return { ok: false, message: "No se pudo cambiar la etapa del proyecto" };
  }

  console.log(`[stageAction] etapa del proyecto ${projectID} actualizada correctamente a ${etapa_id}`);
  return { ok: true, message: "Etapa actualizada correctamente" };
}
