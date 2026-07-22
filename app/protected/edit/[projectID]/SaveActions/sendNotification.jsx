"use server";

export async function sendNotification(
  proyectoId,
  remitenteUsuarioId,
  destinatarioUsuarioId,
  asunto,
  mensaje,
) {
  const endpoint = process.env.BACKEND_URL + "/insertNotification";

  // Nunca se loguea el contenido de "mensaje"/"asunto", solo su longitud.
  console.log(`[sendNotification] proyecto ${proyectoId}, de usuario ${remitenteUsuarioId} a usuario ${destinatarioUsuarioId}, mensaje de ${mensaje?.length ?? 0} caracteres`);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      proyecto_id: proyectoId,
      remitente_usuario_id: remitenteUsuarioId,
      destinatario_usuario_id: destinatarioUsuarioId,
      asunto,
      mensaje,
    }),
  }).catch((error) => {
    console.error(`[sendNotification] fetch falló a nivel de red (proyecto ${proyectoId}, destinatario ${destinatarioUsuarioId})`, error);
    return null;
  });

  if (!res || !res.ok) {
    const errorBody = res ? await res.json().catch(() => null) : null;
    console.warn(`[sendNotification] el backend no pudo enviar la notificación (proyecto ${proyectoId}, destinatario ${destinatarioUsuarioId}, status ${res?.status})`, errorBody);
    return {
      ok: false,
      message: errorBody?.msg || "No se pudo enviar la notificación",
    };
  }

  console.log(`[sendNotification] notificación enviada correctamente (proyecto ${proyectoId}, destinatario ${destinatarioUsuarioId})`);
  return { ok: true, message: "Notificación enviada correctamente" };
}
