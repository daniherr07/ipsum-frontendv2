"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { saveFamily } from "../SaveActions/saveFamily";
import { useRouter } from "next/navigation";
import getFamilyData from "../GetFamily/getFamilyData";
import Image from "next/image";
import Link from "next/link";

export default function Family({
  familyForm,
  setFamilyForm,
  projectID,
  projectSlug,
}) {
  const [familyData, setFamilyData] = useState(familyForm);
  const [reload, setReload] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const reloadData = async () => {
      setLoading(true);
      const updatedData = await getFamilyData(projectID);
      setFamilyData(updatedData);
      setLoading(false);
    };

    reloadData();
  }, [projectID, reload]);

  return (
    <>
      <label
        htmlFor="addModal"
        className="btn btn-primary shadow-sm flex w-full"
      >
        <p>Agregar Miembro de la Familia</p>
        <Plus></Plus>
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="addModal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <FamilyAdd
            projectID={projectID}
            reload={reload}
            setReload={setReload}
            projectSlug={projectSlug}
          ></FamilyAdd>
        </div>
      </div>

      {loading == false &&
        familyForm &&
        familyData.map((member) => (
          <details
            className="collapse collapse-arrow bg-base-200 border border-base-300"
            name={member.id}
            key={member.id}
          >
            <summary className="collapse-title font-semibold">
              {" "}
              {member.nombre || "Sin nombre"}{" "}
              {member.apellido1 || "Sin apellido"}
            </summary>
            <div className="collapse-content text-sm">
              {" "}
              <div className="card bg-base-200 w-full shadow-sm">
                {member.id_link ? (
                  <Link href={member.id_link} target="_blank">
                    <Image
                      src={member.id_link}
                      width={720}
                      height={480}
                      alt="Imagen con un formato no previsualizable, dar click para abrir individualmente"
                    ></Image>
                  </Link>
                ) : (
                  "Sin archivo subido"
                )}
                <div className="card-body">
                  <div className="">
                    <h1 className="card-title">
                      {member.nombre || ""} {member.apellido1 || ""}{" "}
                      {member.apellido2 || ""}
                    </h1>
                    <h2 className="card-title text-sm text-base-content/80">
                      {member.id || "Sin identificación"} {"("}{" "}
                      {member.tipo_id || "Sin especificar"} {")"}
                    </h2>
                  </div>

                  <div className="flex gap-3">
                    {member.adulto == 1 && (
                      <div className="badge badge-soft badge-primary">
                        Adulto Mayor
                      </div>
                    )}

                    {member.discapacidad == 1 && (
                      <div className="badge badge-soft badge-secondary">
                        Discapacidad
                      </div>
                    )}
                  </div>

                  <fieldset className="fieldset border-base-content/40 rounded-box border p-4">
                    <legend className="fieldset-legend">Información</legend>
                    <p>
                      {member.tipo_miembro || "Tipo de miembro sin especificar"}
                    </p>
                    <p>Teléfono: {member.telefono || "Sin telefono"}</p>
                    <p>Email: {member.email || "Sin email"}</p>
                  </fieldset>

                  <fieldset className="fieldset border-base-content/40 rounded-box border p-4">
                    <legend className="fieldset-legend">Ingresos</legend>
                    <p>₡{member.ingresos || "Ingresos sin especificar"}</p>
                    <p>
                      Tipo de Ingreso:{" "}
                      {member.tipo_ingresos || "Sin especificar"}
                    </p>
                  </fieldset>

                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Editar</button>
                  </div>
                </div>
              </div>
            </div>
          </details>
        ))}

      {loading == true && (
        <span className="loading loading-dots loading-xl"></span>
      )}
    </>
  );
}

function FamilyAdd({ projectID, reload, setReload, projectSlug }) {
  const [step, setStep] = useState(0);

  const defaultValues = {
    id: "",
    tipo_id: "",
    nombre: "",
    apellido1: "",
    apellido2: "",
    tipo_miembro: "",
    ingresos: "",
    tipo_ingresos: "",
    email: "",
    telefono: "",
    adulto: false,
    discapacidad: false,
    img_file: "",
    proyecto_id: projectID,
  };
  const [addForm, setAddForm] = useState(defaultValues);

  return (
    <div className="card">
      {step == 0 && (
        <div className="card-body p-0!">
          <fieldset className="fieldset border-base-content/40 rounded-box border p-4 gap-3">
            <legend className="fieldset-legend">Información Personal</legend>

            <label className="label">Tipo de Identificación</label>
            <select
              value={addForm.tipo_id}
              className="select"
              onChange={(e) =>
                setAddForm((prev) => ({
                  ...prev,
                  tipo_id: e.target.value,
                }))
              }
            >
              <option disabled={true} value={""}>
                Seleccione el tipo de identificación
              </option>
              <option value={"Nacional"}>Nacional</option>
              <option value={"DIMEX"}>DIMEX o Residencia</option>
              <option value={"Menor"}>Menor de Edad</option>
              <option value={"Otro"}>Otro</option>
            </select>

            <label className="label">
              Identificación <span className="text-error">* Requerido</span>
            </label>
            <input
              type="text"
              className="input join-item"
              placeholder="0-0000-0000"
              required
              value={addForm.id}
              onChange={(e) =>
                setAddForm((prev) => ({
                  ...prev,
                  id: e.target.value,
                }))
              }
            />

            <label className="label">Nombre</label>
            <input
              type="text"
              className="input join-item"
              placeholder="..."
              value={addForm.nombre}
              onChange={(e) =>
                setAddForm((prev) => ({
                  ...prev,
                  nombre: e.target.value,
                }))
              }
            />

            <label className="label">Primer apellido</label>
            <input
              type="text"
              className="input join-item"
              placeholder="..."
              value={addForm.apellido1}
              onChange={(e) =>
                setAddForm((prev) => ({
                  ...prev,
                  apellido1: e.target.value,
                }))
              }
            />

            <label className="label">Segundo apellido</label>
            <input
              type="text"
              className="input join-item"
              placeholder="..."
              value={addForm.apellido2}
              onChange={(e) =>
                setAddForm((prev) => ({
                  ...prev,
                  apellido2: e.target.value,
                }))
              }
            />
          </fieldset>

          <fieldset className="fieldset border-base-content/40 rounded-box border p-4 gap-3">
            <legend className="fieldset-legend">
              Información Administrativa
            </legend>

            <label className="label">Rol Familiar</label>
            <select
              className="select"
              value={addForm.tipo_miembro}
              onChange={(e) =>
                setAddForm((prev) => ({
                  ...prev,
                  tipo_miembro: e.target.value,
                }))
              }
            >
              <option disabled={true} value={""}>
                Seleccione el Rol
              </option>
              <option value={"Jefe de Familia"}>Jefe de Familia</option>
              <option value={"Hijo/a"}>Hijo/a</option>
              <option value={"Hermano/a"}>Hermano/a</option>
              <option value={"Abuelo/a"}>Abuelo/a</option>
              <option value={"Conyugue"}>Cónyugue</option>
            </select>

            <label className="label">Ingresos</label>
            <input
              type="text"
              className="input"
              placeholder="$3000"
              value={addForm.ingresos}
              onChange={(e) =>
                setAddForm((prev) => ({
                  ...prev,
                  ingresos: e.target.value,
                }))
              }
            />

            <label className="label">Tipo de Ingresos</label>
            <select
              className="select"
              value={addForm.tipo_ingresos}
              onChange={(e) =>
                setAddForm((prev) => ({
                  ...prev,
                  tipo_ingresos: e.target.value,
                }))
              }
            >
              <option disabled={true} value={""}>
                Seleccione el tipo
              </option>
              <option value={"Formal"}>Formal</option>
              <option value={"Informal"}>Informal</option>
              <option value={"Otro"}>Otro</option>
            </select>
          </fieldset>

          <div className="modal-action flex">
            <label htmlFor="addModal" className="flex-1">
              <span className="btn w-full">Cancelar</span>
            </label>
            <button
              type="button"
              className="btn btn-primary flex-1 w-full"
              disabled={addForm.id == ""}
              onClick={() => setStep(1)}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {step == 1 && (
        <div className="card-body p-0!">
          <fieldset className="fieldset border-base-content/40 rounded-box border p-4 gap-3">
            <legend className="fieldset-legend">Contacto</legend>

            <label className="label">Email</label>
            <input
              type="text"
              className="input"
              placeholder="example@email.com"
              value={addForm.email}
              onChange={(e) =>
                setAddForm((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />

            <label className="label">Teléfono</label>
            <input
              type="text"
              className="input"
              placeholder="0000-0000"
              value={addForm.telefono}
              onChange={(e) =>
                setAddForm((prev) => ({
                  ...prev,
                  telefono: e.target.value,
                }))
              }
            />
          </fieldset>

          <label className="label">
            <input
              type="checkbox"
              className="checkbox"
              value={addForm.adulto}
              onChange={(e) =>
                setAddForm((prev) => ({
                  ...prev,
                  adulto: e.target.value,
                }))
              }
            />
            <p className="font-bold text-base-content">Adulto Mayor</p>
          </label>

          <label className="label">
            <input
              type="checkbox"
              className="checkbox"
              value={addForm.discapacidad}
              onChange={(e) =>
                setAddForm((prev) => ({
                  ...prev,
                  discapacidad: e.target.value,
                }))
              }
            />
            <p className="font-bold text-base-content">Discapacidad</p>
          </label>
          <fieldset className="fieldset border-base-content/40 rounded-box border p-4 gap-3">
            <legend className="fieldset-legend">
              Foto o archivo de la Identificación
            </legend>
            <input
              type="file"
              className="file-input file-input-md"
              onChange={(e) =>
                setAddForm((prev) => ({
                  ...prev,
                  img_file: e.target.files[0], // Guardamos el archivo seleccionado
                }))
              }
            />
            <label className="label">Solo archivos .pdf .jpg .png</label>

            <p>Vista previa:</p>
          </fieldset>

          <div className="modal-action flex flex-row justify-between">
            <button
              type="button"
              className="btn btn-soft"
              onClick={() => setStep(0)}
            >
              Atrás
            </button>

            <label
              htmlFor="addModal"
              className="btn btn-primary"
              onClick={async () => {
                await saveFamily(addForm, projectSlug);
                setAddForm(defaultValues);
                setReload(!reload);
                setStep(0);
              }}
            >
              Añadir
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
