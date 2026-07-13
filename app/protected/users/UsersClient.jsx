"use client";

import { useState } from "react";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { updateAction } from "./updateAction";
import { insertAction } from "./insertAction";
import { deleteAction } from "./deleteAction";
import StatusModal from "../components/StatusModal";
import SubmitButton from "../components/SubmitButton";

export default function UsersClient({ usersData }) {
  const router = useRouter();
  // Controla si se muestra el formulario de creación de usuario debajo del botón.
  const [creating, setCreating] = useState(false);
  const [status, setStatus] = useState(null);
  // Usuario que se está por eliminar (o null si el modal de confirmación no
  // está abierto). Se guarda el usuario completo, no solo el id, para poder
  // mostrar su nombre en la pregunta de confirmación.
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    const result = await deleteAction(deletingUser.id);
    setDeleting(false);
    setStatus(result);
    if (result.ok) {
      setDeletingUser(null);
      router.refresh();
    }
  };

  return (
    <main className="flex p-1 flex-col gap-3 items-center w-full max-w-2xl mx-auto">
      <h1 className="font-bold text-lg mt-3"> Gestión de Usuarios</h1>

      <button
        type="button"
        className="btn btn-primary w-full"
        onClick={() => setCreating((prev) => !prev)}
      >
        {creating ? "Cancelar" : "Añadir Usuario"}
      </button>

      {creating && (
        <Form
          className="w-full flex flex-col gap-3 bg-base-200 border border-base-300 rounded-box p-4"
          action={async (formData) => {
            const result = await insertAction(formData);
            setStatus(result);
            if (result.ok) {
              setCreating(false);
              // router.refresh() vuelve a pedir los datos del servidor (la
              // lista de usuarios) sin recargar toda la página en el navegador.
              router.refresh();
            }
          }}
        >
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Nombre</legend>
            <input type="text" name="nombre" className="input w-full" required />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Primer Apellido</legend>
            <input type="text" name="apellido1" className="input w-full" required />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Segundo Apellido</legend>
            <input type="text" name="apellido2" className="input w-full" />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Correo Electrónico</legend>
            <input
              type="email"
              name="correo_electronico"
              className="input w-full"
              required
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Rol</legend>
            <select name="rol_id" className="select w-full" defaultValue="">
              <option disabled value="">
                Seleccione un rol
              </option>
              {usersData.roles.map((rol) => (
                <option value={rol.id} key={rol.id}>
                  {rol.nombre}
                </option>
              ))}
            </select>
          </fieldset>

          <p className="text-xs opacity-60">
            El usuario se crea con la contraseña genérica de la empresa; la
            cambia por su cuenta al iniciar sesión por primera vez.
          </p>

          <SubmitButton pendingLabel="Creando...">Crear Usuario</SubmitButton>
        </Form>
      )}

      {usersData.usuarios &&
        usersData.usuarios
          // "Eliminar" es un borrado lógico (activated = 0, ver
          // routes/deleteUser): un usuario eliminado simplemente deja de
          // listarse acá, sin perder su historial en proyectos pasados.
          .filter((usuario) => usuario.activated != 0)
          .map((usuario) => (
          <details
            key={usuario.id}
            className="collapse bg-base-200 border border-base-300 collapse-arrow"
          >
            <summary className="collapse-title  font-semibold text-start">
              {usuario.nombre} {usuario.apellido1}
              {" - "}{" "}
              <span className="text-primary-content/70">
                {usersData.roles.find((rol) => rol.id == usuario.rol_id).nombre}
              </span>
            </summary>
            <div className="collapse-content text-sm">
              <Form action={async (formData) => {
                const result = await updateAction(formData)
                setStatus(result);
                if (result.ok) {
                  router.refresh();
                }
              }}>
                <input type="hidden" name="id" defaultValue={usuario.id} />
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Nombre</legend>
                  <input
                    type="text"
                    defaultValue={usuario.nombre}
                    name="nombre"
                    className="input w-full"
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Primer Apellido</legend>
                  <input
                    type="text"
                    defaultValue={usuario.apellido1}
                    name="apellido1"
                    className="input w-full"
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Segundo Apellido</legend>
                  <input
                    type="text"
                    defaultValue={usuario.apellido2}
                    name="apellido2"
                    className="input w-full"
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
                    className="input w-full"
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Rol</legend>
                  <select
                    defaultValue={usuario.rol_id}
                    name="rol_id"
                    className="select w-full"
                  >
                    {usersData.roles.map((rol) => (
                      <option value={rol.id} key={rol.id}>
                        {rol.nombre}
                      </option>
                    ))}
                  </select>
                </fieldset>

                <div className="flex gap-2 mt-3">
                  <SubmitButton
                    pendingLabel="Actualizando..."
                    className="btn btn-primary flex-1"
                  >
                    Actualizar Datos
                  </SubmitButton>

                  <button
                    type="button"
                    className="btn btn-error btn-square"
                    aria-label="Eliminar usuario"
                    onClick={() => setDeletingUser(usuario)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </Form>
            </div>
          </details>
        ))}

      {deletingUser && (
        <div className="modal modal-open" role="dialog">
          <div className="modal-box">
            <h3 className="text-lg font-bold">
              ¿Eliminar a {deletingUser.nombre} {deletingUser.apellido1}?
            </h3>
            <p className="py-4">
              Ya no podrá iniciar sesión ni aparecer como encargado en
              proyectos nuevos. Esta acción se puede revertir solo desde la
              base de datos.
            </p>
            <div className="modal-action flex *:flex-1">
              <button
                type="button"
                className="btn"
                disabled={deleting}
                onClick={() => setDeletingUser(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-error"
                disabled={deleting}
                onClick={handleDelete}
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <StatusModal status={status} onClose={() => setStatus(null)} />
    </main>
  );
}
