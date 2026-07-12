import SearchFilters from "./SearchFilters";
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

// Bono, subtipo de bono y etapa salen de sus tablas en la BD (antes "etapa"
// venía de un arreglo hardcodeado en app/etapas.js); el resto se arma a
// partir de los proyectos ya cargados, que es donde vive el dato real de
// provincia/entidad/centro de negocio/encargados.
function buildSearchFilters(projects, bonos, variantes, etapas) {
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
    textFilter("Analista", "analista", projects),
    textFilter("Arquitecto", "arquitecto", projects),
  ];
}

export default async function Search() {
  const [projectsRes, bonosRes, variantesRes, etapasRes] = await Promise.all([
    fetch(endpoint),
    fetch(process.env.BACKEND_URL + "/generics/tipos_bono"),
    fetch(process.env.BACKEND_URL + "/generics/variantes_bono"),
    fetch(process.env.BACKEND_URL + "/generics/etapas"),
  ]);

  const [projects, bonos, variantes, etapas] = await Promise.all([
    projectsRes.json(),
    bonosRes.json(),
    variantesRes.json(),
    etapasRes.json(),
  ]);

  const cookieStore = await cookies();

  const userData = JSON.parse(cookieStore.get("userData").value);

  const searchFilters = buildSearchFilters(projects, bonos, variantes, etapas);

  return (
    <div className="w-full h-full">
      <SearchFilters
        projects={projects}
        userData={userData}
        searchFilters={searchFilters}
        etapas={etapas}
      />
    </div>
  );
}
