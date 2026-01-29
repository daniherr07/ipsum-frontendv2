"use client";
export default function Basic({ basicsForm, setBasicsForm, formValues }) {
  return (
    <div className="card bg-base-200 w-full shadow-sm">
      <div className="card-body">
        <h2 className="card-title">Información Básica</h2>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Tipo de Bono</legend>
          <select
            value={basicsForm.bono_id}
            className="select"
            onChange={(e) =>
              setBasicsForm((prev) => ({
                ...prev,
                bono_id: e.target.value,
                variante_bono_id: "",
              }))
            }
          >
            <option disabled={true} value={""}>
              Seleccione tipo de bono
            </option>
            {formValues &&
              formValues.bonos.map((bono) => (
                <option value={bono.id} key={bono.id}>
                  {bono.nombre}
                </option>
              ))}
          </select>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Variante de Bono</legend>
          <select
            value={basicsForm.variante_bono_id}
            disabled={basicsForm.bono_id == ""}
            className="select"
            onChange={(e) =>
              setBasicsForm((prev) => ({
                ...prev,
                variante_bono_id: e.target.value,
              }))
            }
          >
            {formValues &&
            basicsForm.bono_id != "" &&
            formValues.varbonos.find(
              (varbono) => varbono.bono_id == basicsForm.bono_id,
            ) ? (
              <option disabled={true} value={""}>
                Seleccione variante de bono
              </option>
            ) : (
              <option disabled={true} value={""}>
                Sin variante de bono
              </option>
            )}

            {formValues &&
              basicsForm.bono_id != "" &&
              formValues.varbonos.map(
                (varbono) =>
                  varbono.bono_id == basicsForm.bono_id && (
                    <option value={varbono.id} key={varbono.id}>
                      {varbono.nombre}
                    </option>
                  ),
              )}
          </select>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Agrupación</legend>
          <select
            value={basicsForm.grupo_id}
            className="select"
            onChange={(e) =>
              setBasicsForm((prev) => ({
                ...prev,
                grupo_id: e.target.value,
              }))
            }
          >
            <option disabled={true} value={""}>
              Seleccione un tipo de agrupación
            </option>
            <option>Sin agrupar</option>
            {formValues &&
              formValues.grupos.map((grupo) => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.nombre}
                </option>
              ))}
          </select>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Descripción Corta</legend>
          <textarea
            className="textarea"
            placeholder="..."
            value={basicsForm.descripcion}
            onChange={(e) =>
              setBasicsForm((prev) => ({
                ...prev,
                descripcion: e.target.value,
              }))
            }
          ></textarea>
        </fieldset>

        <fieldset className="fieldset">
          <label className="label">
            <input
              type="checkbox"
              defaultChecked
              className="checkbox"
              value={basicsForm.fis}
              onChange={(e) =>
                setBasicsForm((prev) => ({
                  ...prev,
                  fis: e.target.value,
                }))
              }
            />
            <p className="font-bold text-base-content">Tiene FIS</p>
          </label>
        </fieldset>
      </div>
    </div>
  );
}
