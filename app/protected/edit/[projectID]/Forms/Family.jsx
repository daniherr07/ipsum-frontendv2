"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { saveFamily } from "../SaveActions/saveFamily";
import { updateFamily } from "../SaveActions/editFamily";
import { uploadMemberPhoto } from "../SaveActions/uploadMemberPhoto";
import { convertHeicToPngIfNeeded } from "../../../lib/convertHeicToPng";
import getFamilyData from "../GetFamily/getFamilyData";
import Image from "next/image";
import Link from "next/link";
import StatusModal from "../../../components/StatusModal";

export default function Family({ familyForm, projectID, projectSlug }) {
  const [familyData, setFamilyData] = useState(familyForm);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);

  // Controla el modal de "Agregar Familiar".
  const [adding, setAdding] = useState(false);
  // Guarda el miembro que se está editando (o null si ningún modal de
  // edición está abierto). Antes todos los botones "Editar" apuntaban al
  // mismo id de modal compartido, así que nunca se sabía cuál miembro
  // editar; con este estado cada tarjeta abre su propio modal.
  const [editingMember, setEditingMember] = useState(null);
  const [status, setStatus] = useState(null);
  // Guarda el db_id del familiar cuya foto se está subiendo, para mostrar el
  // spinner solo en esa tarjeta (no en todas).
  const [uploadingId, setUploadingId] = useState(null);

  useEffect(() => {
    const reloadData = async () => {
      setLoading(true);
      const updatedData = await getFamilyData(projectID);
      setFamilyData(updatedData);
      setLoading(false);
    };

    reloadData();
  }, [projectID, reload]);

  const emptyMember = {
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

  // Callback común para crear y editar: muestra el resultado en el modal de
  // estado y, si salió bien, cierra el formulario y refresca la lista.
  const handleDone = (result) => {
    setStatus(result);
    if (result.ok) {
      setAdding(false);
      setEditingMember(null);
      setReload((prev) => !prev);
    }
  };

  // Sube (o reemplaza) solo la foto de cédula de un familiar, sin abrir el
  // modal completo de edición. Reutiliza /insertMemberFile, que ya actualiza
  // únicamente id_link/id_route por cédula + proyecto_id.
  const handlePhotoChange = async (member, file) => {
    if (!file) return;
    // /insertMemberFile ubica la fila por cédula + proyecto_id, así que sin
    // cédula no hay forma de saber a quién asignarle la foto.
    if (!member.id) {
      setStatus({
        ok: false,
        message:
          "Este familiar no tiene identificación (cédula) registrada. Agrégala editando el familiar antes de subir la foto.",
      });
      return;
    }
    setUploadingId(member.db_id);
    // Convierte HEIC/HEIF (formato por defecto de iPhone) a PNG antes de
    // subir, para evitar errores de visualización después.
    const convertedFile = await convertHeicToPngIfNeeded(file);
    const result = await uploadMemberPhoto(
      convertedFile,
      member.id,
      projectID,
      projectSlug,
    );
    setUploadingId(null);
    setStatus(result);
    if (result.ok) {
      setReload((prev) => !prev);
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-primary shadow-sm flex w-full"
        onClick={() => setAdding(true)}
      >
        <p>Agregar Familiar</p>
        <Plus></Plus>
      </button>

      {adding && (
        <FamilyModal
          mode="add"
          initialValues={emptyMember}
          projectSlug={projectSlug}
          onClose={() => setAdding(false)}
          onDone={handleDone}
        />
      )}

      {editingMember && (
        <FamilyModal
          mode="edit"
          // img_file arranca vacío: si no se elige una foto nueva, la
          // existente se deja intacta (ver SaveActions/editFamily.jsx).
          initialValues={{ ...editingMember, img_file: "" }}
          projectSlug={projectSlug}
          onClose={() => setEditingMember(null)}
          onDone={handleDone}
        />
      )}

      <StatusModal status={status} onClose={() => setStatus(null)} />

      {loading == false &&
        familyData &&
        familyData.map((member) => (
          <details
            className="collapse collapse-arrow bg-base-200 border border-base-300"
            name={member.id}
            key={member.db_id}
          >
            <summary className="collapse-title font-semibold">
              {" "}
              {member.nombre || "Sin nombre"}{" "}
              {member.apellido1 || "Sin apellido"}
            </summary>
            <div className="collapse-content text-sm">
              {" "}
              <div className="card bg-base-200 w-full shadow-sm">
                <div className="flex flex-col items-center gap-2 pt-4">
                  {member.id_link ? (
                    // max-w-xs + mx-auto: antes ocupaba todo el ancho de la
                    // card (podía verse enorme en pantallas anchas); ahora
                    // tiene un tope de 320px y queda centrada, pero sigue
                    // encogiendo en pantallas angostas gracias a w-full.
                    <Link
                      href={member.id_link}
                      target="_blank"
                      className="block w-full max-w-xs mx-auto"
                    >
                      <Image
                        src={member.id_link}
                        width={720}
                        height={480}
                        className="w-full h-auto rounded"
                        alt="Imagen con un formato no previsualizable, dar click para abrir individualmente"
                      ></Image>
                    </Link>
                  ) : (
                    <p className="text-base-content/60">Sin archivo subido</p>
                  )}

                  <label
                    htmlFor={`cedula-photo-${member.db_id}`}
                    className={`btn btn-sm btn-outline ${uploadingId === member.db_id ? "btn-disabled" : ""}`}
                  >
                    {uploadingId === member.db_id ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Subiendo...
                      </>
                    ) : member.id_link ? (
                      "Cambiar foto"
                    ) : (
                      "Añadir foto"
                    )}
                  </label>
                  <input
                    id={`cedula-photo-${member.db_id}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingId === member.db_id}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      handlePhotoChange(member, file);
                      e.target.value = "";
                    }}
                  />
                </div>
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
                    <button
                      type="button"
                      className="btn btn-primary shadow-sm flex w-full"
                      onClick={() => setEditingMember(member)}
                    >
                      <p>Editar</p>
                    </button>
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

// Modal de dos pasos compartido entre "Agregar Familiar" y "Editar Familiar".
// El paso 1 (foto de cédula) va aparte porque el archivo se sube en una
// petición distinta a la de los datos (ver SaveActions/saveFamily.jsx).
function FamilyModal({ mode, initialValues, projectSlug, onClose, onDone }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialValues);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    const action = mode === "edit" ? updateFamily : saveFamily;
    const result = await action(form, projectSlug);
    setSaving(false);
    onDone(result);
  };

  return (
    <div className="modal modal-open" role="dialog">
      <div className="modal-box">
        <h3 className="text-lg font-bold mb-3">
          {mode === "edit" ? "Editar Familiar" : "Agregar Familiar"}
        </h3>

        {step == 0 && (
          <div className="flex flex-col gap-3">
            <FamilyFields form={form} setForm={setForm} />

            <div className="modal-action flex justify-between">
              <button type="button" className="btn" onClick={onClose}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(1)}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {step == 1 && (
          <div className="flex flex-col gap-3">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Imagen de la cédula
                {mode === "edit" && " (dejar vacío para no cambiarla)"}
              </legend>
              <input
                type="file"
                accept="image/*"
                className="file-input w-full"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) {
                    setForm((prev) => ({ ...prev, img_file: "" }));
                    return;
                  }
                  // Convierte HEIC/HEIF (formato por defecto de iPhone) a
                  // PNG antes de subir, para evitar errores de
                  // visualización después.
                  const convertedFile = await convertHeicToPngIfNeeded(file);
                  setForm((prev) => ({ ...prev, img_file: convertedFile }));
                }}
              />
            </fieldset>

            <div className="modal-action flex justify-between">
              <button
                type="button"
                className="btn"
                onClick={() => setStep(0)}
                disabled={saving}
              >
                Atrás
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving
                  ? "Guardando..."
                  : mode === "edit"
                    ? "Actualizar"
                    : "Añadir"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Campos de datos personales del familiar, reutilizados por el modal de
// crear y el de editar.
function FamilyFields({ form, setForm }) {
  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Tipo de miembro</legend>
        <input
          type="text"
          className="input w-full"
          placeholder="Jefe de hogar, cónyuge, hijo..."
          value={form.tipo_miembro}
          onChange={update("tipo_miembro")}
        />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Nombre</legend>
        <input
          type="text"
          className="input w-full"
          value={form.nombre}
          onChange={update("nombre")}
        />
      </fieldset>

      <div className="flex gap-3">
        <fieldset className="fieldset flex-1">
          <legend className="fieldset-legend">Primer Apellido</legend>
          <input
            type="text"
            className="input w-full"
            value={form.apellido1}
            onChange={update("apellido1")}
          />
        </fieldset>
        <fieldset className="fieldset flex-1">
          <legend className="fieldset-legend">Segundo Apellido</legend>
          <input
            type="text"
            className="input w-full"
            value={form.apellido2}
            onChange={update("apellido2")}
          />
        </fieldset>
      </div>

      <div className="flex gap-3">
        <fieldset className="fieldset flex-1">
          <legend className="fieldset-legend">Identificación</legend>
          <input
            type="text"
            className="input w-full"
            placeholder="0-0000-0000"
            value={form.id}
            onChange={update("id")}
          />
        </fieldset>
        <fieldset className="fieldset flex-1">
          <legend className="fieldset-legend">Tipo de identificación</legend>
          <input
            type="text"
            className="input w-full"
            placeholder="Cédula, DIMEX, pasaporte..."
            value={form.tipo_id}
            onChange={update("tipo_id")}
          />
        </fieldset>
      </div>

      <div className="flex gap-3">
        <fieldset className="fieldset flex-1">
          <legend className="fieldset-legend">Ingresos</legend>
          <input
            type="text"
            className="input w-full"
            placeholder="0"
            value={form.ingresos}
            onChange={update("ingresos")}
          />
        </fieldset>
        <fieldset className="fieldset flex-1">
          <legend className="fieldset-legend">Tipo de Ingreso</legend>
          <input
            type="text"
            className="input w-full"
            value={form.tipo_ingresos}
            onChange={update("tipo_ingresos")}
          />
        </fieldset>
      </div>

      <div className="flex gap-3">
        <fieldset className="fieldset flex-1">
          <legend className="fieldset-legend">Teléfono</legend>
          <input
            type="text"
            className="input w-full"
            value={form.telefono}
            onChange={update("telefono")}
          />
        </fieldset>
        <fieldset className="fieldset flex-1">
          <legend className="fieldset-legend">Email</legend>
          <input
            type="email"
            className="input w-full"
            value={form.email}
            onChange={update("email")}
          />
        </fieldset>
      </div>

      <div className="flex gap-5">
        <label className="label">
          <input
            type="checkbox"
            className="checkbox"
            checked={!!form.adulto}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, adulto: e.target.checked }))
            }
          />
          Adulto Mayor
        </label>
        <label className="label">
          <input
            type="checkbox"
            className="checkbox"
            checked={!!form.discapacidad}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, discapacidad: e.target.checked }))
            }
          />
          Discapacidad
        </label>
      </div>
    </>
  );
}
