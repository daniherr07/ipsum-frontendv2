import SearchFilters from "./SearchFilters";
import ExitGuard from "./ExitGuard";
import { cookies } from "next/headers";

const endpoint = process.env.BACKEND_URL + "/allProjects";

// Arma las opciones de un filtro de texto libre (provincia, entidad, etc.)
// a partir de los valores que realmente aparecen en los proyectos actuales,
// en vez de mantener un catálogo aparte que se puede desincronizar. Se
// recorta espacios en blanco porque varios de estos campos vienen con
// inconsistencias de captura (" Alajuela" vs "Alajuela ").
function textFilter(title, field, projects) {
  const values = new Set();

  for (const project of projects) {
    const raw = project[field];
    if (typeof raw !== "string") continue;

    const trimmed = raw.trim();
    if (trimmed) values.add(trimmed);
  }

  const entries = Array.from(values)
    .sort((a, b) => a.localeCompare(b, "es"))
    .map((value) => ({ id: value, label: value }));

  return { title, filter: field, entries };
}

// A diferencia de textFilter, esto arma las opciones a partir del padrón
// real de usuarios con ese rol (activos), no de quienes ya aparecen
// asignados en algún proyecto — antes "Analista" solo mostraba a Magda
// porque es la única con proyectos asignados hoy, y el resto de analistas
// (ej. Daniel) ni siquiera aparecían como opción para filtrar por ellos.
// El id de cada opción es el mismo "nombre apellido1" que arma /allProjects
// (CONCAT(nombre, ' ', apellido1)), para que matchesFilter siga comparando
// contra el mismo formato de string.
function rosterFilter(title, field, users) {
  const entries = (users || [])
    .filter((user) => user.activated)
    .map((user) => `${user.nombre} ${user.apellido1 || ""}`.trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "es"))
    .map((name) => ({ id: name, label: name }));

  return { title, filter: field, entries };
}

// Bono, subtipo de bono y etapa salen de sus tablas en la BD (antes "etapa"
// venía de un arreglo hardcodeado en app/etapas.js); provincia/entidad/
// centro de negocio salen de los proyectos ya cargados (no hay padrón fijo
// de esos valores); analista/arquitecto salen del padrón real de usuarios
// con ese rol.
function buildSearchFilters(projects, bonos, variantes, etapas, peopleFormValues) {
  return [
    {
      title: "Bonos",
      filter: "bono_id",
      entries: bonos
        .filter((bono) => bono.activated)
        .map((bono) => ({ id: bono.id, label: bono.nombre })),
    },
    {
      title: "Subtipos de bono",
      filter: "variante_bono_id",
      entries: variantes
        .filter((variante) => variante.activated)
        .map((variante) => ({ id: variante.id, label: variante.nombre })),
    },
    {
      title: "Etapa",
      filter: "etapa_id",
      entries: etapas.map((etapa) => ({ id: etapa.id, label: etapa.nombre })),
    },
    textFilter("Provincia", "provincia", projects),
    textFilter("Entidad", "entidad", projects),
    textFilter("Centro de Negocios", "centro_negocio", projects),
    rosterFilter("Analista", "analista", peopleFormValues?.analistas),
    rosterFilter("Arquitecto", "arquitecto", peopleFormValues?.arquitectos),
  ];
}

export default async function Search() {
  const [projectsRes, bonosRes, variantesRes, etapasRes, formValuesRes] =
    await Promise.all([
      fetch(endpoint),
      fetch(process.env.BACKEND_URL + "/generics/tipos_bono"),
      fetch(process.env.BACKEND_URL + "/generics/variantes_bono"),
      fetch(process.env.BACKEND_URL + "/generics/etapas"),
      fetch(process.env.BACKEND_URL + "/formValues"),
    ]);

  const [projects, bonos, variantes, etapas, formValues] = await Promise.all([
    projectsRes.json(),
    bonosRes.json(),
    variantesRes.json(),
    etapasRes.json(),
    formValuesRes.json(),
  ]);

  const cookieStore = await cookies();

  const userData = JSON.parse(cookieStore.get("userData").value);

  const searchFilters = buildSearchFilters(
    projects,
    bonos,
    variantes,
    etapas,
    formValues.peopleFormValues,
  );

  return (
    <div className="w-full h-full">
      <ExitGuard />
      <SearchFilters
        projects={projects}
        userData={userData}
        searchFilters={searchFilters}
        etapas={etapas}
      />
    </div>
  );
}
