"use client";
import { useState } from "react";
import { stageAction } from "./stageAction";
import { addBitacora } from "../../../search/addBitacora";
import { useRouter } from "next/navigation";
import StatusModal from "../../../components/StatusModal";

export default function ChangeStage({
  projectID,
  currentEtapaId,
  etapas,
  stageNotificationRoles,
  currentUserId,
}) {
  const router = useRouter();
  // Solo se usa para mostrar el modal cuando el cambio de etapa falla; si
  // sale bien no se muestra nada, porque el usuario suele ir dando clic por
  // varias etapas seguidas y un modal en cada clic sería molesto.
  const [status, setStatus] = useState(null);
  // Etapa que el usuario clickeó y todavía no confirma (o null si el modal
  // de confirmación está cerrado). Antes el clic cambiaba la etapa de una,
  // sin avisar a quién se le iba a notificar ni dar chance de arrepentirse.
  const [pendingEtapa, setPendingEtapa] = useState(null);
  const [confirming, setConfirming] = useState(false);
  // Nota opcional que se agrega a la bitácora junto con el cambio de etapa
  // (mismo formulario que "Añadir entrada" en la búsqueda).
  const [noteDescripcion, setNoteDescripcion] = useState("");
  const [noteTipo, setNoteTipo] = useState("Análisis");

  const pendingRoles = pendingEtapa
    ? stageNotificationRoles?.[pendingEtapa.id] || []
    : [];

  const openConfirm = (etapa) => {
    setPendingEtapa(etapa);
    setNoteDescripcion("");
    setNoteTipo("Análisis");
  };

  const handleConfirm = async () => {
    setConfirming(true);
    const result = await stageAction(projectID, pendingEtapa.id, currentUserId);

    if (result.ok) {
      // El mensaje predeterminado siempre queda registrado; si el usuario
      // escribió algo en el formulario, se agrega debajo del mismo.
      const defaultMessage = `El proyecto cambió a la etapa "${pendingEtapa.nombre}".`;
      const descripcion = noteDescripcion.trim()
        ? `${defaultMessage}\n\n${noteDescripcion.trim()}`
        : defaultMessage;

      const bitacoraFormData = new FormData();
      bitacoraFormData.set("proyecto_id", projectID);
      bitacoraFormData.set("usuario_id", currentUserId);
      bitacoraFormData.set("tipo", noteTipo);
      bitacoraFormData.set(
        "fecha_ingreso",
        new Intl.DateTimeFormat("sv-SE", {
          timeZone: "America/Costa_Rica",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date()),
      );
      bitacoraFormData.set("descripcion", descripcion);

      const noteResult = await addBitacora(bitacoraFormData);

      setConfirming(false);
      setPendingEtapa(null);
      router.refresh();

      if (!noteResult.ok) {
        setStatus({
          ok: false,
          message:
            "La etapa se cambió, pero no se pudo agregar la nota a la bitácora",
        });
      }
    } else {
      setConfirming(false);
      setPendingEtapa(null);
      setStatus(result);
    }
  };

  return (
    <div className="card bg-base-200 w-full shadow-sm">
      <div className="card-body">
        <h2 className="card-title">Progreso del Proyecto</h2>
        <h2 className="text-md">Haz click para pasar a la etapa respectiva</h2>

        <ul className="steps steps-vertical">
          {etapas.map((etapa) => {
            const notifiedRoles = stageNotificationRoles?.[etapa.id] || [];

            return (
              <li
                onClick={() => openConfirm(etapa)}
                className={`step ${etapa.id <= currentEtapaId && "step-primary"} text-left cursor-pointer`}
                key={etapa.id}
              >
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <span>{etapa.nombre}</span>
                  {notifiedRoles.length > 0 && (
                    <span className="text-xs opacity-60">
                      (Se notifica a: {notifiedRoles.join(", ")})
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {pendingEtapa && (
        <div className="modal modal-open" role="dialog">
          <div className="modal-box">
            <h3 className="text-lg font-bold">
              ¿Cambiar a la etapa &quot;{pendingEtapa.nombre}&quot;?
            </h3>

            <p className="py-4">
              {pendingRoles.length > 0 ? (
                <>
                  Se notificará por correo y campanita a: <b>{pendingRoles.join(", ")}</b>.
                </>
              ) : (
                "No hay roles configurados para notificar en esta etapa."
              )}
            </p>

            <p className="text-xs opacity-60 -mt-2 pb-2">
              Se agregará una entrada a la bitácora avisando el cambio de
              etapa; si quieres, agrega más detalle abajo.
            </p>

            <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-full border p-4">
              <legend className="fieldset-legend">Descripción</legend>
              <textarea
                className="textarea w-full"
                value={noteDescripcion}
                onChange={(e) => setNoteDescripcion(e.target.value)}
                disabled={confirming}
              ></textarea>
            </fieldset>

            <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-full border p-4">
              <legend className="fieldset-legend">Tipo</legend>
              <select
                className="select"
                value={noteTipo}
                onChange={(e) => setNoteTipo(e.target.value)}
                disabled={confirming}
              >
                <option value="Análisis">Análisis</option>
                <option value="Técnico">Técnico</option>
              </select>
            </fieldset>

            <div className="modal-action flex *:flex-1">
              <button
                type="button"
                className="btn"
                onClick={() => setPendingEtapa(null)}
                disabled={confirming}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirm}
                disabled={confirming}
              >
                {confirming ? "Cambiando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <StatusModal status={status} onClose={() => setStatus(null)} />
    </div>
  );
}
