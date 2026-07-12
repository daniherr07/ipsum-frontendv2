"use client";

import { useState } from "react";
import QuickAddModal from "../QuickAddModal";

export default function Administrative({
  adminForm,
  setAdminForm,
  formValues,
}) {
  // Entradas creadas desde el botón "Añadir" de este mismo formulario, para
  // que aparezcan de inmediato en el <select> sin recargar toda la página.
  const [extraOptions, setExtraOptions] = useState({
    entidades: [],
    centros_negocios: [],
    analistas_entidades: [],
  });

  const addExtra = (table, row) => {
    setExtraOptions((prev) => ({
      ...prev,
      [table]: [...prev[table], row],
    }));
  };

  const entidades = [
    ...(formValues?.entidades || []),
    ...extraOptions.entidades,
  ];
  const centrosNegocio = [
    ...(formValues?.centros_negocio || []),
    ...extraOptions.centros_negocios,
  ];
  const analistaEntidades = [
    ...(formValues?.analista_entidades || []),
    ...extraOptions.analistas_entidades,
  ];

  return (
    <div className="card bg-base-200 w-full shadow-sm">
      <div className="card-body">
        <h2 className="card-title">Datos Administrativos</h2>

        <fieldset className="fieldset border-base-content/40 rounded-box border p-4 gap-3">
          <legend className="fieldset-legend">Entidad</legend>

          <label className="label flex items-center gap-2">
            Entidad
            <QuickAddModal
              table="entidades"
              onCreated={(row) => {
                addExtra("entidades", row);
                setAdminForm((prev) => ({ ...prev, entidad_id: row.id }));
              }}
            />
          </label>
          <select
            className="select w-full"
            value={adminForm.entidad_id}
            onChange={(e) => {
              setAdminForm((prev) => ({
                ...prev,
                entidad_id: e.target.value,
              }));
            }}
          >
            <option disabled={true} value={""}>
              Seleccione la entidad
            </option>
            {entidades.map((entidad) => (
              <option value={entidad.id} key={entidad.id}>
                {entidad.nombre}
              </option>
            ))}
          </select>

          <label className="label flex items-center gap-2">
            Centro de Negocios
            <QuickAddModal
              table="centros_negocios"
              relationOptions={{ entidad_id: entidades }}
              onCreated={(row) => {
                addExtra("centros_negocios", row);
                setAdminForm((prev) => ({
                  ...prev,
                  centro_negocio_id: row.id,
                }));
              }}
            />
          </label>
          <select
            className="select w-full"
            value={adminForm.centro_negocio_id}
            disabled={!adminForm.entidad_id}
            onChange={(e) => {
              setAdminForm((prev) => ({
                ...prev,
                centro_negocio_id: e.target.value,
              }));
            }}
          >
            <option disabled={true} value={""}>
              Seleccione el centro de negocios
            </option>
            {adminForm.entidad_id != "" &&
              centrosNegocio.map(
                (centro) =>
                  centro.entidad_id == adminForm.entidad_id && (
                    <option value={centro.id} key={centro.id}>
                      {centro.nombre}
                    </option>
                  ),
              )}
          </select>

          <label className="label flex items-center gap-2">
            Analista de Entidad
            <QuickAddModal
              table="analistas_entidades"
              relationOptions={{ entidad_id: entidades }}
              onCreated={(row) => {
                addExtra("analistas_entidades", row);
                setAdminForm((prev) => ({
                  ...prev,
                  analista_entidad_id: row.id,
                }));
              }}
            />
          </label>
          <select
            className="select w-full"
            value={adminForm.analista_entidad_id}
            disabled={!adminForm.entidad_id}
            onChange={(e) => {
              setAdminForm((prev) => ({
                ...prev,
                analista_entidad_id: e.target.value,
              }));
            }}
          >
            <option disabled={true} value={""}>
              Seleccione el analista de entidad
            </option>
            {adminForm.entidad_id != "" &&
              analistaEntidades.map(
                (analista) =>
                  analista.entidad_id == adminForm.entidad_id && (
                    <option value={analista.id} key={analista.id}>
                      {analista.nombre} {analista.apellido1}
                    </option>
                  ),
              )}
          </select>
        </fieldset>

        <fieldset className="fieldset border-base-content/40 rounded-box border p-4 gap-3">
          <legend className="fieldset-legend">Otros Datos</legend>

          <label className="label">Presupuesto</label>
          <input
            type="text"
            className="input w-full"
            placeholder="0000"
            value={adminForm.presupuesto}
            onChange={(e) => {
              setAdminForm((prev) => ({
                ...prev,
                presupuesto: e.target.value,
              }));
            }}
          />

          <label className="label">Avalúo</label>
          <input
            type="text"
            className="input w-full"
            placeholder="0000"
            value={adminForm.avaluo}
            onChange={(e) => {
              setAdminForm((prev) => ({
                ...prev,
                avaluo: e.target.value,
              }));
            }}
          />

          <label className="label">APC</label>
          <input
            type="text"
            className="input w-full"
            placeholder="0000"
            value={adminForm.apc}
            onChange={(e) => {
              setAdminForm((prev) => ({
                ...prev,
                apc: e.target.value,
              }));
            }}
          />

          <label className="label">CFIA</label>
          <input
            type="text"
            className="input w-full"
            placeholder="0000"
            value={adminForm.cfia}
            onChange={(e) => {
              setAdminForm((prev) => ({
                ...prev,
                cfia: e.target.value,
              }));
            }}
          />
        </fieldset>
      </div>
    </div>
  );
}
