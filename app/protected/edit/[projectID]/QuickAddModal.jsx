"use client";

import { useState } from "react";
import { insertGenerics } from "../../modify/insertGeneric";
import { modifyData } from "../../../const";
import StatusModal from "../../components/StatusModal";

// Botón "Añadir" + modal para crear un registro nuevo en una tabla genérica
// (las mismas que se administran en "Modificar") sin salir del editor de
// proyecto. Se usa junto a los <select> de Básicos/Administrativos/
// Encargados para no obligar al usuario a cambiar de pestaña solo para
// agregar, por ejemplo, un constructor nuevo.
//
// relationOptions trae las opciones para campos tipo "select" dentro del
// propio formulario de creación (ej. entidad_id al crear un centro de
// negocios), reutilizando datos que el formulario ya tiene cargados en vez
// de pedirlos de nuevo.
export default function QuickAddModal({ table, relationOptions = {}, onCreated }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const tableSchema = modifyData.find((entry) => entry.table === table);

  // Si la tabla no está administrada desde "Modificar", no hay esquema de
  // campos para armar el formulario de creación.
  if (!tableSchema) return null;

  const fields = tableSchema.entries.filter((entry) => entry.type !== "hidden");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    formData.set("table", table);

    const result = await insertGenerics(formData);
    setSaving(false);

    if (!result.ok) {
      setStatus(result);
      return;
    }

    const newRow = { id: result.insertId };
    fields.forEach((field) => {
      newRow[field.value] = formData.get(field.value);
    });

    onCreated(newRow);
    setOpen(false);
    e.currentTarget.reset();
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-xs btn-outline shrink-0"
        onClick={() => setOpen(true)}
      >
        Añadir
      </button>

      {open && (
        <div className="modal modal-open" role="dialog">
          <div className="modal-box">
            <h3 className="text-lg font-bold mb-3">
              Añadir {tableSchema.label}
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {fields.map((field, index) => (
                <fieldset key={index} className="fieldset">
                  <legend className="fieldset-legend">{field.label}</legend>
                  {field.type === "select" ? (
                    <select
                      name={field.value}
                      className="select w-full"
                      defaultValue=""
                      required
                    >
                      <option value="" disabled>
                        Seleccione una opción
                      </option>
                      {(relationOptions[field.value] || []).map((option) => (
                        <option value={option.id} key={option.id}>
                          {option.nombre}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={field.value}
                      className="input w-full"
                      required
                    />
                  )}
                </fieldset>
              ))}

              <div className="modal-action flex justify-between">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <StatusModal status={status} onClose={() => setStatus(null)} />
    </>
  );
}
