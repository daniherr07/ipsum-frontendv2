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

// Nombre para logs + el form correspondiente, para poder señalar
// exactamente cuál de las 4 secciones falló (antes solo se sabía que "algo"
// no se guardó, sin decir cuál ni con qué datos se intentó).
function buildSections(basicsForm, locationForm, adminForm, peopleForm, projectID) {
  return [
    { key: "basics", label: "Información básica", path: "/insertBasics", body: { basicsForm, proyecto_id: projectID }, form: basicsForm },
    { key: "location", label: "Ubicación", path: "/insertLocations", body: { locationForm, proyecto_id: projectID }, form: locationForm },
    { key: "admin", label: "Datos administrativos", path: "/insertAdmins", body: { adminForm, proyecto_id: projectID }, form: adminForm },
    { key: "people", label: "Encargados del proyecto", path: "/insertPeople", body: { peopleForm, proyecto_id: projectID }, form: peopleForm },
  ];
}

export async function saveInfo(
  basicsForm,
  locationForm,
  adminForm,
  peopleForm,
  projectID,
) {

  const sections = buildSections(basicsForm, locationForm, adminForm, peopleForm, projectID);
  console.log(`[saveInfo] guardando basics/location/admin/people en paralelo para el proyecto ${projectID}`);

  const settled = await Promise.allSettled(
    sections.map((section) => postJSON(section.path, section.body)),
  );

  const results = await Promise.all(
    settled.map(async (outcome, index) => {
      const section = sections[index];

      if (outcome.status === "rejected") {
        return { section, ok: false, networkError: outcome.reason };
      }

      const res = outcome.value;
      if (res.ok) return { section, ok: true };

      // Se intenta leer el cuerpo del error que ya manda el backend
      // (routes/insert*/index.js responde {msg, error} en el 400) — es
      // información que YA viaja en esta misma respuesta, no hace falta
      // pedirle nada aparte a otra parte del sistema para tenerla.
      const body = await res.json().catch(() => null);
      return { section, ok: false, status: res.status, body };
    }),
  );

  const failed = results.filter((r) => !r.ok);

  if (failed.length > 0) {
    // Detalle completo por cada sección que falló: el nombre de la sección,
    // el status/cuerpo de la respuesta del backend (o el error de red), y
    // los datos exactos que se intentaron guardar — todo con datos que esta
    // función ya tenía en la mano, sin ir a buscar nada más.
    for (const failure of failed) {
      if (failure.networkError) {
        console.error(
          `[saveInfo] fetch falló a nivel de red guardando "${failure.section.label}" (proyecto ${projectID})`,
          { datosEnviados: failure.section.form, error: failure.networkError },
        );
      } else {
        console.error(
          `[saveInfo] el backend rechazó "${failure.section.label}" (proyecto ${projectID}, status ${failure.status})`,
          { datosEnviados: failure.section.form, respuestaBackend: failure.body },
        );
      }
    }

    const failedLabels = failed.map((f) => f.section.label).join(", ");
    return {
      ok: false,
      message: `No se pudo guardar: ${failedLabels}`,
    };
  }

  console.log(`[saveInfo] información del proyecto ${projectID} guardada correctamente`);
  return { ok: true, message: "Guardado correctamente" };
}
