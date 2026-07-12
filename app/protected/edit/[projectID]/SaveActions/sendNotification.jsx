"use server";

export async function sendNotification(
  proyectoId,
  remitenteUsuarioId,
  destinatarioUsuarioId,
  mensaje,
) {
  const endpoint = process.env.BACKEND_URL + "/insertNotification";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      proyecto_id: proyectoId,
      remitente_usuario_id: remitenteUsuarioId,
      destinatario_usuario_id: destinatarioUsuarioId,
      mensaje,
    }),
  }).catch(() => null);

  if (!res || !res.ok) {
    const errorBody = res ? await res.json().catch(() => null) : null;
    return {
      ok: false,
      message: errorBody?.msg || "No se pudo enviar la notificación",
    };
  }

  return { ok: true, message: "Notificación enviada correctamente" };
}
