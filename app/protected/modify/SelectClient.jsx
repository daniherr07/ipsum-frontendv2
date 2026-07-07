"use client";

import { modifyData } from "../../const";
import { useEffect, useState } from "react";
import getGenericsData from "./getGenericsData";
import Form from "next/form";
import { updateGenerics } from "./updateGeneric";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function SelectClient() {
  const [table, setTable] = useState("analistas_entidades");
  const [genericData, setGenericData] = useState();
  const [loading, setLoading] = useState();
  const [reload, setReload] = useState(true);

  const [entidades, setEntidades] = useState();
  const [bonos, setBonos] = useState();

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const response = await getGenericsData(table);
      setGenericData(response);

      const entidadesResponse = await getGenericsData("entidades");
      setEntidades(entidadesResponse);

      const bonosResponse = await getGenericsData("tipos_bono");
      setBonos(bonosResponse);
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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <div className="flex mt-3">
      {loading ? (
        <span className="loading loading-dots loading-xl relative left-[50%] mt-3 self-center flex"></span>
      ) : (
        <div className="flex flex-col gap-3 w-full">
          <button className="btn btn-primary w-full">Añadir</button>
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
                    await updateGenerics(formData);

                    startTransition(() => {
                      setReload(!reload);
                    });
                  }}
                >
                  <input type="hidden" name="table" value={localTable} />
                  {modifyData
                    .find((entry) => entry.table == localTable)
                    .entries.map((entry, index) => (
                      <div key={index}>
                        {entry.type == "hidden" ? (
                          <input
                            type="hidden"
                            name="id"
                            value={data[entry.value]}
                          />
                        ) : (
                          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
                            <legend className="fieldset-legend">
                              {entry.label}
                            </legend>

                            {entry.type == "select" ? (
                              <select
                                defaultValue={data[entry.value]}
                                className="select"
                                name={entry.value}
                              >
                                <>
                                  {modifyData.find(
                                    (entry) => entry.table == localTable,
                                  ).lingered == "entidades" &&
                                    entidades &&
                                    entidades.map((entidad) => (
                                      <option
                                        value={entidad.id}
                                        key={entidad.id}
                                      >
                                        {entidad.nombre}
                                      </option>
                                    ))}

                                  {modifyData.find(
                                    (entry) => entry.table == localTable,
                                  ).lingered == "tipos_bono" &&
                                    bonos &&
                                    bonos.map((bono) => (
                                      <option value={bono.id} key={bono.id}>
                                        {bono.nombre}
                                      </option>
                                    ))}
                                </>
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
                        )}
                      </div>
                    ))}
                  <button type="submit" className="btn btn-primary w-full mt-3">
                    Actualizar Datos
                  </button>
                </Form>
              </details>
            ))}
        </div>
      )}
    </div>
  );
}
