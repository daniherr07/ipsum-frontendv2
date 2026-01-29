"use client";

export default function People({ peopleForm, setPeopleForm, formValues }) {
  console.log(peopleForm);
  console.log(formValues);
  return (
    <div className="card bg-base-200 w-full shadow-sm">
      <div className="card-body">
        <h2 className="card-title">Encargados del proyecto</h2>

        <fieldset className="fieldset gap-3">
          <label className="label">Constructor</label>
          <select
            value={peopleForm.constructor_id}
            onChange={(e) => {
              setPeopleForm((prev) => ({
                ...prev,
                constructor_id: e.target.value,
              }));
            }}
            className="select"
          >
            <option disabled={true} value={""}>
              Seleccione el constructor
            </option>
            {formValues &&
              formValues.constructores.map((constructor) => (
                <option
                  value={constructor.id}
                  key={constructor.id}
                >
                  {constructor.nombre} {constructor.apellido1}
                </option>
              ))}
          </select>

          <label className="label">Arquitecto</label>
          <select
            value={peopleForm.arquitecto_id}
            onChange={(e) => {
              setPeopleForm((prev) => ({
                ...prev,
                arquitecto_id: e.target.value,
              }));
            }}
            className="select"
          >
            <option value={""}>
              Seleccione el arquitecto
            </option>
            {formValues &&
              formValues.arquitectos.map((arquitecto) => (
                <option
                  value={arquitecto.id}
                  key={arquitecto.id}
                >
                  {arquitecto.nombre} {arquitecto.apellido1}
                </option>
              ))}
          </select>

          <label className="label">Promotor Ipsum</label>
          <select
            value={peopleForm.promotor_id}
            onChange={(e) => {
              setPeopleForm((prev) => ({
                ...prev,
                promotor_id: e.target.value,
              }));
            }}
            className="select"
          >
            <option disabled={true} value={""}>
              Seleccione el promotor
            </option>
            {formValues &&
              formValues.promotores.map((promotor) => (
                <option value={promotor.id} key={promotor.id}>
                  {promotor.nombre} {promotor.apellido1}
                </option>
              ))}
          </select>

          <label className="label">Analista Ipsum</label>
          <select
            value={peopleForm.analista_id}
            onChange={(e) => {
              setPeopleForm((prev) => ({
                ...prev,
                analista_id: e.target.value,
              }));
            }}
            className="select"
          >
            <option disabled={true} value={""}>
              Seleccione el analista
            </option>
            {formValues &&
              formValues.analistas.map((analista) => (
                <option value={analista.id} key={analista.id}>
                  {analista.nombre} {analista.apellido1}
                </option>
              ))}
          </select>

          <label className="label">Ingeniero</label>
          <select
            value={peopleForm.ingeniero_id}
            onChange={(e) => {
              setPeopleForm((prev) => ({
                ...prev,
                ingeniero_id: e.target.value,
              }));
            }}
            className="select"
          >
            <option disabled={true} value={""}>
              Seleccione el ingeniero
            </option>
            {formValues &&
              formValues.ingenieros.map((ingeniero) => (
                <option value={ingeniero.id} key={ingeniero.id}>
                  {ingeniero.nombre} {ingeniero.apellido1}
                </option>
              ))}
          </select>

          <label className="label">Fiscal</label>
          <select
            value={peopleForm.fiscal_id}
            onChange={(e) => {
              setPeopleForm((prev) => ({
                ...prev,
                fiscal_id: e.target.value,
              }));
            }}
            className="select"
          >
            <option disabled={true} value={""}>
              Seleccione el fiscal
            </option>
            {formValues &&
              formValues.fiscales.map((fiscal) => (
                <option value={fiscal.id} key={fiscal.id}>
                  {fiscal.nombre} {fiscal.apellido1}
                </option>
              ))}
          </select>
        </fieldset>
      </div>
    </div>
  );
}
