"use client";
import { useState } from "react";
import { stageAction } from "./stageAction";
import { useRouter } from "next/navigation";
import StatusModal from "../../../components/StatusModal";

export default function ChangeStage({ projectID, currentEtapaId, etapas }) {
  const router = useRouter();
  // Solo se usa para mostrar el modal cuando el cambio de etapa falla; si
  // sale bien no se muestra nada, porque el usuario suele ir dando clic por
  // varias etapas seguidas y un modal en cada clic sería molesto.
  const [status, setStatus] = useState(null);

  return (
    <div className="card bg-base-200 w-full shadow-sm">
      <div className="card-body">
        <h2 className="card-title">Progreso del Proyecto</h2>
        <h2 className="text-md">Haz click para pasar a la etapa respectiva</h2>

        <ul className="steps steps-vertical">
          {etapas.map((etapa) => (
            <li
              onClick={async () => {
                const result = await stageAction(projectID, etapa.id);
                if (result.ok) {
                  router.refresh();
                } else {
                  setStatus(result);
                }
              }}
              className={`step ${etapa.id <= currentEtapaId && "step-primary"} text-left`}
              key={etapa.id}
            >
              {etapa.nombre}
            </li>
          ))}
        </ul>
      </div>

      <StatusModal status={status} onClose={() => setStatus(null)} />
    </div>
  );
}
