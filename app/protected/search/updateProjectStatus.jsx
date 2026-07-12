"use server";

export async function updateProjectStatus(proyectoId, activo) {
  const endpoint = process.env.BACKEND_URL + "/updateProjectStatus";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ proyecto_id: proyectoId, activo }),
  }).catch(() => null);

  if (!res || !res.ok) {
    return {
      ok: false,
      message: activo
        ? "No se pudo reactivar el proyecto"
        : "No se pudo descartar el proyecto",
    };
  }

  return {
    ok: true,
    message: activo ? "Proyecto reactivado" : "Proyecto descartado",
  };
}
