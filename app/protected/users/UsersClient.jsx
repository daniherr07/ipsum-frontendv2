"use client";

import Form from "next/form";
import { Save } from "lucide-react";
import { updateAction } from "./updateAction";

export default function UsersClient({ usersData }) {
  console.log(usersData);

  return (
    <main className="flex p-1 flex-col gap-3 items-center">
      <h1 className="font-bold text-lg mt-3"> Gestión de Usuarios</h1>

      {usersData.usuarios &&
        usersData.usuarios.map((usuario) => (
          <details
            key={usuario.id}
            className="collapse bg-base-200 border border-base-300 collapse-arrow"
            name={usuario.id}
          >
            <summary className="collapse-title  font-semibold text-start">
              {usuario.nombre} {usuario.apellido1}
              {" - "}{" "}
              <span className="text-primary-content/70">
                {usersData.roles.find((rol) => rol.id == usuario.rol_id).nombre}
              </span>
            </summary>
            <div className="collapse-content text-sm">
              <Form action={updateAction}>
                <input type="hidden" name="id" defaultValue={usuario.id} />
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Nombre</legend>
                  <input
                    type="text"
                    defaultValue={usuario.nombre}
                    name="nombre"
                    className="input"
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Primer Apellido</legend>
                  <input
                    type="text"
                    defaultValue={usuario.apellido1}
                    name="apellido1"
                    className="input"
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Segundo Apellido</legend>
                  <input
                    type="text"
                    defaultValue={usuario.apellido2}
                    name="apellido2"
                    className="input"
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Correo Electrónico
                  </legend>
                  <input
                    type="text"
                    defaultValue={usuario.correo_electronico}
                    name="correo_electronico"
                    className="input"
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Rol</legend>
                  <select
                    defaultValue={usuario.rol_id}
                    name="rol_id"
                    className="select"
                  >
                    {usersData.roles.map((rol) => (
                      <option value={rol.id} key={rol.id}>
                        {rol.nombre}
                      </option>
                    ))}
                  </select>
                </fieldset>

                <button type="submit" className="btn btn-primary w-full mt-3"> Actualizar Datos </button>
              </Form>
            </div>
          </details>
        ))}
    </main>
  );
}
