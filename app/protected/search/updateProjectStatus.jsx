"use server";

export async function updateProjectStatus(proyectoId, activo) {
  const endpoint = process.env.BACKEND_URL + "/updateProjectStatus";

  console.log(`[updateProjectStatus] cambiando estado del proyecto ${proyectoId} a activo=${activo}`);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ proyecto_id: proyectoId, activo }),
  }).catch((error) => {
    console.error(`[updateProjectStatus] fetch falló a nivel de red (proyecto ${proyectoId})`, error);
    return null;
  });

  if (!res || !res.ok) {
    console.warn(`[updateProjectStatus] el backend no pudo cambiar el estado del proyecto ${proyectoId} (status ${res?.status})`);
    return {
      ok: false,
      message: activo
        ? "No se pudo reactivar el proyecto"
        : "No se pudo descartar el proyecto",
    };
  }

  console.log(`[updateProjectStatus] estado del proyecto ${proyectoId} actualizado correctamente (activo=${activo})`);
  return {
    ok: true,
    message: activo ? "Proyecto reactivado" : "Proyecto descartado",
  };
}
