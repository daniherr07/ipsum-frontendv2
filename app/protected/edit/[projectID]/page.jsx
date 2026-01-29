import Form from "./Form";

//Para manejar los formularios de los demás
export default async function Edit({ params }) {
  const { projectID } = await params;
  const endpoint = process.env.BACKEND_URL + `/projectData/${projectID}`;

  const formValuesEndpoint = process.env.BACKEND_URL + `/formValues`;

  const projectData = await fetch(endpoint);
  const formValuesReq = await fetch(formValuesEndpoint);

  const result = await projectData.json();
  const formValues = await formValuesReq.json();

  const data = {
    projectName: result.projectName.nombre,
    projectSlug: result.projectName.slug,
    basicsData: result.basicsData,
    familiesData: result.familiesData,
    locationsData: result.locationsData,
    adminsData: result.adminsData,
    peopleData: result.peopleData,
  };
  return (
    <>
      <Form
        data={data}
        basicFormValues={formValues.basicFormValues}
        adminFormValues={formValues.adminFormValues}
        peopleFormValues={formValues.peopleFormValues}
        projectID={projectID}
      ></Form>
    </>
  );
}
