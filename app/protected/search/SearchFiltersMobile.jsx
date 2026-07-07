"use client";

import {
  SlidersHorizontal,
  Search,
  X,
  Trash,
  Calendar,
  Landmark,
  MapPin,
  Boxes,
  User,
  FlagTriangleRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { addBitacora } from "./addBitacora";
import getNotes from "./getNotes";
import { saveImages } from "./saveImages";
import getImages from "./getImages";
import Image from "next/image";
import { etapas } from "../../etapas";

export default function SearchFiltersMobile({ projects, userData }) {
  console.log(projects);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const value = formData.get("search");

    setSearch(value);
  };

  return (
    <div className="w-full h-fit flex flex-col items-center justify-between gap-1 p-4">
      <div className="w-full flex">
        <label htmlFor="filtersModal">
          <SlidersHorizontal
            size={40}
            className="bg-primary rounded p-2 h-full aspect-square text-primary-content"
          />
        </label>

        <input type="checkbox" id="filtersModal" className="modal-toggle" />

        <div className="modal modal-bottom" role="dialog">
          <div className="modal-box h-[70dvh] relative px-0 pt-13">
            {/** TODO: Conseguir los filtros usando la api para ponerlos aquí
             * Actualmente usando placeholders
             */}
            <div className="flex flex-col ">
              <details
                className="collapse collapse-arrow"
                name="filters-1"
                open={true}
              >
                <summary className="collapse-title font-semibold">
                  Tipo de Bono
                </summary>
                <div className="collapse-content text-sm">
                  <fieldset className="fieldset ">
                    <label className="label">
                      <input
                        type="checkbox"
                        checked={filter}
                        onChange={() => setFilter(!filter)}
                        className="checkbox"
                      />
                      Art.59
                    </label>
                    <label className="label">
                      <input type="checkbox" className="checkbox" />
                      CLP
                    </label>
                    <label className="label">
                      <input type="checkbox" className="checkbox" />
                      RAMT
                    </label>
                    <label className="label">
                      <input type="checkbox" className="checkbox" />
                      Credito
                    </label>
                    <label className="label">
                      <input type="checkbox" className="checkbox" />
                      Bono Credito
                    </label>
                  </fieldset>
                </div>
              </details>

              <div className="divider"></div>

              <details className="collapse collapse-arrow" name="filters-2">
                <summary className="collapse-title font-semibold">
                  Etapa
                </summary>
                <div className="collapse-content text-sm">
                  <fieldset className="fieldset ">
                    <label className="label">
                      <input type="checkbox" className="checkbox" />
                      Preanálisis
                    </label>

                    <label className="label">
                      <input type="checkbox" className="checkbox" />
                      Visita
                    </label>

                    <label className="label">
                      <input type="checkbox" className="checkbox" />
                      Confección Expediente
                    </label>

                    <label className="label">
                      <input type="checkbox" className="checkbox" />
                      Env. Centro de Negocios
                    </label>

                    <label className="label">
                      <input type="checkbox" className="checkbox" />
                      Ingreso al BANHVI
                    </label>

                    <label className="label">
                      <input type="checkbox" className="checkbox" />
                      Permisos de Construcción
                    </label>

                    <label className="label">
                      <input type="checkbox" className="checkbox" />
                      Procesos de Formalización
                    </label>

                    <label className="label">
                      <input type="checkbox" className="checkbox" />
                      Solicitud de Servicio Público
                    </label>

                    <label className="label">
                      <input type="checkbox" className="checkbox" />
                      En Construcción
                    </label>

                    <label className="label">
                      <input type="checkbox" className="checkbox" />
                      Entregado
                    </label>

                    <label className="label">
                      <input type="checkbox" className="checkbox" />
                      Facturado
                    </label>
                  </fieldset>
                </div>
              </details>

              <div className="divider"></div>

              <details className="collapse collapse-arrow" name="filters-1">
                <summary className="collapse-title font-semibold">
                  Descartados
                </summary>
                <div className="collapse-content text-sm">
                  <fieldset className="fieldset ">
                    <label className="label">
                      <input type="checkbox" className="checkbox" />
                      Descartados
                    </label>
                  </fieldset>
                </div>
              </details>
            </div>

            <div className="modal-action absolute top-3 right-3 m-0">
              <label htmlFor="filtersModal">
                <X size={30}></X>
              </label>
            </div>
          </div>
        </div>

        <div className="divider divider-horizontal"></div>

        <Form onSubmit={handleSubmit} className="join">
          <label className="input join-item">
            <input type="text" name="search" placeholder="Buscar por nombre" />
          </label>

          <button type="submit" className="btn btn-primary join-item">
            <Search size={20} />
          </button>
        </Form>
      </div>

      <div className="w-full h-auto flex flex-col mt-3 gap-3">
        {projects &&
          projects.map((project) =>
            search != "" ? (
              project.nombre.toLowerCase().includes(search.toLowerCase()) && (
                <ProjectItem
                  key={project.id}
                  project={project}
                  userData={userData}
                ></ProjectItem>
              )
            ) : filter == true ? (
              project.bono == "Art.59" && (
                <ProjectItem
                  key={project.id}
                  project={project}
                  userData={userData}
                ></ProjectItem>
              )
            ) : (
              <ProjectItem
                key={project.id}
                project={project}
                userData={userData}
              ></ProjectItem>
            ),
          )}
      </div>
    </div>
  );
}

function ProjectItem({ project, userData }) {
  console.log(project);
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [notes, setNotes] = useState();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(true);

  const [files, setFiles] = useState([]);
  const [images, setImages] = useState();

  const handleFiles = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    setFiles(selectedFiles);

    await saveImages(selectedFiles, project.id, project.slug);

    setReload(!reload);
  };

  useEffect(() => {
    const notesData = async () => {
      setLoading(true);
      const response = await getNotes(project.id);
      setNotes(response);
      setLoading(false);
    };
    notesData();
  }, [project.id, reload]);

  useEffect(() => {
    const imagesData = async () => {
      setLoading(true);
      const response = await getImages(project.id);
      console.log(response);
      setImages(response);
      setLoading(false);
    };
    imagesData();
  }, [project.id, reload]);
  return (
    <>
      <details
        className="collapse collapse-arrow bg-base-200 border border-base-300 shadow-lg relative z-1"
        name="my-accordion-det-1"
      >
        <summary className="collapse-title font-semibold">
          {project.nombre + " "}
          <span className="text-primary-content/70">
            - {project.bono || "Bono sin definir"}
          </span>
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
            <ul className="list rounded-box">
              <li className="list-row">
                {project.descripcion || "No hay descripción para el proyecto"}
              </li>
              <li className="list-row">
                <div className="text-4xl font-thin opacity-30 tabular-nums">
                  <Calendar size={35}></Calendar>
                </div>
                <div className="list-col-grow">
                  <div>
                    {new Date(project.created_at).toLocaleDateString("es-CR")}
                  </div>
                  <div className="text-xs uppercase font-semibold opacity-60">
                    Fecha de creación
                  </div>
                </div>
              </li>

              <li className="list-row">
                <div className="text-4xl font-thin opacity-30 tabular-nums">
                  <Landmark size={35}></Landmark>
                </div>
                <div className="list-col-grow">
                  <div>{project.bono || "Bono sin definir"}</div>
                  <div className="text-xs uppercase font-semibold opacity-60">
                    {project.variante_bono || "Variante sin definir"}
                  </div>
                </div>
              </li>

              <li className="list-row">
                <div className="text-4xl font-thin opacity-30 tabular-nums">
                  <FlagTriangleRight size={35}></FlagTriangleRight>
                </div>
                <div className="list-col-grow">
                  <div>{etapas.find(etapa => etapa.id == project.etapa_id).label}</div>
                  <div className="text-xs uppercase font-semibold opacity-60">
                    Etapa del proyecto
                  </div>
                </div>
              </li>

              <li className="list-row">
                <div className="text-4xl font-thin opacity-30 tabular-nums">
                  <MapPin size={35}></MapPin>
                </div>
                <div className="list-col-grow">
                  <div>
                    {project.provincia || "Sin provincia"},{" "}
                    {project.canton || "Sin cantón"},{" "}
                    {project.distrito || "Sin distrito"}
                  </div>
                </div>
              </li>

              <li className="list-row">
                <div className="text-4xl font-thin opacity-30 tabular-nums">
                  <Boxes size={35}></Boxes>
                </div>
                <div className="list-col-grow">
                  <div>{project.grupo || "Grupo sin definir"}</div>
                  <div className="text-xs uppercase font-semibold opacity-60">
                    Grupo del proyecto
                  </div>
                </div>
              </li>

              <li className="list-row">
                <div className="text-4xl font-thin opacity-30 tabular-nums">
                  <User size={35}></User>
                </div>
                <div className="list-col-grow">
                  <div>Encargados</div>
                  <div className="text-xs uppercase font-semibold opacity-60">
                    Del proyecto
                  </div>
                </div>
              </li>

              <li className="list-row">
                <div className="overflow-x-auto">
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
              </li>
            </ul>
          )}

          {tab == 1 && (
            <div className="grid grid-cols-2 gap-4 items-center">
              {/* Input real oculto */}
              <input
                id="fileUpload"
                type="file"
                multiple
                onChange={handleFiles}
                className="hidden"
              />

              {/* Caja bonita */}
              <label
                htmlFor="fileUpload"
                className="cursor-pointer card bg-secondary w-[150px] h-[150px] shadow-lg font-black text-center text-3xl flex justify-center items-center"
              >
                +
              </label>

              {images &&
                images.map((image, index) => (
                  <Link
                    href={image.img_link}
                    className="w-[150px] h-[150px]"
                    target="_blank"
                    key={index}
                  >
                    <Image
                      src={image.img_link}
                      className="card w-[150px] h-[150px]"
                      width={150}
                      height={150}
                      alt="Darle click para abrir"
                    ></Image>
                  </Link>
                ))}
            </div>
          )}

          {tab == 2 && loading == false && (
            <>
              {/* The button to open modal */}
              <label
                htmlFor={"newBit_" + project.id}
                className="btn btn-secondary"
              >
                Añadir entrada
              </label>

              {notes &&
                notes.map((note, index) => (
                  <div className="chat chat-start" key={index}>
                    <div className="chat-header">
                      {note.usuario}
                      <time className="text-xs opacity-50">
                        {note.fecha_ingreso}
                      </time>
                    </div>
                    <div
                      className={`chat-bubble ${note.tipo == "Análisis" ? "chat-bubble-primary" : "chat-bubble-secondary"}`}
                    >
                      {note.descripcion}
                    </div>
                    <div className="chat-footer opacity-50">
                      Tipo: {note.tipo}
                    </div>
                  </div>
                ))}
            </>
          )}

          <div className="w-full flex gap-1">
            <Link
              href={`/protected/edit/${project.id}`}
              className="btn btn-primary flex-1"
            >
              Editar Proyecto
            </Link>

            <label htmlFor={`discard_${project.id}`} className="btn btn-error">
              <Trash size={25} className="text-white/50" />
            </label>
          </div>
        </div>
      </details>

      <input
        type="checkbox"
        id={`discard_${project.id}`}
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
            <label
              htmlFor={`discard_${project.id}`}
              className="btn btn-primary"
            >
              Cancelar
            </label>
            <label htmlFor={`discard_${project.id}`} className="btn btn-error">
              Descartar
            </label>
          </div>
        </div>
      </div>

      <input
        type="checkbox"
        id={"newBit_" + project.id}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Añadir Entrada</h3>
          <Form
            action={async (formData) => {
              await addBitacora(formData);
              setReload(!reload);
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
              <label htmlFor={"newBit_" + project.id} className="btn">
                Cancelar
              </label>

              <button type="submit">
                <label
                  htmlFor={"newBit_" + project.id}
                  className="btn btn-primary"
                >
                  Añadir
                </label>
              </button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
