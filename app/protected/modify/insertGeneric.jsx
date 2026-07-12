"use server";

// Server action para el formulario "Añadir" de las tablas genéricas
// (entidades, analistas, constructores, etc.). El campo "table" viaja en el
// propio formData e indica en qué tabla insertar el registro nuevo.
export async function insertGenerics(formData) {
  const endpoint = process.env.BACKEND_URL + "/insertGenerics";

  const data = Object.fromEntries(formData.entries());

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).catch(() => null);

  if (!res || !res.ok) {
    return { ok: false, message: "No se pudo crear el registro" };
  }

  // insertId permite a quien llamó (ej. el "Añadir rápido" del editor de
  // proyecto) armar la nueva opción y seleccionarla de una vez, sin
  // necesidad de volver a pedir toda la lista.
  const result = await res.json();
  return {
    ok: true,
    message: "Registro creado correctamente",
    insertId: result.insertId,
  };
}
