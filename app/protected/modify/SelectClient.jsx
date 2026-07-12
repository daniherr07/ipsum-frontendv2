"use client";

import { modifyData } from "../../const";
import { useEffect, useState } from "react";
import getGenericsData from "./getGenericsData";
import Form from "next/form";
import { updateGenerics } from "./updateGeneric";
import { insertGenerics } from "./insertGeneric";
import StatusModal from "../components/StatusModal";
import SubmitButton from "../components/SubmitButton";

import { useTransition } from "react";

// slug -> table por defecto, para cuando no llega ?type= en la URL (ej. al
// entrar directo a /protected/modify).
const DEFAULT_TABLE = "analistas_entidades";

export default function SelectClient({ type }) {
  // El <select> de arriba usaba siempre "analistas_entidades" al montar:
  // el "type" que llega por la URL (?type=slug, seteado por el submenú de
  // "Modificar" en el navbar) nunca se leía.
  const [table, setTable] = useState(
    () => modifyData.find((item) => item.slug === type)?.table || DEFAULT_TABLE,
  );

  // Navegar de un link del submenú a otro (sin remontar el componente) no
  // dispara el inicializador de useState de arriba. Este es el patrón que
  // React recomienda para "ajustar estado cuando cambia un prop": comparar
  // durante el render y llamar setState ahí mismo, en vez de en un efecto
  // aparte (evita un ciclo extra de render).
  const [lastType, setLastType] = useState(type);
  if (type !== lastType) {
    setLastType(type);
    const matched = modifyData.find((item) => item.slug === type);
    if (matched) {
      setTable(matched.table);
    }
  }

  const [genericData, setGenericData] = useState();
  const [loading, setLoading] = useState();
  const [reload, setReload] = useState(true);

  const [entidades, setEntidades] = useState();
  const [bonos, setBonos] = useState();

  // Las opciones de "entidades" y "tipos_bono" alimentan los <select> de
  // relación y no cambian según la tabla elegida, así que se cargan una sola
  // vez al montar en vez de volver a pedirlas cada vez que se cambia de tabla
  // o se recarga la lista tras crear/actualizar un registro.
  useEffect(() => {
    const getRelationOptions = async () => {
      const [entidadesResponse, bonosResponse] = await Promise.all([
        getGenericsData("entidades"),
        getGenericsData("tipos_bono"),
      ]);

      setEntidades(entidadesResponse);
      setBonos(bonosResponse);
    };

    getRelationOptions();
  }, []);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const response = await getGenericsData(table);
      setGenericData(response);
      setLoading(false);
    };

    getData();
  }, [table, reload]);

  return (
    <>
      <select
        className="select w-full"
        value={table}
        onChange={(e) => {
          setTable(e.target.value);
          setReload(!reload);
        }}
      >
        <option disabled value="">
          Seleccione una opción
        </option>

        {modifyData.map((item) => (
          <option key={item.slug} value={item.table}>
            {item.label}
          </option>
        ))}
      </select>

      <GenericUpdate
        genericData={genericData}
        entidades={entidades}
        bonos={bonos}
        loading={loading}
        localTable={table}
        reload={reload}
        setReload={setReload}
      ></GenericUpdate>
    </>
  );
}

function GenericUpdate({ genericData, loading, localTable, entidades, bonos, reload, setReload }) {
  const [, startTransition] = useTransition();
  // Controla si se muestra el formulario de creación arriba del listado.
  const [creating, setCreating] = useState(false);
  const [status, setStatus] = useState(null);

  const tableSchema = modifyData.find((entry) => entry.table == localTable);

  return (
    <div className="flex justify-center mt-3">
      {loading ? (
        <span className="loading loading-dots loading-xl"></span>
      ) : (
        <div className="flex flex-col gap-3 w-full">
          <button
            type="button"
            className="btn btn-primary w-full"
            onClick={() => setCreating((prev) => !prev)}
          >
            {creating ? "Cancelar" : "Añadir"}
          </button>

          {creating && (
            <Form
              className="collapse-content text-sm flex flex-col gap-3 bg-base-200 border border-base-300 rounded-box w-full p-4"
              action={async (formData) => {
                const result = await insertGenerics(formData);
                setStatus(result);

                if (result.ok) {
                  setCreating(false);
                  startTransition(() => {
                    setReload(!reload);
                  });
                }
              }}
            >
              <input type="hidden" name="table" value={localTable} />
              {/* El registro aún no tiene id, así que se omite el campo oculto de id */}
              {tableSchema.entries
                .filter((entry) => entry.type != "hidden")
                .map((entry, index) => (
                  <div key={index}>
                    <GenericFieldset
                      entry={entry}
                      data={{}}
                      entidades={entidades}
                      bonos={bonos}
                      localTable={localTable}
                    />
                  </div>
                ))}
              <SubmitButton pendingLabel="Creando...">Crear</SubmitButton>
            </Form>
          )}

          {genericData &&
            genericData.map((data) => (
              <details
                className="collapse collapse-arrow bg-base-200 border border-base-300 shadow-lg relative z-1 w-full"
                name="my-accordion-det-1"
                key={data.id}
              >
                <summary className="collapse-title font-semibold">
                  {data.nombre} {data?.apellido1 || ""}
                </summary>
                <Form
                  className="collapse-content text-sm flex flex-col gap-3"
                  action={async (formData) => {
                    const result = await updateGenerics(formData);
                    setStatus(result);

                    if (result.ok) {
                      startTransition(() => {
                        setReload(!reload);
                      });
                    }
                  }}
                >
                  <input type="hidden" name="table" value={localTable} />
                  {tableSchema.entries.map((entry, index) => (
                    <div key={index}>
                      <GenericFieldset
                        entry={entry}
                        data={data}
                        entidades={entidades}
                        bonos={bonos}
                        localTable={localTable}
                      />
                    </div>
                  ))}
                  <SubmitButton
                    pendingLabel="Actualizando..."
                    className="btn btn-primary w-full mt-3"
                  >
                    Actualizar Datos
                  </SubmitButton>
                </Form>
              </details>
            ))}
        </div>
      )}

      <StatusModal status={status} onClose={() => setStatus(null)} />
    </div>
  );
}

// Un campo de un formulario genérico (crear o editar). `data` trae valores
// existentes al editar, o un objeto vacío al crear un registro nuevo.
function GenericFieldset({ entry, data, entidades, bonos, localTable }) {
  if (entry.type == "hidden") {
    return <input type="hidden" name="id" value={data[entry.value]} />;
  }

  const lingered = modifyData.find((item) => item.table == localTable).lingered;

  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
      <legend className="fieldset-legend">{entry.label}</legend>

      {entry.type == "select" ? (
        <select
          defaultValue={data[entry.value] ?? ""}
          className="select"
          name={entry.value}
        >
          <option disabled value="">
            Seleccione una opción
          </option>
          {lingered == "entidades" &&
            entidades &&
            entidades.map((entidad) => (
              <option value={entidad.id} key={entidad.id}>
                {entidad.nombre}
              </option>
            ))}

          {lingered == "tipos_bono" &&
            bonos &&
            bonos.map((bono) => (
              <option value={bono.id} key={bono.id}>
                {bono.nombre}
              </option>
            ))}
        </select>
      ) : (
        <input
          type={entry.type}
          name={entry.value}
          defaultValue={data[entry.value]}
          className="input"
          placeholder={entry.label}
        />
      )}
    </fieldset>
  );
}
