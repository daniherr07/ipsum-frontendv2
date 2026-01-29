"use client";

export default function Administrative({
  adminForm,
  setAdminForm,
  formValues,
}) {
  console.log(adminForm)
  return (
    <div className="card bg-base-200 w-full shadow-sm">
      <div className="card-body">
        <h2 className="card-title">Datos Administrativos</h2>

        <fieldset className="fieldset border-base-content/40 rounded-box border p-4 gap-3">
          <legend className="fieldset-legend">Entidad</legend>

          <label className="label">Entidad</label>
          <select
            className="select"
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
            {formValues &&
              formValues.entidades.map((entidad) => (
                <option value={entidad.id} key={entidad.id}>
                  {entidad.nombre}
                </option>
              ))}
          </select>

          <label className="label">Centro de Negocios</label>
          <select
            className="select"
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
            {formValues &&
              adminForm.entidad_id != "" &&
              formValues.centros_negocio.map(
                (centro) =>
                  centro.entidad_id == adminForm.entidad_id && (
                    <option value={centro.id} key={centro.id}>
                      {centro.nombre}
                    </option>
                  ),
              )}
          </select>

          <label className="label">Analista de Entidad</label>
          <select
            className="select"
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
            {formValues &&
              adminForm.entidad_id != "" &&
              formValues.analista_entidades.map(
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
            className="input join-item"
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
            className="input join-item"
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
            className="input join-item"
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
            className="input join-item"
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
