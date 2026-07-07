"use client";
import { etapas } from "../../../../etapas";
import { stageAction } from "./stageAction";
import { useRouter } from "next/navigation";

export default function ChangeStage({ projectID, currentEtapaId }) {
  const router = useRouter();


  return (
    <div className="card bg-base-200 w-full shadow-sm">
      <div className="card-body">
        <h2 className="card-title">Progreso del Proyecto</h2>
        <h2 className="text-md">Haz click para pasar a la etapa respectiva</h2>

        <ul className="steps steps-vertical">
          {etapas.map((etapa) => (
            <li
              onClick={async () => {
                await stageAction(projectID, etapa.id);
                router.refresh()
              }}
              className={`step ${etapa.id <= currentEtapaId && "step-primary"} text-left`}
              key={etapa.id}
            >
              {etapa.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
