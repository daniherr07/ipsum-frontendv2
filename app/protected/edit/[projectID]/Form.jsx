"use client";

import Pagination from "./Pagination/Pagination";
import { Save } from "lucide-react";

import Basic from "./Forms/Basic";
import Family from "./Forms/Family";
import Location from "./Forms/Location";
import Administrative from "./Forms/Administrative";
import People from "./Forms/People";
import ChangeStage from "./ChangeStage/ChangeStage";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveInfo } from "./SaveActions/saveInfo";
import StatusModal from "../../components/StatusModal";

export default function Form({
  data,
  basicFormValues,
  adminFormValues,
  peopleFormValues,
  locationFormValues,
  etapas,
  projectID,
  currentUserId,
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const [basicsForm, setBasicsForm] = useState(data.basicsData);
  const [familyForm, setFamilyForm] = useState(data.familiesData);
  const [locationForm, setLocationForm] = useState(data.locationsData);
  const [adminForm, setAdminForm] = useState(data.adminsData);
  const [peopleForm, setPeopleForm] = useState(data.peopleData);

  const projectSlug = data.projectSlug;

  // El intervalo de autoguardado se crea una sola vez (deps: []), así que si
  // leyera basicsForm/locationForm/adminForm/peopleForm directamente quedaría
  // atado para siempre a los valores del primer render (closure obsoleta) y
  // cada 30s volvería a guardar los datos originales, pisando lo que el
  // usuario haya escrito después. Este ref siempre apunta a los valores más
  // recientes sin necesidad de recrear el intervalo en cada tecla.
  const latestForms = useRef({
    basicsForm,
    locationForm,
    adminForm,
    peopleForm,
  });

  useEffect(() => {
    latestForms.current = { basicsForm, locationForm, adminForm, peopleForm };
  }, [basicsForm, locationForm, adminForm, peopleForm]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const latest = latestForms.current;
      const result = await saveInfo(
        latest.basicsForm,
        latest.locationForm,
        latest.adminForm,
        latest.peopleForm,
        projectID,
      );
      // El autoguardado es silencioso cuando sale bien (mostrar un modal
      // cada 30s interrumpiría al usuario mientras escribe); solo se avisa
      // si falla, para que no se pierda trabajo sin que nadie se entere.
      if (!result.ok) {
        setStatus(result);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [projectID]);

  return (
    <main className="w-full h-full flex flex-col items-center p-3 gap-3">
      <h1>{data.projectName}</h1>

      {/* max-w-3xl: en monitores anchos evita que el editor se estire a todo
          el ancho de la pantalla; en móvil w-full sigue ocupando todo el espacio */}
      <div className="w-full max-w-3xl flex flex-col items-center gap-3">
        <Pagination
          current={current}
          setCurrent={setCurrent}
          projectID={projectID}
        ></Pagination>

        {current == 0 && (
          <Basic
            basicsForm={basicsForm}
            setBasicsForm={setBasicsForm}
            formValues={basicFormValues}
          ></Basic>
        )}
        {current == 1 && (
          <Family
            familyForm={familyForm}
            setFamilyForm={setFamilyForm}
            projectSlug={projectSlug}
            projectID={projectID}
          ></Family>
        )}
        {current == 2 && (
          <Location
            projectID={projectID}
            projectSlug={projectSlug}
            locationForm={locationForm}
            setLocationForm={setLocationForm}
            formValues={locationFormValues}
          ></Location>
        )}
        {current == 3 && (
          <Administrative
            adminForm={adminForm}
            setAdminForm={setAdminForm}
            formValues={adminFormValues}
          ></Administrative>
        )}
        {current == 4 && (
          <People
            peopleForm={peopleForm}
            setPeopleForm={setPeopleForm}
            formValues={peopleFormValues}
            projectID={projectID}
            currentUserId={currentUserId}
          ></People>
        )}

        {current == 5 && (
          <ChangeStage
            projectID={projectID}
            currentEtapaId={data.stagesData.etapa_id}
            etapas={etapas}
          />
        )}
      </div>

      <button
        className="btn btn-success fixed bottom-5 right-5 z-10"
        disabled={saving}
        onClick={async () => {
          setSaving(true);
          const result = await saveInfo(
            basicsForm,
            locationForm,
            adminForm,
            peopleForm,
            projectID,
          );
          setSaving(false);
          setStatus(result);
          if (result.ok) {
            router.refresh();
          }
        }}
      >
        {saving ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : (
          <Save size={30}></Save>
        )}
      </button>

      <StatusModal status={status} onClose={() => setStatus(null)} />
    </main>
  );
}
