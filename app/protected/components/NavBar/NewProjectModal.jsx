"use client";

import { useRef, useState } from "react";
import Form from "next/form";
import { newProjectAction } from "./newProjectAction";
import CreateProjectButton from "./CreateProjectButton";
import StatusModal from "../StatusModal";

// Antes el botón "Añadir" era un <label htmlFor="newProjectModal"> que
// cerraba el modal apenas se hacía click, sin importar si newProjectAction
// fallaba (ej. backend caído) — el usuario veía el modal cerrarse creyendo
// que el proyecto se había creado. Ahora solo se cierra si la acción hace
// redirect() (éxito); si falla, se queda abierto y muestra el error.
export default function NewProjectModal({ currentUserId }) {
  const checkboxRef = useRef(null);
  const [status, setStatus] = useState(null);

  return (
    <>
      <input
        type="checkbox"
        id="newProjectModal"
        ref={checkboxRef}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Nuevo Proyecto</h3>

          <Form
            className="flex flex-col gap-5 w-full"
            action={async (formData) => {
              const result = await newProjectAction(formData, currentUserId);
              // Si newProjectAction tiene éxito, hace redirect() y esta
              // línea nunca se alcanza (redirect corta la ejecución). Solo
              // se llega acá cuando devuelve {ok:false, message}.
              setStatus(result);
            }}
          >
            <fieldset className="fieldset mt-3">
              <label className="label">Nombre del Proyecto</label>
              <input
                type="text"
                className="input"
                placeholder="Proyecto Max Peralta"
                name="projectName"
                required
              />
            </fieldset>

            <div className="modal-action flex">
              <button
                type="button"
                className="btn flex-1"
                onClick={() => {
                  if (checkboxRef.current) checkboxRef.current.checked = false;
                }}
              >
                Cancelar
              </button>

              <div className="flex-1">
                <CreateProjectButton></CreateProjectButton>
              </div>
            </div>
          </Form>
        </div>
      </div>

      <StatusModal status={status} onClose={() => setStatus(null)} />
    </>
  );
}
