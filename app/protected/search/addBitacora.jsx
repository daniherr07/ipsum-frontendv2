"use server";

export async function addBitacora(formData) {
  const endpoint = process.env.BACKEND_URL + "/addBitacora";

  const data = Object.fromEntries(formData.entries());

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).catch(() => null);

  if (!res || !res.ok) {
    return { ok: false, message: "No se pudo guardar la entrada de la bitácora" };
  }

  return { ok: true, message: "Entrada agregada correctamente" };
}
