"use server";

// Los 4 formularios (básicos, ubicación, administrativos, encargados) se
// guardan en tablas distintas y no dependen entre sí, así que se envían en
// paralelo en vez de uno tras otro (4x menos latencia de red en cada guardado
// manual o automático).
function postJSON(path, body) {
  return fetch(process.env.BACKEND_URL + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function saveInfo(
  basicsForm,
  locationForm,
  adminForm,
  peopleForm,
  projectID,
) {
  const results = await Promise.all([
    postJSON("/insertBasics", { basicsForm, proyecto_id: projectID }),
    postJSON("/insertLocations", { locationForm, proyecto_id: projectID }),
    postJSON("/insertAdmins", { adminForm, proyecto_id: projectID }),
    postJSON("/insertPeople", { peopleForm, proyecto_id: projectID }),
  ]).catch(() => []);

  const allOk = results.length === 4 && results.every((res) => res.ok);

  return allOk
    ? { ok: true, message: "Guardado correctamente" }
    : { ok: false, message: "No se pudo guardar toda la información del proyecto" };
}
