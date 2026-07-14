"use server";

export async function stageAction(projectID, etapa_id, remitente_usuario_id) {
  const endpoint = process.env.BACKEND_URL + "/changeStage";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectID, etapa_id, remitente_usuario_id }),
  }).catch(() => null);

  if (!res || !res.ok) {
    return { ok: false, message: "No se pudo cambiar la etapa del proyecto" };
  }

  return { ok: true, message: "Etapa actualizada correctamente" };
}
