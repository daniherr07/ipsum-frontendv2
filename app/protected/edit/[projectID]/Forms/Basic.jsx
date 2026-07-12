"use client";

import { useState } from "react";
import QuickAddModal from "../QuickAddModal";

export default function Basic({ basicsForm, setBasicsForm, formValues }) {
  // Entradas creadas desde el botón "Añadir" de este mismo formulario, para
  // que aparezcan de inmediato en el <select> sin recargar toda la página.
  const [extraOptions, setExtraOptions] = useState({
    tipos_bono: [],
    variantes_bono: [],
    grupos_proyectos: [],
  });

  const addExtra = (table, row) => {
    setExtraOptions((prev) => ({
      ...prev,
      [table]: [...prev[table], row],
    }));
  };

  const bonos = [...(formValues?.bonos || []), ...extraOptions.tipos_bono];
  const varbonos = [
    ...(formValues?.varbonos || []),
    // basicFormValues() (el stored procedure) devuelve el campo del
    // subtipo como "bono_id"; el formulario de creación usa "tipo_bono_id"
    // (el nombre real de la columna). Se reconcilia acá para que el
    // filtrado por bono seleccionado siga funcionando igual.
    ...extraOptions.variantes_bono.map((row) => ({
      ...row,
      bono_id: row.tipo_bono_id,
    })),
  ];
  const grupos = [
    ...(formValues?.grupos || []),
    ...extraOptions.grupos_proyectos,
  ];

  return (
    <div className="card bg-base-200 w-full shadow-sm">
      <div className="card-body">
        <h2 className="card-title">Información Básica</h2>
        <fieldset className="fieldset">
          <legend className="fieldset-legend flex items-center gap-2">
            Tipo de Bono
            <QuickAddModal
              table="tipos_bono"
              onCreated={(row) => {
                addExtra("tipos_bono", row);
                setBasicsForm((prev) => ({
                  ...prev,
                  bono_id: row.id,
                  variante_bono_id: "",
                }));
              }}
            />
          </legend>
          <select
            value={basicsForm.bono_id}
            className="select w-full"
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
            {bonos.map((bono) => (
              <option value={bono.id} key={bono.id}>
                {bono.nombre}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend flex items-center gap-2">
            Variante de Bono
            <QuickAddModal
              table="variantes_bono"
              relationOptions={{ tipo_bono_id: bonos }}
              onCreated={(row) => {
                addExtra("variantes_bono", row);
                setBasicsForm((prev) => ({
                  ...prev,
                  variante_bono_id: row.id,
                }));
              }}
            />
          </legend>
          <select
            value={basicsForm.variante_bono_id}
            disabled={basicsForm.bono_id == ""}
            className="select w-full"
            onChange={(e) =>
              setBasicsForm((prev) => ({
                ...prev,
                variante_bono_id: e.target.value,
              }))
            }
          >
            {basicsForm.bono_id != "" &&
            varbonos.find((varbono) => varbono.bono_id == basicsForm.bono_id) ? (
              <option disabled={true} value={""}>
                Seleccione variante de bono
              </option>
            ) : (
              <option disabled={true} value={""}>
                Sin variante de bono
              </option>
            )}

            {basicsForm.bono_id != "" &&
              varbonos.map(
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
          <legend className="fieldset-legend flex items-center gap-2">
            Agrupación
            <QuickAddModal
              table="grupos_proyectos"
              onCreated={(row) => {
                addExtra("grupos_proyectos", row);
                setBasicsForm((prev) => ({
                  ...prev,
                  grupo_id: row.id,
                }));
              }}
            />
          </legend>
          <select
            value={basicsForm.grupo_id}
            className="select w-full"
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
            {grupos.map((grupo) => (
              <option key={grupo.id} value={grupo.id}>
                {grupo.nombre}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Descripción Corta</legend>
          <textarea
            className="textarea w-full"
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
              className="checkbox"
              checked={!!basicsForm.fis}
              onChange={(e) =>
                setBasicsForm((prev) => ({
                  ...prev,
                  fis: e.target.checked,
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
