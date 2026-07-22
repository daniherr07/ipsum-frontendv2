"use server";

export async function addBitacora(formData) {
  const endpoint = process.env.BACKEND_URL + "/addBitacora";

  const data = Object.fromEntries(formData.entries());

  // Nunca se loguea el texto de la entrada, solo su longitud.
  console.log(`[addBitacora] agregando entrada de bitácora al proyecto ${data.proyecto_id}, descripción de ${data.descripcion?.length ?? 0} caracteres`);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).catch((error) => {
    console.error(`[addBitacora] fetch falló a nivel de red (proyecto ${data.proyecto_id})`, error);
    return null;
  });

  if (!res || !res.ok) {
    console.warn(`[addBitacora] el backend no pudo guardar la entrada de bitácora (proyecto ${data.proyecto_id}, status ${res?.status})`);
    return { ok: false, message: "No se pudo guardar la entrada de la bitácora" };
  }

  console.log(`[addBitacora] entrada de bitácora agregada correctamente al proyecto ${data.proyecto_id}`);
  return { ok: true, message: "Entrada agregada correctamente" };
}
