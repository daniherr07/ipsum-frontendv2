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
  console.log(`[saveInfo] guardando basics/location/admin/people en paralelo para el proyecto ${projectID}`);

  const results = await Promise.all([
    postJSON("/insertBasics", { basicsForm, proyecto_id: projectID }),
    postJSON("/insertLocations", { locationForm, proyecto_id: projectID }),
    postJSON("/insertAdmins", { adminForm, proyecto_id: projectID }),
    postJSON("/insertPeople", { peopleForm, proyecto_id: projectID }),
  ]).catch((error) => {
    console.error(`[saveInfo] fetch falló a nivel de red guardando el proyecto ${projectID}`, error);
    return [];
  });

  const allOk = results.length === 4 && results.every((res) => res.ok);

  if (!allOk) {
    // NOTA (no corregido): si alguno de los 4 falla, no se distingue cuál
    // (basics/location/admin/people) en el log ni en el mensaje devuelto —
    // solo se sabe que "algo" de la info del proyecto no se guardó.
    const statuses = results.map((res) => res?.status ?? "sin respuesta");
    console.warn(`[saveInfo] no se pudo guardar toda la información del proyecto ${projectID}, statuses: ${statuses.join(", ")}`);
    return { ok: false, message: "No se pudo guardar toda la información del proyecto" };
  }

  console.log(`[saveInfo] información del proyecto ${projectID} guardada correctamente`);
  return { ok: true, message: "Guardado correctamente" };
}
