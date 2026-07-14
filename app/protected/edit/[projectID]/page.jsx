import Form from "./Form";
import { getSessionUser } from "../../getSessionUser";
import isAdmin from "../../isAdmin";
import { redirect } from "next/navigation";

//Para manejar los formularios de los demás
export default async function Edit({ params }) {
  const { projectID } = await params;
  const currentUser = await getSessionUser();
  const endpoint = process.env.BACKEND_URL + `/projectData/${projectID}`;

  const formValuesEndpoint = process.env.BACKEND_URL + `/formValues`;
  // Antes app/etapas.js era un arreglo hardcodeado; ahora sale de la tabla
  // etapas (vía /generics, igual que tipos_bono/variantes_bono). Lo mismo
  // para tipos_propietario, que reemplaza el <select> hardcodeado de
  // Location.jsx.
  const etapasEndpoint = process.env.BACKEND_URL + `/generics/etapas`;
  const tiposPropietarioEndpoint =
    process.env.BACKEND_URL + `/generics/tipos_propietario`;
  // A quién se notifica al cambiar a cada etapa (ver lib/notificationRoles.js
  // en el backend), para mostrarlo junto al selector de etapas.
  const stageNotificationRolesEndpoint =
    process.env.BACKEND_URL + `/stageNotificationRoles`;

  // Los 5 fetch son independientes entre sí, así que se disparan en
  // paralelo en vez de esperar uno para empezar el otro.
  const [
    projectDataRes,
    formValuesRes,
    etapasRes,
    tiposPropietarioRes,
    stageNotificationRolesRes,
  ] = await Promise.all([
    fetch(endpoint),
    fetch(formValuesEndpoint),
    fetch(etapasEndpoint),
    fetch(tiposPropietarioEndpoint),
    fetch(stageNotificationRolesEndpoint),
  ]);

  const [result, formValues, etapas, tiposPropietario, stageNotificationRoles] =
    await Promise.all([
      projectDataRes.json(),
      formValuesRes.json(),
      etapasRes.json(),
      tiposPropietarioRes.json(),
      stageNotificationRolesRes.json(),
    ]);

  // Un analista/arquitecto/ingeniero (no-admin) solo puede editar los
  // proyectos donde aparece asignado como encargado; si entra directo por
  // URL a uno ajeno, se le devuelve a la búsqueda en vez de dejarlo ver o
  // tocar datos de un proyecto que no le corresponde. Los admins (Root,
  // Admin, y las variantes "* Admin" de cada rol, ver isAdmin.js) ven y
  // editan cualquier proyecto.
  const peopleData = result.peopleData || {};
  const isAssigned =
    String(peopleData.analista_id) === String(currentUser?.id) ||
    String(peopleData.arquitecto_id) === String(currentUser?.id) ||
    String(peopleData.ingeniero_id) === String(currentUser?.id);

  if (!isAdmin(currentUser?.rol_id) && !isAssigned) {
    redirect("/protected/search");
  }

  const data = {
    projectName: result.projectName.nombre,
    projectSlug: result.projectName.slug,
    basicsData: result.basicsData,
    familiesData: result.familiesData,
    locationsData: result.locationsData,
    adminsData: result.adminsData,
    peopleData: result.peopleData,
    stagesData: result.stagesData,
  };
  return (
    <>
      <Form
        data={data}
        basicFormValues={formValues.basicFormValues}
        adminFormValues={formValues.adminFormValues}
        peopleFormValues={formValues.peopleFormValues}
        locationFormValues={{ tiposPropietario }}
        etapas={etapas}
        stageNotificationRoles={stageNotificationRoles}
        projectID={projectID}
        currentUserId={currentUser?.id}
      ></Form>
    </>
  );
}
