"use client";
import { useState } from "react";
import { stageAction } from "./stageAction";
import { useRouter } from "next/navigation";
import StatusModal from "../../../components/StatusModal";

export default function ChangeStage({
  projectID,
  currentEtapaId,
  etapas,
  stageNotificationRoles,
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

  const pendingRoles = pendingEtapa
    ? stageNotificationRoles?.[pendingEtapa.id] || []
    : [];

  const handleConfirm = async () => {
    setConfirming(true);
    const result = await stageAction(projectID, pendingEtapa.id);
    setConfirming(false);
    setPendingEtapa(null);

    if (result.ok) {
      router.refresh();
    } else {
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
                onClick={() => setPendingEtapa(etapa)}
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
