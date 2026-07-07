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
        <p>Agregar Familiar</p>
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
                    <label
                      htmlFor="updateModal"
                      className="btn btn-primary shadow-sm flex w-full"
                    >
                      <p>Editar</p>
                    </label>
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
          <div className="modal-action">
            <label htmlFor="addModal" className="btn">
              Cerrar
            </label>
          </div>
        </div>
      )}

      {step == 1 && <div className="card-body p-0!"></div>}
    </div>
  );
}

/*
              setAddForm((prev) => ({
                ...prev,
                telefono: e.target.value,
              }))

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
*/
