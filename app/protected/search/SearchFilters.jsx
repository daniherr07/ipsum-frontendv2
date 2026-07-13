"use client";

import {
  Search,
  Trash,
  Calendar,
  Landmark,
  MapPin,
  Boxes,
  User,
  FlagTriangleRight,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Form from "next/form";
import { addBitacora } from "./addBitacora";
import getNotes from "./getNotes";
import { saveImages } from "./saveImages";
import { deleteImage } from "./deleteImage";
import { updateProjectStatus } from "./updateProjectStatus";
import getImages from "./getImages";
import { convertHeicToPngIfNeeded } from "../lib/convertHeicToPng";
import Image from "next/image";
import StatusModal from "../components/StatusModal";

// Guarda búsqueda/filtros en sessionStorage para que sigan ahí al volver a
// esta página (ej. después de entrar a un proyecto y regresar), sin
// necesidad de tocar la URL.
const SEARCH_STATE_KEY = "ipsum:searchFilters";

function loadStoredSearchState() {
  try {
    return JSON.parse(sessionStorage.getItem(SEARCH_STATE_KEY)) || {};
  } catch {
    return {};
  }
}

const SORT_OPTIONS = [
  { value: "recent", label: "Más reciente primero" },
  { value: "oldest", label: "Más antiguo primero" },
  { value: "name-asc", label: "Nombre (A-Z)" },
  { value: "name-desc", label: "Nombre (Z-A)" },
  { value: "etapa-asc", label: "Etapa (menor a mayor)" },
  { value: "etapa-desc", label: "Etapa (mayor a menor)" },
];

// Compara el valor del proyecto contra los valores seleccionados de un
// filtro. Los campos de texto (provincia, entidad, encargados...) se
// recortan antes de comparar porque la captura de datos no siempre es
// consistente con los espacios en blanco.
function matchesFilter(project, filterName, selectedValues) {
  const raw = project[filterName];
  const value = typeof raw === "string" ? raw.trim() : raw;
  return selectedValues.includes(value);
}

// AND entre categorías (bono Y provincia Y ...), OR dentro de una misma
// categoría (bono X O bono Y). Antes todos los filtros vivían en un solo
// arreglo plano y se combinaban todos con OR, así que elegir un bono y una
// provincia mostraba proyectos que cumplieran cualquiera de los dos en vez
// de ambos.
function matchesAllFilters(project, activeFilters) {
  return Object.entries(activeFilters).every(([filterName, selectedValues]) =>
    matchesFilter(project, filterName, selectedValues),
  );
}

function sortProjects(projects, sortBy) {
  const sorted = [...projects];

  switch (sortBy) {
    case "oldest":
      return sorted.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at),
      );
    case "name-asc":
      return sorted.sort((a, b) =>
        (a.nombre || "").localeCompare(b.nombre || "", "es"),
      );
    case "name-desc":
      return sorted.sort((a, b) =>
        (b.nombre || "").localeCompare(a.nombre || "", "es"),
      );
    case "etapa-asc":
      return sorted.sort((a, b) => (a.etapa_id ?? 0) - (b.etapa_id ?? 0));
    case "etapa-desc":
      return sorted.sort((a, b) => (b.etapa_id ?? 0) - (a.etapa_id ?? 0));
    case "recent":
    default:
      return sorted.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );
  }
}

export default function SearchFilters({ projects, userData, searchFilters, etapas }) {
  // Arrancan vacíos (deben coincidir con el render del servidor) y se
  // restauran de sessionStorage en un efecto aparte, ya montados en el
  // navegador — leerlos directo en el useState rompería la hidratación
  // (el HTML del servidor nunca puede saber qué había en sessionStorage).
  const [search, setSearch] = useState("");
  // { [filterName]: valor[] } — ver matchesAllFilters más arriba.
  const [activeFilters, setActiveFilters] = useState({});
  const [showDiscarded, setShowDiscarded] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [openProjectKey, setOpenProjectKey] = useState(null);
  // En móvil, buscar y filtrar viven detrás de un botón para no saturar la
  // pantalla con el panel de filtros completo; en escritorio siguen visibles
  // siempre (ver el uso de "hidden lg:..." más abajo).
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  // Evita que el efecto de abajo (que persiste a sessionStorage) sobrescriba
  // lo guardado con los valores vacíos iniciales antes de que se restauren.
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    // sessionStorage no existe durante el render en el servidor: leerlo
    // fuera de un efecto (ej. en el inicializador de useState) haría que el
    // HTML del servidor no coincida con el primer render del cliente
    // (hydration mismatch). Este es el caso legítimo que la regla de abajo
    // no contempla: sincronizar con un API del navegador que no existe en SSR.
    /* eslint-disable react-hooks/set-state-in-effect */
    const stored = loadStoredSearchState();
    if (stored.search) setSearch(stored.search);
    if (stored.activeFilters) setActiveFilters(stored.activeFilters);
    if (stored.showDiscarded) setShowDiscarded(stored.showDiscarded);
    setRestored(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      sessionStorage.setItem(
        SEARCH_STATE_KEY,
        JSON.stringify({ search, activeFilters, showDiscarded }),
      );
    } catch {
      // Algunos navegadores (modo privado de Safari/iOS, políticas
      // corporativas, extensiones de privacidad) bloquean sessionStorage y
      // esto lanza una excepción. Sin el try/catch, ese throw ocurría dentro
      // de un useEffect apenas se cargaba la página y dejaba toda la
      // sección de búsqueda (resumen de proyecto, filtros) sin responder
      // para esos usuarios — perder la persistencia entre visitas no es
      // grave, pero romper la página sí.
    }
  }, [restored, search, activeFilters, showDiscarded]);

  const activeFilterCount =
    Object.values(activeFilters).reduce((sum, values) => sum + values.length, 0) +
    (showDiscarded ? 1 : 0) +
    (search ? 1 : 0);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const value = formData.get("search");

    setSearch(value);
  };

  const handleClearAll = () => {
    setSearch("");
    setActiveFilters({});
    setShowDiscarded(false);
  };

  const handleCheckboxChange = (checked, filterName, filterValue) => {
    setActiveFilters((prev) => {
      const current = prev[filterName] || [];
      const updated = checked
        ? [...current, filterValue]
        : current.filter((value) => value !== filterValue);

      const next = { ...prev };
      if (updated.length === 0) {
        delete next[filterName];
      } else {
        next[filterName] = updated;
      }
      return next;
    });
  };

  const visibleProjects = useMemo(() => {
    if (!projects) return [];

    const filtered = projects.filter((project) => {
      if (search && !project.nombre.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      // "Mostrar descartados" es excluyente: desactivado muestra solo los
      // proyectos activos, activado muestra solo los descartados (activo
      // puede venir NULL en proyectos viejos, por eso se compara == 0 en
      // vez de negar directamente).
      const isDiscarded = project.activo == 0;
      if (isDiscarded !== showDiscarded) {
        return false;
      }

      return matchesAllFilters(project, activeFilters);
    });

    return sortProjects(filtered, sortBy);
  }, [projects, search, showDiscarded, activeFilters, sortBy]);

  return (
    <div className="w-full h-fit p-4">
      {/* Distribución de escritorio: filtros visibles a la izquierda y resultados a la derecha */}
      <div className="w-full max-w-[1700px] mx-auto flex flex-col lg:flex-row lg:items-start gap-4">
        {/* Panel de filtros: siempre visible en escritorio (hidden lg:block
            lo ignora por completo); en móvil vive escondido y se abre desde
            el botón "Buscar y filtrar" de más abajo, para no ocupar toda la
            pantalla con filtros antes de ver un solo proyecto. */}
        <aside className="hidden lg:block lg:w-72 xl:w-80 lg:sticky lg:top-4">
          <div className="bg-base-200 border border-base-300 rounded-box shadow-md p-4">
            <FilterPanel
              sortBy={sortBy}
              setSortBy={setSortBy}
              searchFilters={searchFilters}
              activeFilters={activeFilters}
              handleCheckboxChange={handleCheckboxChange}
              showDiscarded={showDiscarded}
              setShowDiscarded={setShowDiscarded}
              activeFilterCount={activeFilterCount}
              onClearAll={handleClearAll}
            />
          </div>
        </aside>

        <section className="w-full lg:flex-1 min-w-0 pb-24 lg:pb-0">
          {/* Input de búsqueda: visible siempre en escritorio; en móvil se
              reemplaza por el botón de abajo para no saturar la pantalla. */}
          {/* key={search}: fuerza a recrear el input (no controlado) cuando
              search cambia por fuera de un submit normal (restaurado de
              sessionStorage al montar, o vaciado por "Limpiar filtros"),
              para que el texto mostrado no se desincronice del estado. */}
          <Form key={search} onSubmit={handleSubmit} className="hidden lg:block w-full mb-4">
            <SearchInput defaultValue={search} />
          </Form>

          {/* Botón solo-móvil que abre buscar + filtros en un popup. Fijo
              abajo (no arriba: el NavBar no es sticky/fixed, así que un
              botón fijo arriba quedaría tapando/tapado por él al hacer
              scroll). pb-24 en la sección de arriba evita que tape la
              última tarjeta de la lista. */}
          {/* El posicionamiento fijo va en este div contenedor "limpio" (sin
              clases de daisyUI) y no directamente en el <button btn ...>:
              daisyUI define sus estilos en sus propias capas CSS
              (@layer daisyui.l1.l2.l3), que pueden ganarle a las utilidades
              de Tailwind sobre el mismo elemento. Separándolo así, el
              fixed/z-30 no compite con nada de daisyUI. */}
          <div className="lg:hidden fixed bottom-4 left-4 right-4 z-30">
            <button
              type="button"
              className="btn btn-outline w-full shadow-lg bg-base-100"
              onClick={() => setMobilePanelOpen(true)}
            >
              <Search size={18} />
              <SlidersHorizontal size={18} />
              Buscar y filtrar
              {activeFilterCount > 0 && (
                <span className="badge badge-primary badge-sm ml-auto">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Encabezado de columnas. Solo se ve en escritorio porque en
              móvil cada fila no muestra esas columnas (ver ProjectItem).
              Usa "sticky" en vez de "fixed": con position:fixed se sale del
              flujo del layout y perdería la alineación horizontal con esta
              columna (que comparte fila con el sidebar de filtros y un
              contenedor centrado); "sticky" logra el mismo efecto de
              "queda pegado arriba al hacer scroll" sin ese problema. */}
          {visibleProjects.length > 0 && (
            // text-primary-content/80 (no opacity-60 en el div): así solo se
            // atenúa el color del texto y el fondo bg-primary se queda 100%
            // opaco al hacer scroll debajo del header pegado arriba.
            <div className="hidden lg:flex items-center gap-x-4 px-4 py-2 mb-2 text-xs uppercase font-semibold text-primary-content/80 bg-primary border border-primary-800 rounded-box shadow-md sticky top-4 z-10">
              <span className="flex-1 min-w-[160px]">Proyecto</span>
              <span className="w-56 shrink-0">Etapa</span>
              <span className="w-36 shrink-0">Provincia</span>
              <span className="w-24 shrink-0">Fecha</span>
              {/* Espaciador vacío: cada fila de proyecto reserva un w-28 al
                  final para el badge "Descartado" (aunque no aplique); sin
                  este mismo espacio aquí, "Proyecto" (flex-1) se estira de
                  más y desalinea Etapa/Provincia/Fecha hacia la derecha. */}
              <span className="w-28 shrink-0"></span>
            </div>
          )}

          {/* Mayor distribución de cards en escritorio sin tocar su contenido interno */}
          <div className="w-full h-auto grid grid-cols-1 gap-3">
            {visibleProjects.map((project, index) => {
              // Clave estable para evitar compartir estado visual entre cards
              const projectKey = `${project.id ?? project.slug ?? "project"}-${index}`;

              return (
                <ProjectItem
                  key={projectKey}
                  projectKey={projectKey}
                  project={project}
                  userData={userData}
                  etapas={etapas}
                  isOpen={openProjectKey === projectKey}
                  onToggleOpen={() =>
                    setOpenProjectKey((current) =>
                      current === projectKey ? null : projectKey,
                    )
                  }
                ></ProjectItem>
              );
            })}

            {visibleProjects.length === 0 && (
              <p className="text-center opacity-60 py-10">
                Ningún proyecto coincide con la búsqueda o los filtros.
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Popup de "Buscar y filtrar" — solo se monta/usa en móvil (el botón
          que lo abre está oculto en lg:), pero lg:hidden por las dudas si
          quedó abierto y la ventana crece a escritorio. */}
      {mobilePanelOpen && (
        <div className="modal modal-open lg:hidden" role="dialog">
          <div className="modal-box max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Buscar y filtrar</h3>
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setMobilePanelOpen(false)}
                aria-label="Cerrar"
              >
                <X size={16} />
              </button>
            </div>

            <Form
              key={search}
              onSubmit={(e) => {
                handleSubmit(e);
                setMobilePanelOpen(false);
              }}
              className="w-full mb-4"
            >
              <SearchInput defaultValue={search} />
            </Form>

            <FilterPanel
              sortBy={sortBy}
              setSortBy={setSortBy}
              searchFilters={searchFilters}
              activeFilters={activeFilters}
              handleCheckboxChange={handleCheckboxChange}
              showDiscarded={showDiscarded}
              setShowDiscarded={setShowDiscarded}
              activeFilterCount={activeFilterCount}
              onClearAll={handleClearAll}
            />

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-primary w-full"
                onClick={() => setMobilePanelOpen(false)}
              >
                Ver resultados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Input de búsqueda por nombre; se reutiliza tanto en el form fijo de
// escritorio como dentro del popup de móvil.
function SearchInput({ defaultValue }) {
  return (
    <div className="join w-full">
      <label className="input join-item w-full">
        <input
          type="text"
          name="search"
          placeholder="Buscar por nombre"
          defaultValue={defaultValue}
          className="w-full"
        />
      </label>

      <button type="submit" className="btn btn-primary join-item">
        <Search size={20} />
      </button>
    </div>
  );
}

// Contenido de "Ordenar por" + categorías de filtros + Descartados. Se
// reutiliza en el sidebar de escritorio y en el popup de móvil para no
// mantener dos copias del mismo marcado.
function FilterPanel({
  sortBy,
  setSortBy,
  searchFilters,
  activeFilters,
  handleCheckboxChange,
  showDiscarded,
  setShowDiscarded,
  activeFilterCount,
  onClearAll,
}) {
  return (
    <div className="flex flex-col">
      {activeFilterCount > 0 && (
        <button
          type="button"
          className="btn btn-ghost btn-sm mb-2"
          onClick={onClearAll}
        >
          <X size={16} />
          Limpiar filtros y búsqueda
        </button>
      )}

      <label className="label mb-2">
        Ordenar por
        <select
          className="select select-sm w-full"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="divider my-1"></div>

      {/* Los filtros (bono, subtipo, etapa, provincia, entidad,
       * centro de negocios, analista, arquitecto...) llegan como
       * prop desde search/page.jsx, armados con datos reales de la
       * base de datos.
       */}
      {searchFilters.map((filter, index) => (
        <details
          className="collapse collapse-arrow"
          key={index}
        >
          <summary className="collapse-title font-semibold">
            {filter.title}
          </summary>

          <div className="collapse-content text-sm">
            <fieldset className="fieldset">
              {filter.entries.length === 0 && (
                <p className="text-xs opacity-60">Sin opciones</p>
              )}
              {filter.entries.map((entry) => (
                <label className="label" type="checkbox" key={entry.id}>
                  <input
                    type="checkbox"
                    className="checkbox"
                    value={entry.id}
                    // Controlado por activeFilters: al haber dos copias de
                    // este panel montadas (sidebar de escritorio oculto +
                    // popup de móvil), un checkbox sin estado propio se
                    // desincroniza entre ambas si se marca desde la otra.
                    checked={(activeFilters[filter.filter] || []).includes(entry.id)}
                    onChange={(e) =>
                      handleCheckboxChange(
                        e.target.checked,
                        filter.filter,
                        entry.id
                      )
                    }
                  />
                  {entry.label}
                </label>
              ))}
            </fieldset>
          </div>
        </details>
      ))}
      <div className="divider"></div>

      <details className="collapse collapse-arrow">
        <summary className="collapse-title font-semibold">
          Descartados
        </summary>
        <div className="collapse-content text-sm">
          <fieldset className="fieldset">
            <label className="label">
              <input
                type="checkbox"
                className="checkbox"
                checked={showDiscarded}
                onChange={(e) => setShowDiscarded(e.target.checked)}
              />
              Mostrar descartados
            </label>
          </fieldset>
        </div>
      </details>
    </div>
  );
}

function ProjectItem({ project, userData, projectKey, etapas, isOpen, onToggleOpen }) {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [notes, setNotes] = useState();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(true);

  const [images, setImages] = useState();
  const [status, setStatus] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  // Filtro de la pestaña "Notas": "todos" | "Análisis" | "Técnico".
  const [notesTipoFilter, setNotesTipoFilter] = useState("todos");
  const fileUploadId = `fileUpload_${projectKey}`;
  const discardModalId = `discard_${projectKey}`;
  const newBitModalId = `newBit_${projectKey}`;
  // El modal "Añadir Entrada"/"Descartar" se abre/cierra con el truco del
  // checkbox (htmlFor), así que para cerrarlo por código tras una acción
  // exitosa hace falta una referencia directa al checkbox.
  const newBitCheckboxRef = useRef(null);
  const discardCheckboxRef = useRef(null);

  // project viene de /allProjects (prop del server component padre), así que
  // cambiar activo acá no lo actualiza solo — router.refresh() vuelve a
  // pedir los datos al servidor para que el proyecto aparezca/desaparezca
  // de la lista según el filtro "Mostrar descartados" ya activo.
  const handleUpdateStatus = async (activo) => {
    setUpdatingStatus(true);
    const result = await updateProjectStatus(project.id, activo);
    setUpdatingStatus(false);
    setStatus(result);
    if (result.ok) {
      if (discardCheckboxRef.current) discardCheckboxRef.current.checked = false;
      router.refresh();
    }
  };

  const handleFiles = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    setUploading(true);
    try {
      // Convierte cualquier foto HEIC/HEIF (formato por defecto de iPhone)
      // a PNG antes de subir, para evitar errores de visualización después.
      const convertedFiles = await Promise.all(
        selectedFiles.map(convertHeicToPngIfNeeded),
      );
      const result = await saveImages(convertedFiles, project.id, project.slug);
      setStatus(result);
      if (result.ok) {
        setReload(!reload);
      }
    } finally {
      setUploading(false);
    }

    // Permite volver a seleccionar el mismo archivo si hiciera falta.
    e.target.value = "";
  };

  const handleDeleteImage = async (image) => {
    const result = await deleteImage(image.id, image.img_route);
    setStatus(result);
    if (result.ok) {
      setReload(!reload);
    }
  };

  useEffect(() => {

    const notesData = async () => {
      setLoading(true);
      const response = await getNotes(project.id);
      setNotes(response);
      setLoading(false);
    };

    if(isOpen) {
    notesData();
    }
  }, [project.id, reload, isOpen]);

  useEffect(() => {
    const imagesData = async () => {
      setLoading(true);
      const response = await getImages(project.id);
      console.log(response);
      setImages(response);
      setLoading(false);
    };

    if(isOpen) {
      imagesData();
    }
  }, [project.id, reload, isOpen]);

  const etapaActual = etapas.find((etapa) => etapa.id == project.etapa_id);

  return (
    <>
      <details
        className="collapse collapse-arrow bg-base-200 border border-base-300 shadow-lg relative z-1"
        open={isOpen}
      >
        <summary
          className="collapse-title font-semibold"
          onClick={(e) => {
            e.preventDefault();
            onToggleOpen();
          }}
        >
          {/* flex-wrap en móvil (se apila igual que antes); en escritorio
              (lg:flex-nowrap) se acomoda en una sola fila aprovechando el
              ancho para mostrar etapa/provincia/fecha sin tener que abrir
              la tarjeta. */}
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-x-4 gap-y-1">
            <span className="flex-1 min-w-[160px]">
              {project.nombre + " "}
              {/* text-base-content (no text-primary-content, que es para
                  texto ENCIMA de un fondo bg-primary): esta fila usa el
                  fondo base normal, y primary-content ahí se veía casi
                  invisible (un azul clarito sobre blanco). */}
              <span className="text-base-content/60">
                - {project.bono || "Bono sin definir"}
              </span>
            </span>

            {/* Columnas visibles solo en escritorio: en móvil se mantiene el
                resumen simple de siempre (nombre + bono). Los anchos (w-56,
                w-36, w-24) coinciden con el encabezado de la lista. */}
            <span className="hidden lg:flex w-56 shrink-0 items-center">
              {/* h-auto + whitespace-normal: los badges de daisyUI son de
                  una sola línea con truncate por defecto (nombres de etapa
                  largos quedaban cortados a la mitad, ej. "...so al BANHVI
                  (Registrado por Ent"). Ahora el texto puede partirse en dos
                  líneas dentro del mismo ancho de columna. */}
              <span className="badge badge-primary badge-outline max-w-full h-auto whitespace-normal text-center leading-tight py-1">
                {etapaActual?.nombre || "Sin etapa"}
              </span>
            </span>
            <span className="hidden lg:block text-sm opacity-70 w-36 shrink-0 truncate">
              {project.provincia || "Sin provincia"}
            </span>
            <span className="hidden lg:block text-sm opacity-70 w-24 shrink-0">
              {new Date(project.created_at).toLocaleDateString("es-CR", {
                timeZone: "America/Costa_Rica",
              })}
            </span>

            {/* Móvil: badge normal, puede caer a su propia línea (flex-wrap
                ya lo maneja). Escritorio: se reserva un ancho fijo SIEMPRE
                (haya o no badge), para que un proyecto descartado no
                "apriete" la columna del nombre y la haga saltar de línea. */}
            {project.activo == 0 && (
              <span className="badge badge-error badge-soft lg:hidden">
                Descartado
              </span>
            )}
            <span className="hidden lg:flex w-28 shrink-0 justify-end">
              {project.activo == 0 && (
                <span className="badge badge-error badge-soft">
                  Descartado
                </span>
              )}
            </span>
          </div>
        </summary>

        <div className="collapse-content text-sm flex flex-col gap-3 max-h-[200dvh] scroll-auto">
          <div role="tablist" className="tabs tabs-border w-full flex">
            <a
              role="tab"
              className={`tab flex-1 ${tab == 0 && "tab-active"}`}
              onClick={() => setTab(0)}
            >
              Info.
            </a>
            <a
              role="tab"
              className={`tab flex-1 ${tab == 1 && "tab-active"}`}
              onClick={() => setTab(1)}
            >
              Img.
            </a>
            <a
              role="tab"
              className={`tab flex-1 ${tab == 2 && "tab-active"}`}
              onClick={() => setTab(2)}
            >
              Notas
            </a>
          </div>

          {tab == 0 && (
            // grid-cols-1: en móvil queda igual que antes (todo apilado).
            // lg:grid-cols-3: en escritorio se reparte en 3 columnas para
            // aprovechar el ancho en vez de una sola lista vertical larga.
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="lg:col-span-3 rounded-box bg-base-100 p-4">
                <div className="text-xs uppercase font-semibold opacity-60 mb-1">
                  Descripción
                </div>
                {project.descripcion || "No hay descripción para el proyecto"}
              </div>

              <InfoStat
                icon={<Calendar size={32} />}
                main={new Date(project.created_at).toLocaleDateString("es-CR", {
                  timeZone: "America/Costa_Rica",
                })}
                sub="Fecha de creación"
                color="secondary"
              />

              <InfoStat
                icon={<Landmark size={32} />}
                main={project.bono || "Bono sin definir"}
                sub={project.variante_bono || "Variante sin definir"}
                color="warning"
              />

              <InfoStat
                icon={<FlagTriangleRight size={32} />}
                main={etapaActual?.nombre || "Sin etapa"}
                sub="Etapa del proyecto"
                color="primary"
              />

              <InfoStat
                icon={<MapPin size={32} />}
                main={`${project.provincia || "Sin provincia"}, ${project.canton || "Sin cantón"}, ${project.distrito || "Sin distrito"}`}
                sub="Ubicación"
                color="success"
              />

              <InfoStat
                icon={<Boxes size={32} />}
                main={project.grupo || "Grupo sin definir"}
                sub="Grupo del proyecto"
                color="accent"
              />

              <div className="lg:col-span-3 flex flex-col gap-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <User size={20} /> Encargados del proyecto
                </h3>
                <div className="overflow-x-auto rounded-box border border-base-300">
                  <table className="table">
                    {/* head */}
                    <thead>
                      <tr>
                        <th>Respons.</th>
                        <th>Nombre</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>Constructor</th>
                        <td>{project.p_constructor || "Sin definir"}</td>
                      </tr>
                      <tr>
                        <th>Arquitecto</th>
                        <td>{project.arquitecto || "Sin definir"}</td>
                      </tr>
                      <tr>
                        <th>Promotor</th>
                        <td>{project.promotor || "Sin definir"}</td>
                      </tr>
                      <tr>
                        <th>Analista</th>
                        <td>{project.analista || "Sin definir"}</td>
                      </tr>
                      <tr>
                        <th>Ingeniero</th>
                        <td>{project.ingeniero || "Sin definir"}</td>
                      </tr>
                      <tr>
                        <th>Fiscal</th>
                        <td>{project.fiscal || "Sin definir"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {tab == 1 && (
            // Más columnas en escritorio (antes 2 fijas en cualquier
            // tamaño) para no desperdiciar el ancho disponible.
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 items-center">
              {/* Input real oculto */}
              <input
                id={fileUploadId}
                type="file"
                multiple
                onChange={handleFiles}
                disabled={uploading}
                className="hidden"
              />

              {/* Caja bonita: mientras sube, muestra un spinner y bloquea
                  el clic para no disparar otra subida encima. */}
              <label
                htmlFor={fileUploadId}
                className={`card bg-secondary w-[150px] h-[150px] shadow-lg font-black text-center text-3xl flex justify-center items-center ${
                  uploading
                    ? "pointer-events-none opacity-70"
                    : "cursor-pointer"
                }`}
              >
                {uploading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  "+"
                )}
              </label>

              {uploading && (
                <p className="col-span-full text-sm opacity-70">
                  Subiendo imágenes...
                </p>
              )}

              {images &&
                images.map((image, index) => (
                  <div key={index} className="relative w-[150px] h-[150px]">
                    <Link
                      href={image.img_link}
                      className="block w-full h-full"
                      target="_blank"
                    >
                      <Image
                        src={image.img_link}
                        className="card w-[150px] h-[150px]"
                        width={150}
                        height={150}
                        alt="Darle click para abrir"
                      ></Image>
                    </Link>

                    <button
                      type="button"
                      className="btn btn-error btn-xs btn-circle absolute top-1 right-1"
                      onClick={() => handleDeleteImage(image)}
                      aria-label="Borrar imagen"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
            </div>
          )}

          {tab == 2 && loading == false && (
            <>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                {/* The button to open modal */}
                <label
                  htmlFor={newBitModalId}
                  className="btn btn-secondary"
                >
                  Añadir entrada
                </label>

                <select
                  className="select select-sm w-40"
                  value={notesTipoFilter}
                  onChange={(e) => setNotesTipoFilter(e.target.value)}
                >
                  <option value="todos">Todas</option>
                  <option value="Análisis">Análisis</option>
                  <option value="Técnico">Técnico</option>
                </select>
              </div>

              {notes &&
                notes
                  .filter(
                    (note) =>
                      notesTipoFilter === "todos" || note.tipo === notesTipoFilter,
                  )
                  .map((note, index) => {
                    // usuario_id viene del stored procedure getNotes; se
                    // compara como string porque uno puede llegar number y
                    // el otro (de la cookie) puede llegar distinto tipo.
                    const isOwn =
                      note.usuario_id != null &&
                      String(note.usuario_id) === String(userData.id);

                    return (
                      <div
                        className={`chat ${isOwn ? "chat-end" : "chat-start"}`}
                        key={index}
                      >
                        <div className="chat-header">
                          {note.usuario}
                          <time className="text-xs opacity-50">
                            {note.fecha_ingreso}
                          </time>
                        </div>
                        <div
                          className={`chat-bubble ${
                            isOwn
                              ? "chat-bubble-accent"
                              : note.tipo == "Análisis"
                                ? "chat-bubble-primary"
                                : "chat-bubble-secondary"
                          }`}
                        >
                          {note.descripcion}
                        </div>
                        <div className="chat-footer opacity-50">
                          Tipo: {note.tipo}
                        </div>
                      </div>
                    );
                  })}
            </>
          )}

          <div className="w-full flex gap-1">
            <Link
              href={`/protected/edit/${project.id}`}
              className="btn btn-primary flex-1"
            >
              Editar Proyecto
            </Link>

            {/* Proyecto ya descartado: reactivar es una acción reversible y
                sin consecuencias, no hace falta modal de confirmación. */}
            {project.activo == 0 ? (
              <button
                type="button"
                className="btn btn-success"
                disabled={updatingStatus}
                onClick={() => handleUpdateStatus(1)}
              >
                {updatingStatus ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Reactivar"
                )}
              </button>
            ) : (
              <label htmlFor={discardModalId} className="btn btn-error">
                <Trash size={25} className="text-white/50" />
              </label>
            )}
          </div>
        </div>

      </details>

      <input
        type="checkbox"
        id={discardModalId}
        ref={discardCheckboxRef}
        className="modal-toggle"
      />

      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">¿Descartar {project.nombre}?</h3>
          <p className="py-4">
            Puede reactivar el proyecto después activando
            &quot;Descartados&quot; en filtros
          </p>
          <div className="modal-action flex *:flex-1">
            <button
              type="button"
              className="btn btn-primary"
              disabled={updatingStatus}
              onClick={() => {
                if (discardCheckboxRef.current) discardCheckboxRef.current.checked = false;
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-error"
              disabled={updatingStatus}
              onClick={() => handleUpdateStatus(0)}
            >
              {updatingStatus ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Descartar"
              )}
            </button>
          </div>
        </div>
      </div>

      <input
        type="checkbox"
        id={newBitModalId}
        ref={newBitCheckboxRef}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Añadir Entrada</h3>
          <Form
            action={async (formData) => {
              const result = await addBitacora(formData);
              setStatus(result);

              if (result.ok) {
                setReload(!reload);
                if (newBitCheckboxRef.current) {
                  newBitCheckboxRef.current.checked = false;
                }
              }
            }}
          >
            <input
              type="hidden"
              name="fecha_ingreso"
              value={new Intl.DateTimeFormat("sv-SE", {
                timeZone: "America/Costa_Rica",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }).format(new Date())}
            />

            <input type="hidden" name="proyecto_id" value={project.id} />
            <input type="hidden" name="usuario_id" value={userData.id} />

            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
              <legend className="fieldset-legend">Descripción</legend>
              <textarea name="descripcion" className="textarea"></textarea>
            </fieldset>

            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
              <legend className="fieldset-legend">Tipo</legend>
              <select name="tipo" className="select">
                <option value="Análisis">Análisis</option>
                <option value="Técnico">Técnico</option>
              </select>
            </fieldset>
            <div className="modal-action flex justify-between">
              <label htmlFor={newBitModalId} className="btn">
                Cancelar
              </label>

              <button type="submit" className="btn btn-primary">
                Añadir
              </button>
            </div>
          </Form>
        </div>
      </div>

      <StatusModal status={status} onClose={() => setStatus(null)} />
    </>
  );
}

// Clases completas (no interpoladas) para que Tailwind las detecte: un
// string armado en runtime como `text-${color}` no lo escanea el JIT.
const INFO_STAT_COLORS = {
  primary: { icon: "text-primary", border: "border-primary" },
  secondary: { icon: "text-secondary", border: "border-secondary" },
  accent: { icon: "text-accent", border: "border-accent" },
  success: { icon: "text-success", border: "border-success" },
  warning: { icon: "text-warning", border: "border-warning" },
};

// Celda de dato individual del tab "Info." (icono + valor + subtítulo).
// Se usa dentro de un grid para que, en escritorio, varios datos queden
// acomodados lado a lado en vez de una sola columna vertical larga. Antes
// todas las tarjetas eran del mismo gris (icono a opacity-30) y costaba
// distinguir un dato de otro de un vistazo; cada una ahora tiene su propio
// color (ver los usos de InfoStat más abajo).
function InfoStat({ icon, main, sub, color = "primary" }) {
  const colors = INFO_STAT_COLORS[color] || INFO_STAT_COLORS.primary;

  return (
    <div
      className={`flex items-center gap-3 bg-base-100 rounded-box p-3 min-w-0 border-l-4 ${colors.border}`}
    >
      <div className={`shrink-0 ${colors.icon}`}>{icon}</div>
      <div className="min-w-0">
        <div className="truncate">{main}</div>
        {sub && (
          <div className="text-xs uppercase font-semibold opacity-60 truncate">
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}
